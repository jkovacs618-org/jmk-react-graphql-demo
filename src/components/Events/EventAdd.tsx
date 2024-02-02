import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useLazyQuery, useMutation } from '@apollo/client'
import { observer } from 'mobx-react'
import { Label } from 'flowbite-react'
import Breadcrumbs from '@/components/Layout/Content/Breadcrumbs'
import SubmitButton from '@/components/Shared/SubmitButton'
import CancelButton from '@/components/Shared/CancelButton'
import { createModelQuery, getCalendarsQuery } from '@/services/EventsService'
import EventsStore from '@/stores/EventsStore'
import AlertBox from '@/components/Shared/AlertBox'

interface FormValues {
    title: string
    location: string
    startDate: string
    endDate: string
    calendarExternalId: string
    newCalendarTitle: string
}

const EventAddForm: React.FC = () => {
    const [formError, setFormError] = useState('')
    const eventsStore = useContext(EventsStore)
    const navigate = useNavigate()

    const {
        register,
        formState: { errors },
        handleSubmit,
        setFocus,
        watch,
        reset,
    } = useForm<FormValues>()
    // console.debug('useForm errors: ', errors)

    const watchCalendarExternalId = watch('calendarExternalId')

    const [executeLoad] = useLazyQuery(getCalendarsQuery)

    const loadCalendarsAsync = useCallback(async () => {
        try {
            executeLoad({
                variables: {},
                onCompleted: (data) => {
                    if (typeof data.calendars !== 'undefined' && data.calendars) {
                        eventsStore.setCalendars(data.calendars)

                        const defaultCalendarExternalId = eventsStore.getDefaultCalendarExternalId()
                        reset({ calendarExternalId: defaultCalendarExternalId })
                    }
                },
            })
        } catch (error) {
            console.error(error)
        }
    }, [executeLoad, eventsStore, reset])

    useEffect(() => {
        setFocus('title')
        loadCalendarsAsync()
        return () => {
            // console.debug('EventAddForm cleanup');
        }
    }, [loadCalendarsAsync, setFocus])

    const [executeCreate] = useMutation(createModelQuery, {
        onError: () => {
            setFormError('Failed to add the event. Please try again later.')
        },
        onCompleted: (data) => {
            console.debug('Event created: data:', data)
            navigate('/events')
        },
    })

    const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
        // console.debug(data)
        await executeCreate({
            variables: {
                event: {
                    title: data.title,
                    location: data.location,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    calendarExternalId: data.calendarExternalId,
                    newCalendarTitle: data.newCalendarTitle,
                },
            },
        })
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

            {formError && <AlertBox message={formError} onClose={() => setFormError('')} />}

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <div className="mb-2">
                        <div className="mb-1 block">
                            <Label htmlFor="title" value="Event Title *" />
                        </div>
                        <div>
                            <input
                                {...register('title', { required: true, maxLength: 250 })}
                                defaultValue=""
                                className="form-control"
                                aria-invalid={errors.title ? 'true' : 'false'}
                            />
                            {errors.title?.type === 'required' && (
                                <span role="alert" className="text-red-500 text-sm font-bold">
                                    Event title is required
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="mb-2">
                        <div className="mb-1 block">
                            <Label htmlFor="location" value="Location" />
                        </div>
                        <div>
                            <input
                                {...register('location')}
                                defaultValue=""
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div className="mb-2">
                        <div className="mb-1 block">
                            <Label htmlFor="startDate" value="Start" />
                        </div>
                        <div>
                            <input
                                type="date"
                                {...register('startDate')}
                                defaultValue=""
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div className="mb-2">
                        <div className="mb-1 block">
                            <Label htmlFor="endDate" value="End" />
                        </div>
                        <div>
                            <input
                                type="date"
                                {...register('endDate')}
                                defaultValue=""
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div className="mb-2">
                        <div className="mb-1 block">
                            <Label htmlFor="calendar" value="Calendar *" />
                        </div>
                        <div>
                            <select
                                {...register('calendarExternalId', { required: true })}
                                className="form-control"
                            >
                                <option value="">Select...</option>
                                {eventsStore.calendars.map((calendar) => {
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
                            </select>
                            {errors.calendarExternalId?.type === 'required' && (
                                <span role="alert" className="text-red-500 text-sm font-bold">
                                    Please select a calendar
                                </span>
                            )}
                        </div>
                    </div>

                    {watchCalendarExternalId === 'NEW' && (
                        <div className="mb-2">
                            <div className="mb-1 block">
                                <Label htmlFor="newCalendarTitle" value="New Calendar Title" />
                            </div>
                            <input
                                {...register('newCalendarTitle', {
                                    validate: (value, formValues) => {
                                        if (formValues.calendarExternalId === 'NEW') {
                                            return value !== ''
                                        }
                                        return false
                                    },
                                })}
                                defaultValue=""
                                className="form-control"
                            />
                            {errors.newCalendarTitle?.type === 'validate' && (
                                <span role="alert" className="text-red-500 text-sm font-bold">
                                    Please enter a calendar title
                                </span>
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
