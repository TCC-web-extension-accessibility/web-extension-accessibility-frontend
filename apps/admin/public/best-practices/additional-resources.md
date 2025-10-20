# Recursos Adicionais

---

## Referência Principal

### [Guia WCAG - A referência essencial em português brasileiro!](https://guia-wcag.com/)

> _"A base fundamental para que você tenha produtos digitais verdadeiramente inclusivos e acessíveis"_

#### Por que usar o Guia WCAG?

| Recurso                   | Benefício                             |
| :------------------------ | :------------------------------------ |
| **87 critérios WCAG 2.2** | Explicados de forma simples e prática |
| **Tradução oficial**      | Português brasileiro autorizado       |
| **Filtros inteligentes**  | Busque por nível (A, AA, AAA)         |
| **Sistema de tags**       | Palavras-chave para cada critério     |
| **Design acessível**      | Interface responsiva e inclusiva      |

**Como citar:** SALES, M. Guia WCAG (2018). Disponível em: https://guia-wcag.com. Acesso em: [inserir data].

---

## Ferramentas Essenciais

### Análise Automática

#### Extensões do Navegador

- **[axe DevTools](https://www.deque.com/axe/devtools/)**

  > _A ferramenta mais usada pelos profissionais_
  >
  > - Análise automática durante o desenvolvimento
  > - Relatórios detalhados com priorização
  > - Integração com DevTools do Chrome/Firefox

- **[WAVE](https://wave.webaim.org/)**
  > _Visualização clara dos problemas_
  >
  > - Destaque visual dos erros na página
  > - Análise de contraste em tempo real
  > - Versão web e extensão disponíveis

#### Ferramentas Integradas

- **[Lighthouse](https://developers.google.com/web/tools/lighthouse)**

  > _Auditoria completa de qualidade_
  >
  > - Análise de performance + acessibilidade
  > - Métricas de Core Web Vitals
  > - Relatórios automáticos no CI/CD

- **[Colour Contrast Analyser](https://www.paciellogroup.com/resources/colour-contrast-analyser/)**
  > _Verificação precisa de contraste_
  >
  > - Análise de cores em tempo real
  > - Suporte a diferentes tipos de daltonismo
  > - Simulação de condições visuais

### Validadores de Código

| Ferramenta                                                      | Foco              | Quando Usar             |
| :-------------------------------------------------------------- | :---------------- | :---------------------- |
| **[W3C Markup Validator](https://validator.w3.org/)**           | HTML válido       | Antes de cada deploy    |
| **[W3C CSS Validator](https://jigsaw.w3.org/css-validator/)**   | CSS correto       | Durante desenvolvimento |
| **[Accessibility Insights](https://accessibilityinsights.io/)** | ARIA e interações | Componentes complexos   |

---

## Teste com Leitores de Tela

### Principais Leitores por Plataforma

#### **Windows**

- **NVDA** - [Download gratuito](https://www.nvaccess.org/)

  > - Gratuito e open source
  > - Mais usado globalmente
  > - Ideal para desenvolvimento

- **JAWS** - Comercial
  > - Padrão corporativo
  > - Recursos avançados
  > - Licença paga

#### **macOS/iOS**

- **VoiceOver** - Nativo
  > - Integração perfeita com macOS
  > - Ativação: `Cmd + F5`
  > - Mesmo no iPhone/iPad

#### **Android**

- **TalkBack** - Nativo
  > - Padrão do Android
  > - Mais usado em dispositivos móveis
  > - Configuração: Configurações > Acessibilidade

### Guia de Teste Rápido

#### Checklist de 5 Minutos

1. **Teste de Teclado**

   - Navegue apenas com `Tab` e `Shift+Tab`
   - Todos os elementos interativos acessíveis?
   - Indicadores de foco visíveis?

2. **Teste de Leitor de Tela**

   - Ligue o NVDA (Windows) ou VoiceOver (Mac)
   - Navegue com `H` (cabeçalhos) e setas
   - Todas as informações são anunciadas?

3. **Teste de Contraste**
   - Use o Colour Contrast Analyser
   - Textos atendem WCAG AA (4.5:1)?
   - Elementos interativos são distinguíveis?

---

## Padrões e Diretrizes

### Standards Internacionais

#### WCAG - Web Content Accessibility Guidelines

| Versão                                                     | Nível       | Quando Usar             |
| :--------------------------------------------------------- | :---------- | :---------------------- |
| **[WCAG 2.1 AA](https://www.w3.org/WAI/WCAG21/quickref/)** | Recomendado | Sites comerciais padrão |
| **[WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/)**    | Atual       | Novos projetos (2024+)  |
| **[WCAG 3.0](https://www.w3.org/TR/wcag-3.0/)**            | Futuro      | Em desenvolvimento      |

#### Legislação e Compliance

- **[Seção 508](https://www.section508.gov/)** - Governo americano
- **[EN 301 549](https://www.etsi.org/deliver/etsi_en/301500_301599/301549/)** - União Europeia
- **[Lei Brasileira de Inclusão](http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13146.htm)** - Brasil

### Recursos de Aprendizagem

#### Cursos e Tutoriais

- **[WebAIM](https://webaim.org/)** - Tutoriais detalhados e práticos
- **[The A11Y Project](https://www.a11yproject.com/)** - Checklist e guias rápidos
- **[Mozilla MDN](https://developer.mozilla.org/docs/Web/Accessibility)** - Documentação técnica
- **[W3C WAI](https://www.w3.org/WAI/)** - Recursos oficiais do W3C

#### Comunidades Brasileiras

- **[WebBR - Acessibilidade](https://web.br/acessibilidade/)** - Comunidade nacional
- **[Movimento Web para Todos](https://mwpt.com.br/)** - Iniciativa brasileira
- **[SERPRO - Acessibilidade](https://www.serpro.gov.br/menu/suporte/escritorio-de-atendimento/acessibilidade-digital)** - Governo federal

---

## Eventos e Networking

### Eventos Globais

#### Anuais

- **[Global Accessibility Awareness Day](https://accessibility.day/)** - Maio
  > Dia mundial da conscientização
- **[Inclusive Design 24](https://inclusivedesign24.org/)** - Outubro
  > 24 horas de palestras gratuitas online
- **[axe-con](https://www.deque.com/axe-con/)** - Março
  > Maior conferência de acessibilidade digital

#### Eventos Brasileiros

- **WebBR** - Comunidade ativa
- **Frontend Conference** - Trilhas de acessibilidade
- **DevFest** - Talks sobre inclusão

---

## Próximos Passos

### Seu Plano de Ação

1. **Estude** - Comece pelo [Guia WCAG](https://guia-wcag.com/)
2. **Instale** - axe DevTools + NVDA/VoiceOver
3. **Teste** - Seus projetos atuais
4. **Aprenda** - WebAIM + The A11Y Project
5. **Conecte** - Comunidades brasileiras
6. **Pratique** - Implemente melhorias graduais

### Dica Final

> **Acessibilidade não é um destino, é uma jornada contínua de aprendizado e melhoria!**

---

_Mantenha-se atualizado e faça a diferença criando experiências verdadeiramente inclusivas!_
