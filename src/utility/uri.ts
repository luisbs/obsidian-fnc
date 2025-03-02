// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class URI {
    static join(...paths: Array<string | undefined | null>) {
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

    static normalize(uri: string): string {
        return uri.replaceAll(/[^\w-\\/#?&=':,. ]+/gi, '_')
    }

    static getName(uri: string): string | undefined {
        return uri.match(/[^\\/]+$/gi)?.at(0)
    }

    static getBasename(uri: string): string | undefined {
        const name = this.getName(uri)
        return name ? this.removeExt(name) : undefined
    }

    /** If no slashes are found `undefined` is returned. */
    static getParent(uri: string): string | undefined {
        if (!/[\\/]/gi.test(uri)) return undefined
        return uri.replace(/[\\/][^\\/]*$/gi, '')
    }

    static hasExt(uri: string): boolean {
        return /\.[^\\/]*$/gi.test(uri)
    }

    /** Should use `hasExt()` before */
    static getExt(uri: string): string | undefined {
        return /(?<=\.)([^\\/#?]*)([#?].*)?$/gi.exec(uri)?.at(1)
    }

    static removeExt(uri: string): string {
        return uri.replace(/(\.[^\\/]*)?([#?].*)?$/gi, '')
    }
}
