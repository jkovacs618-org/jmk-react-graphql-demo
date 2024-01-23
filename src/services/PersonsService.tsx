import axios from '../plugins/axios-rest';
import { BACKEND_BASE_URL } from '../setup';
import { Person } from '../interfaces/interfaces';

const personsApiUrl = `${BACKEND_BASE_URL}/api/customer/persons/`;

class PersonsService {
    get = async (urlParams: URLSearchParams) => {
        const response = await axios.get(personsApiUrl + "?" + urlParams);
        return response;
    }
    getById = async (externalId: string, verbose: boolean = false) => {
        if (verbose) {
            console.log('ServicesService.getAccountById(' + externalId + ')');
        }
        const response = await axios.get(personsApiUrl + externalId);
        if (verbose) {
            console.log('- response: ', response);
        }
        return response;
    }
    post = async (model: Person) => {
        try {
            const response = await axios.post(personsApiUrl, model);
            return response;
        }
        catch (error) {
            console.error(error);
            alert('Something went wrong. Please try again or contact support.');
            throw error;
        }
    }
    put = async (model: Person) => {
        const updateApiUrl = personsApiUrl + model.externalId;
        try {
            const response = await axios.put(updateApiUrl, model);
            return response;
        }
        catch (error) {
            console.error(error);
            alert('Something went wrong. Please try again or contact support.');
            throw error;
        }
    }
    delete = async (externalId: string) => {
        try {
            const deleteApiUrl = personsApiUrl + externalId;
            const response = await axios.delete(deleteApiUrl);
            return response;
        }
        catch (error) {
            console.error(error);
            alert('Something went wrong. Please try again or contact support.');
            throw error;
        }
    }
}

export default PersonsService;