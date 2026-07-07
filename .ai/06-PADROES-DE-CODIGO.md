# Padrões de Código

O código deve seguir padrões consistentes com o que já existe no projeto.

## Regras obrigatórias

- Preferir consistência com o código existente em vez de introduzir um estilo novo.
- Reutilizar tipos existentes antes de criar novos tipos equivalentes.
- Reutilizar serviços existentes antes de criar novos serviços.
- Reutilizar componentes existentes antes de criar novos componentes.
- Manter nomes claros, previsíveis e coerentes com o domínio do projeto.
- Escrever código simples de ler e de manter.

## Estrutura atual a respeitar

- Componentes em `src/components/`
- Serviços em `src/services/`
- Modelos em `src/models/index.ts`
- Composição principal em `src/App.tsx`

## Boas práticas obrigatórias

- Tipar corretamente dados e contratos.
- Evitar duplicação de lógica.
- Evitar ficheiros redundantes.
- Manter responsabilidades separadas.
- Adicionar comentários apenas quando ajudam a explicar decisões técnicas importantes.

## Proibições explícitas

- Não criar abstrações desnecessárias.
- Não espalhar lógica de domínio por múltiplos componentes se um serviço existente a centraliza.
- Não introduzir nomes vagos como `helper2`, `newService`, `tempComponent`.
- Não alterar padrões existentes sem necessidade real e sem documentação.
