-- Script para adicionar campos necessários para as funcionalidades das empresas
-- Execute este script na sua base de dados PostgreSQL

-- 1. Adicionar campos à tabela propostas para controlo de status e atribuição
DO $$ 
BEGIN
    -- Adicionar campo ativa
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'propostas' AND column_name = 'ativa') THEN
        ALTER TABLE propostas ADD COLUMN ativa BOOLEAN DEFAULT TRUE;
        RAISE NOTICE 'Campo ativa adicionado à tabela propostas';
    ELSE
        RAISE NOTICE 'Campo ativa já existe na tabela propostas';
    END IF;
    
    -- Adicionar campo atribuida_estudante
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'propostas' AND column_name = 'atribuida_estudante') THEN
        ALTER TABLE propostas ADD COLUMN atribuida_estudante BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Campo atribuida_estudante adicionado à tabela propostas';
    ELSE
        RAISE NOTICE 'Campo atribuida_estudante já existe na tabela propostas';
    END IF;
    
    -- Adicionar campo id_estudante_atribuido
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'propostas' AND column_name = 'id_estudante_atribuido') THEN
        ALTER TABLE propostas ADD COLUMN id_estudante_atribuido INTEGER REFERENCES utilizadores(iduser);
        RAISE NOTICE 'Campo id_estudante_atribuido adicionado à tabela propostas';
    ELSE
        RAISE NOTICE 'Campo id_estudante_atribuido já existe na tabela propostas';
    END IF;
    
    -- Adicionar campo data_atribuicao
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'propostas' AND column_name = 'data_atribuicao') THEN
        ALTER TABLE propostas ADD COLUMN data_atribuicao DATE;
        RAISE NOTICE 'Campo data_atribuicao adicionado à tabela propostas';
    ELSE
        RAISE NOTICE 'Campo data_atribuicao já existe na tabela propostas';
    END IF;
END $$;

-- 2. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_propostas_ativa ON propostas(ativa);
CREATE INDEX IF NOT EXISTS idx_propostas_atribuida_estudante ON propostas(atribuida_estudante);
CREATE INDEX IF NOT EXISTS idx_propostas_idempresa ON propostas(idempresa);
CREATE INDEX IF NOT EXISTS idx_propostas_id_estudante_atribuido ON propostas(id_estudante_atribuido);

-- 3. Atualizar propostas existentes para terem os valores padrão corretos
UPDATE propostas SET 
    ativa = COALESCE(ativa, TRUE),
    atribuida_estudante = COALESCE(atribuida_estudante, FALSE)
WHERE ativa IS NULL OR atribuida_estudante IS NULL;

-- 4. Verificar se as alterações foram aplicadas
SELECT 
    'propostas' as tabela,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'propostas' 
AND column_name IN ('ativa', 'atribuida_estudante', 'id_estudante_atribuido', 'data_atribuicao')
ORDER BY column_name;

-- 5. Mostrar estatísticas das propostas
SELECT 
    'Estatísticas das Propostas' as info,
    COUNT(*) as total_propostas,
    COUNT(CASE WHEN ativa = TRUE THEN 1 END) as propostas_ativas,
    COUNT(CASE WHEN ativa = FALSE THEN 1 END) as propostas_inativas,
    COUNT(CASE WHEN atribuida_estudante = TRUE THEN 1 END) as propostas_atribuidas,
    COUNT(CASE WHEN atribuida_estudante = FALSE THEN 1 END) as propostas_nao_atribuidas
FROM propostas;
