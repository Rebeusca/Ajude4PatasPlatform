# Ajude 4 Patas Platform

Plataforma de gestão para organização de proteção animal construída com [Next.js](https://nextjs.org), [NextAuth.js](https://next-auth.js.org), [Prisma](https://www.prisma.io) e [PostgreSQL](https://www.postgresql.org).

## Link para o protótipo no Figma
[Clique aqui!](https://www.figma.com/design/D9uCFo0CADMslKdtVY9zQN/Projeto-ES?node-id=0-1&t=SwOIbVeGU096DxZo-1)

## Pré-requisitos

- Node.js 18+ instalado
- PostgreSQL instalado e rodando
- npm, yarn, pnpm ou bun

## Configuração Inicial

### 1. Instalar Dependências

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Banco de Dados PostgreSQL
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="seu-secret-aqui"

# Para gerar um NEXTAUTH_SECRET, execute:
# openssl rand -base64 32
```

### 3. Configurar o Banco de Dados

#### Opção A: Usando Migrations (Recomendado)

Execute as migrations para criar todas as tabelas no banco de dados:

```bash
npm run db:migrate
```

Este comando irá:
- Aplicar todas as migrations pendentes
- Gerar o Prisma Client automaticamente
- Criar todas as tabelas definidas no schema

#### Opção B: Usando Prisma DB Push (Desenvolvimento)

Para ambientes de desenvolvimento, você pode usar:

```bash
npx prisma db push
```

Este comando sincroniza o schema do Prisma com o banco de dados sem criar migrations.

**⚠️ Importante**: Se você receber um erro de permissão (`EPERM`) ao executar `prisma generate` ou `prisma migrate dev`, certifique-se de que o servidor Next.js não está rodando. Pare o servidor, execute o comando e reinicie.

### 4. Gerar o Prisma Client

Se você precisar gerar o Prisma Client manualmente:

```bash
npm run db:generate
```

## Criar um Novo Administrador

Para criar um novo usuário administrador no sistema, use o script `create-admin`:

```bash
npm run create-admin <senha> <email> [nome]
```

### Exemplos:

```bash
# Criar admin com senha e email (nome opcional)
npm run create-admin minhaSenha123 admin@exemplo.com

# Criar admin com nome personalizado
npm run create-admin minhaSenha123 admin@exemplo.com "João Silva"
```

O script irá:
- Validar se o email já existe (evita duplicatas)
- Gerar hash da senha usando bcrypt
- Criar o usuário com role "admin"
- Exibir as informações do usuário criado

## Rodar o Servidor de Desenvolvimento

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador para ver a aplicação.

A página é atualizada automaticamente conforme você edita os arquivos.

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria uma build de produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter ESLint
- `npm run create-admin` - Cria um novo usuário administrador
- `npm run db:generate` - Gera o Prisma Client
- `npm run db:migrate` - Executa as migrations do banco de dados

## Estrutura do Projeto

```
├── prisma/
│   ├── migrations/          # Migrations do banco de dados
│   └── schema.prisma        # Schema do Prisma
├── src/
│   ├── app/                 # Rotas e páginas (App Router)
│   │   ├── api/            # API Routes
│   │   ├── auth/           # Páginas de autenticação
│   │   └── dashboard/      # Páginas do dashboard
│   ├── components/         # Componentes React
│   ├── lib/                # Utilitários e configurações
│   ├── scripts/            # Scripts utilitários
│   └── types/              # Definições de tipos TypeScript
└── public/                 # Arquivos estáticos
```

## Modelos do Banco de Dados

- **User**: Usuários do sistema (admins)
- **Animal**: Animais cadastrados no sistema
- **Adoption**: Registros de adoções
- **Donation**: Doações recebidas
- **Volunteer**: Voluntários cadastrados
- **VeterinaryHistory**: Histórico veterinário dos animais

## Tecnologias Utilizadas

- **Next.js 16** - Framework React para produção
- **NextAuth.js v5** - Autenticação e autorização
- **Prisma** - ORM para PostgreSQL
- **PostgreSQL** - Banco de dados relacional
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework de estilização
- **bcryptjs** - Hash de senhas

## Troubleshooting

### Erro ao gerar Prisma Client

Se você receber um erro `EPERM: operation not permitted` ao executar `npx prisma generate` ou `npx prisma migrate dev`:

1. Pare o servidor Next.js (`Ctrl+C`)
2. Execute o comando novamente
3. Reinicie o servidor Next.js

### Erro de conexão com o banco de dados

Verifique se:
- O PostgreSQL está rodando
- A `DATABASE_URL` no arquivo `.env` está correta
- O banco de dados especificado existe
- As credenciais estão corretas

### Migration não aplicada

Se você alterou o schema do Prisma e precisa aplicar as mudanças:

```bash
# Criar uma nova migration
npm run db:migrate

# Ou, em desenvolvimento, sincronizar sem migration
npx prisma db push
```
