// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class URL {
    static isUrl(uri: string): boolean {
        return /^https?:\/\//gi.test(uri)
    }

    /** Should use `isUrl()` before */
    static getOrigin(url: string): string | undefined {
        return /^https?:\/\/[^\\/]+/gi.exec(url)?.at(0)
    }

    /** Should use `isUrl()` before */
    static getBaseurl(url: string): string | undefined {
        return /^https?:\/\/[^#?]*/gi.exec(url)?.at(0)
    }

    static getHash(uri: string): string | undefined {
        return /(?<=#)[^?]*/gi.exec(uri)?.at(0)
    }

    static getparams(uri: string): string | undefined {
        return /(?<=\?).*/gi.exec(uri)?.at(0)
    }
}
