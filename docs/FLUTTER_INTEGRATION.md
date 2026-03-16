# 📱 Integração com Flutter

## 1. Dependências Necessárias (pubspec.yaml)

```yaml
dependencies:
  flutter:
    sdk: flutter
  dio: ^5.3.0                    # HTTP Client
  provider: ^6.0.0              # State Management
  shared_preferences: ^2.2.0    # Armazenar token
  jwt_decoder: ^2.0.1           # Decodificar JWT
```

## 2. Configurar Dio (HTTP Client)

```dart
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  static final Dio _dio = Dio(
    BaseOptions(
      baseUrl: 'https://seu-app.railway.app/api',  // Produção
      // baseUrl: 'http://localhost:5000/api',       // Development
      connectTimeout: Duration(seconds: 30),
      receiveTimeout: Duration(seconds: 30),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ),
  );

  static void setupInterceptors() {
    // Adicionar token em todas requisições
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final prefs = await SharedPreferences.getInstance();
          final token = prefs.getString('auth_token');

          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }

          return handler.next(options);
        },
        onError: (error, handler) {
          // Tratar erro 401 (token expirado)
          if (error.response?.statusCode == 401) {
            // Limpar token e redirecionar para login
          }
          return handler.next(error);
        },
      ),
    );
  }

  static Future<T> get<T>(String path) async {
    try {
      final response = await _dio.get(path);
      return response.data;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  static Future<T> post<T>(String path, Map<String, dynamic> data) async {
    try {
      final response = await _dio.post(path, data: data);
      return response.data;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  static Future<T> put<T>(String path, Map<String, dynamic> data) async {
    try {
      final response = await _dio.put(path, data: data);
      return response.data;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  static Future<T> delete<T>(String path) async {
    try {
      final response = await _dio.delete(path);
      return response.data;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  static String _handleError(DioException error) {
    if (error.response != null) {
      return error.response?.data['message'] ?? 'Erro na requisição';
    } else if (error.type == DioExceptionType.connectionTimeout) {
      return 'Conexão expirou';
    } else if (error.type == DioExceptionType.unknown) {
      return 'Sem conexão com internet';
    } else {
      return 'Erro desconhecido';
    }
  }
}
```

## 3. Exemplo: Autenticação

```dart
// Login
final response = await ApiService.post('/auth/login', {
  'email': 'usuario@email.com',
  'senha': 'senha123',
});

final token = response['data']['token'];

// Salvar token
final prefs = await SharedPreferences.getInstance();
await prefs.setString('auth_token', token);

// Usa verificar token ainda é válido
import 'package:jwt_decoder/jwt_decoder.dart';

bool isTokenExpired(String token) {
  return JwtDecoder.isExpired(token);
}
```

## 4. Exemplo: Requisição GET (Listar Produtos)

```dart
final response = await ApiService.get('/produtos');
final produtos = response['data'] as List;

List<Product> productList = produtos
    .map((p) => Product.fromJson(p))
    .toList();
```

## 5. Exemplo: Requisição POST (Criar Avaliação)

```dart
final response = await ApiService.post(
  '/avaliacoes/produto/$produtoId',
  {
    'nota': 5,
    'comentario': 'Excelente produto!',
  },
);

print(response['message']); // "Avaliação criada com sucesso"
```

## 6. Tratar Erros na UI

```dart
try {
  final response = await ApiService.post('/auth/login', loginData);
  // Sucesso
  if (response['success']) {
    Navigator.pushReplacementNamed(context, '/home');
  }
} catch (e) {
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(content: Text('Erro: $e')),
  );
}
```

## 7. URL Base por Ambiente

```dart
// Usar variáveis de ambiente ou build flavors
class Config {
  static String get apiBaseUrl {
    const String env = String.fromEnvironment('ENV', defaultValue: 'dev');

    if (env == 'prod') {
      return 'https://seu-app.railway.app/api';
    } else if (env == 'staging') {
      return 'https://staging-app.railway.app/api';
    } else {
      return 'http://localhost:5000/api';
    }
  }
}

// Usar com: flutter run -d chrome --dart-define=ENV=prod
```

## 8. Build Flavors para Flutter (Recomendado)

**pubspec.yaml:**
```yaml
flutter:
  environments:
    dev:
      base_url: http://localhost:5000/api
    prod:
      base_url: https://seu-app.railway.app/api
```

**Executar:**
```bash
flutter run -t lib/main_dev.dart       # Development
flutter run -t lib/main_prod.dart      # Production
flutter build apk -t lib/main_prod.dart
```

## 9. Configuração de Headers Importantes

Se precisar enviar dados adicionais:

```dart
BaseOptions(
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'LJ-Flutter-App/1.0', // Seu identificador
  },
)
```

## 10. Fazer Requisição com Arquivo (Upload)

```dart
final formData = FormData.fromMap({
  'email': 'usuario@email.com',
  'comprovante': await MultipartFile.fromFile(
    imagePath,
    filename: 'comprovante.jpg',
  ),
});

final response = await _dio.post('/comprovantes/pix', data: formData);
```

## ⚠️ Importante para Produção no Railway

No seu `.env` do Railway, adicione seus domínios Flutter:

```ini
CORS_ORIGIN=http://localhost:5000,https://seu-app.railway.app
```

Se for usar o app mobile (Android/iOS), Flutter não usa CORS (é uma proteção do navegador).
Apenas configurar corretamente no servidor é suficiente.

## 🔐 Dica de Segurança

- Use HTTPS em produção (Railway oferece SSL grátis)
- Nunca exponha sua `JWT_SECRET`
- Valide o token no backend sempre
- Use refresh tokens se a sessão for longa
