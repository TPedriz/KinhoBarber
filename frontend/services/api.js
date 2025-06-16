import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export default api;
// Interceptor para tratar erros
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // O servidor respondeu com um código de status fora da faixa 2xx
            console.error('Erro na resposta:', error.response.data);
        } else {
            // Ocorreu um erro ao configurar a solicitação
            console.error('Erro na solicitação:', error.message);
        }
        return Promise.reject(error);
    }
);