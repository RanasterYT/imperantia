// ============================================================
// IMPERANTIA — Configuración compartida entre páginas
// ============================================================

const SERVER_CONFIG = {
    name: "Imperantia",
    ip: "147.185.221.214",
    port: "49637"
};
const DISCORD_INVITE = "https://discord.gg/yGJuZkrqmU";
const MAP_URL = "./map/index.html";
const LOGO_URL = "title.png";
const JOIN_URL = "jugar.html";

// ===== ENLACE PROFUNDO DE MINECRAFT =====
function buildMinecraftDeeplink() {
    const encodedName = encodeURIComponent(SERVER_CONFIG.name);
    return `minecraft://?addExternalServer=${encodedName}|${SERVER_CONFIG.ip}:${SERVER_CONFIG.port}`;
}

function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

// ===== COPIAR AL PORTAPAPELES =====
window.copyToClipboard = function (type, btn) {
    let text = '';
    switch (type) {
        case 'server-name':
            text = SERVER_CONFIG.name;
            break;
        case 'server-ip':
            text = SERVER_CONFIG.ip;
            break;
        case 'server-port':
            text = SERVER_CONFIG.port;
            break;
        default:
            return;
    }
    const target = btn || (typeof event !== 'undefined' ? event.target : null);
    navigator.clipboard.writeText(text).then(() => {
        if (!target) return;
        const original = target.innerText;
        target.innerText = '✓ Copiado';
        setTimeout(() => { target.innerText = original; }, 1500);
    }).catch(() => { });
};
