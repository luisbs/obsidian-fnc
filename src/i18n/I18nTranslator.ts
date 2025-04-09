export type HTMLSegment = [keyof HTMLElementTagNameMap, DomElementInfo?]
export type DocumentationSegment = ['docs', string, string?]
export type Translation = Array<string | HTMLSegment | DocumentationSegment>

export interface RetrieveTranslation<
    K extends string = string,
    L extends string = string,
> {
    (key: K, params?: string[]): string | DocumentFragment
    (locale: L, key: K, params?: string[]): string | DocumentFragment
}

export interface AppendTranslation<
    K extends string = string,
    L extends string = string,
> {
    (el: Node, key: K, params?: string[]): void
    (el: Node, locale: L, key: K, params?: string[]): void
}

export abstract class I18nTranslator<
    K extends string = string,
    L extends string = string,
> {
    /**
     * A hook to allow checking your supported locales.
     * If `locale` is `undefined` the current locale should be returned.
     */
    abstract filterLocale(locale?: string): L

    /**
     * The storage of translations is expected to be handled by you.
     */
    abstract getTranslation(locale: string, key: K): string | Translation

    /**
     * Prepare a `DocumentationSegment` into the `DomElementInfo` for a link.
     */
    abstract docElementInfo(segment: DocumentationSegment): DomElementInfo

    /**
     * Sorts params recived into a well defined set.
     */
    protected sort(
        localeOrKey: L | K,
        keyOrParamsOrVoid: K | string[] | undefined,
        paramsOrVoid: string[] | undefined,
    ): [string | Translation, string[]] {
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
    translate: RetrieveTranslation<K, L> = (
        localeKey: L | K,
        keyParams?: K | string[],
        paramsVoid?: string[],
    ) => {
        const [values, params] = this.sort(localeKey, keyParams, paramsVoid)
        if (typeof values === 'string') return values

        const fragment = createFragment()
        this._appendTo(fragment, values, params)
        return fragment
    }

    /**
     * Appends a translation into a `HTMLElement` or a `DocumentFragment`.
     * Is defined as arrow function to allow easy destructuring.
     */
    appendTo: AppendTranslation<K, L> = (
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
    protected _appendTo(el: Node, values: Translation, params: string[]) {
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
