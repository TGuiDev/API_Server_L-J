# 📱 Guia de Upload de Imagens - Flutter

## Como enviar imagens para a API

A partir de agora, **a API recebe a imagem como arquivo, salva em `/db/images` e retorna o caminho da imagem**.

### 1️⃣ Criar Categoria com Ícone

**Enviando arquivo:**
```dart
import 'package:http/http.dart' as http;
import 'dart:io';

Future<void> criarCategoriaComIcone(String nome, File iconeFile) async {
  final url = Uri.parse('https://seuapp.com/api/categorias');

  var request = http.MultipartRequest('POST', url)
    ..headers['Authorization'] = 'Bearer $token'
    ..fields['nome'] = nome
    ..fields['descricao'] = 'Descrição da categoria'
    ..files.add(
      await http.MultipartFile.fromPath(
        'icone', // Campo esperado pela API
        iconeFile.path,
        contentType: MediaType('image', 'jpeg'), // ou 'png', 'gif', 'webp'
      ),
    );

  final response = await request.send();
  final responseData = await response.stream.bytesToString();
  final json = jsonDecode(responseData);

  // A API retorna o caminho da imagem
  final imagemPath = json['data']['icone']; // Ex: /images/bebidas-1234567890.png
  print('Imagem salva em: $imagemPath');
}
```

### 2️⃣ Criar Produto com Imagem

```dart
Future<void> criarProdutoComImagem(Map<String, dynamic> dados, File imagemFile) async {
  final url = Uri.parse('https://seuapp.com/api/produtos');

  var request = http.MultipartRequest('POST', url)
    ..headers['Authorization'] = 'Bearer $token'
    ..fields['nome'] = dados['nome']
    ..fields['descricao'] = dados['descricao']
    ..fields['preco'] = dados['preco'].toString()
    ..fields['categoria'] = dados['categoria']
    ..fields['subcategoria'] = dados['subcategoria'] ?? ''
    ..fields['disponivel'] = dados['disponivel'].toString()
    ..fields['estoque'] = dados['estoque'].toString()
    ..files.add(
      await http.MultipartFile.fromPath(
        'imagem', // Campo esperado pela API
        imagemFile.path,
        contentType: MediaType('image', 'jpeg'),
      ),
    );

  final response = await request.send();
  final responseData = await response.stream.bytesToString();
  print(responseData);
}
```

### 3️⃣ Atualizar Categoria com Novo Ícone

```dart
Future<void> atualizarCategoriaComIcone(String categoriaId, File novoIcone) async {
  final url = Uri.parse('https://seuapp.com/api/categorias/$categoriaId');

  var request = http.MultipartRequest('PUT', url)
    ..headers['Authorization'] = 'Bearer $token'
    ..fields['nome'] = 'Novo Nome' // ou qualquer outro campo
    ..files.add(
      await http.MultipartFile.fromPath(
        'icone',
        novoIcone.path,
        contentType: MediaType('image', 'jpeg'),
      ),
    );

  final response = await request.send();
  final responseData = await response.stream.bytesToString();
  print(responseData);
}
```

### 4️⃣ Sem Arquivo (URL direta)

Se preferir enviar URL direto, ainda funciona:

```dart
Future<void> criarCategoriaComUrl(String nome, String iconeUrl) async {
  final url = Uri.parse('https://seuapp.com/api/categorias');

  final response = await http.post(
    url,
    headers: {
      'Authorization': 'Bearer $token',
      'Content-Type': 'application/json',
    },
    body: jsonEncode({
      'nome': nome,
      'descricao': 'Descrição',
      'icone': iconeUrl, // URL direto (não requer arquivo)
    }),
  );

  print(response.body);
}
```

## 📋 Formatos Aceitos

Imagens devem ser:
- **JPG/JPEG**
- **PNG**
- **GIF**
- **WebP**
- **SVG**

**Tamanho máximo:** 5MB

## 🔄 O que a API faz

1. ✅ Recebe o arquivo de imagem
2. ✅ Salva em `/db/images/` no servidor
3. ✅ Retorna o caminho relativo (ex: `/images/produto-1234567890.jpg`)
4. ✅ Salva o caminho no MongoDB junto com os dados

## 🖼️ Exibindo Imagens no Flutter

### Usando Image.network()

```dart
// Construir URL completa
final imageUrl = 'https://seu-api.com${caminhoDoItem}';

Image.network(
  imageUrl,
  width: 200,
  height: 200,
  fit: BoxFit.cover,
  loadingBuilder: (context, child, loadingProgress) {
    if (loadingProgress == null) return child;
    return CircularProgressIndicator(
      value: loadingProgress.expectedTotalBytes != null
          ? loadingProgress.cumulativeBytesLoaded / loadingProgress.expectedTotalBytes!
          : null,
    );
  },
  errorBuilder: (context, error, stackTrace) {
    return Icon(Icons.error);
  },
)
```

### Com Cache

```dart
import 'package:cached_network_image/cached_network_image.dart';

CachedNetworkImage(
  imageUrl: 'https://seu-api.com${caminhoDoItem}',
  width: 200,
  height: 200,
  fit: BoxFit.cover,
  placeholder: (context, url) => CircularProgressIndicator(),
  errorWidget: (context, url, error) => Icon(Icons.error),
)
```

## 📦 Pacotes Necessários (Flutter)

```yaml
dependencies:
  http: ^1.1.0
  image_picker: ^1.0.4
  cached_network_image: ^3.2.0  # Opcional, para cache melhor
```

## 🎯 Usando Image Picker

```dart
import 'package:image_picker/image_picker.dart';

final picker = ImagePicker();

// Selecionar do dispositivo
final pickedFile = await picker.pickImage(source: ImageSource.gallery);

if (pickedFile != null) {
  File imagemFile = File(pickedFile.path);
  await criarCategoriaComIcone('Minha Categoria', imagemFile);
}
```

## ✨ Vantagens desta Abordagem

✅ Menos problemas de tamanho no Flutter
✅ Conversão centralizada no backend
✅ Suporta também URL direta (fallback)
✅ Melhor control de validação de arquivo
✅ Imagem salva permanentemente no banco
