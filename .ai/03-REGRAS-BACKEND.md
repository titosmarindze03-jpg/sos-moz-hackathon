# Regras Backend

Estas regras aplicam-se a qualquer lógica de servidor, integração, API, persistência ou processamento fora da interface.

## Princípios obrigatórios

- Nunca inventar endpoints, contratos, payloads ou respostas.
- Nunca assumir a existência de backend real sem verificar no repositório.
- Nunca introduzir uma API nova sem documentação explícita.
- Reutilizar serviços e estruturas existentes sempre que possível.
- Preservar compatibilidade com contratos anteriores, salvo autorização explícita para quebrar compatibilidade.
- Nunca alterar regras de negócio existentes sem autorização explícita.
- Nunca implementar comportamento não solicitado.

## Antes de alterar backend

1. Ler a documentação em `docs/`.
2. Ler os ficheiros em `.ai/`.
3. Verificar se já existe implementação de servidor, serviço, rota ou contrato semelhante.
4. Identificar impacto em arquitetura, documentação e consumidores do contrato.

## Regras de contrato

- Toda API nova ou alterada deve ter contrato documentado.
- Toda dependência nova deve ser documentada.
- Toda alteração de comportamento deve ser refletida no contexto da IA e no changelog.
- Não remover campos, parâmetros ou respostas existentes sem autorização explícita.
- Distinguir claramente o que é integração real, simulação local ou funcionalidade apenas planeada.

## Documentação obrigatória

Se o backend for alterado, a IA deve atualizar a documentação correspondente em `docs/`.

Mapeamento obrigatório:

- Atualizar `BACKEND.md` ou o ficheiro equivalente existente no projeto.
- Atualizar `FUNCIONALIDADES.md` se a funcionalidade mudar.
- Atualizar `ARQUITETURA.md` se a organização técnica mudar.
- Atualizar `CHANGELOG.md` em qualquer alteração.

## Proibições explícitas

- Não criar backend fictício apenas para satisfazer interface.
- Não mascarar ausência de integração real com contratos inventados.
- Não usar nomes genéricos ou inconsistentes para serviços e operações.
- Não apresentar simulação como infraestrutura real.
