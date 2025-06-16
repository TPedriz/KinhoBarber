const express = require('express');
const { createSubscription, getMySubscription, registerServiceUse } = require('../controllers/subscriptionController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createSubscription);
router.get('/me', authMiddleware, getMySubscription);
router.post('/use', authMiddleware, registerServiceUse); // Rota para o barbeiro

module.exports = router;
// O código acima define as rotas para gerenciar assinaturas, incluindo a criação de uma assinatura, recuperação da assinatura do usuário e registro do uso de um serviço. As rotas são protegidas pelo middleware de autenticação para garantir que apenas usuários autenticados possam acessá-las.
// As funções de controle correspondentes devem ser implementadas no arquivo `subscriptionController.js`.