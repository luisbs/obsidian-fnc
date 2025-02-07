import { Middleware } from '@floating-ui/dom'

/**
 * Modifies the floating element width
 * to match the reference element with.
 */
export function matchWidth(): Middleware {
    return {
        name: 'matchWidth',
        fn({ elements, rects }) {
            elements.floating.style.width = `${rects.reference.width}px`
            return { reset: { rects: true } }
        },
    }
}

/**
 * Modifies the floating element position
 * to align with the reference element.
 */
export function makeItFloat(): Middleware {
    return {
        name: 'makeItFloat',
        fn({ elements, x, y }) {
            elements.floating.style.top = `${y}px`
            elements.floating.style.left = `${x}px`
            return {}
        },
    }
}
