(function () {
  if (Injector.isMainFrame()) {
    return;
  }
  try {
    localStorage.setItem("haxball_welcome_seen", "1.2.3");
  } catch (_0x176431) {}
  return;
  var _0x2d4d4f = "1.2.3";
  var _0x51c972 = 0;
  var _0x5cf134 = localStorage.getItem("haxball_language") || "pt";
  var _0xa8397e = {
    pt: {
      welcomeTitle: "Bem-vindo à v" + _0x2d4d4f,
      welcomeText:
        "Esta versão traz diversas melhorias de desempenho, permitindo que você personalize o jogo para rodar da melhor forma possível no seu computador.<br><br>Todos os bugs reportados na versão anterior foram corrigidos, incluindo o problema que impedia o logout quando havia duas contas vinculadas.<br><br>Nas próximas páginas, explicamos cada novidade em detalhes.",
      langTitle: "Idioma",
      langText:
        "Desde o lançamento, recebemos muito carinho de jogadores de toda a América Latina! Argentinos, uruguaios, chilenos, peruanos e tantos outros nos pediram suporte ao espanhol.<br><br>Então aqui está: agora você pode usar o aplicativo no seu idioma. Gracias por todo el apoyo!",
      perfTitle: "Desempenho",
      perfText:
        "Adicionamos uma nova aba de Desempenho nas configurações com várias opções para otimizar seu jogo:",
      perfItems: [
        {
          title: "Linhas simplificadas",
          desc: "Reduz a espessura das linhas do campo de 3px para 1px.",
        },
        {
          title: "Curvas viram retas",
          desc: "Converte todas as linhas curvas em retas.",
        },
        {
          title: "Culling de viewport",
          desc: "Não desenha objetos fora da tela.",
        },
        {
          title: "Desativar avatares e cores",
          desc: "Remove avatares personalizados e usa cores padrão.",
        },
        {
          title: "Desativar nomes",
          desc: "Esconde os nomes dos jogadores.",
        },
        {
          title: "Campo simplificado",
          desc: "Usa cores sólidas no campo ao invés de imagens.",
        },
        {
          title: "Círculos de baixa qualidade",
          desc: "Pré-renderiza os círculos. Mais rápido mas pixelado.",
        },
        {
          title: "Desativar animações de gol",
          desc: "Remove as animações quando um gol é marcado.",
        },
        {
          title: "Desativar indicador do jogador",
          desc: "O círculo que mostra onde você está.",
        },
        {
          title: "Desativar indicador de chat",
          desc: "O balão que aparece quando alguém fala.",
        },
        {
          title: "Alta prioridade",
          desc: "Dá mais recursos do sistema para o jogo.",
        },
      ],
      perfFooter:
        "Exporte e importe suas configurações para compartilhar com amigos.",
      fixesTitle: "Correções",
      fixesText: "Problemas resolvidos nesta versão:",
      fixesItems: [
        "Login do Discord travava e abria uma pasta ao invés do navegador",
        'Texto "avatar set" ficava infinito ao usar /gif',
        "Otimizamos as requisições ao banco de dados para manter o ping estável",
        "Agora dá pra copiar o texto do chat normalmente",
      ],
      additionsTitle: "Outras Adições",
      additionsText: "Outras novidades que chegaram nesta versão:",
      additionsItems: [
        "Possível escolher resolução de 0 à 100%",
        "Atalho para fechar a header com tecla",
        "Limite de FPS baseado no monitor (gracias <b>rama</b> y <b>ysaias</b>)",
        "Melhorias na UI/UX (gracias <b>yuri</b> y <b>i76k</b>)",
        "Comando /input que simula um pequeno input lag para pessoas acostumadas",
        "Mais limites de caractere no nick (gracias <b>sankuu</b>)",
        "Host Token para criar salas sem precisar do reCAPTCHA",
        "Novos temas: Claro, Onix e Padrão",
        "Fixar salas no topo da lista",
        "Atualizador automático",
      ],
      teamTitle: "Equipe",
      teamText:
        "Crie ou entre em uma equipe para jogar com seus amigos! O sistema de equipes permite que você organize seu time com identidade visual própria.",
      teamItems: [
        {
          title: "Crie sua Equipe",
          desc: "Usuários Pro podem criar equipes com nome e logo personalizados.",
          icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
        },
        {
          title: "Convide Membros",
          desc: "Envie convites pelo username do Discord para montar seu time.",
          icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>',
        },
        {
          title: "Badge no Chat",
          desc: "Membros da equipe exibem o logo ao lado do nick no chat.",
          icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
        },
        {
          title: "Gerencie seu Time",
          desc: "Altere nome, sigla e logo a qualquer momento.",
          icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
        },
      ],
      teamFooter: "Acesse o painel de Equipe pelo menu lateral para começar.",
      thanksTitle: "Agradecimentos",
      thanksText: "Pessoas que ajudaram a tornar este projeto possível:",
      thanksItems: [
        {
          title: "<b>tenkaa</b>",
          desc: "Detectou uma falha grave de segurança que poderia atrapalhar totalmente o projeto.",
        },
        {
          title: "<b>aprodo</b>",
          desc: "Apresentou a versão 91 do Iron que é usado como base na versão Chromium e aumenta o FPS na maioria dos computadores.",
        },
        {
          title:
            "<b>night</b>, <b>dingusboy</b>, <b>Dzeko</b>, <b>Tekka</b>, <b>SUT Gabo</b>, <b>levi</b>, <b>seath</b>, <b>SirBusquets</b>",
          desc: "Divulgaram e testaram o aplicativo desde as primeiras versões detectando erros e dando suas opiniões.",
        },
        {
          title:
            "<b>castrolito</b>, <b>tix</b>, <b>zethus</b>, <b>zlatan</b>, <b>luzada!</b>, <b>mrks</b>, <b>tom</b>, <b>k1nGordo</b>, <b>sankuu</b>, <b>gate</b>",
          desc: "Detectaram bugs importantes para serem resolvidos.",
        },
        {
          title: "<b>Comunidade</b>",
          desc: "Fortalece o projeto apresentando ideias, criticando e reportando os bugs, é a maior razão pelo qual o aplicativo continua em constante evolução que infelizmente o nosso HaxBall não tem.",
        },
      ],
      proTitle: "Pro",
      proText:
        "Apoie o projeto e desbloqueie recursos exclusivos por apenas $4/mês:",
      proItems: [
        {
          title: "Personalização Total",
          desc: "Cores, fontes e gradientes no seu nick e chat.",
          icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="13.5" cy="6.5" r="0.5" fill="currentColor"/><circle cx="17.5" cy="10.5" r="0.5" fill="currentColor"/><circle cx="8.5" cy="7.5" r="0.5" fill="currentColor"/><circle cx="6.5" cy="12.5" r="0.5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z"/></svg>',
        },
        {
          title: "Verificado Exclusivo",
          desc: "Badge exclusivo com a cor que você escolher.",
          icon: '<svg width="18" height="18" viewBox="0 0 22 22" fill="none"><path d="M20.4 11c0-1.2-.7-2.3-1.8-2.9.4-1.2.2-2.5-.7-3.4-.9-.9-2.2-1.1-3.4-.7C14 2.9 12.9 2.2 11.7 2.2c-1.2 0-2.3.7-2.9 1.8-1.2-.4-2.5-.2-3.4.7-.9.9-1.1 2.2-.7 3.4C3.6 8.7 2.9 9.8 2.9 11c0 1.2.7 2.3 1.8 2.9-.4 1.2-.2 2.5.7 3.4.9.9 2.2 1.1 3.4.7.6 1.1 1.7 1.8 2.9 1.8 1.2 0 2.3-.7 2.9-1.8 1.2.4 2.5.2 3.4-.7.9-.9 1.1-2.2.7-3.4 1.1-.6 1.7-1.7 1.7-2.9z" fill="currentColor"/><path d="M15 9l-4.5 4.5L8 11" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        },
        {
          title: "Criar Equipes",
          desc: "Monte sua equipe com identidade visual.",
          icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
        },
        {
          title: "Acesso Antecipado",
          desc: "Teste novos recursos antes de todos.",
          icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>',
        },
        {
          title: "Apoie o Projeto",
          desc: "Sua assinatura ajuda a manter o app funcionando.",
          icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
        },
      ],
      proFooter:
        "Ex-assinantes ganham 1 semana grátis sempre que lançarmos novidades Pro.",
      prev: "Anterior",
      next: "Próximo",
      start: "Começar",
      portuguese: "Português",
      spanish: "Español",
    },
    es: {
      welcomeTitle: "Bienvenido a v" + _0x2d4d4f,
      welcomeText:
        "Esta versión trae diversas mejoras de rendimiento, permitiéndote personalizar el juego para que funcione de la mejor manera posible en tu computadora.<br><br>Todos los bugs reportados en la versión anterior fueron corregidos, incluyendo el problema que impedía cerrar sesión cuando había dos cuentas vinculadas.<br><br>En las próximas páginas, explicamos cada novedad en detalle.",
      langTitle: "Idioma",
      langText:
        "Desde el lanzamiento, recibimos mucho cariño de jugadores de toda América Latina! Argentinos, chilenos, peruanos y tantos otros nos pidieron soporte en español.<br><br>Así que aquí está: ahora puedes usar la aplicación en tu idioma. Gracias por todo el apoyo!",
      perfTitle: "Rendimiento",
      perfText:
        "Agregamos una nueva pestaña de Rendimiento en la configuración con varias opciones para optimizar tu juego:",
      perfItems: [
        {
          title: "Líneas simplificadas",
          desc: "Reduce el grosor de las líneas del campo de 3px a 1px.",
        },
        {
          title: "Curvas se vuelven rectas",
          desc: "Convierte todas las líneas curvas en rectas.",
        },
        {
          title: "Culling de viewport",
          desc: "No dibuja objetos fuera de la pantalla.",
        },
        {
          title: "Desactivar avatares y colores",
          desc: "Elimina avatares personalizados y usa colores estándar.",
        },
        {
          title: "Desactivar nombres",
          desc: "Oculta los nombres de los jugadores.",
        },
        {
          title: "Campo simplificado",
          desc: "Usa colores sólidos en el campo en lugar de imágenes.",
        },
        {
          title: "Círculos de baja calidad",
          desc: "Pre-renderiza los círculos. Más rápido pero pixelado.",
        },
        {
          title: "Desactivar animaciones de gol",
          desc: "Elimina las animaciones cuando se marca un gol.",
        },
        {
          title: "Desactivar indicador del jugador",
          desc: "El círculo que muestra dónde estás.",
        },
        {
          title: "Desactivar indicador de chat",
          desc: "El globo que aparece cuando alguien habla.",
        },
        {
          title: "Alta prioridad",
          desc: "Da más recursos del sistema al juego.",
        },
      ],
      perfFooter:
        "Exporta e importa tus configuraciones para compartir con amigos.",
      fixesTitle: "Correcciones",
      fixesText: "Problemas resueltos en esta versión:",
      fixesItems: [
        "Login de Discord se trababa y abría una carpeta en vez del navegador",
        'Texto "avatar set" quedaba infinito al usar /gif',
        "Optimizamos las solicitudes a la base de datos para mantener el ping estable",
        "Ahora puedes copiar el texto del chat normalmente",
      ],
      additionsTitle: "Otras Adiciones",
      additionsText: "Novedades que llegaron en esta versión:",
      additionsItems: [
        "Posible elegir resolución de 0 a 100%",
        "Atajo para cerrar la header con tecla",
        "Límite de FPS basado en el monitor (gracias <b>rama</b> y <b>ysaias</b>)",
        "Mejoras en la UI/UX (gracias <b>yuri</b> y <b>i76k</b>)",
        "Comando /input que simula un pequeño input lag para personas acostumbradas",
        "Más límites de caracteres en el nick (gracias <b>sankuu</b>)",
        "Host Token para crear salas sin necesitar el reCAPTCHA",
        "Nuevos temas: Claro, Onix y Estándar",
        "Fijar salas en la parte superior de la lista",
        "Actualizador automático",
      ],
      teamTitle: "Equipo",
      teamText:
        "¡Crea o únete a un equipo para jugar con tus amigos! El sistema de equipos te permite organizar tu team con identidad visual propia.",
      teamItems: [
        {
          title: "Crea tu Equipo",
          desc: "Usuarios Pro pueden crear equipos con nombre y logo personalizados.",
          icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
        },
        {
          title: "Invita Miembros",
          desc: "Envía invitaciones por username de Discord para armar tu team.",
          icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>',
        },
        {
          title: "Badge en el Chat",
          desc: "Los miembros del equipo muestran el logo junto al nick en el chat.",
          icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
        },
        {
          title: "Gestiona tu Team",
          desc: "Cambia nombre, sigla y logo en cualquier momento.",
          icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
        },
      ],
      teamFooter:
        "Accede al panel de Equipo desde el menú lateral para comenzar.",
      thanksTitle: "Agradecimientos",
      thanksText: "Personas que ayudaron a hacer este proyecto posible:",
      thanksItems: [
        {
          title: "<b>tenkaa</b>",
          desc: "Detectó una falla grave de seguridad que podría perjudicar totalmente el proyecto.",
        },
        {
          title: "<b>aprodo</b>",
          desc: "Presentó la versión 91 de Iron que se usa como base en la versión Chromium y aumenta el FPS en la mayoría de las computadoras.",
        },
        {
          title:
            "<b>night</b>, <b>dingusboy</b>, <b>Dzeko</b>, <b>Tekka</b>, <b>SUT Gabo</b>, <b>levi</b>, <b>seath</b>, <b>SirBusquets</b>",
          desc: "Divulgaron y probaron la aplicación desde las primeras versiones detectando errores y dando sus opiniones.",
        },
        {
          title:
            "<b>castrolito</b>, <b>tix</b>, <b>zethus</b>, <b>zlatan</b>, <b>luzada!</b>, <b>mrks</b>, <b>tom</b>, <b>k1nGordo</b>, <b>sankuu</b>, <b>gate</b>",
          desc: "Detectaron bugs importantes para ser resueltos.",
        },
        {
          title: "<b>Comunidad</b>",
          desc: "Fortalece el proyecto presentando ideas, criticando y reportando los bugs, es la mayor razón por la cual la aplicación continúa en constante evolución que lamentablemente nuestro HaxBall no tiene.",
        },
      ],
      proTitle: "Pro",
      proText:
        "Apoya el proyecto y desbloquea recursos exclusivos por solo $4/mes:",
      proItems: [
        {
          title: "Personalización Total",
          desc: "Colores, fuentes y gradientes en tu nick y chat.",
          icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="13.5" cy="6.5" r="0.5" fill="currentColor"/><circle cx="17.5" cy="10.5" r="0.5" fill="currentColor"/><circle cx="8.5" cy="7.5" r="0.5" fill="currentColor"/><circle cx="6.5" cy="12.5" r="0.5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z"/></svg>',
        },
        {
          title: "Verificado Exclusivo",
          desc: "Badge exclusivo con el color que elijas.",
          icon: '<svg width="18" height="18" viewBox="0 0 22 22" fill="none"><path d="M20.4 11c0-1.2-.7-2.3-1.8-2.9.4-1.2.2-2.5-.7-3.4-.9-.9-2.2-1.1-3.4-.7C14 2.9 12.9 2.2 11.7 2.2c-1.2 0-2.3.7-2.9 1.8-1.2-.4-2.5-.2-3.4.7-.9.9-1.1 2.2-.7 3.4C3.6 8.7 2.9 9.8 2.9 11c0 1.2.7 2.3 1.8 2.9-.4 1.2-.2 2.5.7 3.4.9.9 2.2 1.1 3.4.7.6 1.1 1.7 1.8 2.9 1.8 1.2 0 2.3-.7 2.9-1.8 1.2.4 2.5.2 3.4-.7.9-.9 1.1-2.2.7-3.4 1.1-.6 1.7-1.7 1.7-2.9z" fill="currentColor"/><path d="M15 9l-4.5 4.5L8 11" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        },
        {
          title: "Crear Equipos",
          desc: "Arma tu equipo con identidad visual.",
          icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
        },
        {
          title: "Acceso Anticipado",
          desc: "Prueba nuevos recursos antes que todos.",
          icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>',
        },
        {
          title: "Apoya el Proyecto",
          desc: "Tu suscripción ayuda a mantener la app funcionando.",
          icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
        },
      ],
      proFooter:
        "Ex-suscriptores ganan 1 semana gratis cada vez que lancemos novedades Pro.",
      prev: "Anterior",
      next: "Siguiente",
      start: "Comenzar",
      portuguese: "Português",
      spanish: "Español",
    },
  };
  function _0x152bdf(_0x126305) {
    return (
      _0xa8397e[_0x5cf134][_0x126305] || _0xa8397e.pt[_0x126305] || _0x126305
    );
  }
  function _0x1884d5(_0x2c3f49, _0x454b19) {
    if (_0x454b19) {
      var _0x3dc3d2 = Math.ceil(_0x2c3f49.length / 2);
      var _0x709c83 = _0x2c3f49.slice(0, _0x3dc3d2);
      var _0x2f43a6 = _0x2c3f49.slice(_0x3dc3d2);
      function _0x400b17(_0x6d210d) {
        var _0x4e122e = "";
        for (var _0x538cc2 = 0; _0x538cc2 < _0x6d210d.length; _0x538cc2++) {
          var _0x577d23 = _0x6d210d[_0x538cc2];
          if (typeof _0x577d23 === "object") {
            _0x4e122e +=
              '<div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:10px;white-space:nowrap;"><div style="width:5px;height:5px;background:#555;border-radius:50%;flex-shrink:0;margin-top:5px;"></div><div><div style="color:#ccc;font-size:12px;font-weight:500;">' +
              _0x577d23.title +
              "" +
              _0x577d23.desc +
              "";
          } else {
            _0x4e122e +=
              '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;white-space:nowrap;"><div style="width:5px;height:5px;background:#555;border-radius:50%;flex-shrink:0;"></div><span style="color:#999;font-size:12px;">' +
              _0x577d23 +
              "</span>";
          }
        }
        return _0x4e122e;
      }
      return (
        '<div style="display:flex;gap:24px;margin-top:14px;"><div style="flex:1;">' +
        _0x400b17(_0x709c83) +
        '</div><div style="flex:1;">' +
        _0x400b17(_0x2f43a6) +
        ""
      );
    } else {
      var _0xa0ceef =
        '<div style="margin-top:14px;display:flex;flex-direction:column;gap:12px;">';
      for (var _0x5333cd = 0; _0x5333cd < _0x2c3f49.length; _0x5333cd++) {
        var _0xcb7c1d = _0x2c3f49[_0x5333cd];
        if (typeof _0xcb7c1d === "object") {
          if (_0xcb7c1d.icon) {
            _0xa0ceef +=
              '<div style="display:flex;align-items:flex-start;gap:14px;white-space:nowrap;"><div style="color:#888;flex-shrink:0;display:flex;align-items:center;height:20px;">' +
              _0xcb7c1d.icon +
              '</div><div><div style="color:#fff;font-size:14px;font-weight:500;line-height:20px;">' +
              _0xcb7c1d.title +
              "" +
              _0xcb7c1d.desc +
              '</div></div><div style="color:#666;font-size:12px;margin-top:4px;">';
          } else {
            _0xa0ceef +=
              '<div style="display:flex;align-items:flex-start;gap:10px;white-space:nowrap;"><div style="width:5px;height:5px;background:#555;border-radius:50%;flex-shrink:0;margin-top:6px;"></div><div><div style="color:#ccc;font-size:13px;font-weight:500;">' +
              _0xcb7c1d.title +
              "" +
              _0xcb7c1d.desc +
              '</div><div style="color:#555;font-size:11px;margin-top:2px;">';
          }
        } else {
          _0xa0ceef +=
            '<div style="display:flex;align-items:center;gap:10px;white-space:nowrap;"><span style="color:#999;font-size:13px;">' +
            _0xcb7c1d +
            "</span>";
        }
      }
      _0xa0ceef += "";
      return _0xa0ceef;
    }
  }
  function _0x18d31d() {
    return '<div style="background:#0a0a0a;border:1px solid #222;border-radius:8px;padding:12px;width:180px;flex-shrink:0;"><div style="color:#666;font-size:9px;margin-bottom:8px;text-transform:uppercase;">Preview</div><div style="display:flex;flex-direction:column;gap:6px;"><div style="display:flex;align-items:center;gap:6px;"><div style="width:12px;height:12px;border:1px solid #333;border-radius:2px;background:#22c55e;display:flex;align-items:center;justify-content:center;"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg><span style="color:#888;font-size:9px;">Linhas simples</span><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></div><span style="color:#888;font-size:9px;">Culling</span><div style="display:flex;align-items:center;gap:6px;"><div style="width:12px;height:12px;border:1px solid #333;border-radius:2px;"></div><span style="color:#555;font-size:9px;">Alta prioridade</span></div><div style="margin-top:10px;padding-top:8px;border-top:1px solid #1a1a1a;display:flex;gap:6px;"><div style="flex:1;padding:4px;background:#1a1a1a;border-radius:4px;text-align:center;color:#666;font-size:8px;">Exportar</div><div style="flex:1;padding:4px;background:#1a1a1a;border-radius:4px;text-align:center;color:#666;font-size:8px;">Importar</div>';
  }
  function _0x24d7b8() {
    return '<div style="background:#0a0a0a;border:1px solid #222;border-radius:8px;padding:12px;width:180px;flex-shrink:0;"><div style="color:#666;font-size:9px;margin-bottom:10px;text-transform:uppercase;">Preview</div><div style="text-align:center;padding:14px 10px;background:#111;border-radius:6px;border:1px solid #1a1a1a;margin-bottom:10px;"><div style="display:inline-flex;align-items:center;gap:5px;"><span style="background:linear-gradient(90deg,#f59e0b,#ef4444);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:13px;font-weight:600;">snow</span><svg width="12" height="12" viewBox="0 0 22 22" fill="#3b82f6"><path d="M20.4 11c0-1.2-.7-2.3-1.8-2.9.4-1.2.2-2.5-.7-3.4-.9-.9-2.2-1.1-3.4-.7C14 2.9 12.9 2.2 11.7 2.2c-1.2 0-2.3.7-2.9 1.8-1.2-.4-2.5-.2-3.4.7-.9.9-1.1 2.2-.7 3.4C3.6 8.7 2.9 9.8 2.9 11c0 1.2.7 2.3 1.8 2.9-.4 1.2-.2 2.5.7 3.4.9.9 2.2 1.1 3.4.7.6 1.1 1.7 1.8 2.9 1.8 1.2 0 2.3-.7 2.9-1.8 1.2.4 2.5.2 3.4-.7.9-.9 1.1-2.2.7-3.4 1.1-.6 1.7-1.7 1.7-2.9z"/><path d="M15 9l-4.5 4.5L8 11" stroke="#0a0a0a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div style="display:flex;gap:8px;margin-bottom:10px;"><div style="flex:1;background:#111;border-radius:6px;padding:8px;"><div style="color:#666;font-size:8px;margin-bottom:4px;">NICK</div><div style="display:flex;gap:4px;"><div style="width:16px;height:16px;background:#f59e0b;border-radius:3px;border:1px solid #333;"></div><div style="width:16px;height:16px;background:#ef4444;border-radius:3px;border:1px solid #333;"></div></div><div style="flex:1;background:#111;border-radius:6px;padding:8px;"><div style="color:#666;font-size:8px;margin-bottom:4px;">BADGE</div><div style="display:flex;gap:4px;"><div style="width:16px;height:16px;background:#3b82f6;border-radius:3px;border:1px solid #333;"></div></div><div style="padding:8px;background:linear-gradient(90deg,rgba(99,102,241,0.2),rgba(139,92,246,0.2));border-radius:6px;border:1px solid rgba(99,102,241,0.3);"><span style="background:linear-gradient(90deg,#f59e0b,#ef4444);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:10px;font-weight:500;">snow</span><svg width="8" height="8" viewBox="0 0 22 22" fill="#3b82f6"><path d="M20.4 11c0-1.2-.7-2.3-1.8-2.9.4-1.2.2-2.5-.7-3.4-.9-.9-2.2-1.1-3.4-.7C14 2.9 12.9 2.2 11.7 2.2c-1.2 0-2.3.7-2.9 1.8-1.2-.4-2.5-.2-3.4.7-.9.9-1.1 2.2-.7 3.4C3.6 8.7 2.9 9.8 2.9 11c0 1.2.7 2.3 1.8 2.9-.4 1.2-.2 2.5.7 3.4.9.9 2.2 1.1 3.4.7.6 1.1 1.7 1.8 2.9 1.8 1.2 0 2.3-.7 2.9-1.8 1.2.4 2.5.2 3.4-.7.9-.9 1.1-2.2.7-3.4 1.1-.6 1.7-1.7 1.7-2.9z"/></svg></div><div style="margin-top:10px;padding:8px;background:#fff;border-radius:6px;text-align:center;color:#000;font-size:10px;font-weight:600;">Salvar</div>';
  }
  function _0x1b6a9f() {
    return (
      '<div style="background:#0a0a0a;border:1px solid #222;border-radius:8px;padding:12px;width:180px;flex-shrink:0;"><div style="color:#666;font-size:9px;margin-bottom:10px;text-transform:uppercase;">Preview</div><div style="display:flex;align-items:center;gap:10px;padding:10px;background:#111;border-radius:6px;border:1px solid #1a1a1a;margin-bottom:10px;"><div style="width:32px;height:32px;background:#1a1a1a;border-radius:4px;display:flex;align-items:center;justify-content:center;"><svg width="16" height="16" viewBox="0 0 24 24" fill="#3b82f6" stroke="#3b82f6" stroke-width="1"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><div><div style="color:#fff;font-size:11px;font-weight:600;">Tigers</div><div style="color:#555;font-size:9px;margin-top:2px;">3 ' +
      (_0x5cf134 === "es" ? "miembros" : "membros") +
      "" +
      (_0x5cf134 === "es" ? "LISTA DE JUGADORES" : "LISTA DE JOGADORES") +
      "" +
      (_0x5cf134 === "es" ? "MIEMBROS" : "MEMBROS") +
      ""
    );
  }
  function _0x1e7ac0() {
    return [
      {
        title: _0x152bdf("welcomeTitle"),
        content: _0x152bdf("welcomeText"),
        type: "text",
      },
      {
        title: _0x152bdf("langTitle"),
        content: _0x152bdf("langText"),
        type: "language",
      },
      {
        title: _0x152bdf("perfTitle"),
        content:
          _0x152bdf("perfText") +
          _0x1884d5(_0x152bdf("perfItems"), true) +
          '<div style="margin-top:16px;color:#666;">' +
          _0x152bdf("perfFooter") +
          "</div>",
        type: "perf",
      },
      {
        title: _0x152bdf("fixesTitle"),
        content:
          _0x152bdf("fixesText") + _0x1884d5(_0x152bdf("fixesItems"), false),
        type: "text",
      },
      {
        title: _0x152bdf("additionsTitle"),
        content:
          _0x152bdf("additionsText") +
          _0x1884d5(_0x152bdf("additionsItems"), false),
        type: "text",
      },
      {
        title: _0x152bdf("proTitle"),
        content:
          _0x152bdf("proText") +
          _0x1884d5(_0x152bdf("proItems"), false) +
          '<div style="margin-top:16px;color:#666;font-size:11px;">' +
          _0x152bdf("proFooter") +
          "",
        type: "pro",
      },
      {
        title: _0x152bdf("teamTitle"),
        content:
          _0x152bdf("teamText") +
          _0x1884d5(_0x152bdf("teamItems"), false) +
          '<div style="margin-top:16px;color:#666;font-size:11px;">' +
          _0x152bdf("teamFooter") +
          "</div>",
        type: "team",
      },
      {
        title: _0x152bdf("thanksTitle"),
        content:
          _0x152bdf("thanksText") + _0x1884d5(_0x152bdf("thanksItems"), false),
        type: "text",
      },
    ];
  }
  function _0x46149a() {
    if (document.getElementById("welcome-popup-overlay")) {
      return;
    }
    var _0x40dcb5 = document.createElement("div");
    _0x40dcb5.id = "welcome-popup-overlay";
    _0x40dcb5.style.cssText =
      "position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.9);z-index:10002;display:flex;align-items:center;justify-content:center;";
    var _0x421a4b = document.createElement("div");
    _0x421a4b.id = "welcome-popup";
    _0x421a4b.style.cssText =
      "background:#111;border:1px solid #252525;border-radius:12px;max-width:95vw;overflow:hidden;";
    function _0xbdd1b7(_0x318d6e) {
      var _0x5a4d24 = _0x1e7ac0();
      var _0x14b52e = _0x5a4d24[_0x318d6e];
      var _0x16948d = _0x318d6e === 0;
      var _0x74b4ec = _0x318d6e === _0x5a4d24.length - 1;
      var _0x2771b8 = "";
      var _0x505b33 = "";
      if (_0x14b52e.type === "language") {
        _0x2771b8 =
          '<div style="color:#888;font-size:13px;line-height:1.7;">' +
          _0x14b52e.content +
          '</div><div style="display:flex;gap:12px;margin-top:24px;"><button id="lang-pt" style="flex:1;padding:14px;background:' +
          (_0x5cf134 === "pt" ? "#fff" : "#1a1a1a") +
          ";border:1px solid " +
          (_0x5cf134 === "pt" ? "#fff" : "#333") +
          ";border-radius:8px;color:" +
          (_0x5cf134 === "pt" ? "#000" : "#888") +
          ";font-size:13px;font-weight:" +
          (_0x5cf134 === "pt" ? "600" : "400") +
          ';cursor:pointer;">' +
          _0x152bdf("portuguese") +
          '</button><button id="lang-es" style="flex:1;padding:14px;background:' +
          (_0x5cf134 === "es" ? "#fff" : "#1a1a1a") +
          ";border:1px solid " +
          (_0x5cf134 === "es" ? "#fff" : "#333") +
          ";border-radius:8px;color:" +
          (_0x5cf134 === "es" ? "#000" : "#888") +
          ";font-size:13px;font-weight:" +
          (_0x5cf134 === "es" ? "600" : "400") +
          ';cursor:pointer;">' +
          _0x152bdf("spanish") +
          '</button><button id="lang-es" style="flex:1;padding:14px;background:';
      } else if (_0x14b52e.type === "perf") {
        _0x2771b8 =
          '<div style="color:#888;font-size:13px;line-height:1.7;">' +
          _0x14b52e.content +
          "</div>";
        _0x505b33 = _0x18d31d();
      } else if (_0x14b52e.type === "team") {
        _0x2771b8 =
          '<div style="color:#888;font-size:13px;line-height:1.7;">' +
          _0x14b52e.content +
          "</div>";
        _0x505b33 = _0x1b6a9f();
      } else if (_0x14b52e.type === "pro") {
        _0x2771b8 =
          '<div style="color:#888;font-size:13px;line-height:1.7;">' +
          _0x14b52e.content +
          "";
        _0x505b33 = _0x24d7b8();
      } else {
        _0x2771b8 =
          '<div style="color:#888;font-size:13px;line-height:1.7;">' +
          _0x14b52e.content +
          "</div>";
      }
      var _0x1aecfc = _0x505b33
        ? '<div style="display:flex;gap:20px;align-items:flex-start;"><div style="flex:1;">' +
          _0x2771b8 +
          "" +
          _0x505b33 +
          ""
        : _0x2771b8;
      _0x421a4b.innerHTML =
        '<div style="padding:20px 24px;border-bottom:1px solid #222;display:flex;justify-content:space-between;align-items:center;"><span style="color:#fff;font-size:17px;font-weight:600;">' +
        _0x14b52e.title +
        '</span><span style="color:#444;font-size:11px;">' +
        (_0x318d6e + 1) +
        " / " +
        _0x5a4d24.length +
        '</span><div style="padding:24px;">' +
        _0x1aecfc +
        "" +
        (_0x16948d ? "transparent" : "#1a1a1a") +
        ";border:none;border-radius:6px;color:" +
        (_0x16948d ? "#333" : "#999") +
        ";font-size:12px;cursor:" +
        (_0x16948d ? "default" : "pointer") +
        ';display:flex;align-items:center;gap:6px;"' +
        (_0x16948d ? " disabled" : "") +
        '><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>' +
        _0x152bdf("prev") +
        '</button><button id="welcome-next" style="padding:10px 18px;background:#fff;border:none;border-radius:6px;color:#000;font-size:12px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:6px;">' +
        (_0x74b4ec ? _0x152bdf("start") : _0x152bdf("next")) +
        (_0x74b4ec
          ? ""
          : '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>') +
        '</button><div style="padding:16px 24px;border-top:1px solid #222;display:flex;justify-content:space-between;align-items:center;"><button id="welcome-prev" style="padding:10px 18px;background:';
      _0x421a4b.querySelector("#welcome-prev").onclick = function () {
        if (_0x318d6e > 0) {
          _0x51c972--;
          _0xbdd1b7(_0x51c972);
        }
      };
      _0x421a4b.querySelector("#welcome-next").onclick = function () {
        if (_0x74b4ec) {
          _0x4cf7b7();
        } else {
          _0x51c972++;
          _0xbdd1b7(_0x51c972);
        }
      };
      if (_0x14b52e.type === "language") {
        _0x421a4b.querySelector("#lang-pt").onclick = function () {
          if (_0x5cf134 !== "pt") {
            _0x5cf134 = "pt";
            localStorage.setItem("haxball_language", "pt");
            _0x51c972 = 0;
            _0xbdd1b7(_0x51c972);
          }
        };
        _0x421a4b.querySelector("#lang-es").onclick = function () {
          if (_0x5cf134 !== "es") {
            _0x5cf134 = "es";
            localStorage.setItem("haxball_language", "es");
            _0x51c972 = 0;
            _0xbdd1b7(_0x51c972);
          }
        };
      }
    }
    _0xbdd1b7(0);
    _0x40dcb5.appendChild(_0x421a4b);
    document.body.appendChild(_0x40dcb5);
  }
  function _0x4cf7b7() {
    var _0x4f857b = document.getElementById("welcome-popup-overlay");
    if (_0x4f857b) {
      _0x4f857b.remove();
    }
    localStorage.setItem("haxball_welcome_seen", _0x2d4d4f);
  }
  window.__showWelcomePopup = _0x46149a;
  window.__closeWelcomePopup = _0x4cf7b7;
  Injector.waitForElement("body").then(function () {
    var _0x262f8e = localStorage.getItem("haxball_welcome_seen");
    if (_0x262f8e !== _0x2d4d4f) {
      setTimeout(_0x46149a, 800);
    }
  });
})();
