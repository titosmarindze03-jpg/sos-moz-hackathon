# Regras de Documentação

A documentação é parte obrigatória da entrega.

## Princípio central

Nenhuma tarefa será considerada concluída enquanto a documentação correspondente não estiver atualizada.

## Regras obrigatórias

- Sempre atualizar a documentação após qualquer alteração.
- Sempre atualizar o roadmap quando uma funcionalidade ou tarefa relevante for concluída.
- Sempre atualizar o changelog.
- Sempre documentar novas APIs.
- Sempre documentar alterações de arquitetura.
- Sempre documentar novas dependências.
- Sempre documentar alterações de comportamento.
- Nunca escrever documentação afirmando a existência de algo que ainda não existe no código.
- Sempre distinguir claramente entre funcionalidade real, funcionalidade simulada e funcionalidade planeada.

## Mapeamento obrigatório por tipo de alteração

Se alterar o frontend:

- Atualizar `FRONTEND.md` ou o ficheiro equivalente existente em `docs/`.

Se alterar o backend:

- Atualizar `BACKEND.md` ou o ficheiro equivalente existente em `docs/`.

Se alterar a arquitetura:

- Atualizar `ARQUITETURA.md` ou o ficheiro equivalente existente em `docs/`.

Se alterar a base de dados:

- Atualizar `BASE-DE-DADOS.md` ou o ficheiro equivalente existente em `docs/`.

Se criar uma funcionalidade:

- Atualizar `FUNCIONALIDADES.md` ou o ficheiro equivalente existente em `docs/`.

Se concluir uma tarefa:

- Atualizar `ROADMAP.md` ou o ficheiro equivalente existente em `docs/`.

Se alterar o comportamento do sistema:

- Atualizar `CONTEXTO-IA.md` ou o ficheiro equivalente existente em `docs/`.

Se alterar qualquer parte do projeto:

- Atualizar `CHANGELOG.md` ou o ficheiro equivalente existente em `docs/`.

## Convenção para este repositório

Se a pasta `docs/` usar nomes numerados, a IA deve mapear corretamente:

- `01-VISAO-GERAL.md`
- `03-ARQUITETURA.md`
- `04-FRONTEND.md`
- `05-BACKEND.md`
- `06-BASE-DE-DADOS.md`
- `07-FUNCIONALIDADES.md`
- `08-ROADMAP.md`
- `11-CONTEXTO-IA.md`
- `12-CHANGELOG.md`

## Proibição explícita

- Não deixar documentação para depois.
- Não concluir tarefa com documentação em atraso.
- Não omitir alteração relevante da documentação.
- Não documentar hipótese como implementação real.
