import { normalizePath } from 'obsidian'

export class URI {
  static join(...paths: Array<string | undefined | null>) {
    const joined = paths.reduce((path: string, value) => {
      if (!value) return path
      return path.replace(/[\\/]+$/gi, '') + '/' + value.replace(/^[\\/]+/gi, '')
    }, '')
    return normalizePath(joined)
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

  static getName(uri: string): string | undefined {
    return URI.removeExt(uri)
      .match(/[^\\/]+$/gi)
      ?.at(0)
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
  static getReferer(url: string): string | undefined {
    return /^https?:\/\/([\w-]+\.)+[\w-]+\//gi.exec(url)?.at(0)
  }

  static removeParams(url: string): string {
    return url.replace(/\?.*$/gi, '')
  }
}
