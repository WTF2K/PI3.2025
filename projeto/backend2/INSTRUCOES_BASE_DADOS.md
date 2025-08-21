# 🔧 Instruções para Aplicar Alterações na Base de Dados

## ⚠️ Problema Atual

O sistema está a funcionar em **modo temporário** porque os novos campos não existem na base de dados. Para ter acesso completo às funcionalidades do dashboard, é necessário aplicar as alterações na base de dados.

## 🚀 Como Resolver

### Passo 1: Executar o Script SQL

1. **Abra o pgAdmin** ou outro cliente PostgreSQL
2. **Conecte-se à sua base de dados**
3. **Execute o script** `fix-database.sql` que está na pasta `projeto/backend2/`

```sql
-- Copie e cole o conteúdo do arquivo fix-database.sql no seu cliente PostgreSQL
```

### Passo 2: Verificar se Funcionou

Execute estas queries para verificar se os campos foram adicionados:

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

### Passo 3: Reiniciar o Backend

Após aplicar as alterações, reinicie o servidor:

```bash
# Parar o servidor atual (Ctrl+C)
# Depois reiniciar
cd projeto/backend2
npm start
```

### Passo 4: Ativar Funcionalidades Completas

Após aplicar as alterações na base de dados, é necessário:

1. **Restaurar os modelos Sequelize** (remover comentários temporários)
2. **Restaurar os controllers** (remover código temporário)
3. **Restaurar os dashboards** (remover código temporário)

## 📋 Campos que Serão Adicionados

### Tabela `propostas`
- `validada` (BOOLEAN) - Status de validação
- `data_validacao` (DATE) - Data da validação
- `validado_por` (INTEGER) - ID do gestor que validou

### Tabela `utilizadores`
- `ativo` (BOOLEAN) - Status ativo/inativo
- `pedido_remocao` (BOOLEAN) - Pedidos de remoção
- `data_remocao` (DATE) - Data de remoção
- `telefone` (VARCHAR) - Número de telefone

## 🔄 Estado Atual vs Estado Completo

### Estado Atual (Temporário)
- ✅ Dashboard básico funciona
- ✅ Lista de estudantes funciona
- ❌ Validação de propostas (simulada)
- ❌ Gestão de pedidos de remoção (desabilitada)
- ❌ Estatísticas detalhadas (simuladas)

### Estado Completo (Após Alterações)
- ✅ Dashboard completo com estatísticas reais
- ✅ Validação de propostas funcional
- ✅ Gestão de pedidos de remoção
- ✅ Filtros por status funcionais
- ✅ Todas as funcionalidades ativas

## 🆘 Se Tiver Problemas

1. **Verifique as permissões** da base de dados
2. **Confirme que está na base de dados correta**
3. **Verifique os logs do backend** para erros
4. **Teste as APIs** individualmente

## 📞 Suporte

Se precisar de ajuda para aplicar estas alterações, consulte:
- Documentação do PostgreSQL
- Logs do servidor backend
- Console do navegador para erros de frontend
