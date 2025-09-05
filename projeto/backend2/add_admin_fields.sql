-- Script para adicionar campos necessários para funcionalidades do administrador
-- Execute este script na sua base de dados PostgreSQL

-- 1. Adicionar campos à tabela utilizadores para controle do admin
ALTER TABLE utilizadores 
ADD COLUMN IF NOT EXISTS removido_por_admin BOOLEAN DEFAULT FALSE;

-- 2. Adicionar campo à tabela propostas para motivo de rejeição
ALTER TABLE propostas 
ADD COLUMN IF NOT EXISTS motivo_rejeicao TEXT;

-- 3. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_utilizadores_removido_por_admin ON utilizadores(removido_por_admin);
CREATE INDEX IF NOT EXISTS idx_propostas_motivo_rejeicao ON propostas(motivo_rejeicao) WHERE motivo_rejeicao IS NOT NULL;

-- 4. Adicionar comentários para documentação
COMMENT ON COLUMN utilizadores.removido_por_admin IS 'Indica se o utilizador foi removido pelo administrador';
COMMENT ON COLUMN propostas.motivo_rejeicao IS 'Motivo da rejeição da proposta pelo gestor/admin';

-- 5. Verificar se as alterações foram aplicadas
SELECT 
    'utilizadores' as tabela,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'utilizadores' 
AND column_name = 'removido_por_admin';

SELECT 
    'propostas' as tabela,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'propostas' 
AND column_name = 'motivo_rejeicao';

-- 6. Atualizar registos existentes (opcional)
-- Marcar como não removidos pelo admin todos os utilizadores existentes
UPDATE utilizadores SET removido_por_admin = FALSE WHERE removido_por_admin IS NULL;