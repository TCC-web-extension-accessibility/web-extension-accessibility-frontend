# Web Extension Accessibility Frontend

Interface frontend para o widget de acessibilidade

### Tecnologias relevantes

- React 19
- TailwindCSS
- Vite
- PNPM
- PostCSS
- Vitest
- Prettier
- ESlint

## Setup

Este projeto utiliza [pnpm](https://pnpm.io/) como gerenciador de pacotes

### Instalação de Dependências

Para instalar as dependências do projeto, execute:

```bash
pnpm install
```

### Rodando o Widget

Para iniciar o servidor de desenvolvimento do widget:

```bash
pnpm dev:widget
```

Acesse o widget em: [http://localhost:5173/](http://localhost:5173/)

### Buildando o Widget

Para construir a versão de produção do widget:

```bash
pnpm build:widget
```

### Testar o widget em uma página HTML

O nosso widget em produção é incluido através da tag \<script>, para fazer o teste desse cenário:

Faça o build do widget com --watch

```bash
pnpm build:widget --watch
```

Inicie o servidor para rodar o index.html

```bash
pnpm serve:widget:test-html
```
