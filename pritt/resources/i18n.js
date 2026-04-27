let translations = {};

async function loadLanguage(lang) {
    const res = await fetch(`./resources/i18n/${lang}.json`);

    $('#ForestKeeper-pdf').attr('href', 'resources/pdf/'+lang+'/Templates-ForestKeeper.pdf');
    $('#Unicorn-pdf').attr('href', 'resources/pdf/'+lang+'/Templates-Unicorn.pdf');
    $('#Ogre-pdf').attr('href', 'resources/pdf/'+lang+'/Templates-Ogre.pdf');
    $('#Dragon-pdf').attr('href', 'resources/pdf/'+lang+'/Templates-Dragon.pdf');
    $('#Fairy-pdf').attr('href', 'resources/pdf/'+lang+'/Templates-Fairy.pdf');
    $('#House-pdf').attr('href', 'resources/pdf/'+lang+'/Templates-House.pdf');
    $('#Rainbow-pdf').attr('href', 'resources/pdf/'+lang+'/Templates-Rainbow.pdf');
    $('#River-pdf').attr('href', 'resources/pdf/'+lang+'/Templates-River.pdf');

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

function t(key, vars = {}) {
    let text = translations[key] || key;

    Object.keys(vars).forEach(k => {
        text = text.replace(`{{${k}}}`, vars[k]);
    });

    return text;
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
