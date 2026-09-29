# Toast

Notificações flutuantes no canto superior direito. Podem aparecer uma ou várias ao mesmo tempo, empilhadas.

## Instalação

Já está ativo no app todo: o `<Toaster />` é renderizado uma única vez em `src/main.jsx`. Não coloque outro `<Toaster />` em telas ou layouts.

## Uso

```jsx
import { toast } from '@/components/Toast/toast'

toast('Relato salvo')
```

A função `toast` pode ser chamada de qualquer lugar: componentes, funções utilitárias, stores do zustand e respostas de requisições.

### Parâmetros

```js
toast(conteudo, { tipo, temporario, duracao, html })
```

| Parâmetro | Tipo | Padrão | Descrição |
|---|---|---|---|
| `conteudo` | `string` ou JSX | — | Texto ou JSX exibido no toast |
| `tipo` | `'primary'` \| `'alerta'` \| `'erro'` \| `'sucesso'` | `'primary'` | Cor da borda esquerda |
| `temporario` | `boolean` | `false` | Se `true`, some sozinho depois de `duracao` |
| `duracao` | `number` (ms) | `5000` | Tempo até sumir. Só vale com `temporario: true` |
| `html` | `boolean` | `false` | Interpreta a string `conteudo` como HTML |

A função retorna o `id` do toast.

| Tipo | Cor |
|---|---|
| `primary` | `--primary-500` (azul) |
| `alerta` | `--secondary-500` (amarelo) |
| `erro` | `--red-500` (vermelho) |
| `sucesso` | `--tertiary-500` (verde) |

### Exemplos

```jsx
// Fica até o usuário fechar (padrão)
toast('Não foi possível carregar o histórico', { tipo: 'erro' })

// Some sozinho em 5 segundos
toast('Relato salvo com sucesso', { tipo: 'sucesso', temporario: true })

// Some sozinho em 3 segundos
toast('Verifique sua conexão', { tipo: 'alerta', temporario: true, duracao: 3000 })

// Conteúdo em JSX
toast(
	<>
		<strong>Resumo pronto!</strong>
		<p>A IA terminou de analisar seu relato.</p>
	</>,
	{ tipo: 'sucesso' },
)

// Conteúdo como string HTML
toast('<strong>Atenção:</strong> sessão expirando', { html: true, tipo: 'alerta' })

// Fechar por código
const id = toast('Enviando...')
toast.fechar(id)

// Fechar todos
toast.fecharTodos()
```

## Cuidados

- **`html: true` só com conteúdo confiável**, escrito por nós no código. Nunca use com texto vindo do usuário ou da API, como relatos e resumos: isso abre brecha para injeção de script (XSS). Para conteúdo dinâmico, prefira JSX, que escapa o texto automaticamente.
- **O `<Toaster />` fica fora do router.** Por isso, `<Link>` do react-router não funciona dentro de um toast. Use `<a href="...">`, ou um botão que chame `navigate()` a partir do componente que disparou o toast.
- O conteúdo tem altura máxima de 200px. Acima disso, aparece uma barra de rolagem. A largura máxima é de 360px.

## Testar pelo console do navegador

Em desenvolvimento (`npm run dev`), a função fica disponível em `window.toast`. Abra o DevTools (F12) → Console e rode:

```js
toast('Olá!')
toast('Salvo!', { tipo: 'sucesso', temporario: true })
toast('<b>Erro</b> ao salvar', { tipo: 'erro', html: true })
```

No build de produção, a função não é exposta no console.

## Arquivos

- `toast.js`: a função `toast()` e o estado global (zustand)
- `Toaster.jsx`: o container e cada toast
- `Toast.scss`: estilos e animações
