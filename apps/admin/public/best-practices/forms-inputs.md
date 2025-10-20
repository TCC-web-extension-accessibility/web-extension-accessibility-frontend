# Formulários e Inputs

## Labels descritivos para todos os campos

**Prioridade:** Alta

Cada campo de formulário deve ter um label claro e descritivo.

### Exemplos:

- Use `<label for="campo-id">` ou `aria-labelledby`
- Forneça instruções claras para campos obrigatórios
- Use placeholder como dica, não como label

### Dicas importantes:

- Labels devem ser visíveis e persistentes
- Use `aria-describedby` para instruções adicionais
- Agrupe campos relacionados com `fieldset`/`legend`

---

## Mensagens de erro claras

**Prioridade:** Alta

Forneça feedback claro sobre erros de validação.

### Exemplos:

- Use `aria-invalid="true"` para campos com erro
- Associe mensagens de erro com `aria-describedby`
- Forneça sugestões de correção específicas

### Dicas importantes:

- Identifique claramente onde está o erro
- Explique como corrigir o problema
- Use linguagem clara e não técnica
