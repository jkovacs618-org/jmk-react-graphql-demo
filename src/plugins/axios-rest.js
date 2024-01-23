import Axios from 'axios';
import { BACKEND_BASE_URL } from '../setup';

export default Axios.create({
	baseURL: `${BACKEND_BASE_URL}/api`,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
		"Accept": "application/json",
	},
});
