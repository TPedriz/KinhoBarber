/*
* =================================================================
* KINHO BARBER - BACK-END API (Node.js, Express, Prisma)
* =================================================================
*
* INSTRUÇÕES DE SETUP:
*
* 1. ESTRUTURA DE PASTAS:
* Crie a seguinte estrutura de pastas no seu projeto:
* /
* ├── prisma/
* │   └── schema.prisma      (Definição do banco de dados)
* ├── src/
* │   ├── routes/
* │   │   ├── authRoutes.js
* │   │   └── planRoutes.js
* │   ├── controllers/
* │   │   ├── authController.js
* │   │   └── planController.js
* │   └── middleware/
* │       └── authMiddleware.js
* ├── .env                   (Arquivo para variáveis de ambiente)
* ├── package.json
* └── server.js
*
* 2. INSTALAÇÃO:
* Execute `npm install express cors dotenv jsonwebtoken bcryptjs @prisma/client`
* Execute `npm install -D prisma nodemon`
*
* 3. PRISMA:
* Execute `npx prisma init --datasource-provider postgresql`
* Copie o conteúdo de `schema.prisma` abaixo para o seu arquivo.
* Configure sua `DATABASE_URL` no arquivo `.env`.
* Execute `npx prisma migrate dev --name init` para criar as tabelas no DB.
*
* 4. RODE O SERVIDOR:
* Execute `npm run dev`
*
* =================================================================
*/

// ===== ARQUIVO: package.json =====
/*
{
  "name": "kinho-barber-api",
  "version": "1.0.0",
  "description": "API para o sistema da Kinho Barber",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "@prisma/client": "^5.15.0",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "jsonwebtoken": "^9.0.2"
  },
  "devDependencies": {
    "nodemon": "^3.1.2",
    "prisma": "^5.15.0"
  }
}
*/


// ===== ARQUIVO: .env (Exemplo) =====
/*
# URL de conexão do seu banco de dados PostgreSQL
# Exemplo: DATABASE_URL="postgresql://user:password@localhost:5432/kinhobarber?schema=public"
DATABASE_URL="YOUR_POSTGRESQL_CONNECTION_STRING"

# Chave secreta para gerar os tokens JWT
JWT_SECRET="SUA_CHAVE_SECRETA_MUITO_FORTE"
*/


// ===== ARQUIVO: prisma/schema.prisma =====
/*
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Modelo de Usuário (Cliente da barbearia)
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  password  String // Armazenará o hash da senha
  phone     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  subscriptions Subscription[]

  @@map("users")
}

// Modelo de Planos
model Plan {
  id            Int      @id @default(autoincrement())
  name          String   // Ex: "Plano Bronze", "Plano Prata"
  description   String?
  serviceType   ServiceType // Apenas Corte, Corte & Barba, etc.
  cutsPerMonth  Int
  price         Float
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())

  subscriptions Subscription[]

  @@map("plans")
}

// Modelo de Assinaturas (vincula um usuário a um plano)
model Subscription {
  id                   Int                @id @default(autoincrement())
  startDate            DateTime
  nextBillingDate      DateTime
  status               SubscriptionStatus @default(ACTIVE)
  paymentGatewayId     String?            // ID da assinatura no Stripe/Mercado Pago
  createdAt            DateTime           @default(now())
  
  user    User @relation(fields: [userId], references: [id])
  userId  Int
  
  plan    Plan @relation(fields: [planId], references: [id])
  planId  Int

  serviceUsages ServiceUsage[]

  @@map("subscriptions")
}

// Modelo para registrar o uso de um serviço (um corte)
model ServiceUsage {
  id             Int          @id @default(autoincrement())
  usageDate      DateTime     @default(now())
  notes          String?      // Notas do barbeiro
  
  subscription   Subscription @relation(fields: [subscriptionId], references: [id])
  subscriptionId Int

  @@map("service_usages")
}


// Enums para padronização de tipos
enum ServiceType {
  ONLY_CUT
  CUT_AND_BEARD
  FULL_SERVICE // Corte, Barba e Bigode
}

enum SubscriptionStatus {
  ACTIVE
  CANCELED
  INCOMPLETE // Falha no pagamento
}
*/


const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importação das rotas
const authRoutes = require('./src/routes/authRoutes');
const planRoutes = require('./src/routes/planRoutes');
// const subscriptionRoutes = require('./src/routes/subscriptionRoutes'); // Futuro

const app = express();
const PORT = process.env.PORT || 3333;

// Middlewares essenciais
app.use(cors()); // Permite requisições de origens diferentes (seu front-end)
app.use(express.json()); // Habilita o parsing de JSON no corpo das requisições

// Rota principal de boas-vindas
app.get('/', (req, res) => {
    res.json({ message: 'Bem-vindo à API da Kinho Barber!' });
});

// Usando as rotas da aplicação
app.use('/api/auth', authRoutes);
app.use('/api/plans', planRoutes);
// app.use('/api/subscriptions', subscriptionRoutes); // Futuro

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});


// ===== ARQUIVO: src/routes/authRoutes.js =====
const express = require('express');
const { register, login } = require('../controllers/authController');

const router = express.Router();

// Rota para registrar um novo usuário
// POST /api/auth/register
router.post('/register', register);

// Rota para autenticar um usuário
// POST /api/auth/login
router.post('/login', login);

module.exports = router;


// ===== ARQUIVO: src/routes/planRoutes.js =====
const express = require('express');
const { getAllActivePlans } = require('../controllers/planController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Rota para listar todos os planos ativos
// Qualquer um pode ver os planos, mas para assinar, precisará de autenticação
// GET /api/plans
router.get('/', getAllActivePlans);

// Exemplo de rota protegida que só usuários logados podem acessar
router.get('/test-protected', authMiddleware, (req, res) => {
    res.json({ message: `Olá, usuário com ID: ${req.user.id}! Você está autenticado.` });
});


module.exports = router;


// ===== ARQUIVO: src/controllers/authController.js =====
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// Função para registrar usuário
exports.register = async (req, res) => {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
    }

    try {
        // Verifica se o email já existe
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Este email já está em uso.' });
        }

        // Criptografa a senha
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone
            }
        });

        // Não retorna a senha no response
        const { password: _, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);

    } catch (error) {
        res.status(500).json({ error: 'Erro ao registrar usuário.', details: error.message });
    }
};

// Função para fazer login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        // Verifica se o usuário existe e se a senha está correta
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        // Gera o token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // Token expira em 1 dia
        );

        const { password: _, ...userWithoutPassword } = user;

        res.json({ user: userWithoutPassword, token });

    } catch (error) {
        res.status(500).json({ error: 'Erro ao fazer login.', details: error.message });
    }
};


// ===== ARQUIVO: src/controllers/planController.js =====
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Função para buscar todos os planos que estão ativos
exports.getAllActivePlans = async (req, res) => {
    try {
        const plans = await prisma.plan.findMany({
            where: {
                isActive: true
            },
            orderBy: {
                price: 'asc' // Ordena do mais barato para o mais caro
            }
        });
        res.json(plans);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar os planos.' });
    }
};


// ===== ARQUIVO: src/middleware/authMiddleware.js =====
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token não fornecido ou malformatado.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Adiciona os dados do usuário (ex: id, email) ao objeto `req`
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }
};
