# backend

## Description



## Installation

```bash
$ npm install
```

## CORS

O backend aceita requisições de:

- `http://localhost:4200` (sempre, para desenvolvimento)
- Origens definidas nas variáveis de ambiente **`CORS_ORIGIN`** ou **`FRONTEND_URL`** (ex.: URL do front na Vercel)

No **Render** (ou onde o back estiver em produção), configure:

- **CORS_ORIGIN** = `https://seu-app.vercel.app`  
  Ou várias origens separadas por vírgula:  
  `https://seu-app.vercel.app,https://seu-app-git-main.vercel.app`

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
