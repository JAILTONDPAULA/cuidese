# Preload

Tela de carregamento que cobre a tela toda (`position: fixed`), com o fundo padrão do app (cor e formas do `<Background />`). No centro ficam:

- a logo;
- três bolinhas cinzas: uma por vez cresce e ganha uma cor da marca (azul, amarelo, verde);
- um texto piscando, que por padrão é "Carregando".

## Como funciona

- O `<Preload />` é renderizado uma única vez no `MainLayout`. Não coloque outro em telas.
- Ele **já começa visível**, e a cada troca de página o `MainLayout` o mostra de novo.
- **Cada página decide quando ele sai.**
- O preload fica na tela **enquanto houver algo pendente**:
	- **a página** que está abrindo, até chamar `useOcultarPreload()`. Isso vale **uma vez só**: chamar de novo não desconta nada, e o `StrictMode` do React roda os efeitos duas vezes em desenvolvimento;
	- **cada requisição** em andamento feita pelo `FetchHelper`, ou cada `preload.mostrar()` sem o `ocultar()` correspondente.
- **Ticket:** cada `mostrar()` devolve um ticket com a "geração" da página atual, que o `ocultar(ticket)` usa. Se a pessoa trocar de página, uma requisição da página anterior que termina depois **não** fecha o preload da página nova.

Exemplo: uma página que valida algo ao abrir fica com o preload na tela durante a requisição inteira, mesmo já tendo chamado `useOcultarPreload()`. Uma página sem requisição libera o preload assim que monta.

## Uso

```js
import { preload, useOcultarPreload } from '@/components/Preload/preloadStore'
```

### Regra: toda página chama `useOcultarPreload()`

Chame o hook no topo do componente. É uma linha só:

```jsx
function Login() {
	useOcultarPreload()

	return <form>...</form>
}
```

### Página com requisição: nada a mais

Requisições feitas pelas classes de `src/api/` (via `FetchHelper`) **mantêm o preload na tela sozinhas** até terminarem, com sucesso ou com erro. A página só precisa do hook:

```jsx
function Historico() {
	useOcultarPreload()
	const [relatos, setRelatos] = useState([])

	useEffect(() => {
		const controller = new AbortController()
		RelatoApi.listar({ signal: controller.signal }).then(setRelatos).catch(() => {})
		return () => controller.abort()
	}, [])

	return <ListaRelatos relatos={relatos} />
}
```

O preload fica na tela até o `listar()` terminar. Se forem várias requisições, ele espera todas.

### Controle manual (fora do FetchHelper)

Cada `mostrar()` precisa de um `ocultar()` correspondente. Use `try/finally` para ele acontecer mesmo em caso de erro:

```js
async function processar() {
	const ticket = preload.mostrar('Preparando o compartilhamento')
	try {
		await algoDemorado()
		preload.texto('Quase pronto') // troca o texto sem fechar
		await outraCoisa()
	} finally {
		preload.ocultar(ticket)
	}
}
```

## Métodos

| Método | Descrição |
|---|---|
| `preload.mostrar(texto?)` | Mostra o preload e o mantém até o `ocultar()` correspondente. **Retorna um ticket.** Sem texto, mantém o atual se já estiver visível, ou usa `'Carregando'` |
| `preload.texto(texto)` | Troca o texto com o preload já aberto |
| `preload.ocultar(ticket?)` | Encerra um `mostrar()`. O preload some (com fade) quando não houver mais nada pendente. Com o ticket, é ignorado se for de outra página |
| `useOcultarPreload()` | Hook: libera a parte da página quando ela termina de montar |
| `preload.iniciarPagina()` | **Uso interno do MainLayout**: a cada troca de página, zera o contador em 1 e volta ao texto padrão |

## Comportamento

- **Rolagem:** enquanto o preload está na tela, a página não rola (classe `preload-ativo` no `<body>`).
- **Camadas:** fica acima dos dialogs e **abaixo dos toasts**. Assim, um erro avisado por toast durante o carregamento continua visível.
- **Esquecimento:** em desenvolvimento, se o preload ficar 10 segundos na tela, aparece um aviso no console com a rota. Na maioria das vezes, é uma página sem `useOcultarPreload()`, ou um `mostrar()` sem o `ocultar()` correspondente.
- **Acessibilidade:** tem `role="status"`, então leitores de tela anunciam o texto. Quem desativou animações no sistema vê as bolinhas mais lentas e o texto sem piscar.

## Testar pelo console do navegador

Em desenvolvimento (`npm run dev`), fica disponível em `window.preload`:

```js
preload.mostrar()
preload.texto('Gerando resumo')
preload.ocultar()
```

## Arquivos

- `preloadStore.js`: o objeto `preload`, o hook `useOcultarPreload` e o estado global (zustand)
- `Preload.jsx`: o componente
- `Preload.scss`: estilos e animações
