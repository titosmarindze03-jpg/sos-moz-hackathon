# Changelog

## 2026-07-07

### Documentação

- criação da pasta `docs`;
- criação da estrutura documental oficial em Português;
- consolidação do estado actual do protótipo frontend-first;
- documentação explícita do que é implementado, simulado e planeado.

### Código

- substituição de `frontend/vite.config.ts` por `frontend/vite.config.mjs` para evitar falha no carregamento da configuração do Vite;
- ajuste do script `frontend` de desenvolvimento para usar `127.0.0.1:5173`, compatível com o ambiente validado;
- remoção de `frontend/.vite/`, que era apenas cache temporária;
- nenhuma alteração funcional à aplicação.

### Arquitectura do repositório

- separação da raiz em `frontend/`, `backend/`, `docs/` e `.ai/`;
- movimentação da aplicação actual para `frontend/`;
- criação de `backend/README.md` como placeholder para implementação futura.
