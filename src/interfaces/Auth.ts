export interface AuthUser {
    id?: number | null
    externalId?: string
    personExternalId?: string
    nameFirst: string
    nameLast: string
    email: string
    status: boolean
    createdAt: string
    person?: { externalId: string } | null
}

export interface IAuthContext {
    authUser: AuthUser | null
    setAuthUser: (user: AuthUser | null) => void
    authToken: string | null
    setAuthToken: (user: string | null) => void
}
