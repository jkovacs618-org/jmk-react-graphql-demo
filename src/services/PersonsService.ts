import { gql } from '@apollo/client'

export const getPersonsQuery = gql`
    query GetPersons($filter: String) {
        personsList(filter: $filter) {
            id
            persons {
                externalId
                nameFirst
                nameMiddle
                nameLast
                suffix
                gender
                birthDate
                deathDate
                person2Relationship {
                    type
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

export const getPersonQuery = gql`
    query GetPerson($externalId: String) {
        person(externalId: $externalId) {
            externalId
            nameFirst
            nameMiddle
            nameLast
            suffix
            gender
            birthDate
            deathDate
            person2Relationship {
                type
            }
        }
    }
`

export const createPersonQuery = gql`
    mutation CreatePersonMutation($person: PersonInput!) {
        createPerson(person: $person) {
            externalId
            nameFirst
            nameMiddle
            nameLast
            gender
            birthDate
            deathDate
            createdAt
        }
    }
`

export const updatePersonQuery = gql`
    mutation UpdatePersonMutation($externalId: String!, $person: PersonInput!) {
        updatePerson(externalId: $externalId, person: $person) {
            externalId
            nameFirst
            nameMiddle
            nameLast
            gender
            birthDate
            deathDate
            updatedAt
            person2Relationship {
                type
            }
        }
    }
`

export const deletePersonQuery = gql`
    mutation DeletePersonMutation($externalId: String!) {
        deletePerson(externalId: $externalId) {
            externalId
            nameFirst
            nameMiddle
            nameLast
            gender
            birthDate
            deathDate
            updatedAt
            person2Relationship {
                type
            }
        }
    }
`
