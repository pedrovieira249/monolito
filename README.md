# Monolito Modularizado — TypeScript

Projeto de estudo que implementa um **monólito modularizado** em TypeScript, aplicando **Clean Architecture**, **SOLID** e **Design Patterns**. A proposta é organizar um sistema monolítico de forma que cada módulo possua responsabilidade isolada e se comunique com os demais apenas por meio de **Facades**, preservando os limites arquiteturais entre os domínios.

Além dos módulos internos, o projeto expõe uma **camada de API REST** construída com Express, permitindo que o fluxo completo de uma compra seja executado via requisições HTTP.

---

## Sumário

- [Sobre o projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Subindo a API](#subindo-a-api)
- [Endpoints disponíveis](#endpoints-disponíveis)
- [Executando os testes](#executando-os-testes)
  - [Suite completa](#suite-completa-todos-os-testes)
  - [Testes E2E da API](#testes-e2e-da-api)
  - [Testes por módulo](#testes-por-módulo)
- [Arquitetura](#arquitetura)

---

## Sobre o projeto

Ao contrário de microsserviços, um monólito modularizado mantém tudo em um único processo, mas organiza o código em módulos independentes que se comportam como "mini-sistemas". Cada módulo encapsula seu próprio domínio, regras de negócio, persistência e casos de uso — expondo ao mundo externo apenas uma interface simplificada (Facade).

A comunicação entre módulos **nunca** acontece diretamente entre repositórios ou entidades. Todo acesso se dá pela Facade do módulo alvo, garantindo isolamento e substituibilidade.

### Módulos implementados

| Módulo | Responsabilidade |
|---|---|
| **client-adm** | Cadastro e consulta de clientes |
| **product-adm** | Gerenciamento de produtos (criação, atualização, exclusão, estoque) |
| **store-product** | Catálogo de produtos disponíveis para venda |
| **payment** | Processamento de pagamentos e transações |
| **invoice** | Geração e consulta de notas fiscais |
| **checkout** | Orquestra o fluxo completo de uma compra (cliente → produtos → pagamento → nota fiscal) |

### Estrutura de cada módulo

Todos os módulos seguem o mesmo padrão interno:

```
<modulo>/
├── domain/          # Entidades, Value Objects e regras de negócio puras
├── gateway/         # Interfaces dos repositórios (ports)
├── usecase/         # Casos de uso da aplicação
├── repository/      # Implementação da persistência (Sequelize + SQLite)
├── facade/          # API pública do módulo (único ponto de entrada externo)
└── factory/         # Montagem do grafo de dependências (composição root)
```

### Fluxo de uma compra (checkout)

Ao chamar `POST /checkout`, o seguinte fluxo acontece internamente:

```
HTTP Request
    └─▶ CheckoutFacade.placeOrder()
            └─▶ PlaceOrderUseCase
                    ├─▶ ClientAdmFacade   → valida se o cliente existe
                    ├─▶ ProductAdmFacade  → verifica estoque de cada produto
                    ├─▶ StoreCatalogFacade → busca preço de venda dos produtos
                    ├─▶ PaymentFacade     → processa o pagamento
                    └─▶ InvoiceFacade     → gera a nota fiscal (se aprovado)
```

> O pagamento é **aprovado** automaticamente quando o valor total da compra é **maior ou igual a R$ 100,00**.

---

## Tecnologias

| Tecnologia | Função |
|---|---|
| **TypeScript** | Tipagem estática e código mais seguro |
| **Express** | Framework web para a camada de API REST |
| **Sequelize + SQLite** | ORM + banco de dados (SQLite em memória nos testes) |
| **Jest + SWC** | Testes automatizados com compilação rápida |
| **Supertest** | Testes E2E da API sem precisar subir um servidor real |
| **Node.js** | Runtime de execução |

---

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** >= 16
- **npm** >= 8

Para verificar as versões instaladas:

```bash
node --version
npm --version
```

---

## Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd monolito
```

### 2. Instale as dependências

```bash
npm install
```

> Caso ainda não tenha o Node.js instalado, veja as instruções abaixo de acordo com seu sistema operacional.

<details>
<summary><strong>Instalar Node.js no Linux</strong></summary>

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```
</details>

<details>
<summary><strong>Instalar Node.js no macOS</strong></summary>

```bash
brew install node
```
</details>

<details>
<summary><strong>Instalar Node.js no Windows</strong></summary>

```powershell
winget install OpenJS.NodeJS
```
</details>

> **Alternativa universal:** baixe o instalador diretamente em [nodejs.org](https://nodejs.org).

---

## Subindo a API

O projeto inclui uma API REST que expõe os módulos do monólito via HTTP.

### Passo a passo

**1. Certifique-se de ter instalado as dependências:**

```bash
npm install
```

**2. Compile o TypeScript para JavaScript:**

```bash
npm run tsc
```

**3. Inicie o servidor:**

```bash
node dist/api/server.js
```

A API estará disponível em: `http://localhost:3000`

> **Dica:** Para desenvolvimento, você pode usar `ts-node` para executar sem compilar:
>
> ```bash
> npx ts-node src/api/server.ts
> ```

---

## Endpoints disponíveis

> Todas as rotas recebem e retornam JSON. Use o header `Content-Type: application/json` nas requisições.

### `POST /products` — Cadastrar produto

Cadastra um novo produto no sistema. Este produto ficará disponível para compra no catálogo.

**Body:**
```json
{
    "name": "Notebook",
    "description": "Notebook com 16GB de RAM",
    "purchasePrice": 3000,
    "salesPrice": 3500,
    "stock": 10
}
```

> `purchasePrice` é o custo de aquisição do produto. `salesPrice` é o preço cobrado do cliente no checkout.

**Resposta 201:**
```json
{
    "id": "a1b2c3d4-...",
    "name": "Notebook",
    "description": "Notebook com 16GB de RAM",
    "purchasePrice": 3000,
    "salesPrice": 3500,
    "stock": 10
}
```

**Erros de validação (400):**

| Campo | Condição de erro |
|---|---|
| `name` | Ausente ou não é texto |
| `description` | Ausente ou não é texto |
| `purchasePrice` | Ausente ou não é número maior que zero |
| `salesPrice` | Ausente ou não é número maior que zero |
| `stock` | Não é inteiro maior ou igual a zero |

Exemplo de resposta 400:
```json
{ "error": "Campo 'salesPrice' é obrigatório e deve ser um número maior que zero." }
```

---

### `POST /clients` — Cadastrar cliente

Cadastra um novo cliente que poderá realizar compras.

**Body:**
```json
{
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "address": "Rua das Flores, 123"
}
```

**Resposta 201:**
```json
{
    "id": "e5f6g7h8-...",
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "address": "Rua das Flores, 123",
    "createdAt": "2026-03-24T10:00:00.000Z",
    "updatedAt": "2026-03-24T10:00:00.000Z"
}
```

**Erros de validação (400):**

| Campo | Condição de erro |
|---|---|
| `name` | Ausente ou não é texto |
| `email` | Ausente, não é texto ou formato inválido |
| `address` | Ausente ou não é texto |

Exemplo de resposta 400:
```json
{ "error": "Campo 'email' é obrigatório e deve ser um e-mail válido." }
```

---

### `POST /checkout` — Realizar compra

Executa o fluxo completo de uma compra: valida cliente, verifica estoque, processa pagamento e (se aprovado) gera a nota fiscal.

**Body:**
```json
{
    "clientId": "e5f6g7h8-...",
    "products": [
        { "productId": "a1b2c3d4-...", "quantity": 1 },
        { "productId": "b2c3d4e5-...", "quantity": 2 }
    ]
}
```

**Resposta 200 — Pagamento aprovado (total >= R$ 100):**
```json
{
    "id": "ordem-uuid",
    "clientId": "e5f6g7h8-...",
    "invoiceId": "nota-fiscal-uuid",
    "total": 3000,
    "status": "approved",
    "products": [
        { "productId": "a1b2c3d4-...", "quantity": 1 }
    ]
}
```

**Resposta 200 — Pagamento pendente (total < R$ 100):**
```json
{
    "id": "ordem-uuid",
    "clientId": "e5f6g7h8-...",
    "invoiceId": null,
    "total": 50,
    "status": "pending",
    "products": [...]
}
```

> Quando o total é menor que R$ 100,00, o pagamento fica com status `"pending"` e **nenhuma nota fiscal é gerada** (`invoiceId: null`).

**Erros de validação (400):**

| Campo | Condição de erro |
|---|---|
| `clientId` | Ausente ou não é texto |
| `products` | Ausente, não é array ou array vazio |
| `products[].productId` | Ausente ou não é texto em algum item |
| `products[].quantity` | Ausente, não é inteiro ou valor menor ou igual a zero em algum item |

Exemplo de resposta 400:
```json
{ "error": "Cada produto deve ter um 'quantity' inteiro maior que zero." }
```

**Erro de negócio (500):**
```json
{ "error": "Client not found" }
```

---

### `GET /invoice/:id` — Consultar nota fiscal

Retorna os detalhes de uma nota fiscal gerada após uma compra aprovada.

**Exemplo:** `GET /invoice/nota-fiscal-uuid`

**Resposta 200:**
```json
{
    "id": "nota-fiscal-uuid",
    "name": "João Silva",
    "document": "joao@exemplo.com",
    "address": {
        "street": "Rua das Flores, 123",
        "number": "0",
        "complement": "",
        "city": "",
        "state": "",
        "zipCode": ""
    },
    "items": [
        { "id": "a1b2c3d4-...", "name": "Notebook", "price": 3000 }
    ],
    "total": 3000,
    "createdAt": "2026-03-24T10:00:00.000Z"
}
```

**Resposta 404** — ID de nota fiscal não encontrado.

---

## Executando os testes

O projeto possui dois tipos de testes:

- **Testes unitários / de integração** — validam cada módulo de forma isolada (use cases, facades, repositórios)
- **Testes E2E** — simulam requisições HTTP reais à API e validam o comportamento ponta a ponta

Todos os testes usam **SQLite em memória**, portanto nenhuma configuração de banco de dados é necessária.

---

### Suite completa (todos os testes)

Executa todos os testes do projeto de uma só vez — unitários, de integração e E2E:

```bash
npm test
```

Para ver o detalhe de cada asserção (recomendado ao investigar falhas):

```bash
npm test -- --verbose
```

---

### Testes E2E da API

Os testes E2E estão em `src/api/app.e2e.spec.ts` e cobrem todos os endpoints. Eles sobem o app Express em memória via **Supertest** — sem necessidade de iniciar o servidor manualmente.

**Coberturas dos testes E2E (17 testes):**

| Endpoint | Cenário testado | Esperado |
|---|---|---|
| `POST /products` | Payload válido | 201 |
| `POST /products` | Campo `name` ausente | 400 |
| `POST /products` | `purchasePrice` negativo | 400 |
| `POST /products` | Campo `salesPrice` ausente | 400 |
| `POST /products` | `stock` com valor decimal | 400 |
| `POST /clients` | Payload válido | 201 |
| `POST /clients` | Campo `email` ausente | 400 |
| `POST /clients` | Formato de e-mail inválido | 400 |
| `POST /clients` | Campo `address` ausente | 400 |
| `POST /checkout` | Compra aprovada (total >= 100) | 200, `status: "approved"` |
| `POST /checkout` | Compra pendente (total < 100) | 200, `status: "pending"`, `invoiceId: null` |
| `POST /checkout` | Campo `clientId` ausente | 400 |
| `POST /checkout` | Array `products` vazio | 400 |
| `POST /checkout` | `quantity` igual a zero | 400 |
| `POST /checkout` | Cliente inexistente | 500 |
| `GET /invoice/:id` | Invoice de compra aprovada | 200 |
| `GET /invoice/:id` | ID inexistente | 404 |

**Executar apenas os testes E2E:**

```bash
npm test -- --testPathPattern=app.e2e.spec.ts
```

**Com saída detalhada:**

```bash
npm test -- --testPathPattern=app.e2e.spec.ts --verbose
```

---

### Testes por módulo

#### checkout

```bash
# Todos os testes do módulo
npm test -- --testPathPattern=checkout

# Apenas o use case de realização de pedido
npm test -- --testPathPattern=place-order.usecase.spec.ts
```

#### client-adm

```bash
# Todos os testes do módulo
npm test -- --testPathPattern=client-adm

# Apenas o repositório
npm test -- --testPathPattern=client.repository.spec.ts

# Apenas a facade
npm test -- --testPathPattern=client-adm.facade.spec.ts

# Apenas o use case de criação
npm test -- --testPathPattern=create-client.usecase.spec.ts

# Apenas o use case de busca
npm test -- --testPathPattern=find-client.usecase.spec.ts
```

#### product-adm

```bash
# Todos os testes do módulo
npm test -- --testPathPattern=product-adm

# Apenas o repositório
npm test -- --testPathPattern=src/modules/product-adm/repository/product.repository.spec.ts

# Apenas a facade
npm test -- --testPathPattern=product-adm.facade.spec.ts

# Apenas o use case de criação
npm test -- --testPathPattern=create-product.usecase.spec.ts

# Apenas o use case de verificação de estoque
npm test -- --testPathPattern=check-stock.usecase.spec.ts

# Apenas o use case de atualização
npm test -- --testPathPattern=update-product.usecase.spec.ts

# Apenas o use case de exclusão
npm test -- --testPathPattern=delete-product.usecase.spec.ts
```

#### store-product

```bash
# Todos os testes do módulo
npm test -- --testPathPattern=store-product

# Apenas o repositório
npm test -- --testPathPattern=src/modules/store-product/repository/product.repository.spec.ts

# Apenas a facade
npm test -- --testPathPattern=store-catalog.facade.spec.ts

# Apenas o use case de busca de todos os produtos
npm test -- --testPathPattern=find-all-products.usecase.spec.ts

# Apenas o use case de busca de produto por ID
npm test -- --testPathPattern=find-product.usecase.spec.ts
```

#### payment

```bash
# Todos os testes do módulo
npm test -- --testPathPattern=payment

# Apenas o repositório
npm test -- --testPathPattern=transaction.repository.spec.ts

# Apenas a facade
npm test -- --testPathPattern=payment.facade.spec.ts

# Apenas o use case
npm test -- --testPathPattern=process-payment.usecase.spec.ts
```

#### invoice

```bash
# Todos os testes do módulo
npm test -- --testPathPattern=invoice

# Apenas o repositório
npm test -- --testPathPattern=invoice.repository.spec.ts

# Apenas a facade
npm test -- --testPathPattern=invoice.facade.spec.ts

# Apenas o use case de geração
npm test -- --testPathPattern=generate-invoice.usecase.spec.ts

# Apenas o use case de busca
npm test -- --testPathPattern=find-invoice.usecase.spec.ts
```

---

### Dicas ao rodar os testes

**Ver todos os testes com detalhes:**
```bash
npm test -- --verbose
```

**Filtrar por nome de describe ou it:**
```bash
npm test -- --testNamePattern="should create a client"
```

**Rodar em modo watch (re-executa ao salvar arquivos):**
```bash
npm test -- --watch
```

---

## Arquitetura

O projeto aplica **Clean Architecture** com as seguintes camadas, do centro para a borda:

```
┌─────────────────────────────────────────────┐
│               API / HTTP (Express)           │  ← Camada mais externa
│         routes: products, clients,           │
│              checkout, invoice               │
├─────────────────────────────────────────────┤
│                  Facades                     │  ← Ponto de entrada dos módulos
│   CheckoutFacade, ProductAdmFacade, etc.     │
├─────────────────────────────────────────────┤
│                 Use Cases                    │  ← Regras de aplicação
│         PlaceOrderUseCase, etc.              │
├─────────────────────────────────────────────┤
│                  Domain                      │  ← Regras de negócio puras
│       Entities, Value Objects, etc.          │
├─────────────────────────────────────────────┤
│              Infrastructure                  │  ← Detalhes externos
│    Sequelize Models, Repositories, SQLite    │
└─────────────────────────────────────────────┘
```

**Regra fundamental:** as dependências sempre apontam de fora para dentro. A camada de domínio não conhece Sequelize, Express ou qualquer framework — ela contém apenas TypeScript puro.
