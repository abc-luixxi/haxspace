"use strict";

/**
 * Space prelauncher — Discord gate + play hub.
 * zEro-style shell + in-menu Three.js panorama background.
 */
function escapeHtml(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function avatarLetter(nick) {
  var n = String(nick || "?").trim();
  return escapeHtml((n.charAt(0) || "?").toUpperCase());
}

function renderLauncherPage(opts) {
  opts = opts || {};
  var ver = escapeHtml(String(opts.version || "0.0.0"));
  var port = String(opts.port || 5483);
  var base = "http://127.0.0.1:" + port;
  var brand = escapeHtml(String(opts.brand || "Space"));
  var logoUrl = escapeHtml(
    String(opts.logoUrl || base + "/ui/logos/starpng.png"),
  );
  var loginArtUrl = escapeHtml(
    String(opts.loginArtUrl || base + "/ui/login-art.png"),
  );
  var playBgUrl = escapeHtml(
    String(opts.playBgUrl || base + "/launcher-bg.png"),
  );
  var loginArtFallback = escapeHtml(
    String(opts.loginArtFallback || base + "/launcher-bg.png"),
  );
  var user = opts.user && opts.user.logged_in ? opts.user : null;
  var loggedIn = !!user;
  var displayName = escapeHtml(
    String((user && (user.nick || user.username)) || "Player"),
  );
  var avatarUrl = "";
  if (user && user.avatar) {
    avatarUrl =
      String(user.avatar).indexOf("http") === 0
        ? String(user.avatar)
        : "https://cdn.discordapp.com/avatars/" +
          String(user.discord_id || "") +
          "/" +
          String(user.avatar) +
          ".png";
  }
  var avatarUrlEsc = escapeHtml(avatarUrl);
  var bootJson = JSON.stringify({
    loggedIn: loggedIn,
    userId: user && user.discord_id ? String(user.discord_id) : "",
    nick:
      user && (user.nick || user.username)
        ? String(user.nick || user.username)
        : "",
    username: user && user.username ? String(user.username) : "",
    avatar: user && user.avatar ? String(user.avatar) : "",
    isPlus: !!(user && user.is_plus),
  }).replace(/</g, "\\u003c");
  var profileAvHtml = avatarUrl
    ? '<img class="hub-av" src="' + avatarUrlEsc + '" alt=""/>'
    : '<span class="hub-av hub-av-letter">' +
      avatarLetter(displayName) +
      "</span>";
  var profileAvPopHtml = avatarUrl
    ? '<img class="hub-profile-pop-av-img" src="' + avatarUrlEsc + '" alt=""/>'
    : '<span class="hub-profile-pop-av-img hub-av-letter">' +
      avatarLetter(displayName) +
      "</span>";

  var mainHtml = loggedIn
    ? `<div class="riot-hub">
  <aside class="riot-rail" aria-label="Navigation">
    <div class="riot-rail-head">
      <div class="riot-rail-logo" title="${brand}">
        <img src="${logoUrl}" alt="${brand}"/>
      </div>
    </div>
    <div class="riot-rail-mid">
      <nav class="riot-rail-nav" aria-label="Main">
        <button type="button" class="riot-rail-btn is-active" id="hub-nav-play" data-hub-view="play" data-tip="Inicio" aria-label="Inicio">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z"/></svg>
        </button>
        <button type="button" class="riot-rail-btn" id="hub-nav-library" data-tip="Biblioteca" aria-label="Biblioteca">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z"/></svg>
        </button>
        <button type="button" class="riot-rail-btn" id="hub-nav-friends" data-tip="Amigos" aria-label="Amigos">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
        </button>
      </nav>
    </div>
    <button type="button" class="riot-rail-btn riot-rail-settings" id="hxd-launch-settings" data-tip="Ajustes" aria-label="Ajustes">
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3"/>
        <path d="M2 14h4M10 8h4M18 16h4"/>
      </svg>
    </button>
  </aside>
  <div class="riot-body">
    <main class="riot-main">
      <div id="hub-view-play" class="hx-view is-active riot-home">
        <section class="riot-home-stage" aria-label="Inicio">
          <h1 class="riot-home-title">Inicio</h1>
          <div class="riot-home-hero">
            <img class="riot-home-hero-logo" src="${logoUrl}" alt=""/>
            <h2 class="riot-home-hero-title">HaxBall Space</h2>
            <p class="riot-home-hero-lead">El client no oficial de HaxBall que deja atrás todo lo demás. Inspirado en Lunar Client. Optimizado para Windows 64-bit. Hecho para los que juegan en serio.</p>
            <button type="button" class="riot-home-cta" id="hub-home-open-space">
              <span class="riot-home-cta-body">Abrir HaxBall Space</span>
            </button>
          </div>
        </section>
        <div class="riot-home-panel">
          <section class="riot-home-new" aria-label="Lo nuevo">
            <h2 class="riot-home-new-title">Lo nuevo</h2>
            <div class="riot-home-feed">
              <article class="riot-feed-card">
                <div class="riot-feed-media" style="background-image:url('${base}/ui/assets/home/home-perf.jpg')">
                  <span class="riot-feed-logo"><img src="${logoUrl}" alt=""/></span>
                  <span class="riot-feed-chip">RENDIMIENTO</span>
                </div>
                <h3 class="riot-feed-title">Rendimiento real</h3>
                <p class="riot-feed-desc">FPS desbloqueados, cero ads y foco total en la cancha. Mientras otros copian, nosotros construimos.</p>
              </article>
              <article class="riot-feed-card">
                <div class="riot-feed-media" style="background-image:url('${base}/ui/assets/home/home-control.jpg')">
                  <span class="riot-feed-logo"><img src="${logoUrl}" alt=""/></span>
                  <span class="riot-feed-chip">CONTROL</span>
                </div>
                <h3 class="riot-feed-title">Control total</h3>
                <p class="riot-feed-desc">Salas pineadas, favoritas y una config única. Todo listo para entrar y jugar en serio.</p>
              </article>
              <article class="riot-feed-card">
                <div class="riot-feed-media" style="background-image:url('${base}/ui/assets/home/home-identity.jpg')">
                  <span class="riot-feed-logo"><img src="${logoUrl}" alt=""/></span>
                  <span class="riot-feed-chip">IDENTIDAD</span>
                </div>
                <h3 class="riot-feed-title">Identidad Space</h3>
                <p class="riot-feed-desc">Skins, /gif, keystrokes y mods visuales para que se note que jugás en Space.</p>
              </article>
              <article class="riot-feed-card">
                <div class="riot-feed-media" style="background-image:url('${base}/ui/assets/home/home-plus.jpg')">
                  <span class="riot-feed-logo"><img src="${logoUrl}" alt=""/></span>
                  <span class="riot-feed-chip">SPACE PLUS</span>
                </div>
                <h3 class="riot-feed-title">Dominio total</h3>
                <p class="riot-feed-desc">Mute, multi-idioma y Space Plus. Herramientas premium para los que van un paso más.</p>
              </article>
            </div>
          </section>
          <section class="riot-home-new" aria-label="Comunidad">
            <h2 class="riot-home-new-title">Comunidad</h2>
            <div class="riot-home-feed riot-home-feed--3">
              <article class="riot-feed-card riot-feed-card--link" data-open-url="https://discord.gg/spacehax" role="link" tabindex="0">
                <div class="riot-feed-media riot-feed-media--discord">
                  <span class="riot-feed-logo"><img src="${logoUrl}" alt=""/></span>
                  <span class="riot-feed-chip">DISCORD</span>
                </div>
                <h3 class="riot-feed-title">discord.gg/spacehax</h3>
                <p class="riot-feed-desc">Sumate al Discord oficial. Descargas, novedades y comunidad. Todavía estamos arrancando.</p>
              </article>
              <article class="riot-feed-card">
                <div class="riot-feed-media" style="background-image:url('${base}/ui/assets/home/home-official.jpg')">
                  <span class="riot-feed-logo"><img src="${logoUrl}" alt=""/></span>
                  <span class="riot-feed-chip">OFICIAL</span>
                </div>
                <h3 class="riot-feed-title">Solo versiones oficiales</h3>
                <p class="riot-feed-desc">Si querés ser parte de lo mejor: descargá, instalá y disfrutá. Solo builds oficiales.</p>
              </article>
              <article class="riot-feed-card">
                <div class="riot-feed-media" style="background-image:url('${base}/ui/assets/home/home-windows.jpg')">
                  <span class="riot-feed-logo"><img src="${logoUrl}" alt=""/></span>
                  <span class="riot-feed-chip">WINDOWS</span>
                </div>
                <h3 class="riot-feed-title">Hecho para Windows 64-bit</h3>
                <p class="riot-feed-desc">Inspirado en Lunar Client y pensado para jugadores que quieren el client al máximo.</p>
              </article>
            </div>
          </section>
        </div>
      </div>
      <div id="hub-view-space" class="hx-view riot-game" data-hero="resumen" hidden>
        <div class="riot-game-heroes" aria-hidden="true">
          <div class="riot-game-hero is-on" data-hero-bg="resumen" style="background-image:url('${base}/ui/assets/home/space-hero.jpg')"></div>
          <div class="riot-game-hero" data-hero-bg="notas" style="background-image:url('${base}/ui/assets/home/home-perf.jpg')"></div>
          <div class="riot-game-hero" data-hero-bg="comunidad" style="background-image:url('${base}/ui/assets/home/home-discord.jpg')"></div>
          <div class="riot-game-veil"></div>
        </div>
        <header class="riot-game-top">
          <nav class="riot-game-tabs" aria-label="HaxBall Space">
            <button type="button" class="riot-game-tab is-active" data-space-tab="resumen" aria-current="page">Resumen</button>
            <button type="button" class="riot-game-tab" data-space-tab="notas">Notas</button>
            <button type="button" class="riot-game-tab" data-space-tab="comunidad">Comunidad</button>
          </nav>
        </header>
        <section class="riot-game-stage" aria-label="HaxBall Space">
          <div class="riot-game-slide is-on" data-space-panel="resumen">
            <img class="riot-game-mark" src="${logoUrl}" alt=""/>
            <h1 class="riot-game-title">HaxBall Space</h1>
            <p class="riot-game-line">El client. Sin ads. Hecho para jugar en serio.</p>
            <button type="button" id="hxd-launch-primary" class="riot-game-play">
              <span class="hxd-launch-primary-fill" id="hxd-launch-primary-fill"></span>
              <span class="riot-game-play-body"><span id="hxd-launch-primary-label">Jugar</span></span>
            </button>
          </div>
          <div class="riot-game-slide" data-space-panel="notas" hidden>
            <p class="riot-game-eye">Actualizaciones</p>
            <h1 class="riot-game-title">Notas</h1>
            <p class="riot-game-line">Mejoras de rendimiento y salas. Primero en Discord.</p>
            <button type="button" class="riot-game-ghost" data-open-url="https://discord.gg/spacehax">Ver en Discord</button>
          </div>
          <div class="riot-game-slide" data-space-panel="comunidad" hidden>
            <p class="riot-game-eye">discord.gg/spacehax</p>
            <h1 class="riot-game-title">Comunidad</h1>
            <p class="riot-game-line">Sumate. Descargas, novedades y gente en cancha.</p>
            <button type="button" class="riot-game-ghost" data-open-url="https://discord.gg/spacehax">Abrir Discord</button>
          </div>
          <p id="hxd-launch-status" class="hxd-launch-status riot-game-status" aria-live="polite"></p>
        </section>
      </div>
      <div id="hub-view-library" class="hx-view riot-library" hidden>
        <header class="riot-library-head">
          <h1 class="riot-library-title">Juegos</h1>
          <p class="riot-library-sub">Todos los juegos</p>
        </header>
        <div class="riot-library-grid">
          <button type="button" class="riot-library-tile" id="hub-library-space" title="HaxBall Space" aria-label="HaxBall Space">
            <span class="riot-library-cover" style="background-image:url('${base}/ui/assets/home/library-space.jpg')"></span>
            <span class="riot-library-meta">
              <span class="riot-library-ico"><img src="${base}/ui/assets/home/library-space-icon.png" alt=""/></span>
              <span class="riot-library-name">HaxBall Space</span>
            </span>
          </button>
          <div class="riot-library-tile is-disabled" title="Space Goal — próximamente" aria-disabled="true">
            <span class="riot-library-cover riot-library-cover--locked">
              <span class="riot-library-stripes" aria-hidden="true"></span>
              <span class="riot-library-q">?</span>
              <span class="riot-library-tape" aria-hidden="true"><span>LOCKED</span></span>
            </span>
            <span class="riot-library-meta">
              <span class="riot-library-ico riot-library-ico--locked">?</span>
              <span class="riot-library-name">Space Goal</span>
            </span>
          </div>
        </div>
      </div>
      <div id="hub-view-friends-hub" class="hx-view riot-library riot-friends-hub" hidden>
        <header class="riot-library-head">
          <h1 class="riot-library-title">Amigos</h1>
          <p class="riot-library-sub">Tu comunidad</p>
        </header>
        <div class="riot-friends-stats" aria-label="Resumen">
          <div class="riot-friends-stat">
            <span class="riot-friends-stat-val" id="hub-play-stat-friends">0</span>
            <span class="riot-friends-stat-lab">Amigos</span>
          </div>
          <div class="riot-friends-stat">
            <span class="riot-friends-stat-val" id="hub-play-stat-groups">0</span>
            <span class="riot-friends-stat-lab">Grupos</span>
          </div>
          <div class="riot-friends-stat">
            <span class="riot-friends-stat-val" id="hub-play-stat-req">0</span>
            <span class="riot-friends-stat-lab">Solicitudes</span>
          </div>
          <button type="button" class="riot-friends-open-social" id="hub-play-open-friends">Abrir social</button>
        </div>
        <div class="riot-friends-empty" id="hub-play-friends-empty" hidden>
          <p class="riot-friends-empty-title">Sin amigos todavía</p>
          <p class="riot-friends-empty-sub">Buscá gente desde el panel social a la derecha.</p>
        </div>
        <div class="riot-friends-grid" id="hub-play-friends-list" hidden aria-label="Friends"></div>
      </div>
      <div id="hub-view-settings" class="hx-view riot-library riot-settings" hidden>
        <header class="riot-library-head">
          <h1 class="riot-library-title">Ajustes</h1>
          <p class="riot-library-sub">Perfil, cuentas y almacenamiento</p>
        </header>
        <nav class="riot-settings-tabs" aria-label="Secciones">
          <button type="button" class="riot-settings-tab is-active" data-settings-tab="profile" aria-current="page">Perfil</button>
          <button type="button" class="riot-settings-tab" data-settings-tab="accounts">Cuentas</button>
          <button type="button" class="riot-settings-tab" data-settings-tab="client">Almacenamiento</button>
        </nav>
        <div class="riot-settings-body">
          <div class="riot-settings-main">
            <div id="hub-settings-panel-profile" class="hub-settings-panel is-active">
              <div class="riot-set-colors">
                <section class="riot-set-block">
                  <p class="riot-set-label">Color del banner</p>
                  <div class="riot-swatch-row" id="hxd-pref-banner-swatches" role="group" aria-label="Banner color"></div>
                </section>
                <section class="riot-set-block">
                  <p class="riot-set-label">Color de perfil</p>
                  <div class="riot-swatch-row" id="hxd-pref-accent-swatches" role="group" aria-label="Profile color"></div>
                </section>
              </div>
              <section class="riot-set-block">
                <p class="riot-set-label">Estilo del banner</p>
                <div class="hub-banner-styles" id="hxd-pref-banner-styles" role="group" aria-label="Banner style">
                  <button type="button" class="hub-banner-style is-active" data-banner-style="solid" aria-pressed="true">
                    <span class="hub-banner-style-preview is-banner-solid" aria-hidden="true"></span>
                    <span class="hub-banner-style-label">Sólido</span>
                  </button>
                  <button type="button" class="hub-banner-style" data-banner-style="dots" aria-pressed="false">
                    <span class="hub-banner-style-preview is-banner-dots" aria-hidden="true"></span>
                    <span class="hub-banner-style-label">Puntos</span>
                  </button>
                  <button type="button" class="hub-banner-style" data-banner-style="stars" aria-pressed="false">
                    <span class="hub-banner-style-preview is-banner-stars" aria-hidden="true"></span>
                    <span class="hub-banner-style-label">Estrellas</span>
                  </button>
                  <button type="button" class="hub-banner-style" data-banner-style="space" aria-pressed="false">
                    <span class="hub-banner-style-preview is-banner-space" aria-hidden="true"></span>
                    <span class="hub-banner-style-label">Space</span>
                  </button>
                  <button type="button" class="hub-banner-style" data-banner-style="grid" aria-pressed="false">
                    <span class="hub-banner-style-preview is-banner-grid" aria-hidden="true"></span>
                    <span class="hub-banner-style-label">Grilla</span>
                  </button>
                </div>
              </section>
              <section class="riot-set-block">
                <p class="riot-set-label">País</p>
                <div class="hub-country-list" id="hxd-pref-country-list" role="group" aria-label="Country">
                  <button type="button" class="hub-country-opt is-active" data-country="br" aria-pressed="true"><span class="hub-flag-dot is-flag-br" aria-hidden="true"></span><span>Brasil</span></button>
                  <button type="button" class="hub-country-opt" data-country="ar" aria-pressed="false"><span class="hub-flag-dot is-flag-ar" aria-hidden="true"></span><span>Argentina</span></button>
                  <button type="button" class="hub-country-opt" data-country="uy" aria-pressed="false"><span class="hub-flag-dot is-flag-uy" aria-hidden="true"></span><span>Uruguay</span></button>
                  <button type="button" class="hub-country-opt" data-country="cl" aria-pressed="false"><span class="hub-flag-dot is-flag-cl" aria-hidden="true"></span><span>Chile</span></button>
                  <button type="button" class="hub-country-opt" data-country="mx" aria-pressed="false"><span class="hub-flag-dot is-flag-mx" aria-hidden="true"></span><span>México</span></button>
                  <button type="button" class="hub-country-opt" data-country="es" aria-pressed="false"><span class="hub-flag-dot is-flag-es" aria-hidden="true"></span><span>España</span></button>
                  <button type="button" class="hub-country-opt" data-country="pt" aria-pressed="false"><span class="hub-flag-dot is-flag-pt" aria-hidden="true"></span><span>Portugal</span></button>
                  <button type="button" class="hub-country-opt" data-country="us" aria-pressed="false"><span class="hub-flag-dot is-flag-us" aria-hidden="true"></span><span>USA</span></button>
                </div>
              </section>
            </div>
            <div id="hub-settings-panel-accounts" class="hub-settings-panel" hidden>
              <section class="riot-set-block">
                <p class="riot-set-label">Cuentas guardadas</p>
                <p class="riot-set-hint">Cambiá al instante sin volver a iniciar sesión.</p>
                <ul class="hx-accounts-list" id="hub-accounts-list" aria-label="Saved accounts"></ul>
                <button type="button" id="hxd-accounts-add" class="riot-set-tile">
                  <span class="riot-set-tile-title">Agregar cuenta Discord</span>
                  <span class="riot-set-tile-sub">Vinculá otra cuenta</span>
                </button>
              </section>
            </div>
            <div id="hub-settings-panel-client" class="hub-settings-panel" hidden>
              <section class="riot-set-block">
                <p class="riot-set-label">Archivos locales</p>
                <div class="riot-set-tiles">
                  <button type="button" data-launch-action="cache" class="riot-set-tile">
                    <span class="riot-set-tile-title">Limpiar caché</span>
                    <span class="riot-set-tile-sub">Borra datos temporales del client</span>
                  </button>
                  <button type="button" data-launch-action="folder" class="riot-set-tile">
                    <span class="riot-set-tile-title">Abrir carpeta</span>
                    <span class="riot-set-tile-sub">Archivos de Space en el disco</span>
                  </button>
                </div>
              </section>
            </div>
            <p id="hxd-settings-status" class="status hub-settings-status" aria-live="polite"></p>
          </div>
          <aside class="riot-settings-preview" aria-label="Vista previa">
            <p class="riot-set-label">Vista previa</p>
            <div class="hub-settings-preview-card">
              <div class="hub-settings-preview-banner hub-profile-pop-banner" id="hxd-settings-preview-banner"></div>
              <div class="hub-settings-preview-body">
                <div class="hub-settings-preview-av">${profileAvPopHtml}</div>
                <p class="hub-settings-preview-name">${displayName}${user && user.is_plus ? ' <span class="hx-plus-badge">PLUS</span>' : ""}</p>
                <button type="button" id="hxd-settings-preview-open" class="hub-settings-preview-btn">Ver perfil</button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
    <div id="hub-view-friends" class="hx-view riot-chat-float" hidden>
      <section class="riot-chat-board hx-dc-chat" aria-label="Chat">
        <div id="hub-chat-empty" class="hx-dc-chat-empty" hidden>
          <p class="hx-dc-chat-empty-title">Ningún chat seleccionado</p>
          <p class="hx-dc-chat-empty-sub">Elegí un amigo de la lista.</p>
        </div>
        <div id="hub-chat-active" class="hx-dc-chat-active" hidden>
          <header class="hx-dc-chat-head riot-chat-head">
            <button type="button" class="hx-dc-chat-peer" id="hub-chat-peer" title="Ver perfil" aria-label="Ver perfil">
              <div class="hx-dc-chat-peer-copy">
                <p class="hx-dc-chat-name" id="hub-chat-name">Friend</p>
                <p class="hx-dc-chat-sub" id="hub-chat-sub">Desconectado</p>
              </div>
            </button>
            <div class="riot-chat-head-actions">
              <button type="button" class="riot-chat-icon-btn" id="hub-chat-more" title="Más" aria-label="Más" aria-haspopup="true">⋯</button>
              <button type="button" class="riot-chat-icon-btn" id="hub-chat-close" title="Cerrar" aria-label="Cerrar">×</button>
            </div>
            <button type="button" class="hx-dc-icon-btn is-danger" id="hub-chat-remove" data-friends-action="remove" title="Eliminar amigo" aria-label="Eliminar amigo" hidden>Eliminar</button>
            <span class="hx-dc-chat-av" id="hub-chat-av" hidden></span>
          </header>
          <div class="hx-dc-pin" id="hub-chat-pin" hidden>
            <div class="hx-dc-pin-copy">
              <span class="hx-dc-pin-label">Pinned</span>
              <p class="hx-dc-pin-text" id="hub-chat-pin-text"></p>
            </div>
            <button type="button" class="hx-dc-pin-clear" id="hub-chat-pin-clear" title="Unpin" aria-label="Unpin">×</button>
          </div>
          <div class="hx-dc-messages riot-chat-messages" id="hub-chat-messages" aria-live="polite"></div>
          <p class="riot-chat-hint" id="hub-chat-hint">El historial del chat se guarda durante 30 días. Recordá que el personal oficial nunca te pedirá tu contraseña.</p>
          <form class="hx-dc-composer riot-chat-composer" id="hub-chat-form">
            <span class="hx-dc-composer-av" id="hub-chat-me-av" aria-hidden="true" hidden></span>
            <input type="text" id="hub-chat-input" class="hx-dc-input" placeholder="Enviar un mensaje" maxlength="1000" autocomplete="off" spellcheck="true"/>
            <button type="submit" class="hx-dc-send" id="hub-chat-send" title="Enviar" aria-label="Enviar">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.4 20.6 21 12 3.4 3.4l2.7 7.4L15 12l-8.9 1.2z"/></svg>
            </button>
          </form>
        </div>
      </section>
    </div>
    <div id="hub-friend-hover" class="riot-friend-card" hidden aria-hidden="true">
      <div class="riot-friend-card-top">
        <div class="riot-friend-card-av" id="hub-friend-hover-av"></div>
        <div class="riot-friend-card-id">
          <p class="riot-friend-card-name" id="hub-friend-hover-name">Friend</p>
          <p class="riot-friend-card-tag" id="hub-friend-hover-tag">#user</p>
        </div>
      </div>
      <div class="riot-friend-card-game">
        <span class="riot-friend-card-game-mark">SPACE</span>
        <span class="riot-friend-card-game-name">HAXBALL</span>
      </div>
      <p class="riot-friend-card-status" id="hub-friend-hover-status">
        <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M8 21h8M12 17v4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
        <span id="hub-friend-hover-status-text">Desconectado</span>
      </p>
      <div class="riot-friend-card-note">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" d="M4 20l4.5-1.2L19 8.3a2 2 0 0 0-2.8-2.8L5.7 16.5 4 20z"/></svg>
        <span>Nota de amistad</span>
      </div>
    </div>
    <aside class="riot-social" id="hub-riot-social" aria-label="Social">
      <div class="riot-social-profile">
        <div class="riot-social-user-row">
          <button type="button" class="riot-social-av-btn" id="hxd-profile-trigger" aria-expanded="false" aria-haspopup="dialog" aria-controls="hxd-profile-popover" title="Ver perfil" aria-label="Ver perfil">
            <span class="riot-social-av-wrap">
              ${profileAvHtml}
              <span class="riot-social-av-dot is-online" aria-hidden="true"></span>
            </span>
            <span class="riot-social-user-copy">
              <span class="riot-social-user-name">${displayName}</span>
              <span class="riot-social-user-status"><span class="hub-status-dot"></span>En línea</span>
            </span>
          </button>
          <button type="button" id="hub-social-collapse" class="riot-social-profile-btn" title="Minimizar" aria-label="Minimizar">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M10 7V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-2M15 12H3m0 0 3.5-3.5M3 12l3.5 3.5"/></svg>
          </button>
        </div>
        <div class="hx-profile-wrap" style="position:static">
          <div id="hxd-profile-popover" class="hub-profile-pop hx-profile-pop riot-social-pop" role="dialog" aria-hidden="true" aria-label="Profile">
            <button type="button" id="hxd-profile-pop-open" class="hub-profile-pop-inner">
              <div class="hub-profile-pop-banner" id="hxd-profile-pop-banner"></div>
              <div class="hub-profile-pop-body">
                <div class="hub-profile-pop-av" id="hxd-profile-pop-av">${profileAvPopHtml}</div>
                <p class="hub-profile-pop-name">${displayName}${user && user.is_plus ? ' <span class="hx-plus-badge">PLUS</span>' : ""}</p>
                <p class="hub-profile-pop-hint">Ver perfil</p>
              </div>
            </button>
            <div class="hub-profile-pop-actions">
              <button type="button" id="hxd-launch-logout" class="hxd-toplink">Cerrar sesión</button>
              <button type="button" id="hxd-launch-quit" class="hxd-toplink">Salir</button>
            </div>
          </div>
        </div>
      </div>
      <div class="riot-social-body">
      <div class="riot-social-tabs" id="hub-friends-tabs" role="tablist" aria-label="Social tabs">
        <span class="riot-social-tab-ink" id="hub-friends-tab-ink" aria-hidden="true"></span>
        <button type="button" class="riot-social-tab is-active" id="hub-friends-tab-list" data-friends-tab="list" title="Amigos" aria-label="Amigos" role="tab" aria-selected="true">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"/></svg>
        </button>
        <button type="button" class="riot-social-tab" id="hub-friends-tab-groups" data-friends-tab="groups" title="Grupos" aria-label="Grupos" role="tab" aria-selected="false">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/></svg>
          <span class="riot-social-tab-badge" id="hub-friends-groups-count" hidden>0</span>
        </button>
        <button type="button" class="riot-social-tab" id="hub-friends-tab-requests" data-friends-tab="requests" title="Solicitudes" aria-label="Solicitudes" role="tab" aria-selected="false">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          <span class="riot-social-tab-badge" id="hub-friends-req-count" hidden>0</span>
        </button>
      </div>
      <div class="riot-social-search">
        <div class="riot-social-search-inner">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M16.2 16.2 20 20"/></svg>
          <input type="text" class="hx-search" id="hub-friends-search" placeholder="Buscar" autocomplete="off" spellcheck="false"/>
        </div>
        <button type="button" class="riot-social-add" id="hub-friends-add" title="Crear grupo" aria-label="Crear grupo">+</button>
        <p id="hub-friends-status" class="hx-friends-status" aria-live="polite"></p>
      </div>
      <div id="hub-friends-panel-list" class="hx-friends-panel is-active hx-dc-scroll riot-social-list">
        <p class="hx-friends-section-label" id="hub-friends-count-label">Desconectado</p>
        <div class="hx-empty" id="hub-friends-empty">
          <p class="hx-empty-title">Sin amigos</p>
          <p class="hx-empty-sub">Buscá usuarios para agregar.</p>
        </div>
        <ul class="hx-friend-list" id="hub-friends-list" hidden aria-label="Friends list"></ul>
        <ul class="hx-friend-list hx-friend-search-list" id="hub-friends-search-list" hidden aria-label="Search results"></ul>
      </div>
      <div id="hub-friends-panel-groups" class="hx-friends-panel hx-dc-scroll riot-social-list" hidden>
        <div class="hx-empty" id="hub-friends-groups-empty">
          <p class="hx-empty-title">Sin grupos</p>
          <p class="hx-empty-sub">Creá uno con +.</p>
        </div>
        <ul class="hx-friend-list" id="hub-friends-groups-list" hidden aria-label="Groups list"></ul>
      </div>
      <div id="hub-friends-panel-requests" class="hx-friends-panel hx-dc-scroll riot-social-list" hidden>
        <div class="hx-empty" id="hub-friends-requests-empty">
          <p class="hx-empty-title">Sin solicitudes</p>
          <p class="hx-empty-sub">Aparecen acá.</p>
        </div>
        <div id="hub-friends-requests-body" hidden>
          <p class="hx-friends-section-label">Entrantes</p>
          <ul class="hx-friend-list" id="hub-friends-incoming" aria-label="Incoming requests"></ul>
          <p class="hx-friends-section-label">Salientes</p>
          <ul class="hx-friend-list" id="hub-friends-outgoing" aria-label="Outgoing requests"></ul>
        </div>
      </div>
      </div>
    </aside>
    <div class="riot-social-mini" id="hub-social-mini" hidden>
      <button type="button" class="riot-social-mini-av" id="hub-social-mini-profile" title="Ver perfil" aria-label="Ver perfil">
        ${profileAvHtml}
        <span class="riot-social-av-dot is-online" aria-hidden="true"></span>
      </button>
      <button type="button" class="riot-social-mini-expand" id="hub-social-expand" title="Abrir social" aria-label="Abrir social">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M20 4v16M14 12H4m0 0 3.5-3.5M4 12l3.5 3.5"/></svg>
      </button>
    </div>
  </div>
  <div class="hxd-dock is-hidden" id="hub-nav-links" data-active="play" hidden aria-hidden="true">
    <span id="hub-friends-pill" hidden>0</span>
  </div>
</div>`
    : `<div class="riot-gate">
  <div class="riot-art" aria-hidden="true" style="background-image:url('${loginArtUrl}'),url('${loginArtFallback}')"></div>
  <aside class="riot-panel">
    <button type="button" id="hxd-launch-quit" class="riot-exit" title="Salir" aria-label="Salir">×</button>
    <div class="riot-panel-inner">
      <div class="sg-body">
        <p class="sg-kicker">HaxBall</p>
        <h1 class="sg-brand">${brand}</h1>
        <p class="sg-lead">Conectá Discord para entrar al client.</p>
        <button type="button" id="hxd-launch-discord" class="sg-cta">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.3 4.6A19 19 0 0 0 12 2.5a19 19 0 0 0-8.3 2.1C2 9.8 1.6 13.5 1.9 17.1c.8.6 1.8 1.1 2.8 1.4l.6-1c-.3-.1-.7-.3-1-.5.1 0 .1 0 .2.1 2.4 1.1 4.9 1.7 7.5 1.7s5.1-.6 7.5-1.7c.1 0 .1 0 .2-.1-.3.2-.7.4-1 .5l.6 1c1-.3 2-.8 2.8-1.4.4-3.6-.1-7.3-1.8-12.5zM8.9 14.6c-.8 0-1.5-.7-1.5-1.6s.7-1.6 1.5-1.6 1.5.7 1.5 1.6-.7 1.6-1.5 1.6zm6.2 0c-.8 0-1.5-.7-1.5-1.6s.7-1.6 1.5-1.6 1.5.7 1.5 1.6-.7 1.6-1.5 1.6z"/></svg>
          <span id="hxd-launch-discord-label">Continuar con Discord</span>
        </button>
        <button type="button" id="hxd-launch-discord-go" hidden aria-hidden="true"></button>
        <p id="hxd-launch-status" class="riot-status" aria-live="polite"></p>
      </div>
      <div class="sg-foot">
        <span>v${ver}</span>
        <span>Space Client</span>
      </div>
    </div>
  </aside>
</div>`;

  var profileSheetHtml = loggedIn
    ? `<div id="hxd-profile-sheet" class="profile-sheet" aria-hidden="true" role="dialog" aria-label="Profile">
  <div class="profile-sheet-card">
    <div class="profile-sheet-banner" id="hxd-profile-sheet-banner">
      <button type="button" id="hxd-profile-sheet-close" class="profile-sheet-close" aria-label="Close">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
      </button>
    </div>
    <div class="profile-sheet-body">
      <div class="profile-sheet-av" id="hxd-profile-sheet-av">${profileAvPopHtml}</div>
      <h2 class="profile-sheet-name" id="hxd-profile-sheet-name">${displayName}${user && user.is_plus ? ' <span class="hx-plus-badge">PLUS</span>' : ""}</h2>
      <p class="profile-sheet-meta">
        <span class="profile-sheet-status" id="hxd-profile-sheet-status"><span class="hub-status-dot"></span>Online</span>
        <span class="profile-sheet-meta-sep" id="hxd-profile-sheet-meta-sep" aria-hidden="true"></span>
        <span class="profile-sheet-country" id="hxd-profile-sheet-country"><span class="profile-sheet-flag is-flag-br" id="hxd-profile-sheet-flag" aria-hidden="true"></span><span id="hxd-profile-sheet-country-name">Brasil</span></span>
      </p>
      <div class="profile-sheet-stats" aria-label="Statistics">
        <div class="profile-sheet-stat">
          <span class="profile-sheet-stat-val" id="hxd-profile-stat-matches">150</span>
          <span class="profile-sheet-stat-label">Partidos</span>
        </div>
        <div class="profile-sheet-stat">
          <span class="profile-sheet-stat-val" id="hxd-profile-stat-goals">90</span>
          <span class="profile-sheet-stat-label">Goles</span>
        </div>
        <div class="profile-sheet-stat">
          <span class="profile-sheet-stat-val" id="hxd-profile-stat-time">142h</span>
          <span class="profile-sheet-stat-label">Tiempo jugado</span>
        </div>
      </div>
    </div>
  </div>
</div>`
    : "";

  var settingsSheetHtml = "";

  var groupModalHtml = loggedIn
    ? `<div id="hub-group-modal" class="hx-group-modal" aria-hidden="true" role="dialog" aria-label="Create group">
  <div class="hx-group-modal-card">
    <header class="hx-group-modal-head">
      <div>
        <p class="hx-group-modal-kicker">Friends</p>
        <h2 class="hx-group-modal-title">Create group</h2>
      </div>
      <button type="button" class="hx-group-modal-close" id="hub-group-modal-close" aria-label="Close">×</button>
    </header>
    <form id="hub-group-form" class="hx-group-form">
      <label class="hx-group-field">
        <span>Name</span>
        <input type="text" id="hub-group-name" maxlength="80" placeholder="Group name" autocomplete="off" spellcheck="false" required/>
      </label>
      <div class="hx-group-field">
        <div class="hx-group-members-head">
          <span>Members</span>
          <span id="hub-group-limit" class="hx-group-limit">0 / 4</span>
        </div>
        <p class="hx-group-hint" id="hub-group-hint">Hasta 4 miembros</p>
        <ul class="hx-group-friend-picks" id="hub-group-friend-picks" aria-label="Select friends"></ul>
      </div>
      <p id="hub-group-status" class="hx-friends-status" aria-live="polite"></p>
      <div class="hx-group-actions">
        <button type="button" class="hx-group-cancel" id="hub-group-cancel">Cancel</button>
        <button type="submit" class="hx-group-submit" id="hub-group-submit">Create</button>
      </div>
    </form>
  </div>
</div>`
    : "";

  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${brand}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet">
<style>
:root{
  --ink:#f7f7f5;
  --ink2:#d4d4d0;
  --muted:#9a9a94;
  --line:rgba(255,255,255,.1);
  --bg:#060b14;
  --panel:#0c121c;
  --panel-2:#121a28;
  --text:#f7f7f5;
  --text-2:#b8b8b2;
  --text-3:#6e6e68;
  --hover:rgba(255,255,255,.04);
  --active:rgba(255,255,255,.07);
  --ok:#9dcea8;
  --err:#e8a0a0;
  --online:#7ecf8f;
  --green:#7ecf8f;
  --ink-soft:var(--ink2);
  --mute:var(--muted);
  --mute-2:var(--text-3);
  --paper:var(--bg);
  --surface:var(--panel);
  --accent:#f7f7f5;
  --accent-ink:#0a0a0a;
  --d:"Plus Jakarta Sans",system-ui,sans-serif;
  --b:"Plus Jakarta Sans",system-ui,Segoe UI,sans-serif;
  --t:var(--text);
  --m:var(--text-2);
  --dc-sidebar:rgba(0,0,0,.4);
  --dc-panel:var(--bg);
  --dc-profile:var(--panel);
  --dc-hover:var(--hover);
  --dc-elevated:var(--panel-2);
  --dc-text:var(--text);
  --dc-muted:var(--text-2);
  --dc-accent:#fff;
  --dc-accent-hover:#fff;
  --dc-online:var(--online);
  --sidebar-open:280px;
  --profile-banner:#161614;
  --profile-accent:#222220;
  --profile-accent-text:#f7f7f5;
  --profile-sheet-bg:var(--panel);
  --profile-sheet-text:var(--text);
  --profile-sheet-muted:var(--text-2);
  --profile-sheet-divider:var(--line);
  --profile-sheet-border:var(--line);
  --profile-sheet-close-bg:var(--hover);
  --profile-sheet-close-color:var(--text-2);
  --profile-sheet-close-hover:var(--active);
  --bubble-mine:#f7f7f5;
  --bubble-theirs:#1c1c1a;
  --ease:cubic-bezier(.22,1,.36,1);
}
*{box-sizing:border-box;outline:none!important;-webkit-tap-highlight-color:transparent}
button,a,input,textarea,select{-webkit-app-region:no-drag}
html,body{margin:0;height:100%;overflow:hidden;user-select:none;-webkit-user-select:none}
body{font-family:var(--b);color:var(--ink);background:var(--bg);-webkit-font-smoothing:antialiased;-webkit-app-region:drag}
button,span,p,h1,h2,h3,div,label,nav,aside,header,main,footer{user-select:none;-webkit-user-select:none}
input,textarea,.hx-dc-input,.hx-search{
  user-select:text!important;-webkit-user-select:text!important;
  -webkit-app-region:no-drag;cursor:text
}
button:focus,button:focus-visible,a:focus,a:focus-visible,input:focus,input:focus-visible,*:focus,*:focus-visible{outline:none!important;box-shadow:none!important}
::selection{background:transparent;color:inherit}
input::selection,textarea::selection,.hx-dc-input::selection,.hx-search::selection{background:rgba(255,255,255,.18);color:#fff}
button{-webkit-appearance:none;appearance:none;font-family:inherit}
.scene{position:relative;height:100vh;min-height:100vh;overflow:hidden;background:#060b14}
.space-bg{position:absolute;inset:-40px;z-index:0;background:#060b14;filter:blur(10px) brightness(.9) contrast(1.05) saturate(1.1);transform:scale(1.08);pointer-events:none}
.space-bg canvas{display:block;width:100%!important;height:100%!important}
.space-veil{position:absolute;inset:0;z-index:1;background:rgba(8,24,48,.18);pointer-events:none}
.space-stars-cv,.space-glow{display:none!important}
.link{appearance:none;background:none;border:none;color:var(--muted);font:inherit;font-size:13px;font-weight:500;cursor:pointer;padding:0}
.link:hover{color:var(--ink)}
.status{margin:10px 0 0;min-height:18px;font-size:13px;color:var(--muted);text-align:left}
.status.ok{color:var(--ok)}
.status.err{color:var(--err)}

/* —— Clean cinematic shell —— */
.hxd-scene{position:relative;z-index:2;min-height:100vh;height:100%;display:flex;flex-direction:column;background:transparent;color:var(--ink);-webkit-app-region:no-drag}
.hxd-scene-bg{position:absolute;inset:0;overflow:hidden;pointer-events:none;background:
  radial-gradient(70% 55% at 78% 42%,rgba(56,140,220,.16),transparent 58%),
  radial-gradient(50% 40% at 18% 78%,rgba(90,180,255,.08),transparent 55%),
  linear-gradient(165deg,#050a12 0%,#0a1220 48%,#060b14 100%)}
.hxd-scene-bg::after{content:"";position:absolute;inset:0;z-index:1;pointer-events:none;background:
  linear-gradient(180deg,rgba(6,11,20,.55) 0%,rgba(6,11,20,.1) 40%,rgba(6,11,20,.5) 100%)}
.hxd-float-nav{display:none!important}
.hxd-dock{position:absolute;left:0;right:0;bottom:0;z-index:6;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:16px;padding:16px 28px 20px;-webkit-app-region:no-drag;transition:opacity .7s ease;pointer-events:none}
.hxd-dock-ver{justify-self:start;font-size:11px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:rgba(247,247,245,.28);pointer-events:none}
.hxd-dock-links{justify-self:center;display:flex;align-items:center;gap:4px;padding:5px;border-radius:999px;background:rgba(8,16,30,.55);border:1px solid rgba(120,180,255,.14);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);pointer-events:auto}
.hxd-dock-link{appearance:none;border:0;background:transparent;color:rgba(247,247,245,.4);font:inherit;font-size:13px;font-weight:500;height:36px;padding:0 16px;border-radius:999px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;letter-spacing:-.01em;transition:color .18s ease,background .18s ease}
.hxd-dock-link:hover{color:rgba(247,247,245,.85);background:rgba(255,255,255,.05)}
.hxd-dock-link.is-active{color:#0a0a0a;background:#f7f7f5;font-weight:600}
.hxd-dock-link.is-active .hx-nav-pill{background:rgba(10,10,10,.12);color:#0a0a0a}
.hx-nav-pill{min-width:16px;height:16px;padding:0 5px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;background:rgba(255,255,255,.08);font-size:10px;font-weight:600;color:rgba(247,247,245,.55)}
.hx-nav-pill.is-unread{background:rgba(232,160,160,.25);color:#f5c4c4}
.hxd-nav-ico,.hxd-float-links,.hxd-float-link{display:none!important}
.hxd-toplink{background:none;border:none;color:rgba(247,247,245,.42);font:inherit;font-size:12px;font-weight:500;cursor:pointer;padding:0;transition:color .15s ease}
.hxd-toplink:hover{color:#fff}
.hx-profile-wrap{position:relative}
.hxd-float-profile{position:absolute;top:18px;right:28px;z-index:5;transition:opacity .7s ease}
.hxd-chrome-av{appearance:none;border:0;background:transparent;padding:0;cursor:pointer;border-radius:50%;display:flex;line-height:0}
.hxd-chrome-av .hub-av{width:32px;height:32px;border-radius:50%;object-fit:cover;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:#fff;background:#222220;border:1px solid rgba(255,255,255,.12);transition:border-color .2s ease,transform .2s var(--ease)}
.hxd-chrome-av:hover .hub-av{border-color:rgba(255,255,255,.4);transform:scale(1.04)}
.hub-profile-pop-actions{display:flex;gap:14px;padding:0 12px 12px;border-top:1px solid var(--line);padding-top:10px;margin-top:2px}
.hxd-chrome-brand{display:flex;align-items:center;gap:10px;min-width:0}
.hxd-chrome-brand img{height:22px;width:auto;display:block;filter:brightness(0) invert(1);opacity:.95}
.hxd-chrome-brand span{font-family:var(--d);font-size:15px;font-weight:700;color:#fff;letter-spacing:-.03em}
.hxd-gate-top{position:relative;z-index:4;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:20px 28px;flex-shrink:0;-webkit-app-region:drag}
.hxd-gate-top > *{-webkit-app-region:no-drag}
.hx-nav-icon,.hx-nav-close{display:none}
.hx-top-title{display:none}

.hx-stage{position:relative;z-index:2;min-width:0;min-height:0;flex:1;display:flex;flex-direction:column}
.hx-main{position:relative;z-index:2;flex:1;min-height:0;display:flex;flex-direction:column;overflow:hidden}
.hx-view{display:none;flex:1;flex-direction:column;min-height:0}
.hx-view.is-active{display:flex}
.hx-view[hidden]{display:none!important}
#hub-view-space.is-active,
#hub-view-library.is-active,
#hub-view-friends-hub.is-active,
#hub-view-settings.is-active{display:flex;flex-direction:column;min-height:0;flex:1}
#hub-view-friends.is-active{display:flex;flex-direction:column;min-height:0}
.hxd-play-board{position:relative;flex:1;min-height:0;display:flex;flex-direction:column;overflow:hidden}
.hxd-play-bg{position:absolute;inset:0;z-index:0;background-position:62% 48%;background-size:cover;background-repeat:no-repeat;pointer-events:none;transform:scale(1.06);filter:saturate(.95) contrast(1.06) brightness(.74) hue-rotate(8deg);transition:transform 1.85s cubic-bezier(.22,.61,.36,1),filter 1.9s ease-in-out,opacity .6s ease;will-change:transform,filter}
.hxd-play-bg::before{content:"";position:absolute;inset:0;background:
  radial-gradient(ellipse 72% 58% at 74% 46%,rgba(120,190,255,.2) 0%,transparent 58%),
  radial-gradient(ellipse 50% 40% at 30% 70%,rgba(40,110,200,.14) 0%,transparent 60%);transition:opacity .9s ease}
.hxd-play-bg::after{content:"";position:absolute;inset:0;background:
  linear-gradient(90deg,rgba(5,12,24,.9) 0%,rgba(6,14,28,.52) 34%,rgba(8,20,40,.16) 60%,rgba(6,14,28,.38) 100%),
  linear-gradient(180deg,rgba(5,12,24,.62) 0%,rgba(6,14,28,.14) 36%,rgba(8,30,55,.22) 64%,rgba(4,10,20,.82) 100%);transition:opacity .9s ease}
.hxd-swallow-veil{position:fixed;inset:0;z-index:47;background:#050a12;opacity:0;visibility:hidden;pointer-events:none;transition:opacity 1.1s ease .75s,visibility 1.1s ease .75s}
body.is-swallowing .hxd-swallow-veil{opacity:1;visibility:visible;pointer-events:auto}
body.is-swallowing .hxd-dock,
body.is-swallowing .hxd-float-profile,
body.is-swallowing .riot-social,
body.is-swallowing .riot-rail,
body.is-swallowing .hxd-hero,
body.is-swallowing .hxd-glass-strip,
body.is-swallowing .space-bg,
body.is-swallowing .space-veil{opacity:0;pointer-events:none;transition:opacity .7s ease}
body.is-swallowing .hxd-play-bg{position:fixed;inset:-8%;z-index:46;transform:scale(3.2) translateY(8%);filter:saturate(.35) contrast(1.1) brightness(0.08) hue-rotate(8deg);background-position:50% 55%}
body.is-swallowing .hxd-play-bg::before,
body.is-swallowing .hxd-play-bg::after{opacity:0}
body.is-swallowing .hxd-launch-overlay{background:#050a12;backdrop-filter:none;-webkit-backdrop-filter:none}

.hxd-hero{position:relative;z-index:2;flex:1;min-height:0;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;text-align:left;padding:56px 40px 110px;width:100%;max-width:720px;transition:opacity .7s ease}
.hxd-hero--home{transform:none}
.hxd-hero--gate{transform:none;max-width:440px;margin:0;align-items:flex-start;text-align:left;justify-content:center;padding:64px 36px}
.hxd-status-pill{display:inline-flex;align-items:center;gap:8px;margin:0 0 22px;padding:7px 12px;border-radius:999px;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:rgba(220,235,255,.82);background:rgba(10,20,36,.5);border:1px solid rgba(120,180,255,.18);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);animation:hxdPlayIn .7s var(--ease) both}
.hxd-update-banner{position:fixed;left:50%;bottom:28px;transform:translateX(-50%);z-index:99999;width:min(520px,calc(100vw - 32px));margin:0;padding:16px 18px;border-radius:14px;background:rgba(8,16,28,.94);border:1px solid rgba(7,243,97,.45);box-shadow:0 16px 40px rgba(0,0,0,.55);display:flex;flex-direction:column;gap:10px}
.hxd-update-banner[hidden]{display:none!important}
.hxd-update-banner__text{display:flex;flex-direction:column;gap:4px}
.hxd-update-banner__text strong{font-size:14px;color:#fff}
.hxd-update-banner__text span{font-size:12px;color:rgba(255,255,255,.7)}
.hxd-update-banner__bar{height:8px;border-radius:999px;background:rgba(255,255,255,.1);overflow:hidden}
.hxd-update-banner__bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#07f361,#3d8bfd);transition:width .2s ease}
.hxd-update-banner__actions{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.hxd-update-banner__actions .riot-game-play{min-height:36px;padding:0 14px;font-size:12px}
.hxd-glass-card{padding:14px 16px;border-radius:16px;background:rgba(10,18,32,.48);border:1px solid rgba(120,180,255,.14);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);box-shadow:0 10px 30px rgba(0,10,30,.28)}
.hxd-btn-ghost{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 22px;border-radius:999px;font-size:14px;font-weight:600;color:rgba(220,235,255,.9);background:rgba(10,20,36,.4);border:1px solid rgba(120,180,255,.2);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
.hxd-btn-ghost:hover:not(:disabled){background:rgba(80,150,230,.12);border-color:rgba(150,200,255,.35);color:#fff}
.hxd-status-dot{width:7px;height:7px;border-radius:50%;background:#9dcea8;box-shadow:0 0 10px rgba(157,206,168,.65);flex-shrink:0}
.hxd-kicker{margin:0 0 16px;font-size:13px;font-weight:500;letter-spacing:.01em;color:rgba(247,247,245,.55);animation:hxdPlayIn .7s var(--ease) both}
.hxd-brand,.hxd-hero h1{margin:0 0 18px;font-family:var(--d);font-size:clamp(42px,5.8vw,72px);font-weight:800;line-height:.95;letter-spacing:-.04em;color:#fff;animation:hxdPlayIn .85s var(--ease) .08s both;text-shadow:0 18px 50px rgba(0,0,0,.5)}
.hxd-hero h1 span,.hxd-brand span{display:block}
.hxd-sub,.hxd-lead{margin:0 0 28px;font-size:15px;line-height:1.55;font-weight:400;color:rgba(247,247,245,.55);max-width:36ch;animation:hxdPlayIn .8s var(--ease) .14s both}
.hxd-hero--gate .hxd-sub{max-width:34ch}
.hxd-cta-stack{display:flex;flex-direction:column;align-items:flex-start;gap:10px;width:100%;animation:hxdPlayIn .85s var(--ease) .2s both}
.hxd-cta-row,.hxd-cta-row--home{display:flex;flex-direction:row;flex-wrap:wrap;align-items:center;gap:10px;width:100%;animation:hxdPlayIn .85s var(--ease) .2s both}
.hxd-hero--gate .hxd-cta-row{align-items:flex-start}
.hxd-cta-secondary{display:grid;grid-template-columns:1fr 1fr;gap:8px;width:100%;max-width:340px}
.hxd-btn{font-family:inherit;cursor:pointer;border:none;outline:none;transition:transform .18s var(--ease),background .2s ease,opacity .2s ease,border-color .2s ease,color .15s ease}
.hxd-btn:active:not(:disabled){transform:scale(.98)}
.hxd-btn:disabled{opacity:.5;cursor:not-allowed}
.hxd-btn-primary,.hxd-btn-orbit{position:relative;overflow:hidden;display:inline-flex;align-items:stretch;width:auto;min-width:0;min-height:48px;margin:0;padding:0;border-radius:999px;background:#f7f7f5;border:0;box-shadow:none}
.hxd-btn-primary:hover:not(:disabled),.hxd-btn-orbit:hover:not(:disabled){background:#fff;transform:translateY(-1px)}
.hxd-launch-primary-fill{position:absolute;left:0;top:0;bottom:0;width:0;max-width:100%;border-radius:999px;background:rgba(157,206,168,.28);transition:width .22s ease;z-index:0;pointer-events:none}
.hxd-launch-primary-body{position:relative;z-index:1;flex:1;display:flex;align-items:center;justify-content:center;gap:10px;padding:13px 26px 13px 28px;pointer-events:none}
.hxd-launch-primary-label{font-size:14px;font-weight:700;letter-spacing:.02em;text-transform:uppercase;color:#0a0a0a;text-align:center}
.hxd-btn-arrow{width:14px;height:14px;color:#0a0a0a;flex-shrink:0}
.hxd-btn-tool{display:flex;align-items:center;justify-content:center;gap:7px;min-height:44px;padding:10px 12px;border-radius:8px;font-size:13px;font-weight:500;color:var(--ink2);background:rgba(0,0,0,.4);border:1px solid var(--line)}
.hxd-btn-tool:hover:not(:disabled){color:#fff;background:rgba(255,255,255,.08)}
.hxd-tool-svg{width:15px;height:15px;flex-shrink:0;stroke:currentColor;fill:none;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;opacity:.9}
.hxd-launch-status{margin:14px 0 0;min-height:18px;font-size:13px;color:rgba(247,247,245,.45);line-height:1.4;text-align:left}
.hxd-launch-status.ok{color:var(--ok)}
.hxd-launch-status.err{color:var(--err)}
.hxd-glass-strip{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;width:min(100%,520px);margin-top:36px;animation:hxdPlayIn .9s var(--ease) .28s both}
.hxd-glass-label{display:block;margin:0 0 6px;font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:rgba(180,210,245,.45)}
.hxd-glass-value{display:block;font-size:15px;font-weight:650;letter-spacing:-.02em;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.hxd-quiet-foot{display:none!important}
.hxd-orbit-chrome,.hxd-orbit-foot,.hxd-orbit-status,.hxd-play-metrics,.hxd-metrics,.hxd-play-side{display:none!important}
@keyframes hxdPlayIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){
  .hxd-status-pill,.hxd-hero .hxd-kicker,.hxd-brand,.hxd-hero h1,.hxd-sub,.hxd-lead,.hxd-cta-stack,.hxd-cta-row,.hxd-glass-strip,.hx-view.is-active{animation:none!important;opacity:1;transform:none}
}

@media (max-width:860px){
  .hxd-dock{padding:14px 16px 18px;grid-template-columns:auto 1fr;gap:10px}
  .hxd-dock-ver{grid-column:1 / -1;justify-self:center;order:2;margin-top:2px}
  .hxd-dock-links{grid-column:1 / -1;justify-self:center}
  .hxd-dock-link{font-size:12px;height:34px;padding:0 14px}
  .hxd-float-profile{top:14px;right:16px}
  .hxd-hero{padding:40px 20px 120px;max-width:none}
  .hxd-hero--gate{padding:40px 22px}
  .hxd-brand,.hxd-hero h1{font-size:clamp(36px,10vw,52px)}
  .hxd-glass-strip{grid-template-columns:1fr;width:100%;margin-top:28px}
}

/* Friends */
.hx-friends-dashboard{flex:1;min-height:0;display:flex;padding:24px 16px 88px}
.hx-dc{flex:1;min-height:0;display:grid;grid-template-columns:280px minmax(0,1fr);overflow:hidden;border:1px solid var(--line);border-radius:16px;background:rgba(12,12,11,.72);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px)}
.hx-dc-sidebar{display:flex;flex-direction:column;min-height:0;border-right:1px solid var(--line)}
.hx-dc-side-head{padding:16px 14px 10px;flex-shrink:0}
.hx-friends-tabs{display:flex;gap:2px;margin:0 0 12px}
.hx-friends-tab{appearance:none;border:0;background:transparent;color:var(--muted);height:28px;padding:0 10px;border-radius:8px;font:inherit;font-size:12px;font-weight:500;cursor:pointer}
.hx-friends-tab.is-active{color:#fff;background:rgba(255,255,255,.08)}
.hx-friends-tab-count{min-width:15px;height:15px;padding:0 4px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;background:rgba(200,220,240,.08);font-size:9px;margin-left:4px}
.hx-dc-search-row{display:flex;gap:8px}
.hx-search-wrap{flex:1;min-width:0}
.hx-search{width:100%;height:34px;padding:0 10px;border:1px solid var(--line);border-radius:8px;background:rgba(4,6,10,.45);color:var(--ink);font:inherit;font-size:13px}
.hx-search::placeholder{color:var(--text-3)}
.hx-dc-add-btn{width:34px;height:34px;border:1px solid var(--line);border-radius:8px;background:rgba(200,220,240,.06);color:var(--ink);font:inherit;font-size:18px;cursor:pointer}
.hx-dc-add-btn:hover{border-color:rgba(255,255,255,.22);color:#fff}
.hx-friends-status{margin:8px 0 0;min-height:14px;font-size:11px;color:var(--muted)}
.hx-friends-status.is-ok{color:var(--ok)}
.hx-friends-status.is-err{color:var(--err)}
.hx-friends-panel{flex:1;min-height:0;overflow:auto;padding:4px 8px 14px}
.hx-friends-panel[hidden]{display:none!important}
.hx-friends-section-label{margin:8px 8px 6px;font-size:11px;font-weight:500;color:var(--text-3)}
.hx-empty{padding:24px 12px}
.hx-empty-title{margin:0 0 4px;font-size:13px;font-weight:600}
.hx-empty-sub{margin:0;font-size:12px;color:var(--muted);line-height:1.45}
.hx-friend-list{list-style:none;margin:0;padding:0}
.hx-friend-row{display:flex;align-items:center;gap:10px;padding:8px;border-radius:8px;cursor:pointer}
.hx-friend-row:hover{background:var(--hover)}
.hx-friend-row.is-active{background:rgba(255,255,255,.06)}
.hx-friend-av{width:30px;height:30px;border-radius:50%;object-fit:cover;background:#121820;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600}
.hx-friend-meta{flex:1;min-width:0}
.hx-friend-name{display:block;font-size:13px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.hx-friend-status{display:flex;align-items:center;gap:5px;margin-top:2px;font-size:11px;color:var(--muted)}
.hx-friend-unread{min-width:16px;height:16px;padding:0 4px;margin-left:auto;border-radius:999px;background:#f7f7f5;color:#0a0a0a;font-size:10px;font-weight:700;display:inline-flex;align-items:center;justify-content:center}
.hx-friend-actions{display:flex;gap:4px;margin-left:auto}
.hx-friend-action,.hx-dc-icon-btn{appearance:none;border:1px solid var(--line);background:transparent;color:var(--ink2);border-radius:7px;height:26px;padding:0 8px;font:inherit;font-size:11px;font-weight:500;cursor:pointer}
.hx-friend-action.is-primary{background:#f7f7f5;border-color:#f7f7f5;color:#0a0a0a}
.hx-friend-action.is-danger:hover,.hx-dc-icon-btn.is-danger:hover{color:var(--err);border-color:rgba(252,165,165,.35)}
.hx-friend-action:disabled{opacity:.45;cursor:wait}
.hub-av-letter{background:#121820;color:#fff}
.hub-status-dot{width:6px;height:6px;border-radius:50%;background:var(--online);flex-shrink:0}
.hx-plus-badge{display:inline-flex;margin-left:4px;padding:1px 5px;border-radius:4px;font-size:9px;font-weight:700;color:#0a0a0a;background:#f7f7f5;vertical-align:middle}
.hx-dc-chat{min-width:0;min-height:0;display:flex;flex-direction:column}
.hx-dc-chat-empty{flex:1;display:flex;flex-direction:column;justify-content:center;padding:48px;gap:6px}
.hx-dc-chat-empty-title{margin:0;font-size:18px;font-weight:600}
.hx-dc-chat-empty-sub{margin:0;font-size:13px;color:var(--muted)}
.hx-dc-chat-active{flex:1;min-height:0;display:flex;flex-direction:column}
.hx-dc-chat-active[hidden]{display:none!important}
.hx-dc-chat-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 18px;border-bottom:1px solid var(--line)}
.hx-dc-chat-peer{appearance:none;border:0;background:transparent;display:flex;align-items:center;gap:10px;padding:0;cursor:pointer;color:inherit;font:inherit;text-align:left}
.hx-dc-chat-av{width:32px;height:32px;border-radius:50%;overflow:hidden;background:#27272a}
.hx-dc-chat-av img,.hx-dc-chat-av span{width:100%;height:100%;object-fit:cover;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;border-radius:50%}
.hx-dc-chat-name{margin:0;font-size:13px;font-weight:600}
.hx-dc-chat-sub{margin:2px 0 0;font-size:12px;color:var(--muted)}
.hx-dc-pin{display:flex;align-items:center;gap:10px;padding:10px 18px;border-bottom:1px solid var(--line);background:rgba(255,255,255,.06)}
.hx-dc-pin[hidden]{display:none!important}
.hx-dc-pin-copy{flex:1;min-width:0}
.hx-dc-pin-label{font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#fff}
.hx-dc-pin-text{margin:2px 0 0;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hx-dc-pin-clear{appearance:none;border:0;background:transparent;width:28px;height:28px;cursor:pointer;color:var(--muted);font-size:18px}
.hx-dc-messages{flex:1;min-height:0;overflow:auto;padding:16px 18px;display:flex;flex-direction:column;gap:2px}
.hx-dc-day{display:flex;justify-content:center;margin:10px 0 6px}
.hx-dc-day span{font-size:11px;color:var(--text-3)}
.hx-dc-msg{display:flex;align-items:flex-end;gap:8px;max-width:min(70%,460px);margin:2px 0;align-self:flex-start}
.hx-dc-msg.is-mine{align-self:flex-end;flex-direction:row-reverse}
.hx-dc-msg-av{width:26px;height:26px;border-radius:50%;overflow:hidden}
.hx-dc-msg-av.is-spacer{visibility:hidden}
.hx-dc-msg-av img,.hx-dc-msg-av span{width:100%;height:100%;object-fit:cover;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;background:#27272a;border-radius:50%}
.hx-dc-msg-main{min-width:0}
.hx-dc-msg-top{display:flex;gap:8px;margin:0 0 2px}
.hx-dc-msg-author{font-size:11px;font-weight:500;color:var(--muted)}
.hx-dc-msg-author-other{color:var(--ink2)}
.hx-dc-msg-body{display:inline-block;padding:8px 11px;background:var(--bubble-theirs);color:var(--ink);font-size:13px;line-height:1.45;border-radius:12px;word-break:break-word}
.hx-dc-msg.is-mine .hx-dc-msg-body{background:var(--bubble-mine);color:#0a0a0a}
.hx-dc-msg.is-pending .hx-dc-msg-body{opacity:.65}
.hx-dc-msg-time{margin-left:6px;font-size:10px;opacity:.45}
.hx-dc-composer{display:flex;align-items:center;gap:8px;padding:12px 14px 14px;border-top:1px solid var(--line)}
.hx-dc-composer-av{width:28px;height:28px;border-radius:50%;overflow:hidden}
.hx-dc-composer-av img,.hx-dc-composer-av span{width:100%;height:100%;object-fit:cover;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;background:#121820;border-radius:50%}
.hx-dc-input{flex:1;min-width:0;height:38px;padding:0 12px;border:1px solid var(--line);border-radius:10px;background:rgba(4,6,10,.45);color:var(--ink);font:inherit;font-size:13px}
.hx-dc-emoji-wrap{position:relative}
.hx-dc-tool,.hx-dc-send{width:38px;height:38px;border:1px solid var(--line);border-radius:10px;background:transparent;color:var(--muted);cursor:pointer;display:inline-flex;align-items:center;justify-content:center}
.hx-dc-tool svg,.hx-dc-send svg{width:15px;height:15px;fill:currentColor}
.hx-dc-send{background:#f7f7f5;border-color:#f7f7f5;color:#0a0a0a}
.hx-dc-emoji-panel{position:absolute;right:0;bottom:calc(100% + 8px);width:240px;max-height:160px;overflow:auto;padding:8px;display:grid;grid-template-columns:repeat(8,1fr);gap:2px;background:var(--panel);border:1px solid var(--line);border-radius:10px;z-index:20;scrollbar-width:none;-ms-overflow-style:none}
.hx-dc-emoji-panel::-webkit-scrollbar{width:0;height:0;display:none}
.hx-dc-emoji-panel[hidden]{display:none!important}
.hx-dc-emoji-btn{appearance:none;border:0;background:transparent;height:28px;cursor:pointer;font-size:16px;border-radius:4px}
.hx-dc-ctx{position:fixed;z-index:60;min-width:160px;padding:4px;background:var(--panel);border:1px solid var(--line);border-radius:10px;box-shadow:0 16px 40px rgba(0,0,0,.55)}
.hx-dc-ctx[hidden]{display:none!important}
.hx-dc-ctx-item{appearance:none;border:0;background:transparent;width:100%;text-align:left;padding:8px 10px;border-radius:7px;font:inherit;font-size:13px;font-weight:500;color:var(--ink);cursor:pointer}
.hx-dc-ctx-item:hover{background:rgba(255,255,255,.06)}
.hx-dc-ctx-item.is-danger{color:var(--err)}

/* Group / sheets */
.hx-group-modal,.profile-sheet,.settings-sheet{position:fixed;inset:0;z-index:46;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(8,8,8,.78);backdrop-filter:blur(18px);opacity:0;visibility:hidden;pointer-events:none;transition:opacity .2s ease,visibility .2s ease;-webkit-app-region:no-drag;cursor:pointer}
.hx-group-modal.is-open,.profile-sheet.is-open,.settings-sheet.is-open{opacity:1;visibility:visible;pointer-events:auto}
.hx-group-modal-card,.profile-sheet-card,.settings-sheet-card{width:100%;background:rgba(17,17,16,.97);border:1px solid var(--line);border-radius:14px;box-shadow:0 24px 64px rgba(0,0,0,.55);cursor:default;-webkit-app-region:no-drag;overflow:hidden}
.hx-group-modal-card{max-width:400px;max-height:min(84vh,520px);overflow:auto;padding:22px}
.hx-group-modal-head{display:flex;justify-content:space-between;gap:12px;margin-bottom:16px}
.hx-group-modal-kicker{margin:0 0 4px;font-size:11px;font-weight:500;color:var(--text-3);text-transform:uppercase;letter-spacing:.06em}
.hx-group-modal-title{margin:0;font-size:18px;font-weight:600}
.hx-group-modal-close{appearance:none;border:0;width:28px;height:28px;border-radius:8px;background:rgba(255,255,255,.06);color:var(--muted);font-size:18px;cursor:pointer}
.hx-group-form{display:flex;flex-direction:column;gap:14px}
.hx-group-field{display:flex;flex-direction:column;gap:6px;font-size:12px;font-weight:500;color:var(--ink2)}
.hx-group-field input{border:1px solid var(--line);background:rgba(0,0,0,.35);border-radius:10px;height:38px;padding:0 10px;color:var(--ink);font:inherit;font-size:13px}
.hx-group-members-head{display:flex;justify-content:space-between}
.hx-group-limit{font-size:11px;font-weight:600}
.hx-group-hint{margin:0;font-size:12px;color:var(--muted)}
.hx-group-friend-picks{list-style:none;margin:0;padding:0;max-height:200px;overflow:auto;border:1px solid var(--line);border-radius:10px}
.hx-group-friend-picks li{padding:8px 10px;border-bottom:1px solid var(--line)}
.hx-group-friend-picks li:last-child{border-bottom:0}
.hx-group-friend-picks label{display:flex;align-items:center;gap:8px;cursor:pointer;font-weight:500}
.hx-group-actions{display:flex;justify-content:flex-end;gap:8px}
.hx-group-cancel,.hx-group-submit{appearance:none;border:0;border-radius:10px;height:34px;padding:0 12px;font:inherit;font-size:13px;font-weight:600;cursor:pointer}
.hx-group-cancel{background:rgba(200,220,240,.06);color:var(--ink2)}
.hx-group-submit{background:#f7f7f5;border:0;color:#0a0a0a}
.hx-group-submit:disabled{opacity:.5;cursor:default}

.hub-profile-pop{position:absolute;right:0;bottom:auto;top:calc(100% + 8px);left:auto;background:rgba(12,12,11,.72);border:1px solid var(--line);border-radius:12px;overflow:hidden;opacity:0;visibility:hidden;z-index:30;pointer-events:none;min-width:220px;box-shadow:0 16px 40px rgba(4,6,10,.65);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px)}
.hub-profile-pop.is-open{opacity:1;visibility:visible;pointer-events:auto}
.hub-profile-pop-inner{appearance:none;border:none;background:transparent;padding:0;margin:0;width:100%;text-align:left;cursor:pointer;color:var(--ink);font:inherit}
.hub-profile-pop-banner{height:48px}
.hub-profile-pop-body{padding:0 12px 14px;position:relative}
.hub-profile-pop-av{margin-top:-22px;display:inline-block}
.hub-profile-pop-av-img{width:44px;height:44px;border-radius:50%;object-fit:cover;display:block;border:3px solid #0c1016;background:#121820}
.hub-profile-pop-av-img.hub-av-letter{display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:600;color:#fff}
.hub-profile-pop-name{margin:8px 0 2px;font-size:13px;font-weight:600}
.hub-profile-pop-hint{margin:0;font-size:12px;color:var(--muted)}
.profile-sheet-card{max-width:360px}
.settings-sheet-card{max-width:760px;height:min(84vh,580px);display:flex;flex-direction:column}
.settings-sheet-head{display:flex;justify-content:space-between;gap:16px;padding:20px 22px 0}
.settings-sheet-kicker{margin:0 0 4px;font-size:11px;font-weight:500;color:var(--text-3);text-transform:uppercase;letter-spacing:.06em}
.settings-sheet-title{margin:0;font-size:18px;font-weight:600}
.settings-sheet-close,.profile-sheet-close{appearance:none;border:none;width:28px;height:28px;border-radius:8px;background:rgba(200,220,240,.06);color:var(--muted);cursor:pointer;display:flex;align-items:center;justify-content:center}
.settings-tabs{display:flex;gap:2px;padding:14px 22px 0}
.settings-tab{appearance:none;border:0;background:transparent;color:var(--muted);height:28px;padding:0 10px;border-radius:8px;font:inherit;font-size:12px;font-weight:500;cursor:pointer}
.settings-tab.is-active{background:rgba(255,255,255,.06);color:#fff}
.settings-sheet-body{display:grid;grid-template-columns:minmax(0,1fr) 200px;flex:1;min-height:0;overflow:hidden}
.settings-scroll{overflow:auto;padding:16px 22px 22px}
.settings-preview{border-left:1px solid var(--line);padding:16px 14px;background:rgba(0,0,0,.25)}
.settings-preview-label{margin:0 0 8px;font-size:10px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:var(--text-3)}
.hub-settings-panel[hidden]{display:none!important}
.hub-set-block{margin:0 0 20px}
.hub-set-label{margin:0 0 8px;font-size:12px;font-weight:600}
.hub-set-colors{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.hub-set-color{display:flex;flex-direction:column;gap:4px;font-size:12px;color:var(--muted)}
.hub-color-input{width:100%;height:34px;border:1px solid var(--line);border-radius:8px;background:rgba(0,0,0,.35);padding:3px;cursor:pointer}
.hub-banner-styles{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px}
.hub-banner-style{appearance:none;border:1px solid var(--line);background:rgba(0,0,0,.35);border-radius:8px;padding:6px 4px;cursor:pointer;color:var(--muted);font:inherit;font-size:10px;font-weight:500;text-align:center}
.hub-banner-style-preview{display:block;height:26px;border-radius:4px;margin-bottom:4px;background-color:var(--profile-banner);position:relative;overflow:hidden}
.hub-country-list{display:flex;flex-wrap:wrap;gap:5px}
.hub-country-opt{appearance:none;border:1px solid var(--line);background:rgba(0,0,0,.35);border-radius:8px;padding:6px 10px;cursor:pointer;color:var(--muted);font:inherit;font-size:12px;display:inline-flex;align-items:center;gap:6px}
.hub-set-actions{display:flex;flex-wrap:wrap;gap:6px}
.hub-set-action{appearance:none;border:1px solid var(--line);background:transparent;border-radius:8px;height:34px;padding:0 12px;display:inline-flex;align-items:center;gap:6px;font:inherit;font-size:13px;font-weight:500;color:var(--ink);cursor:pointer}
.hub-settings-status{margin-top:10px}
.hx-accounts-hint{margin:0 0 10px;font-size:13px;color:var(--muted)}
.hx-accounts-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}
.hx-account-row{display:flex;align-items:center;gap:10px;padding:8px 10px;background:rgba(0,0,0,.35);border:1px solid var(--line);border-radius:10px}
.hx-account-av{width:30px;height:30px;border-radius:50%;object-fit:cover;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;background:#121820}
.hx-account-meta{flex:1;min-width:0;display:flex;flex-direction:column}
.hx-account-name{font-size:13px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.hx-account-sub{font-size:11px;color:var(--muted)}
.hx-account-actions{display:flex;gap:4px}
.hx-account-btn{appearance:none;border:1px solid var(--line);background:transparent;color:var(--ink2);border-radius:7px;height:26px;padding:0 8px;font:inherit;font-size:11px;font-weight:500;cursor:pointer}
.hx-account-btn.is-primary{background:#f7f7f5;border-color:#f7f7f5;color:#0a0a0a}
.hub-banner-style.is-active{border-color:rgba(255,255,255,.22);color:#fff}
.hub-country-opt.is-active{color:#fff;border-color:rgba(255,255,255,.22)}
.hx-account-row.is-active{border-color:rgba(255,255,255,.22)}
.profile-sheet-banner{position:relative;height:72px}
.profile-sheet-close{position:absolute;top:8px;right:8px;z-index:3}
.profile-sheet-body{padding:0 18px 20px}
.profile-sheet-av{margin-top:-28px;display:inline-block;position:relative}
.profile-sheet-av .hub-profile-pop-av-img{width:60px;height:60px;border-radius:50%;object-fit:cover;display:block;border:4px solid #0c0c0c;background:#27272a;box-sizing:content-box}
.profile-sheet-av .hub-profile-pop-av-img.hub-av-letter{display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:600;color:#fff}
.profile-sheet-av::after{content:"";position:absolute;right:2px;bottom:2px;width:11px;height:11px;border-radius:50%;background:var(--online);border:2px solid #0c0c0c}
.profile-sheet-name{margin:10px 0 4px;font-size:18px;font-weight:600}
.profile-sheet-meta{display:flex;align-items:center;flex-wrap:wrap;margin:0;font-size:13px;color:var(--muted)}
.profile-sheet-status,.profile-sheet-country{display:inline-flex;align-items:center;gap:5px}
.profile-sheet-meta-sep{width:1px;height:12px;margin:0 8px;background:var(--line)}
.profile-sheet-stats{display:grid;grid-template-columns:repeat(3,1fr);margin-top:18px;padding-top:14px;border-top:1px solid var(--line)}
.profile-sheet-stat{text-align:center;padding:0 6px;position:relative}
.profile-sheet-stat+.profile-sheet-stat::before{content:"";position:absolute;left:0;top:2px;bottom:2px;width:1px;background:var(--line)}
.profile-sheet-stat-val{display:block;font-size:20px;font-weight:700}
.profile-sheet-stat-label{display:block;margin-top:4px;font-size:11px;color:var(--muted)}
.hub-flag-dot,.profile-sheet-flag{width:12px;height:12px;border-radius:50%;flex-shrink:0;display:inline-block;overflow:hidden}
.is-flag-br{background:linear-gradient(180deg,#009c3b 0%,#009c3b 35%,#ffdf00 35%,#ffdf00 65%,#002776 65%)}
.is-flag-ar{background:linear-gradient(180deg,#74acdf 0%,#74acdf 33%,#fff 33%,#fff 66%,#74acdf 66%)}
.is-flag-uy{background:repeating-linear-gradient(180deg,#fff 0 1px,#6daee0 1px 2px)}
.is-flag-cl{background:linear-gradient(180deg,#fff 0%,#fff 52%,#d52b1e 52%,#d52b1e 100%)}
.is-flag-mx{background:linear-gradient(90deg,#006847 0%,#006847 34%,#fff 34%,#fff 66%,#ce1126 66%)}
.is-flag-es{background:linear-gradient(180deg,#c60b1e 0%,#c60b1e 28%,#ffc400 28%,#ffc400 72%,#c60b1e 72%)}
.is-flag-pt{background:linear-gradient(90deg,#060 0%,#060 42%,#c00 42%)}
.is-flag-us{background:repeating-linear-gradient(180deg,#b22234 0 1px,#fff 1px 2px)}
.hub-profile-pop-banner,.profile-sheet-banner,.hub-settings-preview-banner{background-color:var(--profile-banner);background-repeat:repeat;position:relative;overflow:hidden}
.is-banner-dots{background-image:radial-gradient(rgba(255,255,255,.28) 1.2px,transparent 1.3px);background-size:14px 14px}
.is-banner-stars{background-image:radial-gradient(1.2px 1.2px at 12% 28%,rgba(255,255,255,.55),transparent),radial-gradient(1px 1px at 45% 18%,rgba(255,255,255,.4),transparent),radial-gradient(1.2px 1.2px at 78% 42%,rgba(255,255,255,.5),transparent),radial-gradient(1px 1px at 62% 70%,rgba(255,255,255,.35),transparent);background-size:100% 100%;background-repeat:no-repeat}
.is-banner-space{background-image:radial-gradient(ellipse 70% 90% at 72% 38%,rgba(120,180,255,.18),transparent 55%),radial-gradient(1px 1px at 15% 25%,rgba(255,255,255,.5),transparent),radial-gradient(1px 1px at 55% 15%,rgba(255,255,255,.35),transparent);background-size:100% 100%;background-repeat:no-repeat}
.is-banner-space::before{content:"SPACE";position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:600;letter-spacing:.28em;text-indent:.28em;color:rgba(255,255,255,.16);pointer-events:none}
.is-banner-grid{background-image:linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px);background-size:16px 16px}
.hub-settings-preview-card{border:1px solid var(--line);border-radius:10px;overflow:hidden;margin-bottom:10px}
.hub-settings-preview-banner{height:44px}
.hub-settings-preview-body{padding:0 10px 12px}
.hub-settings-preview-av{margin-top:-18px;width:38px;height:38px;border-radius:50%;overflow:hidden;border:3px solid #0c0c0c;background:#27272a}
.hub-settings-preview-av img,.hub-settings-preview-av span{width:100%;height:100%;object-fit:cover;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:600}
.hub-settings-preview-name{margin:6px 0 0;font-size:13px;font-weight:600}
.hub-settings-preview-btn{appearance:none;border:1px solid var(--line);background:transparent;border-radius:8px;width:100%;height:30px;font:inherit;font-size:12px;font-weight:500;cursor:pointer;color:var(--ink)}

/* Space warp — open HaxBall Space (5s, GPU-light) */
.space-warp{position:fixed;inset:0;z-index:90;display:flex;align-items:center;justify-content:center;opacity:0;visibility:hidden;pointer-events:none;contain:strict;isolation:isolate;background:#02040a}
.space-warp.is-on{opacity:1;visibility:visible;pointer-events:auto}
.space-warp-void{position:absolute;inset:0;background:#02040a;opacity:0;will-change:opacity}
.space-warp.is-on .space-warp-void{animation:spaceWarpVoid 5s cubic-bezier(.22,.61,.36,1) both}
.space-warp-field{position:absolute;inset:0;opacity:0;will-change:transform,opacity;transform:translateZ(0);background:
  radial-gradient(1.2px 1.2px at 12% 18%,rgba(255,255,255,.7),transparent),
  radial-gradient(1px 1px at 28% 42%,rgba(255,255,255,.5),transparent),
  radial-gradient(1.3px 1.3px at 46% 14%,rgba(255,255,255,.65),transparent),
  radial-gradient(1px 1px at 62% 36%,rgba(255,255,255,.4),transparent),
  radial-gradient(1.2px 1.2px at 78% 22%,rgba(255,255,255,.55),transparent),
  radial-gradient(1px 1px at 88% 58%,rgba(255,255,255,.35),transparent),
  radial-gradient(1.2px 1.2px at 18% 72%,rgba(255,255,255,.5),transparent),
  radial-gradient(1px 1px at 58% 68%,rgba(255,255,255,.55),transparent),
  radial-gradient(1px 1px at 8% 52%,rgba(200,220,255,.4),transparent),
  radial-gradient(1px 1px at 92% 12%,rgba(200,220,255,.35),transparent)}
.space-warp.is-on .space-warp-field{animation:spaceWarpField 5s cubic-bezier(.22,.61,.36,1) both}
.space-warp-streaks{position:absolute;inset:-10%;opacity:0;will-change:transform,opacity;transform:translateZ(0) scale(.4);background:
  radial-gradient(circle at 50% 50%,rgba(255,255,255,.14) 0%,rgba(255,255,255,.04) 28%,transparent 58%);
  box-shadow:inset 0 0 0 1px rgba(255,255,255,.03)}
.space-warp.is-on .space-warp-streaks{animation:spaceWarpStreak 5s cubic-bezier(.18,.7,.22,1) both}
.space-warp-glow{position:absolute;left:50%;top:50%;width:min(48vw,360px);height:min(48vw,360px);margin:0;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.18) 0%,rgba(170,195,255,.07) 38%,transparent 70%);opacity:0;will-change:transform,opacity;transform:translate3d(-50%,-50%,0) scale(.45)}
.space-warp.is-on .space-warp-glow{animation:spaceWarpGlow 5s cubic-bezier(.22,.61,.36,1) both}
.space-warp-core{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;gap:14px;opacity:0;will-change:transform,opacity;transform:translate3d(0,12px,0)}
.space-warp.is-on .space-warp-core{animation:spaceWarpCore 5s cubic-bezier(.22,.61,.36,1) both}
.space-warp-logo{width:64px;height:64px;object-fit:contain;filter:brightness(0) invert(1);opacity:.95}
.space-warp-title{margin:0;font-family:var(--d);font-size:clamp(28px,4vw,42px);font-weight:800;letter-spacing:-.04em;color:#fff;line-height:1}
.space-warp-line{display:block;width:0;height:1px;max-width:160px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.7),transparent);margin-top:2px;will-change:width,opacity}
.space-warp.is-on .space-warp-line{animation:spaceWarpLine 5s cubic-bezier(.22,.61,.36,1) both}
.space-warp.is-out{animation:spaceWarpFadeOut .55s ease forwards}
@keyframes spaceWarpVoid{
  0%{opacity:0}
  8%{opacity:1}
  86%{opacity:1}
  100%{opacity:0}
}
@keyframes spaceWarpField{
  0%{opacity:0;transform:translateZ(0) scale(1.08)}
  12%{opacity:.8;transform:translateZ(0) scale(1)}
  55%{opacity:.9;transform:translateZ(0) scale(1.06)}
  100%{opacity:0;transform:translateZ(0) scale(1.45)}
}
@keyframes spaceWarpStreak{
  0%{opacity:0;transform:translateZ(0) scale(.42)}
  14%{opacity:.45;transform:translateZ(0) scale(.7)}
  50%{opacity:.7;transform:translateZ(0) scale(1.15)}
  100%{opacity:0;transform:translateZ(0) scale(2.1)}
}
@keyframes spaceWarpGlow{
  0%{opacity:0;transform:translate3d(-50%,-50%,0) scale(.4)}
  14%{opacity:.75;transform:translate3d(-50%,-50%,0) scale(.85)}
  48%{opacity:1;transform:translate3d(-50%,-50%,0) scale(1.05)}
  100%{opacity:0;transform:translate3d(-50%,-50%,0) scale(1.55)}
}
@keyframes spaceWarpCore{
  0%{opacity:0;transform:translate3d(0,14px,0)}
  12%{opacity:1;transform:translate3d(0,0,0)}
  72%{opacity:1;transform:translate3d(0,0,0)}
  100%{opacity:0;transform:translate3d(0,-10px,0)}
}
@keyframes spaceWarpLine{
  0%{width:0;opacity:0}
  16%{width:72px;opacity:1}
  70%{width:110px;opacity:.9}
  100%{width:150px;opacity:0}
}
@keyframes spaceWarpFadeOut{to{opacity:0;visibility:hidden}}
body.is-space-warping .riot-rail,
body.is-space-warping .riot-social,
body.is-space-warping .riot-social-mini,
body.is-space-warping .riot-main{opacity:0;pointer-events:none;transition:opacity .4s ease}
@media (prefers-reduced-motion:reduce){
  .space-warp,.space-warp *{animation:none!important;transition:none!important}
}

/* Overlay — Zero style */
.overlay,.hxd-launch-overlay{position:fixed;inset:0;z-index:50;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(8,8,8,.82);backdrop-filter:blur(18px);opacity:0;visibility:hidden;pointer-events:none;transition:opacity .38s ease,visibility .38s ease}
.overlay.on,.hxd-launch-overlay.is-active{opacity:1;visibility:visible;pointer-events:auto}
.hxd-launch-overlay-card{text-align:center;max-width:280px;animation:hxdLaunchIn .5s var(--ease) both}
@keyframes hxdLaunchIn{from{opacity:0;transform:translateY(18px) scale(.94)}to{opacity:1;transform:translateY(0) scale(1)}}
.hxd-launch-orbit{position:relative;width:92px;height:92px;margin:0 auto 24px}
.hxd-launch-orbit-ring{position:absolute;inset:0;border-radius:50%;border:2px solid rgba(255,255,255,.08);border-top-color:#fff;border-right-color:rgba(255,255,255,.4);animation:hxdOrbitSpin .85s linear infinite}
.hxd-launch-orbit-ring--delay{inset:10px;animation-duration:1.15s;animation-direction:reverse;opacity:.55}
.hxd-launch-orbit-core{position:absolute;inset:18px;border-radius:50%;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.14);display:flex;align-items:center;justify-content:center;animation:hxdOrbitPulse 1.1s ease-in-out infinite}
@keyframes hxdOrbitSpin{to{transform:rotate(360deg)}}
@keyframes hxdOrbitPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}
.hxd-launch-ball{width:34px;height:34px;color:#fff;animation:hxdBallKick .9s ease-in-out infinite}
@keyframes hxdBallKick{0%,100%{transform:translateY(0) rotate(0)}35%{transform:translateY(-5px) rotate(-8deg)}70%{transform:translateY(0) rotate(6deg)}}
.hxd-launch-overlay-title,.overlay-t{margin:0 0 8px;font-size:17px;font-weight:600;color:#fff;letter-spacing:-.02em}
.hxd-launch-overlay-step,.overlay-s{margin:0 0 18px;font-size:13px;color:var(--ink2);min-height:20px;line-height:1.4}
.hxd-launch-dots{display:flex;gap:7px;justify-content:center}
.hxd-launch-dots i{width:7px;height:7px;border-radius:50%;background:#fff;display:block;animation:hxdDotBounce .95s ease-in-out infinite}
.hxd-launch-dots i:nth-child(2){animation-delay:.14s}
.hxd-launch-dots i:nth-child(3){animation-delay:.28s}
@keyframes hxdDotBounce{0%,70%,100%{opacity:.3;transform:translateY(0) scale(.8)}35%{opacity:1;transform:translateY(-5px) scale(1)}}

@media(max-width:960px){
  .settings-preview{display:none}
  .settings-sheet-body{grid-template-columns:1fr}
  .hub-banner-styles{grid-template-columns:repeat(3,minmax(0,1fr))}
  .hxd-metric{padding:18px 22px}
}
@media(max-width:760px){
  .hxd-topbar{padding:16px 18px 0;flex-wrap:wrap}
  .hx-nav{order:3;width:100%}
  .hxd-hero{padding:24px 18px}
  .hxd-metrics{grid-template-columns:1fr}
  .hxd-metric{border-right:0;border-bottom:1px solid var(--line)}
  .hx-friends-dashboard{padding:16px 10px 84px}
  .hx-dc{grid-template-columns:1fr}
  .hx-dc-sidebar{max-height:42%;border-right:0;border-bottom:1px solid var(--line)}
  .hx-profile-info{display:none}
}
@media(prefers-reduced-motion:reduce){
  .hx-view.is-active,.hxd-launch-overlay-card,.hxd-hero h1,.hxd-brand,.hxd-kicker,.hxd-sub,.hxd-lead,.hxd-cta-stack{animation:none}
  .hxd-launch-orbit-ring,.hxd-launch-orbit-core,.hxd-launch-ball,.hxd-launch-dots i{animation:none}
  .hxd-play-bg,.hxd-swallow-veil,body.is-swallowing .hxd-dock,body.is-swallowing .hxd-float-profile,body.is-swallowing .hxd-hero{transition:none!important}
  body.is-swallowing .hxd-play-bg{transform:none;filter:brightness(0)}
}

/* —— Riot-style hub (logged in) —— */
body.is-hub{background:#060b14;color:#ece8e1}
body.is-hub .space-bg{display:block!important;z-index:0;filter:blur(8px) brightness(.74) contrast(1.04) saturate(1.05);transform:scale(1.08)}
body.is-hub .space-veil{display:block!important;z-index:1;background:
  linear-gradient(90deg,rgba(6,11,20,.32) 0%,rgba(6,11,20,.14) 48%,rgba(6,11,20,.16) 78%,rgba(6,11,20,.22) 100%),
  linear-gradient(180deg,rgba(6,11,20,.18) 0%,rgba(6,11,20,.1) 42%,rgba(6,11,20,.3) 78%,rgba(6,11,20,.55) 100%)}
body.is-hub .scene{background:#060b14}
.riot-hub{position:absolute;inset:0;z-index:2;display:flex;flex-direction:row;align-items:stretch;width:100%;height:100%;overflow:hidden;background:transparent;-webkit-app-region:no-drag}
.riot-rail{position:relative;z-index:5;flex:0 0 76px;width:76px;align-self:stretch;height:auto;display:flex;flex-direction:column;align-items:center;padding:0 0 12px;background:rgba(10,12,16,.72);border-right:1px solid rgba(255,255,255,.045);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);-webkit-app-region:drag;overflow:visible}
.riot-rail-head{display:flex;flex-direction:column;align-items:center;gap:0;width:100%;padding-top:14px;flex-shrink:0;-webkit-app-region:no-drag}
.riot-rail-logo{width:56px;height:56px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.riot-rail-logo img{width:42px;height:42px;object-fit:contain;filter:brightness(0) invert(1);opacity:.95}
.riot-rail-mid{flex:1;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:0;width:100%;padding:150px 0 8px;-webkit-app-region:no-drag}
.riot-rail-nav{display:flex;flex-direction:column;align-items:center;gap:4px;width:100%}
.riot-rail-btn{appearance:none;position:relative;width:48px;height:48px;border:0;border-radius:12px;background:transparent;color:rgba(236,232,225,.62);display:inline-flex;align-items:center;justify-content:center;cursor:pointer;transition:background .15s ease,color .15s ease}
.riot-rail-btn[data-tip]::after{content:attr(data-tip);position:absolute;left:calc(100% + 10px);top:50%;transform:translateY(-50%) translateX(-4px);padding:7px 10px;border-radius:4px;background:#0a0a0a;color:#fff;font-size:12px;font-weight:600;letter-spacing:.01em;white-space:nowrap;opacity:0;visibility:hidden;pointer-events:none;box-shadow:0 8px 20px rgba(0,0,0,.45);transition:opacity .12s ease,transform .12s ease,visibility .12s ease;z-index:40}
.riot-rail-btn[data-tip]:hover::after{opacity:1;visibility:visible;transform:translateY(-50%) translateX(0)}
.riot-rail-btn svg{width:24px;height:24px}
.riot-rail-btn img{width:28px;height:28px;object-fit:contain;display:block;filter:brightness(0) invert(1);opacity:.9;pointer-events:none}
.riot-rail-btn:hover{color:#fff;background:rgba(255,255,255,.06)}
.riot-rail-btn:hover img{opacity:1}
.riot-rail-btn.is-active{color:#fff;background:rgba(255,255,255,.1)}
.riot-rail-settings{flex-shrink:0;-webkit-app-region:no-drag}
.riot-body{position:relative;flex:1 1 auto;min-width:0;align-self:stretch;height:auto;overflow:hidden;background:transparent}
.riot-main{position:relative;z-index:1;height:100%;width:100%;min-width:0;min-height:0;display:flex;flex-direction:column;overflow:hidden;padding-right:332px}
body.is-hub .riot-main{display:grid;grid-template:minmax(0,1fr)/minmax(0,1fr);align-content:stretch}
body.is-hub .riot-main > .hx-view{
  grid-area:1/1;
  position:relative;width:100%;height:100%;min-height:0;min-width:0;
  display:flex!important;flex-direction:column;
  opacity:0;visibility:hidden;pointer-events:none;transform:translateY(10px);
  transition:opacity .34s cubic-bezier(.22,.61,.36,1),transform .38s cubic-bezier(.22,.61,.36,1),visibility .34s ease;
  z-index:1;overflow:auto;background:transparent;
}
body.is-hub .riot-main > .hx-view[hidden]{display:none!important}
body.is-hub .riot-main > .hx-view.is-active{
  opacity:1;visibility:visible;pointer-events:auto;transform:none;z-index:2;
}
body.is-hub .riot-main > .hx-view.is-enter-from{
  opacity:0;transform:translateY(12px);visibility:visible;
}
body.is-hub .riot-main > .hx-view.is-leaving{
  opacity:0;transform:translateY(-8px);visibility:visible;pointer-events:none;z-index:3;
}
body.is-hub #hub-view-play,
body.is-hub #hub-view-play.is-active,
body.is-hub #hub-view-space.is-active,
body.is-hub #hub-view-library.is-active,
body.is-hub #hub-view-friends-hub.is-active,
body.is-hub #hub-view-settings.is-active{flex:1;min-height:0;height:100%;animation:none}
body.is-hub #hub-view-friends.is-active{display:flex;flex-direction:column;min-height:0;animation:none}
@media (prefers-reduced-motion:reduce){
  body.is-hub .riot-main > .hx-view{transition:none!important;transform:none!important}
}
.riot-library{position:relative;z-index:2;flex:1;min-height:0;display:flex;flex-direction:column;overflow:auto;padding:28px 40px 40px;scrollbar-width:none;-ms-overflow-style:none;background:transparent}
.riot-library::-webkit-scrollbar{width:0;height:0;display:none}
.riot-library-head{margin:0 0 28px}
.riot-library-title{margin:0 0 6px;font-family:var(--d);font-size:40px;font-weight:800;letter-spacing:-.02em;color:#fff}
.riot-library-sub{margin:0;font-size:14px;font-weight:600;color:rgba(236,232,225,.55)}
.riot-library-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px 20px;max-width:1100px}
.riot-library-tile{appearance:none;display:flex;flex-direction:column;gap:12px;padding:0;border:0;background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer;-webkit-app-region:no-drag}
.riot-library-tile.is-disabled{cursor:default;pointer-events:none;opacity:1}
.riot-library-tile.is-disabled .riot-library-name{color:rgba(255,255,255,.78)}
.riot-library-cover{display:block;width:100%;aspect-ratio:16/10;border-radius:6px;background:#0a0a0a center/cover no-repeat;box-shadow:0 10px 28px rgba(0,0,0,.35);transition:transform .2s var(--ease),box-shadow .2s ease,filter .2s ease}
.riot-library-tile:not(.is-disabled):hover .riot-library-cover{transform:translateY(-2px);box-shadow:0 16px 36px rgba(0,0,0,.45)}
.riot-library-cover--locked{position:relative;display:flex;align-items:center;justify-content:center;background:linear-gradient(160deg,#1a1d24 0%,#0e1014 55%,#151820 100%);overflow:hidden;border:1px solid rgba(255,255,255,.08);box-shadow:0 10px 28px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.06)}
.riot-library-stripes{position:absolute;inset:0;z-index:0;opacity:.22;background:repeating-linear-gradient(-45deg,#f5c518 0 11px,#121212 11px 22px);pointer-events:none}
.riot-library-q{position:relative;z-index:1;font-family:var(--d);font-size:clamp(56px,8vw,84px);font-weight:800;line-height:1;color:rgba(255,255,255,.88);text-shadow:0 2px 0 rgba(0,0,0,.35),0 10px 28px rgba(0,0,0,.45)}
.riot-library-tape{position:absolute;z-index:2;left:-18%;right:-18%;top:42%;height:38px;display:flex;align-items:center;justify-content:center;transform:rotate(-14deg);background:repeating-linear-gradient(-45deg,#111 0 10px,#f5c518 10px 20px);box-shadow:0 8px 22px rgba(0,0,0,.45),0 0 0 1px rgba(0,0,0,.35);pointer-events:none}
.riot-library-tape span{padding:0 14px;background:#f5c518;color:#111;font-family:var(--d);font-size:12px;font-weight:800;letter-spacing:.22em;line-height:38px;text-transform:uppercase;box-shadow:0 0 0 1px rgba(0,0,0,.15)}
.riot-library-meta{display:flex;align-items:center;gap:10px;min-width:0}
.riot-library-ico{flex:0 0 auto;width:28px;height:28px;border-radius:6px;overflow:hidden;background:#111;border:1px solid rgba(255,255,255,.28);box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center}
.riot-library-ico img{width:100%;height:100%;object-fit:cover;display:block;filter:brightness(0) invert(1)}
.riot-library-ico--locked{font-family:var(--d);font-size:16px;font-weight:800;color:rgba(255,255,255,.7);background:rgba(245,197,24,.12);border:1px solid rgba(245,197,24,.28)}
.riot-library-name{font-size:15px;font-weight:700;color:#fff;letter-spacing:-.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
@media (max-width:1100px){
  .riot-library{padding:24px 28px 32px}
  .riot-library-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
}
.riot-friends-hub .riot-friends-stats{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:0 0 22px;flex-shrink:0;padding-right:4px}
.riot-friends-stat{display:flex;flex-direction:column;gap:2px;min-width:72px;padding:10px 14px;border-radius:10px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06)}
.riot-friends-stat-val{font-size:18px;font-weight:800;letter-spacing:-.02em;color:#fff;line-height:1}
.riot-friends-stat-lab{font-size:10px;font-weight:650;color:rgba(236,232,225,.45)}
.riot-friends-open-social{appearance:none;margin-left:auto;min-height:34px;padding:0 14px;border:1px solid rgba(255,255,255,.14);border-radius:999px;background:rgba(255,255,255,.06);color:#fff;font:inherit;font-size:12px;font-weight:700;cursor:pointer;transition:background .15s ease,border-color .15s ease;flex-shrink:0;white-space:nowrap}
.riot-friends-open-social:hover{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.24)}
.riot-friends-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,128px));gap:14px 12px;width:100%;max-width:680px;flex:0 0 auto}
.riot-friends-grid[hidden],
.riot-friends-empty[hidden]{display:none!important}
.riot-friends-tile{appearance:none;display:flex;flex-direction:column;gap:8px;padding:0;border:0;background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer;-webkit-app-region:no-drag;min-width:0}
.riot-friends-cover{position:relative;display:block;width:100%;aspect-ratio:1;border-radius:10px;overflow:hidden;background:#161920;box-shadow:0 8px 20px rgba(0,0,0,.3);transition:transform .2s var(--ease),box-shadow .2s ease}
.riot-friends-tile:hover .riot-friends-cover{transform:translateY(-2px);box-shadow:0 12px 28px rgba(0,0,0,.4)}
.riot-friends-cover img{width:100%;height:100%;object-fit:cover;display:block}
.riot-friends-cover .riot-friends-letter{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:800;color:#fff;background:#2a2e36}
.riot-friends-dot{position:absolute;right:6px;bottom:6px;width:10px;height:10px;border-radius:50%;border:2px solid #161920;box-sizing:border-box;background:transparent;box-shadow:inset 0 0 0 1.5px rgba(160,160,160,.7)}
.riot-friends-dot.is-online{background:#1fce6d;box-shadow:none}
.riot-friends-meta{display:flex;flex-direction:column;gap:1px;min-width:0;padding:0 1px}
.riot-friends-name{font-size:13px;font-weight:700;color:#fff;letter-spacing:-.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.riot-friends-status{font-size:11px;font-weight:600;color:rgba(236,232,225,.45)}
.riot-friends-empty{padding:28px 8px;max-width:420px;flex-shrink:0}
.riot-friends-empty-title{margin:0 0 6px;font-size:16px;font-weight:800;color:#fff}
.riot-friends-empty-sub{margin:0;font-size:12px;line-height:1.45;color:rgba(236,232,225,.5)}
@media (max-width:1100px){
  .riot-friends-grid{grid-template-columns:repeat(auto-fill,minmax(100px,116px))}
}
.riot-settings .riot-library-head{margin-bottom:18px}
.riot-settings-tabs{display:inline-flex;align-items:center;gap:2px;margin:0 0 18px;padding:3px;border-radius:999px;background:rgba(0,0,0,.45);border:1px solid rgba(255,255,255,.08);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);flex:0 0 auto;width:max-content;max-width:100%}
.riot-settings-tab{appearance:none;min-height:30px;padding:0 13px;border:0;border-radius:999px;background:transparent;color:rgba(255,255,255,.48);font:inherit;font-size:12px;font-weight:650;cursor:pointer;white-space:nowrap;transition:color .18s ease,background .18s ease}
.riot-settings-tab:hover{color:rgba(255,255,255,.85)}
.riot-settings-tab.is-active{color:#fff;background:rgba(255,255,255,.12)}
.riot-settings-body{display:grid;grid-template-columns:minmax(0,1fr) 268px;gap:22px;align-items:start;flex:1;min-height:0;max-width:860px;width:100%}
.riot-settings-main{min-width:0;min-height:0;overflow:auto;padding-bottom:20px;scrollbar-width:none}
.riot-settings-main::-webkit-scrollbar{width:0;height:0;display:none}
.riot-settings-preview{position:sticky;top:0;flex-shrink:0}
.riot-set-colors{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:0 0 12px}
.riot-set-block{margin:0 0 12px;padding:14px 14px 13px;border-radius:14px;background:rgba(0,0,0,.28);border:1px solid rgba(255,255,255,.07);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
.riot-set-block:last-child{margin-bottom:0}
.riot-set-colors .riot-set-block{margin:0}
.riot-set-label{margin:0 0 10px;font-size:11px;font-weight:700;color:rgba(236,232,225,.52);letter-spacing:.05em;text-transform:uppercase}
.riot-set-hint{margin:0 0 12px;font-size:12px;line-height:1.45;color:rgba(236,232,225,.45)}
.riot-swatch-row{display:flex;flex-wrap:wrap;gap:7px}
.riot-swatch{appearance:none;width:28px;height:28px;padding:0;border-radius:50%;border:2px solid transparent;cursor:pointer;box-shadow:inset 0 0 0 1px rgba(255,255,255,.14);transition:transform .15s ease,border-color .15s ease,box-shadow .15s ease}
.riot-swatch:hover{transform:scale(1.08)}
.riot-swatch.is-active{border-color:#fff;box-shadow:0 0 0 2px rgba(255,255,255,.18),inset 0 0 0 1px rgba(0,0,0,.3)}
.riot-set-tiles{display:flex;flex-direction:column;gap:10px}
.riot-set-tile{appearance:none;display:flex;flex-direction:column;align-items:flex-start;gap:4px;width:100%;padding:14px 16px;border-radius:12px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);color:inherit;font:inherit;text-align:left;cursor:pointer;transition:background .15s ease,border-color .15s ease}
.riot-set-tile:hover{background:rgba(255,255,255,.07);border-color:rgba(255,255,255,.16)}
.riot-set-tile-title{font-size:14px;font-weight:700;color:#fff}
.riot-set-tile-sub{font-size:12px;font-weight:500;color:rgba(236,232,225,.45)}
.riot-settings .hub-banner-styles{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px}
.riot-settings .hub-banner-style{appearance:none;display:flex;flex-direction:column;gap:6px;padding:0;border:0;background:transparent;color:inherit;font:inherit;cursor:pointer;width:auto;min-width:0}
.riot-settings .hub-banner-style-preview{display:block;width:100%;height:52px;border-radius:10px;border:2px solid transparent;box-shadow:inset 0 0 0 1px rgba(255,255,255,.14);overflow:hidden;background-color:#3a3d45;background-color:color-mix(in srgb,var(--profile-banner,#111) 78%,#7a808c);background-position:center;position:relative}
.riot-settings .hub-banner-style.is-active .hub-banner-style-preview{border-color:#fff;box-shadow:0 0 0 1px rgba(255,255,255,.2),inset 0 0 0 1px rgba(0,0,0,.25)}
.riot-settings .hub-banner-style:hover .hub-banner-style-preview{box-shadow:inset 0 0 0 1px rgba(255,255,255,.28)}
.riot-settings .hub-banner-style-label{font-size:10px;font-weight:650;color:rgba(236,232,225,.48);text-align:center;letter-spacing:.02em}
.riot-settings .hub-banner-style.is-active .hub-banner-style-label{color:rgba(236,232,225,.9)}
.riot-settings .hub-banner-style-preview::after{content:"";position:absolute;inset:0;pointer-events:none;border-radius:inherit}
.riot-settings .hub-banner-style-preview.is-banner-dots::after{background-image:radial-gradient(rgba(255,255,255,.7) 1.35px,transparent 1.45px);background-size:10px 10px}
.riot-settings .hub-banner-style-preview.is-banner-stars::after{background-image:radial-gradient(1.7px 1.7px at 14% 28%,#fff,transparent),radial-gradient(1.2px 1.2px at 40% 16%,rgba(255,255,255,.85),transparent),radial-gradient(1.5px 1.5px at 66% 46%,#fff,transparent),radial-gradient(1px 1px at 84% 20%,rgba(255,255,255,.65),transparent),radial-gradient(1.3px 1.3px at 26% 72%,rgba(255,255,255,.75),transparent),radial-gradient(1.1px 1.1px at 90% 70%,rgba(255,255,255,.55),transparent),radial-gradient(1px 1px at 52% 80%,rgba(255,255,255,.5),transparent);background-repeat:no-repeat}
.riot-settings .hub-banner-style-preview.is-banner-space::after{background-image:radial-gradient(ellipse 75% 90% at 72% 38%,rgba(130,190,255,.35),transparent 55%),radial-gradient(1.5px 1.5px at 16% 26%,#fff,transparent),radial-gradient(1px 1px at 48% 14%,rgba(255,255,255,.7),transparent),radial-gradient(1.2px 1.2px at 78% 58%,rgba(255,255,255,.8),transparent),radial-gradient(1px 1px at 34% 68%,rgba(255,255,255,.55),transparent);background-repeat:no-repeat}
.riot-settings .hub-banner-style-preview.is-banner-space::before{content:"SPACE";position:absolute;inset:0;z-index:1;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;letter-spacing:.2em;text-indent:.2em;color:rgba(255,255,255,.38);pointer-events:none}
.riot-settings .hub-banner-style-preview.is-banner-grid::after{background-image:linear-gradient(rgba(255,255,255,.28) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.28) 1px,transparent 1px);background-size:11px 11px}
.riot-settings .hub-country-list{display:flex;flex-wrap:wrap;gap:7px}
.riot-settings .hub-country-opt{appearance:none;display:inline-flex;align-items:center;gap:7px;min-height:32px;padding:0 11px;border-radius:999px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);color:rgba(236,232,225,.7);font:inherit;font-size:12px;font-weight:650;cursor:pointer;transition:background .15s ease,border-color .15s ease,color .15s ease}
.riot-settings .hub-country-opt:hover{background:rgba(255,255,255,.07);color:#fff}
.riot-settings .hub-country-opt.is-active{background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.34);color:#fff}
.riot-settings .hub-settings-preview-card{border:1px solid rgba(255,255,255,.1);border-radius:16px;overflow:hidden;background:rgba(10,12,16,.78);box-shadow:0 16px 40px rgba(0,0,0,.4);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px)}
.riot-settings .hub-settings-preview-banner{height:86px;background-color:var(--profile-banner,#000);background-position:center;position:relative;overflow:hidden}
.riot-settings .hub-settings-preview-body{padding:0 14px 14px}
.riot-settings .hub-settings-preview-av{margin-top:-26px;width:52px;height:52px;border-radius:50%;overflow:hidden;border:3px solid #12141a;outline:2px solid var(--profile-accent,#5865f2);background:#27272a;box-shadow:0 4px 14px rgba(0,0,0,.4)}
.riot-settings .hub-settings-preview-av img,.riot-settings .hub-settings-preview-av span{width:100%;height:100%;object-fit:cover;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700}
.riot-settings .hub-settings-preview-name{margin:10px 0 12px;font-size:15px;font-weight:750;color:#fff}
.riot-settings .hub-settings-preview-btn{appearance:none;display:flex;align-items:center;justify-content:center;width:100%;min-height:34px;padding:0 12px;border:1px solid rgba(255,255,255,.12);border-radius:10px;background:rgba(255,255,255,.07);color:#fff;font:inherit;font-size:12px;font-weight:700;cursor:pointer;transition:background .15s ease,border-color .15s ease}
.riot-settings .hub-settings-preview-btn:hover{background:rgba(255,255,255,.11);border-color:rgba(255,255,255,.22)}
.riot-settings .hx-accounts-list{list-style:none;margin:0 0 12px;padding:0}
.riot-settings .hub-settings-status{margin-top:10px;min-height:16px;font-size:12px;color:rgba(236,232,225,.5)}
.riot-settings .hub-settings-panel[hidden]{display:none!important}
@media (max-width:1100px){
  .riot-settings-body{grid-template-columns:1fr;max-width:560px}
  .riot-settings-preview{position:static;max-width:300px}
  .riot-set-colors{grid-template-columns:1fr}
  .riot-settings .hub-banner-styles{grid-template-columns:repeat(3,minmax(0,1fr))}
}
.riot-home{position:relative;z-index:2;flex:1;min-height:0;display:flex;flex-direction:column;overflow:auto;padding:0;scrollbar-width:none;-ms-overflow-style:none}
.riot-home::-webkit-scrollbar{width:0;height:0;display:none}
.riot-game{position:relative;z-index:2;flex:1;min-height:0;display:flex;flex-direction:column;overflow:hidden;padding:0;background:#050608}
.riot-game-heroes{position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden}
.riot-game-hero{position:absolute;inset:0;opacity:0;background:#050608 center/cover no-repeat;transform:scale(1.06);filter:saturate(.92) contrast(1.05) brightness(.72);transition:opacity .65s cubic-bezier(.22,.61,.36,1),transform 1.1s cubic-bezier(.22,.61,.36,1),filter .65s ease}
.riot-game-hero.is-on{opacity:1;transform:scale(1)}
.riot-game-hero[data-hero-bg="notas"]{background-position:58% 40%;filter:saturate(.75) contrast(1.08) brightness(.55)}
.riot-game-hero[data-hero-bg="comunidad"]{background-position:50% 45%;filter:saturate(1.05) contrast(1.02) brightness(.58)}
.riot-game-veil{position:absolute;inset:0;z-index:1;background:
  linear-gradient(90deg,rgba(5,6,8,.88) 0%,rgba(5,6,8,.55) 38%,rgba(5,6,8,.18) 68%,rgba(5,6,8,.42) 100%),
  linear-gradient(180deg,rgba(5,6,8,.35) 0%,transparent 28%,rgba(5,6,8,.55) 100%)}
.riot-game-top{position:relative;flex:0 0 auto;display:flex;align-items:center;justify-content:center;padding:14px 24px 0;z-index:6;-webkit-app-region:drag}
.riot-game-tabs{position:relative;z-index:6;display:inline-flex;align-items:center;gap:0;margin:0 auto;padding:3px;border-radius:999px;background:rgba(0,0,0,.35);border:1px solid rgba(255,255,255,.08);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);-webkit-app-region:no-drag}
.riot-game-tab{appearance:none;position:relative;min-height:34px;padding:0 18px;border:0;border-radius:999px;background:transparent;color:rgba(255,255,255,.48);font:inherit;font-size:12px;font-weight:650;letter-spacing:.03em;cursor:pointer;white-space:nowrap;transition:color .18s ease,background .18s ease}
.riot-game-tab:hover{color:rgba(255,255,255,.85)}
.riot-game-tab.is-active{color:#fff;background:rgba(255,255,255,.1)}
.riot-game-tab.is-active::after{display:none}
.riot-game-stage{position:relative;z-index:2;flex:1;min-height:0;display:flex;flex-direction:column;justify-content:flex-end;padding:32px 48px 72px;-webkit-app-region:no-drag}
.riot-game-slide{max-width:460px;opacity:0;transform:translateY(18px);transition:opacity .45s cubic-bezier(.22,.61,.36,1),transform .5s cubic-bezier(.22,.61,.36,1);pointer-events:none}
.riot-game-slide.is-on{opacity:1;transform:none;pointer-events:auto}
.riot-game-slide[hidden]{display:block!important;position:absolute;visibility:hidden;pointer-events:none}
.riot-game-mark{width:56px;height:56px;object-fit:contain;filter:brightness(0) invert(1);margin:0 0 20px;opacity:.95}
.riot-game-eye{margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.4)}
.riot-game-title{margin:0 0 12px;font-family:var(--d);font-size:clamp(44px,5.4vw,72px);font-weight:800;letter-spacing:-.045em;line-height:.9;color:#fff}
.riot-game-line{margin:0 0 28px;max-width:26ch;font-size:16px;line-height:1.45;color:rgba(255,255,255,.58)}
.riot-game-play{position:relative;overflow:hidden;appearance:none;display:inline-flex;align-items:center;justify-content:center;min-width:148px;min-height:46px;padding:0 26px;border:0;border-radius:999px;background:#fff;color:#0a0a0a;font:inherit;font-size:14px;font-weight:750;cursor:pointer;transition:transform .15s ease,opacity .15s ease}
.riot-game-play-body{position:relative;z-index:1}
.riot-game-play .hxd-launch-primary-fill{background:rgba(0,0,0,.08)}
.riot-game-play:hover:not(:disabled){opacity:.9}
.riot-game-play:active:not(:disabled){transform:translateY(1px)}
.riot-game-play:disabled{opacity:.5;cursor:not-allowed}
.riot-game-ghost{appearance:none;display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:0 22px;border-radius:999px;border:1px solid rgba(255,255,255,.18);background:rgba(0,0,0,.28);color:#fff;font:inherit;font-size:14px;font-weight:650;cursor:pointer;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);transition:background .15s ease,border-color .15s ease}
.riot-game-ghost:hover{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.32)}
.riot-game-status{margin:14px 0 0;min-height:16px;font-size:12px;color:rgba(255,255,255,.4)}
.riot-game-status.err{color:#ff6b6b}
.riot-game-status.ok{color:#1fce6d}
.riot-home-stage{position:relative;flex:0 0 auto;min-height:min(78vh,720px);height:min(78vh,720px);display:flex;flex-direction:column;justify-content:flex-end;padding:36px 40px 64px}
.riot-home-title{position:absolute;top:28px;left:40px;margin:0;font-family:var(--d);font-size:40px;font-weight:800;letter-spacing:-.02em;color:#fff;text-shadow:0 8px 24px rgba(0,0,0,.45)}
.riot-home-hero{position:relative;max-width:680px;padding-top:72px}
.riot-home-hero-logo{width:88px;height:88px;object-fit:contain;filter:brightness(0) invert(1) drop-shadow(0 12px 28px rgba(0,0,0,.5));margin:0 0 22px;opacity:.95}
.riot-home-hero-title{margin:0 0 16px;font-family:var(--d);font-size:clamp(42px,5vw,64px);font-weight:800;letter-spacing:-.035em;line-height:1;color:#fff;text-shadow:0 14px 36px rgba(0,0,0,.55)}
.riot-home-hero-lead{margin:0 0 28px;max-width:48ch;font-size:17px;line-height:1.55;color:rgba(236,232,225,.78);text-shadow:0 6px 18px rgba(0,0,0,.4)}
.riot-home-cta{position:relative;overflow:hidden;appearance:none;display:inline-flex;align-items:center;justify-content:center;min-width:176px;min-height:46px;padding:0 28px;border:0;border-radius:999px;background:rgba(28,32,40,.9);color:#ece8e1;font:inherit;font-size:15px;font-weight:700;cursor:pointer;border:1px solid rgba(255,255,255,.14);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);transition:background .15s ease,border-color .15s ease}
.riot-home-cta-body{position:relative;z-index:1}
.riot-home-cta:hover:not(:disabled){background:rgba(48,52,62,.96);border-color:rgba(255,255,255,.22)}
.riot-home-cta:disabled{opacity:.55;cursor:not-allowed}
.riot-home .riot-play-status{margin:10px 0 0;min-height:16px}
.riot-home-panel{position:relative;z-index:2;flex:0 0 auto;margin-top:-8px;padding:28px 32px 36px;background:linear-gradient(180deg,rgba(11,13,18,.72) 0%,#0b0d12 18%,#0b0d12 100%);border-top:1px solid rgba(255,255,255,.04)}
.riot-home-new{margin:0 0 28px}
.riot-home-new:last-child{margin-bottom:0}
.riot-home-new-title{margin:0 0 16px;font-size:22px;font-weight:800;color:#fff;letter-spacing:-.015em}
.riot-home-feed{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
.riot-home-feed--3{grid-template-columns:repeat(3,minmax(0,1fr))}
.riot-feed-card{display:flex;flex-direction:column;min-width:0;background:transparent;border:0;padding:0}
.riot-feed-card--link{cursor:pointer}
.riot-feed-card--link:hover .riot-feed-media{transform:scale(1.015)}
.riot-feed-card--link:hover .riot-feed-title{color:#fff}
.riot-feed-media{position:relative;flex:0 0 auto;aspect-ratio:16/10;border-radius:8px;overflow:hidden;background:#161920 center/cover no-repeat;margin-bottom:12px;transition:transform .2s ease;box-shadow:0 10px 28px rgba(0,0,0,.28)}
.riot-feed-media--discord{background:#5865F2 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23fff' d='M20.3 4.6A19 19 0 0 0 12 2.5a19 19 0 0 0-8.3 2.1C2 9.8 1.6 13.5 1.9 17.1c.8.6 1.8 1.1 2.8 1.4l.6-1c-.3-.1-.7-.3-1-.5.1 0 .1 0 .2.1 2.4 1.1 4.9 1.7 7.5 1.7s5.1-.6 7.5-1.7c.1 0 .1 0 .2-.1-.3.2-.7.4-1 .5l.6 1c1-.3 2-.8 2.8-1.4.4-3.6-.1-7.3-1.8-12.5zM8.9 14.6c-.8 0-1.5-.7-1.5-1.6s.7-1.6 1.5-1.6 1.5.7 1.5 1.6-.7 1.6-1.5 1.6zm6.2 0c-.8 0-1.5-.7-1.5-1.6s.7-1.6 1.5-1.6 1.5.7 1.5 1.6-.7 1.6-1.5 1.6z'/%3E%3C/svg%3E") center/48px no-repeat}
.riot-feed-logo{position:absolute;left:10px;top:10px;width:28px;height:28px;border-radius:50%;background:rgba(10,12,16,.72);border:1px solid rgba(255,255,255,.12);display:inline-flex;align-items:center;justify-content:center;overflow:hidden;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
.riot-feed-logo img{width:62%;height:62%;object-fit:contain;filter:brightness(0) invert(1)}
.riot-feed-chip{position:absolute;right:10px;top:10px;display:inline-flex;align-items:center;min-height:22px;padding:0 9px;border-radius:999px;background:rgba(10,12,16,.72);border:1px solid rgba(255,255,255,.1);color:rgba(236,232,225,.82);font-size:9px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
.riot-feed-title{margin:0 0 6px;font-size:15px;font-weight:700;line-height:1.25;color:#fff}
.riot-feed-desc{margin:0;font-size:12px;line-height:1.45;color:rgba(236,232,225,.52);display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.riot-play-status{margin:12px 0 0;font-size:12px;color:rgba(236,232,225,.55)}
.riot-play-status.ok{color:#9dcea8}
.riot-play-status.err{color:#e8a0a0}
.riot-social{position:absolute;top:14px;right:14px;height:calc(100% - 28px);bottom:auto;z-index:3;width:304px;display:flex;flex-direction:column;border-radius:16px;background:rgba(48,50,56,.55);border:1px solid rgba(255,255,255,.08);backdrop-filter:blur(26px) saturate(1.05);-webkit-backdrop-filter:blur(26px) saturate(1.05);box-shadow:0 18px 48px rgba(0,0,0,.35);-webkit-app-region:no-drag;overflow:hidden;opacity:1;transform:none;pointer-events:auto;visibility:visible;transition:height .4s cubic-bezier(.4,0,.2,1),border-radius .35s ease;animation:riotSocialIn .45s var(--ease) both}
.riot-social.is-collapsed{height:72px;border-radius:14px}
.riot-social-profile{position:relative;flex-shrink:0;padding:16px 16px 12px;z-index:2}
.riot-social-body{flex:1;min-height:0;display:flex;flex-direction:column;opacity:1;transform:translateY(0);transform-origin:top center;transition:opacity .26s ease,transform .36s cubic-bezier(.4,0,.2,1)}
.riot-social.is-collapsed .riot-social-body{opacity:0;transform:translateY(-14px);pointer-events:none;flex:0 0 0;min-height:0;overflow:hidden}
.riot-social-user-row{display:flex;align-items:center;gap:8px}
.riot-social-av-btn{appearance:none;flex:1;min-width:0;display:flex;align-items:center;gap:10px;padding:0;border:0;border-radius:10px;background:transparent;color:inherit;font:inherit;cursor:pointer;text-align:left;transition:background .18s ease}
.riot-social-av-btn:hover{background:rgba(255,255,255,.04)}
.riot-social-av-wrap{position:relative;flex-shrink:0;width:40px;height:40px}
.riot-social-av-wrap .hub-av{width:100%;height:100%;border-radius:50%;object-fit:cover;display:block;background:#1a1d24}
.riot-social-av-dot{position:absolute;right:0;bottom:0;width:11px;height:11px;border-radius:50%;border:2px solid rgba(40,42,48,.9);box-sizing:border-box}
.riot-social-av-dot.is-online{background:#1fce6d}
.riot-social-user-copy{flex:1;min-width:0;max-width:180px;display:flex;flex-direction:column;gap:2px;opacity:1;overflow:hidden}
.riot-social-user-name{font-size:14px;font-weight:700;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;letter-spacing:.01em}
.riot-social-user-status{display:inline-flex;align-items:center;gap:6px;font-size:12px;color:rgba(236,232,225,.55);white-space:nowrap}
.riot-social-user-status .hub-status-dot{width:7px;height:7px;background:#1fce6d}
.riot-social-profile-btn{appearance:none;width:30px;height:30px;padding:0;border:0;border-radius:6px;background:transparent;color:rgba(236,232,225,.55);display:inline-flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;transition:color .15s ease,background .15s ease,transform .2s var(--ease)}
.riot-social-profile-btn svg{width:18px;height:18px;flex-shrink:0}
.riot-social-profile-btn:hover{color:#fff;background:rgba(255,255,255,.06)}
.riot-social-profile-btn:active{transform:scale(.92)}
.riot-social-mini{display:none!important}
.riot-social-mini[hidden]{display:none!important}
body.is-hub .riot-main{transition:padding-right .4s cubic-bezier(.4,0,.2,1)}
body.is-hub-social-collapsed .riot-main{padding-right:24px}
body.is-hub-social-collapsed .riot-chat-float{right:24px}
.riot-social-pop{position:absolute;top:64px;right:0;left:0!important;min-width:0!important;width:100%;z-index:10}
.riot-social-tabs{position:relative;display:flex;gap:4px;flex-shrink:0;margin:0 12px;padding:4px;border-radius:10px;background:rgba(20,22,28,.4)}
.riot-social-tab-ink{position:absolute;top:4px;left:0;height:calc(100% - 8px);width:0;border-radius:8px;background:rgba(255,255,255,.08);pointer-events:none;z-index:0;transition:transform .32s cubic-bezier(.4,0,.2,1),width .32s cubic-bezier(.4,0,.2,1);will-change:transform,width}
.riot-social-tab-ink::after{content:"";position:absolute;left:22%;right:22%;bottom:3px;height:2px;border-radius:2px;background:#ff4655;box-shadow:0 0 10px rgba(255,70,85,.45)}
.riot-social-tab{position:relative;z-index:1;appearance:none;flex:1;height:36px;border:0;border-radius:8px;background:transparent;color:rgba(236,232,225,.42);display:inline-flex;align-items:center;justify-content:center;cursor:pointer;transition:color .2s ease,transform .2s var(--ease)}
.riot-social-tab svg{width:18px;height:18px;transition:transform .22s var(--ease)}
.riot-social-tab:hover{color:rgba(236,232,225,.8)}
.riot-social-tab:hover svg{transform:translateY(-1px)}
.riot-social-tab.is-active{color:#fff;background:transparent}
.riot-social-tab.is-active svg{transform:none}
.riot-social-tab:active{transform:scale(.96)}
.riot-social-tab-badge{position:absolute;top:4px;right:8px;min-width:14px;height:14px;padding:0 3px;border-radius:999px;background:#ff4655;color:#fff;font-size:9px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;line-height:1}
.riot-social-tab-badge[hidden]{display:none!important}
.riot-social-list.hx-friends-panel.is-active{animation:riotSocialPanelIn .3s cubic-bezier(.22,.61,.36,1) both}
.riot-social-search{flex-shrink:0;display:flex;align-items:center;gap:8px;padding:12px 14px 8px;flex-wrap:wrap}
.riot-social-search-inner{flex:1;min-width:0;display:flex;align-items:center;gap:8px;background:rgba(20,22,28,.45);border:0;border-radius:999px;padding:0 12px;height:34px}
.riot-social-search-inner svg{width:14px;height:14px;color:rgba(236,232,225,.38);flex-shrink:0}
.riot-social-search-inner .hx-search{flex:1;background:transparent!important;border:0!important;outline:none;color:#fff;font:inherit;font-size:13px;height:100%;padding:0;box-shadow:none}
.riot-social-search-inner .hx-search::placeholder{color:rgba(236,232,225,.38)}
.riot-social-add{flex-shrink:0;width:28px;height:28px;border:0;border-radius:6px;background:rgba(255,255,255,.06);color:rgba(236,232,225,.7);font-size:18px;line-height:1;display:inline-flex;align-items:center;justify-content:center;cursor:pointer}
.riot-social-add:hover{color:#fff;background:rgba(255,255,255,.1)}
.riot-social-search .hx-friends-status{width:100%;margin:4px 0 0;min-height:0}
.riot-social-list{flex:1;min-height:0;overflow-y:auto;padding:2px 8px 12px;scrollbar-width:none;-ms-overflow-style:none}
.riot-social-list::-webkit-scrollbar{width:0;height:0;display:none}
.riot-social-list.hx-friends-panel{padding:2px 8px 12px}
.riot-chat-messages,.riot-chat-float .hx-dc-messages{scrollbar-width:none;-ms-overflow-style:none}
.riot-chat-messages::-webkit-scrollbar,
.riot-chat-float .hx-dc-messages::-webkit-scrollbar{width:0;height:0;display:none}
body.is-hub .riot-social .hx-friends-section-label{margin:10px 8px 8px;font-size:12px;font-weight:700;letter-spacing:.02em;color:rgba(236,232,225,.45)}
body.is-hub .riot-social .hx-friend-row{gap:12px;padding:8px 8px;border-radius:8px;margin:0}
body.is-hub .riot-social .hx-friend-av-wrap{position:relative;flex-shrink:0;width:36px;height:36px}
body.is-hub .riot-social .hx-friend-av{width:36px;height:36px;border-radius:50%;object-fit:cover;display:block;background:#2a2e36}
body.is-hub .riot-social .hx-friend-av-badge{position:absolute;right:-1px;bottom:-1px;width:12px;height:12px;border-radius:50%;border:2px solid rgba(40,42,48,.9);box-sizing:border-box;background:transparent}
body.is-hub .riot-social .hx-friend-av-badge.is-offline{border-color:rgba(40,42,48,.9);background:transparent;box-shadow:inset 0 0 0 1.5px rgba(160,160,160,.7)}
body.is-hub .riot-social .hx-friend-av-badge.is-online{background:#1fce6d}
body.is-hub .riot-social .hx-friend-name{font-size:13px;font-weight:700;color:#fff}
body.is-hub .riot-social .hx-friend-status{margin-top:2px;font-size:11px;color:rgba(236,232,225,.45)}
body.is-hub .riot-social .hx-friend-row:hover{background:rgba(255,255,255,.05)}
body.is-hub .riot-social .hx-friend-row.is-active{background:rgba(255,255,255,.08)}
body.is-hub .riot-social .hx-empty{padding:28px 14px}
body.is-hub .riot-social .hx-empty-title{color:#fff}
body.is-hub .riot-social .hx-empty-sub{color:rgba(236,232,225,.45)}
body.is-hub .riot-social .hx-friend-unread{background:#ff4655;color:#fff}
.riot-friend-card{position:fixed;z-index:40;width:260px;padding:16px;border-radius:14px;background:rgba(36,38,44,.72);border:1px solid rgba(255,255,255,.08);backdrop-filter:blur(22px);-webkit-backdrop-filter:blur(22px);box-shadow:0 18px 48px rgba(0,0,0,.45);pointer-events:auto;color:#ece8e1;opacity:0;transform:translateX(10px) scale(.98);visibility:hidden;transition:opacity .22s var(--ease),transform .26s var(--ease),visibility .22s ease}
.riot-friend-card.is-visible{opacity:1;transform:translateX(0) scale(1);visibility:visible}
.riot-friend-card[hidden]{display:none!important}
.riot-friend-card::after{content:"";position:absolute;top:0;bottom:0;left:100%;width:18px}
.riot-chat-hint[hidden]{display:none!important}
.riot-friend-card-top{display:flex;align-items:center;gap:12px;margin-bottom:14px}
.riot-friend-card-av{width:56px;height:56px;border-radius:50%;overflow:hidden;background:#1c2028;flex-shrink:0}
.riot-friend-card-av img,.riot-friend-card-av span{width:100%;height:100%;object-fit:cover;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;color:#fff;border-radius:50%}
.riot-friend-card-id{min-width:0}
.riot-friend-card-name{margin:0;font-size:16px;font-weight:700;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.riot-friend-card-tag{margin:2px 0 0;font-size:12px;color:rgba(236,232,225,.45)}
.riot-friend-card-game{display:flex;align-items:center;gap:8px;margin:0 0 8px}
.riot-friend-card-game-mark{display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:18px;padding:0 4px;border-radius:4px;background:#ff4655;color:#fff;font-size:8px;font-weight:800;letter-spacing:.04em}
.riot-friend-card-game-name{font-size:12px;font-weight:700;letter-spacing:.08em;color:#ff4655}
.riot-friend-card-status{display:flex;align-items:center;gap:8px;margin:0 0 14px;font-size:12px;color:rgba(236,232,225,.55)}
.riot-friend-card-status svg{width:14px;height:14px;flex-shrink:0;opacity:.7}
.riot-friend-card-note{display:flex;align-items:center;gap:8px;padding:10px 12px;border-radius:10px;background:rgba(0,0,0,.35);color:rgba(236,232,225,.4);font-size:12px}
.riot-friend-card-note svg{width:14px;height:14px;flex-shrink:0}
.riot-chat-float{position:absolute;right:330px;bottom:14px;top:auto;z-index:4;width:320px;height:360px;max-height:calc(100% - 120px);display:flex;flex-direction:column;pointer-events:none;opacity:0;transform:translateY(14px) scale(.98);visibility:hidden;transition:right .38s var(--ease),opacity .32s var(--ease),transform .36s var(--ease),visibility .32s ease}
.riot-chat-float.is-open,
.riot-chat-float.is-active{pointer-events:auto;opacity:1;transform:translateY(0) scale(1);visibility:visible}
.riot-chat-float[hidden]{display:none!important}
.riot-chat-board{flex:1;min-height:0;display:flex;flex-direction:column;margin:0;border-radius:14px;background:#1a1c22;border:1px solid rgba(255,255,255,.06);box-shadow:0 18px 48px rgba(0,0,0,.55);overflow:hidden}
.riot-chat-head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 12px 10px;border-bottom:1px solid rgba(255,255,255,.06);flex-shrink:0;background:#22242a}
.riot-chat-head .hx-dc-chat-peer{flex:1;min-width:0}
.riot-chat-head .hx-dc-chat-name{margin:0;font-size:13px;font-weight:700;color:#fff}
.riot-chat-head .hx-dc-chat-sub{margin:2px 0 0;font-size:11px;color:rgba(236,232,225,.45)}
.riot-chat-head-actions{display:flex;align-items:center;gap:2px;flex-shrink:0}
.riot-chat-icon-btn{appearance:none;width:28px;height:28px;border:0;border-radius:6px;background:transparent;color:rgba(236,232,225,.55);font-size:18px;line-height:1;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;transition:color .15s ease,background .15s ease,transform .18s var(--ease)}
.riot-chat-icon-btn:hover{color:#fff;background:rgba(255,255,255,.06)}
.riot-chat-icon-btn:active{transform:scale(.92)}
.riot-chat-messages{flex:1;min-height:0;overflow:auto;padding:10px 12px;display:flex;flex-direction:column;background:#1a1c22;mask-image:linear-gradient(180deg,transparent 0, #000 18px, #000 100%);-webkit-mask-image:linear-gradient(180deg,transparent 0, #000 18px, #000 100%)}
.riot-chat-hint{margin:0;padding:8px 16px 4px;font-size:11px;line-height:1.45;color:rgba(236,232,225,.35);text-align:center;flex-shrink:0;animation:riotFadeIn .35s var(--ease) both}
.riot-chat-composer{display:flex;align-items:center;gap:8px;padding:10px 12px 12px;border-top:0;flex-shrink:0;background:#1a1c22}
.riot-chat-composer .hx-dc-input{flex:1;height:36px;padding:0 14px;border-radius:999px;border:0;background:#12141a!important;color:#fff;transition:background .2s ease,box-shadow .2s ease}
.riot-chat-composer .hx-dc-input:focus{box-shadow:0 0 0 1px rgba(255,255,255,.12)}
.riot-chat-composer .hx-dc-input::placeholder{color:rgba(236,232,225,.38)}
.riot-chat-composer .hx-dc-send{width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.08);border:0;color:rgba(236,232,225,.7);transition:background .15s ease,color .15s ease,transform .18s var(--ease)}
.riot-chat-composer .hx-dc-send:hover{background:rgba(255,255,255,.14);color:#fff}
.riot-chat-composer .hx-dc-send:active{transform:scale(.92)}
.riot-chat-composer .hx-dc-tool{color:rgba(236,232,225,.45)}
.riot-chat-float .hx-dc-msg{max-width:85%;margin:3px 0}
.riot-chat-float .hx-dc-msg.is-enter{animation:riotMsgIn .28s var(--ease) both}
.riot-chat-float .hx-dc-msg-av{display:none}
.riot-chat-float .hx-dc-msg-top{display:none}
.riot-chat-float .hx-dc-msg-body{padding:8px 12px;border-radius:14px;background:#fff;color:#111;font-size:13px;box-shadow:0 2px 8px rgba(0,0,0,.2)}
.riot-chat-float .hx-dc-msg.is-mine .hx-dc-msg-body{background:#fff;color:#111}
.riot-chat-float .hx-dc-msg:not(.is-mine) .hx-dc-msg-body{background:rgba(255,255,255,.12);color:#fff;box-shadow:none}
.riot-chat-float .hx-dc-msg-time{color:rgba(0,0,0,.4)}
.riot-chat-float .hx-dc-msg:not(.is-mine) .hx-dc-msg-time{color:rgba(255,255,255,.35)}
.riot-chat-float .hx-dc-day{color:rgba(236,232,225,.35)}
body.is-hub .riot-chat-float .hx-dc-chat-empty{display:none!important}
body.is-hub .riot-social .hx-friend-row{transition:background .15s ease,transform .2s var(--ease),opacity .25s ease}
body.is-hub .riot-rail{animation:riotRailIn .4s var(--ease) both}
body.is-hub .riot-home-stage{animation:riotFadeIn .45s var(--ease) both}
body.is-hub .riot-home-panel{animation:riotFadeUp .55s var(--ease) .1s both}
@keyframes riotSocialIn{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}
@keyframes riotRailIn{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}
@keyframes riotFadeIn{from{opacity:0}to{opacity:1}}
@keyframes riotFadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes riotMsgIn{from{opacity:0;transform:translateY(6px) scale(.98)}to{opacity:1;transform:none}}
@keyframes riotTabLine{from{opacity:0;transform:scaleX(.4)}to{opacity:1;transform:scaleX(1)}}
@keyframes riotSocialPanelIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
body.is-hub .hx-friends-tab{color:rgba(236,232,225,.45)}
body.is-hub .hx-friends-tab.is-active{color:#fff;background:rgba(255,255,255,.08)}
body.is-hub .hx-search{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.08);color:#fff}
body.is-hub .hx-search::placeholder{color:rgba(236,232,225,.35)}
body.is-hub .hx-dc-chat-empty-title{color:#fff}
body.is-hub .hx-dc-chat-head{border-bottom-color:rgba(255,255,255,.08)}
body.is-hub .hx-dc-input{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.08);color:#fff}
body.is-hub .hxd-dock.is-hidden{display:none!important}
body.is-hub #hub-view-play.is-active,
body.is-hub #hub-view-space.is-active,
body.is-hub #hub-view-library.is-active,
body.is-hub #hub-view-friends.is-active{animation:none}
body.is-swallowing .space-bg{position:fixed;inset:-8%;z-index:46;transform:scale(1.2);filter:brightness(.08);opacity:1}
body.is-swallowing .riot-social,
body.is-swallowing .riot-social-mini,
body.is-swallowing .riot-rail,
body.is-swallowing .riot-home,
body.is-swallowing .riot-game,
body.is-swallowing .riot-library,
body.is-swallowing .riot-chat-float,
body.is-swallowing .riot-friend-card{opacity:0;pointer-events:none;transition:opacity .7s ease}
@media (max-width:1100px){
  .riot-home-feed,
  .riot-home-feed--3{grid-template-columns:repeat(2,minmax(0,1fr))}
  .riot-main{padding-right:296px}
  .riot-social{width:272px}
  .riot-chat-float{right:298px;width:280px;height:320px;top:auto;bottom:14px}
}

/* —— Login: Riot layout, Space UI —— */
body.is-gate{background:#0a1420;color:#111}
body.is-gate .space-bg,
body.is-gate .space-veil{display:none!important}
body.is-gate .scene{background:#0a1420;overflow:hidden}
.riot-gate{position:relative;z-index:2;width:100%;height:100vh;min-height:100%;overflow:hidden;background:#0a1420;-webkit-app-region:no-drag}
.riot-art{position:absolute;inset:0;z-index:0;background-color:#0a1420;background-size:cover;background-position:58% 45%;background-repeat:no-repeat;animation:riotArtIn 1s var(--ease) both}
.riot-panel{position:absolute;left:0;top:0;bottom:0;z-index:2;display:flex;flex-direction:column;width:clamp(340px,30vw,400px);height:100%;background:#fff;box-shadow:16px 0 48px rgba(0,0,0,.28);-webkit-app-region:drag}
.riot-exit{position:absolute;top:12px;left:12px;z-index:3;width:36px;height:36px;border:0;border-radius:8px;background:transparent;color:#9a9a9a;font-size:26px;line-height:1;cursor:pointer;-webkit-app-region:no-drag}
.riot-exit:hover{color:#111;background:rgba(0,0,0,.05)}
.riot-panel-inner{flex:1;min-height:0;display:flex;flex-direction:column;height:100%;padding:0 44px 28px;-webkit-app-region:no-drag}
.sg-body{flex:1;display:flex;flex-direction:column;justify-content:center;width:100%;max-width:280px;margin:0 auto;padding-top:24px}
.sg-kicker{margin:0 0 10px;font-size:11px;font-weight:650;letter-spacing:.14em;text-transform:uppercase;color:#8a8a8a}
.sg-brand{margin:0 0 12px;font-family:var(--d);font-size:44px;font-weight:800;letter-spacing:-.045em;line-height:.95;color:#0a0a0a}
.sg-lead{margin:0 0 28px;max-width:24ch;font-size:14px;line-height:1.45;color:#6e6e6e}
.sg-cta{appearance:none;display:inline-flex;align-items:center;justify-content:center;gap:10px;width:100%;min-height:50px;padding:0 18px;border:0;border-radius:12px;background:#5865F2;color:#fff;font:inherit;font-size:14px;font-weight:700;cursor:pointer;transition:background .15s ease,opacity .15s ease}
.sg-cta svg{width:18px;height:18px;flex-shrink:0}
.sg-cta:hover:not(:disabled){background:#4752c4}
.sg-cta:active:not(:disabled){background:#3c45a5}
.sg-cta:disabled{opacity:.55;cursor:not-allowed}
.riot-status{margin:14px 0 0;min-height:18px;font-size:12px;line-height:1.4;color:#8a8a8a}
.riot-status.ok{color:#2d8a4e}
.riot-status.err{color:#c23b3b}
.sg-foot{flex-shrink:0;display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;max-width:280px;margin:0 auto;padding-top:16px;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#b8b8b8}
@keyframes riotArtIn{from{opacity:0}to{opacity:1}}
@media (prefers-reduced-motion:reduce){
  .riot-art{animation:none}
}

</style></head><body class="${loggedIn ? "is-hub" : "is-gate"}">
<div class="scene">
  <div class="space-bg" id="bg3d" aria-hidden="true"></div>
  <div class="space-veil" aria-hidden="true"></div>
  ${mainHtml}
  ${profileSheetHtml}
  ${settingsSheetHtml}
  ${groupModalHtml}
  <div class="hxd-swallow-veil" aria-hidden="true"></div>
  <div id="space-warp" class="space-warp" aria-hidden="true">
    <div class="space-warp-void" aria-hidden="true"></div>
    <div class="space-warp-field" aria-hidden="true"></div>
    <div class="space-warp-streaks" aria-hidden="true"></div>
    <div class="space-warp-glow" aria-hidden="true"></div>
    <div class="space-warp-core">
      <img class="space-warp-logo" src="${logoUrl}" alt=""/>
      <p class="space-warp-title">HaxBall Space</p>
      <span class="space-warp-line" aria-hidden="true"></span>
    </div>
  </div>
  <div id="hxd-launch-overlay" class="overlay hxd-launch-overlay" aria-hidden="true">
    <div class="hxd-launch-overlay-card">
      <div class="hxd-launch-orbit" aria-hidden="true">
        <span class="hxd-launch-orbit-ring"></span>
        <span class="hxd-launch-orbit-ring hxd-launch-orbit-ring--delay"></span>
        <span class="hxd-launch-orbit-core">
          <svg class="hxd-launch-ball" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.3" opacity=".35"/><path fill="currentColor" d="M12 2.5l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 14.8 7.2 17.4l.9-5.4-3.9-3.8 5.4-.8L12 2.5z" opacity=".95"/></svg>
        </span>
      </div>
      <p class="hxd-launch-overlay-title overlay-t">Launching</p>
      <p class="hxd-launch-overlay-step overlay-s" id="hxd-launch-overlay-step">Preparing client…</p>
      <div class="hxd-launch-dots" aria-hidden="true"><i></i><i></i><i></i></div>
    </div>
  </div>
  <div id="hub-chat-ctx" class="hx-dc-ctx" hidden role="menu">
    <button type="button" class="hx-dc-ctx-item" data-ctx-action="pin" role="menuitem">Pin Message</button>
    <button type="button" class="hx-dc-ctx-item is-danger" data-ctx-action="delete" role="menuitem">Delete Message</button>
    <button type="button" class="hx-dc-ctx-item" data-ctx-action="copy" role="menuitem">Copy Text</button>
  </div>
</div>
<script type="importmap">
{"imports":{"three":"${base}/ui/vendor/three.module.js"}}
</script>
<script type="module">
import * as THREE from "three";
(function () {
  var container = document.getElementById("bg3d");
  if (!container || !THREE) return;
  var uiBase = ${JSON.stringify(base + "/ui")};
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function localFaces(folder) {
    return [
      folder + "/panorama_1.png",
      folder + "/panorama_3.png",
      folder + "/panorama_4.png",
      folder + "/panorama_5.png",
      folder + "/panorama_0.png",
      folder + "/panorama_2.png"
    ];
  }

  var urls = localFaces(uiBase + "/assets/themes/japan");
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(85, 1, 0.1, 100);
  camera.position.set(0, 0, 0);
  camera.rotation.order = "YXZ";

  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "low-power" });
  renderer.setClearColor(0x000000, 1);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  container.appendChild(renderer.domElement);

  var lost = false;
  renderer.domElement.addEventListener("webglcontextlost", function (e) {
    e.preventDefault();
    lost = true;
  }, false);
  renderer.domElement.addEventListener("webglcontextrestored", function () {
    lost = false;
    resize();
  }, false);

  function loadTexture(url) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () {
        if (!img.naturalWidth || !img.naturalHeight) {
          reject(new Error("Empty texture"));
          return;
        }
        var tex = new THREE.Texture(img);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.needsUpdate = true;
        resolve(tex);
      };
      img.onerror = function () { reject(new Error("Failed texture")); };
      img.src = url;
    });
  }

  function makeProceduralSky() {
    var palette = { top: "#2a1838", mid: "#6b2a4a", bot: "#120a18", accent: "#e85d7a" };
    var materials = [0, 1, 2, 3, 4, 5].map(function (faceIndex) {
      var c = document.createElement("canvas");
      c.width = 512; c.height = 512;
      var ctx = c.getContext("2d");
      var g = ctx.createLinearGradient(0, 0, 0, 512);
      var shift = (faceIndex % 6) * 0.04;
      g.addColorStop(0, palette.top);
      g.addColorStop(0.45 + shift, palette.mid);
      g.addColorStop(1, palette.bot);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 512, 512);
      var rg = ctx.createRadialGradient(256, 180, 20, 256, 220, 280);
      rg.addColorStop(0, palette.accent + "99");
      rg.addColorStop(1, "transparent");
      ctx.fillStyle = rg;
      ctx.fillRect(0, 0, 512, 512);
      var tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      return new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide });
    });
    return new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), materials);
  }

  function resize() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    camera.aspect = w / Math.max(1, h);
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  resize();
  window.addEventListener("resize", resize);

  var yawSpeed = (Math.PI * 2) / 160;
  var pitchBase = THREE.MathUtils.degToRad(-8);
  var pitchAmp = THREE.MathUtils.degToRad(10);
  var pitchPeriod = 22;
  var t0 = performance.now();

  function tick(now) {
    if (!lost) {
      var t = reduced ? 0 : (now - t0) / 1000;
      camera.rotation.y = -t * yawSpeed;
      camera.rotation.x = pitchBase + Math.sin((t * Math.PI * 2) / pitchPeriod) * pitchAmp;
      renderer.render(scene, camera);
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  Promise.all(urls.map(function (url) {
    return loadTexture(url).then(function (tex) {
      return new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide });
    });
  })).then(function (materials) {
    scene.add(new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), materials));
  }).catch(function () {
    scene.add(makeProceduralSky());
  });
})();
</script>
<script>
window.__SPACE_LAUNCH=${bootJson};
(function() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            if (document.activeElement && document.activeElement !== document.body) {
                try { document.activeElement.blur(); } catch (eBlur) {}
            }
        }
    }, true);
    document.addEventListener('selectstart', function(e) {
        var el = e.target;
        if (!el) {
            e.preventDefault();
            return;
        }
        var tag = el.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;
        if (el.closest && el.closest('input, textarea, [contenteditable="true"]')) return;
        e.preventDefault();
    }, true);
    if (document.body.classList.contains('is-gate')) {
        document.addEventListener('dblclick', function(e) {
            e.preventDefault();
            e.stopPropagation();
        }, true);
    }
    var profileTrigger = document.getElementById('hxd-profile-trigger');
    var profilePop = document.getElementById('hxd-profile-popover');
    var profilePopOpen = document.getElementById('hxd-profile-pop-open');
    var profileSheet = document.getElementById('hxd-profile-sheet');
    var profileSheetClose = document.getElementById('hxd-profile-sheet-close');
    var settingsSheet = document.getElementById('hxd-settings-sheet');
    var settingsSheetClose = document.getElementById('hxd-settings-sheet-close');
    var prefBanner = null;
    var prefAccent = null;
    var bannerSwatchWrap = document.getElementById('hxd-pref-banner-swatches');
    var accentSwatchWrap = document.getElementById('hxd-pref-accent-swatches');
    var bannerStyleWrap = document.getElementById('hxd-pref-banner-styles');
    var countryListWrap = document.getElementById('hxd-pref-country-list');
    var BANNER_COLORS = ['#000000', '#1a1d24', '#0b1a2e', '#1a0b14', '#152018', '#2a1810', '#12141a', '#5865f2'];
    var ACCENT_COLORS = ['#5865f2', '#1fce6d', '#ff4655', '#f5c518', '#00b0ff', '#9b59b6', '#e67e22', '#12141a'];
    function renderColorSwatches(wrap, colors, activeHex, kind) {
        if (!wrap) return;
        var active = String(activeHex || '').toLowerCase();
        wrap.innerHTML = colors.map(function(hex) {
            var h = String(hex).toLowerCase();
            return '<button type="button" class="riot-swatch' + (h === active ? ' is-active' : '') +
                '" data-color-kind="' + kind + '" data-color="' + escapeHtml(hex) +
                '" style="background:' + escapeHtml(hex) + '" title="' + escapeHtml(hex) +
                '" aria-label="' + escapeHtml(hex) + '" aria-pressed="' + (h === active ? 'true' : 'false') + '"></button>';
        }).join('');
    }
    function syncColorSwatches(prefs) {
        renderColorSwatches(bannerSwatchWrap, BANNER_COLORS, prefs && prefs.banner, 'banner');
        renderColorSwatches(accentSwatchWrap, ACCENT_COLORS, prefs && prefs.accent, 'accent');
    }
    var profileSheetFlag = document.getElementById('hxd-profile-sheet-flag');
    var profileSheetCountryName = document.getElementById('hxd-profile-sheet-country-name');
    var profileSheetAv = document.getElementById('hxd-profile-sheet-av');
    var profileSheetName = document.getElementById('hxd-profile-sheet-name');
    var profileSheetStatus = document.getElementById('hxd-profile-sheet-status');
    var profileSheetMetaSep = document.getElementById('hxd-profile-sheet-meta-sep');
    var profileSheetCountry = document.getElementById('hxd-profile-sheet-country');
    var profileStatMatches = document.getElementById('hxd-profile-stat-matches');
    var profileStatGoals = document.getElementById('hxd-profile-stat-goals');
    var profileStatTime = document.getElementById('hxd-profile-stat-time');
    var profileSheetMode = 'self';
    var SELF_PROFILE_STATS = { matches: '150', goals: '90', time: '142h' };
    var BANNER_STYLES = ['solid', 'dots', 'stars', 'space', 'grid'];
    var COUNTRY_CODES = ['br', 'ar', 'uy', 'cl', 'mx', 'es', 'pt', 'us'];
    var COUNTRIES = { br: 'Brasil', ar: 'Argentina', uy: 'Uruguay', cl: 'Chile', mx: 'México', es: 'España', pt: 'Portugal', us: 'USA' };
    var PROFILE_DEFAULTS = { banner: '#000000', accent: '#5865f2', bannerStyle: 'solid', country: 'br' };

    function normalizeBannerStyle(style) {
        return BANNER_STYLES.indexOf(style) >= 0 ? style : 'solid';
    }
    function normalizeCountry(code) {
        return COUNTRIES[code] ? code : PROFILE_DEFAULTS.country;
    }
    function setBannerStyleClass(el, style) {
        if (!el) return;
        for (var i = 0; i < BANNER_STYLES.length; i++) {
            el.classList.remove('is-banner-' + BANNER_STYLES[i]);
        }
        if (style && style !== 'solid') el.classList.add('is-banner-' + style);
    }
    function setFlagClass(el, code) {
        if (!el) return;
        code = normalizeCountry(code);
        for (var i = 0; i < COUNTRY_CODES.length; i++) {
            el.classList.remove('is-flag-' + COUNTRY_CODES[i]);
        }
        el.classList.add('is-flag-' + code);
    }
    function parseHexColor(hex) {
        hex = String(hex || '').replace('#', '');
        if (hex.length === 3) hex = hex.charAt(0) + hex.charAt(0) + hex.charAt(1) + hex.charAt(1) + hex.charAt(2) + hex.charAt(2);
        if (hex.length !== 6) return null;
        var c = {
            r: parseInt(hex.slice(0, 2), 16),
            g: parseInt(hex.slice(2, 4), 16),
            b: parseInt(hex.slice(4, 6), 16)
        };
        if (isNaN(c.r) || isNaN(c.g) || isNaN(c.b)) return null;
        return c;
    }
    function colorLuminance(c) {
        return (c.r * 299 + c.g * 587 + c.b * 114) / 1000;
    }
    function profileSheetTheme(accent) {
        var c = parseHexColor(accent) || parseHexColor(PROFILE_DEFAULTS.accent);
        var bg = 'rgb(' + c.r + ',' + c.g + ',' + c.b + ')';
        var light = colorLuminance(c) > 140;
        return {
            bg: bg,
            text: light ? '#111214' : '#f2f3f5',
            muted: light ? 'rgba(17,18,20,.58)' : 'rgba(242,243,245,.55)',
            divider: light ? 'rgba(17,18,20,.1)' : 'rgba(255,255,255,.06)',
            border: light ? 'rgba(17,18,20,.12)' : 'rgba(255,255,255,.07)',
            accentText: light ? '#111214' : '#ffffff',
            closeBg: light ? 'rgba(17,18,20,.08)' : 'rgba(0,0,0,.5)',
            closeColor: light ? '#111214' : '#ffffff',
            closeHover: light ? 'rgba(17,18,20,.14)' : 'rgba(0,0,0,.72)'
        };
    }

    function profileStorageKey() {
        var bootRef = window.__SPACE_LAUNCH || {};
        return bootRef.userId ? 'space_hub_profile_' + bootRef.userId : 'space_hub_profile';
    }
    function loadProfilePrefs() {
        try {
            var raw = localStorage.getItem(profileStorageKey());
            if (!raw) return Object.assign({}, PROFILE_DEFAULTS);
            var parsed = JSON.parse(raw);
            return {
                banner: parsed.banner || PROFILE_DEFAULTS.banner,
                accent: parsed.accent || PROFILE_DEFAULTS.accent,
                bannerStyle: normalizeBannerStyle(parsed.bannerStyle || PROFILE_DEFAULTS.bannerStyle),
                country: normalizeCountry(parsed.country || PROFILE_DEFAULTS.country)
            };
        } catch (eLoad) {
            return Object.assign({}, PROFILE_DEFAULTS);
        }
    }
    function saveProfilePrefs(prefs) {
        try { localStorage.setItem(profileStorageKey(), JSON.stringify(prefs)); } catch (eSave) {}
    }
    function applyProfilePrefs(prefs) {
        prefs = prefs || loadProfilePrefs();
        var style = normalizeBannerStyle(prefs.bannerStyle);
        var sheetTheme = profileSheetTheme(prefs.accent);
        document.documentElement.style.setProperty('--profile-banner', prefs.banner);
        document.documentElement.style.setProperty('--profile-accent', prefs.accent);
        document.documentElement.style.setProperty('--profile-accent-text', sheetTheme.accentText);
        document.documentElement.style.setProperty('--profile-sheet-bg', sheetTheme.bg);
        document.documentElement.style.setProperty('--profile-sheet-text', sheetTheme.text);
        document.documentElement.style.setProperty('--profile-sheet-muted', sheetTheme.muted);
        document.documentElement.style.setProperty('--profile-sheet-divider', sheetTheme.divider);
        document.documentElement.style.setProperty('--profile-sheet-border', sheetTheme.border);
        document.documentElement.style.setProperty('--profile-sheet-close-bg', sheetTheme.closeBg);
        document.documentElement.style.setProperty('--profile-sheet-close-color', sheetTheme.closeColor);
        document.documentElement.style.setProperty('--profile-sheet-close-hover', sheetTheme.closeHover);
        var banners = document.querySelectorAll('.hub-profile-pop-banner, .profile-sheet-banner, .hub-settings-preview-banner');
        for (var i = 0; i < banners.length; i++) {
            banners[i].style.background = '';
            setBannerStyleClass(banners[i], style);
        }
        var letters = document.querySelectorAll('.hub-av-letter, .hub-profile-pop-av-img.hub-av-letter');
        for (var j = 0; j < letters.length; j++) letters[j].style.background = prefs.accent;
        syncColorSwatches(prefs);
        if (bannerStyleWrap) {
            var styleBtns = bannerStyleWrap.querySelectorAll('.hub-banner-style');
            for (var k = 0; k < styleBtns.length; k++) {
                var btnStyle = styleBtns[k].getAttribute('data-banner-style');
                var active = btnStyle === style;
                styleBtns[k].classList.toggle('is-active', active);
                styleBtns[k].setAttribute('aria-pressed', active ? 'true' : 'false');
            }
        }
        var country = normalizeCountry(prefs.country);
        setFlagClass(profileSheetFlag, country);
        if (profileSheetCountryName) profileSheetCountryName.textContent = COUNTRIES[country];
        if (countryListWrap) {
            var countryBtns = countryListWrap.querySelectorAll('.hub-country-opt');
            for (var c = 0; c < countryBtns.length; c++) {
                var btnCountry = countryBtns[c].getAttribute('data-country');
                var countryActive = btnCountry === country;
                countryBtns[c].classList.toggle('is-active', countryActive);
                countryBtns[c].setAttribute('aria-pressed', countryActive ? 'true' : 'false');
            }
        }
    }
    function closeSettingsSheet() {
        /* Settings is a hub page now; modal retired. */
    }
    function openSettingsSheet() {
        closeProfilePop();
        closeProfileSheet();
        switchHubView('settings');
        showSettingsTab('profile');
    }
    function closeProfileSheet() {
        if (!profileSheet) return;
        profileSheet.classList.remove('is-open');
        profileSheet.setAttribute('aria-hidden', 'true');
        if (profileSheetMode !== 'self') restoreSelfProfileSheet();
    }
    function profileSheetAvatarHtml(user) {
        var url = '';
        if (user && user.avatar && String(user.avatar).indexOf('http') === 0) url = String(user.avatar);
        else if (user && user.avatar && user.discord_id) {
            url = 'https://cdn.discordapp.com/avatars/' + user.discord_id + '/' + user.avatar + '.png';
        }
        var name = String((user && (user.nick || user.username)) || 'Player');
        if (url) return '<img class="hub-profile-pop-av-img" src="' + escapeHtml(url) + '" alt=""/>';
        return '<span class="hub-profile-pop-av-img hub-av-letter">' +
            escapeHtml((name.charAt(0) || '?').toUpperCase()) + '</span>';
    }
    function fillProfileSheet(opts) {
        opts = opts || {};
        var user = opts.user || {
            discord_id: boot.userId || '',
            nick: boot.nick || 'Player',
            username: boot.username || 'user',
            avatar: boot.avatar || ''
        };
        var online = opts.online !== false;
        var stats = opts.stats || SELF_PROFILE_STATS;
        if (profileSheetAv) {
            profileSheetAv.innerHTML = profileSheetAvatarHtml(user);
            profileSheetAv.classList.toggle('is-offline', !online);
        }
        if (profileSheetName) profileSheetName.textContent = String(user.nick || user.username || 'Player');
        if (profileSheetStatus) {
            profileSheetStatus.innerHTML = online
                ? '<span class="hub-status-dot"></span>Online'
                : '<span class="hub-status-dot is-offline"></span>Offline';
        }
        if (profileSheetMetaSep) profileSheetMetaSep.hidden = !!opts.hideCountry;
        if (profileSheetCountry) profileSheetCountry.hidden = !!opts.hideCountry;
        if (!opts.hideCountry) {
            var prefs = loadProfilePrefs();
            var country = normalizeCountry(opts.country || prefs.country);
            setFlagClass(profileSheetFlag, country);
            if (profileSheetCountryName) profileSheetCountryName.textContent = COUNTRIES[country];
        }
        if (profileStatMatches) profileStatMatches.textContent = String(stats.matches != null ? stats.matches : '—');
        if (profileStatGoals) profileStatGoals.textContent = String(stats.goals != null ? stats.goals : '—');
        if (profileStatTime) profileStatTime.textContent = String(stats.time != null ? stats.time : '—');
    }
    function restoreSelfProfileSheet() {
        profileSheetMode = 'self';
        fillProfileSheet({
            user: {
                discord_id: boot.userId || '',
                nick: boot.nick || 'Player',
                username: boot.username || 'user',
                avatar: boot.avatar || ''
            },
            online: true,
            hideCountry: false,
            stats: SELF_PROFILE_STATS
        });
        applyProfilePrefs(loadProfilePrefs());
    }
    function openProfileSheet() {
        closeProfilePop();
        closeSettingsSheet();
        if (!profileSheet) return;
        restoreSelfProfileSheet();
        profileSheet.classList.add('is-open');
        profileSheet.setAttribute('aria-hidden', 'false');
    }
    function openFriendProfileSheet(friend) {
        if (!profileSheet || !friend) return;
        closeProfilePop();
        closeSettingsSheet();
        closeChatCtx();
        profileSheetMode = 'friend';
        fillProfileSheet({
            user: friend,
            online: false,
            hideCountry: true,
            stats: { matches: '—', goals: '—', time: '—' }
        });
        profileSheet.classList.add('is-open');
        profileSheet.setAttribute('aria-hidden', 'false');
    }
    function closeProfilePop() {
        if (!profilePop) return;
        profilePop.classList.remove('is-open');
        profilePop.setAttribute('aria-hidden', 'true');
        if (profileTrigger) profileTrigger.setAttribute('aria-expanded', 'false');
    }
    function openProfilePop() {
        if (!profilePop) return;
        profilePop.classList.add('is-open');
        profilePop.setAttribute('aria-hidden', 'false');
        if (profileTrigger) profileTrigger.setAttribute('aria-expanded', 'true');
    }
    if (profileTrigger && profilePop) {
        profileTrigger.addEventListener('click', function(e) {
            e.stopPropagation();
            if (profilePop.classList.contains('is-open')) closeProfilePop();
            else openProfilePop();
        });
        document.addEventListener('click', function(e) {
            if (profileSheet && profileSheet.classList.contains('is-open')) return;
            if (settingsSheet && settingsSheet.classList.contains('is-open')) return;
            if (!profilePop.classList.contains('is-open')) return;
            if (!profilePop.contains(e.target) && !profileTrigger.contains(e.target)) closeProfilePop();
        });
    }
    var socialPanelEl = document.getElementById('hub-riot-social');
    var socialMiniEl = document.getElementById('hub-social-mini');
    var socialCollapseBtn = document.getElementById('hub-social-collapse');
    var socialExpandBtn = document.getElementById('hub-social-expand');
    var socialMiniProfileBtn = document.getElementById('hub-social-mini-profile');
    var socialCollapsed = false;
    var SOCIAL_ICON_COLLAPSE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M10 7V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-2M15 12H3m0 0 3.5-3.5M3 12l3.5 3.5"/></svg>';
    var SOCIAL_ICON_EXPAND = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M20 4v16M14 12H4m0 0 3.5-3.5M4 12l3.5 3.5"/></svg>';
    function syncSocialCollapseBtn() {
        if (!socialCollapseBtn) return;
        if (socialCollapsed) {
            socialCollapseBtn.innerHTML = SOCIAL_ICON_EXPAND;
            socialCollapseBtn.title = 'Abrir social';
            socialCollapseBtn.setAttribute('aria-label', 'Abrir social');
        } else {
            socialCollapseBtn.innerHTML = SOCIAL_ICON_COLLAPSE;
            socialCollapseBtn.title = 'Minimizar';
            socialCollapseBtn.setAttribute('aria-label', 'Minimizar');
        }
    }
    function setSocialCollapsed(collapsed) {
        collapsed = !!collapsed;
        if (collapsed === socialCollapsed) return;
        socialCollapsed = collapsed;
        if (collapsed) {
            closeProfilePop();
            if (typeof hideFriendHover === 'function') hideFriendHover();
        }
        if (socialMiniEl) {
            socialMiniEl.hidden = true;
            socialMiniEl.classList.remove('is-open');
        }
        document.body.classList.toggle('is-hub-social-collapsed', collapsed);
        if (!socialPanelEl) return;
        socialPanelEl.classList.remove('is-fold-body', 'is-fold-out');
        socialPanelEl.classList.toggle('is-collapsed', collapsed);
        socialPanelEl.setAttribute('aria-hidden', 'false');
        syncSocialCollapseBtn();
        if (!collapsed) loadFriendsData({ silent: true });
    }
    if (socialCollapseBtn) {
        socialCollapseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            setSocialCollapsed(!socialCollapsed);
        });
    }
    if (socialExpandBtn) {
        socialExpandBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            setSocialCollapsed(false);
        });
    }
    if (socialMiniProfileBtn && profilePop) {
        socialMiniProfileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            setSocialCollapsed(false);
            setTimeout(function() {
                openProfilePop();
            }, 0);
        });
    }
    if (profilePopOpen) {
        profilePopOpen.addEventListener('click', function(e) {
            e.stopPropagation();
            openProfileSheet();
        });
    }
    if (profileSheet) {
        profileSheet.addEventListener('click', function(e) {
            if (e.target === profileSheet) closeProfileSheet();
        });
    }
    if (profileSheetClose) {
        profileSheetClose.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeProfileSheet();
        });
    }
    if (settingsSheet) {
        settingsSheet.addEventListener('click', function(e) {
            if (e.target === settingsSheet) closeSettingsSheet();
        });
    }
    if (settingsSheetClose) {
        settingsSheetClose.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeSettingsSheet();
        });
    }
    document.addEventListener('keydown', function(e) {
        if (e.key !== 'Escape') return;
        if (typeof hubCurrentView !== 'undefined' && hubCurrentView === 'settings') {
            switchHubView('play');
            return;
        }
        if (profileSheet && profileSheet.classList.contains('is-open')) {
            closeProfileSheet();
            return;
        }
        closeProfilePop();
    });
    applyProfilePrefs(loadProfilePrefs());
    function onColorSwatchClick(e) {
        var btn = e.target && e.target.closest ? e.target.closest('.riot-swatch[data-color]') : null;
        if (!btn) return;
        var kind = btn.getAttribute('data-color-kind');
        var color = btn.getAttribute('data-color');
        if (!color) return;
        var prefs = loadProfilePrefs();
        if (kind === 'accent') prefs.accent = color;
        else prefs.banner = color;
        saveProfilePrefs(prefs);
        applyProfilePrefs(prefs);
    }
    if (bannerSwatchWrap) bannerSwatchWrap.addEventListener('click', onColorSwatchClick);
    if (accentSwatchWrap) accentSwatchWrap.addEventListener('click', onColorSwatchClick);
    if (bannerStyleWrap) {
        bannerStyleWrap.addEventListener('click', function(e) {
            var btn = e.target.closest ? e.target.closest('.hub-banner-style') : null;
            if (!btn || !bannerStyleWrap.contains(btn)) return;
            var prefs = loadProfilePrefs();
            prefs.bannerStyle = btn.getAttribute('data-banner-style');
            saveProfilePrefs(prefs);
            applyProfilePrefs(prefs);
        });
    }
    if (countryListWrap) {
        countryListWrap.addEventListener('click', function(e) {
            var btn = e.target.closest ? e.target.closest('.hub-country-opt') : null;
            if (!btn || !countryListWrap.contains(btn)) return;
            var prefs = loadProfilePrefs();
            prefs.country = btn.getAttribute('data-country');
            saveProfilePrefs(prefs);
            applyProfilePrefs(prefs);
        });
    }
    var boot = window.__SPACE_LAUNCH || {};
    var base = '${base}';
    var primary = document.getElementById('hxd-launch-primary');
    var discordBtn = document.getElementById('hxd-launch-discord');
    var discordLabel = document.getElementById('hxd-launch-discord-label');
    var discordGoBtn = document.getElementById('hxd-launch-discord-go');
    var launchOverlay = document.getElementById('hxd-launch-overlay');
    var launchStepEl = document.getElementById('hxd-launch-overlay-step');
    var cacheBtn = document.getElementById('hxd-launch-cache');
    var folderBtn = document.getElementById('hxd-launch-folder');
    var cacheBtns = document.querySelectorAll('#hxd-launch-cache, [data-launch-action="cache"]');
    var folderBtns = document.querySelectorAll('#hxd-launch-folder, [data-launch-action="folder"]');
    var quitBtn = document.getElementById('hxd-launch-quit');
    var logoutBtn = document.getElementById('hxd-launch-logout');
    var settingsBtn = document.getElementById('hxd-launch-settings');
    var navPlayBtn = document.getElementById('hub-nav-play');
    var navLibraryBtn = document.getElementById('hub-nav-library');
    var navFriendsBtn = document.getElementById('hub-nav-friends');
    var hubViewPlay = document.getElementById('hub-view-play');
    var hubViewSpace = document.getElementById('hub-view-space');
    var hubViewLibrary = document.getElementById('hub-view-library');
    var hubViewFriendsHub = document.getElementById('hub-view-friends-hub');
    var hubViewSettings = document.getElementById('hub-view-settings');
    var hubViewFriends = document.getElementById('hub-view-friends');
    var hubCurrentView = 'play';
    var hubViewTransitionTimer = null;
    var settingsTabBtns = document.querySelectorAll('[data-settings-tab]');
    var settingsPanelProfile = document.getElementById('hub-settings-panel-profile');
    var settingsPanelClient = document.getElementById('hub-settings-panel-client');
    var settingsPanelAccounts = document.getElementById('hub-settings-panel-accounts');
    var accountsListEl = document.getElementById('hub-accounts-list');
    var accountsAddBtn = document.getElementById('hxd-accounts-add');
    var accountsState = { active_discord_id: '', accounts: [], loading: false };
    var settingsPreviewOpen = document.getElementById('hxd-settings-preview-open');
    var hubNavLinks = document.getElementById('hub-nav-links');
    var hubTopTitle = document.querySelector('.hx-top-title');
    var st = document.getElementById('hxd-launch-status');
    var settingsSt = document.getElementById('hxd-settings-status');
    var launchAnimActive = false;
    var launchStepTimer = null;
    var authPollTimer = null;
    var logoutInProgress = false;
    var STEPS = ['Preparing client…', 'Loading extensions…', 'Connecting to HaxBall…', 'Entering the pitch…'];

    function escapeHtml(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function showSettingsTab(tab) {
        tab = tab || 'profile';
        if (settingsPanelProfile) {
            settingsPanelProfile.hidden = tab !== 'profile';
            settingsPanelProfile.classList.toggle('is-active', tab === 'profile');
        }
        if (settingsPanelAccounts) {
            settingsPanelAccounts.hidden = tab !== 'accounts';
            settingsPanelAccounts.classList.toggle('is-active', tab === 'accounts');
        }
        if (settingsPanelClient) {
            settingsPanelClient.hidden = tab !== 'client';
            settingsPanelClient.classList.toggle('is-active', tab === 'client');
        }
        for (var i = 0; i < settingsTabBtns.length; i++) {
            var btnTab = settingsTabBtns[i].getAttribute('data-settings-tab');
            var active = btnTab === tab;
            settingsTabBtns[i].classList.toggle('is-active', active);
            settingsTabBtns[i].setAttribute('aria-current', active ? 'page' : 'false');
        }
        if (tab === 'accounts') loadAccountsList();
    }

    function accountAvatarHtml(acc) {
        var url = '';
        if (acc && acc.avatar && String(acc.avatar).indexOf('http') === 0) url = String(acc.avatar);
        else if (acc && acc.avatar && acc.discord_id) {
            url = 'https://cdn.discordapp.com/avatars/' + acc.discord_id + '/' + acc.avatar + '.png';
        }
        var name = String((acc && (acc.nick || acc.username)) || '?');
        if (url) return '<img class="hx-account-av" src="' + escapeHtml(url) + '" alt=""/>';
        return '<span class="hx-account-av">' + escapeHtml((name.charAt(0) || '?').toUpperCase()) + '</span>';
    }
    function renderAccountsList() {
        if (!accountsListEl) return;
        if (!accountsState.accounts.length) {
            accountsListEl.innerHTML = '<li class="hx-account-row"><div class="hx-account-meta"><span class="hx-account-name">No saved accounts</span><span class="hx-account-sub">Add one with Discord</span></div></li>';
            return;
        }
        accountsListEl.innerHTML = accountsState.accounts.map(function(acc) {
            var isActive = String(acc.discord_id) === String(accountsState.active_discord_id);
            var actions = isActive
                ? '<span class="hx-friend-badge">Active</span>' +
                  '<button type="button" class="hx-account-btn is-danger" data-account-action="remove" data-discord-id="' + escapeHtml(String(acc.discord_id)) + '">Remove</button>'
                : '<button type="button" class="hx-account-btn is-primary" data-account-action="switch" data-discord-id="' + escapeHtml(String(acc.discord_id)) + '">Switch</button>' +
                  '<button type="button" class="hx-account-btn is-danger" data-account-action="remove" data-discord-id="' + escapeHtml(String(acc.discord_id)) + '">Remove</button>';
            return '<li class="hx-account-row' + (isActive ? ' is-active' : '') + '">' +
                accountAvatarHtml(acc) +
                '<div class="hx-account-meta">' +
                  '<span class="hx-account-name">' + escapeHtml(acc.nick || acc.username || 'Player') + '</span>' +
                  '<span class="hx-account-sub">@' + escapeHtml(acc.username || 'user') + '</span>' +
                '</div>' +
                '<div class="hx-account-actions">' + actions + '</div>' +
            '</li>';
        }).join('');
    }
    function loadAccountsList() {
        return fetch(base + '/accounts', { cache: 'no-store' })
            .then(function(r) { return r.json(); })
            .then(function(data) {
                accountsState.active_discord_id = (data && data.active_discord_id) || '';
                accountsState.accounts = (data && data.accounts) || [];
                renderAccountsList();
            })
            .catch(function() {
                accountsState.accounts = [];
                renderAccountsList();
            });
    }
    function switchAccount(discordId) {
        setStatus('Switching account…');
        return fetch(base + '/accounts/switch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ discord_id: discordId })
        }).then(function(r) { return r.json().then(function(j) { return { ok: r.ok, json: j }; }); })
          .then(function(result) {
              if (!result.ok) throw new Error((result.json && result.json.error) || 'Switch failed');
              setStatus('Account switched.', 'ok');
              setTimeout(reloadLauncher, 500);
          })
          .catch(function(err) {
              setStatus((err && err.message) || 'Switch failed.', 'err');
          });
    }
    function removeSavedAccount(discordId) {
        setStatus('Removing account…');
        return fetch(base + '/accounts/remove', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ discord_id: discordId })
        }).then(function(r) { return r.json().then(function(j) { return { ok: r.ok, json: j }; }); })
          .then(function(result) {
              if (!result.ok) throw new Error((result.json && result.json.error) || 'Remove failed');
              if (result.json && result.json.logged_in === false) {
                  setStatus('Signed out.', 'ok');
                  setTimeout(reloadLauncher, 700);
                  return;
              }
              if (String(discordId) === String(boot.userId)) {
                  setStatus('Account removed.', 'ok');
                  setTimeout(reloadLauncher, 500);
                  return;
              }
              setStatus('Account removed.', 'ok');
              loadAccountsList();
          })
          .catch(function(err) {
              setStatus((err && err.message) || 'Remove failed.', 'err');
          });
    }
    function addDiscordAccount() {
        setStatus('Opening Discord…');
        fetch(base + '/accounts/add', { method: 'POST' }).catch(function() {});
        var started = Date.now();
        var prevId = String(boot.userId || '');
        if (authPollTimer) clearInterval(authPollTimer);
        authPollTimer = setInterval(function() {
            fetchUser().then(function(data) {
                var nextId = data && data.discord_id ? String(data.discord_id) : '';
                if (data && data.logged_in && nextId && nextId !== prevId) {
                    clearInterval(authPollTimer);
                    authPollTimer = null;
                    setStatus('Account added.', 'ok');
                    setTimeout(reloadLauncher, 700);
                } else if (Date.now() - started > 120000) {
                    clearInterval(authPollTimer);
                    authPollTimer = null;
                    setStatus('Timed out. Try again.', 'err');
                }
            });
        }, 1200);
    }

    var friendsSearchInput = document.getElementById('hub-friends-search');
    var friendsListEl = document.getElementById('hub-friends-list');
    var friendsSearchListEl = document.getElementById('hub-friends-search-list');
    var friendsEmptyEl = document.getElementById('hub-friends-empty');
    var friendsStatusEl = document.getElementById('hub-friends-status');
    var friendsCountLabelEl = document.getElementById('hub-friends-count-label');
    var friendsPillEl = document.getElementById('hub-friends-pill');
    var friendsReqCountEl = document.getElementById('hub-friends-req-count');
    var friendsIncomingEl = document.getElementById('hub-friends-incoming');
    var friendsOutgoingEl = document.getElementById('hub-friends-outgoing');
    var friendsRequestsEmptyEl = document.getElementById('hub-friends-requests-empty');
    var friendsRequestsBodyEl = document.getElementById('hub-friends-requests-body');
    var friendsPanelList = document.getElementById('hub-friends-panel-list');
    var friendsPanelGroups = document.getElementById('hub-friends-panel-groups');
    var friendsPanelRequests = document.getElementById('hub-friends-panel-requests');
    var friendsTabListBtn = document.getElementById('hub-friends-tab-list');
    var friendsTabGroupsBtn = document.getElementById('hub-friends-tab-groups');
    var friendsTabRequestsBtn = document.getElementById('hub-friends-tab-requests');
    var friendsTabsEl = document.getElementById('hub-friends-tabs');
    var friendsTabInkEl = document.getElementById('hub-friends-tab-ink');
    function syncFriendsTabInk() {
        if (!friendsTabsEl || !friendsTabInkEl) return;
        var active = friendsTabsEl.querySelector('.riot-social-tab.is-active');
        if (!active) return;
        var left = active.offsetLeft;
        var width = active.offsetWidth;
        friendsTabInkEl.style.width = width + 'px';
        friendsTabInkEl.style.transform = 'translateX(' + left + 'px)';
    }
    var friendsGroupsListEl = document.getElementById('hub-friends-groups-list');
    var friendsGroupsEmptyEl = document.getElementById('hub-friends-groups-empty');
    var friendsGroupsCountEl = document.getElementById('hub-friends-groups-count');
    var groupModalEl = document.getElementById('hub-group-modal');
    var groupModalCloseEl = document.getElementById('hub-group-modal-close');
    var groupFormEl = document.getElementById('hub-group-form');
    var groupNameEl = document.getElementById('hub-group-name');
    var groupLimitEl = document.getElementById('hub-group-limit');
    var groupHintEl = document.getElementById('hub-group-hint');
    var groupPicksEl = document.getElementById('hub-group-friend-picks');
    var groupStatusEl = document.getElementById('hub-group-status');
    var groupCancelEl = document.getElementById('hub-group-cancel');
    var groupSubmitEl = document.getElementById('hub-group-submit');
    var friendHoverEl = document.getElementById('hub-friend-hover');
    var friendHoverAvEl = document.getElementById('hub-friend-hover-av');
    var friendHoverNameEl = document.getElementById('hub-friend-hover-name');
    var friendHoverTagEl = document.getElementById('hub-friend-hover-tag');
    var friendHoverStatusTextEl = document.getElementById('hub-friend-hover-status-text');
    var chatCloseBtn = document.getElementById('hub-chat-close');
    var chatMoreBtn = document.getElementById('hub-chat-more');
    var friendHoverTimer = null;
    var friendHoverId = '';
    var friendsState = {
        tab: 'list',
        friends: [],
        groups: [],
        groupMembers: {},
        incoming: [],
        outgoing: [],
        searchResults: [],
        searchQuery: '',
        loaded: false,
        loading: false,
        searchTimer: null,
        refreshTimer: null,
        activeFriendId: '',
        activeGroupId: '',
        messages: [],
        lastMessageId: 0,
        chatPollTimer: null,
        chatLoading: false,
        chatLoadGen: 0,
        chatSending: false,
        pinnedMessageId: '',
        ctxMessageId: '',
        knownMsgIds: {},
        isPlus: !!boot.isPlus,
        maxMembers: boot.isPlus ? 15 : 4,
        groupsLoaded: false,
        createSelected: {}
    };
    var chatEmptyEl = document.getElementById('hub-chat-empty');
    var chatActiveEl = document.getElementById('hub-chat-active');
    var chatAvEl = document.getElementById('hub-chat-av');
    var chatNameEl = document.getElementById('hub-chat-name');
    var chatSubEl = document.getElementById('hub-chat-sub');
    var chatPeerBtn = document.getElementById('hub-chat-peer');
    var chatMessagesEl = document.getElementById('hub-chat-messages');
    var chatFormEl = document.getElementById('hub-chat-form');
    var chatInputEl = document.getElementById('hub-chat-input');
    var chatSendEl = document.getElementById('hub-chat-send');
    var chatRemoveBtn = document.getElementById('hub-chat-remove');
    var chatMeAvEl = document.getElementById('hub-chat-me-av');
    var friendsAddBtn = document.getElementById('hub-friends-add');
    var chatEmojiBtn = document.getElementById('hub-chat-emoji');
    var chatEmojiPanel = document.getElementById('hub-chat-emoji-panel');
    var chatPinEl = document.getElementById('hub-chat-pin');
    var chatPinTextEl = document.getElementById('hub-chat-pin-text');
    var chatPinClearEl = document.getElementById('hub-chat-pin-clear');
    var chatCtxEl = document.getElementById('hub-chat-ctx');
    var CHAT_EMOJIS = ['😀','😁','😂','🤣','😊','😍','😘','😎','🤔','😴','😭','😡','👍','👎','👏','🙏','🔥','✨','💯','❤️','💙','💜','💀','👀','🎮','⚽','🏆','⚡','✅','❌','🎉','😅','🥲','😈','👻','🐧','🐱','🐶','🍕','☕'];
    function pinStorageKey() {
        return 'space_chat_pins_' + String(boot.userId || 'guest');
    }
    function readPinMap() {
        try {
            return JSON.parse(localStorage.getItem(pinStorageKey()) || '{}') || {};
        } catch (ePin) {
            return {};
        }
    }
    function writePinMap(map) {
        try {
            localStorage.setItem(pinStorageKey(), JSON.stringify(map || {}));
        } catch (eWrite) {}
    }
    function getPinnedForFriend(friendId) {
        var map = readPinMap();
        return map[String(friendId || '')] || null;
    }
    function setPinnedForFriend(friendId, payload) {
        var map = readPinMap();
        if (!payload) delete map[String(friendId || '')];
        else map[String(friendId || '')] = payload;
        writePinMap(map);
    }
    function pinChatKey() {
        if (friendsState.activeGroupId) return 'g:' + String(friendsState.activeGroupId);
        return String(friendsState.activeFriendId || '');
    }
    function getPinnedForActiveChat() {
        return getPinnedForFriend(pinChatKey());
    }
    function setPinnedForActiveChat(payload) {
        setPinnedForFriend(pinChatKey(), payload);
    }
    function renderPinnedBar() {
        var pinned = getPinnedForActiveChat();
        friendsState.pinnedMessageId = pinned && pinned.id != null ? String(pinned.id) : '';
        if (!chatPinEl) return;
        if (!pinned || !pinned.body) {
            chatPinEl.hidden = true;
            if (chatPinTextEl) chatPinTextEl.textContent = '';
            return;
        }
        chatPinEl.hidden = false;
        if (chatPinTextEl) chatPinTextEl.textContent = String(pinned.body);
    }
    function closeChatCtx() {
        friendsState.ctxMessageId = '';
        if (chatCtxEl) chatCtxEl.hidden = true;
    }
    function openChatCtx(messageId, x, y) {
        if (!chatCtxEl) return;
        var msg = null;
        for (var i = 0; i < friendsState.messages.length; i++) {
            if (String(friendsState.messages[i].id) === String(messageId)) {
                msg = friendsState.messages[i];
                break;
            }
        }
        if (!msg) return;
        friendsState.ctxMessageId = String(messageId);
        var delBtn = chatCtxEl.querySelector('[data-ctx-action="delete"]');
        if (delBtn) delBtn.disabled = !msg.mine;
        chatCtxEl.hidden = false;
        var pad = 8;
        var w = chatCtxEl.offsetWidth || 168;
        var h = chatCtxEl.offsetHeight || 120;
        var left = Math.min(Math.max(pad, x), window.innerWidth - w - pad);
        var top = Math.min(Math.max(pad, y), window.innerHeight - h - pad);
        chatCtxEl.style.left = left + 'px';
        chatCtxEl.style.top = top + 'px';
    }
    function closeEmojiPanel() {
        if (chatEmojiPanel) chatEmojiPanel.hidden = true;
        if (chatEmojiBtn) {
            chatEmojiBtn.classList.remove('is-open');
            chatEmojiBtn.setAttribute('aria-expanded', 'false');
        }
    }
    function openEmojiPanel() {
        if (!chatEmojiPanel) return;
        if (!chatEmojiPanel.childNodes.length) {
            chatEmojiPanel.innerHTML = CHAT_EMOJIS.map(function(emoji) {
                return '<button type="button" class="hx-dc-emoji-btn" data-emoji="' + emoji + '" role="option">' + emoji + '</button>';
            }).join('');
        }
        chatEmojiPanel.hidden = false;
        if (chatEmojiBtn) {
            chatEmojiBtn.classList.add('is-open');
            chatEmojiBtn.setAttribute('aria-expanded', 'true');
        }
    }
    function insertChatEmoji(emoji) {
        if (!chatInputEl || !emoji) return;
        var start = chatInputEl.selectionStart != null ? chatInputEl.selectionStart : chatInputEl.value.length;
        var end = chatInputEl.selectionEnd != null ? chatInputEl.selectionEnd : chatInputEl.value.length;
        var next = chatInputEl.value.slice(0, start) + emoji + chatInputEl.value.slice(end);
        if (next.length > 1000) return;
        chatInputEl.value = next;
        var caret = start + emoji.length;
        chatInputEl.focus();
        try {
            chatInputEl.setSelectionRange(caret, caret);
        } catch (eCaret) {}
    }

    function avatarUrlFor(user) {
        if (!user) return '';
        if (user.avatar && String(user.avatar).indexOf('http') === 0) {
            var remote = String(user.avatar);
            return remote.indexOf('?') >= 0 ? remote : remote + (remote.indexOf('cdn.discordapp.com') >= 0 ? '?size=64' : '');
        }
        if (user.avatar && user.discord_id) {
            var hash = String(user.avatar).replace(/\.(png|jpg|jpeg|webp)$/i, '');
            return 'https://cdn.discordapp.com/avatars/' + user.discord_id + '/' + hash + '.png?size=64';
        }
        return '';
    }
    function friendDisplayName(user) {
        return String((user && (user.nick || user.username)) || 'Player');
    }
    function setFriendsStatus(msg, cls) {
        if (!friendsStatusEl) return;
        var text = friendlyHubError(msg);
        friendsStatusEl.textContent = text || '';
        friendsStatusEl.className = 'hx-friends-status' + (cls && text ? ' is-' + cls : '');
    }
    function friendlyHubError(msg) {
        var text = String(msg || '').trim();
        if (!text) return '';
        if (/backend\s*timeout|timeout|unavailable|econn|enotfound|etimedout|network error|failed to fetch/i.test(text)) {
            return '';
        }
        return text;
    }
    function friendsApi(path, options) {
        options = options || {};
        return fetch(base + path, {
            method: options.method || 'GET',
            headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
            body: options.body ? JSON.stringify(options.body) : undefined,
            cache: 'no-store'
        }).then(function(r) {
            return r.json().catch(function() { return {}; }).then(function(json) {
                var payload = json || {};
                if (payload.error && /backend\s*timeout|timeout|unavailable/i.test(String(payload.error))) {
                    payload = Object.assign({}, payload, { error: '' });
                }
                return { ok: r.ok, status: r.status, json: payload };
            });
        });
    }
    function updateFriendsCounts() {
        var count = friendsState.friends.length;
        var reqCount = friendsState.incoming.length + friendsState.outgoing.length;
        var unreadTotal = 0;
        for (var i = 0; i < friendsState.friends.length; i++) {
            var friend = friendsState.friends[i];
            if (String(friend.discord_id) === String(friendsState.activeFriendId)) continue;
            unreadTotal += Number(friend.unread) || 0;
        }
        for (var g = 0; g < friendsState.groups.length; g++) {
            var group = friendsState.groups[g];
            if (String(group.id) === String(friendsState.activeGroupId)) continue;
            unreadTotal += Number(group.unread) || 0;
        }
        if (friendsCountLabelEl) {
            friendsCountLabelEl.textContent = count ? ('Desconectado ' + count) : 'Desconectado';
        }
        if (friendsPillEl) {
            friendsPillEl.textContent = String(unreadTotal || count || 0);
            friendsPillEl.hidden = !(unreadTotal || count);
        }
        if (friendsReqCountEl) {
            friendsReqCountEl.textContent = String(reqCount);
            friendsReqCountEl.hidden = !(reqCount > 0);
        }
        if (friendsGroupsCountEl) {
            var gUnread = 0;
            for (var gu = 0; gu < friendsState.groups.length; gu++) {
                if (String(friendsState.groups[gu].id) === String(friendsState.activeGroupId)) continue;
                gUnread += Number(friendsState.groups[gu].unread) || 0;
            }
            friendsGroupsCountEl.textContent = String(gUnread);
            friendsGroupsCountEl.hidden = !(gUnread > 0);
        }
    }
    function clearLocalGroupUnread(groupId) {
        groupId = String(groupId || '');
        for (var i = 0; i < friendsState.groups.length; i++) {
            if (String(friendsState.groups[i].id) === groupId) {
                if (Number(friendsState.groups[i].unread) > 0) {
                    friendsState.groups[i].unread = 0;
                    return true;
                }
                return false;
            }
        }
        return false;
    }
    function findGroupById(groupId) {
        groupId = String(groupId || '');
        for (var i = 0; i < friendsState.groups.length; i++) {
            if (String(friendsState.groups[i].id) === groupId) return friendsState.groups[i];
        }
        return null;
    }
    function clearLocalUnread(friendId) {
        friendId = String(friendId || '');
        if (!friendId) return false;
        var changed = false;
        for (var i = 0; i < friendsState.friends.length; i++) {
            if (String(friendsState.friends[i].discord_id) === friendId) {
                if (Number(friendsState.friends[i].unread) > 0) {
                    friendsState.friends[i].unread = 0;
                    changed = true;
                }
                break;
            }
        }
        return changed;
    }
    function hideFriendHover() {
        if (friendHoverTimer) {
            clearTimeout(friendHoverTimer);
            friendHoverTimer = null;
        }
        friendHoverId = '';
        if (friendHoverEl) {
            friendHoverEl.classList.remove('is-visible');
            friendHoverEl.setAttribute('aria-hidden', 'true');
            setTimeout(function() {
                if (!friendHoverEl.classList.contains('is-visible')) {
                    friendHoverEl.hidden = true;
                }
            }, 220);
        }
    }
    function showFriendHover(friend, anchorEl) {
        if (!friendHoverEl || !friend || !anchorEl) return;
        friendHoverId = String(friend.discord_id || '');
        var name = friendDisplayName(friend);
        var tag = '#' + String((friend.username || 'user')).replace(/^#/, '');
        if (friendHoverNameEl) friendHoverNameEl.textContent = name;
        if (friendHoverTagEl) friendHoverTagEl.textContent = tag;
        if (friendHoverStatusTextEl) friendHoverStatusTextEl.textContent = 'Desconectado';
        if (friendHoverAvEl) {
            var url = avatarUrlFor(friend);
            friendHoverAvEl.innerHTML = url
                ? '<img src="' + escapeHtml(url) + '" alt=""/>'
                : '<span>' + escapeHtml((name.charAt(0) || '?').toUpperCase()) + '</span>';
        }
        var rect = anchorEl.getBoundingClientRect();
        var cardW = 260;
        var cardH = Math.max(friendHoverEl.offsetHeight || 190, 190);
        var left = rect.left - cardW - 10;
        var top = rect.top + (rect.height / 2) - 40;
        if (left < 12) left = 12;
        if (top < 12) top = 12;
        if (top + cardH > window.innerHeight - 12) top = Math.max(12, window.innerHeight - cardH - 12);
        friendHoverEl.style.left = left + 'px';
        friendHoverEl.style.top = top + 'px';
        friendHoverEl.hidden = false;
        friendHoverEl.setAttribute('aria-hidden', 'false');
        requestAnimationFrame(function() {
            friendHoverEl.classList.add('is-visible');
        });
    }
    function scheduleFriendHover(friend, anchorEl) {
        if (friendHoverTimer) clearTimeout(friendHoverTimer);
        friendHoverTimer = setTimeout(function() {
            friendHoverTimer = null;
            showFriendHover(friend, anchorEl);
        }, 120);
    }
    function keepFriendHover() {
        if (friendHoverTimer) {
            clearTimeout(friendHoverTimer);
            friendHoverTimer = null;
        }
    }
    function delayHideFriendHover() {
        if (friendHoverTimer) clearTimeout(friendHoverTimer);
        friendHoverTimer = setTimeout(hideFriendHover, 220);
    }
    function renderFriendAvatar(user, status) {
        var url = avatarUrlFor(user);
        var name = friendDisplayName(user);
        var av = url
            ? '<img class="hx-friend-av" src="' + escapeHtml(url) + '" alt="" decoding="async" referrerpolicy="no-referrer"/>'
            : '<span class="hx-friend-av hub-av-letter">' + escapeHtml((name.charAt(0) || '?').toUpperCase()) + '</span>';
        if (!status) return av;
        var badgeClass = status === 'online' ? 'is-online' : 'is-offline';
        return '<span class="hx-friend-av-wrap">' + av +
            '<span class="hx-friend-av-badge ' + badgeClass + '" aria-hidden="true"></span></span>';
    }
    if (chatMeAvEl) chatMeAvEl.innerHTML = renderFriendAvatar({
        discord_id: boot.userId || '',
        nick: boot.nick || 'You',
        username: boot.username || 'you',
        avatar: boot.avatar || ''
    });
    function renderFriendRow(user, opts) {
        opts = opts || {};
        var name = friendDisplayName(user);
        var sub = opts.subtitle || ('@' + String((user && user.username) || 'user'));
        var actions = opts.actionsHtml || '';
        var activeClass = opts.active ? ' is-active' : '';
        var openAttr = opts.openChat ? ' data-open-chat="1"' : '';
        var unread = Number(user && user.unread) || 0;
        if (opts.openChat && String(user.discord_id) === String(friendsState.activeFriendId)) unread = 0;
        var unreadHtml = (opts.openChat && unread > 0)
            ? '<span class="hx-friend-unread">' + escapeHtml(String(unread > 99 ? '99+' : unread)) + '</span>'
            : '';
        return '' +
            '<li class="hx-friend-row' + activeClass + '" data-discord-id="' + escapeHtml(String(user.discord_id || '')) + '"' + openAttr + '>' +
              renderFriendAvatar(user, opts.status || 'offline') +
              '<div class="hx-friend-meta">' +
                '<span class="hx-friend-name">' + escapeHtml(name) + '</span>' +
                '<span class="hx-friend-status">' + escapeHtml(sub) + '</span>' +
              '</div>' +
              unreadHtml +
              (actions ? '<div class="hx-friend-actions">' + actions + '</div>' : '') +
            '</li>';
    }
    function actionBtn(label, action, extraClass, extraAttrs) {
        return '<button type="button" class="hx-friend-action' + (extraClass ? ' ' + extraClass : '') +
            '" data-friends-action="' + escapeHtml(action) + '"' +
            (extraAttrs || '') + '>' + escapeHtml(label) + '</button>';
    }
    function findFriendById(id) {
        id = String(id || '');
        for (var i = 0; i < friendsState.friends.length; i++) {
            if (String(friendsState.friends[i].discord_id) === id) return friendsState.friends[i];
        }
        return null;
    }
    function stopChatPoll() {
        if (friendsState.chatPollTimer) {
            clearInterval(friendsState.chatPollTimer);
            friendsState.chatPollTimer = null;
        }
    }
    function formatChatTime(value) {
        try {
            var d = new Date(value);
            if (isNaN(d.getTime())) return '';
            return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        } catch (eTime) {
            return '';
        }
    }
    function formatChatDay(value) {
        try {
            var d = new Date(value);
            if (isNaN(d.getTime())) return '';
            return d.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
        } catch (eDay) {
            return '';
        }
    }
    function dayKey(value) {
        try {
            var d = new Date(value);
            if (isNaN(d.getTime())) return '';
            return d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
        } catch (eKey) {
            return '';
        }
    }
    function selfUser() {
        return {
            discord_id: boot.userId || '',
            nick: boot.nick || 'You',
            username: boot.username || 'you',
            avatar: boot.avatar || ''
        };
    }
    function msgAvatarHtml(user) {
        var url = avatarUrlFor(user);
        var name = friendDisplayName(user);
        if (url) return '<img src="' + escapeHtml(url) + '" alt=""/>';
        return '<span>' + escapeHtml((name.charAt(0) || '?').toUpperCase()) + '</span>';
    }
    function msgStamp(value) {
        try {
            var d = new Date(value);
            if (isNaN(d.getTime())) return 0;
            return d.getTime();
        } catch (eStamp) {
            return 0;
        }
    }
    function sameChatGroup(a, b) {
        if (!a || !b) return false;
        if (!!a.mine !== !!b.mine) return false;
        if (String(a.from_discord_id || '') !== String(b.from_discord_id || '')) return false;
        if (dayKey(a.created_at) !== dayKey(b.created_at)) return false;
        var gap = Math.abs(msgStamp(b.created_at) - msgStamp(a.created_at));
        return gap <= 7 * 60 * 1000;
    }
    function renderChatMessages(opts) {
        opts = opts || {};
        if (!chatMessagesEl) return;
        var stick = opts.forceStick || (chatMessagesEl.scrollTop + chatMessagesEl.clientHeight >= chatMessagesEl.scrollHeight - 40);
        var animateNew = !!opts.animateNew;
        if (opts.resetKnown) friendsState.knownMsgIds = {};
        var activeFriend = findFriendById(friendsState.activeFriendId) || {
            discord_id: friendsState.activeFriendId,
            nick: (chatNameEl && chatNameEl.textContent) || 'Friend',
            username: 'user',
            avatar: ''
        };
        var me = selfUser();
        var html = '';
        var lastDay = '';
        var nextKnown = {};
        var msgs = friendsState.messages;
        var isGroupChat = !!friendsState.activeGroupId;
        for (var i = 0; i < msgs.length; i++) {
            var msg = msgs[i];
            var msgId = String(msg.id || '');
            var isNew = animateNew && msgId && !friendsState.knownMsgIds[msgId];
            var key = dayKey(msg.created_at);
            var dayBreak = !!(key && key !== lastDay);
            if (dayBreak) {
                lastDay = key;
                html += '<div class="hx-dc-day' + (isNew ? ' is-enter' : '') + '"><span>' + escapeHtml(formatChatDay(msg.created_at)) + '</span></div>';
            }
            var prev = i > 0 ? msgs[i - 1] : null;
            var sameAsPrev = !dayBreak && sameChatGroup(prev, msg);
            var isGroupStart = !sameAsPrev;
            var author = msg.mine
                ? me
                : (msg.from || (isGroupChat
                    ? { discord_id: msg.from_discord_id, nick: 'Member', username: 'user', avatar: '' }
                    : activeFriend));
            var classes = 'hx-dc-msg' +
                (msg.mine ? ' is-mine' : '') +
                (sameAsPrev ? ' is-continued' : '') +
                (isGroupStart ? ' is-group-start' : '') +
                (msg.pending ? ' is-pending' : '') +
                (isNew ? ' is-enter' : '');
            var avInner = isGroupStart ? msgAvatarHtml(author) : '';
            var top = '';
            if (isGroupStart) {
                top = '<div class="hx-dc-msg-top"><span class="hx-dc-msg-author' +
                    (!msg.mine && isGroupChat ? ' hx-dc-msg-author-other' : '') +
                    '">' +
                    escapeHtml(friendDisplayName(author)) + '</span></div>';
            }
            var pinnedClass = (friendsState.pinnedMessageId && String(friendsState.pinnedMessageId) === msgId) ? ' is-pinned' : '';
            if (msgId) nextKnown[msgId] = true;
            html +=
                '<div class="' + classes + pinnedClass + '" data-msg-id="' + escapeHtml(msgId) + '">' +
                  '<div class="hx-dc-msg-av' + (isGroupStart ? '' : ' is-spacer') + '">' + avInner + '</div>' +
                  '<div class="hx-dc-msg-main">' +
                    top +
                    '<div class="hx-dc-msg-body">' + escapeHtml(msg.body) +
                      '<span class="hx-dc-msg-time">' + escapeHtml(formatChatTime(msg.created_at)) + '</span>' +
                    '</div>' +
                  '</div>' +
                '</div>';
        }
        chatMessagesEl.innerHTML = html;
        friendsState.knownMsgIds = nextKnown;
        var chatHintEl = document.getElementById('hub-chat-hint');
        if (chatHintEl) chatHintEl.hidden = msgs.length > 0;
        if (stick) {
            requestAnimationFrame(function() {
                chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
            });
        }
    }
    function mergeChatMessages(incoming) {
        if (!incoming || !incoming.length) return 0;
        var seen = {};
        for (var i = 0; i < friendsState.messages.length; i++) {
            seen[String(friendsState.messages[i].id)] = true;
        }
        var added = 0;
        for (var j = 0; j < incoming.length; j++) {
            var msg = incoming[j];
            var key = String(msg && msg.id != null ? msg.id : '');
            if (!key || seen[key]) continue;
            seen[key] = true;
            friendsState.messages.push(msg);
            added += 1;
        }
        if (friendsState.messages.length) {
            var maxId = 0;
            for (var k = 0; k < friendsState.messages.length; k++) {
                var nid = Number(friendsState.messages[k].id);
                if (nid > maxId) maxId = nid;
            }
            if (maxId > 0) friendsState.lastMessageId = maxId;
        }
        return added;
    }
    function removeChatMessagesByIds(ids) {
        if (!ids || !ids.length) return 0;
        var drop = {};
        for (var i = 0; i < ids.length; i++) drop[String(ids[i])] = true;
        var before = friendsState.messages.length;
        friendsState.messages = friendsState.messages.filter(function(msg) {
            return !drop[String(msg.id)];
        });
        return before - friendsState.messages.length;
    }
    function deleteChatMessage(messageId) {
        messageId = String(messageId || '').trim();
        if (!messageId || (!friendsState.activeFriendId && !friendsState.activeGroupId)) return Promise.resolve();
        var msgEl = chatMessagesEl
            ? chatMessagesEl.querySelector('.hx-dc-msg[data-msg-id="' + messageId.replace(/"/g, '') + '"]')
            : null;
        if (msgEl) msgEl.classList.add('is-leave');
        var finish = function() {
            var path = friendsState.activeGroupId
                ? '/groups/' + encodeURIComponent(friendsState.activeGroupId) + '/messages/' + encodeURIComponent(messageId)
                : '/friends/' + encodeURIComponent(friendsState.activeFriendId) + '/messages/' + encodeURIComponent(messageId);
            return friendsApi(path, { method: 'DELETE' }).then(function(result) {
                if (handleFriendsAuthError(result)) return;
                if (!result.ok) throw new Error((result.json && result.json.error) || 'Delete failed');
                removeChatMessagesByIds([messageId]);
                delete friendsState.knownMsgIds[messageId];
                if (String(friendsState.pinnedMessageId) === messageId) {
                    setPinnedForActiveChat(null);
                }
                renderPinnedBar();
                renderChatMessages();
            }).catch(function(err) {
                if (msgEl) msgEl.classList.remove('is-leave');
                setFriendsStatus((err && err.message) || 'Delete failed.', 'err');
            });
        };
        return new Promise(function(resolve) {
            setTimeout(function() { resolve(finish()); }, msgEl ? 180 : 0);
        });
    }
    function markChatRead() {
        if (friendsState.activeGroupId) {
            clearLocalGroupUnread(friendsState.activeGroupId);
            updateFriendsCounts();
            renderFriendsPanels();
            return Promise.resolve();
        }
        if (!friendsState.activeFriendId) return Promise.resolve();
        var changed = clearLocalUnread(friendsState.activeFriendId);
        if (changed) {
            updateFriendsCounts();
            renderFriendsPanels();
        }
        return friendsApi('/friends/' + encodeURIComponent(friendsState.activeFriendId) + '/read', {
            method: 'POST',
            body: {}
        }).then(function(result) {
            if (handleFriendsAuthError(result)) return;
            if (result.ok) {
                clearLocalUnread(friendsState.activeFriendId);
                updateFriendsCounts();
            }
        }).catch(function() {});
    }
    var chatFloatHideTimer = null;
    function showChatFloat() {
        if (!hubViewFriends) return;
        if (chatFloatHideTimer) {
            clearTimeout(chatFloatHideTimer);
            chatFloatHideTimer = null;
        }
        hubViewFriends.hidden = false;
        requestAnimationFrame(function() {
            hubViewFriends.classList.add('is-active', 'is-open');
        });
    }
    function hideChatFloat() {
        if (!hubViewFriends) return;
        hubViewFriends.classList.remove('is-active', 'is-open');
        if (chatFloatHideTimer) clearTimeout(chatFloatHideTimer);
        chatFloatHideTimer = setTimeout(function() {
            chatFloatHideTimer = null;
            if (!hubViewFriends.classList.contains('is-open')) {
                hubViewFriends.hidden = true;
            }
        }, 340);
    }
    function closeChat() {
        stopChatPoll();
        friendsState.activeFriendId = '';
        friendsState.activeGroupId = '';
        friendsState.messages = [];
        friendsState.lastMessageId = 0;
        friendsState.chatSending = false;
        if (chatActiveEl) chatActiveEl.hidden = true;
        if (chatEmptyEl) chatEmptyEl.hidden = true;
        if (chatRemoveBtn) {
            chatRemoveBtn.removeAttribute('data-discord-id');
            chatRemoveBtn.removeAttribute('data-group-id');
            chatRemoveBtn.textContent = 'Eliminar';
            chatRemoveBtn.setAttribute('data-friends-action', 'remove');
            chatRemoveBtn.title = 'Eliminar amigo';
            chatRemoveBtn.setAttribute('aria-label', 'Eliminar amigo');
            chatRemoveBtn.hidden = true;
        }
        if (chatPinEl) chatPinEl.hidden = true;
        friendsState.pinnedMessageId = '';
        closeChatCtx();
        hideChatFloat();
        hideFriendHover();
        renderFriendsPanels();
    }
    function openChat(friend) {
        if (!friend || !friend.discord_id) return;
        hideFriendHover();
        showChatFloat();
        var nextId = String(friend.discord_id);
        if (friendsState.activeFriendId === nextId && !friendsState.activeGroupId && chatActiveEl && !chatActiveEl.hidden) return;
        stopChatPoll();
        friendsState.activeGroupId = '';
        friendsState.activeFriendId = nextId;
        friendsState.messages = [];
        friendsState.lastMessageId = 0;
        friendsState.knownMsgIds = {};
        friendsState.chatSending = false;
        if (chatEmptyEl) chatEmptyEl.hidden = true;
        if (chatActiveEl) chatActiveEl.hidden = false;
        if (chatNameEl) chatNameEl.textContent = friendDisplayName(friend);
        if (chatSubEl) chatSubEl.textContent = 'Desconectado';
        if (chatAvEl) chatAvEl.innerHTML = renderFriendAvatar(friend);
        if (chatMeAvEl) chatMeAvEl.innerHTML = renderFriendAvatar(selfUser());
        if (chatRemoveBtn) {
            chatRemoveBtn.hidden = true;
            chatRemoveBtn.textContent = 'Eliminar';
            chatRemoveBtn.setAttribute('data-friends-action', 'remove');
            chatRemoveBtn.setAttribute('data-discord-id', nextId);
            chatRemoveBtn.removeAttribute('data-group-id');
            chatRemoveBtn.title = 'Eliminar amigo';
            chatRemoveBtn.setAttribute('aria-label', 'Eliminar amigo');
        }
        if (chatMessagesEl) chatMessagesEl.innerHTML = '';
        if (chatInputEl) {
            chatInputEl.value = '';
            chatInputEl.placeholder = 'Enviar un mensaje';
            chatInputEl.focus();
        }
        var chatHintElOpen = document.getElementById('hub-chat-hint');
        if (chatHintElOpen) chatHintElOpen.hidden = false;
        closeEmojiPanel();
        closeChatCtx();
        clearLocalUnread(nextId);
        renderPinnedBar();
        renderFriendsPanels();
        loadChatMessages({ reset: true }).then(function() {
            stopChatPoll();
            friendsState.chatPollTimer = setInterval(function() {
                if (document.hidden) return;
                if (friendsState.activeFriendId || friendsState.activeGroupId) {
                    loadChatMessages({ silent: true });
                }
            }, 5000);
        });
    }
    function openGroupChat(group) {
        if (!group || !group.id) return;
        hideFriendHover();
        showChatFloat();
        var nextId = String(group.id);
        var sameOpen = friendsState.activeGroupId === nextId && chatActiveEl && !chatActiveEl.hidden;
        if (sameOpen) return;
        stopChatPoll();
        friendsState.activeFriendId = '';
        friendsState.activeGroupId = nextId;
        friendsState.messages = [];
        friendsState.lastMessageId = 0;
        friendsState.knownMsgIds = {};
        friendsState.chatSending = false;
        if (chatEmptyEl) chatEmptyEl.hidden = true;
        if (chatActiveEl) chatActiveEl.hidden = false;
        if (chatNameEl) chatNameEl.textContent = String(group.name || 'Group');
        if (chatSubEl) {
            var mc = Number(group.member_count) || 0;
            chatSubEl.textContent = mc ? (mc + ' miembros') : 'Grupo';
        }
        if (chatAvEl) {
            chatAvEl.innerHTML = '<span>' + escapeHtml(String(group.name || 'G').charAt(0).toUpperCase()) + '</span>';
        }
        if (chatMeAvEl) chatMeAvEl.innerHTML = renderFriendAvatar(selfUser());
        if (chatRemoveBtn) {
            chatRemoveBtn.hidden = true;
            chatRemoveBtn.textContent = 'Salir';
            chatRemoveBtn.setAttribute('data-friends-action', 'leave-group');
            chatRemoveBtn.setAttribute('data-group-id', nextId);
            chatRemoveBtn.removeAttribute('data-discord-id');
            chatRemoveBtn.title = 'Salir del grupo';
            chatRemoveBtn.setAttribute('aria-label', 'Salir del grupo');
        }
        if (chatMessagesEl) chatMessagesEl.innerHTML = '';
        if (chatInputEl) {
            chatInputEl.value = '';
            chatInputEl.placeholder = 'Enviar un mensaje';
            chatInputEl.focus();
        }
        closeEmojiPanel();
        closeChatCtx();
        clearLocalGroupUnread(nextId);
        renderPinnedBar();
        renderFriendsPanels();
        loadChatMessages({ reset: true }).then(function() {
            stopChatPoll();
            friendsState.chatPollTimer = setInterval(function() {
                if (document.hidden) return;
                if (friendsState.activeFriendId || friendsState.activeGroupId) {
                    loadChatMessages({ silent: true });
                }
            }, 5000);
        });
    }
    function loadChatMessages(opts) {
        opts = opts || {};
        if (!friendsState.activeFriendId && !friendsState.activeGroupId) {
            return Promise.resolve();
        }
        // Allow forced resets to interrupt a stuck/in-flight poll.
        if (friendsState.chatLoading && !opts.reset) {
            return Promise.resolve();
        }
        var gen = ++friendsState.chatLoadGen;
        friendsState.chatLoading = true;
        var path = friendsState.activeGroupId
            ? '/groups/' + encodeURIComponent(friendsState.activeGroupId) + '/messages?mark_read=1'
            : '/friends/' + encodeURIComponent(friendsState.activeFriendId) + '/messages?mark_read=1';
        if (!opts.reset && friendsState.lastMessageId) {
            path += '&after=' + encodeURIComponent(String(friendsState.lastMessageId));
        }
        var expectedFriend = friendsState.activeFriendId;
        var expectedGroup = friendsState.activeGroupId;
        return friendsApi(path).then(function(result) {
            if (gen !== friendsState.chatLoadGen) return;
            if (String(friendsState.activeFriendId) !== String(expectedFriend) ||
                String(friendsState.activeGroupId) !== String(expectedGroup)) {
                return;
            }
            if (handleFriendsAuthError(result)) return;
            if (!result.ok) throw new Error((result.json && result.json.error) || 'Could not load chat');
            var incoming = (result.json && result.json.messages) || [];
            var removed = (result.json && result.json.removed_ids) || [];
            var added = 0;
            var removedCount = 0;
            if (opts.reset) {
                friendsState.messages = [];
                friendsState.lastMessageId = 0;
                friendsState.knownMsgIds = {};
                added = mergeChatMessages(incoming);
            } else {
                added = mergeChatMessages(incoming);
                removedCount = removeChatMessagesByIds(removed);
            }
            if (friendsState.activeGroupId) clearLocalGroupUnread(friendsState.activeGroupId);
            else if (friendsState.activeFriendId) clearLocalUnread(friendsState.activeFriendId);
            updateFriendsCounts();
            if (opts.reset || added > 0 || removedCount > 0) {
                renderPinnedBar();
                renderChatMessages({
                    forceStick: !!opts.reset || added > 0,
                    animateNew: !opts.reset && added > 0,
                    resetKnown: !!opts.reset
                });
                if (opts.reset || added > 0) renderFriendsPanels();
            }
        }).catch(function(err) {
            if (gen !== friendsState.chatLoadGen) return;
            if (!opts.silent) setFriendsStatus((err && err.message) || 'Chat unavailable.', 'err');
        }).finally(function() {
            if (gen === friendsState.chatLoadGen) friendsState.chatLoading = false;
        });
    }
    function sendChatMessage(text) {
        var body = String(text || '').trim();
        var friendId = friendsState.activeFriendId;
        var groupId = friendsState.activeGroupId;
        if (!body || (!friendId && !groupId)) return Promise.resolve();
        if (chatInputEl) {
            chatInputEl.value = '';
            chatInputEl.focus();
        }
        if (chatSendEl) {
            chatSendEl.classList.remove('is-pop');
            void chatSendEl.offsetWidth;
            chatSendEl.classList.add('is-pop');
        }
        if (chatFormEl) {
            chatFormEl.classList.remove('is-sent');
            void chatFormEl.offsetWidth;
            chatFormEl.classList.add('is-sent');
        }
        var tempId = 'local-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
        var optimistic = {
            id: tempId,
            body: body,
            mine: true,
            from_discord_id: boot.userId || '',
            from: selfUser(),
            created_at: new Date().toISOString(),
            pending: true
        };
        friendsState.messages.push(optimistic);
        friendsState.knownMsgIds = friendsState.knownMsgIds || {};
        renderChatMessages({ forceStick: true, animateNew: true });
        var endpoint = groupId
            ? '/groups/' + encodeURIComponent(groupId) + '/messages'
            : '/friends/' + encodeURIComponent(friendId) + '/messages';
        return friendsApi(endpoint, {
            method: 'POST',
            body: { body: body }
        }).then(function(result) {
            if (String(friendsState.activeFriendId) !== String(friendId) ||
                String(friendsState.activeGroupId) !== String(groupId)) {
                return;
            }
            if (handleFriendsAuthError(result)) {
                removeChatMessagesByIds([tempId]);
                renderChatMessages();
                return;
            }
            if (!result.ok) throw new Error((result.json && result.json.error) || 'Send failed');
            removeChatMessagesByIds([tempId]);
            delete friendsState.knownMsgIds[tempId];
            if (result.json && result.json.message) {
                mergeChatMessages([result.json.message]);
                renderChatMessages({ forceStick: true, animateNew: true });
            } else {
                return loadChatMessages({ silent: true });
            }
        }).catch(function(err) {
            if (String(friendsState.activeFriendId) === String(friendId) &&
                String(friendsState.activeGroupId) === String(groupId)) {
                removeChatMessagesByIds([tempId]);
                delete friendsState.knownMsgIds[tempId];
                renderChatMessages();
                setFriendsStatus((err && err.message) || 'Send failed.', 'err');
            }
        });
    }
    function setFriendsTab(tab) {
        if (tab === 'requests') friendsState.tab = 'requests';
        else if (tab === 'groups') friendsState.tab = 'groups';
        else friendsState.tab = 'list';
        if (friendsTabListBtn) {
            friendsTabListBtn.classList.toggle('is-active', friendsState.tab === 'list');
            friendsTabListBtn.setAttribute('aria-selected', friendsState.tab === 'list' ? 'true' : 'false');
        }
        if (friendsTabGroupsBtn) {
            friendsTabGroupsBtn.classList.toggle('is-active', friendsState.tab === 'groups');
            friendsTabGroupsBtn.setAttribute('aria-selected', friendsState.tab === 'groups' ? 'true' : 'false');
        }
        if (friendsTabRequestsBtn) {
            friendsTabRequestsBtn.classList.toggle('is-active', friendsState.tab === 'requests');
            friendsTabRequestsBtn.setAttribute('aria-selected', friendsState.tab === 'requests' ? 'true' : 'false');
        }
        if (friendsPanelList) {
            friendsPanelList.hidden = friendsState.tab !== 'list';
            friendsPanelList.classList.toggle('is-active', friendsState.tab === 'list');
        }
        if (friendsPanelGroups) {
            friendsPanelGroups.hidden = friendsState.tab !== 'groups';
            friendsPanelGroups.classList.toggle('is-active', friendsState.tab === 'groups');
        }
        if (friendsPanelRequests) {
            friendsPanelRequests.hidden = friendsState.tab !== 'requests';
            friendsPanelRequests.classList.toggle('is-active', friendsState.tab === 'requests');
        }
        if (friendsSearchInput) {
            friendsSearchInput.disabled = friendsState.tab === 'requests';
            friendsSearchInput.placeholder =
                friendsState.tab === 'groups' ? 'Buscar amigos…' : 'Buscar';
        }
        if (friendsState.tab !== 'list') {
            friendsState.searchQuery = '';
            friendsState.searchResults = [];
            if (friendsSearchInput) friendsSearchInput.value = '';
        }
        hideFriendHover();
        renderFriendsPanels();
        requestAnimationFrame(function() {
            syncFriendsTabInk();
        });
    }
    function renderFriendsPanels() {
        updateFriendsCounts();
        var searching = friendsState.searchQuery.length >= 2;
        if (friendsCountLabelEl) {
            friendsCountLabelEl.hidden = searching || !friendsState.friends.length;
        }

        if (friendsListEl) {
            if (!searching && friendsState.friends.length) {
                var listFp = friendsState.friends.map(function(friend) {
                    return String(friend.discord_id) + ':' + String(friend.unread || 0) + ':' + String(friend.avatar || '') +
                        ':' + (String(friend.discord_id) === String(friendsState.activeFriendId) ? '1' : '0');
                }).join('|');
                friendsListEl.hidden = false;
                if (listFp !== friendsState._friendsListFp) {
                    friendsState._friendsListFp = listFp;
                    friendsListEl.innerHTML = friendsState.friends.map(function(friend) {
                        return renderFriendRow(friend, {
                            subtitle: 'Desconectado',
                            active: String(friend.discord_id) === String(friendsState.activeFriendId),
                            openChat: true,
                            status: 'offline'
                        });
                    }).join('');
                }
            } else {
                friendsState._friendsListFp = '';
                friendsListEl.hidden = true;
                friendsListEl.innerHTML = '';
            }
        }

        if (friendsSearchListEl) {
            if (searching) {
                friendsSearchListEl.hidden = false;
                if (!friendsState.searchResults.length) {
                    friendsSearchListEl.innerHTML = '';
                } else {
                    friendsSearchListEl.innerHTML = friendsState.searchResults.map(function(user) {
                        var actions = '';
                        var subtitle = '@' + String(user.username || 'user');
                        var openChat = false;
                        if (user.relation === 'friends') {
                            subtitle = 'Open chat';
                            openChat = true;
                        } else if (user.relation === 'outgoing') {
                            subtitle = 'Request sent';
                            actions = actionBtn('Cancel', 'decline', '', ' data-request-id="' + escapeHtml(String(user.request_id || '')) + '"');
                        } else if (user.relation === 'incoming') {
                            subtitle = 'Wants to be friends';
                            actions = actionBtn('Accept', 'accept', 'is-primary', ' data-request-id="' + escapeHtml(String(user.request_id || '')) + '"') +
                                actionBtn('Decline', 'decline', '', ' data-request-id="' + escapeHtml(String(user.request_id || '')) + '"');
                        } else {
                            actions = actionBtn('Add', 'add', 'is-primary', ' data-discord-id="' + escapeHtml(String(user.discord_id)) + '"');
                        }
                        return renderFriendRow(user, {
                            subtitle: subtitle,
                            actionsHtml: actions,
                            openChat: openChat,
                            active: openChat && String(user.discord_id) === String(friendsState.activeFriendId)
                        });
                    }).join('');
                }
            } else {
                friendsSearchListEl.hidden = true;
                friendsSearchListEl.innerHTML = '';
            }
        }

        if (friendsEmptyEl) {
            var showEmpty = friendsState.tab === 'list' && !searching && !friendsState.friends.length && friendsState.loaded;
            friendsEmptyEl.hidden = !showEmpty;
        }

        if (friendsGroupsListEl) {
            if (friendsState.groups.length) {
                friendsGroupsListEl.hidden = false;
                friendsGroupsListEl.innerHTML = friendsState.groups.map(function(group) {
                    var unread = Number(group.unread) || 0;
                    if (String(group.id) === String(friendsState.activeGroupId)) unread = 0;
                    var letter = escapeHtml(String(group.name || 'G').charAt(0).toUpperCase());
                    var countLabel = (Number(group.member_count) || 0) + ' members';
                    var unreadHtml = unread > 0
                        ? '<span class="hx-friend-unread">' + escapeHtml(String(unread > 99 ? '99+' : unread)) + '</span>'
                        : '';
                    return '<li class="hx-friend-row' +
                        (String(group.id) === String(friendsState.activeGroupId) ? ' is-active' : '') +
                        '" data-open-group="1" data-group-id="' + escapeHtml(String(group.id)) + '">' +
                        '<span class="hx-friend-av"><span>' + letter + '</span></span>' +
                        '<div class="hx-friend-meta">' +
                          '<span class="hx-friend-name">' + escapeHtml(String(group.name || 'Group')) + '</span>' +
                          '<span class="hx-friend-status">' + escapeHtml(countLabel) + '</span>' +
                        '</div>' +
                        unreadHtml +
                      '</li>';
                }).join('');
            } else {
                friendsGroupsListEl.hidden = true;
                friendsGroupsListEl.innerHTML = '';
            }
        }
        if (friendsGroupsEmptyEl) {
            friendsGroupsEmptyEl.hidden = friendsState.tab !== 'groups' || friendsState.groups.length > 0;
        }

        var hasIncoming = friendsState.incoming.length > 0;
        var hasOutgoing = friendsState.outgoing.length > 0;
        if (friendsRequestsEmptyEl) friendsRequestsEmptyEl.hidden = hasIncoming || hasOutgoing;
        if (friendsRequestsBodyEl) friendsRequestsBodyEl.hidden = !(hasIncoming || hasOutgoing);

        if (friendsIncomingEl) {
            friendsIncomingEl.innerHTML = friendsState.incoming.map(function(req) {
                return renderFriendRow(req.from, {
                    subtitle: 'Incoming request',
                    actionsHtml:
                        actionBtn('Accept', 'accept', 'is-primary', ' data-request-id="' + escapeHtml(String(req.id)) + '"') +
                        actionBtn('Decline', 'decline', '', ' data-request-id="' + escapeHtml(String(req.id)) + '"')
                });
            }).join('');
            friendsIncomingEl.hidden = !hasIncoming;
        }
        if (friendsOutgoingEl) {
            friendsOutgoingEl.innerHTML = friendsState.outgoing.map(function(req) {
                return renderFriendRow(req.to, {
                    subtitle: 'Outgoing request',
                    actionsHtml: actionBtn('Cancel', 'decline', '', ' data-request-id="' + escapeHtml(String(req.id)) + '"')
                });
            }).join('');
            friendsOutgoingEl.hidden = !hasOutgoing;
        }

        if (friendsState.activeFriendId && friendsState.loaded && !findFriendById(friendsState.activeFriendId)) {
            closeChat();
        }
        if (friendsState.activeGroupId && friendsState.groupsLoaded && !findGroupById(friendsState.activeGroupId)) {
            closeChat();
        }
        renderPlaySide();
        friendsState._panelFp = friendsPanelFingerprint();
    }
    function renderPlaySide() {
        var listEl = document.getElementById('hub-play-friends-list');
        var emptyEl = document.getElementById('hub-play-friends-empty');
        var statFriends = document.getElementById('hub-play-stat-friends');
        var statGroups = document.getElementById('hub-play-stat-groups');
        var statReq = document.getElementById('hub-play-stat-req');
        var reqCount = friendsState.incoming.length + friendsState.outgoing.length;
        if (statFriends) statFriends.textContent = String(friendsState.friends.length);
        if (statGroups) statGroups.textContent = String(friendsState.groups.length);
        if (statReq) statReq.textContent = String(reqCount);
        if (!listEl || !emptyEl) return;
        var preview = friendsState.friends || [];
        if (!preview.length) {
            listEl.innerHTML = '';
            listEl.hidden = true;
            listEl.setAttribute('hidden', '');
            emptyEl.hidden = false;
            emptyEl.removeAttribute('hidden');
            return;
        }
        emptyEl.hidden = true;
        emptyEl.setAttribute('hidden', '');
        listEl.hidden = false;
        listEl.removeAttribute('hidden');
        var html = '';
        for (var i = 0; i < preview.length; i++) {
            var friend = preview[i];
            if (!friend) continue;
            var name = friendDisplayName(friend);
            var nameEsc = escapeHtml(name);
            var unread = Number(friend.unread) || 0;
            var statusText = unread > 0 ? (unread + ' sin leer') : 'Desconectado';
            var avUrl = avatarUrlFor(friend);
            if (avUrl) {
                avUrl = String(avUrl).replace(/([?&])size=\d+/gi, '$1size=256');
                if (avUrl.indexOf('size=') < 0 && avUrl.indexOf('cdn.discordapp.com') >= 0) {
                    avUrl += (avUrl.indexOf('?') >= 0 ? '&' : '?') + 'size=256';
                }
            }
            var av = avUrl
                ? '<img src="' + escapeHtml(avUrl) + '" alt="" decoding="async" referrerpolicy="no-referrer"/>'
                : '<span class="riot-friends-letter">' + escapeHtml((name.charAt(0) || '?').toUpperCase()) + '</span>';
            html += '<button type="button" class="riot-friends-tile" data-open-chat="1" data-discord-id="' +
                escapeHtml(String(friend.discord_id || '')) + '" title="' + nameEsc + '" aria-label="' + nameEsc + '">' +
                '<span class="riot-friends-cover">' + av +
                  '<span class="riot-friends-dot is-offline" aria-hidden="true"></span>' +
                '</span>' +
                '<span class="riot-friends-meta">' +
                  '<span class="riot-friends-name">' + nameEsc + '</span>' +
                  '<span class="riot-friends-status">' + escapeHtml(statusText) + '</span>' +
                '</span>' +
              '</button>';
        }
        listEl.innerHTML = html;
    }
    function friendsPanelFingerprint() {
        function packUsers(list, idKey) {
            return (list || []).map(function(item) {
                var id = item && (item[idKey] != null ? item[idKey] : item.discord_id);
                return String(id || '') + ':' + String((item && item.unread) || 0) + ':' + String((item && item.avatar) || '');
            }).join('|');
        }
        return [
            friendsState.tab,
            friendsState.searchQuery,
            friendsState.activeFriendId,
            friendsState.activeGroupId,
            packUsers(friendsState.friends, 'discord_id'),
            packUsers(friendsState.groups, 'id'),
            (friendsState.incoming || []).map(function(r) { return String(r.id); }).join('|'),
            (friendsState.outgoing || []).map(function(r) { return String(r.id); }).join('|'),
            packUsers(friendsState.searchResults, 'discord_id')
        ].join('::');
    }
    function renderFriendsPanelsIfChanged(force) {
        var next = friendsPanelFingerprint();
        if (!force && next === friendsState._panelFp) return;
        friendsState._panelFp = next;
        renderFriendsPanels();
    }
    function applyFriendsPayload(friendsRes) {
        friendsState.friends = (friendsRes.json && friendsRes.json.friends) || [];
        if (friendsState.activeFriendId) clearLocalUnread(friendsState.activeFriendId);
        friendsState.loaded = true;
    }
    function applyRequestsPayload(requestsRes) {
        friendsState.incoming = (requestsRes.json && requestsRes.json.incoming) || [];
        friendsState.outgoing = (requestsRes.json && requestsRes.json.outgoing) || [];
    }
    function applyGroupsPayload(groupsRes) {
        if (groupsRes && groupsRes.ok && groupsRes.json) {
            friendsState.groups = groupsRes.json.groups || [];
            friendsState.groupsLoaded = true;
            if (groupsRes.json.max_members) {
                friendsState.maxMembers = Number(groupsRes.json.max_members) || friendsState.maxMembers;
            }
            if (typeof groupsRes.json.is_plus === 'boolean') {
                friendsState.isPlus = groupsRes.json.is_plus;
                boot.isPlus = groupsRes.json.is_plus;
            }
            if (friendsState.activeGroupId) clearLocalGroupUnread(friendsState.activeGroupId);
        } else if (groupsRes && groupsRes.json && groupsRes.json.reauth_required) {
            handleFriendsAuthError(groupsRes);
        } else {
            friendsState.groupsLoaded = false;
        }
    }
    function startFriendsRefresh() {
        if (friendsState.refreshTimer) clearInterval(friendsState.refreshTimer);
        friendsState.refreshTimer = setInterval(function() {
            if (document.hidden || !boot.loggedIn) return;
            if (friendsState.loading) return;
            loadFriendsData({ silent: true });
        }, 25000);
    }
    function handleFriendsAuthError(result) {
        if (result && result.json && result.json.reauth_required) {
            setFriendsStatus('Sign in again to use Friends.', 'err');
            return true;
        }
        return false;
    }
    function loadFriendsData(opts) {
        opts = opts || {};
        if (!boot.loggedIn) return Promise.resolve();
        if (friendsState.loading && !opts.force) return Promise.resolve();
        friendsState.loading = true;
        if (!opts.silent) setFriendsStatus('Loading…');
        var loadId = (friendsState._loadId = (friendsState._loadId || 0) + 1);
        var hadFriends = friendsState.friends.length > 0;

        /* Primero amigos (pinta ya), después requests/groups en paralelo */
        return friendsApi('/friends').then(function(friendsRes) {
            if (loadId !== friendsState._loadId) return null;
            if (handleFriendsAuthError(friendsRes)) return null;
            if (!friendsRes.ok) throw new Error((friendsRes.json && friendsRes.json.error) || 'Could not load friends');
            applyFriendsPayload(friendsRes);
            if (!opts.silent) setFriendsStatus('');
            renderFriendsPanelsIfChanged();
            return Promise.all([
                friendsApi('/friends/requests'),
                friendsApi('/groups').catch(function() {
                    return { ok: false, status: 0, json: { error: 'groups unavailable' } };
                })
            ]);
        }).then(function(rest) {
            if (!rest || loadId !== friendsState._loadId) return;
            var requestsRes = rest[0];
            var groupsRes = rest[1];
            if (handleFriendsAuthError(requestsRes)) return;
            if (!requestsRes.ok) throw new Error((requestsRes.json && requestsRes.json.error) || 'Could not load requests');
            applyRequestsPayload(requestsRes);
            applyGroupsPayload(groupsRes);
            if (!opts.silent) setFriendsStatus('');
            renderFriendsPanelsIfChanged();
        }).catch(function(err) {
            if (loadId !== friendsState._loadId) return;
            if (!hadFriends) setFriendsStatus((err && err.message) || 'Could not load friends.', 'err');
        }).finally(function() {
            if (loadId === friendsState._loadId) friendsState.loading = false;
        });
    }
    function runFriendsSearch(query) {
        friendsState.searchQuery = String(query || '').trim();
        if (friendsState.searchQuery.length < 2) {
            friendsState.searchResults = [];
            friendsState._searchId = (friendsState._searchId || 0) + 1;
            renderFriendsPanels();
            if (!friendsState.searchQuery) setFriendsStatus('');
            else setFriendsStatus('Escribí al menos 2 caracteres.');
            return;
        }
        setFriendsStatus('Buscando…');
        var searchId = (friendsState._searchId = (friendsState._searchId || 0) + 1);
        var q = friendsState.searchQuery;
        friendsApi('/users/search?q=' + encodeURIComponent(q)).then(function(result) {
            if (searchId !== friendsState._searchId) return;
            if (handleFriendsAuthError(result)) return;
            if (!result.ok) throw new Error((result.json && result.json.error) || 'Search failed');
            friendsState.searchResults = (result.json && result.json.users) || [];
            setFriendsStatus(friendsState.searchResults.length ? '' : 'Sin resultados.');
            renderFriendsPanels();
        }).catch(function(err) {
            if (searchId !== friendsState._searchId) return;
            friendsState.searchResults = [];
            renderFriendsPanels();
            setFriendsStatus((err && err.message) || 'Error al buscar.', 'err');
        });
    }
    function withBusyButton(btn, promiseFactory) {
        if (!btn) return promiseFactory();
        btn.disabled = true;
        return Promise.resolve()
            .then(promiseFactory)
            .finally(function() { btn.disabled = false; });
    }
    function onFriendsAction(action, el, btn) {
        if (action === 'add') {
            var toId = el.getAttribute('data-discord-id') || btn.getAttribute('data-discord-id');
            return withBusyButton(btn, function() {
                return friendsApi('/friends/requests', {
                    method: 'POST',
                    body: { to_discord_id: toId }
                }).then(function(result) {
                    if (handleFriendsAuthError(result)) return;
                    if (!result.ok) throw new Error((result.json && result.json.error) || 'Request failed');
                    setFriendsStatus('Request sent.', 'ok');
                    return loadFriendsData({ silent: true, force: true }).then(function() {
                        if (friendsState.searchQuery.length >= 2) runFriendsSearch(friendsState.searchQuery);
                    });
                });
            }).catch(function(err) {
                setFriendsStatus((err && err.message) || 'Request failed.', 'err');
            });
        }
        if (action === 'accept') {
            var acceptId = btn.getAttribute('data-request-id');
            return withBusyButton(btn, function() {
                return friendsApi('/friends/requests/' + encodeURIComponent(acceptId) + '/accept', {
                    method: 'POST',
                    body: {}
                }).then(function(result) {
                    if (handleFriendsAuthError(result)) return;
                    if (!result.ok) throw new Error((result.json && result.json.error) || 'Accept failed');
                    setFriendsStatus('Friend added.', 'ok');
                    return loadFriendsData({ silent: true, force: true }).then(function() {
                        if (friendsState.searchQuery.length >= 2) runFriendsSearch(friendsState.searchQuery);
                    });
                });
            }).catch(function(err) {
                setFriendsStatus((err && err.message) || 'Accept failed.', 'err');
            });
        }
        if (action === 'decline') {
            var declineId = btn.getAttribute('data-request-id');
            return withBusyButton(btn, function() {
                return friendsApi('/friends/requests/' + encodeURIComponent(declineId) + '/decline', {
                    method: 'POST',
                    body: {}
                }).then(function(result) {
                    if (handleFriendsAuthError(result)) return;
                    if (!result.ok) throw new Error((result.json && result.json.error) || 'Decline failed');
                    setFriendsStatus('Request closed.', 'ok');
                    return loadFriendsData({ silent: true, force: true }).then(function() {
                        if (friendsState.searchQuery.length >= 2) runFriendsSearch(friendsState.searchQuery);
                    });
                });
            }).catch(function(err) {
                setFriendsStatus((err && err.message) || 'Decline failed.', 'err');
            });
        }
        if (action === 'remove') {
            var removeId = el.getAttribute('data-discord-id') || btn.getAttribute('data-discord-id') || friendsState.activeFriendId;
            return withBusyButton(btn, function() {
                return friendsApi('/friends/' + encodeURIComponent(removeId), {
                    method: 'DELETE'
                }).then(function(result) {
                    if (handleFriendsAuthError(result)) return;
                    if (!result.ok) throw new Error((result.json && result.json.error) || 'Remove failed');
                    setFriendsStatus('Friend removed.', 'ok');
                    if (String(friendsState.activeFriendId) === String(removeId)) closeChat();
                    return loadFriendsData({ silent: true, force: true });
                });
            }).catch(function(err) {
                setFriendsStatus((err && err.message) || 'Remove failed.', 'err');
            });
        }
        if (action === 'leave-group') {
            var leaveId = el.getAttribute('data-group-id') || btn.getAttribute('data-group-id') || friendsState.activeGroupId;
            if (!leaveId || !boot.userId) return Promise.resolve();
            return withBusyButton(btn, function() {
                return friendsApi(
                    '/groups/' + encodeURIComponent(leaveId) + '/members/' + encodeURIComponent(boot.userId),
                    { method: 'DELETE' }
                ).then(function(result) {
                    if (handleFriendsAuthError(result)) return;
                    if (!result.ok) throw new Error((result.json && result.json.error) || 'Leave failed');
                    setFriendsStatus('Left group.', 'ok');
                    if (String(friendsState.activeGroupId) === String(leaveId)) closeChat();
                    return loadFriendsData({ silent: true, force: true });
                });
            }).catch(function(err) {
                setFriendsStatus((err && err.message) || 'Leave failed.', 'err');
            });
        }
    }

    if (friendsTabListBtn) friendsTabListBtn.addEventListener('click', function() { setFriendsTab('list'); });
    if (friendsTabGroupsBtn) friendsTabGroupsBtn.addEventListener('click', function() { setFriendsTab('groups'); });
    if (friendsTabRequestsBtn) friendsTabRequestsBtn.addEventListener('click', function() { setFriendsTab('requests'); });
    requestAnimationFrame(function() { syncFriendsTabInk(); });
    window.addEventListener('resize', syncFriendsTabInk);
    if (friendsAddBtn) {
        friendsAddBtn.addEventListener('click', function() {
            openCreateGroupModal();
        });
    }
    if (friendsSearchInput) {
        friendsSearchInput.addEventListener('input', function() {
            var value = friendsSearchInput.value || '';
            if (friendsState.searchTimer) clearTimeout(friendsState.searchTimer);
            friendsState.searchTimer = setTimeout(function() {
                runFriendsSearch(value);
            }, 280);
        });
    }
    if (chatPeerBtn) {
        chatPeerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (friendsState.activeGroupId) return;
            var friend = findFriendById(friendsState.activeFriendId);
            if (!friend) {
                friend = {
                    discord_id: friendsState.activeFriendId,
                    nick: (chatNameEl && chatNameEl.textContent) || 'Friend',
                    username: 'user',
                    avatar: ''
                };
            }
            openFriendProfileSheet(friend);
        });
    }
    if (chatMessagesEl) {
        chatMessagesEl.addEventListener('contextmenu', function(e) {
            var msgEl = e.target && e.target.closest ? e.target.closest('.hx-dc-msg[data-msg-id]') : null;
            if (!msgEl) return;
            e.preventDefault();
            e.stopPropagation();
            closeEmojiPanel();
            openChatCtx(msgEl.getAttribute('data-msg-id'), e.clientX, e.clientY);
        });
    }
    if (chatCtxEl) {
        chatCtxEl.addEventListener('click', function(e) {
            var item = e.target && e.target.closest ? e.target.closest('[data-ctx-action]') : null;
            if (!item || item.disabled) return;
            e.preventDefault();
            e.stopPropagation();
            var action = item.getAttribute('data-ctx-action');
            var msgId = friendsState.ctxMessageId;
            var msg = null;
            for (var i = 0; i < friendsState.messages.length; i++) {
                if (String(friendsState.messages[i].id) === String(msgId)) {
                    msg = friendsState.messages[i];
                    break;
                }
            }
            closeChatCtx();
            if (!msg) return;
            if (action === 'copy') {
                var text = String(msg.body || '');
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(text).catch(function() {});
                } else {
                    try {
                        var ta = document.createElement('textarea');
                        ta.value = text;
                        document.body.appendChild(ta);
                        ta.select();
                        document.execCommand('copy');
                        document.body.removeChild(ta);
                    } catch (eCopy) {}
                }
                return;
            }
            if (action === 'pin') {
                setPinnedForActiveChat({
                    id: msg.id,
                    body: msg.body
                });
                renderPinnedBar();
                renderChatMessages();
                return;
            }
            if (action === 'delete') {
                if (!msg.mine) return;
                deleteChatMessage(msg.id);
            }
        });
    }
    if (chatPinClearEl) {
        chatPinClearEl.addEventListener('click', function(e) {
            e.preventDefault();
            setPinnedForActiveChat(null);
            renderPinnedBar();
            renderChatMessages();
        });
    }
    if (chatFormEl) {
        chatFormEl.addEventListener('submit', function(e) {
            e.preventDefault();
            closeEmojiPanel();
            sendChatMessage(chatInputEl ? chatInputEl.value : '');
        });
    }
    if (chatEmojiBtn) {
        chatEmojiBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (chatEmojiPanel && chatEmojiPanel.hidden) openEmojiPanel();
            else closeEmojiPanel();
        });
    }
    if (chatEmojiPanel) {
        chatEmojiPanel.addEventListener('click', function(e) {
            var emojiBtn = e.target && e.target.closest ? e.target.closest('[data-emoji]') : null;
            if (!emojiBtn) return;
            e.preventDefault();
            e.stopPropagation();
            insertChatEmoji(emojiBtn.getAttribute('data-emoji'));
            closeEmojiPanel();
        });
    }
    document.addEventListener('click', function(e) {
        if (chatCtxEl && !chatCtxEl.hidden) {
            var inCtx = e.target && e.target.closest ? e.target.closest('#hub-chat-ctx') : null;
            if (!inCtx) closeChatCtx();
        }
        if (chatEmojiPanel && !chatEmojiPanel.hidden) {
            var inEmoji = e.target && e.target.closest
                ? e.target.closest('#hub-chat-emoji-panel, #hub-chat-emoji')
                : null;
            if (!inEmoji) closeEmojiPanel();
        }
        var btn = e.target && e.target.closest ? e.target.closest('[data-friends-action]') : null;
        if (btn) {
            e.preventDefault();
            e.stopPropagation();
            var row = btn.closest('.hx-friend-row');
            onFriendsAction(btn.getAttribute('data-friends-action'), row || btn, btn);
            return;
        }
        var openRow = e.target && e.target.closest ? e.target.closest('.hx-friend-row[data-open-chat="1"]') : null;
        if (openRow) {
            var friend = findFriendById(openRow.getAttribute('data-discord-id'));
            if (!friend) {
                friend = {
                    discord_id: openRow.getAttribute('data-discord-id'),
                    nick: (openRow.querySelector('.hx-friend-name') || {}).textContent || 'Friend',
                    username: 'user'
                };
            }
            openChat(friend);
            return;
        }
        var openGroupRow = e.target && e.target.closest ? e.target.closest('.hx-friend-row[data-open-group="1"]') : null;
        if (openGroupRow) {
            var group = findGroupById(openGroupRow.getAttribute('data-group-id'));
            if (!group) {
                group = {
                    id: openGroupRow.getAttribute('data-group-id'),
                    name: (openGroupRow.querySelector('.hx-friend-name') || {}).textContent || 'Group',
                    member_count: 0
                };
            }
            openGroupChat(group);
        }
    });

    if (friendsListEl) {
        friendsListEl.addEventListener('mouseover', function(e) {
            var row = e.target && e.target.closest ? e.target.closest('.hx-friend-row[data-open-chat="1"]') : null;
            if (!row || !friendsListEl.contains(row)) return;
            var id = row.getAttribute('data-discord-id');
            keepFriendHover();
            if (String(id) === String(friendHoverId) && friendHoverEl && friendHoverEl.classList.contains('is-visible')) return;
            var friend = findFriendById(id);
            if (!friend) {
                friend = {
                    discord_id: id,
                    nick: (row.querySelector('.hx-friend-name') || {}).textContent || 'Friend',
                    username: 'user'
                };
            }
            scheduleFriendHover(friend, row);
        });
        friendsListEl.addEventListener('mouseout', function(e) {
            var row = e.target && e.target.closest ? e.target.closest('.hx-friend-row[data-open-chat="1"]') : null;
            if (!row) return;
            var related = e.relatedTarget;
            if (related && (row.contains(related) || (friendHoverEl && friendHoverEl.contains(related)))) return;
            delayHideFriendHover();
        });
    }
    if (friendHoverEl) {
        friendHoverEl.addEventListener('mouseenter', keepFriendHover);
        friendHoverEl.addEventListener('mouseleave', function(e) {
            var related = e.relatedTarget;
            if (related && related.closest && related.closest('.hx-friend-row[data-discord-id="' + friendHoverId + '"]')) {
                keepFriendHover();
                return;
            }
            delayHideFriendHover();
        });
    }
    if (chatCloseBtn) {
        chatCloseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            closeChat();
        });
    }
    if (chatMoreBtn && chatRemoveBtn) {
        chatMoreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            chatRemoveBtn.hidden = !chatRemoveBtn.hidden;
        });
    }

    function setGroupModalStatus(msg, cls) {
        if (!groupStatusEl) return;
        groupStatusEl.textContent = msg || '';
        groupStatusEl.className = 'hx-friends-status' + (cls ? ' is-' + cls : '');
    }
    function selectedCreateCount() {
        return Object.keys(friendsState.createSelected || {}).length;
    }
    function updateCreateGroupCounters() {
        var selected = selectedCreateCount();
        var total = selected + 1;
        var max = friendsState.maxMembers || 4;
        if (groupLimitEl) groupLimitEl.textContent = total + ' / ' + max;
        if (groupHintEl) {
            groupHintEl.textContent = friendsState.isPlus
                ? 'Hasta 15 miembros (PLUS)'
                : 'Hasta 4 miembros';
        }
        if (groupSubmitEl) {
            groupSubmitEl.disabled = total > max;
        }
        if (groupPicksEl) {
            var boxes = groupPicksEl.querySelectorAll('input[type="checkbox"]');
            for (var i = 0; i < boxes.length; i++) {
                var box = boxes[i];
                if (!box.checked && total >= max) box.disabled = true;
                else box.disabled = false;
            }
        }
    }
    function renderCreateGroupPicks() {
        if (!groupPicksEl) return;
        if (!friendsState.friends.length) {
            groupPicksEl.innerHTML = '<li style="padding:14px;color:#8b909a;font-size:13px">Add friends first to invite them.</li>';
            return;
        }
        groupPicksEl.innerHTML = friendsState.friends.map(function(friend) {
            var id = String(friend.discord_id);
            var checked = !!friendsState.createSelected[id];
            return '<li><label>' +
                '<input type="checkbox" data-pick-id="' + escapeHtml(id) + '"' + (checked ? ' checked' : '') + '/>' +
                renderFriendAvatar(friend) +
                '<span>' + escapeHtml(friendDisplayName(friend)) + '</span>' +
              '</label></li>';
        }).join('');
    }
    function openCreateGroupModal() {
        if (!groupModalEl) return;
        friendsState.createSelected = {};
        if (groupNameEl) groupNameEl.value = '';
        setGroupModalStatus('');
        renderCreateGroupPicks();
        updateCreateGroupCounters();
        groupModalEl.classList.add('is-open');
        groupModalEl.setAttribute('aria-hidden', 'false');
        if (groupNameEl) groupNameEl.focus();
    }
    function closeCreateGroupModal() {
        if (!groupModalEl) return;
        groupModalEl.classList.remove('is-open');
        groupModalEl.setAttribute('aria-hidden', 'true');
        friendsState.createSelected = {};
        setGroupModalStatus('');
    }
    if (groupModalCloseEl) groupModalCloseEl.addEventListener('click', closeCreateGroupModal);
    if (groupCancelEl) groupCancelEl.addEventListener('click', closeCreateGroupModal);
    if (groupModalEl) {
        groupModalEl.addEventListener('click', function(e) {
            if (e.target === groupModalEl) closeCreateGroupModal();
        });
    }
    if (groupPicksEl) {
        groupPicksEl.addEventListener('change', function(e) {
            var input = e.target && e.target.closest ? e.target.closest('input[data-pick-id]') : null;
            if (!input) return;
            var id = String(input.getAttribute('data-pick-id') || '');
            if (!id) return;
            if (input.checked) friendsState.createSelected[id] = true;
            else delete friendsState.createSelected[id];
            updateCreateGroupCounters();
        });
    }
    if (groupFormEl) {
        groupFormEl.addEventListener('submit', function(e) {
            e.preventDefault();
            var name = groupNameEl ? String(groupNameEl.value || '').trim() : '';
            var memberIds = Object.keys(friendsState.createSelected || {});
            var total = memberIds.length + 1;
            var max = friendsState.maxMembers || 4;
            if (!name) {
                setGroupModalStatus('Name required.', 'err');
                return;
            }
            if (total > max) {
                setGroupModalStatus('Limit is ' + max + ' members.', 'err');
                return;
            }
            if (groupSubmitEl) groupSubmitEl.disabled = true;
            setGroupModalStatus('Creating…');
            friendsApi('/groups', {
                method: 'POST',
                body: { name: name, member_ids: memberIds }
            }).then(function(result) {
                if (handleFriendsAuthError(result)) return;
                if (!result.ok) throw new Error((result.json && result.json.error) || 'Create failed');
                var created = result.json && result.json.group;
                if (created && created.id != null) {
                    // Optimistically insert so chat doesn't get closed before refresh.
                    var exists = findGroupById(created.id);
                    if (!exists) {
                        friendsState.groups = [created].concat(friendsState.groups || []);
                    }
                    friendsState.groupsLoaded = true;
                }
                closeCreateGroupModal();
                setFriendsStatus('Group created.', 'ok');
                setFriendsTab('groups');
                if (created) openGroupChat(created);
                return loadFriendsData({ silent: true, force: true });
            }).catch(function(err) {
                setGroupModalStatus((err && err.message) || 'Create failed.', 'err');
            }).finally(function() {
                if (groupSubmitEl) groupSubmitEl.disabled = false;
                updateCreateGroupCounters();
            });
        });
    }

    function refreshPlusFlag() {
        if (!boot.loggedIn) return;
        friendsApi('/auth/me').then(function(result) {
            if (!result.ok || !result.json || !result.json.user) return;
            boot.isPlus = !!result.json.user.is_plus;
            friendsState.isPlus = !!result.json.user.is_plus;
            friendsState.maxMembers = friendsState.isPlus ? 15 : 4;
            var nodes = document.querySelectorAll('.hx-profile-name, .hub-profile-pop-name, .profile-sheet-name, .hub-settings-preview-name');
            for (var i = 0; i < nodes.length; i++) {
                var el = nodes[i];
                var has = !!el.querySelector('.hx-plus-badge');
                if (boot.isPlus && !has) {
                    el.insertAdjacentHTML('beforeend', ' <span class="hx-plus-badge">PLUS</span>');
                } else if (!boot.isPlus && has) {
                    var badge = el.querySelector('.hx-plus-badge');
                    if (badge) badge.remove();
                }
            }
        }).catch(function() {});
    }
    refreshPlusFlag();

    var navSpaceBtn = document.getElementById('hub-nav-space');
    function syncHubRailNav(view) {
        var isLibrary = view === 'library';
        var isSpace = view === 'space';
        var isPlay = view === 'play';
        var isFriends = view === 'friends';
        var isSettings = view === 'settings';
        if (hubTopTitle) {
            hubTopTitle.textContent = isSettings ? 'Ajustes' : (isFriends ? 'Amigos' : (isLibrary ? 'Library' : 'Home'));
        }
        if (hubNavLinks) hubNavLinks.setAttribute('data-active', view || 'play');
        if (navPlayBtn) navPlayBtn.classList.toggle('is-active', isPlay || isSpace);
        if (navLibraryBtn) navLibraryBtn.classList.toggle('is-active', isLibrary);
        if (navSpaceBtn) navSpaceBtn.classList.toggle('is-active', false);
        if (navFriendsBtn) navFriendsBtn.classList.toggle('is-active', isFriends);
        var settingsToggle = document.getElementById('hxd-launch-settings');
        if (settingsToggle) settingsToggle.classList.toggle('is-active', isSettings);
        var railSettings = document.querySelector('.riot-rail-settings');
        if (railSettings) railSettings.classList.toggle('is-active', isSettings);
    }
    function switchHubView(view) {
        var nextView = 'play';
        if (view === 'library') nextView = 'library';
        else if (view === 'space') nextView = 'space';
        else if (view === 'friends') nextView = 'friends';
        else if (view === 'settings') nextView = 'settings';
        else nextView = 'play';

        var prevView = hubCurrentView;
        if (nextView === prevView) {
            syncHubRailNav(nextView);
            return;
        }

        hubCurrentView = nextView;
        var isLibrary = nextView === 'library';
        var isSpace = nextView === 'space';
        var isPlay = nextView === 'play';
        var isFriends = nextView === 'friends';
        var isSettings = nextView === 'settings';
        syncHubRailNav(nextView);

        function elFor(name) {
            if (name === 'play') return hubViewPlay;
            if (name === 'space') return hubViewSpace;
            if (name === 'library') return hubViewLibrary;
            if (name === 'friends') return hubViewFriendsHub;
            if (name === 'settings') return hubViewSettings;
            return null;
        }

        var prevEl = elFor(prevView);
        var nextEl = elFor(nextView);
        var allViews = [hubViewPlay, hubViewSpace, hubViewLibrary, hubViewFriendsHub, hubViewSettings];
        var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var canAnimate = !reduceMotion && prevEl && nextEl && prevEl !== nextEl;

        if (hubViewTransitionTimer) {
            clearTimeout(hubViewTransitionTimer);
            hubViewTransitionTimer = null;
        }
        for (var i = 0; i < allViews.length; i++) {
            var v = allViews[i];
            if (!v) continue;
            if (v === prevEl || v === nextEl) continue;
            v.classList.remove('is-active', 'is-leaving', 'is-enter-from');
            v.hidden = true;
        }

        if (!nextEl) return;

        if (!canAnimate) {
            if (prevEl && prevEl !== nextEl) {
                prevEl.classList.remove('is-active', 'is-leaving', 'is-enter-from');
                prevEl.hidden = true;
            }
            nextEl.hidden = false;
            nextEl.classList.remove('is-leaving', 'is-enter-from');
            nextEl.classList.add('is-active');
        } else {
            nextEl.hidden = false;
            nextEl.classList.remove('is-leaving');
            nextEl.classList.add('is-enter-from');
            nextEl.classList.add('is-active');
            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    if (hubCurrentView !== nextView) return;
                    nextEl.classList.remove('is-enter-from');
                });
            });
            prevEl.classList.remove('is-enter-from');
            prevEl.classList.add('is-leaving');
            prevEl.classList.remove('is-active');
            hubViewTransitionTimer = setTimeout(function() {
                if (prevEl) {
                    prevEl.classList.remove('is-leaving', 'is-enter-from');
                    if (!prevEl.classList.contains('is-active')) prevEl.hidden = true;
                }
                hubViewTransitionTimer = null;
            }, 380);
        }

        if (isFriends) {
            setSocialCollapsed(false);
            renderPlaySide();
            loadFriendsData({ silent: true, force: true }).then(function() {
                renderPlaySide();
            });
        } else if (!isSettings) {
            closeChat();
        }
        if (isSettings) showSettingsTab(document.querySelector('.riot-settings-tab.is-active') ? document.querySelector('.riot-settings-tab.is-active').getAttribute('data-settings-tab') : 'profile');
    }
    if (navPlayBtn) navPlayBtn.addEventListener('click', function() { switchHubView('play'); });
    if (navLibraryBtn) navLibraryBtn.addEventListener('click', function() { switchHubView('library'); });
    if (navFriendsBtn) navFriendsBtn.addEventListener('click', function() { switchHubView('friends'); });
    var librarySpaceBtn = document.getElementById('hub-library-space');
    var homeOpenSpaceBtn = document.getElementById('hub-home-open-space');
    var spaceWarpEl = document.getElementById('space-warp');
    var spaceWarpBusy = false;
    var spaceWarpTimerA = null;
    var spaceWarpTimerB = null;
    function clearSpaceWarpTimers() {
        if (spaceWarpTimerA) { clearTimeout(spaceWarpTimerA); spaceWarpTimerA = null; }
        if (spaceWarpTimerB) { clearTimeout(spaceWarpTimerB); spaceWarpTimerB = null; }
    }
    function openSpaceWithWarp() {
        if (launchAnimActive || spaceWarpBusy) return;
        if (!boot.loggedIn) return;
        var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce || !spaceWarpEl) {
            startPlayWithTransition();
            return;
        }
        spaceWarpBusy = true;
        clearSpaceWarpTimers();
        spaceWarpEl.classList.remove('is-on', 'is-out');
        void spaceWarpEl.offsetWidth;
        spaceWarpEl.classList.add('is-on');
        spaceWarpEl.setAttribute('aria-hidden', 'false');
        document.body.classList.add('is-space-warping');
        /* Hold warp ~5s, then launch game near the end */
        spaceWarpTimerA = setTimeout(function() {
            startPlayWithTransition();
        }, 4200);
        spaceWarpTimerB = setTimeout(function() {
            spaceWarpEl.classList.add('is-out');
            document.body.classList.remove('is-space-warping');
            setTimeout(function() {
                spaceWarpEl.classList.remove('is-on', 'is-out');
                spaceWarpEl.setAttribute('aria-hidden', 'true');
                spaceWarpBusy = false;
            }, 550);
        }, 5000);
    }
    if (navSpaceBtn) navSpaceBtn.addEventListener('click', function() { openSpaceWithWarp(); });
    if (librarySpaceBtn) librarySpaceBtn.addEventListener('click', function() { openSpaceWithWarp(); });
    if (homeOpenSpaceBtn) homeOpenSpaceBtn.addEventListener('click', function() { openSpaceWithWarp(); });
    var spaceTabs = document.querySelectorAll('[data-space-tab]');
    var spaceViewRoot = document.getElementById('hub-view-space');
    function setSpaceHero(tab) {
        if (!tab) return;
        if (spaceViewRoot) spaceViewRoot.setAttribute('data-hero', tab);
        var heroes = document.querySelectorAll('[data-hero-bg]');
        for (var h = 0; h < heroes.length; h++) {
            heroes[h].classList.toggle('is-on', heroes[h].getAttribute('data-hero-bg') === tab);
        }
        for (var i = 0; i < spaceTabs.length; i++) {
            var active = spaceTabs[i].getAttribute('data-space-tab') === tab;
            spaceTabs[i].classList.toggle('is-active', active);
            spaceTabs[i].setAttribute('aria-current', active ? 'page' : 'false');
        }
        var slides = document.querySelectorAll('[data-space-panel]');
        for (var p = 0; p < slides.length; p++) {
            var show = slides[p].getAttribute('data-space-panel') === tab;
            slides[p].hidden = !show;
            slides[p].classList.toggle('is-on', show);
        }
    }
    for (var stTab = 0; stTab < spaceTabs.length; stTab++) {
        spaceTabs[stTab].addEventListener('click', function() {
            var tab = this.getAttribute('data-space-tab');
            if (!tab) return;
            setSpaceHero(tab);
        });
    }
    function openExternalUrl(url) {
        if (!url) return;
        fetch(base + '/open-external', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url })
        }).catch(function() {});
    }
    var homeView = document.getElementById('hub-view-play');
    if (homeView) {
        homeView.addEventListener('click', function(e) {
            var card = e.target && e.target.closest ? e.target.closest('[data-open-url]') : null;
            if (!card) return;
            openExternalUrl(card.getAttribute('data-open-url'));
        });
    }
    var spaceView = document.getElementById('hub-view-space');
    if (spaceView) {
        spaceView.addEventListener('click', function(e) {
            var el = e.target && e.target.closest ? e.target.closest('[data-open-url]') : null;
            if (!el) return;
            openExternalUrl(el.getAttribute('data-open-url'));
        });
    }
    var heroFriendsBtn = document.getElementById('hxd-hero-friends');
    if (heroFriendsBtn) heroFriendsBtn.addEventListener('click', function() { switchHubView('friends'); });
    var playOpenFriendsBtn = document.getElementById('hub-play-open-friends');
    var playFriendsListEl = document.getElementById('hub-play-friends-list');
    if (playOpenFriendsBtn) {
        playOpenFriendsBtn.addEventListener('click', function() {
            setSocialCollapsed(false);
            setFriendsTab('list');
            if (friendsSearchInput) {
                friendsSearchInput.focus();
            }
        });
    }
    if (playFriendsListEl) {
        playFriendsListEl.addEventListener('click', function(e) {
            var row = e.target && e.target.closest
                ? e.target.closest('[data-open-chat="1"][data-discord-id]')
                : null;
            if (!row) return;
            var id = row.getAttribute('data-discord-id');
            var friend = findFriendById(id);
            if (!friend) return;
            openChat(friend);
        });
    }
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (hubCurrentView === 'settings') switchHubView('play');
            else openSettingsSheet();
        });
    }
    for (var sti = 0; sti < settingsTabBtns.length; sti++) {
        settingsTabBtns[sti].addEventListener('click', function() {
            showSettingsTab(this.getAttribute('data-settings-tab'));
        });
    }
    if (accountsAddBtn) {
        accountsAddBtn.addEventListener('click', function() {
            addDiscordAccount();
        });
    }
    if (accountsListEl) {
        accountsListEl.addEventListener('click', function(e) {
            var btn = e.target && e.target.closest ? e.target.closest('[data-account-action]') : null;
            if (!btn) return;
            var action = btn.getAttribute('data-account-action');
            var id = btn.getAttribute('data-discord-id');
            if (action === 'switch') switchAccount(id);
            if (action === 'remove') removeSavedAccount(id);
        });
    }
    if (settingsPreviewOpen) {
        settingsPreviewOpen.addEventListener('click', function() {
            openProfileSheet();
        });
    }
    if (boot.loggedIn) {
        loadFriendsData({ silent: true });
        startFriendsRefresh();
    }

    function setStatus(msg, cls) {
        var onGate = document.body.classList.contains('is-gate');
        var clean = friendlyHubError(msg);
        var clsName = (onGate ? 'riot-status' : 'hxd-launch-status status') + (cls && clean ? ' ' + cls : '');
        var settingsClsName = 'status hub-settings-status' + (cls && clean ? ' ' + cls : '');
        if (st) {
            st.textContent = clean || '';
            st.className = clsName;
        }
        if (settingsSt) {
            settingsSt.textContent = clean || '';
            settingsSt.className = settingsClsName;
        }
    }
    function setSecDisabled(on) {
        for (var ci = 0; ci < cacheBtns.length; ci++) cacheBtns[ci].disabled = on;
        for (var fi = 0; fi < folderBtns.length; fi++) folderBtns[fi].disabled = on;
    }
    function setLaunchStep(text) { if (launchStepEl) launchStepEl.textContent = text || ''; }
    function stopLaunchStepCycle() {
        if (launchStepTimer) { clearInterval(launchStepTimer); launchStepTimer = null; }
    }
    function startPlanetSwallow() {
        document.body.classList.add('is-swallowing');
    }
    function clearPlanetSwallow() {
        document.body.classList.remove('is-swallowing');
    }
    function showLaunchOverlay() {
        if (!launchOverlay) return;
        launchOverlay.classList.add('on'); launchOverlay.classList.add('is-active');
        launchOverlay.setAttribute('aria-hidden', 'false');
        setLaunchStep(STEPS[0]);
        var stepIdx = 0;
        stopLaunchStepCycle();
        launchStepTimer = setInterval(function() {
            stepIdx += 1;
            if (stepIdx < STEPS.length) setLaunchStep(STEPS[stepIdx]);
        }, 500);
    }
    function hideLaunchOverlay() {
        stopLaunchStepCycle();
        if (!launchOverlay) return;
        launchOverlay.classList.remove('on'); launchOverlay.classList.remove('is-active');
        launchOverlay.setAttribute('aria-hidden', 'true');
    }
    function launchPlayFail(msg) {
        launchAnimActive = false;
        hideLaunchOverlay();
        clearPlanetSwallow();
        if (primary) primary.disabled = false;
        setSecDisabled(false);
        setStatus(msg || 'Could not start. Try again.', 'err');
    }
    function reloadLauncher() { window.location.href = base + '/launcher?_=' + Date.now(); }
    function fetchUser() {
        return fetch(base + '/user', { cache: 'no-store' })
            .then(function(r) { return r.json(); })
            .catch(function() { return { logged_in: false }; });
    }
    function startPlayWithTransition() {
        if (launchAnimActive || !boot.loggedIn) return;
        launchAnimActive = true;
        if (primary) primary.disabled = true;
        setSecDisabled(true);
        setStatus('');
        hideLaunchOverlay();
        clearPlanetSwallow();
        fetch(base + '/launcher/play', { method: 'POST', headers: { 'Content-Type': 'application/json' } })
            .then(function(r) { return r.json(); })
            .then(function(d) {
                if (d && d.need_auth) {
                    launchPlayFail('Connect Discord first.');
                    setTimeout(reloadLauncher, 600);
                    return;
                }
                if (!d || !d.ok) throw new Error('fail');
                launchAnimActive = false;
            })
            .catch(function() { launchPlayFail(); });
    }
    function startDiscordLogin() {
        if (authPollTimer) return;
        setStatus('Abriendo Discord…');
        if (discordBtn) {
            discordBtn.disabled = true;
            if (discordLabel) discordLabel.textContent = 'Esperando…';
        }
        if (discordGoBtn) discordGoBtn.disabled = true;
        fetch(base + '/auth').catch(function() {});
        var started = Date.now();
        authPollTimer = setInterval(function() {
            fetchUser().then(function(data) {
                if (data && data.logged_in) {
                    clearInterval(authPollTimer);
                    authPollTimer = null;
                    setStatus('Conectado.', 'ok');
                    if (discordBtn) discordBtn.disabled = true;
                    if (discordLabel) discordLabel.textContent = 'Conectado';
                    if (discordGoBtn) discordGoBtn.disabled = true;
                    setTimeout(function () {
                        if (document.body.classList.contains('is-gate')) reloadLauncher();
                    }, 2200);
                } else if (Date.now() - started > 120000) {
                    clearInterval(authPollTimer);
                    authPollTimer = null;
                    setStatus('Tiempo agotado. Probá de nuevo.', 'err');
                    if (discordBtn) {
                        discordBtn.disabled = false;
                        if (discordLabel) discordLabel.textContent = 'Continuar con Discord';
                    }
                    if (discordGoBtn) discordGoBtn.disabled = false;
                }
            });
        }, 1200);
    }

    if (primary) primary.addEventListener('click', openSpaceWithWarp);
    if (discordGoBtn) discordGoBtn.addEventListener('click', startDiscordLogin);
    if (discordBtn) discordBtn.addEventListener('click', startDiscordLogin);
    function bindCacheClick(btn) {
        btn.addEventListener('click', function() {
            setSecDisabled(true);
            setStatus('Clearing cache…');
            fetch(base + '/launcher/clear-cache', { method: 'POST' })
                .then(function(r) { return r.json(); })
                .then(function(d) {
                    if (d && d.ok) setStatus('Cache cleared.', 'ok');
                    else setStatus('Could not clear cache.', 'err');
                })
                .catch(function() { setStatus('Network error.', 'err'); })
                .finally(function() { setSecDisabled(false); });
        });
    }
    function bindFolderClick(btn) {
        btn.addEventListener('click', function() {
            fetch(base + '/launcher/open-folder', { method: 'POST' }).catch(function() {});
        });
    }
    for (var cbi = 0; cbi < cacheBtns.length; cbi++) bindCacheClick(cacheBtns[cbi]);
    for (var fbi = 0; fbi < folderBtns.length; fbi++) bindFolderClick(folderBtns[fbi]);
    if (quitBtn) quitBtn.addEventListener('click', function() {
        fetch(base + '/quit-app', { method: 'POST' }).catch(function() {});
    });
    if (logoutBtn) logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (logoutInProgress) return;
        logoutInProgress = true;
        logoutBtn.disabled = true;
        closeProfilePop();
        fetch(base + '/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' } })
            .then(function(r) { return r.json(); })
            .then(function(d) {
                if (!d || !d.ok) throw new Error('logout failed');
                setTimeout(function () {
                    if (document.body.classList.contains('is-hub')) reloadLauncher();
                }, 1800);
            })
            .catch(function() {
                logoutInProgress = false;
                logoutBtn.disabled = false;
                setStatus('Could not sign out.', 'err');
            });
    });

    // ---- Auto-updater UI (silent download + restart when ready) ----
    (function bindUpdaterUi() {
        var banner = document.getElementById('hxd-update-banner');
        var title = document.getElementById('hxd-update-title');
        var sub = document.getElementById('hxd-update-sub');
        var fill = document.getElementById('hxd-update-fill');
        var btnRestart = document.getElementById('hxd-update-restart');
        var btnCancel = document.getElementById('hxd-update-cancel');
        if (!banner) return;

        function paint(st) {
            // Keep banner visible for download/ready/error. Hide only when idle/uptodate/disabled.
            if (!st || !st.status || st.status === 'disabled' || st.status === 'idle' || st.status === 'uptodate' || st.status === 'checking') {
                banner.hidden = true;
                return;
            }
            banner.hidden = false;
            // Ensure fixed banner is never trapped under a hidden hub view.
            if (banner.parentElement !== document.body) {
                try { document.body.appendChild(banner); } catch (eMove) {}
            }
            var ver = (st.remote && st.remote.version) ? ('v' + st.remote.version) : '';
            if (st.status === 'available' || st.status === 'downloading') {
                if (title) title.textContent = 'Actualización ' + (ver || 'nueva');
                if (sub) {
                    var pct = st.progress && st.progress.percent ? st.progress.percent : 0;
                    sub.textContent = st.status === 'downloading'
                        ? ('Descargando… ' + pct + '%')
                        : 'Descargando en segundo plano…';
                }
                if (fill) fill.style.width = Math.max(4, (st.progress && st.progress.percent) || 8) + '%';
                if (btnRestart) btnRestart.hidden = true;
            } else if (st.status === 'ready') {
                if (title) title.textContent = 'Listo para instalar ' + (ver || '');
                if (sub) sub.textContent = (st.remote && st.remote.notes) || 'Reiniciá para aplicar la actualización.';
                if (fill) fill.style.width = '100%';
                if (btnRestart) btnRestart.hidden = false;
            } else if (st.status === 'error') {
                if (title) title.textContent = 'No se pudo actualizar';
                if (sub) sub.textContent = st.error || 'Reintentá más tarde.';
                if (fill) fill.style.width = '0%';
                if (btnRestart) btnRestart.hidden = true;
            } else if (st.status === 'applying') {
                if (title) title.textContent = 'Instalando…';
                if (sub) sub.textContent = 'El cliente se va a reiniciar.';
                if (btnRestart) btnRestart.hidden = true;
            }
        }

        function poll() {
            fetch(base + '/update/status')
                .then(function (r) { return r.json(); })
                .then(paint)
                .catch(function () {});
        }

        if (btnRestart) {
            btnRestart.addEventListener('click', function () {
                btnRestart.disabled = true;
                fetch(base + '/update/apply', { method: 'POST' })
                    .then(function (r) { return r.json(); })
                    .then(paint)
                    .catch(function () { btnRestart.disabled = false; });
            });
        }
        if (btnCancel) {
            btnCancel.addEventListener('click', function () {
                fetch(base + '/update/cancel', { method: 'POST' })
                    .then(function (r) { return r.json(); })
                    .then(paint)
                    .catch(function () {});
            });
        }

        // Kick a check+download, then poll progress.
        fetch(base + '/update/download', { method: 'POST' }).catch(function () {});
        poll();
        setInterval(poll, 1500);
    })();
})();
</script>
<div id="hxd-update-banner" class="hxd-update-banner" hidden>
  <div class="hxd-update-banner__text">
    <strong id="hxd-update-title">Actualización disponible</strong>
    <span id="hxd-update-sub">Descargando…</span>
  </div>
  <div class="hxd-update-banner__bar"><i id="hxd-update-fill"></i></div>
  <div class="hxd-update-banner__actions">
    <button type="button" id="hxd-update-restart" class="riot-game-play" hidden>Reiniciar e instalar</button>
    <button type="button" id="hxd-update-cancel" class="riot-game-ghost">Más tarde</button>
  </div>
</div>
</body></html>`;
}

module.exports = { renderLauncherPage, escapeHtml };
