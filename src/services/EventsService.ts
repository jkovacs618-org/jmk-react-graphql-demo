import { gql } from '@apollo/client'

export const getCalendarsQuery = gql`
    query GetCalendars {
        calendars {
            externalId
            title
            isDefault
        }
    }
`

export const getEventsQuery = gql`
    query GetEvents($filter: String) {
        eventsList(filter: $filter) {
            id
            events {
                externalId
                title
                location
                startDate
                endDate
                calendar {
                    externalId
                    title
                }
            }
            count
        }
        calendars {
            externalId
            title
        }
    }
`

export const getEventQuery = gql`
    query GetEvent($externalId: String) {
        event(externalId: $externalId) {
            externalId
            title
            location
            startDate
            endDate
            calendar {
                externalId
                title
            }
        }
        calendars {
            externalId
            title
        }
    }
`

export const createModelQuery = gql`
    mutation CreateEventMutation($event: EventInput!) {
        createEvent(event: $event) {
            externalId
            title
            location
            startDate
            endDate
            createdAt
            calendar {
                externalId
                title
            }
        }
    }
`

export const updateEventQuery = gql`
    mutation UpdateEventMutation($externalId: String!, $event: EventInput!) {
        updateEvent(externalId: $externalId, event: $event) {
            externalId
            title
            location
            startDate
            endDate
            updatedAt
            calendar {
                externalId
                title
            }
        }
    }
`

export const deleteEventQuery = gql`
    mutation DeleteEventMutation($externalId: String!) {
        deleteEvent(externalId: $externalId) {
            externalId
            title
            location
            startDate
            endDate
            updatedAt
            calendar {
                externalId
                title
            }
        }
    }
`
