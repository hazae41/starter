export type Localized = Record<Locale, string>

export type Locale =
  | "en"
  | "zh"
  | "hi"
  | "es"
  | "ar"
  | "fr"
  | "de"
  | "ru"
  | "pt"
  | "ja"
  | "pa"
  | "bn"
  | "id"
  | "ur"
  | "ms"
  | "it"
  | "tr"
  | "ta"
  | "te"
  | "ko"
  | "vi"
  | "pl"
  | "ro"
  | "nl"
  | "el"
  | "th"
  | "cs"
  | "hu"
  | "sv"
  | "da"

export const locales: Record<Locale, Locale> = {
  en: "en",
  zh: "zh",
  hi: "hi",
  es: "es",
  ar: "ar",
  fr: "fr",
  de: "de",
  ru: "ru",
  pt: "pt",
  ja: "ja",
  pa: "pa",
  bn: "bn",
  id: "id",
  ur: "ur",
  ms: "ms",
  it: "it",
  tr: "tr",
  ta: "ta",
  te: "te",
  ko: "ko",
  vi: "vi",
  pl: "pl",
  ro: "ro",
  nl: "nl",
  el: "el",
  th: "th",
  cs: "cs",
  hu: "hu",
  sv: "sv",
  da: "da",
} as const

export class locale {

  static get current(): string {
    return locales[document.documentElement.lang] || locales[navigator.language.split("-")[0]] || "en"
  }

}