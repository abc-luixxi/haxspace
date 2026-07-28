# Atomic Windows apply script for HaxBall Space full-app updates.
# Args: -SourceDir <extracted> -TargetDir <install root> -ExeName "HaxBall Space.exe" -WaitPid <pid> [-BackupDir <path>]

param(
  [Parameter(Mandatory = $true)][string]$SourceDir,
  [Parameter(Mandatory = $true)][string]$TargetDir,
  [Parameter(Mandatory = $true)][string]$ExeName,
  [Parameter(Mandatory = $false)][int]$WaitPid = 0,
  [Parameter(Mandatory = $false)][string]$BackupDir = ""
)

$ErrorActionPreference = "Stop"
$log = Join-Path $env:TEMP ("space-update-apply-" + (Get-Date -Format "yyyyMMdd-HHmmss") + ".log")

function Write-Log([string]$msg) {
  $line = ("[{0}] {1}" -f (Get-Date -Format o), $msg)
  Add-Content -Path $log -Value $line
}

try {
  Write-Log "start source=$SourceDir target=$TargetDir pid=$WaitPid"
  if ($WaitPid -gt 0) {
    try {
      Wait-Process -Id $WaitPid -Timeout 120 -ErrorAction SilentlyContinue
    } catch {}
    Start-Sleep -Seconds 1
  }

  if (-not (Test-Path -LiteralPath $SourceDir)) { throw "Source missing" }
  if (-not (Test-Path -LiteralPath $TargetDir)) { throw "Target missing" }

  # Prefer nested root if ZIP contained a single top folder with the exe.
  $candidate = Get-ChildItem -LiteralPath $SourceDir -Filter $ExeName -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($candidate) {
    $SourceDir = $candidate.Directory.FullName
    Write-Log "resolved nested source=$SourceDir"
  }

  if ($BackupDir -and $BackupDir.Trim().Length -gt 0) {
    New-Item -ItemType Directory -Force -Path $BackupDir | Out-Null
    Write-Log "backup → $BackupDir"
    & robocopy $TargetDir $BackupDir /E /COPY:DAT /R:2 /W:1 /NFL /NDL /NJH /NJS | Out-Null
  }

  Write-Log "robocopy MIR"
  & robocopy $SourceDir $TargetDir /MIR /COPY:DAT /R:25 /W:5 /NFL /NDL /NJH /NJS
  $rc = $LASTEXITCODE
  Write-Log "robocopy exit=$rc"
  if ($rc -ge 8) { throw "robocopy failed ($rc)" }

  $pkg = Join-Path $TargetDir "resources\app\package.json"
  $asar = Join-Path $TargetDir "resources\app.asar"
  if (-not (Test-Path -LiteralPath $pkg) -and -not (Test-Path -LiteralPath $asar)) {
    throw "critical package missing after copy"
  }

  $exe = Join-Path $TargetDir $ExeName
  if (-not (Test-Path -LiteralPath $exe)) { throw "exe missing after copy" }

  Write-Log "launch $exe"
  Start-Process -FilePath $exe -WorkingDirectory $TargetDir
  Write-Log "done"
  exit 0
}
catch {
  Write-Log ("ERROR " + $_.Exception.Message)
  if ($BackupDir -and (Test-Path -LiteralPath $BackupDir)) {
    Write-Log "rollback from backup"
    try {
      & robocopy $BackupDir $TargetDir /MIR /COPY:DAT /R:10 /W:2 /NFL /NDL /NJH /NJS | Out-Null
    } catch {}
  }
  exit 1
}
