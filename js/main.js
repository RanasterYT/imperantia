// ============================================================
// IMPERANTIA — Funciones de la página principal
// ============================================================

// ===== CONFIGURACIÓN =====
const SERVER_CONFIG = {
    name: "Imperantia",
    ip: "147.185.221.26",
    port: "14854"
};
const DISCORD_INVITE = "https://discord.gg/yGJuZkrqmU";
const MAP_URL = "./map/index.html";
const LOGO_URL = "title.png";

// ===== REFS DEL DOM =====
const statusBadge = document.getElementById('statusBadge');
const playersValue = document.getElementById('playersValue');
const versionValue = document.getElementById('versionValue');
const motdValue = document.getElementById('motdValue');
const lastUpdateTimeSpan = document.getElementById('lastUpdateTime');

document.getElementById('server-name-display').innerText = SERVER_CONFIG.name;
document.getElementById('server-ip-display').innerText = SERVER_CONFIG.ip;
document.getElementById('server-port-display').innerText = SERVER_CONFIG.port;
document.getElementById('discordLink').href = DISCORD_INVITE;
document.getElementById('mapButton').href = MAP_URL;
document.getElementById('serverLogo').src = LOGO_URL;

// ===== FUNCIONES =====
window.copyToClipboard = function (type) {
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
    navigator.clipboard.writeText(text).then(() => {
        const btn = event.target;
        const original = btn.innerText;
        btn.innerText = '✓ Copiado';
        setTimeout(() => { btn.innerText = original; }, 1500);
    }).catch(() => { });
};

function formatTime(timestampMs) {
    if (!timestampMs) return 'Desconocido';
    return new Date(timestampMs).toLocaleTimeString() + ' · ' + new Date(timestampMs).toLocaleDateString();
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function (m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    }).replace(/\n/g, '<br>');
}

async function fetchServerStatus() {
    const apiUrl =
        `https://api.mcstatus.io/v2/status/bedrock/${SERVER_CONFIG.ip}:${SERVER_CONFIG.port}`;
    statusBadge.className = 'status-badge loading';
    statusBadge.innerHTML = '⏳ Consultando...';
    playersValue.innerText = '---';
    versionValue.innerText = 'Cargando...';
    motdValue.innerHTML = 'Obteniendo información...';
    lastUpdateTimeSpan.innerText = 'Actualizando...';

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        if (data.online === true) {
            statusBadge.className = 'status-badge online';
            statusBadge.innerHTML = '🟢 ONLINE';
            playersValue.innerText = `${data.players?.online ?? 0} / ${data.players?.max ?? 0}`;
            versionValue.innerText = `${data.version?.name ?? 'Desconocida'} (protocolo ${data.version?.protocol ?? '?'})`;
            let cleanMotd = data.motd?.clean ?? 'Bienvenido a Imperantia';
            motdValue.innerHTML = escapeHtml(cleanMotd);
            lastUpdateTimeSpan.innerText = data.retrieved_at ? `Última actualización: ${formatTime(data.retrieved_at)}` :
                'Actualizado ahora';
        } else {
            statusBadge.className = 'status-badge offline';
            statusBadge.innerHTML = '🔴 OFFLINE';
            playersValue.innerText = 'Servidor caído';
            versionValue.innerText = 'No disponible';
            motdValue.innerHTML = 'El servidor está en mantenimiento o apagado. Vuelve pronto.';
            lastUpdateTimeSpan.innerText = data.retrieved_at ? `Último intento: ${formatTime(data.retrieved_at)}` :
                'Sin conexión.';
        }
    } catch (error) {
        console.error(error);
        statusBadge.className = 'status-badge offline';
        statusBadge.innerHTML = '⚠️ ERROR';
        playersValue.innerText = 'Error de red';
        versionValue.innerText = 'No disponible';
        motdValue.innerHTML = 'No se pudo contactar con el estado del servidor.';
        lastUpdateTimeSpan.innerText = 'Reintentando...';
    }
}

let refreshInterval;

function startAutoRefresh() {
    if (refreshInterval) clearInterval(refreshInterval);
    refreshInterval = setInterval(fetchServerStatus, 60000);
}

// ===== ENLACE PROFUNDO DE MINECRAFT =====
function buildMinecraftDeeplink() {
    const encodedName = encodeURIComponent(SERVER_CONFIG.name);
    return `minecraft://?addExternalServer=${encodedName}|${SERVER_CONFIG.ip}:${SERVER_CONFIG.port}`;
}

function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

function openMinecraft() {
    const deepLink = buildMinecraftDeeplink();
    const fallback = document.getElementById('fallbackMessage');
    if (isIOS()) {
        window.location.href = deepLink;
        setTimeout(() => fallback.style.display = 'block', 2000);
    } else {
        try {
            window.location.assign(deepLink);
            const t = setTimeout(() => fallback.style.display = 'block', 2000);
            window.addEventListener('blur', () => {
                clearTimeout(t);
                fallback.style.display = 'none';
            }, { once: true });
        } catch (e) {
            fallback.style.display = 'block';
        }
    }
}

// ===== ANIMACIONES AL HACER SCROLL =====
const animated = document.querySelectorAll('.animate-on-scroll');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            observer.unobserve(e.target);
        }
    });
}, { threshold: 0.2 });
animated.forEach(el => observer.observe(el));

// ===== INICIO =====
document.addEventListener('DOMContentLoaded', () => {
    fetchServerStatus();
    startAutoRefresh();
    document.getElementById('manualRefreshBtn').addEventListener('click', fetchServerStatus);
    document.getElementById('joinButton').addEventListener('click', openMinecraft);
    document.getElementById('joinButton2').addEventListener('click', openMinecraft);

    animated.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 100) {
            el.classList.add('visible');
        }
    });
});
