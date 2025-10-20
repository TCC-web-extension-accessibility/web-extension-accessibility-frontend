# ARIA e Tecnologias Assistivas

## Use ARIA apropriadamente

**Prioridade:** Média

Implemente atributos ARIA para componentes interativos complexos.

### Exemplos:

- `aria-expanded` para elementos colapsáveis
- `role="button"` para elementos não-button que agem como botão
- `aria-live` para conteúdo dinâmico

### Dicas importantes:

- HTML semântico é melhor que ARIA quando possível
- Teste com leitores de tela reais
- Use `aria-label` para elementos sem texto visível

---

## Estados e propriedades dinâmicas

**Prioridade:** Média

Mantenha atributos ARIA atualizados conforme o estado da interface muda.

### Exemplos:

- Atualize `aria-expanded` ao expandir/colapsar
- Use `aria-selected` em listas selecionáveis
- Implemente `aria-pressed` para botões toggle

### Dicas importantes:

- Atualize atributos via JavaScript em tempo real
- Teste mudanças de estado com leitores de tela
- Documente os estados possíveis de cada componente
