// ===== CAROUSEL DATA (Single source of truth) =====
const SLIDES_DATA = [
    {
        num: 10,
        icon: '🔟',
        label: '1 thập kỷ — hay cả đời, anh đều chọn em',
        detail: '10 năm, 20 năm, hay mãi mãi — mỗi sáng thức dậy, anh vẫn chọn em như ngày đầu.',
        gradient: 'linear-gradient(145deg, #ffd700, #ffb300)'
    },
    {
        num: 9,
        icon: '☁️',
        label: '9 tầng trời — cũng không ngăn anh tìm về em',
        detail: 'Khoảng cách chỉ là con số. Chỉ cần nghĩ đến em, anh đã thấy mình gần hơn.',
        gradient: 'linear-gradient(145deg, #64b5f6, #42a5f5)'
    },
    {
        num: 8,
        icon: '🧭',
        label: '8 hướng — hướng nào cũng dẫn anh về phía em',
        detail: 'Đông tây nam bắc, đi đâu rồi cũng quay về. Vì em là nơi anh thuộc về.',
        gradient: 'linear-gradient(145deg, #b388ff, #9575cd)'
    },
    {
        num: 7,
        icon: '🌅',
        label: '7 ngày — ngày nào cũng bắt đầu bằng nghĩ về em',
        detail: 'Không phải thói quen, mà vì em là điều đầu tiên anh muốn nhớ khi mở mắt.',
        gradient: 'linear-gradient(145deg, #4dd0af, #26c6a0)'
    },
    {
        num: 6,
        icon: '🤲',
        label: '6 giác quan — và tất cả đều hướng về em',
        detail: 'Mắt tìm em giữa đám đông, tai nhớ giọng em cười, tay nhớ hơi ấm của em...',
        gradient: 'linear-gradient(145deg, #ff8a65, #ff7043)'
    },
    {
        num: 5,
        icon: '🏠',
        label: '5 châu lục — nhưng nhà là nơi có em',
        detail: 'Đi bao xa cũng chỉ muốn quay về nơi có em đang đợi.',
        gradient: 'linear-gradient(145deg, #ffca28, #ffa726)'
    },
    {
        num: 4,
        icon: '🍂',
        label: '4 mùa thay lá — tình anh dành cho em vẫn vậy',
        detail: 'Xuân qua, hạ tới, thu sang, đông lạnh — anh vẫn yêu em như ngày đầu tiên.',
        gradient: 'linear-gradient(145deg, #f48fb1, #f06292)'
    },
    {
        num: 3,
        icon: '⏳',
        label: '3 thì — và em có mặt trong cả ba',
        detail: 'Quá khứ là khi anh tìm thấy em. Hiện tại là yêu em. Tương lai là của chúng mình.',
        gradient: 'linear-gradient(145deg, #81d4fa, #4fc3f7)'
    },
    {
        num: 2,
        icon: '🤝',
        label: '2 người — là đủ cho một đời',
        detail: 'Không cần thêm gì. Anh và em, bên nhau — thế là trọn vẹn rồi.',
        gradient: 'linear-gradient(145deg, #ce93d8, #ab47bc)'
    },
    {
        num: 1,
        icon: '❤️',
        label: '1 trái tim — chỉ đập vì em',
        detail: 'Cả đời anh từ nay chỉ yêu một người. Và người đó, mãi mãi là em.',
        gradient: 'linear-gradient(145deg, #ff5252, #f44336)'
    }
];

// ===== PAGE LOADER =====
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('hidden');
        document.getElementById('side-nav').classList.add('visible');
    }, 800);
});

// ===== SPARKLE PARTICLES =====
(function initSparkles() {
    const canvas = document.getElementById('sparkle-canvas');
    const ctx = canvas.getContext('2d');
    const particles = [];
    const MAX = 50;
    const colors = ['#ff6b9d', '#ffd700', '#c084fc', '#ff8fbf', '#ffe066'];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.2 + 0.5;
            this.vx = (Math.random() - 0.5) * 0.25;
            this.vy = (Math.random() - 0.5) * 0.25;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.fadeSpeed = Math.random() * 0.006 + 0.002;
            this.growing = Math.random() > 0.5;
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.opacity += this.growing ? this.fadeSpeed : -this.fadeSpeed;
            if (this.opacity >= 0.7) this.growing = false;
            if (this.opacity <= 0.1) this.growing = true;
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 6;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    for (let i = 0; i < MAX; i++) particles.push(new Particle());

    (function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(loop);
    })();
})();

