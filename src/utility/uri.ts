export function join(...paths: Array<string | undefined | null>) {
    return paths.reduce((path: string, value) => {
        if (!value) return path
        if (!path) return value

        return (
            path.replace(/[\\/]+$/gi, '') + //
            '/' +
            value.replace(/^[\\/]+/gi, '')
        )
    }, '')
}

export function normalize(uri: string): string {
    return uri.replaceAll(/[^\w-\\/#?&=':,. ]+/gi, '_')
}

export function hasExt(uri: string): boolean {
    return /\.[^\\/]*$/gi.test(uri)
}

/** Should use `hasExt()` before */
export function getExt(uri: string): string | undefined {
    return /(?<=\.)([^\\/#?]*)([#?].*)?$/gi.exec(uri)?.at(1)
}

export function removeExt(uri: string): string {
    return uri.replace(/(\.[^\\/]*)?([#?].*)?$/gi, '')
}

export function getBasename(uri: string): string | undefined {
    const name = getName(uri)
    return name ? removeExt(name) : undefined
}

export function getName(uri: string): string | undefined {
    return uri.match(/[^\\/]+$/gi)?.at(0)
}

export function getParent(uri: string): string {
    return uri.replace(/[\\/][^\\/]*$/gi, '')
}
