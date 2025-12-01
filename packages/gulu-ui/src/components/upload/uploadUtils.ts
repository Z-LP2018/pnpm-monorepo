export interface ResolveFileItem {
  file: File
  name: string
}
export const resolveItems = async (items: DataTransferItemList): Promise<ResolveFileItem[]> => {
  const allFiles: ResolveFileItem[] = []
  // 遍历所有拖拽项
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (!item) continue
    const entry = item.webkitGetAsEntry()
    if (!entry) continue
    if (entry.isFile) {
      const file = await handleFile(entry as FileSystemFileEntry)
      if (file) allFiles.push(file)
    } else if (entry.isDirectory) {
      const files = await handleDirectory(entry as FileSystemDirectoryEntry)
      allFiles.push(...files)
    }
  }
  return allFiles
}

// 处理单个文件 - 返回 Promise
const handleFile = (fileEntry: FileSystemFileEntry): Promise<ResolveFileItem> => {
  return new Promise(resolve => {
    fileEntry.file(file => {
      const resolveFileItem = {
        file: file,
        name: fileEntry.name,
      }
      resolve(resolveFileItem)
    })
  })
}
// 处理目录 - 返回 Promise
const handleDirectory = async (
  directoryEntry: FileSystemDirectoryEntry
): Promise<ResolveFileItem[]> => {
  const allFiles: ResolveFileItem[] = []
  const reader = directoryEntry.createReader()
  return new Promise(resolve => {
    reader.readEntries(async entries => {
      for (const entry of entries) {
        if (entry.isFile) {
          const file = await handleFile(entry as FileSystemFileEntry)
          allFiles.push(file)
        } else if (entry.isDirectory) {
          const subFiles = await handleDirectory(entry as FileSystemDirectoryEntry)
          allFiles.push(...subFiles)
        }
      }
      resolve(allFiles)
    })
  })
}