// ===== FLOATING HEARTS =====
(function initFloatingHearts() {
    const container = document.getElementById('hearts-container');
    const emojis = ['💕', '💗', '💖', '💓', '❤️', '🩷', '🤍', '✨'];

    function create() {
        const el = document.createElement('span');
        el.classList.add('floating-heart');
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        el.style.left = Math.random() * 100 + '%';
        el.style.fontSize = (Math.random() * 16 + 12) + 'px';
        el.style.animationDuration = (Math.random() * 10 + 10) + 's';
        el.style.animationDelay = (Math.random() * 2) + 's';
        container.appendChild(el);
        setTimeout(() => el.remove(), 22000);
    }

    for (let i = 0; i < 6; i++) setTimeout(create, i * 800);
    setInterval(create, 2500);
})();

// ===== SCROLL REVEAL ANIMATION =====
(function initReveal() {
    const els = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => observer.observe(el));
})();

// ===== SIDE NAVIGATION - ACTIVE SECTION TRACKING =====
(function initSideNav() {
    const dots = document.querySelectorAll('.side-nav-dot');
    const sections = ['hero', 'letter', 'reasons', 'memories', 'wish'];

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                dots.forEach(d => d.classList.toggle('active', d.dataset.section === entry.target.id));
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
    });
})();

// ===== LOVE LETTER INTERACTION =====
(function initLoveLetter() {
    const card = document.getElementById('letter-card');
    const seal = document.getElementById('wax-seal');
    const sealed = document.getElementById('letter-sealed');

    seal.addEventListener('click', (e) => {
        e.stopPropagation();
        card.classList.add('opened');
    });

    // Click the sealed area (outside seal) also opens
    sealed.addEventListener('click', () => {
        card.classList.add('opened');
    });
})();

// ===== REASONS CAROUSEL (Data-driven, single-card slides) =====
(function initCarousel() {
    const track = document.getElementById('carousel-track');
    const dotsContainer = document.getElementById('carousel-dots');
    const progressBar = document.getElementById('carousel-progress-bar');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    let current = 0;
    const total = SLIDES_DATA.length;

    // Generate slides
    SLIDES_DATA.forEach(slide => {
        const el = document.createElement('div');
        el.className = 'carousel-slide';
        el.style.setProperty('--slide-gradient', slide.gradient);
        el.innerHTML = `
            <span class="slide-icon">${slide.icon}</span>
            <span class="slide-num">${slide.num}</span>
            <p class="slide-label">${slide.label}</p>
            <hr class="slide-divider">
            <p class="slide-detail">${slide.detail}</p>
        `;
        track.appendChild(el);
    });

    // Generate dots
    SLIDES_DATA.forEach((slide, i) => {
        const btn = document.createElement('button');
        btn.className = 'dot' + (i === 0 ? ' active' : '');
        btn.dataset.slide = i;
        btn.textContent = slide.num;
        dotsContainer.appendChild(btn);
    });

    const dots = dotsContainer.querySelectorAll('.dot');

    function goTo(index) {
        if (index < 0) index = total - 1;
        if (index >= total) index = 0;
        current = index;
        track.style.transform = `translateX(-${current * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
        progressBar.style.width = `${((current + 1) / total) * 100}%`;
    }

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));
    dotsContainer.addEventListener('click', e => {
        const dot = e.target.closest('.dot');
        if (dot) goTo(+dot.dataset.slide);
    });

    // Keyboard
    document.addEventListener('keydown', e => {
        const section = document.getElementById('reasons');
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            if (e.key === 'ArrowRight') goTo(current + 1);
            if (e.key === 'ArrowLeft') goTo(current - 1);
        }
    });

    // Touch swipe
    let startX = 0;
    let dragging = false;
    const viewport = document.querySelector('.carousel-viewport');
    viewport.addEventListener('touchstart', e => { startX = e.touches[0].clientX; dragging = true; }, { passive: true });
    viewport.addEventListener('touchend', e => {
        if (!dragging) return;
        dragging = false;
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) goTo(current + (diff > 0 ? 1 : -1));
    });

    // Init
    goTo(0);
})();

// ===== COUNTDOWN TIMER (Hero) =====
(function initCountdown() {
    const target = new Date('2026-02-14T00:00:00+07:00').getTime();
    const countdownEl = document.getElementById('hero-countdown');
    const message = document.getElementById('valentine-message');
    const els = {
        days: document.getElementById('days'),
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds')
    };

    function update() {
        const diff = target - Date.now();
        if (diff <= 0) {
            if (countdownEl) countdownEl.style.display = 'none';
            if (message) message.style.display = 'block';
            return;
        }

        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);

        els.days.textContent = String(d).padStart(2, '0');
        els.hours.textContent = String(h).padStart(2, '0');
        els.minutes.textContent = String(m).padStart(2, '0');
        els.seconds.textContent = String(s).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
})();

// ===== SMOOTH SCROLL =====
document.querySelector('.scroll-indicator')?.addEventListener('click', () => {
    document.getElementById('letter').scrollIntoView({ behavior: 'smooth' });
});

// ===== MUSIC TOGGLE =====
(function initMusic() {
    const btn = document.getElementById('music-toggle');
    const audio = document.getElementById('bg-music');
    if (!btn || !audio) return;
    let playing = false;

    btn.addEventListener('click', () => {
        if (playing) {
            audio.pause();
            btn.classList.remove('playing');
            playing = false;
        } else {
            audio.play().then(() => {
                btn.classList.add('playing');
                playing = true;
            }).catch(() => {
                btn.classList.remove('playing');
                playing = false;
            });
        }
    });
})();

// ===== PARALLAX ON HERO =====
(function initParallax() {
    const heroContent = document.querySelector('.hero-content');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            if (scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.25}px)`;
                heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.8;
            }
            ticking = false;
        });
    });
})();

