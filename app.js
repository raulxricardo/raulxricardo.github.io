document.addEventListener('DOMContentLoaded', () => {
    const EMAIL = 'raulxricardo@gmail.com';
    const langToggleBtn = document.getElementById('langToggle');
    const copyBtn = document.getElementById('copyBtn');
    const copyLabel = document.getElementById('copy-label');
    
    // Determine language: stored preference -> browser language -> default 'en'
    const storedLang = localStorage.getItem('lang');
    const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    let currentLang = storedLang || (browserLang.startsWith('es') ? 'es' : 'en');
    
    let translations = {};
    let isCopied = false;

    // Load translations from JSON
    const loadTranslations = async (lang) => {
        try {
            const response = await fetch(`./locales/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Could not fetch ${lang}.json`);
            }
            translations = await response.json();
            applyTranslations();
            updateToggleButton(lang);
            document.documentElement.lang = lang;
            localStorage.setItem('lang', lang);
        } catch (error) {
            console.error('Error loading translations:', error);
        }
    };

    // Apply translations to DOM
    const applyTranslations = () => {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[key]) {
                if (key === 'buttons.copyEmail' && isCopied) {
                    return; // preserve copied state until timeout finishes
                }
                el.textContent = translations[key];
            }
        });
    };

    // Update toggle button text
    const updateToggleButton = (lang) => {
        if (langToggleBtn) {
            langToggleBtn.textContent = lang === 'en' ? 'ES' : 'EN';
            langToggleBtn.setAttribute('aria-label', lang === 'en' ? 'Cambiar a Español' : 'Switch to English');
        }
    };

    // Language switch click handler
    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            currentLang = currentLang === 'en' ? 'es' : 'en';
            loadTranslations(currentLang);
        });
    }

    // Copy Email functionality with fallback
    const copyEmailAddress = async () => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(EMAIL);
            } else {
                // Fallback for non-HTTPS or unsupported contexts
                const textArea = document.createElement('textarea');
                textArea.value = EMAIL;
                textArea.style.position = 'fixed';
                textArea.style.left = '-9999px';
                textArea.style.top = '-9999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }

            // Visual feedback
            isCopied = true;
            const copiedText = translations['buttons.copied'] || 'Copied! ✓';
            copyLabel.textContent = copiedText;
            copyLabel.classList.add('copied');

            setTimeout(() => {
                isCopied = false;
                copyLabel.textContent = translations['buttons.copyEmail'] || 'Copy Email';
                copyLabel.classList.remove('copied');
            }, 2000);

        } catch (err) {
            console.error('Failed to copy email:', err);
        }
    };

    if (copyBtn) {
        copyBtn.addEventListener('click', copyEmailAddress);
    }

    // Initial load
    loadTranslations(currentLang);
});
