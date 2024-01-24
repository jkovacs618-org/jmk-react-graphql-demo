import { useCallback, useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import PersonsStore from "../../stores/PersonsStore";
import dayjs from "dayjs";
import Breadcrumbs from "../Layout/Content/Breadcrumbs";
import { ApolloError, gql, useLazyQuery, useMutation } from "@apollo/client";
import { Person } from "../../interfaces/interfaces";
import { useAuth } from "../../contexts/AuthContext";

const PersonsList: React.FC = () => {
    // const personsStore = useContext(PersonsStore);
    const [ searchQuery, setSearchQuery ] = useState('');
    const { authUser } = useAuth();

    const query = gql`
        query GetPersons($filter: String) {
            personsList (filter: $filter) {
                id
                persons {
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
                count
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
    `;
    const [executeSearch, {data, loading, error}] = useLazyQuery(query);

    // Ref: https://blog.logrocket.com/solve-react-useeffect-hook-infinite-loop-patterns/
    const loadListAsync = useCallback(async () => {
        executeSearch();
    }, [executeSearch]);

    useEffect(() => {
        // console.debug('PersonsList.useEffect');
        loadListAsync();
        return ( () => {
            //console.debug('PersonsList cleanup');
        });
    }, [loadListAsync]);

    const searchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        executeSearch({
            variables: {
                filter: searchQuery
            },
        });
    }

    const searchClear = () => {
        setSearchQuery('');
        executeSearch();
        document.getElementById('personsListSearchInput')?.focus();
    }

    const handleClickDelete = (e: React.MouseEvent, personExternalId: string) => {
        e.preventDefault();
        if (personExternalId !== '') {
            if (authUser?.personExternalId == personExternalId) {
                alert('Cannot Remove Self');
            }
            else {
                if(confirm('Are you sure?')) {
                    executeDelete({ variables: { externalId: personExternalId }});
                }
            }
        }
    }

    const deleteModelQuery = gql`
        mutation DeletePersonMutation($externalId: String!) {
            deletePerson(externalId: $externalId) {
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
    `;

    const [executeDelete] = useMutation(deleteModelQuery, {
        variables: {
            // Passed externalId in executeDelete call below.
        },
        onError: (error: ApolloError) => {
            console.error('Person Delete Failed: error: ', error);
        },
        onCompleted: (data) => {
            console.debug('Person Deleted: data:', data)
            executeSearch({
                variables: {
                    filter: searchQuery
                },
            });
        }
    });

    const getRelationship = (person: Person): string => {
        const type = (person.person2Relationship ? person.person2Relationship.type : null);
        const relationship =
            (type === 'Child' ? (
                    person.gender === 'Male' ? 'Son' : 'Daughter'
                ) :
                (type === 'Parent' ? (
                        person.gender === 'Male' ? 'Father' : 'Mother'
                    ) : (
                        type ? type : '-'
                    )
                )
            )
        return relationship;
    }

    const breadcrumbLinks = [
        {path: '/', label: 'Dashboard'},
        {path: '/family', label: 'Family'},
    ];

    return (
        <>
            <Breadcrumbs links={breadcrumbLinks} />

            <div className="flex gap-4">
                <div>
                    <h2 className="text-3xl text-slate-600 font-bold">Family</h2>
                </div>
                <div className="ml-auto">
                    <Link to="/family/person/new" className="text-white">
                        <button className="rounded-md bg-sky-600 py-2 px-3 text-sm font-semibold text-white hover:text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600">
                            New Person
                        </button>
                    </Link>
                </div>
            </div>

            <div className="mt-2">
                <form onSubmit={searchSubmit}>
                    <div className="relative inline-block">
                        <input id="personsListSearchInput" type="search" value={searchQuery} placeholder="Search..." onChange={e => setSearchQuery(e.target.value)}
                            className="text-xs mr-2 border-slate-300 rounded" />
                        <FontAwesomeIcon icon="times" onClick={searchClear}
                            className={"absolute right-4 text-slate-400 top-2 cursor-pointer " + (searchQuery === '' ? 'hidden' : '')} />
                    </div>
                    <div className="inline-block">
                        <button type="submit" className="py-1 px-3 bg-slate-300 hover:bg-slate-200 text-slate-600 text-sm">Search</button>
                    </div>
                </form>
            </div>

            <div>
                <div className="d-inline col-4 text-sm mt-2">
                    Total items: &nbsp;
                    <span className="badge badge-info">{data && data.personsList ? data.personsList.count : 0}</span>
                </div>
            </div>

            {loading && (
                <div className="hidden">
                    Loading...
                </div>
            )}

            {error && (
                <div>
                    Error: ${error.message}
                </div>
            )}

            {data && (
            <div className="mt-3 mb-10">
                <div className="overflow-x-auto">
                    <Table striped className="text-left">
                        <Table.Head>
                            <Table.HeadCell className="py-3">
                                Name
                            </Table.HeadCell>
                            <Table.HeadCell>
                                Relationship
                            </Table.HeadCell>
                            <Table.HeadCell>
                                Gender
                            </Table.HeadCell>
                            <Table.HeadCell>
                                Birth Date
                            </Table.HeadCell>
                            <Table.HeadCell>
                                <span className="sr-only">Actions</span>
                            </Table.HeadCell>
                        </Table.Head>

                        <Table.Body className="divide-y">
                            {data.personsList.persons.map((person: Person) => (
                                <Table.Row key={person.externalId} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white py-2">
                                        <Link to={`/family/person/edit/${person.externalId}`}>
                                            {person.nameFirst} {person.nameMiddle} {person.nameLast}
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>
                                        {
                                            getRelationship(person)
                                        }
                                    </Table.Cell>
                                    <Table.Cell>
                                        {person.gender ? person.gender : '-'}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {person.birthDate ? dayjs(person.birthDate).format('M/DD/YYYY') : '-'}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link to={`/family/person/edit/${person.externalId}`}>
                                            <FontAwesomeIcon icon="pen-to-square" className="text-gray-400 text-lg mr-6" title='Edit Person' />
                                        </Link>
                                        <Link to="#" onClick={e => { handleClickDelete(e, person.externalId ?? ''); }}
                                            title={(person.externalId === authUser?.personExternalId ? 'Cannot Remove Self' : 'Remove Person: ' + person.externalId)}
                                            >
                                            <FontAwesomeIcon icon="trash-can"
                                                className={"text-lg " + (person.externalId === authUser?.personExternalId ? 'text-gray-200' : 'text-gray-400')}
                                            />
                                        </Link>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </div>
            </div>
            )}

        </>
    );
};

const PersonsListObserver = observer(PersonsList);

export default PersonsListObserver;