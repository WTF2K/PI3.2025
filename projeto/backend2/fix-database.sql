-- Script para adicionar campos necessários para o dashboard do gestor
-- Execute este script na sua base de dados PostgreSQL

-- 1. Adicionar campos à tabela propostas (se não existirem)
DO $$ 
BEGIN
    -- Adicionar campo validada
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'propostas' AND column_name = 'validada') THEN
        ALTER TABLE propostas ADD COLUMN validada BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Campo validada adicionado à tabela propostas';
    ELSE
        RAISE NOTICE 'Campo validada já existe na tabela propostas';
    END IF;
    
    -- Adicionar campo data_validacao
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'propostas' AND column_name = 'data_validacao') THEN
        ALTER TABLE propostas ADD COLUMN data_validacao DATE;
        RAISE NOTICE 'Campo data_validacao adicionado à tabela propostas';
    ELSE
        RAISE NOTICE 'Campo data_validacao já existe na tabela propostas';
    END IF;
    
    -- Adicionar campo validado_por
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'propostas' AND column_name = 'validado_por') THEN
        ALTER TABLE propostas ADD COLUMN validado_por INTEGER REFERENCES utilizadores(iduser);
        RAISE NOTICE 'Campo validado_por adicionado à tabela propostas';
    ELSE
        RAISE NOTICE 'Campo validado_por já existe na tabela propostas';
    END IF;
END $$;

-- 2. Adicionar campos à tabela utilizadores (se não existirem)
DO $$ 
BEGIN
    -- Adicionar campo ativo
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'utilizadores' AND column_name = 'ativo') THEN
        ALTER TABLE utilizadores ADD COLUMN ativo BOOLEAN DEFAULT TRUE;
        RAISE NOTICE 'Campo ativo adicionado à tabela utilizadores';
    ELSE
        RAISE NOTICE 'Campo ativo já existe na tabela utilizadores';
    END IF;
    
    -- Adicionar campo pedido_remocao
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'utilizadores' AND column_name = 'pedido_remocao') THEN
        ALTER TABLE utilizadores ADD COLUMN pedido_remocao BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Campo pedido_remocao adicionado à tabela utilizadores';
    ELSE
        RAISE NOTICE 'Campo pedido_remocao já existe na tabela utilizadores';
    END IF;
    
    -- Adicionar campo data_remocao
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'utilizadores' AND column_name = 'data_remocao') THEN
        ALTER TABLE utilizadores ADD COLUMN data_remocao DATE;
        RAISE NOTICE 'Campo data_remocao adicionado à tabela utilizadores';
    ELSE
        RAISE NOTICE 'Campo data_remocao já existe na tabela utilizadores';
    END IF;
    
    -- Adicionar campo telefone
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'utilizadores' AND column_name = 'telefone') THEN
        ALTER TABLE utilizadores ADD COLUMN telefone VARCHAR(20);
        RAISE NOTICE 'Campo telefone adicionado à tabela utilizadores';
    ELSE
        RAISE NOTICE 'Campo telefone já existe na tabela utilizadores';
    END IF;
END $$;

-- 3. Criar índices (se não existirem)
CREATE INDEX IF NOT EXISTS idx_propostas_validada ON propostas(validada);
CREATE INDEX IF NOT EXISTS idx_utilizadores_ativo ON utilizadores(ativo);
CREATE INDEX IF NOT EXISTS idx_utilizadores_pedido_remocao ON utilizadores(pedido_remocao);
CREATE INDEX IF NOT EXISTS idx_utilizadores_idtuser ON utilizadores(idtuser);

-- 4. Verificar se as alterações foram aplicadas
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

-- 5. Garantir que existe uma constraint UNIQUE em utilizadores(iduser)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM   pg_constraint c
        JOIN   pg_class     t ON t.oid = c.conrelid
        JOIN   pg_namespace n ON n.oid = t.relnamespace
        WHERE  c.contype = 'u'
        AND    t.relname = 'utilizadores'
        AND    n.nspname = 'public'
        AND    c.conname = 'utilizadores_iduser_unique'
    ) THEN
        BEGIN
            ALTER TABLE public.utilizadores
            ADD CONSTRAINT utilizadores_iduser_unique UNIQUE (iduser);
            RAISE NOTICE 'Constraint UNIQUE criada em utilizadores(iduser)';
        EXCEPTION WHEN others THEN
            RAISE NOTICE 'Falha ao criar UNIQUE em utilizadores(iduser): %', SQLERRM;
        END;
    ELSE
        RAISE NOTICE 'Constraint UNIQUE utilizadores_iduser_unique já existe';
    END IF;
END $$;