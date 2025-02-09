import { describe, expect, test } from 'vitest'
import * as URL from '../../src/utility/url'

// prettier-ignore
describe('Testing URL methods', () => {
    test('isUrl', () => {
        // truthy
        expect(URL.isUrl('https://example.net/file/path.jpg#section1?a=b&c=d')).toBeTruthy()
        expect(URL.isUrl('https://example.net/file/path.jpg')).toBeTruthy()
        expect(URL.isUrl('https://example.net/file/path')).toBeTruthy()

        // falsy
        expect(URL.isUrl('file/path.jpg')).toBeFalsy()
        expect(URL.isUrl('file/path')).toBeFalsy()
    })

    test('getOrigin', () => {
        expect(URL.getOrigin('https://sub.example.net/file/path.jpg#section1?a=b&c=d')).toBe('https://sub.example.net')
        expect(URL.getOrigin('http://sub.example.net/file/path.jpg')).toBe('http://sub.example.net')
        expect(URL.getOrigin('http://example.net/file/path')).toBe('http://example.net')

        // exception
        expect(URL.getOrigin('file/path.jpg#section1?a=b&c=d')).toBeUndefined()
        expect(URL.getOrigin('file/path')).toBeUndefined()
    })

    test('getBaseurl', () => {
        expect(URL.getBaseurl('https://example.net/file/path.jpg#section1?a=b&c=d')).toBe('https://example.net/file/path.jpg')
        expect(URL.getBaseurl('http://example.net/file/path.jpg?a=b&c=d')).toBe('http://example.net/file/path.jpg')
        expect(URL.getBaseurl('http://example.net/file/path')).toBe('http://example.net/file/path')

        // false-positive
        expect(URL.getBaseurl('file/path.jpg#section1?a=b&c=d')).toBeUndefined()
        expect(URL.getBaseurl('file/path')).toBeUndefined()
    })

    test('getHash', () => {
        expect(URL.getHash('https://example.net/file/path.jpg#section1?a=b&c=d')).toBe('section1')
        expect(URL.getHash('http://example.net/file/path#section1')).toBe('section1')
        expect(URL.getHash('file/path.jpg#section1')).toBe('section1')
        expect(URL.getHash('file/path#section1')).toBe('section1')

        // exception
        expect(URL.getHash('http://example.net/file/path?a=b&c=d')).toBeUndefined()
        expect(URL.getHash('http://example.net/file/path')).toBeUndefined()
        expect(URL.getHash('file/path.jpg?a=b&c=d')).toBeUndefined()
        expect(URL.getHash('file/path')).toBeUndefined()
    })

    test('getparams', () => {
        expect(URL.getparams('https://example.net/file/path.jpg#section1?a=b&c=d')).toBe('a=b&c=d')
        expect(URL.getparams('http://example.net/file/path?a=b&c=d')).toBe('a=b&c=d')
        expect(URL.getparams('file/path.jpg?a=b&c=d')).toBe('a=b&c=d')
        expect(URL.getparams('file/path?a=b&c=d')).toBe('a=b&c=d')

        // exception
        expect(URL.getparams('http://example.net/file/path.jpg#section1')).toBeUndefined()
        expect(URL.getparams('http://example.net/file/path')).toBeUndefined()
        expect(URL.getparams('file/path.jpg')).toBeUndefined()
        expect(URL.getparams('file/path')).toBeUndefined()
    })
})
