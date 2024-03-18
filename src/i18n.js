import { createI18n } from "vue-i18n";
import { languages } from "./i18n/index.js";
import { defaultLocale } from "./i18n/index.js";

const messages = Object.assign(languages);
const localStorageLang = localStorage.getItem("lang");

const i18n = createI18n({
    locale: localStorageLang || defaultLocale,
    fallbacklocale: "ru",
    messages,
});

export default i18n;