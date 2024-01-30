import React, { useCallback, useContext, useEffect, useState } from 'react'
import EventsStore from '@/stores/EventsStore'
import { observer } from 'mobx-react'
import { Label, Select, TextInput } from 'flowbite-react'
import { useNavigate } from 'react-router-dom'
import Breadcrumbs from '@/components/Layout/Content/Breadcrumbs'
import SubmitButton from '@/components/Shared/SubmitButton'
import CancelButton from '@/components/Shared/CancelButton'
import { Calendar, Event } from '@/interfaces/interfaces'
import { ApolloError, gql, useLazyQuery, useMutation } from '@apollo/client'

const EventAddForm: React.FC = () => {
    const [event, setEvent] = useState<Event | null>(null)
    const [newCalendarTitleError, setNewCalendarTitleError] = React.useState('')
    const eventsStore = useContext(EventsStore)
    const { calendars } = eventsStore
    const navigate = useNavigate()

    const getCalendarsQuery = gql`
        query GetCalendars {
            calendars {
                externalId
                title
                isDefault
            }
        }
    `
    const [executeLoad] = useLazyQuery(getCalendarsQuery)

    const loadCalendarsAsync = useCallback(async () => {
        try {
            executeLoad({
                variables: {},
                onCompleted: (data) => {
                    if (typeof data.calendars !== 'undefined' && data.calendars) {
                        eventsStore.setCalendars(data.calendars)
                        const defaultCalendar = data.calendars.find(
                            (calendar: Calendar) => calendar.isDefault
                        )
                        if (defaultCalendar) {
                            setEvent({
                                ...event,
                                calendarExternalId: defaultCalendar.externalId,
                            } as Event)
                        }
                    }
                },
            })
        } catch (error) {
            console.error(error)
        }
    }, [executeLoad, eventsStore])

    useEffect(() => {
        // On component load, Reset the inputs:
        loadCalendarsAsync()
        setEvent({
            title: '',
            location: '',
            startDate: '',
            endDate: '',
            calendarExternalId: '',
        } as Event)
        return () => {
            // console.log('EventAddForm cleanup');
        }
    }, [loadCalendarsAsync])

    const createModelQuery = gql`
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

    const [executeCreate] = useMutation(createModelQuery, {
        variables: {
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
            console.error('Event Create Failed: error: ', error)
            navigate('/events')
        },
        onCompleted: (data) => {
            console.debug('Event Created: data:', data)
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
        executeCreate()
    }

    const breadcrumbLinks = [
        { path: '/', label: 'Dashboard' },
        { path: '/events', label: 'Events' },
        { path: '', label: 'New' },
    ]

    return (
        <>
            <Breadcrumbs links={breadcrumbLinks} />

            <h2 className="text-3xl text-slate-600 font-bold">New Event</h2>

            <form
                onSubmit={(e) => {
                    submitForm(e)
                }}
            >
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
                            value={event?.startDate ?? ''}
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
                            value={event?.endDate ?? ''}
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
                                setEvent({ ...event, calendarExternalId: e.target.value } as Event)
                            }}
                            sizing="sm"
                            required
                        >
                            <option value="">Select...</option>
                            {calendars.map((calendar) => {
                                return (
                                    <option key={calendar.externalId} value={calendar.externalId}>
                                        {calendar.title}
                                    </option>
                                )
                            })}
                            <option key="NEW" value="NEW">
                                Add New
                            </option>
                        </Select>
                    </div>

                    {event && event.calendarExternalId === 'NEW' && (
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
                    <SubmitButton label="Add Event" />
                    <CancelButton path="/events" />
                </div>
            </form>
        </>
    )
}

const EventAdd = observer(EventAddForm)
export default EventAdd
