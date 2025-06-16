const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ error: 'Email já cadastrado.' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({ data: { name, email, password: hashedPassword } });

        const { password: _, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao registrar usuário.' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }
        
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword, token });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao fazer login.' });
    }
};

exports.getUserProfile = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

        const { password: _, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar perfil do usuário.' });
    }
}
