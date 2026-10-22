document.addEventListener('DOMContentLoaded', () => {
    // =======================================================================
    // 0. UTILITÁRIO SEGURO PARA LOCALSTORAGE (Evita erros em modo anônimo)
    // =======================================================================
    const storage = {
        get: (key) => {
            try { return localStorage.getItem(key); } catch (e) { return null; }
        },
        set: (key, value) => {
            try { localStorage.setItem(key, value); } catch (e) { console.warn('LocalStorage indisponível'); }
        },
        remove: (key) => {
            try { localStorage.removeItem(key); } catch (e) {}
        }
    };

    // =======================================================================
    // 1. DARK MODE & PREFERÊNCIA SALVA
    // =======================================================================
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = storage.get('vk_theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

    themeToggle.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        storage.set('vk_theme', newTheme);
        themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    });

    // =======================================================================
    // 2. HEADER GLASSMORPHISM ON SCROLL
    // =======================================================================
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });

    // =======================================================================
    // 3. MOBILE MENU ACESSÍVEL
    // =======================================================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-nav');
    
    mobileMenuBtn.addEventListener('click', () => {
        const isExpanded = mainNav.classList.toggle('active');
        mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
        mobileMenuBtn.textContent = isExpanded ? '✕' : '☰';
    });

    document.querySelectorAll('#main-nav a').forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            mobileMenuBtn.textContent = '☰';
        });
    });

    // =======================================================================
    // 4. FAQ ACCORDION ACESSÍVEL
    // =======================================================================
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const faqItem = button.parentElement;
            const isActive = faqItem.classList.contains('active');
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });
            
            if (!isActive) {
                faqItem.classList.add('active');
                button.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // =======================================================================
    // 5. RASTREAMENTO DE UTMs E INJEÇÃO DINÂMICA NO WHATSAPP
    // =======================================================================
    const urlParams = new URLSearchParams(window.location.search);
    let utmData = {};
    
    ['utm_source', 'utm_medium', 'utm_campaign'].forEach(param => {
        if (urlParams.has(param)) {
            utmData[param] = urlParams.get(param);
        }
    });

    if (Object.keys(utmData).length > 0) {
        storage.set('vk_utm_data', JSON.stringify(utmData));
    }

    function getUTMMessage(baseMessage) {
        const savedUtm = storage.get('vk_utm_data');
        if (savedUtm) {
            const data = JSON.parse(savedUtm);
            const source = data.utm_source || 'site';
            return `${baseMessage} (Vim pelo: ${source})`;
        }
        return baseMessage;
    }

    // Atualiza todos os links do WhatsApp na página
    document.querySelectorAll('a.floating-wa-link').forEach(link => {
        try {
            const url = new URL(link.href);
            const currentText = url.searchParams.get('text') || 'Olá, gostaria de agendar um horário!';
            url.searchParams.set('text', getUTMMessage(currentText));
            link.href = url.toString();
        } catch (e) {
            console.warn('Erro ao processar link do WhatsApp', e);
        }
        
        link.addEventListener('click', () => {
            trackEvent('whatsapp_click', { location: link.classList.contains('sticky-btn') ? 'mobile_sticky' : 'floating_button' });
        });
    });

    // =======================================================================
    // 6. FORMULÁRIO INTELIGENTE COM FALLBACK E RASCUNHO
    // =======================================================================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const formInputs = contactForm.querySelectorAll('input, textarea');
        
        // Carregar rascunho
        formInputs.forEach(input => {
            const savedValue = storage.get(`vk_form_${input.name}`);
            if (savedValue) input.value = savedValue;
            
            input.addEventListener('input', (e) => {
                storage.set(`vk_form_${e.target.name}`, e.target.value);
            });
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();
            
            if (!name || !phone || !message) return; // Validação básica

            const fullMessage = `Olá, meu nome é *${name}*.\n📱 Telefone: ${phone}\n💬 Mensagem: ${message}`;
            const encodedMessage = encodeURIComponent(getUTMMessage(fullMessage));
            
            document.getElementById('modal-wa-link').href = `https://wa.me/551192049045?text=${encodedMessage}`;
            document.getElementById('modal-mail-link').href = `mailto:sfjacksonsoares@gmail.com?subject=Contato pelo Site - ${name}&body=${encodedMessage}`;
            
            document.getElementById('form-modal').style.display = 'flex';
            trackEvent('form_submit', { method: 'modal_generation' });
            
            // Limpa rascunho após envio
            formInputs.forEach(input => {
                storage.remove(`vk_form_${input.name}`);
            });
            contactForm.reset();
        });
    }

    // Fechar Modais
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').style.display = 'none';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // =======================================================================
    // 7. BANNER DE COOKIES LGPD & CONSENT MODE V2
    // =======================================================================
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieModal = document.getElementById('cookie-modal');
    const cookieConsent = storage.get('vk_cookie_consent');
    
    if (!cookieConsent) {
        cookieBanner.style.display = 'block';
    } else {
        applyCookieConsent(JSON.parse(cookieConsent));
    }

    document.getElementById('cookie-accept').addEventListener('click', () => {
        const consent = { essential: true, analytics: true, marketing: true };
        storage.set('vk_cookie_consent', JSON.stringify(consent));
        cookieBanner.style.display = 'none';
        applyCookieConsent(consent);
        trackEvent('cookie_consent', { status: 'accepted_all' });
    });

    document.getElementById('cookie-reject').addEventListener('click', () => {
        const consent = { essential: true, analytics: false, marketing: false };
        storage.set('vk_cookie_consent', JSON.stringify(consent));
        cookieBanner.style.display = 'none';
        applyCookieConsent(consent);
        trackEvent('cookie_consent', { status: 'rejected_all' });
    });

    document.getElementById('cookie-customize').addEventListener('click', () => {
        cookieModal.style.display = 'flex';
    });

    document.getElementById('cookie-save-preferences').addEventListener('click', () => {
        const consent = {
            essential: true,
            analytics: document.getElementById('cookie-analytics').checked,
            marketing: document.getElementById('cookie-marketing').checked
        };
        storage.set('vk_cookie_consent', JSON.stringify(consent));
        cookieModal.style.display = 'none';
        cookieBanner.style.display = 'none';
        applyCookieConsent(consent);
        trackEvent('cookie_consent', { status: 'customized', ...consent });
    });

    function applyCookieConsent(consent) {
        // Atualiza o Google Consent Mode V2
        if (typeof gtag === 'function') {
            gtag('consent', 'update', {
                'analytics_storage': consent.analytics ? 'granted' : 'denied',
                'ad_storage': consent.marketing ? 'granted' : 'denied',
                'ad_user_data': consent.marketing ? 'granted' : 'denied',
                'ad_personalization': consent.marketing ? 'granted' : 'denied'
            });
        }

        // Ativa Meta Pixel apenas se marketing for aceito
        if (consent.marketing && typeof fbq === 'function') {
            fbq('init', '[SUBSTITUIR_PELO_PIXEL_ID]');
            fbq('track', 'PageView');
        }
    }

    // =======================================================================
    // 8. FUNÇÃO DE RASTREAMENTO (TRACK EVENT) SEGURA
    // =======================================================================
    window.trackEvent = function(eventName, parameters = {}) {
        const consentRaw = storage.get('vk_cookie_consent');
        if (!consentRaw) return; // Não rastreia se não houver consentimento
        
        const consent = JSON.parse(consentRaw);
        if (!consent.analytics && !consent.marketing) return;

        if (typeof gtag === 'function') {
            gtag('event', eventName, parameters);
        }
        if (consent.marketing && typeof fbq === 'function') {
            fbq('trackCustom', eventName, parameters);
        }
    };

    // =======================================================================
    // 9. INTERSECTION OBSERVER PARA ANIMAÇÕES DE SCROLL
    // =======================================================================
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target); // Otimização: para de observar após animar
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card, .testimonial-card, .about-image, .gallery-grid img').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // =======================================================================
    // 10. UTILITÁRIO: COPIAR ENDEREÇO
    // =======================================================================
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-copy');
            const text = document.getElementById(targetId).innerText;
            navigator.clipboard.writeText(text).then(() => {
                const originalIcon = btn.textContent;
                btn.textContent = '✅';
                setTimeout(() => { btn.textContent = originalIcon; }, 2000);
            });
        });
    });
});