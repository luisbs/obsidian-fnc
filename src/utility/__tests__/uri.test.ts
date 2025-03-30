import { describe, expect, test } from 'vitest'
import { URI } from '../uri'

// prettier-ignore
describe('Testing URI methods', () => {
    test('join', () => {
        expect(URI.join('a', 'b/c', 'd\\e', 'file.jpg')).toBe('a/b/c/d\\e/file.jpg')
        expect(URI.join('a/', '/b/', '\\c\\', 'file.jpg')).toBe('a/b/c/file.jpg')
        expect(URI.join('~/a', 'file.jpg')).toBe('~/a/file.jpg')
        expect(URI.join('./a', 'file.jpg')).toBe('./a/file.jpg')
        expect(URI.join('/a', 'file.jpg')).toBe('/a/file.jpg')
    })

    test('normalize', () => {
        expect(URI.normalize('path/a.b/file😀-¨*.jpg?a=b&c=d')).toBe('path/a.b/file_-_.jpg?a=b&c=d')
        expect(URI.normalize('https://example.net/file😀-¨*.jpg#section1?a=b&c=d')) //
            .toBe('https://example.net/file_-_.jpg#section1?a=b&c=d')
    })

    test('getBasename', () => {
        expect(URI.getBasename('https://example.net/file.jpg#section1?a=b&c=d')).toBe('file')
        expect(URI.getBasename('https://example.net/file?a=b&c=d')).toBe('file')
        expect(URI.getBasename('http://example.net/file.tar.gz')).toBe('file')
        expect(URI.getBasename('http://example.net/file.jpg')).toBe('file')
        expect(URI.getBasename('http://example.net/file')).toBe('file')
        expect(URI.getBasename('path/file.jpg')).toBe('file')
        expect(URI.getBasename('path/file')).toBe('file')
        expect(URI.getBasename('/file')).toBe('file')
        expect(URI.getBasename('path/?a=b&c=d')).toBe('')
        expect(URI.getBasename('path/.log')).toBe('')

        // exceptions
        expect(URI.getBasename('/')).toBeUndefined()
        expect(URI.getBasename('')).toBeUndefined()
    })

    test('getName', () => {
        expect(URI.getName('https://example.net/file.jpg#section1?a=b&c=d')).toBe('file.jpg#section1?a=b&c=d')
        expect(URI.getName('https://example.net/file?a=b&c=d')).toBe('file?a=b&c=d')
        expect(URI.getName('http://example.net/file.tar.gz')).toBe('file.tar.gz')
        expect(URI.getName('http://example.net/file.jpg')).toBe('file.jpg')
        expect(URI.getName('http://example.net/file')).toBe('file')
        expect(URI.getName('path/file.jpg')).toBe('file.jpg')
        expect(URI.getName('path/file')).toBe('file')
        expect(URI.getName('/file')).toBe('file')
        expect(URI.getName('path/?a=b&c=d')).toBe('?a=b&c=d')
        expect(URI.getName('path/.log')).toBe('.log')

        // exceptions
        expect(URI.getName('/')).toBeUndefined()
        expect(URI.getName('')).toBeUndefined()
    })

    test('getParent', () => {
        expect(URI.getParent('https://example.net/file.jpg?a=b&c=d')).toBe('https://example.net')
        expect(URI.getParent('https://example.net/file?a=b&c=d')).toBe('https://example.net')
        expect(URI.getParent('http://example.net/file.tar.gz')).toBe('http://example.net')
        expect(URI.getParent('http://example.net/file.jpg')).toBe('http://example.net')
        expect(URI.getParent('http://example.net/file')).toBe('http://example.net')
        expect(URI.getParent('path/a.b/file.jpg')).toBe('path/a.b')
        expect(URI.getParent('path/a.b/file')).toBe('path/a.b')
        expect(URI.getParent('path/file.jpg')).toBe('path')
        expect(URI.getParent('path/file')).toBe('path')
        expect(URI.getParent('path/?a=b&c=d')).toBe('path')
        expect(URI.getParent('path/.log')).toBe('path')
        expect(URI.getParent('/file')).toBe('')
        expect(URI.getParent('/')).toBe('')

        expect(URI.getParent('file.jpg')).toBeUndefined()
        expect(URI.getParent('file?a=b')).toBeUndefined()
        expect(URI.getParent('')).toBeUndefined()
    })

    test('hasExt', () => {
        // truthy
        expect(URI.hasExt('https://example.net/file.jpg#section1?a=b&c=d')).toBeTruthy()
        expect(URI.hasExt('http://example.net/file.tar.gz')).toBeTruthy()
        expect(URI.hasExt('http://example.net/file.jpg')).toBeTruthy()
        expect(URI.hasExt('path/a.b/file.jpg')).toBeTruthy()
        expect(URI.hasExt('path/file.jpg')).toBeTruthy()
        expect(URI.hasExt('path/.log')).toBeTruthy()

        // falsy
        expect(URI.hasExt('https://example.net/file?a=b&c=d')).toBeFalsy()
        expect(URI.hasExt('http://example.net/file')).toBeFalsy()
        expect(URI.hasExt('path/a.b/file')).toBeFalsy()
        expect(URI.hasExt('path/file')).toBeFalsy()
        expect(URI.hasExt('path/?a=b&c=d')).toBeFalsy()
        expect(URI.hasExt('/file')).toBeFalsy()
        expect(URI.hasExt('/')).toBeFalsy()
        expect(URI.hasExt('')).toBeFalsy()
    })

    test('getExt', () => {
        expect(URI.getExt('https://example.net/file.jpg#section1?a=b&c=d')).toBe('jpg')
        expect(URI.getExt('http://example.net/file.tar.gz')).toBe('tar.gz')
        expect(URI.getExt('http://example.net/file.jpg')).toBe('jpg')
        expect(URI.getExt('path/a.b/file.jpg')).toBe('jpg')
        expect(URI.getExt('path/file.jpg')).toBe('jpg')
        expect(URI.getExt('path/.log')).toBe('log')

        // exceptions
        expect(URI.getExt('https://example.net/file?a=b&c=d')).toBeUndefined()
        expect(URI.getExt('http://example.net/file')).toBeUndefined()
        expect(URI.getExt('path/a.b/file')).toBeUndefined()
        expect(URI.getExt('path/file')).toBeUndefined()
        expect(URI.getExt('path/?a=b&c=d')).toBeUndefined()
        expect(URI.getExt('/file')).toBeUndefined()
        expect(URI.getExt('/')).toBeUndefined()
        expect(URI.getExt('')).toBeUndefined()
    })

    test('removeExt', () => {
        expect(URI.removeExt('https://example.net/file.jpg#section1?a=b&c=d')).toBe('https://example.net/file')
        expect(URI.removeExt('https://example.net/file?a=b&c=d')).toBe('https://example.net/file')
        expect(URI.removeExt('http://example.net/file.tar.gz')).toBe('http://example.net/file')
        expect(URI.removeExt('http://example.net/file.jpg')).toBe('http://example.net/file')
        expect(URI.removeExt('http://example.net/file')).toBe('http://example.net/file')
        expect(URI.removeExt('path/a.b/file.jpg')).toBe('path/a.b/file')
        expect(URI.removeExt('path/a.b/file')).toBe('path/a.b/file')
        expect(URI.removeExt('path/file.jpg')).toBe('path/file')
        expect(URI.removeExt('path/file')).toBe('path/file')
        expect(URI.removeExt('path/?a=b&c=d')).toBe('path/')
        expect(URI.removeExt('path/.log')).toBe('path/')
        expect(URI.removeExt('/file')).toBe('/file')
        expect(URI.removeExt('/')).toBe('/')
        expect(URI.removeExt('')).toBe('')
    })
})
