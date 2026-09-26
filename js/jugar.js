// ============================================================
// IMPERANTIA — Página de unión (jugar.html)
// Abre Minecraft automáticamente y ofrece el servidor a mano
// ============================================================

const launchStatus = document.getElementById('launchStatus');
const launchText = document.getElementById('launchText');
const fallback = document.getElementById('fallbackMessage');
const launchBtn = document.getElementById('launchBtn');

let launchTimer = null;
let gameOpened = false;

function setStatus(state, text) {
    launchStatus.className = 'launch-status ' + state;
    launchText.textContent = text;
}

function showFallback() {
    fallback.style.display = 'block';
    setStatus('fail', 'Toca «Abrir Minecraft» para continuar');
}

function launchMinecraft() {
    gameOpened = false;
    fallback.style.display = 'none';
    setStatus('working', 'Abriendo Minecraft…');

    try {
        window.location.href = buildMinecraftDeeplink();
    } catch (e) {
        showFallback();
        return;
    }

    clearTimeout(launchTimer);
    launchTimer = setTimeout(() => {
        if (!gameOpened) showFallback();
    }, 3500);
}

function markOpened() {
    if (gameOpened) return;
    gameOpened = true;
    clearTimeout(launchTimer);
    fallback.style.display = 'none';
    setStatus('ok', '¡Minecraft abierto! Acepta la invitación del servidor.');
}

// El juego toma el foco: la pestaña pierde visibilidad/foco
window.addEventListener('blur', markOpened);
document.addEventListener('visibilitychange', () => {
    if (document.hidden) markOpened();
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('server-name-display').innerText = SERVER_CONFIG.name;
    document.getElementById('server-ip-display').innerText = SERVER_CONFIG.ip;
    document.getElementById('server-port-display').innerText = SERVER_CONFIG.port;
    document.getElementById('serverLogo').src = LOGO_URL;

    launchBtn.addEventListener('click', launchMinecraft);

    // Lanzamiento automático al entrar en la página
    setTimeout(launchMinecraft, 600);
});
