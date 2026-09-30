# Preload

Tela de carregamento que cobre a tela toda (`position: fixed`), com o fundo padrão do app (cor e formas do `<Background />`). No centro ficam:

- a logo;
- um anel girando nas cores da marca;
- um texto piscando, que por padrão é "Carregando".

## Como funciona

- O `<Preload />` é renderizado uma única vez no `MainLayout`. Não coloque outro em telas.
- Ele **já começa visível**, e a cada troca de página o `MainLayout` o mostra de novo.
- **Cada página decide quando ocultá-lo:** ao terminar de montar, ou quando uma requisição terminar.

## Uso

```js
import { preload, useOcultarPreload } from '@/components/Preload/preloadStore'
```

### Página sem requisição: oculta ao terminar de montar

Chame o hook no topo do componente. É uma linha só:

```jsx
function Login() {
	useOcultarPreload()

	return <form>...</form>
}
```

### Página com requisição: oculta quando os dados chegarem

```jsx
function Historico() {
	const [relatos, setRelatos] = useState([])

	useEffect(() => {
		preload.texto('Buscando seu histórico')

		api.get('/relatos')
			.then((resposta) => setRelatos(resposta.data))
			.catch(() => toast('Não foi possível carregar o histórico', { tipo: 'erro' }))
			.finally(() => preload.ocultar()) // oculta com sucesso ou com erro
	}, [])

	return <ListaRelatos relatos={relatos} />
}
```

Use sempre o `.finally()`, ou `try/finally` com `async/await`. Se a requisição falhar e o `ocultar()` só existir no caminho de sucesso, o preload nunca sai da tela.

### Durante uma ação (ex.: enviar um relato)

```js
async function enviarRelato() {
	preload.mostrar('Enviando seu relato')
	try {
		await api.post('/relatos', dados)
		preload.texto('Gerando o resumo') // troca o texto sem fechar
		await api.post('/resumos', ...)
	} finally {
		preload.ocultar()
	}
}
```

## Métodos

| Método | Descrição |
|---|---|
| `preload.mostrar(texto?)` | Mostra o preload. O texto padrão é `'Carregando'` |
| `preload.texto(texto)` | Troca o texto com o preload já aberto |
| `preload.ocultar()` | Oculta com animação de fade |
| `useOcultarPreload()` | Hook: oculta quando a página termina de montar |

## Comportamento

- **Rolagem:** enquanto o preload está na tela, a página não rola (classe `preload-ativo` no `<body>`).
- **Camadas:** fica acima dos dialogs e **abaixo dos toasts**. Assim, um erro avisado por toast durante o carregamento continua visível.
- **Esquecimento:** em desenvolvimento, se o preload ficar 10 segundos na tela, aparece um aviso no console com a rota. Na maioria das vezes, é uma página que esqueceu de chamar `preload.ocultar()` ou `useOcultarPreload()`.
- **Acessibilidade:** tem `role="status"`, então leitores de tela anunciam o texto. Quem desativou animações no sistema vê o anel girando devagar e o texto sem piscar.

## Testar pelo console do navegador

Em desenvolvimento (`npm run dev`), fica disponível em `window.preload`:

```js
preload.mostrar()
preload.texto('Gerando resumo')
preload.ocultar()
preload.mostrar('Buscando clínicas próximas')
```

## Arquivos

- `preloadStore.js`: o objeto `preload`, o hook `useOcultarPreload` e o estado global (zustand)
- `Preload.jsx`: o componente
- `Preload.scss`: estilos e animações
