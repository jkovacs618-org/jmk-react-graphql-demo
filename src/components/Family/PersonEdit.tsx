import React, { useCallback, useContext, useEffect, useState } from 'react'
import PersonsStore from '@/stores/PersonsStore'
import { observer } from 'mobx-react'
import { Checkbox, Label, Select, TextInput } from 'flowbite-react'
import { useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import Breadcrumbs from '@/components/Layout/Content/Breadcrumbs'
import SubmitButton from '@/components/Shared/SubmitButton'
import CancelButton from '@/components/Shared/CancelButton'
import { Person } from '@/interfaces/interfaces'
import { ApolloError, gql, useLazyQuery, useMutation } from '@apollo/client'

const PersonEditForm: React.FC = () => {
    const [person, setPerson] = useState<Person | null>(null)
    const [isDeceased, setIsDeceased] = useState(false)
    const personsStore = useContext(PersonsStore)
    const { genders, relationships } = personsStore
    const { id } = useParams()
    const navigate = useNavigate()

    const query = gql`
        query GetPerson($externalId: String) {
            person(externalId: $externalId) {
                externalId
                nameFirst
                nameMiddle
                nameLast
                suffix
                gender
                birthDate
                deathDate
                person2Relationship {
                    type
                }
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
                        if (typeof data.person !== 'undefined' && data.person) {
                            setPerson({
                                ...data.person,
                                relationship: data.person.person2Relationship
                                    ? data.person.person2Relationship.type
                                    : '',
                            })
                            setIsDeceased(data.person.deathDate && data.person.deathDate !== '')
                        } else {
                            navigate('/persons')
                        }
                    },
                })
            } catch (error) {
                console.error(error)
            }
        },
        [executeLoad, navigate]
    )

    useEffect(() => {
        // console.debug('PersonEditForm.useEffect');
        loadModelAsync(id as string)
        return () => {
            // console.debug('PersonEditForm cleanup');
        }
    }, [id, loadModelAsync])

    const getAllowedRelationships = (person: Person) => {
        let allowedRelationships = []
        if (person?.relationship === 'Self') {
            allowedRelationships = ['Self']
        } else {
            allowedRelationships = relationships.filter((value) => value !== 'Self')
        }
        return allowedRelationships
    }

    const updateModelQuery = gql`
        mutation UpdatePersonMutation($externalId: String!, $person: PersonInput!) {
            updatePerson(externalId: $externalId, person: $person) {
                externalId
                nameFirst
                nameMiddle
                nameLast
                gender
                birthDate
                deathDate
                updatedAt
                person2Relationship {
                    type
                }
            }
        }
    `

    const [executeUpdate] = useMutation(updateModelQuery, {
        variables: {
            externalId: id as string,
            person: {
                nameFirst: person?.nameFirst,
                nameMiddle: person?.nameMiddle,
                nameLast: person?.nameLast,
                gender: person?.gender,
                birthDate: person?.birthDate ? new Date(person?.birthDate) : null,
                deathDate: isDeceased && person?.deathDate ? new Date(person?.deathDate) : null,
                relationship: person?.relationship,
            },
        },
        onError: (error: ApolloError) => {
            console.error('Person Update Failed: error: ', error)
        },
        onCompleted: (data) => {
            console.debug('Person Updated: data:', data)
            navigate('/family')
        },
    })

    const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        executeUpdate()
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

            {loading && <div>Loading...</div>}

            {error && <div className="hidden">Error: ${error.message}</div>}

            {data && person && (
                <form
                    onSubmit={(e) => {
                        submitForm(e)
                    }}
                >
                    <div className="form-group">
                        <div className="mb-2">
                            <div className="mb-1 block">
                                <Label htmlFor="nameFirst" value="First Name *" />
                            </div>
                            <TextInput
                                className="form-control"
                                name="nameFirst"
                                type="text"
                                value={person?.nameFirst ?? ''}
                                placeholder=""
                                onChange={(e) => {
                                    setPerson({ ...person, nameFirst: e.target.value } as Person)
                                }}
                                sizing="sm"
                                required
                            />
                        </div>

                        <div className="mb-2">
                            <div className="mb-1 block">
                                <Label htmlFor="nameMiddle" value="Middle Name" />
                            </div>
                            <TextInput
                                className="form-control"
                                name="nameMiddle"
                                type="text"
                                value={person?.nameMiddle ?? ''}
                                placeholder=""
                                onChange={(e) => {
                                    setPerson({ ...person, nameMiddle: e.target.value } as Person)
                                }}
                                sizing="sm"
                            />
                        </div>

                        <div className="mb-2">
                            <div className="mb-1 block">
                                <Label htmlFor="nameLast" value="Last Name *" />
                            </div>
                            <TextInput
                                className="form-control"
                                name="nameLast"
                                type="text"
                                value={person?.nameLast ?? ''}
                                placeholder=""
                                onChange={(e) => {
                                    setPerson({ ...person, nameLast: e.target.value } as Person)
                                }}
                                sizing="sm"
                                required
                            />
                        </div>

                        <div className="mb-2">
                            <div className="mb-1 block">
                                <Label htmlFor="gender" value="Gender" />
                            </div>
                            <Select
                                className="form-control"
                                name="gender"
                                value={person?.gender ?? ''}
                                onChange={(e) => {
                                    setPerson({ ...person, gender: e.target.value } as Person)
                                }}
                                sizing="sm"
                            >
                                <option value="">Select...</option>
                                {genders.map((value) => {
                                    return (
                                        <option key={value} value={value}>
                                            {value}
                                        </option>
                                    )
                                })}
                            </Select>
                        </div>

                        <div className="mb-2">
                            <div className="mb-1 block">
                                <Label htmlFor="birthDate" value="Date of Birth" />
                            </div>
                            <TextInput
                                className="form-control"
                                name="birthDate"
                                type="date"
                                value={
                                    person?.birthDate
                                        ? dayjs(person.birthDate).format('YYYY-MM-DD')
                                        : ''
                                }
                                placeholder=""
                                onChange={(e) => {
                                    setPerson({ ...person, birthDate: e.target.value } as Person)
                                }}
                                sizing="sm"
                            />
                        </div>

                        <div className="mb-2">
                            <Checkbox
                                className="form-control mr-2"
                                id="isDeceasedEdit"
                                name="isDeceased"
                                checked={isDeceased}
                                onChange={(e) => setIsDeceased(e.target.checked)}
                            />
                            <Label htmlFor="isDeceasedEdit" value="Deceased?" />
                        </div>

                        {isDeceased ? (
                            <div className="mb-2">
                                <div className="mb-1 block">
                                    <Label htmlFor="deathDate" value="Date of Death" />
                                </div>
                                <TextInput
                                    className="form-control"
                                    name="deathDate"
                                    type="date"
                                    value={
                                        person?.deathDate
                                            ? dayjs(person.deathDate).format('YYYY-MM-DD')
                                            : ''
                                    }
                                    placeholder=""
                                    onChange={(e) => {
                                        setPerson({
                                            ...person,
                                            deathDate: e.target.value,
                                        } as Person)
                                    }}
                                    sizing="sm"
                                />
                            </div>
                        ) : (
                            ''
                        )}

                        <div className="mb-2">
                            <div className="mb-1 block">
                                <Label htmlFor="relationship" value="Relationship" />
                            </div>
                            <Select
                                className="form-control"
                                name="relationship"
                                value={person?.relationship ?? ''}
                                onChange={(e) => {
                                    setPerson({ ...person, relationship: e.target.value } as Person)
                                }}
                                disabled={person?.relationship === 'Self'}
                                sizing="sm"
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
                            </Select>
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
