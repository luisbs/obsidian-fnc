/**
 * Extracted: 2025-04-17
 * from: https://github.com/obsidianmd/obsidian-translations?tab=readme-ov-file#existing-languages
 */
export type ObsidianLanguages =
    | 'en' //    ✅ English                  English (default)
    | 'af' //    🚧 Afrikaans                Afrikaans
    | 'am' //    ✅ Amharic                  አማርኛ
    | 'ar' //    🚧 Arabic                   العربية
    | 'eu' //    🚧 Basque                   Euskara
    | 'be' //    ✅ Belarusian               беларуская мова
    | 'bg' //    🚧 Bulgarian                български език
    | 'bn' //    🚧 Bengali                  বাংলা
    | 'ca' //    🚧 Catalan                  català
    | 'cs' //    🚧 Czech                    čeština
    | 'da' //    ✅ Danish                   Dansk
    | 'de' //    ✅ German                   Deutsch
    | 'dv' //    🚧 Dhivehi                  ދިވެހި
    | 'el' //    🚧 Greek                    Ελληνικά
    | 'en-GB' // ✅ English (GB)             English (GB)
    | 'eo' //    🚧 Esperanto                Esperanto
    | 'es' //    ✅ Spanish                  Español
    | 'fa' //    🚧 Persian                  فارسی
    | 'fi-fi' // 🚧 Finnish                  suomi
    | 'fr' //    ✅ French                   français
    | 'gl' //    🚧 Galician                 Galego
    | 'he' //    🚧 Hebrew                   עברית 🇮🇱
    | 'hi' //    🚧 Hindi                    हिन्दी
    | 'hu' //    🚧 Hungarian                Magyar nyelv
    | 'id' //    ✅ Indonesian               Bahasa Indonesia
    | 'it' //    ✅ Italian                  Italiano
    | 'ja' //    ✅ Japanese                 日本語
    | 'ko' //    ✅ Korean                   한국어
    | 'lv' //    ✅ Latvian                  Latviešu
    | 'ml' //    🚧 Malayalam                മലയാളം
    | 'ms' //    🚧 Malay                    Bahasa Melayu
    | 'ne' //    ✅ Nepali                   नेपाली
    | 'nl' //    ✅ Dutch                    Nederlands
    | 'no' //    ✅ Norwegian                Norsk
    | 'oc' //    🚧 Occitan                  Occitan
    | 'pl' //    ✅ Polish                   język polski
    | 'pt' //    ✅ Portuguese               Português
    | 'pt-BR' // ✅ Brazilian Portuguese     Portugues do Brasil
    | 'ro' //    🚧 Romanian                 Română
    | 'ru' //    ✅ Russian                  Русский
    | 'sa' //    🚧 Sanskrit                 संस्कृतम्
    | 'sr' //    🚧 Serbian                  српски језик
    | 'sv' //    🚧 Swedish                  Svenska
    | 'sk' //    🚧 Slovak                   Slovenčina
    | 'sq' //    ✅ Albanian                 Shqip
    | 'ta' //    🚧 Tamil                    தமிழ்
    | 'te' //    🚧 Telugu                   తెలుగు
    | 'th' //    ✅ Thai                     ไทย
    | 'tl' //    🚧 Filipino (Tagalog)       Tagalog
    | 'tr' //    ✅ Turkish                  Türkçe
    | 'uk' //    ✅ Ukrainian                Українська
    | 'ur' //    🚧 Urdu                     اردو
    | 'vi' //    ✅ Vietnamese               Tiếng Việt
    | 'zh' //    ✅ Chinese (Simplified)     简体中文 (has a note)
    | 'zh-TW' // ✅ Chinese (Traditional)    繁體中文

//
export type HTMLSegment = [keyof HTMLElementTagNameMap, DomElementInfo?]
export type DocumentationSegment = ['docs', string, string?]
export type I18nSegments = Array<string | HTMLSegment | DocumentationSegment>

export type I18nSources<K extends string> = Record<K, string | I18nSegments>
export type I18nResults<K extends string> = Record<K, string | DocumentFragment>
export type I18nPrepared<K extends string, S extends I18nSources<K>> = {
    [A in keyof S]: S[A] extends string ? string : DocumentFragment
}

