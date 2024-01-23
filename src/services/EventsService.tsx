import axios from '../plugins/axios-rest';
import { BACKEND_BASE_URL } from '../setup';
import { Event } from '../interfaces/interfaces';

const eventsApiUrl = `${BACKEND_BASE_URL}/api/customer/events/`;

class EventsService {
    get = async (params: {searchQuery: string, pageNumber: string, isAscending: string}) => {
        const urlParams = new URLSearchParams(Object.entries(params));
        const response = await axios.get(eventsApiUrl + "?" + urlParams);
        return response;
    }
    getById = async (externalId: string, verbose: boolean = false) => {
        if (verbose) {
            console.log('ServicesService.getAccountById(' + externalId + ')');
        }
        const response = await axios.get(eventsApiUrl + externalId);
        if (verbose) {
            console.log('- response: ', response);
        }
        return response;
    }
    post = async (model: Event) => {
        try {
            const response = await axios.post(eventsApiUrl, model);
            return response;
        }
        catch (error) {
            console.error(error);
            alert('Something went wrong. Please try again or contact support.');
            throw error;
        }
    }
    put = async (model: Event) => {
        try {
            const updateApiUrl = eventsApiUrl + model.externalId;
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
            const deleteApiUrl = eventsApiUrl + externalId;
            const response = await axios.delete(deleteApiUrl);
            return response;
        }
        catch (error) {
            console.error(error);
            alert('Something went wrong. Please try again or contact support.');
            throw error;
        }
    }
    getCalendars = async () => {
        const response = await axios.get(eventsApiUrl + "calendars/");
        return response;
    }
}

export default EventsService;