import React from 'react';

// Dados de exemplo que viriam da sua API (GET /planos)
const planos = [
  {
    id: 1,
    nome: 'Plano Básico',
    preco: '50,00',
    servico: 'Apenas Corte',
    limite: '2 Cortes/mês',
    beneficios: ['Dois cortes de cabelo agendados', 'Estilo moderno ou clássico', 'Acabamento navalhado'],
    destaque: false,
  },
  {
    id: 2,
    nome: 'Plano Premium',
    preco: '80,00',
    servico: 'Corte e Barba',
    limite: '4 Serviços/mês',
    beneficios: ['Até 4 serviços combinados (corte ou barba)', 'Toalha quente e massagem', 'Produtos premium', 'Bebida cortesia'],
    destaque: true,
  },
  {
    id: 3,
    nome: 'Plano VIP',
    preco: '100,00',
    servico: 'Corte, Barba e Bigode',
    limite: 'Ilimitado*',
    beneficios: ['Serviços ilimitados*', 'Design completo de barba e bigode', 'Prioridade no agendamento', 'Kit de produtos de brinde'],
    destaque: false,
  },
];

// Componente para o card de plano individual
const PlanoCard = ({ plano }) => (
  <div
    className={`
      bg-gray-800 border border-gray-700 rounded-lg p-6 flex flex-col
      transition-all duration-300 ease-in-out transform
      hover:scale-105 hover:shadow-2xl hover:border-amber-500
      ${plano.destaque ? 'border-2 border-amber-500 scale-105 shadow-2xl' : ''}
    `}
  >
    {plano.destaque && (
      <span className="bg-amber-500 text-gray-900 text-xs font-bold px-3 py-1 rounded-full self-start mb-4">
        MAIS POPULAR
      </span>
    )}
    <h3 className="text-2xl font-bold text-white">{plano.nome}</h3>
    <p className="text-gray-400 mt-1">{plano.servico}</p>
    
    <div className="my-6">
      <span className="text-5xl font-extrabold text-white">R${plano.preco}</span>
      <span className="text-gray-400 text-lg">/mês</span>
    </div>

    <ul className="space-y-3 text-gray-300 mb-8 flex-grow">
      {plano.beneficios.map((beneficio, index) => (
        <li key={index} className="flex items-center">
          <svg className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          <span>{beneficio}</span>
        </li>
      ))}
    </ul>

    <button className={`
      w-full py-3 rounded-lg font-semibold text-lg
      transition-colors duration-300
      ${plano.destaque 
        ? 'bg-amber-500 text-gray-900 hover:bg-amber-400' 
        : 'bg-gray-700 text-white hover:bg-gray-600'}
    `}>
      Assinar Plano
    </button>
  </div>
);


// Componente da página
export default function PlanosPage() {
  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-white leading-tight">
            Nossos Planos de Assinatura
          </h1>
          <p className="text-xl text-gray-400 mt-4 max-w-2xl mx-auto">
            Escolha o plano ideal e mantenha seu estilo sempre em dia, sem se preocupar com pagamentos a cada visita.
          </p>
        </header>

        {/* Grid Responsivo para os Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {planos.map(plano => (
            <PlanoCard key={plano.id} plano={plano} />
          ))}
        </div>

        <footer className="text-center mt-12 text-gray-500">
          <p>*Plano VIP sujeito à política de uso justo e disponibilidade de agenda.</p>
          <p className="mt-4">Kinho Barber &copy; 2025</p>
        </footer>

      </div>
    </div>
  );
}