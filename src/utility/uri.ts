export class URI {
  static join(...paths: Array<string | undefined | null>) {
    return paths.reduce((path: string, value) => {
      if (!value) return path
      if (!path) return value
      return path.replace(/[\\/]+$/gi, '') + '/' + value.replace(/^[\\/]+/gi, '')
    }, '')
  }

  static normalize(uri: string): string {
    return uri.replaceAll(/[^\\\w-/?&=':,. ]+/gi, '_')
  }

  static hasExt(uri: string): boolean {
    return /\.[^\\/]*$/gi.test(uri)
  }

  /** Should use `hasExt()` before */
  static getExt(uri: string): string | undefined {
    return /(?<=\.)([^\\/?]*)(\?.*)?$/gi.exec(uri)?.at(1)
  }

  static removeExt(uri: string): string {
    return uri.replace(/(\.[^\\/]*)?(\?.*)?$/gi, '')
  }

  static getBasename(uri: string): string | undefined {
    const name = URI.getName(uri)
    return name ? URI.removeExt(name) : undefined
  }

  static getName(uri: string): string | undefined {
    return uri.match(/[^\\/]+$/gi)?.at(0)
  }

  static getParent(uri: string): string {
    return uri.replace(/[\\/][^\\/]*$/gi, '')
  }
}

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

  static getHash(url: string): string | undefined {
    return /(?<=#)[^?]*/gi.exec(url)?.at(0)
  }

  static getparams(url: string): string | undefined {
    return /(?<=\?).*/gi.exec(url)?.at(0)
  }
}
