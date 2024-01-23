export interface AuthUser {
    id?: number | null;
    externalId?: string;
    nameFirst: string;
    nameLast: string;
    email: string;
    status: boolean;
    createdAt: string;
}