import { observable, action, computed, reaction, makeObservable, runInAction } from "mobx"
import { createContext } from "react"
import ServicesService from "../services/ServicesService";
import { ServiceAccount, Organization, ServiceType } from '../interfaces/interfaces'

class ServicesStore {
    servicesService: ServicesService

    serviceAccounts: ServiceAccount[] = []
    organizations: Organization[] = []
    serviceTypes: ServiceType[] = []
    model: ServiceAccount | null = null

    loadingServiceAccounts: boolean = false
    loadingServiceAccount: boolean = false
    loadingOrganizations: boolean = false
    loadingServiceTypes: boolean = false

    pageNumber: number = 1
    status: string = "initial";
    searchQuery: string = "";

    constructor() {
        this.servicesService = new ServicesService();

        makeObservable(this, {
            serviceAccounts: observable,
            organizations: observable,
            serviceTypes: observable,
            model: observable,
            pageNumber: observable,
            searchQuery: observable,
            // status: observable,
            setSearchQuery: action,
            setOrganizations: action,
            setServiceTypes: action,
            // getServiceAccountsAsyncREST: action,
            // getOrganizationsAsyncREST: action,
            // getServiceTypesAsyncREST: action,
            // createServiceAccountAsyncREST: action,
            // updateServiceAccountAsyncREST: action,
            // deleteServiceAccountAsyncREST: action,
            info: computed,
        })

        reaction(() => this.serviceAccounts, () => {
            // TBD
        })
    }

    get info() {
        return {
            total: this.serviceAccounts.length,
        }
    }

    setSearchQuery = (value: string) => {
        this.searchQuery = value;
    }

    setOrganizations = (newOrganizations: Organization[]) => {
        this.organizations = newOrganizations;
    }

    setServiceTypes = (newServiceTypes: ServiceType[]) => {
        this.serviceTypes = newServiceTypes;
    }

    getServiceAccountsAsyncREST = async () => {
        try {
            if (this.loadingServiceAccounts) {
                return;
            }
            this.loadingServiceAccounts = true;

            const params = {
                pageNumber: String(this.pageNumber),
                searchQuery: this.searchQuery,
            };
            const urlParams = new URLSearchParams(Object.entries(params));
            const response = await this.servicesService.getAccounts(urlParams)
            runInAction(() => {
                this.serviceAccounts = response.data.serviceAccounts;
                this.loadingServiceAccounts = false;
            });
        } catch (error) {
            runInAction(() => {
                this.status = "error";
                this.loadingServiceAccounts = false;
            });
        }
    };

    getServiceAccountById = (externalId: string): ServiceAccount | undefined => {
        return this.serviceAccounts.find(value => value.externalId === externalId);
    }

    getOrganizationsAsyncREST = async () => {
        try {
            // Only load once, since data is semi-static at this time and shared across users.
            if (this.loadingOrganizations || this.organizations.length > 0) {
                return;
            }
            this.loadingOrganizations = true;

            // console.log('ServicesStore.getOrganizationsAsyncREST');
            const params = {
                // searchQuery: this.searchQuery,
            };
            const urlParams = new URLSearchParams(Object.entries(params));
            const response = await this.servicesService.getOrganizations(urlParams)

            runInAction(() => {
                // console.log('response.data: ', response.data);
                this.organizations = response.data.organizations;
                this.loadingOrganizations = false;
            });
        } catch (error) {
            runInAction(() => {
                this.status = "error";
                this.loadingOrganizations = false;
            });
        }
    };

    getServiceTypesAsyncREST = async () => {
        try {
            // Only load once, since data is semi-static at this time and shared across users.
            if (this.loadingServiceTypes || this.serviceTypes.length > 0) {
                return;
            }
            this.loadingServiceTypes = true;

            // console.log('ServicesStore.getServiceTypesAsyncREST');
            const params = {
                // searchQuery: this.searchQuery,
            };
            const urlParams = new URLSearchParams(Object.entries(params));
            const response = await this.servicesService.getTypes(urlParams)

            runInAction(() => {
                // console.log('response.data: ', response.data);
                this.serviceTypes = response.data.serviceTypes;
                this.loadingServiceTypes = false;
            });
        } catch (error) {
            runInAction(() => {
                this.status = "error";
                this.loadingServiceTypes = false;
            });
        }
    };

    createServiceAccountAsyncREST = async (serviceAccount: ServiceAccount, afterCreateCallback: () => void) => {
        if (serviceAccount) {
            if (serviceAccount.organizationExternalId !== '') {
                try {
                    const response = await this.servicesService.postAccount(serviceAccount);
                    if (response.status === 200 || response.status === 201) {
                        runInAction(() => {
                            const newServiceAccount = response.data;
                            this.serviceAccounts.push(newServiceAccount)
                            this.status = "success";
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

    updateServiceAccountAsyncREST = async (serviceAccount: ServiceAccount, afterUpdateCallback: (() => void)) => {
        if (serviceAccount) {
            if (serviceAccount.organizationExternalId) {
                try {
                    const externalId = serviceAccount.externalId
                    const response = await this.servicesService.putAccount(serviceAccount)
                    if (response.status === 200) {
                        runInAction(() => {
                            this.serviceAccounts = this.serviceAccounts.filter(s => {
                                if(s.externalId === externalId) {
                                    return serviceAccount;
                                }
                                return s;
                            })
                            this.status = "success";
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

    deleteServiceAccountAsyncREST = async (externalId: string) => {
        try {
            const response = await this.servicesService.deleteAccount(externalId);
            if (response.status === 200 || response.status === 204) {
                runInAction(() => {
                    this.serviceAccounts = this.serviceAccounts.filter(serviceAccount => serviceAccount.externalId !== externalId)
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

export default createContext(new ServicesStore())