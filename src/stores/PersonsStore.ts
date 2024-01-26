import { observable, action, makeObservable } from 'mobx'
import { createContext } from 'react'
import { Person } from '@/interfaces/interfaces'

class PersonsStore {
    persons: Person[] = []

    genders: string[] = ['Male', 'Female', 'Other', 'Not Specified']
    relationships: string[] = [
        'Self',
        'Parent',
        'Guardian',
        'Spouse',
        'Partner',
        'Child',
        'Step Child',
        'Sibling',
        'Aunt',
        'Uncle',
        'Niece',
        'Nephew',
        'Friend',
        'Colleague',
        'Contact',
        'Other',
    ]

    constructor() {
        makeObservable(this, {
            persons: observable,
            setPersons: action,
        })
    }

    setPersons = (newPersons: Person[]) => {
        this.persons = newPersons
    }
}

export default createContext(new PersonsStore())
