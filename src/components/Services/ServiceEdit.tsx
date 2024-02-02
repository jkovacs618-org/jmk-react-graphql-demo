import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useLazyQuery, useMutation } from '@apollo/client'
import { Label } from 'flowbite-react'
import { observer } from 'mobx-react'
import dayjs from 'dayjs'
import ServicesStore from '@/stores/ServicesStore'
import Breadcrumbs from '@/components/Layout/Content/Breadcrumbs'
import SubmitButton from '@/components/Shared/SubmitButton'
import CancelButton from '@/components/Shared/CancelButton'
import {
    getServiceAccountQuery,
    updateServiceAccountQuery,
} from '@/services/ServiceAccountsService'
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

const ServiceEditForm: React.FC = () => {
    const [formError, setFormError] = useState('')
    const servicesStore = useContext(ServicesStore)
    const { id } = useParams()
    const navigate = useNavigate()

    const {
        register,
        formState: { errors },
        handleSubmit,
        watch,
        reset,
    } = useForm<FormValues>()
    // console.debug('useForm errors: ', errors)

    const watchOrganizationExternalId = watch('organizationExternalId')

    const [executeLoad, { data, loading, error }] = useLazyQuery(getServiceAccountQuery)

    const loadModelAsync = useCallback(
        async (externalId: string) => {
            try {
                executeLoad({
                    variables: {
                        externalId: externalId,
                    },
                    onCompleted: (data) => {
                        // console.log('loadModelAsync.onCompleted: data: ', data);
                        if (typeof data.serviceAccount !== 'undefined' && data.serviceAccount) {
                            servicesStore.setOrganizations(data.organizations)
                            servicesStore.setServiceTypes(data.serviceTypes)

                            const serviceAccount = data.serviceAccount
                            reset({
                                organizationExternalId: serviceAccount.organization
                                    ? serviceAccount.organization.externalId
                                    : null,
                                serviceTypeExternalId: serviceAccount.serviceType
                                    ? serviceAccount.serviceType.externalId
                                    : null,
                                description: serviceAccount.description,
                                accountNumber: serviceAccount.accountNumber,
                                startDate: serviceAccount.startDate
                                    ? dayjs(serviceAccount.startDate).format('YYYY-MM-DD')
                                    : '',
                                endDate: serviceAccount.endDate
                                    ? dayjs(serviceAccount.endDate).format('YYYY-MM-DD')
                                    : '',
                            })
                        } else {
                            navigate('/services')
                        }
                    },
                })
            } catch (error) {
                console.error(error)
            }
        },
        [executeLoad, navigate, servicesStore, reset]
    )

    useEffect(() => {
        loadModelAsync(id as string)
        return () => {
            // console.debug('ServiceEditForm cleanup');
        }
    }, [id, loadModelAsync])

    const [executeUpdate] = useMutation(updateServiceAccountQuery, {
        onError: () => {
            setFormError('Failed to update the account. Please try again later.')
        },
        onCompleted: (data) => {
            console.debug('Service Updated: data:', data)
            navigate('/services')
        },
    })

    const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
        // console.debug(data)
        executeUpdate({
            variables: {
                externalId: id as string,
                serviceAccount: {
                    organizationExternalId: data.organizationExternalId,
                    newOrganizationName: data.newOrganizationName,
                    serviceTypeExternalId: data.serviceTypeExternalId,
                    description: data.description,
                    accountNumber: data.accountNumber,
                    startDate: data.startDate ? new Date(data.startDate + ' 12:00:00') : null,
                    endDate: data.endDate ? new Date(data.endDate + ' 12:00:00') : null,
                },
            },
        })
    }

    const breadcrumbLinks = [
        { path: '/', label: 'Dashboard' },
        { path: '/services', label: 'Accounts' },
        { path: '', label: 'Edit' },
    ]

    return (
        <>
            <Breadcrumbs links={breadcrumbLinks} />

            <h2 className="text-3xl text-slate-600 font-bold">Edit Account</h2>

            {formError && <AlertBox message={formError} onClose={() => setFormError('')} />}

            {loading && <div>Loading...</div>}

            {error && <div className="hidden">Error: ${error.message}</div>}

            {data && (
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
                        <SubmitButton label="Update" />
                        <CancelButton path="/services" />
                    </div>
                </form>
            )}
        </>
    )
}

const ServiceEdit = observer(ServiceEditForm)
export default ServiceEdit
