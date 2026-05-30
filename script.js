
// ── Header scroll ──
window.addEventListener('scroll', () => {
    document.getElementById('cabecalho').classList.toggle('scrolled', window.scrollY > 40);
});

// ── Menu mobile ──
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('navegacao');
menuToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', nav.classList.contains('open'));
});
document.querySelectorAll('.navegacao a').forEach(l => l.addEventListener('click', () => nav.classList.remove('open')));

// ── Scroll reveal ──
const revealEls = document.querySelectorAll('.card, .doe-card, .ponto-card, .sec-header, .faixa-versiculo, .formulario-contato, .contato-info');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, Number(entry.target.dataset.delay || 0));
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });
revealEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity 0.65s cubic-bezier(.16,1,.3,1), transform 0.65s cubic-bezier(.16,1,.3,1)';
    observer.observe(el);
});

// ── PIX ──
function copiarPix() {
    const chave = document.getElementById('pixKey').textContent.trim();
    navigator.clipboard.writeText(chave).then(() => {
        const toast = document.getElementById('toast');
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2600);
        const btn = document.querySelector('.btn-copiar');
        btn.textContent = '✓ Copiado!';
        btn.classList.add('copiado');
        setTimeout(() => { btn.textContent = 'Copiar'; btn.classList.remove('copiado'); }, 2500);
    }).catch(() => alert('Chave PIX: ' + chave));
}

// ── Formulário ──
function enviarForm(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.textContent = 'Enviando...';
    btn.style.opacity = '.7';
    btn.disabled = true;
    setTimeout(() => {
        e.target.innerHTML = `<div style="text-align:center;padding:2.5rem 1rem;">
            <div style="font-size:3rem;margin-bottom:1rem;">🙏</div>
            <h3 style="font-family:'Playfair Display',serif;color:#5a2b27;font-size:1.5rem;margin-bottom:.8rem;">Que Deus abençoe você!</h3>
            <p style="color:#7a3f3a;font-size:14px;line-height:1.7;">Recebemos sua mensagem.<br>Entraremos em contato em breve!</p>
        </div>`;
    }, 1200);
}

// ── Carrossel ──
(function () {
    const viewport = document.querySelector('.carrossel-viewport');
    const trilha   = document.getElementById('carrosselTrilha');
    const dotsWrap = document.getElementById('carrosselDots');
    if (!trilha) return;

    const slides = Array.from(trilha.querySelectorAll('.slide-item'));
    const total  = slides.length;
    let atual = 0, timer;

    // Garante que cada slide tem largura fixa = 100% do viewport
    function ajustarLarguras() {
        const w = viewport.offsetWidth;
        slides.forEach(s => { s.style.flex = '0 0 ' + w + 'px'; s.style.width = w + 'px'; });
        trilha.style.width = (w * total) + 'px';
        moverPara(atual, false);
    }

    function moverPara(idx, animado = true) {
        atual = (idx + total) % total;
        const w = viewport.offsetWidth;
        trilha.style.transition = animado ? 'transform 0.55s cubic-bezier(0.45,0,0.15,1)' : 'none';
        trilha.style.transform  = `translateX(-${atual * w}px)`;
        dotsWrap.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('ativo', i === atual));
        reiniciarTimer();
    }

    // Criar dots
    slides.forEach((_, i) => {
        const d = document.createElement('span');
        d.className = 'dot' + (i === 0 ? ' ativo' : '');
        d.addEventListener('click', () => moverPara(i));
        dotsWrap.appendChild(d);
    });

    function reiniciarTimer() {
        clearInterval(timer);
        timer = setInterval(() => moverPara(atual + 1), 4500);
    }

    document.getElementById('ctrlProximo')?.addEventListener('click',  () => moverPara(atual + 1));
    document.getElementById('ctrlAnterior')?.addEventListener('click', () => moverPara(atual - 1));

    // Touch/swipe
    let startX = 0;
    viewport.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    viewport.addEventListener('touchend',   e => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) moverPara(diff > 0 ? atual + 1 : atual - 1);
    });

    // Ajusta ao carregar e ao redimensionar
    ajustarLarguras();
    window.addEventListener('resize', () => ajustarLarguras());
    reiniciarTimer();
})();
    