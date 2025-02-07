export function isUrl(uri: string): boolean {
    return /^https?:\/\//gi.test(uri)
}

/** Should use `isUrl()` before */
export function getOrigin(url: string): string | undefined {
    return /^https?:\/\/[^\\/]+/gi.exec(url)?.at(0)
}

/** Should use `isUrl()` before */
export function getBaseurl(url: string): string | undefined {
    return /^https?:\/\/[^#?]*/gi.exec(url)?.at(0)
}

export function getHash(url: string): string | undefined {
    return /(?<=#)[^?]*/gi.exec(url)?.at(0)
}

export function getparams(url: string): string | undefined {
    return /(?<=\?).*/gi.exec(url)?.at(0)
}
