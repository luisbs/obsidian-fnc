/**
 * Credits go to Liam's Periodic Notes Plugin
 * @see https://github.com/liamcain/obsidian-periodic-notes
 */

import { App, ISuggestOwner, Scope } from 'obsidian'

export default abstract class Suggester<T> implements ISuggestOwner<T> {
    protected scope: Scope

    protected wrapperEl: HTMLElement

    constructor(
        protected app: App, //
        protected containerEl: HTMLElement,
    ) {
        this.scope = new Scope()
        this.wrapperEl = createDiv('suggestions-tooltip')
    }

    protected registerListeners() {
        this.scope.register([], 'Escape', this.close.bind(this))
    }

    open(): void {
        this.app.keymap.pushScope(this.scope)
        this.containerEl.appendChild(this.wrapperEl)
    }

    close(): void {
        this.app.keymap.popScope(this.scope)
        this.wrapperEl.empty()
        this.wrapperEl.detach()
    }

    abstract getSuggestions(search: unknown): T[]

    abstract renderSuggestion(value: T, el: HTMLElement): void
    abstract selectSuggestion(value: T): void
}
