const prisma = require('../lib/prisma');
const { addMonths, startOfMonth } = require('date-fns');

exports.createSubscription = async (req, res) => {
    const userId = req.user.id;
    const { planId } = req.body;

    try {
        const existingSubscription = await prisma.subscription.findUnique({ where: { userId } });
        if (existingSubscription) return res.status(400).json({ error: 'Usuário já possui uma assinatura ativa.' });

        const nextBillingDate = addMonths(new Date(), 1);

        const subscription = await prisma.subscription.create({
            data: { userId, planId, nextBillingDate, status: 'ACTIVE' },
        });

        res.status(201).json(subscription);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar assinatura.', details: error.message });
    }
};

exports.getMySubscription = async (req, res) => {
    const userId = req.user.id;
    try {
        const subscription = await prisma.subscription.findUnique({
            where: { userId },
            include: { 
                plan: true, 
                serviceUsages: {
                    where: {
                        usageDate: { gte: startOfMonth(new Date()) }
                    }
                }
            },
        });

        if (!subscription) return res.status(404).json({ message: 'Nenhuma assinatura encontrada.' });
        
        const remainingCuts = subscription.plan.cutsPerMonth - subscription.serviceUsages.length;
        
        res.json({ ...subscription, remainingCuts });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar assinatura.' });
    }
};

exports.registerServiceUse = async (req, res) => {
    // Em um app real, esta rota seria protegida e acessível apenas por funcionários/barbeiros.
    const { userEmail } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email: userEmail } });
        if (!user) return res.status(404).json({ error: 'Cliente não encontrado.' });

        const subscription = await prisma.subscription.findUnique({
             where: { userId: user.id },
             include: { plan: true, serviceUsages: { where: { usageDate: { gte: startOfMonth(new Date()) } } } }
        });

        if (!subscription || subscription.status !== 'ACTIVE') {
            return res.status(400).json({ error: 'Cliente não possui assinatura ativa.' });
        }

        const usedCuts = subscription.serviceUsages.length;
        if (usedCuts >= subscription.plan.cutsPerMonth) {
            return res.status(400).json({ error: 'Cliente já utilizou todos os cortes do mês.' });
        }

        await prisma.serviceUsage.create({ data: { subscriptionId: subscription.id }});
        res.status(201).json({ message: `Uso registrado com sucesso para ${user.name}. Cortes restantes: ${subscription.plan.cutsPerMonth - (usedCuts + 1)}` });

    } catch (error) {
        res.status(500).json({ error: 'Erro ao registrar uso.', details: error.message });
    }
};