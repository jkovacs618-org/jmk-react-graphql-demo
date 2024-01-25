import { observable, action, computed, makeObservable } from 'mobx'
import { createContext } from 'react'
import { ServiceAccount, Organization, ServiceType } from '../interfaces/interfaces'

class ServicesStore {
    serviceAccounts: ServiceAccount[] = []
    organizations: Organization[] = []
    serviceTypes: ServiceType[] = []

    constructor() {
        makeObservable(this, {
            serviceAccounts: observable,
            organizations: observable,
            serviceTypes: observable,
            setServiceAccounts: action,
            setOrganizations: action,
            setServiceTypes: action,
            info: computed,
        })
    }

    get info() {
        return {
            total: this.serviceAccounts.length,
        }
    }

    setServiceAccounts = (newServiceAccounts: ServiceAccount[]) => {
        this.serviceAccounts = newServiceAccounts
    }

    setOrganizations = (newOrganizations: Organization[]) => {
        this.organizations = newOrganizations
    }

    setServiceTypes = (newServiceTypes: ServiceType[]) => {
        this.serviceTypes = newServiceTypes
    }
}

export default createContext(new ServicesStore())
