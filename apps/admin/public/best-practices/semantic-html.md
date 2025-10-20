# HTML Semântico

_Baseado nos princípios **Perceptível** e **Robusto** da WCAG 2.2_

## 1.3.1 - Informações e Relações [A]

**Prioridade:** Alta | **WCAG:** [Critério 1.3.1](https://guia-wcag.com/)

Utilize elementos HTML semânticos que descrevem adequadamente o conteúdo. A estrutura visual deve corresponder à estrutura semântica do código.

### Critérios WCAG relacionados:

- **1.3.1** - Informações e Relações [A]
- **4.1.1** - Análise (código) [A]
- **4.1.2** - Nome, função, valor [A]

### Exemplos práticos:

- ✅ Use `<button>` para botões, não `<div>` com onclick
- ✅ Use `<nav>` para navegação principal
- ✅ Use `<main>` para conteúdo principal da página
- ✅ Use `<header>`, `<footer>`, `<article>`, `<section>` apropriadamente
- ✅ Use `<form>` para agrupamento de campos relacionados

### Palavras-chave:

`estrutura`, `semântica`, `landmarks`, `código válido`, `HTML5`

### Dicas importantes:

- Sempre teste com leitores de tela (NVDA, JAWS, VoiceOver)
- Valide seu HTML com o [W3C Markup Validator](https://validator.w3.org/)
- Use landmarks ARIA apenas quando elementos HTML não forem suficientes
- Prefira HTML semântico ao invés de ARIA quando possível

---

## 1.3.1 + 2.4.6 - Estrutura de cabeçalhos hierárquica

**Prioridade:** Alta | **WCAG:** [Critérios 1.3.1](https://guia-wcag.com/) + [2.4.6](https://guia-wcag.com/)

Mantenha uma hierarquia lógica de cabeçalhos (h1-h6) para facilitar a navegação e compreensão da estrutura do conteúdo.

### Critérios WCAG relacionados:

- **1.3.1** - Informações e Relações [A]
- **2.4.6** - Cabeçalhos e rótulos [AA]
- **2.4.10** - Cabeçalhos de seção [AAA]

### Exemplos práticos:

- ✅ Use apenas **um** `<h1>` por página (título principal)
- ✅ **Não pule** níveis de cabeçalhos (h1 → h2 → h3)
- ✅ Use cabeçalhos para **estrutura**, não apenas para estilo visual
- ✅ Cabeçalhos devem ser **descritivos** do conteúdo que seguem

```html
<!-- ✅ Estrutura correta -->
<h1>Título da Página</h1>
<h2>Seção Principal</h2>
<h3>Subseção</h3>
<h3>Outra Subseção</h3>
<h2>Segunda Seção</h2>

<!-- ❌ Estrutura incorreta -->
<h1>Título</h1>
<h3>Pulou o h2!</h3>
<!-- Erro: pulou nível -->
```

### Palavras-chave:

`hierarquia`, `navegação`, `estrutura`, `SEO`, `leitores de tela`

### Dicas importantes:

- Cabeçalhos formam um **índice** da sua página para leitores de tela
- Usuários navegam por cabeçalhos usando teclas especiais (H no NVDA/JAWS)
- Use ferramentas como [HeadingsMap](https://chrome.google.com/webstore/detail/headingsmap/flbjommegcjonpdmenkdiocclhjacmbi) para visualizar a estrutura
- Cabeçalhos também beneficiam o SEO e a indexação
