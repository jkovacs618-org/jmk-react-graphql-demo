import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useLazyQuery, useMutation } from '@apollo/client'
import { observer } from 'mobx-react'
import { Label } from 'flowbite-react'
import { useNavigate } from 'react-router-dom'
import Breadcrumbs from '@/components/Layout/Content/Breadcrumbs'
import SubmitButton from '@/components/Shared/SubmitButton'
import CancelButton from '@/components/Shared/CancelButton'
import { createServiceAccountQuery, getReferencesQuery } from '@/services/ServiceAccountsService'
import ServicesStore from '@/stores/ServicesStore'
import AlertBox from '@/components/Shared/AlertBox'

interface FormValues {
    organizationExternalId: string
    serviceTypeExternalId: string
    description: string
    accountNumber: string
    startDate: string
    endDate: string
    newOrganizationName: string
}

const ServiceAddForm: React.FC = () => {
    const [formError, setFormError] = useState('')
    const servicesStore = useContext(ServicesStore)
    const navigate = useNavigate()

    const {
        register,
        formState: { errors },
        handleSubmit,
        watch,
    } = useForm<FormValues>()
    // console.debug('useForm errors: ', errors)

    const watchOrganizationExternalId = watch('organizationExternalId')

    const [executeLoad] = useLazyQuery(getReferencesQuery)

    const loadReferencesAsync = useCallback(async () => {
        try {
            executeLoad({
                variables: {},
                onCompleted: (data) => {
                    if (typeof data.organizations !== 'undefined' && data.organizations) {
                        servicesStore.setOrganizations(data.organizations)
                    }
                    if (typeof data.serviceTypes !== 'undefined' && data.serviceTypes) {
                        servicesStore.setServiceTypes(data.serviceTypes)
                    }
                },
            })
        } catch (error) {
            console.error(error)
        }
    }, [executeLoad, servicesStore])

    useEffect(() => {
        loadReferencesAsync()
        return () => {
            // console.log('ServiceAddForm cleanup');
        }
    }, [loadReferencesAsync])

    const [executeCreate] = useMutation(createServiceAccountQuery, {
        onError: () => {
            setFormError('Failed to add the account. Please try again later.')
        },
        onCompleted: (data) => {
            console.debug('ServiceAccount created: data:', data)
            navigate('/services')
        },
    })

    const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
        // console.debug(data)
        executeCreate({
            variables: {
                serviceAccount: {
                    organizationExternalId: data.organizationExternalId,
                    newOrganizationName: data.newOrganizationName,
                    serviceTypeExternalId: data.serviceTypeExternalId,
                    description: data.description,
                    accountNumber: data.accountNumber,
                    startDate: data.startDate,
                    endDate: data.endDate,
                },
            },
        })
    }

    const breadcrumbLinks = [
        { path: '/', label: 'Dashboard' },
        { path: '/services', label: 'Accounts' },
        { path: '', label: 'New' },
    ]

    return (
        <>
            <Breadcrumbs links={breadcrumbLinks} />

            <h2 className="text-3xl text-slate-600 font-bold">New Account</h2>

            {formError && <AlertBox message={formError} onClose={() => setFormError('')} />}

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <div className="mb-2">
                        <div className="mb-1 block">
                            <Label htmlFor="organization" value="Organization *" />
                        </div>
                        <div>
                            <select
                                {...register('organizationExternalId', { required: true })}
                                className="form-control"
                            >
                                <option value="">Select...</option>
                                {servicesStore.organizations.map((organization) => {
                                    return (
                                        <option
                                            key={organization.externalId}
                                            value={organization.externalId}
                                        >
                                            {organization.name}
                                        </option>
                                    )
                                })}
                                <option key="NEW" value="NEW">
                                    Add New
                                </option>
                            </select>
                            {errors.organizationExternalId?.type === 'required' && (
                                <span role="alert" className="text-red-500 text-sm font-bold">
                                    Please select an organization
                                </span>
                            )}
                        </div>
                    </div>

                    {watchOrganizationExternalId === 'NEW' && (
                        <div className="mb-2">
                            <div className="mb-1 block">
                                <Label
                                    htmlFor="newOrganizationName"
                                    value="New Organization Name *"
                                />
                            </div>
                            <input
                                {...register('newOrganizationName', {
                                    validate: (value, formValues) => {
                                        if (formValues.organizationExternalId === 'NEW') {
                                            return value !== ''
                                        }
                                        return false
                                    },
                                })}
                                defaultValue=""
                                className="form-control"
                            />
                            {errors.newOrganizationName?.type === 'validate' && (
                                <span role="alert" className="text-red-500 text-sm font-bold">
                                    Please enter an organization name
                                </span>
                            )}
                        </div>
                    )}

                    <div className="mb-2">
                        <div className="mb-1 block">
                            <Label htmlFor="description" value="Description" />
                        </div>
                        <div>
                            <input
                                {...register('description', { maxLength: 250 })}
                                defaultValue=""
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div className="mb-2">
                        <div className="mb-1 block">
                            <Label htmlFor="serviceType" value="Service Type" />
                        </div>
                        <div>
                            <select
                                {...register('serviceTypeExternalId', { required: false })}
                                className="form-control"
                            >
                                <option value="">Select...</option>
                                {servicesStore.serviceTypes.map((serviceType) => {
                                    return (
                                        <option
                                            key={serviceType.externalId}
                                            value={serviceType.externalId}
                                        >
                                            {serviceType.name}
                                        </option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>

                    <div className="mb-2">
                        <div className="mb-1 block">
                            <Label htmlFor="accountNumber" value="Account Number" />
                        </div>
                        <div>
                            <input
                                {...register('accountNumber', { maxLength: 100 })}
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
                </div>

                <div className="form-group mt-4">
                    <SubmitButton label="Add Account" />
                    <CancelButton path="/services" />
                </div>
            </form>
        </>
    )
}

const ServiceAdd = observer(ServiceAddForm)
export default ServiceAdd
