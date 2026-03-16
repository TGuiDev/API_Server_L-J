#!/usr/bin/env node

/**
 * Script de teste da API L&J
 * Valida endpoints principais da API
 *
 * Uso: node test-api.js
 * Ou: npm run test-api (se adicionar no package.json)
 */

const http = require('http');
const https = require('https');

// Configuração
const BASE_URL = process.env.API_URL || 'http://localhost:8080';
const API_PATH = '/api';

class APITester {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.results = [];
    this.token = null;
  }

  async makeRequest(method, path, body = null, headers = {}) {
    return new Promise((resolve, reject) => {
      const url = new URL(this.baseUrl + path);
      const isHttps = url.protocol === 'https:';
      const client = isHttps ? https : http;

      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      };

      if (this.token) {
        options.headers['Authorization'] = `Bearer ${this.token}`;
      }

      const req = client.request(url, options, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve({
              status: res.statusCode,
              body: data ? JSON.parse(data) : null,
              headers: res.headers,
            });
          } catch (e) {
            resolve({
              status: res.statusCode,
              body: data,
              headers: res.headers,
            });
          }
        });
      });

      req.on('error', reject);

      if (body) {
        req.write(JSON.stringify(body));
      }

      req.end();
    });
  }

  async testEndpoint(method, path, body = null, expectedStatus = 200, description = '') {
    try {
      console.log(`\n📍 Testando: ${description || `${method} ${path}`}`);

      const response = await this.makeRequest(method, `${API_PATH}${path}`, body);

      if (response.status === expectedStatus) {
        console.log(`✅ Status: ${response.status} (esperado: ${expectedStatus})`);
        this.results.push({
          test: description || `${method} ${path}`,
          status: 'PASS',
          statusCode: response.status,
        });
      } else {
        console.log(
          `❌ Status: ${response.status} (esperado: ${expectedStatus})`
        );
        this.results.push({
          test: description || `${method} ${path}`,
          status: 'FAIL',
          statusCode: response.status,
        });
      }

      if (response.body) {
        console.log(`Resposta: ${JSON.stringify(response.body, null, 2)}`);
      }

      return response;
    } catch (error) {
      console.error(`❌ Erro: ${error.message}`);
      this.results.push({
        test: description || `${method} ${path}`,
        status: 'ERROR',
        error: error.message,
      });
    }
  }

  async runTests() {
    console.log(`🚀 Iniciando testes da API L&J`);
    console.log(`API Base: ${this.baseUrl}${API_PATH}`);
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log('='.repeat(60));

    // 1. Health Check
    await this.testEndpoint('GET', '/health', null, 200, 'Health Check');

    // 2. Raiz da API
    await this.testEndpoint('GET', '', null, 200, 'API Root (GET /api)');

    // 3. Tentar listar produtos (sem autenticação)
    await this.testEndpoint(
      'GET',
      '/produtos',
      null,
      200,
      'Listar Produtos (público)'
    );

    // 4. Tentar listar categorias
    await this.testEndpoint(
      'GET',
      '/categorias',
      null,
      200,
      'Listar Categorias (público)'
    );

    // 5. Registrar novo usuário
    const testEmail = `test-${Date.now()}@test.com`;
    const registerResponse = await this.testEndpoint(
      'POST',
      '/auth/register',
      {
        nome: 'Usuário Teste',
        email: testEmail,
        senha: 'Senha@123',
        senhaConfirm: 'Senha@123',
      },
      201,
      'Registrar Novo Usuário'
    );

    if (registerResponse?.body?.data?.token) {
      this.token = registerResponse.body.data.token;
      console.log('✅ Token obtido para testes autenticados');
    }

    // 6. Tentar login
    if (!this.token) {
      const loginResponse = await this.testEndpoint(
        'POST',
        '/auth/login',
        {
          email: testEmail,
          senha: 'Senha@123',
        },
        200,
        'Login de Usuário'
      );

      if (loginResponse?.body?.data?.token) {
        this.token = loginResponse.body.data.token;
      }
    }

    // 7. Obter perfil (autenticado)
    if (this.token) {
      await this.testEndpoint(
        'GET',
        '/auth/perfil',
        null,
        200,
        'Obter Perfil (autenticado)'
      );

      // 8. Listar favoritos
      await this.testEndpoint(
        'GET',
        '/usuarios/favoritos/listar',
        null,
        200,
        'Listar Favoritos (autenticado)'
      );

      // 9. Meus pedidos
      await this.testEndpoint(
        'GET',
        '/pedidos/meus-pedidos',
        null,
        200,
        'Listar Meus Pedidos (autenticado)'
      );
    }

    // 10. Erro esperado - rota não existe
    await this.testEndpoint(
      'GET',
      '/rota-inexistente',
      null,
      404,
      'Rota Inexistente (404 esperado)'
    );

    console.log('\n' + '='.repeat(60));
    this.printResults();
  }

  printResults() {
    console.log('\n📊 RESUMO DOS TESTES:');
    console.log('='.repeat(60));

    const passed = this.results.filter((r) => r.status === 'PASS').length;
    const failed = this.results.filter((r) =>r.status === 'FAIL').length;
    const errors = this.results.filter((r) => r.status === 'ERROR').length;
    const total = this.results.length;

    console.log(`✅ Passou: ${passed}/${total}`);
    console.log(`❌ Falhou: ${failed}/${total}`);
    console.log(`⚠️  Erros: ${errors}/${total}`);

    console.log('\n📋 Detalhes:');
    this.results.forEach((result, index) => {
      const icon = {
        PASS: '✅',
        FAIL: '❌',
        ERROR: '⚠️',
      }[result.status];

      console.log(
        `${index + 1}. ${icon} ${result.test} - ${result.statusCode || result.error}`
      );
    });

    console.log('\n' + '='.repeat(60));
    if (failed === 0 && errors === 0) {
      console.log('🎉 Todos os testes passaram!');
    } else {
      console.log('⚠️  Existem testes falhados. Verifique os erros acima.');
    }
  }
}

// Executar testes
async function main() {
  const tester = new APITester(BASE_URL);

  try {
    await tester.runTests();
    process.exit(0);
  } catch (error) {
    console.error('Erro fatal:', error);
    process.exit(1);
  }
}

main();
