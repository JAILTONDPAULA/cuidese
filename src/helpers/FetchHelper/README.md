# FetchHelper

Ponto único de requisições HTTP do app, feito sobre o `fetch` nativo. Uma chamada faz tudo isto:

1. monta a requisição (URL base, método, corpo ou query string, headers);
2. mostra o **preload** durante a requisição;
3. confere o status HTTP, porque o `fetch` sozinho não trata 4xx e 5xx como erro;
4. valida e devolve o corpo no formato pedido (`json`, `text`, `blob` ou a `Response` crua);
5. em caso de erro, mostra um **toast com o corpo da resposta exatamente como a API devolveu** e relança o erro para a página;
6. no `finally`, libera o preload, com sucesso ou com erro.

As páginas normalmente **não chamam o FetchHelper direto**. Elas usam as classes de `src/api/`, como `UsuarioApi` (veja o `src/api/README.md`).

## Uso

```js
import FetchHelper from '@/helpers/FetchHelper/FetchHelper'

const usuario = await FetchHelper.call('/usuarios/1')
```

### Parâmetros

```js
FetchHelper.call(url, { metodo, dados, retorno, preload, headers, signal })
```

| Parâmetro | Tipo | Padrão | Descrição |
|---|---|---|---|
| `url` | `string` | — | Caminho relativo à `VITE_API_URL` (ex.: `'/usuarios'`) ou URL absoluta (`http...`) |
| `metodo` | `'GET'` \| `'POST'` \| `'PUT'` \| `'PATCH'` \| `'DELETE'` | `'GET'` | Método HTTP |
| `dados` | objeto, `FormData` ou `null` | `null` | No **GET**, vira query string (`?a=1&b=2`). Nos **demais métodos**, vai no corpo: objeto vira JSON, e `FormData` é enviado como está (upload de arquivo) |
| `retorno` | `'json'` \| `'text'` \| `'blob'` \| `'response'` | `'json'` | Formato devolvido no sucesso |
| `preload` | `boolean` ou `string` | `true` | Mostra o preload durante a requisição. Uma **string** vira o texto do preload |
| `headers` | objeto ou `null` | `null` | Headers extras. Sobrescrevem os padrões |
| `signal` | `AbortSignal` | — | Permite cancelar a requisição (`AbortController`) |

As opções são um **objeto**. Passe só o que muda em relação ao padrão:

```js
FetchHelper.call('/relatos', { metodo: 'POST', dados: { texto } })
FetchHelper.call('/relatos', { dados: { pagina: 2 }, preload: 'Buscando seu histórico' })
FetchHelper.call('/relatorio.pdf', { retorno: 'blob' })
FetchHelper.call('/status', { preload: false })
```

### Retorno

- `json`: o objeto parseado. Uma resposta vazia (ex.: status 204) devolve `null`. Se o corpo **não for JSON válido** (por exemplo, um `echo` ou warning do PHP antes do JSON), vira erro, com o toast mostrando o texto recebido.
- `text`: string.
- `blob`: `Blob` (arquivos, imagens, PDF).
- `response`: a `Response` do fetch, sem ler o corpo. Útil para ler headers.

## Erros

Qualquer falha passa pelo `catch` do helper, que **mostra o toast e relança o erro**. A página decide no próprio `.catch()` o que mais fazer, e não precisa repetir o toast.

| Situação | Toast | Erro relançado |
|---|---|---|
| Status fora de 2xx (400, 404, 422, 500…) | corpo da resposta **puro** | `ApiErro` com `status`, `corpo` e `resposta` |
| Corpo não é JSON (com `retorno: 'json'`) | corpo recebido | `ApiErro` |
| Sem conexão, servidor desligado, CORS | "Não foi possível conectar ao servidor" | `TypeError` do fetch |
| Cancelado (`controller.abort()`) | **nenhum** | `AbortError` |

**Como o corpo aparece no toast:**
- **Texto:** aparece como texto.
- **HTML** (header `Content-Type: text/html`, ou tags no corpo): aparece renderizado, por exemplo a tela de debug do Laravel durante o desenvolvimento. Antes de exibir, o helper remove `<script>`, `<style>`, `<link>`, `<meta>`, `<iframe>` e atributos de evento (`onclick`, `onerror`…). Sem isso, o CSS da página de erro quebraria o visual do app. O conteúdo em si é mantido.
- **Tamanho:** o conteúdo do toast rola se passar de 200px de altura.

```js
import { ApiErro } from '@/helpers/FetchHelper/FetchHelper'

UsuarioApi.validarCPF(cpf).catch((erro) => {
	if (erro instanceof ApiErro && erro.status === 409) setCpfJaCadastrado(true)
})
```

## Preload

Com `preload: true` (padrão), o helper soma 1 no contador do preload ao começar e subtrai 1 no `finally`. O preload só some quando o contador chega a zero. Por isso:

- **Várias requisições ao mesmo tempo:** a primeira que termina não fecha o preload das outras.
- **Requisição ao abrir a página:** a página chama `useOcultarPreload()` normalmente. A requisição mantém o preload na tela até terminar, e não é preciso chamar `preload.ocultar()` no `.then()`.

## Cancelar ao sair da página

```jsx
useEffect(() => {
	const controller = new AbortController()
	RelatoApi.listar({ signal: controller.signal })
		.then(setRelatos)
		.catch(() => {}) // o toast já foi mostrado; o catch vazio evita "Uncaught (in promise)"
	return () => controller.abort()
}, [])
```

## Configuração

A URL base vem de `VITE_API_URL`, no arquivo `.env` na raiz do projeto:

```
VITE_API_URL=http://localhost:8000/api
```

Para usar outro valor só na sua máquina (ex.: o IP do computador para testar no celular), crie um `.env.local`, que é ignorado pelo git. Depois de mudar o `.env`, reinicie o `npm run dev`.

## Testar pelo console do navegador

Em desenvolvimento, o helper fica disponível em `window.FetchHelper`:

```js
await FetchHelper.call('/hello')                              // precisa do Laravel rodando
FetchHelper.call('/rota-que-nao-existe')                      // toast com o erro da API
FetchHelper.call('/hello', { preload: 'Testando conexão' })
```
