const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    // Deleta planos existentes para evitar duplicatas ao rodar o seed várias vezes
    await prisma.plan.deleteMany({});
    console.log('Deleted existing plans.');

    await prisma.plan.create({
        data: {
            name: 'Plano Bronze',
            serviceType: 'ONLY_CUT',
            cutsPerMonth: 2,
            price: 50.00,
        },
    });

    await prisma.plan.create({
        data: {
            name: 'Plano Prata',
            serviceType: 'CUT_AND_BEARD',
            cutsPerMonth: 4, // 4 serviços combinados (corte ou barba)
            price: 80.00,
        },
    });

    await prisma.plan.create({
        data: {
            name: 'Plano Ouro',
            serviceType: 'FULL_SERVICE',
            cutsPerMonth: 99, // Representa "ilimitado"
            price: 120.00,
        },
    });

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });