# Memória do Projeto

Este ficheiro resume o estado atual do projeto para orientar futuras IAs.

## Stack atual

- `React`
- `TypeScript`
- `Vite`

## Natureza do projeto

Este projeto representa um sistema de resposta humanitária.

## Estrutura funcional observada

- `frontend/src/App.tsx` controla a navegação principal por separadores internos.
- `frontend/src/components/` contém as vistas e componentes principais.
- `frontend/src/services/` centraliza dados e operações do domínio atual.
- `frontend/src/models/index.ts` define os contratos tipados usados no frontend.

## Serviços existentes

- `familyService`: gestão de pessoas, desaparecidos e reunificação.
- `emergencyService`: alertas, pedidos de ajuda e relatórios de resgate.
- `mapService`: zonas seguras, zonas de risco e pontos de distribuição.

## Persistência atual observada

- O estado atual usa `localStorage` no frontend.
- Há chaves próprias para alertas, pedidos de ajuda, relatórios, pessoas e zonas seguras.

## Regras de memória

- Esta memória deve ser atualizada sempre que o funcionamento estrutural do projeto mudar.
- Não usar esta memória como substituto da leitura do código real.
- Sempre confirmar no código antes de agir.

## Limitações

- Se a arquitetura mudar, este ficheiro deve ser revisto.
- Se novos serviços forem introduzidos, este ficheiro deve ser atualizado.
- O frontend já não está na raiz; está agora concentrado em `frontend/`.
- A documentação futura deve distinguir explicitamente entre funcionalidades reais, simuladas e planeadas.
