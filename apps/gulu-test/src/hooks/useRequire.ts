export const useRequire = (imgPath: string) => {
  try {
    //路径页可以使用/src/**引入
    const handlePath = imgPath.replace('@', '..')
    return new URL(handlePath, import.meta.url).href
  } catch (error) {
    console.warn(error)
  }
}
