import { computePosition } from '@floating-ui/dom'
import { App } from 'obsidian'
import { makeItFloat, matchWidth } from '../common/ui'
import Suggester from './Suggester'

/**
 * Controls an index to be under a limit value.
 */
function ensureIndex(index: number, max: number): number {
    return ((index % max) + max) % max
}

/**
 * Suggester attached to an input element.
 * Prints a list of options on a floating element, under the input.
 */
export default abstract class InputSuggester<T> extends Suggester<T> {
    #options: T[] = []
    #suggestionEls: HTMLElement[] = []

    #focused = -1

    constructor(
        app: App, //
        protected inputEl: HTMLInputElement | HTMLTextAreaElement,
        containerEl?: HTMLElement,
    ) {
        super(app, containerEl ?? inputEl.parentElement ?? document.body)
        this.registerListeners()
    }

    open(): void {
        super.open()
        // initializeFloatingElement
        void computePosition(this.inputEl, this.wrapperEl, {
            placement: 'bottom-start',
            middleware: [matchWidth(), makeItFloat()],
        })
    }

    close(): void {
        super.close()
        this.#focused = -1
        this.#options = []
        this.#suggestionEls = []
    }

    protected registerListeners(): void {
        super.registerListeners()

        this.scope.register([], 'Enter', (ev) => this.onKeypress(ev, 'enter'))
        this.scope.register([], 'ArrowUp', (ev) => this.onKeypress(ev, 'up'))
        this.scope.register([], 'ArrowDown', (ev) => this.onKeypress(ev, 'down'))

        // stop bubbling out of the suggester
        this.wrapperEl.addEventListener('mousedown', () => false)
        this.wrapperEl.on('click', '.suggestion-item', this.onClick.bind(this))

        this.inputEl.addEventListener('blur', this.onBlur.bind(this))
        this.inputEl.addEventListener('focus', this.onInputChange.bind(this) as EventListener)
        this.inputEl.addEventListener('input', this.onInputChange.bind(this) as EventListener)
    }

    protected onBlur(): void {
        // wait for a time after leaving the input
        // to close the suggester
        setTimeout(() => this.close(), 100)
    }

    protected onInputChange(event: InputEvent | FocusEvent): void {
        if (
            !(event.currentTarget instanceof HTMLInputElement) &&
            !(event.currentTarget instanceof HTMLTextAreaElement)
        ) {
            return
        }

        const suggestions = this.getSuggestions(event.currentTarget.value)

        if (suggestions.length > 0) {
            this.wrapperEl.empty()

            this.#options = suggestions
            this.#suggestionEls = suggestions.map((suggestion) => {
                const suggestionEl = this.wrapperEl.createDiv('suggestion-item')
                this.renderSuggestion(suggestion, suggestionEl)
                return suggestionEl
            })

            this.open()
            return
        }

        this.close()
    }

    protected onKeypress(event: KeyboardEvent, action: 'up' | 'down' | 'enter'): void {
        if (event.isComposing) return
        event.preventDefault()

        switch (action) {
            case 'enter':
                this.selectSuggestion(this.#options[this.#focused])
                break
            case 'up':
                this.focusSuggestion(this.#focused - 1, true)
                break
            case 'down':
                this.focusSuggestion(this.#focused + 1, true)
                break
        }
    }

    protected onClick(event: MouseEvent, el: HTMLElement): void {
        event.preventDefault()
        this.focusSuggestion(this.#suggestionEls.indexOf(el), false)
        this.selectSuggestion(this.#options[this.#focused])
    }

    focusSuggestion(index: number, scrollIntoView: boolean): void {
        const nextIndex = ensureIndex(index, this.#options.length)

        const prevFocused = this.#suggestionEls[this.#focused]
        const nextFocused = this.#suggestionEls[nextIndex]

        prevFocused.removeClass('is-selected')
        nextFocused.addClass('is-selected')

        this.#focused = nextIndex

        if (scrollIntoView) {
            nextFocused.scrollIntoView(false)
        }
    }

    abstract getSuggestions(search: string): T[]
}
