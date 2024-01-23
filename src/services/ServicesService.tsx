import axios from '../plugins/axios-rest';
import { BACKEND_BASE_URL } from '../setup';
import { ServiceAccount } from '../interfaces/interfaces';

const servicesApiUrl = `${BACKEND_BASE_URL}/api/customer/services/`;

class ServicesService {
    getAccounts = async (urlParams: URLSearchParams) => {
        const response = await axios.get(servicesApiUrl + "?" + urlParams);
        return response;
    }
    getAccountById = async (externalId: string, verbose: boolean = false) => {
        if (verbose) {
            console.log('ServicesService.getAccountById(' + externalId + ')');
        }
        const response = await axios.get(servicesApiUrl + externalId);
        if (verbose) {
            console.log('- response: ', response);
        }
        return response;
    }
    postAccount = async (model: ServiceAccount) => {
        try {
            const response = await axios.post(servicesApiUrl, model);
            return response;
        }
        catch (error) {
            console.error(error);
            alert('Something went wrong. Please try again or contact support.');
            throw error;
        }
    }
    putAccount = async (model: ServiceAccount) => {
        try {
            const updateApiUrl = servicesApiUrl + model.externalId;
            const response = await axios.put(updateApiUrl, model);
            return response;
        }
        catch (error) {
            console.error(error);
            alert('Something went wrong. Please try again or contact support.');
            throw error;
        }
    }
    deleteAccount = async (externalId: string) => {
        try {
            const deleteApiUrl = servicesApiUrl + externalId;
            const response = await axios.delete(deleteApiUrl);
            return response;
        }
        catch (error) {
            console.error(error);
            alert('Something went wrong. Please try again or contact support.');
            throw error;
        }
    }
    getTypes = async (urlParams: URLSearchParams) => {
        const getTypesApiUrl = servicesApiUrl + 'types/';
        const response = await axios.get(getTypesApiUrl + "?" + urlParams);
        return response;
    }
    getOrganizations = async (urlParams: URLSearchParams) => {
        const getOrganizationsApiUrl = servicesApiUrl + 'organizations/';
        const response = await axios.get(getOrganizationsApiUrl + "?" + urlParams);
        return response;
    }
}

export default ServicesService;