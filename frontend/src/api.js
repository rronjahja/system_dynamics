import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

export async function getDefaultParams() {
    const res = await axios.get(`${API_BASE}/default-params`);
    return res.data;
}

export async function simulate(params) {
    const res = await axios.post(`${API_BASE}/simulate`, params);
    return res.data;
}
