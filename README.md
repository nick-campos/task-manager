# Task Manager

Aplicação de gerenciamento de tarefas construída do zero com React, TypeScript e Supabase.

## Funcionalidades

- Autenticação completa (login, cadastro, logout, sessão persistente)
- CRUD de tarefas (criar, visualizar, editar, deletar)
- Prioridades (baixa, média, alta) com badges coloridos
- Status (pendente, em progresso, concluída)
- Filtros por status e prioridade
- Dark mode com persistência no localStorage
- Atualizações em tempo real com WebSockets (Supabase Realtime)
- Row Level Security — cada usuário acessa apenas seus próprios dados

---

## Tecnologias

| Tecnologia | Uso |
|---|---|
| React 18 | Interface e componentes |
| TypeScript | Tipagem estática |
| Vite | Bundler e servidor de desenvolvimento |
| Tailwind CSS v4 | Estilização |
| Supabase | Banco de dados, autenticação e realtime |
| PostgreSQL | Banco de dados relacional |

---

## Estrutura do projeto

```
src/
├── components/
│   ├── Header.tsx        # Barra superior com email, dark mode e logout
│   ├── TaskForm.tsx      # Formulário para criar tarefas
│   ├── TaskFilters.tsx   # Filtros por status e prioridade
│   └── TaskList.tsx      # Lista de cards com edição inline
├── contexts/
│   └── AuthContext.tsx   # Provider de autenticação global
├── hooks/
│   ├── useAuth.ts        # Hook para acessar o contexto de auth
│   └── useTheme.ts       # Hook para gerenciar dark mode
├── lib/
│   └── supabase.ts       # Cliente do Supabase
├── pages/
│   └── Auth.tsx          # Tela de login e cadastro
├── services/
│   └── taskService.ts    # Funções de comunicação com o banco
├── types/
│   └── index.ts          # Tipos TypeScript do projeto
├── App.tsx               # Componente raiz e controle de rotas
└── main.tsx              # Ponto de entrada da aplicação
```

---

## Como rodar o projeto

### Pré-requisitos

- Node.js 18+
- npm
- Conta no [Supabase](https://supabase.com)

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/task-manager.git
cd task-manager
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o Supabase

Crie um projeto no [Supabase](https://supabase.com) e execute os seguintes SQLs no **SQL Editor**:

**Criando os tipos:**
```sql
create type task_status as enum ('pending', 'in_progress', 'done');
create type task_priority as enum ('low', 'medium', 'high');
```

**Criando a tabela:**
```sql
create table tasks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  title       text not null,
  description text,
  status      task_status not null default 'pending',
  priority    task_priority not null default 'medium',
  created_at  timestamptz not null default now()
);
```

**Ativando o Row Level Security:**
```sql
alter table tasks enable row level security;
```

**Criando as políticas (uma por vez):**
```sql
create policy "Usuário lê apenas suas tasks"
on tasks for select
using (auth.uid() = user_id);
```
```sql
create policy "Usuário cria apenas suas tasks"
on tasks for insert
with check (auth.uid() = user_id);
```
```sql
create policy "Usuário atualiza apenas suas tasks"
on tasks for update
using (auth.uid() = user_id);
```
```sql
create policy "Usuário deleta apenas suas tasks"
on tasks for delete
using (auth.uid() = user_id);
```

**Ativando o Realtime:**

No painel do Supabase vá em **Database → Replication** e ative `Insert`, `Update` e `Delete` na tabela `tasks`.

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-publishable
```

As chaves estão disponíveis em **Settings → API** no painel do Supabase.

### 5. Rode o projeto

```bash
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173)

---

## Banco de dados

### Tabela `tasks`

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | uuid | Identificador único gerado automaticamente |
| `user_id` | uuid | Referência ao usuário dono da tarefa |
| `title` | text | Título da tarefa (obrigatório) |
| `description` | text | Descrição opcional |
| `status` | task_status | `pending`, `in_progress` ou `done` |
| `priority` | task_priority | `low`, `medium` ou `high` |
| `created_at` | timestamptz | Data de criação com timezone |

### Segurança

O projeto usa **Row Level Security (RLS)** do PostgreSQL. Cada usuário só consegue visualizar, criar, editar e deletar suas próprias tarefas. Mesmo com acesso à chave `anon`, é impossível acessar dados de outro usuário.

---

## Scripts disponíveis

```bash
npm run dev      # Sobe o servidor de desenvolvimento
npm run build    # Gera o build de produção
npm run preview  # Testa o build de produção localmente
```

---

## Dark Mode

O tema é salvo no `localStorage` do browser e persiste entre sessões. O botão de alternância fica no canto superior direito do header.

---

## Realtime

As tarefas atualizam automaticamente via WebSockets. Se o app estiver aberto em duas abas, qualquer mudança em uma aba aparece instantaneamente na outra sem precisar recarregar a página.

---

## Licença

Este projeto está sob a licença MIT.