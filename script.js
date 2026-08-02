// ==================== COPY FUNCTION ====================
function copyText(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Copied: ' + text);
        }).catch(err => {
            console.error('Copy failed: ', err);
        });
    } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            console.log('Copied: ' + text);
        } catch (err) {
            console.error('Copy failed: ', err);
        }
        document.body.removeChild(textArea);
    }
}

// ==================== LANGUAGE DROPDOWN ====================
(function() {
    const btn = document.getElementById('langDropdownBtn');
    const menu = document.getElementById('langDropdownMenu');
    const overlay = document.getElementById('langOverlay');
    const arrow = document.getElementById('dropdownArrow');

    const langMap = {
        'vi': { flag: '🇻🇳', label: 'VI' },
        'en': { flag: '🇬🇧', label: 'EN' },
        'zh': { flag: '🇨🇳', label: '中文' }
    };

    let currentLang = document.documentElement.lang || 'vi';
    const path = window.location.pathname;
    if (path.includes('eindex.html') || path.includes('en')) currentLang = 'en';
    else if (path.includes('cindex.html') || path.includes('zh')) currentLang = 'zh';
    else currentLang = 'vi';

    function updateButton(lang) {
        const info = langMap[lang] || langMap['vi'];
        document.getElementById('currentFlag').textContent = info.flag;
        document.getElementById('currentLangLabel').textContent = info.label;
        const links = menu.querySelectorAll('a');
        links.forEach(link => {
            link.classList.remove('active-lang');
            const href = link.getAttribute('href');
            if (href && href.includes(lang)) {
                link.classList.add('active-lang');
            }
            if (link.dataset.lang === lang) {
                link.classList.add('active-lang');
            }
        });
    }

    updateButton(currentLang);

    function toggleDropdown(open) {
        const isOpen = menu.classList.contains('open');
        if (open === undefined) {
            menu.classList.toggle('open');
            overlay.classList.toggle('active');
            arrow.classList.toggle('open');
        } else if (open) {
            menu.classList.add('open');
            overlay.classList.add('active');
            arrow.classList.add('open');
        } else {
            menu.classList.remove('open');
            overlay.classList.remove('active');
            arrow.classList.remove('open');
        }
    }

    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleDropdown();
    });

    overlay.addEventListener('click', function() {
        toggleDropdown(false);
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            toggleDropdown(false);
        }
    });

    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            let lang = 'vi';
            if (href.includes('eindex')) lang = 'en';
            else if (href.includes('cindex')) lang = 'zh';
            else lang = 'vi';
            updateButton(lang);
        });
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            toggleDropdown(false);
        }
    });
})();

// ==================== SCROLL REVEAL (ONCE) ====================
(function() {
    const revealElements = document.querySelectorAll('.reveal');
    const options = { root: null, rootMargin: '0px 0px -40px 0px', threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const el = entry.target;
            if (entry.isIntersecting) {
                el.classList.add('visible');
                observer.unobserve(el); // stop observing after first reveal
            }
        });
    }, options);

    revealElements.forEach(el => observer.observe(el));

    // Also check elements that might already be visible on load
    setTimeout(() => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const winHeight = window.innerHeight || document.documentElement.clientHeight;
            if (rect.top < winHeight - 60 && rect.bottom > 0) {
                el.classList.add('visible');
                observer.unobserve(el);
            }
        });
    }, 100);
})();

// ==================== NAV HIGHLIGHT ====================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function highlightNav() {
    let current = '';
    sections.forEach(section => {
        const top = section.offsetTop - 120;
        if (window.scrollY >= top) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}
window.addEventListener('scroll', highlightNav);
highlightNav();

// ==================== CONTACT FORM ====================
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            if (!name || !email || !message) {
                alert('Vui lòng điền đầy đủ thông tin.');
                return;
            }
            const subject = encodeURIComponent('Liên hệ từ ' + name);
            const body = encodeURIComponent(
                'Họ tên: ' + name + '\nEmail: ' + email + '\n\nNội dung:\n' + message
            );
            window.location.href = 'mailto:contact.phuongthanh@gmail.com?subject=' + subject + '&body=' + body;
        });
    }
});