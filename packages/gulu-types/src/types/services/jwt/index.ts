export namespace GuluJwtTypes {
  export interface JwtUser {
    userId: number | string
    username: string
    roles: string[]
  }
}
