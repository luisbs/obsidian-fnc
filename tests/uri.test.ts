import { URI, URL } from '../src/utility/uri'

describe('Testing URI methods', () => {
  test('join', () => {
    expect(URI.join('a', 'b/c', 'd\\e', 'file.jpg')).toBe('a/b/c/d\\e/file.jpg')
    expect(URI.join('a/', '/b/', '\\c\\', 'file.jpg')).toBe('a/b/c/file.jpg')
    expect(URI.join('~/a', 'file.jpg')).toBe('~/a/file.jpg')
    expect(URI.join('./a', 'file.jpg')).toBe('./a/file.jpg')
    expect(URI.join('/a', 'file.jpg')).toBe('/a/file.jpg')
  })

  // prettier-ignore
  test('normalize', () => {
    expect(URI.normalize('https://example.net/file😀-¨*.jpg?a=b&c=d')).toBe('https://example.net/file_-_.jpg?a=b&c=d')
    expect(URI.normalize('path/a.b/file😀-¨*.jpg?a=b&c=d')).toBe('path/a.b/file_-_.jpg?a=b&c=d')
  })

  test('hasExt', () => {
    // truthy
    expect(URI.hasExt('https://example.net/file.jpg?a=b&c=d')).toBeTruthy()
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
    expect(URI.getExt('https://example.net/file.jpg?a=b&c=d')).toBe('jpg')
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

  // prettier-ignore
  test('removeExt', () => {
    expect(URI.removeExt('https://example.net/file.jpg?a=b&c=d')).toBe('https://example.net/file')
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

  test('getBasename', () => {
    expect(URI.getBasename('https://example.net/file.jpg?a=b&c=d')).toBe('file')
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
    expect(URI.getName('https://example.net/file.jpg?a=b&c=d')).toBe('file.jpg?a=b&c=d')
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

  // prettier-ignore
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
    expect(URI.getParent('')).toBe('')
  })
})

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

  // prettier-ignore
  test('getOrigin', () => {
    expect(URL.getOrigin('https://sub.example.net/file/path.jpg#section1?a=b&c=d')).toBe('https://sub.example.net')
    expect(URL.getOrigin('http://sub.example.net/file/path.jpg')).toBe('http://sub.example.net')
    expect(URL.getOrigin('http://example.net/file/path')).toBe('http://example.net')

    // exception
    expect(URL.getOrigin('file/path.jpg#section1?a=b&c=d')).toBeUndefined()
    expect(URL.getOrigin('file/path')).toBeUndefined()
  })

  // prettier-ignore
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

  // prettier-ignore
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
