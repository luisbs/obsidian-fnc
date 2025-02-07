/**
 * Credits go to Liam's Periodic Notes Plugin
 * @see https://github.com/liamcain/obsidian-periodic-notes
 */

import { TFolder } from 'obsidian'
import { getAllFoldersInVault } from '../utility/filesystem'
import InputSuggester from './InputSuggester'

/**
 * An Suggester attached to an input element
 * that gives suggestions based on the folders of the vault.
 */
export default class FolderSuggester extends InputSuggester<TFolder> {
    getSuggestions(search: string): TFolder[] {
        const serialized = search.trim().toLowerCase()

        return getAllFoldersInVault(
            this.app.vault, //
            (folder) => folder.path.toLowerCase().contains(serialized),
        )
    }

    renderSuggestion(value: TFolder, el: HTMLElement): void {
        el.setText(value.path)
    }

    selectSuggestion(value: TFolder): void {
        this.inputEl.value = value.path
        this.inputEl.trigger('input')
        this.close()
    }
}
