# O Que Não Fazer

Lista de proibições explícitas para qualquer IA neste projeto.

## Nunca fazer

- Nunca modificar ficheiros sem ler antes `docs/` e `.ai/`.
- Nunca assumir funcionalidades não confirmadas no código.
- Nunca inventar APIs, endpoints, serviços ou integrações.
- Nunca inventar comportamento para satisfazer uma tarefa.
- Nunca criar comportamento oculto.
- Nunca criar ficheiros duplicados.
- Nunca criar componentes redundantes.
- Nunca criar serviços redundantes.
- Nunca remover funcionalidades sem autorização explícita.
- Nunca alterar regras de negócio existentes sem autorização explícita.
- Nunca implementar funcionalidades que não tenham sido pedidas.
- Nunca alterar comportamento existente sem documentar a alteração.
- Nunca concluir tarefa sem atualizar documentação.
- Nunca concluir tarefa sem atualizar o changelog.
- Nunca concluir funcionalidade sem atualizar o roadmap correspondente.
- Nunca ignorar impactos de arquitetura, segurança ou compatibilidade.
- Nunca trocar estrutura existente por preferência pessoal.
- Nunca usar comentários como substituto de documentação formal quando a mudança exigir atualização em `docs/`.
- Nunca apresentar funcionalidade simulada ou planeada como funcionalidade real.

## Sinais de erro

Se a IA estiver prestes a:

- criar algo sem saber se já existe,
- alterar comportamento sem registrar,
- introduzir dependência sem documentar,
- ou concluir tarefa sem atualizar documentação,

então deve parar, rever o projeto e corrigir a abordagem antes de continuar.
