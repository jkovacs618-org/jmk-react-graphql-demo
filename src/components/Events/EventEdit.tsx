import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useLazyQuery, useMutation } from '@apollo/client'
import { observer } from 'mobx-react'
import { Label } from 'flowbite-react'
import dayjs from 'dayjs'
import EventsStore from '@/stores/EventsStore'
import Breadcrumbs from '@/components/Layout/Content/Breadcrumbs'
import SubmitButton from '@/components/Shared/SubmitButton'
import CancelButton from '@/components/Shared/CancelButton'
import { getEventQuery, updateEventQuery } from '@/services/EventsService'
import AlertBox from '@/components/Shared/AlertBox'

interface FormValues {
    title: string
    location: string
    startDate: string
    endDate: string
    calendarExternalId: string
    newCalendarTitle: string
}

const EventEditForm: React.FC = () => {
    const [formError, setFormError] = useState('')
    const eventsStore = useContext(EventsStore)
    const { id } = useParams()
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

    const [executeLoad, { data, loading, error }] = useLazyQuery(getEventQuery)

    const loadModelAsync = useCallback(
        async (externalId: string) => {
            try {
                executeLoad({
                    variables: {
                        externalId: externalId,
                    },
                    onCompleted: (data) => {
                        if (typeof data.event !== 'undefined' && data.event) {
                            // console.debug('loadModelAsync: data: ', data)
                            eventsStore.setCalendars(data.calendars)

                            const event = data.event
                            reset({
                                title: event.title,
                                location: event.location,
                                startDate: event.startDate
                                    ? dayjs(event.startDate).format('YYYY-MM-DD')
                                    : '',
                                endDate: event.endDate
                                    ? dayjs(event.endDate).format('YYYY-MM-DD')
                                    : '',
                                calendarExternalId: event.calendar.externalId,
                                newCalendarTitle: '',
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
        [executeLoad, navigate, eventsStore, reset]
    )

    useEffect(() => {
        setFocus('title')
        loadModelAsync(id as string)
        return () => {
            // console.debug('EventEditForm cleanup');
        }
    }, [id, loadModelAsync, setFocus])

    const [executeUpdate] = useMutation(updateEventQuery, {
        onError: () => {
            setFormError('Failed to update the event. Please try again later.')
        },
        onCompleted: (data) => {
            console.debug('Event Updated: data:', data)
            navigate('/events')
        },
    })

    const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
        // console.debug(data)
        executeUpdate({
            variables: {
                externalId: id as string,
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
        { path: '', label: 'Edit' },
    ]

    return (
        <>
            <Breadcrumbs links={breadcrumbLinks} />

            <h2 className="text-3xl text-slate-600 font-bold" title={id ? 'ID: ' + id : ''}>
                Edit Event
            </h2>

            {formError && <AlertBox message={formError} onClose={() => setFormError('')} />}

            {loading && <div>Loading...</div>}

            {error && <div className="hidden">Error: ${error.message}</div>}

            {data && (
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
                                    className="form-control bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white "
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
