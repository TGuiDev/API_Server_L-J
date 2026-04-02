# Exemplos de requisições para criar/atualizar produtos

A API espera `multipart/form-data` para `POST /api/produtos` e `PUT /api/produtos/:id` quando forem enviadas imagens.
Os endpoints de criação/atualização de produto exigem autenticação (token JWT no header `Authorization: Bearer <TOKEN>`).

Exemplo curl — criar produto (3 imagens):

```bash
curl -v -X POST "http://localhost:8080/api/produtos" \
  -H "Authorization: Bearer <SEU_TOKEN_AQUI>" \
  -F "nome=Pizza Margherita" \
  -F "descricao=Deliciosa pizza com molho de tomate e manjericão" \
  -F "preco=39.90" \
  -F "estoque=10" \
  -F "disponivel=true" \
  -F "categoria=<ID_CATEGORIA>" \
  -F "subcategoria=<NOME_SUBCATEGORIA>" \
  -F "ingredientes=[{\"nome\":\"Tomate\",\"quantidade\":\"100g\"}]" \
  -F "diasDisponiveis={\"monday\":true,\"tuesday\":true}" \
  -F "imagens=@/caminho/para/img1.jpg" \
  -F "imagens=@/caminho/para/img2.jpg" \
  -F "imagens=@/caminho/para/img3.jpg"
```

Exemplo curl — atualizar produto (substituir imagens com 2 novas imagens):

```bash
curl -v -X PUT "http://localhost:8080/api/produtos/<PRODUTO_ID>" \
  -H "Authorization: Bearer <SEU_TOKEN_AQUI>" \
  -F "nome=Pizza Margherita (Grande)" \
  -F "preco=45.00" \
  -F "imagens=@/caminho/para/new1.jpg" \
  -F "imagens=@/caminho/para/new2.jpg"
```

Observações:
- O campo `imagens` aceita de 1 a 5 arquivos. Se enviar arquivos, o servidor substituirá as imagens existentes.
- Campos complexos como `ingredientes` e `diasDisponiveis` devem ser enviados como strings JSON no form-data.

Exemplo Dart/Dio (envio multipart) — criar produto:

```dart
import 'dart:io';
import 'dart:typed_data';
import 'package:dio/dio.dart';

final dio = Dio(BaseOptions(baseUrl: 'http://localhost:8080'));
final token = '<SEU_TOKEN_AQUI>';

dio.options.headers['Authorization'] = 'Bearer $token';

final formData = FormData.fromMap({
  'nome': 'Pizza Margherita',
  'descricao': 'Deliciosa pizza com molho e manjericão',
  'preco': '39.90',
  'estoque': '10',
  'disponivel': 'true',
  'categoria': '<ID_CATEGORIA>',
  'subcategoria': '<NOME_SUBCATEGORIA>',
  'ingredientes': '[{"nome":"Tomate","quantidade":"100g"}]',
  'diasDisponiveis': '{"monday":true,"tuesday":true}',
  'imagens': [
    await MultipartFile.fromFile('/caminho/para/img1.jpg', filename: 'img1.jpg'),
    await MultipartFile.fromFile('/caminho/para/img2.jpg', filename: 'img2.jpg'),
  ],
});

final resp = await dio.post('/api/produtos', data: formData);
print(resp.data);
```

Exemplo Dart/Dio — atualizar produto (com novas imagens):

```dart
final formData = FormData.fromMap({
  'nome': 'Pizza Margherita (Grande)',
  'preco': '45.00',
  'imagens': [
    await MultipartFile.fromFile('/caminho/para/new1.jpg', filename: 'new1.jpg'),
    await MultipartFile.fromFile('/caminho/para/new2.jpg', filename: 'new2.jpg'),
  ],
});

final resp = await dio.put('/api/produtos/<PRODUTO_ID>', data: formData);
print(resp.data);
```

Se preferir, eu posso também gerar exemplos de `curl` para endpoints de banners (criar/editar) e exemplos em Flutter usando `AdminService` já presente no projeto.