export interface RetrieveTranslation<
    L extends string,
    K extends string,
    R extends I18nResults<K>,
> {
    <k extends K>(key: k, params?: string[]): R[k]
    <k extends K>(locale: L, key: k, params?: string[]): R[k]
}

export interface AppendTranslation<L extends string, K extends string> {
    (el: Node, key: K, params?: string[]): void
    (el: Node, locale: L, key: K, params?: string[]): void
}

export abstract class I18nTranslator<
    L extends ObsidianLanguages,
    K extends string,
    S extends I18nSources<K> = I18nSources<K>,
    R extends I18nResults<K> = I18nPrepared<K, S>,
> {
    /**
     * Currently active language.
     * @see https://forum.obsidian.md/t/a-way-to-get-obsidian-s-currently-set-language/17829/5
     */
    protected currentLocale(): ObsidianLanguages {
        // prettier-ignore
        return (window.localStorage.getItem('language') ?? 'en') as ObsidianLanguages
    }

    /**
     * A hook to allow checking your supported locales.
     * If `locale` is `undefined` the current locale should be returned.
     */
    protected abstract filterLocale(locale?: string): L

    /**
     * The storage of translations is expected to be handled by you.
     */
    protected abstract getTranslation(locale: L, key: K): string | I18nSegments

    /**
     * Prepare a `DocumentationSegment` into the `DomElementInfo` for a link.
     */
    protected abstract docElementInfo(
        segment: DocumentationSegment,
    ): DomElementInfo

    /**
     * Sorts params recived into a well defined set.
     */
    protected sort(
        localeOrKey: L | K,
        keyOrParamsOrVoid: K | string[] | undefined,
        paramsOrVoid: string[] | undefined,
    ): [string | I18nSegments, string[]] {
        if (keyOrParamsOrVoid == undefined) {
            return [
                this.getTranslation(this.filterLocale(), localeOrKey as K),
                [],
            ]
        }
        if (Array.isArray(keyOrParamsOrVoid)) {
            return [
                this.getTranslation(this.filterLocale(), localeOrKey as K),
                keyOrParamsOrVoid,
            ]
        }

        return [
            this.getTranslation(
                this.filterLocale(localeOrKey as L),
                keyOrParamsOrVoid,
            ),
            paramsOrVoid ?? [],
        ]
    }

    /**
     * Retrieves a translation to be used in a `new Setting().setName(translation)`.
     * Is defined as arrow function to allow easy destructuring.
     */
    translate: RetrieveTranslation<L, K, R> = <k extends K>(
        localeKey: L | k,
        keyParams?: k | string[],
        paramsVoid?: string[],
    ) => {
        const [values, params] = this.sort(localeKey, keyParams, paramsVoid)
        if (typeof values === 'string') return values as R[k]

        const fragment = createFragment()
        this._appendTo(fragment, values, params)
        return fragment as R[k]
    }

    /**
     * Appends a translation into a `HTMLElement` or a `DocumentFragment`.
     * Is defined as arrow function to allow easy destructuring.
     */
    appendTo: AppendTranslation<L, K> = (
        el: Node,
        localeKey: L | K,
        keyParams?: K | string[],
        paramsVoid?: string[],
    ) => {
        const [values, params] = this.sort(localeKey, keyParams, paramsVoid)

        if (typeof values === 'string') el.appendText(values)
        else this._appendTo(el, values, params)
    }

    /**
     * Internal method for appending translations into a `DocumentFragment`
     */
    protected _appendTo(el: Node, values: I18nSegments, params: string[]) {
        for (const item of values) {
            if (typeof item === 'string') {
                el.appendText(item)
                continue
            }

            if (item[0] === 'docs') {
                el.createEl('a', this.docElementInfo(item))
                continue
            }

            // if `props.text` are falsy, replace text with a param value
            if (!item[1]) el.createEl(item[0], { text: params.pop() })
            else if (item[1].text) el.createEl(item[0], item[1])
            else el.createEl(item[0], { ...item[1], text: params.pop() })
        }
    }
}
