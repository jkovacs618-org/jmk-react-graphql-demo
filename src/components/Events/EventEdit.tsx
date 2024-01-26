import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Label, Select, TextInput } from 'flowbite-react'
import { observer } from 'mobx-react'
import EventsStore from '@/stores/EventsStore'
import dayjs from 'dayjs'
import Breadcrumbs from '@/components/Layout/Content/Breadcrumbs'
import SubmitButton from '@/components/Shared/SubmitButton'
import CancelButton from '@/components/Shared/CancelButton'
import { Event } from '@/interfaces/interfaces'
import { ApolloError, gql, useLazyQuery, useMutation } from '@apollo/client'

const EventEditForm: React.FC = () => {
    const [event, setEvent] = useState<Event | null>(null)
    const [newCalendarTitleError, setNewCalendarTitleError] = React.useState('')
    const eventsStore = useContext(EventsStore)
    const { calendars } = eventsStore
    const { id } = useParams()
    const navigate = useNavigate()

    const getModelsQuery = gql`
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
    const [executeLoad, { data, loading, error }] = useLazyQuery(getModelsQuery)

    const loadModelAsync = useCallback(
        async (externalId: string) => {
            try {
                executeLoad({
                    variables: {
                        externalId: externalId,
                    },
                    onCompleted: (data) => {
                        if (typeof data.event !== 'undefined' && data.event) {
                            eventsStore.setCalendars(data.calendars)
                            setEvent({
                                ...data.event,
                                calendarExternalId: data.event.calendar.externalId,
                            })
                        } else {
                            navigate('/events')
                        }
                    },
                })
            } catch (error) {
                console.error(error)
            }
        },
        [executeLoad, navigate, eventsStore]
    )

    useEffect(() => {
        // console.debug('EventEditForm.useEffect');
        loadModelAsync(id as string)
        return () => {
            // console.debug('EventEditForm cleanup');
        }
    }, [id, loadModelAsync])

    const updateModelQuery = gql`
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

    const [executeUpdate] = useMutation(updateModelQuery, {
        variables: {
            externalId: id as string,
            event: {
                calendarExternalId: event?.calendarExternalId,
                newCalendarTitle: event?.newCalendarTitle,
                title: event?.title,
                location: event?.location,
                startDate: event?.startDate,
                endDate: event?.endDate,
            },
        },
        onError: (error: ApolloError) => {
            console.error('Event Update Failed: error: ', error)
        },
        onCompleted: (data) => {
            console.debug('Event Updated: data:', data)
            navigate('/events')
        },
    })

    const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (event?.calendarExternalId === 'NEW' && event.newCalendarTitle === '') {
            setNewCalendarTitleError('Please enter a title')
        } else {
            setNewCalendarTitleError('')
        }
        executeUpdate()
    }

    const breadcrumbLinks = [
        { path: '/', label: 'Dashboard' },
        { path: '/events', label: 'Events' },
        { path: '', label: 'Edit' },
    ]

    return (
        <>
            <Breadcrumbs links={breadcrumbLinks} />

            <h2
                className="text-3xl text-slate-600 font-bold"
                title={event ? 'ID: ' + event.externalId : ''}
            >
                Edit Event
            </h2>

            {loading && <div>Loading...</div>}

            {error && <div className="hidden">Error: ${error.message}</div>}

            {data && event && (
                <form onSubmit={(e) => submitForm(e)}>
                    <div className="form-group">
                        <div className="mb-2">
                            <div className="mb-1 block">
                                <Label htmlFor="title" value="Title *" />
                            </div>
                            <TextInput
                                className="form-control"
                                name="title"
                                type="text"
                                value={event?.title ?? ''}
                                placeholder="Event Title"
                                onChange={(e) => {
                                    setEvent({ ...event, title: e.target.value } as Event)
                                }}
                                sizing="sm"
                                required
                                autoFocus
                            />
                        </div>

                        <div className="mb-2">
                            <div className="mb-1 block">
                                <Label htmlFor="location" value="Location" />
                            </div>
                            <TextInput
                                className="form-control"
                                name="location"
                                type="text"
                                value={event?.location ?? ''}
                                placeholder=""
                                onChange={(e) => {
                                    setEvent({ ...event, location: e.target.value } as Event)
                                }}
                                sizing="sm"
                            />
                        </div>

                        <div className="mb-2">
                            <div className="mb-1 block">
                                <Label htmlFor="startDate" value="Start" />
                            </div>
                            <TextInput
                                className="form-control"
                                name="startDate"
                                type="date"
                                value={
                                    event?.startDate
                                        ? dayjs(event.startDate).format('YYYY-MM-DD')
                                        : ''
                                }
                                placeholder="Start Date"
                                onChange={(e) => {
                                    setEvent({ ...event, startDate: e.target.value } as Event)
                                }}
                                sizing="sm"
                            />
                        </div>

                        <div className="mb-2">
                            <div className="mb-1 block">
                                <Label htmlFor="endDate" value="End" />
                            </div>
                            <TextInput
                                className="form-control"
                                name="endDate"
                                type="date"
                                value={
                                    event?.endDate ? dayjs(event.endDate).format('YYYY-MM-DD') : ''
                                }
                                placeholder="End Date"
                                onChange={(e) => {
                                    setEvent({ ...event, endDate: e.target.value } as Event)
                                }}
                                sizing="sm"
                            />
                        </div>

                        <div className="mb-2">
                            <div className="mb-1 block">
                                <Label htmlFor="calendar" value="Calendar *" />
                            </div>
                            <Select
                                className="form-control"
                                name="calendarExternalId"
                                value={event?.calendarExternalId ?? ''}
                                onChange={(e) => {
                                    setEvent({
                                        ...event,
                                        calendarExternalId: e.target.value,
                                    } as Event)
                                }}
                                sizing="sm"
                                required
                            >
                                <option value="">Select...</option>
                                {calendars.map((calendar) => {
                                    return (
                                        <option
                                            key={calendar.externalId}
                                            value={calendar.externalId}
                                        >
                                            {calendar.title}
                                        </option>
                                    )
                                })}
                                <option key="NEW" value="NEW">
                                    Add New
                                </option>
                            </Select>
                        </div>

                        {event.calendarExternalId === 'NEW' && (
                            <div className="mb-2">
                                <div className="mb-1 block">
                                    <Label htmlFor="newCalendarTitle" value="New Calendar Title" />
                                </div>
                                <TextInput
                                    className="form-control"
                                    name="newCalendarTitle"
                                    type="text"
                                    value={event.newCalendarTitle ?? ''}
                                    placeholder=""
                                    onChange={(e) => {
                                        setEvent({
                                            ...event,
                                            newCalendarTitle: e.target.value,
                                        } as Event)
                                    }}
                                    sizing="sm"
                                    required
                                />
                                {newCalendarTitleError && (
                                    <p className="text-sm text-red-600">{newCalendarTitleError}</p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="form-group mt-4">
                        <SubmitButton label="Update" />
                        <CancelButton path="/events" />
                    </div>
                </form>
            )}
        </>
    )
}

const EventEdit = observer(EventEditForm)
export default EventEdit
