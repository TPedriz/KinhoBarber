import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import PlanoCard from '../components/PlanoCard';

export default function PlanosPage() {
    const [plans, setPlans] = useState([]);
    const [mySubscription, setMySubscription] = useState(null);
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        api.get('/plans').then(response => setPlans(response.data));
        if (isAuthenticated) {
            api.get('/subscriptions/me').then(response => setMySubscription(response.data)).catch(() => setMySubscription(null));
        }
    }, [isAuthenticated]);

    const handleAssinar = async (planId) => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        try {
            await api.post('/subscriptions', { planId });
            alert('Assinatura realizada com sucesso!');
            router.push('/dashboard');
        } catch (error) {
            alert(error.response?.data?.error || 'Erro ao realizar assinatura.');
        }
    };

    return (
        <div className="container mx-auto px-6 py-16">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold">Nossos Planos</h1>
                <p className="text-lg text-gray-400 mt-2">Escolha o plano ideal e mantenha seu estilo sempre em dia.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {plans.map(plano => (
                    <PlanoCard
                        key={plano.id}
                        plano={plano}
                        onAssinar={handleAssinar}
                        isSubscribed={!!mySubscription}
                        isMyPlan={mySubscription?.planId === plano.id}
                    />
                ))}
            </div>
        </div>
    );
}
// This code defines a PlanosPage component for a Next.js application that displays available subscription plans.
// It fetches plans from an API, checks if the user has a subscription, and allows users to subscribe to a plan.
// The component uses Tailwind CSS for styling and includes a responsive grid layout for displaying plan cards. 