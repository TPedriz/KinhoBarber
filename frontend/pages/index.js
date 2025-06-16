import Link from 'next/link';
export default function HomePage() {
    return (
        <main className="text-center py-20 md:py-32 px-6">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Seu Estilo, <span className="text-amber-500">Sempre em Dia.</span></h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-300">Chega de se preocupar. Com nossos planos, você garante seu visual impecável o mês todo.</p>
            <Link href="/planos" className="mt-10 inline-block bg-amber-500 text-gray-900 font-bold text-lg px-8 py-4 rounded-lg shadow-lg hover:bg-amber-400 transform hover:scale-105 transition-all duration-300">Conheça os Planos</Link>
        </main>
    );
}