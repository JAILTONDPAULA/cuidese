# Preload

Tela de carregamento que cobre a tela toda (`position: fixed`), com o fundo padrão do app (cor e formas do `<Background />`). No centro ficam:

- a logo;
- três bolinhas cinzas: uma por vez cresce e ganha uma cor da marca (azul, amarelo, verde);
- um texto piscando, que por padrão é "Carregando".

## Como funciona

- O `<Preload />` é renderizado uma única vez no `MainLayout`. Não coloque outro em telas.
- Ele **já começa visível**, e a cada troca de página o `MainLayout` o mostra de novo.
- **Cada página decide quando ele sai.**
- Funciona com um **contador**:
	- a página que está abrindo conta 1;
	- cada requisição em andamento feita pelo `FetchHelper` soma mais 1;
	- `preload.ocultar()` e o fim de cada requisição subtraem 1;
	- o preload só some quando o contador chega a zero.

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
	preload.mostrar('Preparando o compartilhamento')
	try {
		await algoDemorado()
		preload.texto('Quase pronto') // troca o texto sem fechar
		await outraCoisa()
	} finally {
		preload.ocultar()
	}
}
```

## Métodos

| Método | Descrição |
|---|---|
| `preload.mostrar(texto?)` | Mostra o preload e soma 1 no contador. Sem texto, mantém o atual se já estiver visível, ou usa `'Carregando'` |
| `preload.texto(texto)` | Troca o texto com o preload já aberto |
| `preload.ocultar()` | Subtrai 1 do contador. Some (com fade) quando chega a zero |
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