// ===== PREMIUM CURSOR EFFECT (Desktop only) =====
(function initCursorEffect() {
    if ('ontouchstart' in window) return;

    const glow = document.getElementById('cursor-glow');
    if (!glow) return;

    let mx = 0, my = 0, gx = 0, gy = 0;

    document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
        glow.classList.add('active');
    });

    document.addEventListener('mouseleave', () => {
        glow.classList.remove('active');
    });

    // Smooth glow follow with lerp
    (function followGlow() {
        gx += (mx - gx) * 0.1;
        gy += (my - gy) * 0.1;
        glow.style.left = gx + 'px';
        glow.style.top = gy + 'px';
        requestAnimationFrame(followGlow);
    })();

    // Enhanced sparkle trail
    const style = document.createElement('style');
    style.textContent = `
        @keyframes sparkleTrail {
            0% { transform: scale(1) rotate(0deg); opacity: 1; }
            100% { transform: scale(0) rotate(180deg) translateY(-20px); opacity: 0; }
        }
        @keyframes sparkleRise {
            0% { transform: scale(1); opacity: 0.9; }
            50% { transform: scale(1.3) translateY(-16px); opacity: 0.5; }
            100% { transform: scale(0) translateY(-32px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    const sparkleChars = ['\u2726', '\u2727', '\u22C6', '\u00B7', '\u02DA'];
    const colors = ['#ff6b9d', '#ffd700', '#c084fc', '#ff8fbf', '#ffe066'];

    document.addEventListener('mousemove', e => {
        if (Math.random() > 0.8) {
            const s = document.createElement('div');
            const color = colors[Math.floor(Math.random() * colors.length)];
            const useChar = Math.random() > 0.45;
            const ox = (Math.random() - 0.5) * 24;
            const oy = (Math.random() - 0.5) * 24;

            if (useChar) {
                s.textContent = sparkleChars[Math.floor(Math.random() * sparkleChars.length)];
                s.style.cssText = `
                    position:fixed;
                    left:${e.clientX + ox}px;
                    top:${e.clientY + oy}px;
                    color:${color};
                    font-size:${Math.random() * 10 + 8}px;
                    pointer-events:none;
                    z-index:9999;
                    text-shadow:0 0 8px ${color};
                    animation:sparkleRise ${Math.random() * 0.5 + 0.5}s ease forwards;
                `;
            } else {
                const size = Math.random() * 4 + 2;
                s.style.cssText = `
                    position:fixed;
                    left:${e.clientX + ox}px;
                    top:${e.clientY + oy}px;
                    width:${size}px;height:${size}px;
                    background:${color};
                    border-radius:50%;
                    pointer-events:none;
                    z-index:9999;
                    box-shadow:0 0 10px ${color}, 0 0 20px ${color}40;
                    animation:sparkleTrail ${Math.random() * 0.4 + 0.4}s ease forwards;
                `;
            }
            document.body.appendChild(s);
            setTimeout(() => s.remove(), 1000);
        }
    });
})();
