# Monolito Modularizado — TypeScript

Projeto de estudo que implementa um **monólito modularizado** em TypeScript, aplicando **Clean Architecture**, **SOLID** e **Design Patterns**. A proposta é organizar um sistema monolítico de forma que cada módulo possua responsabilidade isolada e se comunique com os demais apenas por meio de **Facades**, preservando os limites arquiteturais entre os domínios.

---

## Sobre o projeto

Ao contrário de microsserviços, um monólito modularizado mantém tudo em um único processo, mas organiza o código em módulos independentes que se comportam como "mini-sistemas". Cada módulo encapsula seu próprio domínio, regras de negócio, persistência e casos de uso — expondo ao mundo externo apenas uma interface simplificada (Facade).

### Módulos implementados

| Módulo | Responsabilidade |
|---|---|
| **client-adm** | Cadastro e consulta de clientes |
| **product-adm** | Gerenciamento de produtos (criação, atualização, exclusão, estoque) |
| **store-product** | Catálogo de produtos disponíveis para venda |
| **payment** | Processamento de pagamentos e transações |
| **invoice** | Geração e consulta de notas fiscais |

### Estrutura de cada módulo

Todos os módulos seguem o mesmo padrão interno:

```
<modulo>/
├── domain/          # Entidades, Value Objects e regras de negócio
├── gateway/         # Interfaces dos repositórios (ports)
├── usecase/         # Casos de uso da aplicação
├── repository/      # Implementação da persistência (Sequelize + SQLite)
├── facade/          # API pública do módulo
└── factory/         # Montagem do grafo de dependências
```

---

## Tecnologias

- **TypeScript** — tipagem estática
- **Sequelize + SQLite** — persistência em banco de dados (SQLite in-memory nos testes)
- **Jest + SWC** — testes automatizados com compilação rápida
- **Node.js** — runtime

---

## Pré-requisitos

- **Node.js** >= 16
- **npm** >= 8

---

## Instalação

### Linux

```bash
# Instalar Node.js via NodeSource
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clonar o repositório e instalar dependências
git clone <url-do-repositorio>
cd monolito
npm install
```

### macOS

```bash
# Instalar Node.js via Homebrew
brew install node

# Clonar o repositório e instalar dependências
git clone <url-do-repositorio>
cd monolito
npm install
```

### Windows

```powershell
# Instalar Node.js via winget
winget install OpenJS.NodeJS

# Clonar o repositório e instalar dependências
git clone <url-do-repositorio>
cd monolito
npm install
```

> **Alternativa em qualquer SO:** baixe o instalador do Node.js diretamente em [nodejs.org](https://nodejs.org) e siga os passos do assistente.

---

## Executando os testes

### Todos os módulos (suite completa)

```bash
npm test
```

---

### Por módulo

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
```

#### store-product

```bash
# Todos os testes do módulo
npm test -- --testPathPattern=store-product

# Apenas o repositório
npm test -- --testPathPattern=src/modules/store-product/repository/product.repository.spec.ts

# Apenas a facade
npm test -- --testPathPattern=store-catalog.facade.spec.ts
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

### Exibir detalhes de cada teste

Adicione `--verbose` a qualquer comando acima para ver cada asserção individualmente:

```bash
npm test -- --verbose
npm test -- --testPathPattern=invoice --verbose
```
