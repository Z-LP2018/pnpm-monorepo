export namespace GuluRouteHistoryTypes {
  export interface RouteHistoryItem {
    path: string
    name?: string | symbol
    fullPath: string
    meta?: Record<string, any>
    title?: string
    timestamp: number
    query?: Record<string, any>
    params?: Record<string, any>
  }
}
