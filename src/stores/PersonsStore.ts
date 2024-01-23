import { observable, action, computed, reaction, makeObservable, runInAction } from "mobx"
import { createContext } from "react"
import PersonsService from "../services/PersonsService";
import { Person } from '../interfaces/interfaces'

class PersonsStore {
    personsService: PersonsService

    persons: Person[] = []
    loadingPersons: boolean = false

    pageNumber: number = 1
    status: string = "initial";
    searchQuery: string = "";

    genders: string[] = ['Male','Female','Other','Not Specified'];
    relationships: string[] = ['Self','Parent','Guardian','Spouse','Partner','Child','Step Child','Sibling','Aunt','Uncle','Niece','Nephew','Friend','Colleague','Contact','Other'];

    constructor() {
        this.personsService = new PersonsService();

        makeObservable(this, {
            persons: observable,
            pageNumber: observable,
            searchQuery: observable,
            // status: observable,
            setSearchQuery: action,
            // getPersonsAsyncREST: action,
            // getPersonByIdAsyncREST: action,
            // createPersonAsyncREST: action,
            // updatePersonAsyncREST: action,
            // deletePersonAsyncREST: action,
            info: computed,
        })
        reaction(() => this.persons, () => {
            // TBD
        })
    }

    get info() {
        return {
            total: this.persons.length,
        }
    }

    setSearchQuery = (value: string) => {
        this.searchQuery = value;
    }

    getPersonsAsyncREST = async () => {
        try {
            if (this.loadingPersons) {
                return;
            }
            this.loadingPersons = true;

            const params = {
                pageNumber: String(this.pageNumber),
                searchQuery: this.searchQuery,
            };
            const urlParams = new URLSearchParams(Object.entries(params));
            const response = await this.personsService.get(urlParams)

            runInAction(() => {
                this.persons = response.data.persons;
                this.loadingPersons = false;
            });
        } catch (error) {
            runInAction(() => {
                this.status = "error";
                this.loadingPersons = false;
            });
        }
    };

    getPersonByIdAsyncREST = async (externalId: string) => {
        try {
            const response = await this.personsService.getById(externalId);
            if (typeof response.data.person !== 'undefined') {
                return response.data.person;
            }
            return null;
        } catch (error) {
            runInAction(() => {
                this.status = "error";
            });
        }
    }

    createPersonAsyncREST = async (person: Person, afterCreateCallback: (() => void)) => {
        if (person) {
            if (person.nameFirst !== '' && person.nameLast !== '') {
                try {
                    const response = await this.personsService.post(person);
                    if (response.status === 200 || response.status === 201) {
                        runInAction(() => {
                            const newPerson = response.data;
                            this.status = "success";
                            this.persons.push(newPerson)
                            afterCreateCallback()
                        })
                    }
                } catch (error) {
                    runInAction(() => {
                        this.status = "error";
                    });
                }
            }
        }
    }

    updatePersonAsyncREST = async (person: Person, afterUpdateCallback: (() => void)) => {
        if (person) {
            if (person.nameFirst !== '' && person.nameLast !== '') {
                try {
                    const externalId = person.externalId
                    const response = await this.personsService.put(person)
                    if (response.status === 200) {
                        runInAction(() => {
                            // const updatedPerson = response.data;
                            this.status = "success";

                            this.persons = this.persons.filter(p => {
                                if(p.externalId === externalId) {
                                    return person;
                                }
                                return p;
                            })

                            afterUpdateCallback();
                        })
                    }
                } catch (error) {
                    runInAction(() => {
                        this.status = "error";
                    });
                }
            }
        }
    }

    deletePersonAsyncREST = async (externalId: string) => {
        try {
            const response = await this.personsService.delete(externalId);
            if (response.status === 200 || response.status === 204) {
                runInAction(() => {
                    this.persons = this.persons.filter(person => person.externalId !== externalId)
                    this.status = "success";
                })
            }
        } catch (error) {
            runInAction(() => {
                this.status = "error";
            });
        }
    }

}

export default createContext(new PersonsStore())