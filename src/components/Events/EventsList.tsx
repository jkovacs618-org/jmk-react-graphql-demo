import { useCallback, useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { Table } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dayjs from 'dayjs'
import Breadcrumbs from '@/components/Layout/Content/Breadcrumbs'
import { useLazyQuery, gql, useMutation, ApolloError } from '@apollo/client'
import { Event } from '@/interfaces/interfaces'

const EventsList: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('')

    const query = gql`
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
    const [executeSearch, { data, loading, error }] = useLazyQuery(query)

    const loadListAsync = useCallback(async () => {
        executeSearch()
    }, [executeSearch])

    useEffect(() => {
        // console.debug('EventsList.useEffect');
        loadListAsync()
        return () => {
            //console.debug('EventsList cleanup');
        }
    }, [loadListAsync])

    const searchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        executeSearch({
            variables: {
                filter: searchQuery,
            },
        })
    }

    const searchClear = () => {
        setSearchQuery('')
        executeSearch()
        document.getElementById('eventsListSearchInput')?.focus()
    }

    const deleteModelQuery = gql`
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

    const [executeDelete] = useMutation(deleteModelQuery, {
        variables: {
            // Passed externalId in executeDelete call below.
        },
        onError: (error: ApolloError) => {
            console.error('Event Delete Failed: error: ', error)
        },
        onCompleted: (data) => {
            console.debug('Event Deleted: data:', data)
            executeSearch({
                variables: {
                    filter: searchQuery,
                },
            })
        },
    })

    const breadcrumbLinks = [
        { path: '/', label: 'Dashboard' },
        { path: '/events', label: 'Events' },
    ]

    return (
        <>
            <Breadcrumbs links={breadcrumbLinks} />

            <div className="flex gap-4">
                <div>
                    <h2 className="text-3xl text-slate-600 font-bold">Events</h2>
                </div>
                <div className="ml-auto">
                    <Link to="/events/new" className="text-white">
                        <button className="rounded-md bg-sky-600 py-2 px-3 text-sm font-semibold text-white hover:text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600">
                            New Event
                        </button>
                    </Link>
                </div>
            </div>

            <div className="mt-2">
                <form onSubmit={searchSubmit}>
                    <div className="relative inline-block">
                        <input
                            id="eventsListSearchInput"
                            type="search"
                            value={searchQuery}
                            placeholder="Search..."
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="text-xs mr-2 border-slate-300 rounded"
                        />
                        <FontAwesomeIcon
                            icon="times"
                            onClick={searchClear}
                            className={
                                'absolute right-4 text-slate-400 top-2 cursor-pointer ' +
                                (searchQuery === '' ? 'hidden' : '')
                            }
                        />
                    </div>
                    <div className="inline-block">
                        <button
                            type="submit"
                            className="py-1 px-3 bg-slate-300 hover:bg-slate-200 text-slate-600 text-sm"
                        >
                            Search
                        </button>
                    </div>
                </form>
            </div>

            <div>
                <div className="d-inline col-4 text-sm mt-2">
                    Total items: &nbsp;
                    <span className="badge badge-info">
                        {data && data.eventsList ? data.eventsList.count : 0}
                    </span>
                </div>
            </div>

            {loading && <div className="hidden">Loading Events...</div>}

            {error && <div>Error: ${error.message}</div>}

            {data && (
                <div className="mt-3 mb-10">
                    <div className="overflow-x-auto">
                        <Table striped className="text-left">
                            <Table.Head>
                                <Table.HeadCell className="py-3">Event Title</Table.HeadCell>
                                <Table.HeadCell>Location</Table.HeadCell>
                                <Table.HeadCell>Starts</Table.HeadCell>
                                <Table.HeadCell>Ends</Table.HeadCell>
                                <Table.HeadCell>Calendar</Table.HeadCell>
                                <Table.HeadCell>
                                    <span className="sr-only">Actions</span>
                                </Table.HeadCell>
                            </Table.Head>

                            <Table.Body className="divide-y">
                                {data.eventsList.events.map((event: Event) => (
                                    <Table.Row
                                        key={event.externalId}
                                        className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                    >
                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white py-2">
                                            <Link to={`/events/edit/${event.externalId}`}>
                                                {event.title}
                                            </Link>
                                        </Table.Cell>
                                        <Table.Cell>
                                            {event.location ? event.location : '-'}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {event.startDate
                                                ? dayjs(event.startDate).format('M/D/YY')
                                                : '-'}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {event.endDate
                                                ? dayjs(event.endDate).format('M/D/YY')
                                                : '-'}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {event.calendar ? event.calendar.title : '-'}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Link to={`/events/edit/${event.externalId}`}>
                                                <FontAwesomeIcon
                                                    icon="pen-to-square"
                                                    className="text-gray-400 text-lg mr-6"
                                                    title="Edit Event"
                                                />
                                            </Link>
                                            <Link
                                                to="#"
                                                onClick={() => {
                                                    if (confirm('Are you sure?')) {
                                                        executeDelete({
                                                            variables: {
                                                                externalId: event.externalId!,
                                                            },
                                                        })
                                                    }
                                                }}
                                            >
                                                <FontAwesomeIcon
                                                    icon="trash-can"
                                                    className="text-gray-400 text-lg"
                                                    title="Remove Event"
                                                />
                                            </Link>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </div>
                </div>
            )}
        </>
    )
}

const EventsListObserver = observer(EventsList)

export default EventsListObserver
