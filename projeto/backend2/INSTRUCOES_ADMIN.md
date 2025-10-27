# Funcionalidades do Administrador

Este documento descreve as novas funcionalidades implementadas para o administrador (idtuser = 1) na plataforma.

## Pré-requisitos

1. Execute o script SQL para adicionar os campos necessários:
```sql
-- Execute o arquivo add_admin_fields.sql na sua base de dados
```

2. O administrador deve estar autenticado com um token JWT válido.

## 1. Gestão de Estados das Propostas

### Rotas Disponíveis:

#### `GET /api/propostas/admin/todas`
- **Descrição**: Obter todas as propostas com detalhes completos
- **Autorização**: Apenas admin
- **Resposta**: Lista de todas as propostas com informações das empresas

#### `PUT /api/propostas/admin/:id/forcar-validacao`
- **Descrição**: Forçar validação/rejeição de proposta
- **Autorização**: Apenas admin
- **Body**:
```json
{
  "validada": true/false,
  "motivo_rejeicao": "Motivo da rejeição (opcional)"
}
```

#### `DELETE /api/propostas/admin/:id/forcar-eliminacao`
- **Descrição**: Eliminar proposta (mesmo se atribuída a estudante)
- **Autorização**: Apenas admin

#### Outras funcionalidades herdadas:
- `PUT /api/propostas/:id/validar` - Validar propostas (admin ou gestor)
- `PUT /api/propostas/:id/toggle-status` - Ativar/desativar propostas
- `PUT /api/propostas/:id/reativar` - Reativar propostas
- `PUT /api/propostas/:id/atribuir-estudante` - Atribuir a estudante

## 2. Submissão de Propostas por Empresas

### Rotas Disponíveis:

#### `GET /api/empresas/admin/lista`
- **Descrição**: Obter lista de todas as empresas (para formulário)
- **Autorização**: Apenas admin

#### `POST /api/propostas/admin/criar-por-empresa`
- **Descrição**: Criar proposta em nome de uma empresa
- **Autorização**: Apenas admin
- **Body**:
```json
{
  "idempresa": 1,
  "idtproposta": 1,
  "idtcontrato": 1,
  "categoria": "Categoria da proposta",
  "localizacao": "Localização",
  "nome": "Nome da proposta",
  "descricao": "Descrição detalhada",
  "vaga": "Descrição da vaga"
}
```

**Nota**: As propostas criadas pelo admin são automaticamente aprovadas.

## 3. Validação de Pedidos de Remoção de Estudantes

### Rotas Disponíveis:

#### `GET /api/utilizadores/admin/todos-estudantes`
- **Descrição**: Obter todos os estudantes (ativos e inativos)
- **Autorização**: Apenas admin

#### `PUT /api/utilizadores/admin/:id/aprovar-remocao`
- **Descrição**: Aprovar definitivamente a remoção de estudante
- **Autorização**: Apenas admin
- **Efeito**: Marca o estudante como inativo e removido pelo admin

#### `PUT /api/utilizadores/admin/:id/rejeitar-remocao`
- **Descrição**: Rejeitar pedido de remoção e reativar conta
- **Autorização**: Apenas admin
- **Efeito**: Reativa a conta e cancela o pedido de remoção

### Funcionalidades herdadas:
- `GET /api/utilizadores/estudantes/pedidos-remocao` - Ver pedidos pendentes
- `PUT /api/utilizadores/:id/aprovar-remocao` - Aprovação normal (gestor)
- `PUT /api/utilizadores/:id/rejeitar-remocao` - Rejeição normal (gestor)

## 4. Gestão de Estudantes e Ex-estudantes

### Rotas Disponíveis:

#### `POST /api/utilizadores/admin/criar-estudante`
- **Descrição**: Criar nova conta de estudante
- **Autorização**: Apenas admin
- **Body**:
```json
{
  "nome": "Nome do estudante",
  "email": "email@exemplo.com",
  "senha": "senha123",
  "curso": "Curso (opcional)",
  "ano": 2,
  "idade": 20,
  "interesses": "Interesses (opcional)",
  "competencias": "Competências (opcional)",
  "percurso": "Percurso académico (opcional)",
  "telefone": "123456789"
}
```

#### `PUT /api/utilizadores/admin/:id/alterar-credenciais`
- **Descrição**: Alterar credenciais de qualquer utilizador
- **Autorização**: Apenas admin
- **Body**:
```json
{
  "nome": "Novo nome (opcional)",
  "email": "novo@email.com (opcional)",
  "senha": "nova_senha (opcional)"
}
```

## Middleware de Autorização

### `verificarAdmin`
- Verifica se o utilizador tem `idtuser = 1`
- Usado para funcionalidades exclusivas do admin

### `verificarAdminOuGestor`
- Verifica se o utilizador tem `idtuser = 1` (admin) ou `idtuser = 2` (gestor)
- Usado para funcionalidades partilhadas entre admin e gestor

## Campos Adicionados na Base de Dados

### Tabela `utilizadores`:
- `removido_por_admin` (BOOLEAN): Indica se foi removido pelo admin

### Tabela `propostas`:
- `motivo_rejeicao` (TEXT): Motivo da rejeição da proposta

## Exemplos de Uso

### 1. Admin cria proposta para uma empresa:
```javascript
// 1. Obter lista de empresas
GET /api/empresas/admin/lista

// 2. Criar proposta
POST /api/propostas/admin/criar-por-empresa
{
  "idempresa": 5,
  "idtproposta": 1,
  "idtcontrato": 2,
  "nome": "Estágio em Desenvolvimento Web",
  "descricao": "Oportunidade de estágio...",
  "categoria": "Tecnologia",
  "localizacao": "Lisboa",
  "vaga": "1 vaga disponível"
}
```

### 2. Admin gere pedidos de remoção:
```javascript
// 1. Ver pedidos pendentes
GET /api/utilizadores/estudantes/pedidos-remocao

// 2. Aprovar remoção
PUT /api/utilizadores/admin/123/aprovar-remocao

// 3. Ou rejeitar e reativar
PUT /api/utilizadores/admin/123/rejeitar-remocao
```

### 3. Admin cria nova conta de estudante:
```javascript
POST /api/utilizadores/admin/criar-estudante
{
  "nome": "João Silva",
  "email": "joao.silva@email.com",
  "senha": "senha123",
  "curso": "Engenharia Informática",
  "ano": 3
}
```

## Notas Importantes

1. **Segurança**: Todas as rotas de admin verificam se o utilizador tem `idtuser = 1`
2. **Auditoria**: As ações do admin são registadas (validado_por, removido_por_admin)
3. **Flexibilidade**: O admin pode realizar ações que gestores normais não podem (ex: eliminar propostas atribuídas)
4. **Compatibilidade**: As funcionalidades existentes para gestores continuam a funcionar