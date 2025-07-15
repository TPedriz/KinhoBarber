export default function PlanoCard({ plano, onAssinar, isSubscribed, isMyPlan }) {
    const formatServiceType = (type) => {
        const types = { ONLY_CUT: 'Apenas Corte', CUT_AND_BEARD: 'Corte & Barba', FULL_SERVICE: 'Completo' };
        return types[type] || 'Serviço';
    };

    return (
        <div className={`bg-gray-800 border border-gray-700 rounded-xl p-8 flex flex-col transform transition-all duration-300 ${isMyPlan ? 'border-2 border-amber-500 scale-105' : 'hover:scale-105 hover:border-amber-500'}`}>
            <h4 className="text-2xl font-bold">{plano.name}</h4>
            <p className="mt-1 text-gray-400">{formatServiceType(plano.serviceType)}</p>
            <div className="my-8">
                <span className="text-5xl font-extrabold">R${plano.price.toFixed(2).replace('.', ',')}</span>
                <span className="text-gray-400 text-lg">/mês</span>
            </div>
            <p className="text-amber-500 font-bold text-lg mb-6">{plano.cutsPerMonth < 99 ? `${plano.cutsPerMonth} usos por mês` : 'Usos Ilimitados'}</p>
            <button
                onClick={() => onAssinar(plano.id)}
                disabled={isSubscribed}
                className={`w-full text-center font-semibold py-3 rounded-lg transition-colors duration-300 mt-auto ${
                    isMyPlan
                        ? 'bg-green-600 cursor-default'
                        : isSubscribed
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-amber-600 hover:bg-amber-500 text-white'
                }`}
            >
                {isMyPlan ? 'Seu Plano Atual' : isSubscribed ? 'Você já tem um plano' : 'Assinar Agora'}
            </button>
        </div>
    );
}