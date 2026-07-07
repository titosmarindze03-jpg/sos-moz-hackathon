# Regras Gerais

Estas regras são obrigatórias para qualquer IA que trabalhe neste projeto.

## Regras obrigatórias

1. Ler toda a documentação existente na pasta `docs/` antes de qualquer alteração.
2. Ler todos os ficheiros existentes na pasta `.ai/` antes de qualquer alteração.
3. Ler completamente o `README.md` antes de qualquer alteração.
4. Compreender completamente o funcionamento atual antes de escrever código.
5. Nunca assumir comportamentos que não existam.
6. Nunca inventar APIs.
7. Nunca inventar funcionalidades.
8. Nunca remover funcionalidades sem autorização explícita.
9. Nunca alterar comportamento existente sem documentar essa alteração.
10. Sempre preservar compatibilidade com funcionalidades anteriores.
11. Sempre atualizar a documentação após qualquer alteração.
12. Sempre atualizar o roadmap quando uma funcionalidade for concluída.
13. Sempre atualizar o changelog.
14. Sempre documentar novas APIs.
15. Sempre documentar alterações de arquitetura.
16. Sempre documentar novas dependências.
17. Nunca criar ficheiros duplicados.
18. Nunca criar componentes redundantes.
19. Sempre reutilizar componentes existentes.
20. Sempre reutilizar serviços existentes.
21. Sempre manter o projeto organizado.
22. Sempre explicar decisões técnicas importantes através de comentários ou documentação.
23. Em caso de dúvida, analisar primeiro todo o projeto antes de escrever código.
24. Sempre distinguir claramente entre funcionalidades reais, simuladas e planeadas.
25. Nunca escrever documentação indicando que uma funcionalidade existe se ela ainda não existir.
26. Nunca escrever código para funcionalidades que não tenham sido solicitadas.
27. Nunca criar comportamento oculto.
28. Nunca alterar regras de negócio existentes sem autorização explícita.

## Regras de execução

- A IA deve confirmar no código que um comportamento existe antes de depender dele.
- A IA deve procurar por estruturas já existentes antes de criar novas.
- A IA não deve introduzir nova convenção sem verificar a convenção dominante do projeto.
- A IA deve preferir alterações mínimas, claras e compatíveis com a estrutura atual.
- A IA não deve tratar suposições como factos.
- A IA deve responder internamente às perguntas de análise obrigatória antes de iniciar a implementação.
- A IA deve identificar se cada funcionalidade tratada é real, simulada ou apenas planeada.

## Proibições explícitas

- Não criar módulos paralelos para resolver um problema que já tenha solução parcial no projeto.
- Não substituir componentes ou serviços existentes por novos equivalentes sem necessidade real.
- Não alterar nomes, contratos ou fluxos existentes sem refletir isso na documentação adequada.
- Não considerar uma tarefa concluída apenas porque o código compila.
- Não apresentar simulação como funcionalidade real.
- Não alterar regras de negócio sem autorização explícita.

## Critério de conclusão

Uma tarefa só está concluída quando:

1. O comportamento foi implementado ou alterado corretamente.
2. A compatibilidade foi preservada ou a quebra foi explicitamente autorizada.
3. A documentação correspondente foi atualizada.
4. O `CHANGELOG` foi atualizado.
5. O `ROADMAP` foi atualizado se a tarefa representar entrega concluída.
