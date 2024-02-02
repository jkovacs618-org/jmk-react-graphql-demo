import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import { useForm, SubmitHandler } from 'react-hook-form'
import { observer } from 'mobx-react'
import { Label } from 'flowbite-react'
import { useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import Breadcrumbs from '@/components/Layout/Content/Breadcrumbs'
import SubmitButton from '@/components/Shared/SubmitButton'
import CancelButton from '@/components/Shared/CancelButton'
import PersonsStore from '@/stores/PersonsStore'
import { Person } from '@/interfaces/interfaces'
import { getPersonQuery, updatePersonQuery } from '@/services/PersonsService'
import AlertBox from '@/components/Shared/AlertBox'

interface FormValues {
    nameFirst: string
    nameMiddle: string
    nameLast: string
    gender: string
    birthDate: string
    isDeceased: boolean
    deathDate: string
    relationship: string
}

const PersonEditForm: React.FC = () => {
    const [person, setPerson] = useState<Person | null>(null)
    const [formError, setFormError] = useState('')
    const personsStore = useContext(PersonsStore)
    const { id } = useParams()
    const navigate = useNavigate()

    const {
        register,
        formState: { errors },
        handleSubmit,
        setFocus,
        reset,
        watch,
    } = useForm<FormValues>()
    // console.debug('useForm errors: ', errors)

    const watchIsDeceased = watch('isDeceased')
    const watchRelationship = watch('relationship')

    const [executeLoad, { data, loading, error }] = useLazyQuery(getPersonQuery)

    const loadModelAsync = useCallback(
        async (externalId: string) => {
            try {
                executeLoad({
                    variables: {
                        externalId: externalId,
                    },
                    onCompleted: (data) => {
                        if (typeof data.person !== 'undefined' && data.person) {
                            const relationship = data.person.person2Relationship
                                ? data.person.person2Relationship.type
                                : ''
                            setPerson({
                                ...data.person,
                                relationship: relationship,
                            })

                            const person = data.person
                            reset({
                                nameFirst: person.nameFirst,
                                nameMiddle: person.nameMiddle,
                                nameLast: person.nameLast,
                                gender: person.gender,
                                birthDate: person.birthDate
                                    ? dayjs(person.birthDate).format('YYYY-MM-DD')
                                    : '',
                                deathDate: person.deathDate
                                    ? dayjs(person.deathDate).format('YYYY-MM-DD')
                                    : '',
                                relationship: relationship,
                                isDeceased: person.deathDate && person.deathDate !== '',
                            })
                        } else {
                            navigate('/persons')
                        }
                    },
                })
            } catch (error) {
                console.error(error)
            }
        },
        [executeLoad, navigate, reset]
    )

    useEffect(() => {
        setFocus('nameFirst')
        loadModelAsync(id as string)
        return () => {
            // console.debug('PersonEditForm cleanup');
        }
    }, [id, loadModelAsync, setFocus])

    const getAllowedRelationships = (person: Person | null) => {
        let allowedRelationships = []
        if (person?.relationship === 'Self') {
            allowedRelationships = ['Self']
        } else {
            allowedRelationships = personsStore.relationships.filter((value) => value !== 'Self')
        }
        return allowedRelationships
    }

    const [executeUpdate] = useMutation(updatePersonQuery, {
        onError: () => {
            setFormError('Failed to update the person. Please try again later.')
        },
        onCompleted: (data) => {
            console.debug('Person Updated: data:', data)
            navigate('/family')
        },
    })

    const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
        // console.debug(data)
        executeUpdate({
            variables: {
                externalId: id as string,
                person: {
                    nameFirst: data.nameFirst,
                    nameMiddle: data.nameMiddle,
                    nameLast: data.nameLast,
                    gender: data.gender,
                    birthDate: data.birthDate ? new Date(data.birthDate + ' 12:00:00') : null,
                    deathDate:
                        data.isDeceased && data.deathDate
                            ? new Date(data.deathDate + ' 12:00:00')
                            : null,
                    relationship: data.relationship,
                },
            },
        })
    }

    const breadcrumbLinks = [
        { path: '/', label: 'Dashboard' },
        { path: '/family', label: 'Family' },
        { path: '', label: 'Edit Person' },
    ]

    return (
        <>
            <Breadcrumbs links={breadcrumbLinks} />

            <h2 className="text-3xl text-slate-600 font-bold">Edit Person</h2>

            {formError && <AlertBox message={formError} onClose={() => setFormError('')} />}

            {loading && <div>Loading...</div>}

            {error && <div className="hidden">Error: ${error.message}</div>}

            {data && (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <div className="mb-2">
                            <div className="mb-1 block">
                                <Label htmlFor="nameFirst" value="First Name *" />
                            </div>
                            <div>
                                <input
                                    {...register('nameFirst', { required: true, maxLength: 100 })}
                                    defaultValue=""
                                    className="form-control"
                                    aria-invalid={errors.nameFirst ? 'true' : 'false'}
                                />
                                {errors.nameFirst?.type === 'required' && (
                                    <span role="alert" className="text-red-500 text-sm font-bold">
                                        First name is required
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="mb-2">
                            <div className="mb-1 block">
                                <Label htmlFor="nameMiddle" value="Middle Name" />
                            </div>
                            <div>
                                <input
                                    {...register('nameMiddle', { required: false, maxLength: 100 })}
                                    defaultValue=""
                                    className="form-control"
                                    aria-invalid={errors.nameMiddle ? 'true' : 'false'}
                                />
                            </div>
                        </div>

                        <div className="mb-2">
                            <div className="mb-1 block">
                                <Label htmlFor="nameLast" value="Last Name *" />
                            </div>
                            <div>
                                <input
                                    {...register('nameLast', { required: true, maxLength: 100 })}
                                    defaultValue=""
                                    className="form-control"
                                    aria-invalid={errors.nameLast ? 'true' : 'false'}
                                />
                                {errors.nameLast?.type === 'required' && (
                                    <span role="alert" className="text-red-500 text-sm font-bold">
                                        Last name is required
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="mb-2">
                            <div className="mb-1 block">
                                <Label htmlFor="gender" value="Gender" />
                            </div>
                            <div>
                                <select
                                    {...register('gender', { required: false })}
                                    className="form-control"
                                >
                                    <option value="">Select...</option>
                                    {personsStore.genders.map((value) => {
                                        return (
                                            <option key={value} value={value}>
                                                {value}
                                            </option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>

                        <div className="mb-2">
                            <div className="mb-1 block">
                                <Label htmlFor="birthDate" value="Date of Birth" />
                            </div>
                            <div>
                                <input
                                    type="date"
                                    {...register('birthDate')}
                                    defaultValue=""
                                    className="form-control"
                                />
                            </div>
                        </div>

                        <div className="mb-2">
                            <input
                                type="checkbox"
                                id="isDeceasedEdit"
                                {...register('isDeceased')}
                                className="mr-2"
                            />
                            <Label htmlFor="isDeceasedEdit" value="Deceased?" />
                        </div>

                        {watchIsDeceased ? (
                            <div className="mb-2">
                                <div className="mb-1 block">
                                    <Label htmlFor="deathDate" value="Date of Death" />
                                </div>
                                <div>
                                    <input
                                        type="date"
                                        {...register('deathDate')}
                                        defaultValue=""
                                        className="form-control"
                                    />
                                </div>
                            </div>
                        ) : (
                            ''
                        )}

                        <div className="mb-2">
                            <div className="mb-1 block">
                                <Label htmlFor="relationship" value="Relationship" />
                            </div>
                            <div>
                                <select
                                    {...register('relationship', {
                                        required: false,
                                        disabled: watchRelationship === 'Self',
                                    })}
                                    className="form-control"
                                >
                                    <option value="">Select...</option>
                                    {getAllowedRelationships(person).map((value) => {
                                        const label =
                                            (![
                                                'Self',
                                                'Friend',
                                                'Colleague',
                                                'Contact',
                                                'Other',
                                            ].includes(value)
                                                ? 'My '
                                                : '') + value
                                        return (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-group mt-4">
                        <SubmitButton label="Update" />
                        <CancelButton path="/family" />
                    </div>
                </form>
            )}
        </>
    )
}

const PersonEdit = observer(PersonEditForm)
export default PersonEdit
