export interface Event {
    id?: number | null
    externalId?: string | null
    accountExternalId?: string | null
    calendarExternalId?: string | null
    title: string
    location: string
    startDate: string
    endDate: string
    calendar: Calendar | null
    newCalendarTitle: string | null
}

export interface Calendar {
    id?: number | null
    externalId?: string
    title?: string | null
    isDefault?: boolean | null
}

export interface Person {
    id?: number | null
    externalId?: string | null
    accountExternalId?: number | null
    nameFirst: string
    nameMiddle: string
    nameLast: string
    gender?: string
    birthDate?: string
    deathDate?: string
    relationship: string
    person1Relationship: { type: string } | null
    person2Relationship: { type: string } | null
}

export interface ServiceAccount {
    id?: number | null
    externalId?: string
    accountExternalId?: number | null
    organizationExternalId?: string | null
    organizationName?: string | null
    serviceTypeExternalId?: string | null
    serviceTypeName?: string | null
    description: string
    accountNumber: string
    startDate?: string | null
    endDate?: string | null
    organization: Organization | null
    serviceType: ServiceType | null
    newOrganizationName: string | null
}

export interface Organization {
    id?: number | null
    externalId?: string
    name?: string | null
}

export interface ServiceType {
    id?: number | null
    externalId?: string
    name?: string | null
}
