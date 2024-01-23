import axios from '../plugins/axios-rest';
import { BACKEND_BASE_URL } from '../setup';
import { Calendar } from '../interfaces/interfaces';

const calendarsApiUrl = `${BACKEND_BASE_URL}/api/customer/calendars/`;

class CalendarsService {
    get = async () => {
        const response = await axios.get(calendarsApiUrl);
        return response;
    }
    getById = async (externalId: string) => {
        const response = await axios.get(calendarsApiUrl + externalId);
        return response;
    }
    post = async (model: Calendar) => {
        const response = await axios.post(calendarsApiUrl, model);
        return response;
    }
    put = async (model: Calendar) => {
        const updateApiUrl = calendarsApiUrl + model.externalId;
        const response = await axios.put(updateApiUrl, model);
        return response;
    }
    delete = async (externalId: string) => {
        const deleteApiUrl = calendarsApiUrl + externalId;
        const response = await axios.delete(deleteApiUrl);
        return response;
    }
}

export default CalendarsService;