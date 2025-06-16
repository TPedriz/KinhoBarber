import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/auth/login', { email, password });
            login(response.data.token, response.data.user);
        } catch (err) {
            setError(err.response?.data?.error || 'Erro no login.');
        }
    };

    return (
        <div className="flex justify-center items-center py-20">
            <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-md mb-4">{error}</p>}
                <div className="mb-4">
                    <label className="block mb-2">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-gray-700 p-2 rounded-md" required />
                </div>
                <div className="mb-6">
                    <label className="block mb-2">Senha</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-gray-700 p-2 rounded-md" required />
                </div>
                <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 px-4 rounded-md">Entrar</button>
                <p className="text-center mt-4 text-sm text-gray-400">
                    Não tem uma conta? <Link href="/cadastro" className="text-amber-500 hover:underline">Cadastre-se</Link>
                </p>
            </form>
        </div>
    );
}