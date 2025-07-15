import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function DashboardPage() {
    const { user, isAuthenticated, loading } = useAuth();
    const [subscription, setSubscription] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
        }
        if (isAuthenticated) {
            api.get('/subscriptions/me')
                .then(res => setSubscription(res.data))
                .catch(() => setSubscription(null))
                .finally(() => setIsLoading(false));
        }
    }, [isAuthenticated, loading, router]);
    
    if (loading || isLoading) return <p className="text-center py-10">Carregando...</p>;
    if (!user) return null;

    return (
        <div className="container mx-auto px-6 py-16">
            <h1 className="text-3xl font-bold mb-4">Bem-vindo, {user.name}!</h1>
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-4">Seu Painel</h2>
                {subscription ? (
                    <div>
                        <h3 className="text-xl font-semibold text-amber-500">{subscription.plan.name}</h3>
                        <p className="mt-2 text-gray-300">Status: <span className="font-bold text-green-400">{subscription.status}</span></p>
                        <p className="text-gray-300">Próxima cobrança em: {format(new Date(subscription.nextBillingDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
                        <div className="mt-6 bg-gray-700/50 p-6 rounded-lg">
                            <h4 className="font-bold text-lg">Uso Mensal</h4>
                            <p className="text-4xl font-extrabold my-2">{subscription.remainingCuts} <span className="text-2xl font-normal text-gray-400">/ {subscription.plan.cutsPerMonth < 99 ? subscription.plan.cutsPerMonth : '∞'}</span></p>
                            <p className="text-gray-400">cortes/serviços restantes este mês.</p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <p className="text-xl text-gray-400">Você ainda não tem uma assinatura ativa.</p>
                        <button onClick={() => router.push('/planos')} className="mt-6 bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-6 rounded-lg">Ver Planos</button>
                    </div>
                )}
            </div>
        </div>
    );
}