import {
    type DocumentationSegment,
    type I18nSegments,
    I18nTranslator,
} from '../I18nTranslator'

/* Fallback */
type DomElementInfo = Record<string, string>

type Locales = 'en'
type Keys = keyof Translations
interface Translations {
    param1: string
    param2: string | I18nSegments
    param3: I18nSegments
}

const TRANSLATIONS: Record<Locales, Translations> = {
    en: {
        param1: 'Param 1',
        param2: 'Param 2',
        param3: ['Param 3'],
    },
}

class Test extends I18nTranslator<Locales, Keys, Translations> {
    filterLocale(locale?: string): 'en' {
        return (locale as 'en') ?? 'en'
    }

    getTranslation(
        locale: Locales,
        key: keyof Translations,
    ): string | I18nSegments {
        return TRANSLATIONS[locale][key]
    }

    docElementInfo([, id, text]: DocumentationSegment): DomElementInfo {
        return {
            text: text ?? 'docs',
            href: `https://github.com/luisbs/obsidian-attachments-cache/blob/main/docs/settings.md#${id}`,
        }
    }
}

// check that string is keeped as an string
const a = new Test()
a.translate('param1')
a.translate('param2')
a.translate('param3')
