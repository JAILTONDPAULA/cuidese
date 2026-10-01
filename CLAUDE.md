# Cuidese

## Visão geral

Aplicativo de saúde que ajuda o usuário a relatar sintomas em linguagem natural, entender esse relato de forma mais clara (via IA) e ser direcionado a clínicas/médicos próximos com base no diagnóstico. Mantém histórico de relatos e permite compartilhar o diagnóstico (total ou parcial) com profissionais de saúde via link.

Este arquivo é o ponto de partida do projeto. As funcionalidades além do MVP descrito abaixo serão detalhadas em conversas futuras — não assumir escopo além do que está aqui.

## Stack

- **React 19** + **Vite** (dev/build)
- **Capacitor 8** — alvo web, iOS e Android (APK)
- **react-router-dom** — roteamento
- **zustand** — estado global
- **sass** — estilos
- **oxlint** — lint

> Stack alinhada ao projeto irmão `zapmed-app` (mesmo diretório pai), para manter consistência de ferramentas entre os apps do autor.

Plataformas-alvo do build: Web, iOS, Android (gerando APK).

## Funcionalidade inicial (MVP)

1. **Login** — usuário autenticado no app.
2. **Relato de sintomas** — usuário descreve, em texto livre, o que está sentindo.
3. **Resumo por IA** — a IA processa o relato e gera uma versão mais clara/estruturada.
   - O sistema guarda **os dois**: o relato original (texto do usuário) e a versão resumida/traduzida pela IA.
4. **Recomendação de clínicas/médicos** — com base no diagnóstico gerado, o app recomenda clínicas e médicos próximos (geolocalização).
5. **Histórico** — cada relato/diagnóstico fica salvo no histórico do usuário.
   - Recomendações futuras devem considerar o **histórico completo + o diagnóstico mais recente**, não apenas o relato atual isolado.
6. **Compartilhamento** — o relato/diagnóstico pode ser compartilhado via link (WhatsApp, Telegram, e-mail) com o profissional de saúde.
   - O compartilhamento pode ser **total** (relato original + resumo) ou **parcial** (recorte específico), a critério do usuário.

## Conceitos de domínio (nomenclatura a manter consistente no código)

- **Relato**: texto original do usuário descrevendo sintomas.
- **Resumo/Diagnóstico**: versão processada pela IA a partir do relato.
- **Histórico**: coleção cronológica de relatos + resumos de um usuário.
- **Recomendação**: sugestão de clínica/médico, derivada do diagnóstico atual e do histórico.
- **Compartilhamento**: link gerado a partir de um relato/diagnóstico, com escopo total ou parcial, consumido fora do app (WhatsApp/Telegram/e-mail).

## Convenções de código

- **README por componente**: todo componente criado em `src/components/<Nome>/` deve ter um `README.md` no mesmo diretório, explicando como usá-lo (props/parâmetros, exemplos e cuidados). Ao alterar a API de um componente, atualizar o README junto.
- **Helpers**: ficam em `src/helpers/<Nome>Helper/<Nome>Helper.js` (uma pasta por helper, ex.: `src/helpers/CPFHelper/CPFHelper.js`), como classe com métodos estáticos exportada por padrão. Cada pasta deve ter um `README.md` explicando o helper e cada método (parâmetros, retorno, exemplos e cuidados). Ao alterar um helper, atualizar o README junto.
- **Requisições**: toda requisição HTTP passa pelo `FetchHelper` (`src/helpers/FetchHelper/`), que controla preload, toast de erro (corpo da API exibido puro, texto ou HTML) e formato do retorno. As páginas não chamam `fetch` nem o `FetchHelper` direto: usam classes por domínio em `src/api/<Dominio>Api.js` (ex.: `UsuarioApi`), com métodos estáticos que já sabem URL/método e devolvem a Promise do `FetchHelper`; a página trata o retorno. Ao criar/alterar uma classe, atualizar a tabela em `src/api/README.md`. URL base em `VITE_API_URL` (`.env`).
- **Preload**: toda página chama `useOcultarPreload()` no topo do componente; requisições do `FetchHelper` mantêm o preload visível até terminarem (contador).
- **Autenticação**: bearer token Sanctum. A sessão (token + usuario) fica em `src/stores/sessaoStore.js`, persistida com `@capacitor/preferences` (localStorage na web, nativo no celular). O `FetchHelper` envia o `Authorization: Bearer` e, no 401, apaga a sessão — classes de API e páginas não lidam com o token. Telas que exigem login ficam dentro do grupo `RotaProtegida` em `src/routes/index.jsx`. Stores globais que não são de um componente ficam em `src/stores/` (com README).

## Pontos em aberto (definir em conversas futuras)

- Provedor de IA para o resumo dos sintomas.
- Fonte de dados de clínicas/médicos (API de geolocalização/busca).
- Modelo de autenticação (provedor, persistência de sessão).
- Backend/armazenamento do histórico (local vs. servidor).
- Formato e segurança do link de compartilhamento (expiração, autenticação de quem acessa, dados sensíveis de saúde).
