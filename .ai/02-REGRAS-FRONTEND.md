# Regras Frontend

Estas regras aplicam-se a qualquer alteração na interface, navegação, componentes, estilos ou experiência do utilizador.

## Contexto atual

O projeto usa `React`, `TypeScript` e `Vite`.

Estrutura já existente a reutilizar:

- `frontend/src/App.tsx`
- `frontend/src/components/`
- `frontend/src/services/`
- `frontend/src/models/index.ts`
- `frontend/src/index.css`

## Regras obrigatórias

- Antes de criar um componente novo, verificar se um componente existente pode ser reutilizado ou expandido.
- Antes de criar lógica nova no frontend, verificar se um serviço existente já cobre parte da necessidade.
- Respeitar os contratos tipados existentes em `frontend/src/models/index.ts`.
- Manter consistência com o fluxo atual baseado em `activeTab` e navegação interna existente em `frontend/src/App.tsx`, salvo autorização explícita para refatorar isso.
- Não introduzir estados, props ou fluxos redundantes.
- Não duplicar lógica de acesso a dados que já exista em `frontend/src/services/`.
- Não introduzir comportamento visual que contradiga o comportamento funcional atual sem documentação.
- Não criar comportamento oculto no frontend.
- Não implementar fluxos novos de interface sem pedido explícito.
- Distinguir claramente no código e na documentação o que é funcionalidade real, simulada ou planeada.

## Reutilização obrigatória

- Reutilizar componentes de `frontend/src/components/` antes de criar novos.
- Reutilizar serviços como `familyService`, `emergencyService` e `mapService` antes de criar novos serviços.
- Reutilizar tipos como `Person`, `Alert`, `SafeZone`, `HelpRequest` e `RescueReport` antes de inventar novas estruturas equivalentes.

## Alterações de frontend exigem documentação

Se o frontend for alterado, a IA deve atualizar a documentação correspondente em `docs/`.

Mapeamento obrigatório:

- Atualizar `FRONTEND.md` ou o ficheiro equivalente existente no projeto.
- Atualizar `FUNCIONALIDADES.md` se houver criação, remoção ou mudança funcional visível.
- Atualizar `CONTEXTO-IA.md` se o comportamento do sistema mudar.
- Atualizar `CHANGELOG.md` em qualquer alteração.

## Proibições explícitas

- Não criar componentes apenas para mover poucas linhas de JSX sem ganho real.
- Não criar variantes duplicadas de componentes existentes.
- Não mudar rótulos, fluxos, validações ou estados visíveis sem documentar.
- Não quebrar responsividade existente sem autorização explícita.
- Não sugerir no interface que uma capacidade existe quando ela ainda não existe.
