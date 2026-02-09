let translations = {};

async function loadLanguage(lang) {
    const res = await fetch(`./resources/i18n/${lang}.json`);
    translations = await res.json();

    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (translations[key]) {
            el.innerHTML = translations[key];
        }
    });

    document.documentElement.lang = lang;
    localStorage.setItem("lang", lang);
}

// detectar idioma guardat o navegador
const savedLang = localStorage.getItem("lang");
const browserLang = navigator.language.toLowerCase();

loadLanguage(savedLang || browserLang || "en");

// selector
document.getElementById("btn-languageSelector")
.addEventListener("click", () => {
    const lang = document.getElementById("languageSelector").value;
    loadLanguage(lang);
});
