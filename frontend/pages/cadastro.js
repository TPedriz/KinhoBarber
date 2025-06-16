import { useState } from 'react';
import api from '../services/api';
import Link from 'next/link';

export default function CadastroPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nome, setNome] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await api.post('/auth/register', { email, password, nome });
            setSuccess('Cadastro realizado com sucesso! Faça login.');
            setEmail('');
            setPassword('');
            setNome('');
        } catch (err) {
            setError(err.response?.data?.error || 'Erro no cadastro.');
        }
    };

    return (
        <div className="flex justify-center items-center py-20">
            <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center">Cadastro</h2>
                {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-md mb-4">{error}</p>}
                {success && <p className="bg-green-500/20 text-green-400 p-3 rounded-md mb-4">{success}</p>}
                <div className="mb-4">
                    <label className="block mb-2">Nome</label>
                    <input
                        type="text"
                        value={nome}
                        onChange={e => setNome(e.target.value)}
                        className="w-full bg-gray-700 p-2 rounded-md"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full bg-gray-700 p-2 rounded-md"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block mb-2">Senha</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full bg-gray-700 p-2 rounded-md"
                        required
                    />
                </div>
                <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 px-4 rounded-md">
                    Cadastrar
                </button>
                <p className="text-center mt-4 text-sm text-gray-400">
                    Já tem uma conta?{' '}
                    <Link href="/login" className="text-amber-500 hover:underline">
                        Faça login
                    </Link>
                </p>
            </form>
        </div>
    );
}