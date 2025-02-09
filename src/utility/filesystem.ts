import { normalizePath, TAbstractFile, TFile, TFolder, Vault } from 'obsidian'

type FileFilter<T extends TAbstractFile = TAbstractFile> = (item: T) => boolean

export function getAllFilesInVault(
    vault: Vault,
    filter?: FileFilter<TFile>,
): TFile[] {
    const _filter = filter
        ? (item: TAbstractFile) => item instanceof TFile && filter(item)
        : (item: TAbstractFile) => item instanceof TFile

    return getAllAbstractFilesInVault(vault, _filter)
}

export function getAllFoldersInVault(
    vault: Vault,
    filter?: FileFilter<TFolder>,
): TFolder[] {
    const _filter = filter
        ? (item: TAbstractFile) => item instanceof TFolder && filter(item)
        : (item: TAbstractFile) => item instanceof TFolder

    return getAllAbstractFilesInVault(vault, _filter)
}

export function getAllAbstractFilesInVault<T extends TAbstractFile>(
    vault: Vault,
    filter?: FileFilter,
): T[] {
    let files = vault.getAllLoadedFiles()

    if (filter) {
        files = files.filter(filter)
    }

    return files.sort((a, b) => a.path.localeCompare(b.path)) as T[]
}

export function getFilesOnFolder(
    vault: Vault,
    folderPath: string,
    filter?: FileFilter<TFile>,
): TFile[] {
    const folder = getFolderInVault(vault, folderPath)

    const _filter = filter
        ? (item: TAbstractFile) => item instanceof TFile && filter(item)
        : (item: TAbstractFile) => item instanceof TFile

    return folder.children.filter(_filter) as TFile[]
}

export function getFoldersOnFolder(
    vault: Vault,
    folderPath: string,
    filter?: FileFilter<TFolder>,
): TFolder[] {
    const folder = getFolderInVault(vault, folderPath)

    const _filter = filter
        ? (item: TAbstractFile) => item instanceof TFolder && filter(item)
        : (item: TAbstractFile) => item instanceof TFolder

    return folder.children.filter(_filter) as TFolder[]
}

export function getFolderInVault(vault: Vault, path: string): TFolder {
    const folder = vault.getAbstractFileByPath(normalizePath(path))

    if (!folder) {
        throw new Error(`Folder "${path}" doesn't exist.`)
    }
    if (!(folder instanceof TFolder)) {
        throw new Error(`${path} is a file, not a folder.`)
    }

    return folder
}
