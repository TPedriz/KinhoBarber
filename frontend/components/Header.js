import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Header() {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-amber-500">Kinho Barber</Link>
                <nav className="hidden md:flex space-x-6 items-center">
                    <Link href="/planos" className="text-gray-300 hover:text-amber-500">Planos</Link>
                </nav>
                <div>
                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard" className="font-semibold text-white">{user.name}</Link>
                            <button onClick={logout} className="bg-red-600 hover:bg-red-500 text-white font-semibold px-4 py-2 rounded-lg text-sm">Sair</button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/login" className="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-5 py-2 rounded-lg">Login</Link>
                            <Link href="/cadastro" className="text-white hover:bg-gray-700 font-semibold px-5 py-2 rounded-lg">Cadastrar</Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}   
// This code defines a Header component for a Next.js application that uses Tailwind CSS for styling.
// It includes navigation links for authenticated users and a login/cadastro option for unauthenticated users
