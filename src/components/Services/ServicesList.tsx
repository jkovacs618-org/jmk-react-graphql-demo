import { useCallback, useEffect, useRef, useState } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import { observer } from 'mobx-react'
import { Table } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dayjs from 'dayjs'
import Breadcrumbs from '@/components/Layout/Content/Breadcrumbs'
import AlertBox from '@/components/Shared/AlertBox'
import { ServiceAccount } from '@/interfaces/interfaces'
import {
    getServiceAccountsQuery,
    deleteServiceAccountQuery,
} from '@/services/ServiceAccountsService'

const ServicesList: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [deleteError, setDeleteError] = useState('')
    const searchInputRef = useRef<HTMLInputElement>(null)

    const [executeSearch, { data, loading, error }] = useLazyQuery(getServiceAccountsQuery)

    const loadListAsync = useCallback(async () => {
        executeSearch()
    }, [executeSearch])

    useEffect(() => {
        loadListAsync()
        return () => {
            //console.debug('ServicesList cleanup');
        }
    }, [loadListAsync])

    const searchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setDeleteError('')
        executeSearch({
            variables: {
                filter: searchQuery,
            },
        })
    }

    const searchClear = () => {
        setSearchQuery('')
        setDeleteError('')
        executeSearch()
        if (searchInputRef.current) {
            searchInputRef.current.focus()
        }
    }

    const maskAccountNumber = (str: string | null) => {
        if (str) {
            const numChars = Math.min(4, str.length)
            return 'X'.repeat(str.length - numChars) + str.slice(numChars * -1)
        }
        return '-'
    }

    const handleClickDelete = (e: React.MouseEvent, serviceAccount: ServiceAccount) => {
        e.preventDefault()
        if (
            confirm(
                `Are you sure you want to remove the account${serviceAccount.organization ? ' for ' + serviceAccount.organization.name : ''}?`
            )
        ) {
            executeDelete({
                variables: {
                    externalId: serviceAccount.externalId!,
                },
            })
        }
    }

    const [executeDelete] = useMutation(deleteServiceAccountQuery, {
        onError: () => {
            // console.error('Service Delete Failed: error: ', error)
            setDeleteError('Failed to remove the account. Please try again later.')
        },
        onCompleted: (data) => {
            console.debug('Service Deleted: data:', data)
            executeSearch({
                variables: {
                    filter: searchQuery,
                },
            })
        },
    })

    const breadcrumbLinks = [
        { path: '/', label: 'Dashboard' },
        { path: '/services', label: 'Accounts' },
    ]

    return (
        <>
            {deleteError && <AlertBox message={deleteError} onClose={() => setDeleteError('')} />}

            <Breadcrumbs links={breadcrumbLinks} />

            <div className="flex gap-4">
                <div>
                    <h2 className="text-3xl text-slate-600 font-bold">Service Accounts</h2>
                </div>
                <div className="ml-auto">
                    <Link to="/services/new" className="text-white">
                        <button className="rounded-md bg-sky-600 py-2 px-3 text-sm font-semibold text-white hover:text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600">
                            New Account
                        </button>
                    </Link>
                </div>
            </div>

            <div className="mt-2">
                <form onSubmit={searchSubmit}>
                    <div className="relative inline-block">
                        <input
                            ref={searchInputRef}
                            type="search"
                            value={searchQuery}
                            placeholder="Search..."
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="text-xs mr-2 border-slate-300 rounded"
                        />
                        <FontAwesomeIcon
                            icon="times"
                            onClick={searchClear}
                            className={
                                'absolute right-4 text-slate-400 top-2 cursor-pointer ' +
                                (searchQuery === '' ? 'hidden' : '')
                            }
                        />
                    </div>
                    <div className="inline-block">
                        <button
                            type="submit"
                            className="py-1 px-3 bg-slate-300 hover:bg-slate-200 text-slate-600 text-sm"
                        >
                            Search
                        </button>
                    </div>
                </form>
            </div>

            <div>
                <div className="d-inline col-4 text-sm mt-2">
                    Total items: &nbsp;
                    <span className="badge badge-info">
                        {data && data.servicesList ? data.servicesList.count : 0}
                    </span>
                </div>
            </div>

            {loading && <div>Loading...</div>}

            {error && <div>Error: ${error.message}</div>}

            {data && (
                <div className="mt-3 mb-10">
                    <div className="overflow-x-auto">
                        <Table striped className="text-left">
                            <Table.Head>
                                <Table.HeadCell className="py-3">Organization</Table.HeadCell>
                                <Table.HeadCell>Description</Table.HeadCell>
                                <Table.HeadCell>Service Type</Table.HeadCell>
                                <Table.HeadCell>Account Number</Table.HeadCell>
                                <Table.HeadCell>Start</Table.HeadCell>
                                <Table.HeadCell>End</Table.HeadCell>
                                <Table.HeadCell>
                                    <span className="sr-only">Actions</span>
                                </Table.HeadCell>
                            </Table.Head>

                            <Table.Body className="divide-y">
                                {data.servicesList.serviceAccounts.map(
                                    (serviceAccount: ServiceAccount) => (
                                        <Table.Row
                                            key={serviceAccount.externalId}
                                            className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                        >
                                            <Table.Cell className="whitespace-nowrap text-gray-900 dark:text-white py-2">
                                                <Link
                                                    to={`/services/edit/${serviceAccount.externalId}`}
                                                >
                                                    <span className="font-medium">
                                                        {serviceAccount.organization
                                                            ? serviceAccount.organization.name
                                                            : '-'}
                                                        <br />
                                                    </span>
                                                </Link>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <span className="text-xs">
                                                    {serviceAccount.description
                                                        ? serviceAccount.description
                                                        : '-'}
                                                </span>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <span className="text-xs">
                                                    {serviceAccount.serviceType
                                                        ? serviceAccount.serviceType.name
                                                        : '-'}
                                                </span>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {serviceAccount.accountNumber
                                                    ? maskAccountNumber(
                                                          serviceAccount.accountNumber
                                                      )
                                                    : '-'}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {serviceAccount.startDate
                                                    ? dayjs(serviceAccount.startDate).format(
                                                          'M/D/YY'
                                                      )
                                                    : '-'}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {serviceAccount.endDate
                                                    ? dayjs(serviceAccount.endDate).format('M/D/YY')
                                                    : '-'}
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Link
                                                    to={`/services/edit/${serviceAccount.externalId}`}
                                                >
                                                    <FontAwesomeIcon
                                                        icon="pen-to-square"
                                                        className="text-gray-400 text-lg mr-3"
                                                        title="Edit Account"
                                                    />
                                                </Link>
                                                <Link
                                                    to="#"
                                                    onClick={(e) =>
                                                        handleClickDelete(e, serviceAccount)
                                                    }
                                                >
                                                    <FontAwesomeIcon
                                                        icon="trash-can"
                                                        className="text-gray-400 text-lg"
                                                        title="Remove Account"
                                                    />
                                                </Link>
                                            </Table.Cell>
                                        </Table.Row>
                                    )
                                )}
                            </Table.Body>
                        </Table>
                    </div>
                </div>
            )}
        </>
    )
}

const ServicesListObserver = observer(ServicesList)

export default ServicesListObserver
