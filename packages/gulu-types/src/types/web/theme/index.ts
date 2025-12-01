export namespace GuluThemeTypes {
  export type Theme = 'light' | 'dark'
  export type setTheme = (theme: Theme) => void
  export type getTheme = () => Theme
  export interface ComponentsThemeColors {
    primary?: string
    secondary?: string
    success?: string
    warning?: string
    danger?: string
    info?: string
  }
  export type parseRgb = (color: string) => { r: number; g: number; b: number } | null
  export type setComponentsTheme = (colors: ComponentsThemeColors, target: HTMLElement) => void
  export type getComponentsTheme = (
    colorKey: keyof ComponentsThemeColors,
    target: HTMLElement
  ) => string | null
  export type resetComponentsTheme = (target: HTMLElement) => void
}
