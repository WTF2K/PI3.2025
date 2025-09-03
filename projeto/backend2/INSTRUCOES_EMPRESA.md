# 🏢 Funcionalidades das Empresas - Instruções de Implementação

## 📋 Funcionalidades Implementadas

### ✅ 1. Submeter Propostas de Emprego
- **Ficheiro**: `propostas-add-empresa.jsx`
- **Funcionalidade**: Formulário completo para criar novas propostas
- **Campos**: Título, categoria, localização, descrição, tipo de proposta, tipo de contrato
- **Status**: ✅ Funcional

### ✅ 2. Operações sobre Propostas
- **Editar Propostas**: `propostas-edit-empresa.jsx`
- **Ativar/Desativar**: Botões toggle na listagem
- **Reativar Propostas**: Funcionalidade para tornar disponível novamente
- **Status**: ✅ Funcional

### ✅ 3. Desativar Propostas Atribuídas
- **Funcionalidade**: Propostas atribuídas a estudantes são automaticamente desativadas
- **Controlo**: Campo `atribuida_estudante` e `ativa`
- **Status**: ✅ Funcional

### ✅ 4. Visualizar Informação das Propostas
- **Dashboard**: `dashboard-empresa.jsx` com estatísticas
- **Listagem**: `propostas-list-empresa.jsx` com filtros
- **Detalhes**: Visualização completa de cada proposta
- **Status**: ✅ Funcional

## 🗄️ Alterações na Base de Dados

### Script SQL Necessário
Execute o ficheiro `add_empresa_fields.sql` na sua base de dados PostgreSQL:

```sql
-- Execute este script no pgAdmin ou cliente PostgreSQL
-- Ficheiro: projeto/backend2/add_empresa_fields.sql
```

### Novos Campos Adicionados

#### Tabela `propostas`:
- `ativa` (BOOLEAN) - Controla se a proposta está ativa
- `atribuida_estudante` (BOOLEAN) - Indica se foi atribuída a um estudante
- `id_estudante_atribuido` (INTEGER) - ID do estudante atribuído
- `data_atribuicao` (DATE) - Data da atribuição

## 🔧 Backend - Novas APIs

### Rotas Adicionadas:
```javascript
// Obter propostas por empresa
GET /api/propostas/empresa/:idempresa

// Obter propostas ativas por empresa
GET /api/propostas/empresa/:idempresa/ativas

// Obter propostas atribuídas por empresa
GET /api/propostas/empresa/:idempresa/atribuidas

// Ativar/Desativar proposta
PUT /api/propostas/:id/toggle-status

// Reativar proposta
PUT /api/propostas/:id/reativar

// Atribuir proposta a estudante
PUT /api/propostas/:id/atribuir-estudante
```

### Controllers Atualizados:
- `propostasController.js` - Novas funções para gestão de propostas

## 🎨 Frontend - Novos Componentes

### Ficheiros Criados/Modificados:
1. **`dashboard-empresa.jsx`** - Dashboard com estatísticas
2. **`propostas-list-empresa.jsx`** - Listagem com filtros e ações
3. **`inicio-empresa.jsx`** - Página inicial atualizada
4. **`sidebarempresa.jsx`** - Navegação atualizada
5. **`App.jsx`** - Rotas adicionadas

### Funcionalidades do Dashboard:
- 📊 Estatísticas em tempo real
- 📈 Taxa de sucesso das propostas
- 🔄 Ações rápidas
- 📋 Lista de propostas recentes

### Funcionalidades da Listagem:
- 🔍 Pesquisa por texto
- 🏷️ Filtros por status (Todas, Ativas, Inativas, Atribuídas)
- ⚡ Ações rápidas (Ativar/Desativar, Reativar)
- 📊 Indicadores visuais de status

## 🚀 Como Aplicar as Alterações

### Passo 1: Base de Dados
```bash
# 1. Abrir pgAdmin ou cliente PostgreSQL
# 2. Conectar à base de dados
# 3. Executar o script: add_empresa_fields.sql
```

### Passo 2: Backend
```bash
# 1. Navegar para a pasta do backend
cd projeto/backend2

# 2. Reiniciar o servidor
npm start
```

### Passo 3: Frontend
```bash
# 1. Navegar para a pasta do frontend
cd projeto/frontend

# 2. Reiniciar o servidor de desenvolvimento
npm run dev
```

## 🔍 Verificação

### Testar Funcionalidades:
1. **Login como empresa**
2. **Aceder ao dashboard** - `/empresa/dashboard`
3. **Criar nova proposta** - `/empresa/propostas/add`
4. **Listar propostas** - `/empresa/propostas`
5. **Testar filtros** - Ativas, Inativas, Atribuídas
6. **Testar ações** - Ativar/Desativar, Reativar

### Verificar Base de Dados:
```sql
-- Verificar se os campos foram adicionados
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'propostas' 
AND column_name IN ('ativa', 'atribuida_estudante', 'id_estudante_atribuido', 'data_atribuicao')
ORDER BY column_name;

-- Verificar estatísticas
SELECT 
    COUNT(*) as total_propostas,
    COUNT(CASE WHEN ativa = TRUE THEN 1 END) as propostas_ativas,
    COUNT(CASE WHEN atribuida_estudante = TRUE THEN 1 END) as propostas_atribuidas
FROM propostas;
```

## 🐛 Resolução de Problemas

### Erro: "Campo não existe"
- **Solução**: Executar o script SQL `add_empresa_fields.sql`

### Erro: "Rota não encontrada"
- **Solução**: Verificar se o backend está a correr e as rotas estão registadas

### Erro: "Componente não encontrado"
- **Solução**: Verificar se todos os ficheiros foram criados e importados corretamente

### Erro: "Autenticação falhou"
- **Solução**: Verificar se o token JWT está válido e o utilizador é do tipo empresa (tipoutilizador = 3)

## 📞 Suporte

Se encontrar problemas:
1. Verificar os logs do backend
2. Verificar o console do navegador
3. Confirmar que a base de dados foi atualizada
4. Verificar se todas as dependências estão instaladas

## 🎯 Próximos Passos

Após implementar estas funcionalidades, pode considerar:
- 📧 Sistema de notificações para empresas
- 📊 Relatórios detalhados
- 🔗 Integração com candidaturas de estudantes
- 📱 Interface mobile responsiva
