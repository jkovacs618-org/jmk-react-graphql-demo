import React, { useContext, useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import { observer } from 'mobx-react'
import { Label } from 'flowbite-react'
import { useNavigate } from 'react-router-dom'
import Breadcrumbs from '@/components/Layout/Content/Breadcrumbs'
import SubmitButton from '@/components/Shared/SubmitButton'
import CancelButton from '@/components/Shared/CancelButton'
import PersonsStore from '@/stores/PersonsStore'
import { createPersonQuery } from '@/services/PersonsService'
import AlertBox from '@/components/Shared/AlertBox'

interface FormValues {
    nameFirst: string
    nameMiddle: string
    nameLast: string
    gender: string
    birthDate: string
    deathDate: string
    relationship: string
}

const PersonAddForm: React.FC = () => {
    const [isDeceased, setIsDeceased] = useState(false)
    const [formError, setFormError] = useState('')
    const personsStore = useContext(PersonsStore)
    const navigate = useNavigate()

    const {
        register,
        formState: { errors },
        handleSubmit,
        setFocus,
    } = useForm<FormValues>()
    // console.debug('useForm errors: ', errors)

    useEffect(() => {
        setFocus('nameFirst')
        setIsDeceased(false)
        return () => {
            // console.log('PersonAddForm cleanup');
        }
    }, [setFocus])

    const [executeCreate] = useMutation(createPersonQuery, {
        onError: () => {
            setFormError('Failed to add the person. Please try again later.')
        },
        onCompleted: (data) => {
            console.debug('Person created: data:', data)
            navigate('/family')
        },
    })

    const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
        // console.debug(data)
        await executeCreate({
            variables: {
                person: {
                    nameFirst: data.nameFirst,
                    nameMiddle: data.nameMiddle,
                    nameLast: data.nameLast,
                    gender: data.gender,
                    birthDate: data.birthDate,
                    deathDate: data.deathDate,
                    relationship: data.relationship,
                },
            },
        })
    }

    const breadcrumbLinks = [
        { path: '/', label: 'Dashboard' },
        { path: '/family', label: 'Family' },
        { path: '', label: 'New Person' },
    ]

    return (
        <>
            <Breadcrumbs links={breadcrumbLinks} />

            <h2 className="text-3xl text-slate-600 font-bold">New Person</h2>

            {formError && <AlertBox message={formError} onClose={() => setFormError('')} />}

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
                            id="isDeceasedAdd"
                            name="isDeceased"
                            checked={isDeceased}
                            onChange={(e) => setIsDeceased(e.target.checked)}
                            className="mr-2"
                        />
                        <Label htmlFor="isDeceasedAdd" value="Deceased?" />
                    </div>

                    {isDeceased ? (
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
                                {...register('relationship', { required: false })}
                                className="form-control"
                            >
                                <option value="">Select...</option>
                                {personsStore.relationships
                                    .filter((value) => value !== 'Self')
                                    .map((value) => {
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
                    <SubmitButton label="Add Person" />
                    <CancelButton path="/family" />
                </div>
            </form>
        </>
    )
}

const PersonAdd = observer(PersonAddForm)
export default PersonAdd
