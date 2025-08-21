# Dashboard do Gestor - Alterações na Base de Dados

## 📋 Resumo das Alterações

Este documento descreve as alterações necessárias na base de dados para suportar as funcionalidades do dashboard do gestor.

## 🗄️ Campos Adicionados

### Tabela `propostas`
- `validada` (BOOLEAN) - Indica se a proposta foi validada pelo gestor
- `data_validacao` (DATE) - Data em que a proposta foi validada
- `validado_por` (INTEGER) - ID do gestor que validou a proposta

### Tabela `utilizadores`
- `ativo` (BOOLEAN) - Indica se o utilizador está ativo na plataforma
- `pedido_remocao` (BOOLEAN) - Indica se o utilizador solicitou remoção da plataforma
- `data_remocao` (DATE) - Data em que o utilizador foi removido
- `telefone` (VARCHAR(20)) - Número de telefone do utilizador

## 🚀 Como Aplicar as Alterações

### Opção 1: Script SQL (Recomendado)

1. Abra o seu cliente PostgreSQL (pgAdmin, DBeaver, etc.)
2. Conecte-se à sua base de dados
3. Execute o script `add_dashboard_fields.sql` que está na pasta `projeto/backend2/`

```bash
# No terminal, navegue para a pasta do projeto
cd projeto/backend2

# Execute o script SQL
psql -U seu_usuario -d sua_base_dados -f add_dashboard_fields.sql
```

### Opção 2: Execução Manual

Execute os seguintes comandos SQL na sua base de dados:

```sql
-- 1. Adicionar campos à tabela propostas
ALTER TABLE propostas 
ADD COLUMN IF NOT EXISTS validada BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS data_validacao DATE,
ADD COLUMN IF NOT EXISTS validado_por INTEGER REFERENCES utilizadores(iduser);

-- 2. Adicionar campos à tabela utilizadores
ALTER TABLE utilizadores 
ADD COLUMN IF NOT EXISTS ativo BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS pedido_remocao BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS data_remocao DATE,
ADD COLUMN IF NOT EXISTS telefone VARCHAR(20);

-- 3. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_propostas_validada ON propostas(validada);
CREATE INDEX IF NOT EXISTS idx_utilizadores_ativo ON utilizadores(ativo);
CREATE INDEX IF NOT EXISTS idx_utilizadores_pedido_remocao ON utilizadores(pedido_remocao);
CREATE INDEX IF NOT EXISTS idx_utilizadores_idtuser ON utilizadores(idtuser);
```

## 🔄 Reiniciar o Backend

Após aplicar as alterações na base de dados, reinicie o servidor backend:

```bash
# Parar o servidor atual (Ctrl+C)
# Depois reiniciar
cd projeto/backend2
npm start
```

## ✅ Verificação

Para verificar se as alterações foram aplicadas corretamente, execute:

```sql
-- Verificar campos na tabela propostas
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'propostas' 
AND column_name IN ('validada', 'data_validacao', 'validado_por')
ORDER BY column_name;

-- Verificar campos na tabela utilizadores
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'utilizadores' 
AND column_name IN ('ativo', 'pedido_remocao', 'data_remocao', 'telefone')
ORDER BY column_name;
```

## 🎯 Funcionalidades Disponíveis

Após aplicar estas alterações, o gestor terá acesso a:

### Dashboard Básico (`/gestor/dashboard`)
- Estatísticas gerais de propostas e estudantes
- Propostas por categoria
- Propostas recentes

### Dashboard Avançado (`/gestor/dashboard2`)
- Estatísticas detalhadas de propostas (pendentes, aprovadas, rejeitadas)
- Estatísticas de estudantes (ativos, pedidos de remoção)
- Tabela de propostas recentes com status

### Gestão de Estudantes (`/gestor/estudantes`)
- Lista de todos os estudantes
- Filtros por status (ativos, inativos, pedidos de remoção)
- Aprovar/rejeitar pedidos de remoção
- Visualizar detalhes dos estudantes

## 🔧 APIs Adicionadas

### Propostas
- `GET /api/propostas/pendentes` - Obter propostas pendentes de validação
- `PUT /api/propostas/:id/validar` - Validar uma proposta

### Utilizadores
- `GET /api/utilizadores/estudantes` - Obter apenas estudantes
- `GET /api/utilizadores/estudantes/pedidos-remocao` - Obter estudantes com pedidos de remoção
- `PUT /api/utilizadores/:id/aprovar-remocao` - Aprovar remoção de estudante
- `PUT /api/utilizadores/:id/rejeitar-remocao` - Rejeitar pedido de remoção

## ⚠️ Notas Importantes

1. **Backup**: Faça sempre um backup da sua base de dados antes de aplicar alterações
2. **Testes**: Teste as funcionalidades em ambiente de desenvolvimento primeiro
3. **Dados Existentes**: Os novos campos terão valores padrão para registos existentes
4. **Compatibilidade**: As alterações são retrocompatíveis e não afetam funcionalidades existentes

## 🆘 Suporte

Se encontrar problemas ao aplicar estas alterações:

1. Verifique se tem permissões de administrador na base de dados
2. Confirme que está conectado à base de dados correta
3. Verifique os logs do servidor backend para erros
4. Teste as APIs individualmente usando Postman ou similar
