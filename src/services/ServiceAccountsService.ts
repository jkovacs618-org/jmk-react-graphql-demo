import { gql } from '@apollo/client'

export const getServiceAccountsQuery = gql`
    query GetServiceAccounts($filter: String) {
        servicesList(filter: $filter) {
            id
            serviceAccounts {
                externalId
                description
                startDate
                endDate
                accountNumber
                organization {
                    externalId
                    name
                }
                serviceType {
                    externalId
                    name
                }
            }
            count
        }
        organizations {
            externalId
            name
        }
        serviceTypes {
            externalId
            name
        }
    }
`

export const getReferencesQuery = gql`
    query GetReferences {
        organizations {
            externalId
            name
        }
        serviceTypes {
            externalId
            name
        }
    }
`

export const getServiceAccountQuery = gql`
    query GetServiceAccount($externalId: String) {
        serviceAccount(externalId: $externalId) {
            externalId
            description
            accountNumber
            startDate
            endDate
            website
            username
            email
            organization {
                externalId
                name
            }
            serviceType {
                externalId
                name
            }
        }
        organizations {
            externalId
            name
        }
        serviceTypes {
            externalId
            name
        }
    }
`

export const createServiceAccountQuery = gql`
    mutation CreateServiceAccountMutation($serviceAccount: ServiceAccountInput!) {
        createServiceAccount(serviceAccount: $serviceAccount) {
            externalId
            description
            accountNumber
            startDate
            endDate
            createdAt
            organization {
                externalId
                name
            }
            serviceType {
                externalId
                name
            }
        }
    }
`

export const updateServiceAccountQuery = gql`
    mutation UpdateServiceAccountMutation(
        $externalId: String!
        $serviceAccount: ServiceAccountInput!
    ) {
        updateServiceAccount(externalId: $externalId, serviceAccount: $serviceAccount) {
            externalId
            description
            accountNumber
            startDate
            endDate
            updatedAt
            organization {
                externalId
                name
            }
            serviceType {
                externalId
                name
            }
        }
    }
`

export const deleteServiceAccountQuery = gql`
    mutation DeleteServiceAccountMutation($externalId: String!) {
        deleteServiceAccount(externalId: $externalId) {
            externalId
            description
            accountNumber
            startDate
            endDate
            updatedAt
            organization {
                externalId
                name
            }
            serviceType {
                externalId
                name
            }
        }
    }
`
