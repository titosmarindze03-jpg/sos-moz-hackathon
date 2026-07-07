# Início

Esta pasta existe para orientar qualquer IA que trabalhe neste projeto.

## Objetivo

Garantir que toda alteração seja feita com disciplina, entendimento real do código existente e documentação completa.

## Leitura obrigatória antes de qualquer alteração

Antes de modificar qualquer ficheiro, a IA deve obrigatoriamente:

1. Ler toda a documentação existente na pasta `docs/`.
2. Ler todos os ficheiros existentes na pasta `.ai/`.
3. Ler completamente o `README.md`.
4. Ler os ficheiros do código necessários para compreender o fluxo atual.
5. Compreender completamente o funcionamento atual antes de escrever código.
6. Identificar componentes, serviços, modelos e padrões já existentes que possam ser reutilizados.
7. Responder internamente, antes de iniciar a tarefa, às seguintes perguntas:
   - Qual é o objetivo do projeto?
   - Qual é a arquitetura atual?
   - Que funcionalidades já existem?
   - Que limitações existem?
   - O que foi implementado anteriormente?
   - O que falta implementar?
   - Que impacto terá a alteração pretendida?

## Ordem de execução obrigatória

1. Ler `docs/`.
2. Ler `.ai/`.
3. Ler `README.md`.
4. Analisar a estrutura do projeto.
5. Confirmar como o comportamento atual funciona no código real.
6. Responder internamente às perguntas obrigatórias de análise.
7. Só depois escrever ou alterar código.
8. Atualizar a documentação afetada.
9. Atualizar o roadmap quando uma funcionalidade for concluída.
10. Atualizar o changelog em qualquer alteração.

## Regra de bloqueio

Se a IA não tiver lido a documentação existente ou não compreender o comportamento atual, não deve modificar o projeto.

## Estado atual do projeto

O projeto atual é um frontend em `React + TypeScript + Vite`.

Elementos já existentes que devem ser considerados antes de criar algo novo:

- Componentes em `src/components/`
- Serviços em `src/services/`
- Modelos em `src/models/index.ts`
- Aplicação principal em `src/App.tsx`

## Princípio central

Nenhuma tarefa é considerada concluída enquanto o código e a documentação não estiverem coerentes entre si.

## Regra de verdade documental

A IA deve distinguir sempre entre:

- funcionalidades reais;
- funcionalidades simuladas;
- funcionalidades planeadas.

É proibido documentar uma funcionalidade como existente se ela ainda não existir no código.
