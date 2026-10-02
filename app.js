document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    const langToggleBtn = document.getElementById('langToggle');
    
    // Determine default language
    // navigator.language is usually 'en-US', 'es-ES', 'es', etc.
    const userLang = navigator.language || navigator.userLanguage;
    let currentLang = userLang.toLowerCase().startsWith('es') ? 'es' : 'en';
    
    let translations = {};

    // Load translations
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
                el.textContent = translations[key];
            }
        });
    };

    // Update toggle button text
    const updateToggleButton = (lang) => {
        // If current is 'en', button should say 'ES' to switch to Spanish
        langToggleBtn.textContent = lang === 'en' ? 'ES' : 'EN';
    };

    // Toggle event listener
    langToggleBtn.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'es' : 'en';
        loadTranslations(currentLang);
    });

    // Initial load
    loadTranslations(currentLang);
});
