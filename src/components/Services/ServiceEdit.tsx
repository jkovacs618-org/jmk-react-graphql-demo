import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Label, Select, TextInput } from 'flowbite-react'
import { observer } from 'mobx-react'
import dayjs from 'dayjs'
import ServicesStore from '@/stores/ServicesStore'
import Breadcrumbs from '@/components/Layout/Content/Breadcrumbs'
import SubmitButton from '@/components/Shared/SubmitButton'
import CancelButton from '@/components/Shared/CancelButton'
import { ServiceAccount } from '@/interfaces/interfaces'
import { ApolloError, gql, useLazyQuery, useMutation } from '@apollo/client'

const ServiceEditForm: React.FC = () => {
    const [serviceAccount, setServiceAccount] = useState<ServiceAccount | null>(null)
    const [newOrganizationNameError, setNewOrganizationNameError] = React.useState('')
    const servicesStore = useContext(ServicesStore)
    const { organizations, serviceTypes } = servicesStore
    const { id } = useParams()
    const navigate = useNavigate()

    const query = gql`
        query GetServiceAccount($externalId: String) {
            serviceAccount(externalId: $externalId) {
                externalId
                description
                accountNumber
                startDate
                endDate
                website
                username
                email
                organization {
                    externalId
                    name
                }
                serviceType {
                    externalId
                    name
                }
            }
            organizations {
                externalId
                name
            }
            serviceTypes {
                externalId
                name
            }
        }
    `
    const [executeLoad, { data, loading, error }] = useLazyQuery(query)

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
                            setServiceAccount({
                                ...data.serviceAccount,
                                organizationExternalId: data.serviceAccount.organization
                                    ? data.serviceAccount.organization.externalId
                                    : null,
                                serviceTypeExternalId: data.serviceAccount.serviceType
                                    ? data.serviceAccount.serviceType.externalId
                                    : null,
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
        [executeLoad, navigate, servicesStore]
    )

    useEffect(() => {
        // console.debug('ServiceEditForm.useEffect');
        loadModelAsync(id as string)
        return () => {
            // console.debug('ServiceEditForm cleanup');
        }
    }, [id, loadModelAsync])

    const updateModelQuery = gql`
        mutation UpdateServiceAccountMutation(
            $externalId: String!
            $serviceAccount: ServiceAccountInput!
        ) {
            updateServiceAccount(externalId: $externalId, serviceAccount: $serviceAccount) {
                externalId
                description
                accountNumber
                startDate
                endDate
                updatedAt
                organization {
                    externalId
                    name
                }
                serviceType {
                    externalId
                    name
                }
            }
        }
    `

    const [executeUpdate] = useMutation(updateModelQuery, {
        variables: {
            externalId: id as string,
            serviceAccount: {
                organizationExternalId: serviceAccount?.organizationExternalId,
                newOrganizationName: serviceAccount?.newOrganizationName,
                serviceTypeExternalId: serviceAccount?.serviceTypeExternalId,
                description: serviceAccount?.description,
                accountNumber: serviceAccount?.accountNumber,
                startDate: serviceAccount?.startDate,
                endDate: serviceAccount?.endDate,
            },
        },
        onError: (error: ApolloError) => {
            console.error('Service Update Failed: error: ', error)
        },
        onCompleted: (data) => {
            console.debug('Service Updated: data:', data)
            navigate('/services')
        },
    })

    const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (
            serviceAccount?.organizationExternalId === 'NEW' &&
            serviceAccount.newOrganizationName === ''
        ) {
            setNewOrganizationNameError('Please enter a name')
        } else {
            setNewOrganizationNameError('')
        }
        executeUpdate()
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

            {loading && <div>Loading...</div>}

            {error && <div className="hidden">Error: ${error.message}</div>}

            {data && serviceAccount && (
                <form onSubmit={(e) => submitForm(e)}>
                    <div className="form-group">
                        <div className="mb-2">
                            <div className="mb-1 block">
                                <Label htmlFor="organization" value="Organization *" />
                            </div>
                            <Select
                                className="form-control"
                                name="organizationExternalId"
                                value={serviceAccount.organizationExternalId ?? ''}
                                onChange={(e) => {
                                    setServiceAccount({
                                        ...serviceAccount,
                                        organizationExternalId: e.target.value,
                                    } as ServiceAccount)
                                }}
                                sizing="sm"
                                required
                            >
                                <option value="">Select...</option>
                                {organizations.map((organization) => {
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
                            </Select>
                        </div>

                        {serviceAccount.organizationExternalId === 'NEW' && (
                            <div className="mb-2">
                                <div className="mb-1 block">
                                    <Label
                                        htmlFor="newOrganizationName"
                                        value="New Organization Name"
                                    />
                                </div>
                                <TextInput
                                    className="form-control"
                                    name="newOrganizationName"
                                    type="text"
                                    value={serviceAccount.newOrganizationName ?? ''}
                                    placeholder=""
                                    onChange={(e) => {
                                        setServiceAccount({
                                            ...serviceAccount,
                                            newOrganizationName: e.target.value,
                                        } as ServiceAccount)
                                    }}
                                    sizing="sm"
                                    required
                                />
                                {newOrganizationNameError && (
                                    <p className="text-sm text-red-600">
                                        {newOrganizationNameError}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="mb-2">
                            <div className="mb-1 block">
                                <Label htmlFor="description" value="Description" />
                            </div>
                            <TextInput
                                className="form-control"
                                name="description"
                                type="text"
                                value={serviceAccount?.description ?? ''}
                                placeholder=""
                                onChange={(e) => {
                                    setServiceAccount({
                                        ...serviceAccount,
                                        description: e.target.value,
                                    } as ServiceAccount)
                                }}
                                sizing="sm"
                            />
                        </div>

                        <div className="mb-2">
                            <div className="mb-1 block">
                                <Label htmlFor="serviceType" value="Service Type" />
                            </div>
                            <Select
                                className="form-control"
                                name="serviceTypeExternalId"
                                value={serviceAccount?.serviceTypeExternalId ?? ''}
                                onChange={(e) => {
                                    setServiceAccount({
                                        ...serviceAccount,
                                        serviceTypeExternalId: e.target.value,
                                    } as ServiceAccount)
                                }}
                                sizing="sm"
                            >
                                <option value="">Select...</option>
                                {serviceTypes.map((serviceType) => {
                                    return (
                                        <option
                                            key={serviceType.externalId}
                                            value={serviceType.externalId}
                                        >
                                            {serviceType.name}
                                        </option>
                                    )
                                })}
                            </Select>
                        </div>

                        <div className="mb-2">
                            <div className="mb-1 block">
                                <Label htmlFor="accountNumber" value="Account Number" />
                            </div>
                            <TextInput
                                className="form-control"
                                name="accountNumber"
                                type="text"
                                value={serviceAccount?.accountNumber ?? ''}
                                placeholder=""
                                onChange={(e) => {
                                    setServiceAccount({
                                        ...serviceAccount,
                                        accountNumber: e.target.value,
                                    } as ServiceAccount)
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
                                    serviceAccount?.startDate
                                        ? dayjs(serviceAccount.startDate).format('YYYY-MM-DD')
                                        : ''
                                }
                                placeholder="Start Date"
                                onChange={(e) => {
                                    setServiceAccount({
                                        ...serviceAccount,
                                        startDate: e.target.value,
                                    } as ServiceAccount)
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
                                    serviceAccount?.endDate
                                        ? dayjs(serviceAccount.endDate).format('YYYY-MM-DD')
                                        : ''
                                }
                                placeholder="End Date"
                                onChange={(e) => {
                                    setServiceAccount({
                                        ...serviceAccount,
                                        endDate: e.target.value,
                                    } as ServiceAccount)
                                }}
                                sizing="sm"
                            />
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
