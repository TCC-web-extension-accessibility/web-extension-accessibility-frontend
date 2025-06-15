# Web Extension Accessibility Frontend

Interface frontend para o widget de acessibilidade

## Setup

Este projeto utiliza [pnpm](https://pnpm.io/) como gerenciador de pacotes e [Nx](https://nx.dev/) para gerenciar o monorepo.

### Instalação de Dependências

Para instalar as dependências do projeto, execute:

```bash
pnpm install
```

### Rodando o Widget

Para iniciar o servidor de desenvolvimento do widget:

```bash
pnpm nx serve widget
```

Acesse o widget em: [http://localhost:5173/](http://localhost:5173/)

### Buildando o Widget

Para construir a versão de produção do widget:

```bash
pnpm nx build widget
```

### Rodando o Admin

Para iniciar o servidor de desenvolvimento do painel administrativo:

```bash
pnpm nx serve admin
```

Acesse o painel administrativo em: [http://localhost:4200/](http://localhost:4200/)

### Buildando o Admin

Para construir a versão de produção do painel administrativo:

```bash
pnpm nx build admin
```
