-- Habilita extensão para geração de UUID se necessário
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Cria a tabela de Categorias
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- Cria a tabela de Subcategorias
CREATE TABLE IF NOT EXISTS public.subcategories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- Cria a tabela de Produtos
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    ingredients TEXT,
    images JSONB DEFAULT '[]'::jsonb,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE
    SET NULL,
        available_days JSONB DEFAULT '{}'::jsonb,
        stock_quantity INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- Adiciona políticas de segurança (RLS - Row Level Security)
-- Como o controle de acesso (admin) parece ser feito na API (NestJS) com o service role,
-- podemos deixar liberado ou criar políticas simples.
-- Se a API acessa usando o anon key e requer autenticação do usuário, usamos:
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
-- Políticas para permitir leitura pública (ou logado)
CREATE POLICY "Leitura de categorias permitida para todos" ON public.categories FOR
SELECT USING (true);
CREATE POLICY "Leitura de subcategorias permitida para todos" ON public.subcategories FOR
SELECT USING (true);
CREATE POLICY "Leitura de produtos permitida para todos" ON public.products FOR
SELECT USING (true);
-- Políticas para permitir inserção/atualização/deleção para usuários autenticados (ou ajuste conforme sua lógica)
CREATE POLICY "Inserção admin categorias" ON public.categories FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Inserção admin subcategorias" ON public.subcategories FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Inserção admin produtos" ON public.products FOR ALL USING (auth.uid() IS NOT NULL);
-- Adiciona a coluna que guardará a ordem na Categoria
ALTER TABLE categories
ADD COLUMN order_index INTEGER DEFAULT 0;
-- Adiciona a coluna que guardará a ordem na Subcategoria
ALTER TABLE subcategories
ADD COLUMN order_index INTEGER DEFAULT 0;
ALTER TABLE products
ADD COLUMN price NUMERIC DEFAULT 0;
-- Cria a tabela de favoritos
CREATE TABLE public.favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    -- Garante que um usuário não possa favoritar o mesmo produto mais de uma vez
    UNIQUE(user_id, product_id)
);
-- (Opcional, mas recomendado) Cria índices para deixar as buscas mais rápidas
CREATE INDEX idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX idx_favorites_product_id ON public.favorites(product_id);