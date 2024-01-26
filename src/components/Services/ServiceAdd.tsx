import React, { useCallback, useContext, useEffect, useState } from 'react'
import ServicesStore from '@/stores/ServicesStore'
import { observer } from 'mobx-react'
import { Label, Select, TextInput } from 'flowbite-react'
import { useNavigate } from 'react-router-dom'
import Breadcrumbs from '@/components/Layout/Content/Breadcrumbs'
import SubmitButton from '@/components/Shared/SubmitButton'
import CancelButton from '@/components/Shared/CancelButton'
import { ServiceAccount } from '@/interfaces/interfaces'
import { ApolloError, gql, useLazyQuery, useMutation } from '@apollo/client'

const ServiceAddForm: React.FC = () => {
    const [serviceAccount, setServiceAccount] = useState<ServiceAccount | null>(null)
    const [newOrganizationNameError, setNewOrganizationNameError] = React.useState('')
    const servicesStore = useContext(ServicesStore)
    const { organizations, serviceTypes } = servicesStore
    const navigate = useNavigate()

    const getRecordsQuery = gql`
        query GetRecords {
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
    const [executeLoad] = useLazyQuery(getRecordsQuery)

    const loadRecordsAsync = useCallback(async () => {
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
        // On component load, Reset the inputs:
        loadRecordsAsync()
        setServiceAccount({
            organizationExternalId: '',
            serviceTypeExternalId: '',
            description: '',
            accountNumber: '',
            startDate: '',
            endDate: '',
        } as ServiceAccount)
        return () => {
            // console.log('ServiceAddForm cleanup');
        }
    }, [loadRecordsAsync])

    const createModelQuery = gql`
        mutation CreateServiceAccountMutation($serviceAccount: ServiceAccountInput!) {
            createServiceAccount(serviceAccount: $serviceAccount) {
                externalId
                description
                accountNumber
                startDate
                endDate
                createdAt
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

    const [executeCreate] = useMutation(createModelQuery, {
        variables: {
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
            console.error('ServiceAccount Create Failed: error: ', error)
            navigate('/services')
        },
        onCompleted: (data) => {
            console.debug('ServiceAccount Created: data:', data)
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
        executeCreate()
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

            <form
                onSubmit={(e) => {
                    submitForm(e)
                }}
            >
                <div className="form-group">
                    <div className="mb-2">
                        <div className="mb-1 block">
                            <Label htmlFor="organization" value="Organization *" />
                        </div>
                        <Select
                            className="form-control"
                            name="organizationExternalId"
                            value={serviceAccount?.organizationExternalId ?? ''}
                            onChange={(e) => {
                                setServiceAccount({
                                    ...serviceAccount,
                                    organizationExternalId: e.target.value,
                                } as ServiceAccount)
                            }}
                            sizing="sm"
                            required
                            autoFocus
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

                    {serviceAccount && serviceAccount.organizationExternalId === 'NEW' && (
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
                                <p className="text-sm text-red-600">{newOrganizationNameError}</p>
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
                            value={serviceAccount?.startDate ?? ''}
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
                            value={serviceAccount?.endDate ?? ''}
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
                    <SubmitButton label="Add Account" />
                    <CancelButton path="/services" />
                </div>
            </form>
        </>
    )
}

const ServiceAdd = observer(ServiceAddForm)
export default ServiceAdd
