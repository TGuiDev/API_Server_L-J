# ✅ Upload de Imagens - Implementação Completa

## 📋 O que foi implementado

### 1. **Novo Middleware: `uploadMiddleware.js`**
- Configuração do Multer para salvar arquivos em **`/db/images`**
- Validação de tipos de arquivo (JPEG, PNG, GIF, WebP, SVG)
- Limite de tamanho: 5MB
- **Geração de nomes únicos** para os arquivos

### 2. **Rota Estática no Server**
- Configuração em `server.js` para servir arquivos da pasta `/db/images`
- Acesso via `GET /images/:filename`

### 3. **Controllers Atualizados**
- ✅ `categoryController.js` - Suporta upload de ícone
- ✅ `productController.js` - Suporta upload de imagem

### 4. **Rotas Atualizadas**
- ✅ `POST /categorias` - Upload de ícone ao criar
- ✅ `PUT /categorias/:id` - Upload de ícone ao atualizar
- ✅ `POST /produtos` - Upload de imagem ao criar
- ✅ `PUT /produtos/:id` - Upload de imagem ao atualizar

### 5. **Mudanças no Schema de Validação (Joi)**
- `icone` e `imagem` agora são **opcionais**
- Funciona com **arquivo (multipart)** OU **URL direta (JSON)**

## 🔄 Fluxo da Requisição

```
Flutter envia arquivo
    ↓
API recebe via Multer
    ↓
Arquivo é salvo em /db/images com nome único
    ↓
Caminho da imagem è retornado (/images/filename)
    ↓
API salva o caminho no MongoDB
    ↓
Flutter recebe o caminho
    ↓
Flutter usa Image.network(baseUrl + caminho)
```

## 📝 Exemplo de Requisição (cURL)

### Criar Categoria com Ícone:
```bash
curl -X POST http://localhost:3000/api/categorias \
  -H "Authorization: Bearer SEU_TOKEN" \
  -F "nome=Bebidas" \
  -F "descricao=Bebidas em geral" \
  -F "icone=@/caminho/para/imagem.png"
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "nome": "Bebidas",
    "icone": "/images/imagem-1711012345678.png",
    "subcategorias": [],
    "ativo": true
  }
}
```

### Criar Produto com Imagem:
```bash
curl -X POST http://localhost:3000/api/produtos \
  -H "Authorization: Bearer SEU_TOKEN" \
  -F "nome=Suco Natural" \
  -F "descricao=Suco de laranja fresco" \
  -F "preco=12.90" \
  -F "categoria=ID_CATEGORIA" \
  -F "disponivel=true" \
  -F "estoque=50" \
  -F "imagem=@/caminho/para/produto.jpg"
```

## 🗂️ Estrutura de Diretórios

```
/db
├── /images           # Pasta com as imagens
│   ├── produto-1711012345678.jpg
│   ├── bebidas-1711012345679.png
│   └── .gitkeep      # Mantém a pasta no git
└── (outros arquivos do banco)
```

## 🌐 Acessando as Imagens

```
GET http://localhost:3000/images/produto-1711012345678.jpg
GET https://seu-api.com/images/bebidas-1711012345679.png
```

## ⚙️ Configurações Atuais

| Configuração | Valor |
|---|---|
| Armazenamento | Disco local (`/db/images`) |
| Tipos aceitos | JPEG, PNG, GIF, WebP, SVG |
| Tamanho máximo | 5MB |
| Nomeação | `{nome-original}-{timestamp}-{random}.ext` |
| Fallback | Ainda suporta URL direta |

## 🔒 Validações

✅ Tipo de arquivo obrigatório
✅ Tamanho máximo respeitado
✅ Autenticação requerida (admin)
✅ Arquivo é opcional (URL também funciona)
✅ Nomes únicos para evitar conflitos

## Git e Deploy

### .gitignore
A pasta `/db/images/*` é ignorada no git (não subir imagens para repositório).

O arquivo `.gitkeep` mantém a pasta estruturada mesmo sem arquivos.

### Railway (Deploy)
As imagens são criadas em `/db/images` localmente durante o deploy. Em ambiente de produção, considere migrar para serviço de storage externo (S3, Google Cloud Storage, etc).

## 💡 Próximos Passos Opcionais

Se quiser melhorias futuras:

1. **Salvar em Cloud Storage** (AWS S3, Google Cloud, Azure Blob)
   - Ao invés de disco, salvar na cloud
   - Melhor escalabilidade

2. **Otimizar tamanho de imagem** (compressão)
   - Usar bibliotecas como Sharp
   - Gerar thumbnails

3. **CDN**
   - CloudFlare, AWS CloudFront
   - Melhor performance global

## 📞 Troubleshooting

### Erro: "ENOENT: no such file or directory"
- Certifique-se de que `/db/images` foi criado
- O middleware cria automaticamente se não existir

### Erro: "File too large"
- Comprima a imagem antes de enviar
- Limite é 5MB

### Erro 401 (Unauthorized)
- Verifique o token de autenticação
- Admin role é obrigatório

### Erro 400 (Bad Request)
- Verifique o tipo de arquivo
- Apenas JPEG, PNG, GIF, WebP, SVG são aceitos

### Imagem não carrega no Flutter
- Verifique se a URL está correta
- Use `https://seu-api.com/images/arquivo.jpg`
- Verifique CORS no servidor
