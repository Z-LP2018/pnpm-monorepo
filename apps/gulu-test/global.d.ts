declare module 'virtual:auto-layouts' {
  import type { Component } from 'vue'

  export const layoutComponents: Record<string, Component>
  export const layoutNames: string[]
}
