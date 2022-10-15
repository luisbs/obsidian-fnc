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
