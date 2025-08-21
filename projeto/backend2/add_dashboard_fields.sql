-- Script para adicionar campos necessários para o dashboard do gestor
-- Execute este script na sua base de dados PostgreSQL

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

-- 4. Adicionar comentários para documentação
COMMENT ON COLUMN propostas.validada IS 'Indica se a proposta foi validada pelo gestor';
COMMENT ON COLUMN propostas.data_validacao IS 'Data em que a proposta foi validada';
COMMENT ON COLUMN propostas.validado_por IS 'ID do gestor que validou a proposta';
COMMENT ON COLUMN utilizadores.ativo IS 'Indica se o utilizador está ativo na plataforma';
COMMENT ON COLUMN utilizadores.pedido_remocao IS 'Indica se o utilizador solicitou remoção da plataforma';
COMMENT ON COLUMN utilizadores.data_remocao IS 'Data em que o utilizador foi removido';
COMMENT ON COLUMN utilizadores.telefone IS 'Número de telefone do utilizador';

-- 5. Verificar se as alterações foram aplicadas
SELECT 
    'propostas' as tabela,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'propostas' 
AND column_name IN ('validada', 'data_validacao', 'validado_por')
ORDER BY column_name;

SELECT 
    'utilizadores' as tabela,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'utilizadores' 
AND column_name IN ('ativo', 'pedido_remocao', 'data_remocao', 'telefone')
ORDER BY column_name;
