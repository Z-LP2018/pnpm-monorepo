export namespace GuluThemeHooks {
  export interface ThemeColors {
    primary?: string
    secondary?: string
    success?: string
    warning?: string
    danger?: string
    info?: string
  }
  export type parseRgb = (color: string) => { r: number; g: number; b: number } | null
}
