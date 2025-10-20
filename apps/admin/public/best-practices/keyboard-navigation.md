# Navegação por Teclado

## Todos os elementos interativos devem ser acessíveis via teclado

**Prioridade:** Alta

Garanta que usuários possam navegar e interagir usando apenas o teclado.

### Exemplos:

- Use `tabindex="0"` para elementos customizados focáveis
- Implemente navegação com setas em menus
- Garanta que modais capturam o foco

### Dicas importantes:

- Teste navegando apenas com Tab, Shift+Tab, Enter, Espaço e setas
- Implemente skip links para conteúdo principal
- Use `:focus-visible` para indicadores de foco modernos

---

## Indicadores visuais de foco

**Prioridade:** Alta

Forneça indicadores claros de qual elemento está com foco.

### Exemplos:

- Mantenha ou customize o outline padrão
- Use `box-shadow` ou `border` para indicadores de foco
- Garanta contraste adequado nos indicadores

### Dicas importantes:

- Nunca remova completamente os indicadores de foco
- Teste com usuários que navegam apenas por teclado
- Considere diferentes estados de foco (hover vs focus)
