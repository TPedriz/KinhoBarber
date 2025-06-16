const prisma = require('../lib/prisma');

exports.getAllActivePlans = async (req, res) => {
    try {
        const plans = await prisma.plan.findMany({ where: { isActive: true }, orderBy: { price: 'asc' } });
        res.json(plans);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar os planos.' });
    }
};
exports.getPlanById = async (req, res) => {
    const { id } = req.params;
    try {
        const plan = await prisma.plan.findUnique({ where: { id: parseInt(id) } });
        if (!plan) return res.status(404).json({ error: 'Plano não encontrado.' });
        res.json(plan);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar o plano.' });
    }
};