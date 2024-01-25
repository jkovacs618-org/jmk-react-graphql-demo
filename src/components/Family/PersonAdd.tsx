import React, { useContext, useEffect, useState } from 'react'
import PersonsStore from '../../stores/PersonsStore'
import { observer } from 'mobx-react'
import { Checkbox, Label, Select, TextInput } from 'flowbite-react'
import { useNavigate } from 'react-router-dom'
import Breadcrumbs from '../Layout/Content/Breadcrumbs'
import SubmitButton from '../Shared/SubmitButton'
import CancelButton from '../Shared/CancelButton'
import { Person } from '../../interfaces/interfaces'
import { ApolloError, gql, useMutation } from '@apollo/client'

const PersonAddForm: React.FC = () => {
    const [person, setPerson] = useState<Person | null>(null)
    const [isDeceased, setIsDeceased] = useState(false)
    const personsStore = useContext(PersonsStore)
    const { genders, relationships } = personsStore
    const navigate = useNavigate()

    useEffect(() => {
        // On component load, Reset the inputs:
        setPerson({
            nameFirst: '',
            nameMiddle: '',
            nameLast: '',
            gender: '',
            birthDate: '',
            deathDate: '',
            relationship: '',
        } as Person)
        setIsDeceased(false)
        return () => {
            // console.log('PersonAddForm cleanup');
        }
    }, [])

    const createModelQuery = gql`
        mutation CreatePersonMutation($person: PersonInput!) {
            createPerson(person: $person) {
                externalId
                nameFirst
                nameMiddle
                nameLast
                gender
                birthDate
                deathDate
                createdAt
            }
        }
    `

    const [executeCreate] = useMutation(createModelQuery, {
        variables: {
            person: {
                nameFirst: person?.nameFirst,
                nameMiddle: person?.nameMiddle,
                nameLast: person?.nameLast,
                gender: person?.gender,
                birthDate: person?.birthDate,
                deathDate: person?.deathDate,
                relationship: person?.relationship,
            },
        },
        onError: (error: ApolloError) => {
            console.error('Person Create Failed: error: ', error)
            navigate('/family')
        },
        onCompleted: (data) => {
            console.debug('Person Created: data:', data)
            navigate('/family')
        },
    })

    const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        executeCreate()
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
                            autoFocus
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
                            value={person?.birthDate ?? ''}
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
                            id="isDeceasedAdd"
                            name="isDeceased"
                            checked={isDeceased}
                            onChange={(e) => setIsDeceased(e.target.checked)}
                        />
                        <Label htmlFor="isDeceasedAdd" value="Deceased?" />
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
                                value={person?.deathDate ?? ''}
                                placeholder=""
                                onChange={(e) => {
                                    setPerson({ ...person, deathDate: e.target.value } as Person)
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
                            {relationships
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
                        </Select>
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
