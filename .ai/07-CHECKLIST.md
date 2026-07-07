# Checklist

Esta checklist deve ser seguida antes, durante e depois de qualquer alteração.

## Antes de alterar

- Li toda a documentação existente em `docs/`.
- Li todos os ficheiros existentes em `.ai/`.
- Li completamente o `README.md`.
- Li os ficheiros de código relevantes.
- Compreendi o funcionamento atual.
- Respondi internamente ao objetivo, arquitetura, funcionalidades existentes, limitações, histórico, lacunas e impacto da alteração.
- Confirmei que não estou a assumir comportamentos inexistentes.
- Verifiquei componentes existentes reutilizáveis.
- Verifiquei serviços existentes reutilizáveis.
- Verifiquei se já existe documentação relacionada com a área a alterar.

## Durante a alteração

- Não inventei APIs.
- Não inventei funcionalidades.
- Não implementei funcionalidades não solicitadas.
- Não criei comportamento oculto.
- Não removi funcionalidades sem autorização explícita.
- Não alterei regras de negócio sem autorização explícita.
- Mantive compatibilidade com comportamento anterior.
- Evitei duplicação de ficheiros, componentes e serviços.
- Mantive a organização do projeto.
- Documentei decisões técnicas importantes quando necessário.

## Antes de concluir

- Atualizei a documentação correspondente.
- Atualizei `FRONTEND.md` se houve alteração de frontend.
- Atualizei `BACKEND.md` se houve alteração de backend.
- Atualizei `ARQUITETURA.md` se houve alteração de arquitetura.
- Atualizei `BASE-DE-DADOS.md` se houve alteração de base de dados.
- Atualizei `FUNCIONALIDADES.md` se houve criação ou mudança funcional.
- Atualizei `ROADMAP.md` se uma tarefa foi concluída.
- Atualizei `CONTEXTO-IA.md` se o comportamento do sistema mudou.
- Atualizei `CHANGELOG.md` em qualquer alteração.
- Distingui corretamente no código e na documentação o que é real, simulado e planeado.
- Confirmei que a tarefa não ficou parcialmente documentada.

## Regra final

Se qualquer item crítico desta checklist estiver pendente, a tarefa não está concluída.
