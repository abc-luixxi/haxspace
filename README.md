# Don't Use This Shit: Vibecoded HaxBall Space Client

An unofficial Electron client for [HaxBall](https://www.haxball.com/). This is
an archival/recovery project, not a cleanly designed application.

> **Seriously: don't use this shit as a production codebase.** It is heavily
> vibecoded, poorly structured, stateful, and tightly coupled. The UI, Electron
> process, HTTP bridge, and injected HaxBall extensions live in places they
> probably should not. It is published for inspection, local use, and further
> cleanup.

## What is included

- Electron launcher and HaxBall client code.
- Launcher UI, in-game Space UI, assets, and injected extensions.
- A local loopback bridge listening only on 127.0.0.1:5483.
- A local guest profile so the client can run without the original service.
- Empty backend/ and scripts/ directories, kept in the repository for future
  work.

HaxBall itself is loaded from https://www.haxball.com/play; an Internet
connection is still required to join or create rooms. Complete any HaxBall
CAPTCHA manually.

## What was removed

The original client called a private Baires-hosted backend. Its server source,
database, deployment configuration, and signing keys were not present in the
client and are not in this repository. The application has been changed to
avoid using that API: Discord login, Plus/accounts, social features, remote
presence, and automatic updates now have local/no-op replacements.

The updater is disabled. Groups, friends, search results, and messages are
empty local data. This lets the HaxBall client run, but does **not** recreate
the original online service.

## Run locally

Requirements: Windows, Node.js, and npm.

~~~powershell
npm install
npm start
~~~

To build a Windows installer:

~~~powershell
npm run dist
~~~

Build output is written to release/ and ignored by Git.

## Original Baires API (removed)

The following is the actual route surface observed in the original client. Its
configured base URL was https://api-spacehax.baires.host. This is **reference
documentation only**: the client in this repository does not call it, there is
no backend implementation here, and the endpoint may no longer be online.

Authenticated routes used Authorization: Bearer <api_token>.

### Authentication, presence, and updates

| Method | Route | Observed purpose |
| --- | --- | --- |
| POST | /auth/discord/token | Exchanges Discord OAuth code and redirect_uri. |
| GET | /auth/me | Reads the authenticated profile. |
| GET | /rpc/config | Gets Discord Rich Presence configuration. |
| POST | /presence | Updates user presence. |
| GET | /updates/manifest?platform=win32-x64&channel=stable | Gets a signed update manifest. |
| GET | /updates/artifacts/:platform/:version/:artifactName | Gets an update artifact. |

### Groups and messages

| Method | Route |
| --- | --- |
| GET, POST | /groups |
| GET | /groups/:groupId |
| POST | /groups/:groupId/members |
| DELETE | /groups/:groupId/members/:discordId |
| GET, POST | /groups/:groupId/messages |
| DELETE | /groups/:groupId/messages/:messageId |

### Friends and direct messages

| Method | Route |
| --- | --- |
| GET | /friends |
| GET, POST | /friends/requests |
| POST | /friends/requests/:discordId/accept |
| POST | /friends/requests/:discordId/decline |
| DELETE | /friends/:discordId |
| GET, POST | /friends/:discordId/messages |
| POST | /friends/:discordId/read |
| DELETE | /friends/:discordId/messages/:messageId |
| GET | /users/search?q=<text> |

The original update protocol expected Ed25519-signed manifests. Only the
public verification key was packaged in the client, so compatible update
publishing cannot be restored from this project alone.

## Local bridge API

The internal bridge binds to 127.0.0.1:5483; it is not a public web API.

| Method | Path | Local behavior |
| --- | --- | --- |
| GET | /status, /version | Health and client version. |
| GET | /user, /accounts, /auth/me | Local guest account. |
| GET | /auth, /logout | Local guest-session operations. |
| GET | /groups, /friends, /friends/requests | Empty local collections. |
| GET | /users/search?q=<query> | Empty local result. |
| GET | /star-diag, /star-validate | Game bridge diagnostics. |
| GET | /update/status, /update/check | Updates disabled. |

## Project layout

- app/ — Electron main process, preload bridge, HaxBall extension, UI, and
  assets.
- app/extensions/ — Browser scripts injected into HaxBall.
- app/ui/ — Launcher and in-game Space UI.
- backend/ — Intentionally empty; the original backend was not recovered.
- scripts/ — Intentionally empty; reserved for project tooling.

## License

No license has been selected yet.
