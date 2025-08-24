# Guard Contatos 💂‍♂️

[![Next.js](https://img.shields.io/badge/Next.js-15.5.0-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black.svg)](https://vercel.com/)
[![Challenge](https://img.shields.io/badge/Challenge-COMPLETED%20%2B%20BONUS-brightgreen.svg)](#)

> **Desafio Técnico Guard - Sistema de Gerenciamento de Contatos**  
> Desenvolvido com Next.js 15, TypeScript, Supabase e arquitetura serverless personalizada.

### ✅ **Requisitos Obrigatórios Entregues**
- [x] **Tela de Login** com autenticação segura
- [x] **Listagem de Contatos** com filtro alfabético
- [x] **Cadastro de Contatos** com upload de fotos
- [x] **Backend Funcional** com PostgreSQL
- [x] **Mensagem Secreta** no botão "Adicionar Contato"

### 🚀 **Funcionalidades Bonus Implementadas**
- [x] **Sistema de Exportação CSV** (download + envio por email)
- [x] **Mini-Servidor Serverless** personalizado
- [x] **Integração de Email** com templates profissionais
- [x] **Otimizações de Performance** (pre-warming de funções)
- [x] **Deploy Profissional** com Vercel

---

## 🛠️ **Tech Stack**

### **Frontend**
- **Next.js 15** 
- **React 19** 
- **TypeScript 5** 
- **TailwindCSS 4** 
- **Zustand** 

### **Backend & Database**
- **Vercel Serverless Functions** 
- **Supabase** 
- **PostgreSQL** 
- **Supabase Auth** 
- **Supabase Storage** 

### **Integrações**
- **Resend API** 
- **Templates HTML** 

---

## 🚀 **Instalação e Execução**

### **Pré-requisitos**
```bash
- Node.js 18+
- Vercel CLI: npm i -g vercel
- Conta no Supabase
- Conta no Resend (opcional, para email export)
```

### **1. Clone e Instalação**
```bash
git clone https://github.com/seu-usuario/guard-contatos.git
cd guard-contatos
npm install
```

### **2. Configuração do Banco de Dados**

1. Crie um novo projeto no [Supabase](https://supabase.com)
2. Vá para **SQL Editor** no painel do Supabase
3. Cole e execute o seguinte schema:

```sql
-- Enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Contacts table
CREATE TABLE public.contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT, 
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on contacts
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own contacts" ON public.contacts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own contacts" ON public.contacts  
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own contacts" ON public.contacts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own contacts" ON public.contacts
  FOR DELETE USING (auth.uid() = user_id);

-- Storage bucket for photos
INSERT INTO storage.buckets (id, name, public) VALUES ('contact-photos', 'contact-photos', true);

-- Storage policies
CREATE POLICY "Users can upload contact photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'contact-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view contact photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'contact-photos');
```

### **3. Configuração de Ambiente**
```bash
# Crie o arquivo .env.local na raiz do projeto e configure as variáveis:
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_publica_supabase
SUPABASE_URL=sua_url_do_supabase
SUPABASE_ANON_KEY=sua_chave_publica_supabase

# Para funcionalidade de email (opcional)
RESEND_API_KEY=sua_chave_resend
RESEND_FROM_EMAIL=onboarding@resend.dev
```

### **4. ⚠️ IMPORTANTE: Execução com Vercel Dev**
```bash
# DEVE usar vercel dev (NÃO npm run dev)
vercel dev

# Isso é obrigatório para as funções serverless funcionarem localmente
```

### **5. Acesso à Aplicação**
- Abra [http://localhost:3000](http://localhost:3000)
- Crie uma nova conta ou faça login
- Comece a gerenciar seus contatos!

---

## 🏗️ **Arquitetura do Sistema**

### **Frontend**
```
src/
├── app/                 # Pages e layouts
├── components/          # Componentes React reutilizáveis
├── stores/             # Estado global (Zustand)
├── services/           # Lógica de API e integração
└── types/              # Definições TypeScript
```

### **Backend Serverless**
```
api/
├── health.js           # Endpoint para warming das funções
├── export-contacts.js  # Sistema de exportação CSV
└── _shared/           # Utilitários compartilhados
    ├── supabase.js    # Cliente Supabase autenticado
    └── email-template.js # Templates de email
```

### **Funcionalidades Principais**

#### **🔐 Sistema de Autenticação**
- JWT seguro com Supabase Auth
- Row Level Security (RLS) no banco
- Proteção de rotas automática

#### **📋 Gerenciamento de Contatos**
- CRUD completo (Create, Read, Update, Delete)
- Upload de fotos com Supabase Storage
- Filtro alfabético
- Validação de dados em tempo real

#### **📊 Sistema de Exportação CSV**
- **Download Direto**: Arquivo CSV com dados dos contatos
- **Envio por Email**: CSV anexado em email
- **Pre-warming**: Funções serverless otimizadas para performance
- **Templates Responsivos**: Emails com design profissional

---

## 🎨 **Design System**

O projeto segue o design fornecido no Figma, implementando:
- ✨ Cores e tipografia consistentes
- 🎯 Componentes reutilizáveis
- 📱 Layout responsivo básico
- 💫 Micro-interações e transições
- 🔍 Estados visuais (loading, error, empty)

---

## 🚀 **Deploy e Demonstração**

### **🌐 Aplicação Online**
- **URL**: [Guard Contatos](https://guard-contacts-b48thmtj2-olns-projects.vercel.app/)


### **📋 Configuração de Deploy**
```json
// vercel.json
{
  "functions": {
    "api/*.js": {
      "maxDuration": 30
    }
  }
}
```

---

## 💡 **Decisões Técnicas**

### **Por que Supabase?**
- Reduz complexidade de infraestrutura
- PostgreSQL nativo com RLS
- Autenticação JWT integrada
- Storage de arquivos incluído

### **Por que Serverless Functions?**
- Escalabilidade automática
- Menor custo operacional  
- Deploy simplificado
- Performance otimizada

### **Por que Next.js 15?**
- App Router moderno
- Server Components
- Otimizações automáticas
- TypeScript nativo

---

## 🔮 **Próximos Passos**

### **Melhorias Planejadas:**
- [ ] Design 100% responsivo para mobile
- [ ] Suite de testes automatizados
- [ ] Sistema de importação CSV
- [ ] Busca avançada e filtros múltiplos

---

## 👨‍💻 **Sobre o Desenvolvedor**

Desenvolvido por Victor Oliveira como parte do desafio técnico da Zeine.

### **Contato:**
- **GitHub**: [Link](github.com/0111v)
- **LinkedIn**: [Link](https://www.linkedin.com/in/victor-oliveira-855844249/)
- **Email**: [Link](victor_oln@icloud.com)

---

## 📄 **Licença**

Este projeto foi desenvolvido como parte de um desafio técnico e está disponível para avaliação.

---


*PS: Não esqueça de testar a mensagem secreta - mantenha o mouse sobre o botão "Adicionar Contato" por 7 segundos!*

**"Tá esperando o quê? Boraa moeer!! 🚀"**
