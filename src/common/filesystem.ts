import { TAbstractFile, TFolder, Vault } from 'obsidian'

type FileFilter<T extends TAbstractFile = TAbstractFile> = (item: T) => boolean

export function getAllFoldersInVault(vault: Vault, filter?: FileFilter<TFolder>): TFolder[] {
  const _filter = filter
    ? (item: TAbstractFile) => item instanceof TFolder && filter(item)
    : (item: TAbstractFile) => item instanceof TFolder

  return getAllAbstractFilesInVault(vault, _filter)
}

export function getAllAbstractFilesInVault(
  vault: Vault,
  filter?: FileFilter<TAbstractFile>,
): TFolder[] {
  let files = vault.getAllLoadedFiles()

  if (filter) {
    files = files.filter(filter)
  }

  return files.sort((a, b) => a.path.localeCompare(b.path)) as TFolder[]
}
