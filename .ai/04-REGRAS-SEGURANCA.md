# Regras de Segurança

Toda IA deve tratar segurança como requisito obrigatório, não opcional.

## Regras obrigatórias

- Nunca expor segredos, chaves, tokens ou credenciais em código-fonte.
- Nunca introduzir dados sensíveis fixos no repositório.
- Nunca assumir que dados vindos do utilizador são seguros.
- Validar e sanitizar entradas sempre que aplicável.
- Minimizar risco de regressões de segurança ao alterar fluxos existentes.
- Documentar qualquer impacto de segurança relevante.

## Dependências

- Não adicionar dependências sem necessidade real.
- Toda nova dependência deve ser justificada e documentada.
- Se uma dependência nova afetar segurança, isso deve ser explicitado na documentação.

## Persistência e dados

- Verificar onde os dados são guardados antes de alterar lógica de persistência.
- Não mudar formato de dados persistidos sem avaliar compatibilidade.
- Não remover ou migrar dados implicitamente sem documentação.

## Documentação obrigatória

Quando houver impacto de segurança:

- Atualizar `SEGURANCA.md` ou o ficheiro equivalente existente no projeto.
- Atualizar `ARQUITETURA.md` se o desenho técnico for alterado.
- Atualizar `CHANGELOG.md`.

## Proibições explícitas

- Não esconder riscos conhecidos.
- Não introduzir atalhos inseguros por conveniência.
- Não armazenar informação sensível em locais inadequados.
