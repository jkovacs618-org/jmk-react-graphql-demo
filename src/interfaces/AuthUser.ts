export interface AuthUser {
    id?: number | null;
    externalId?: string;
    personExternalId?: string;
    nameFirst: string;
    nameLast: string;
    email: string;
    status: boolean;
    createdAt: string;
    person?: { externalId: string } | null;
}