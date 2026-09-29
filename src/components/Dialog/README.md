# Dialog

Janela modal que cobre a tela toda com um fundo escuro semitransparente. No centro, perto do topo, fica um form branco dividido em três partes:

- **header**: ícone do tipo (quando houver), título e ícone de fechar (X);
- **body**: o conteúdo recebido (texto ou componente);
- **footer**: botão "Fechar".

Vários dialogs podem estar abertos ao mesmo tempo. Eles se empilham, e o mais recente fica na frente. Cada um tem um `id`, que permite fechar só aquele ou todos de uma vez.

## Instalação

Já está ativo no app todo: o `<Dialog />` é renderizado uma única vez em `src/main.jsx`. Não coloque outro `<Dialog />` em telas ou layouts.

## Uso

```jsx
import { dialog } from '@/components/Dialog/dialogStore'

dialog({ id: 'aviso', titulo: 'Aviso', conteudo: 'Seu relato foi salvo.' })
dialog.fechar('aviso')
```

A função `dialog` pode ser chamada de qualquer lugar: no clique de um botão, depois de uma requisição, dentro de uma store etc.

### Parâmetros

```js
dialog({ id, titulo, conteudo, tipo })
```

| Parâmetro | Tipo | Padrão | Descrição |
|---|---|---|---|
| `id` | `string` | gerado (`dialog-1`, `dialog-2`…) | Identifica o dialog para fechar depois. Se já existir um aberto com esse `id`, o conteúdo dele é **substituído**, e nenhum novo é aberto |
| `titulo` | `string` | — | Texto do header |
| `conteudo` | `string` ou JSX | — | Texto, JSX ou componente exibido no body |
| `tipo` | `'primary'` \| `'alerta'` \| `'erro'` \| `'sucesso'` | `'primary'` | Define o ícone ao lado do título |

A função retorna o `id` do dialog, o que é útil quando ele é gerado automaticamente.

O ícone aparece em branco, dentro de um selo (quadrado com cantos arredondados) com gradiente na cor do tipo, do tom 400 ao 600:

| Tipo | Ícone (Font Awesome) | Gradiente do selo |
|---|---|---|
| `primary` | sem ícone | — |
| `alerta` | `faExclamation` (!) | `--secondary-400` → `--secondary-600` (amarelo) |
| `erro` | `faXmark` (X) | `--red-400` → `--red-600` (vermelho) |
| `sucesso` | `faCheck` (✓) | `--tertiary-400` → `--tertiary-600` (verde) |

Dentro do form, a cor do tipo fica disponível em três variáveis CSS:

- `--dialog-cor`: tom 500;
- `--dialog-cor-claro`: tom 400;
- `--dialog-cor-escuro`: tom 600.

Elas estão reservadas também para o futuro botão de ação. No `primary`, usam `--primary-*`.

### Métodos

| Método | Descrição |
|---|---|
| `dialog({...})` | Abre um dialog, ou substitui o conteúdo se o `id` já estiver aberto. Retorna o `id` |
| `dialog.fechar(id)` | Fecha só o dialog com esse `id` |
| `dialog.fecharTodos()` | Fecha todos os dialogs abertos |

### Exemplos

```jsx
// Texto simples
dialog({ id: 'sessao', titulo: 'Sessão expirada', conteudo: 'Entre novamente para continuar.', tipo: 'alerta' })

// Componente
dialog({ id: 'compartilhar', titulo: 'Compartilhar', conteudo: <CompartilharRelato relatoId={relatoId} /> })

// Dialog sobre dialog
dialog({ id: 'relato', titulo: 'Seu relato', conteudo: <DetalheRelato /> })
dialog({ id: 'confirmar-exclusao', titulo: 'Excluir relato?', conteudo: 'Essa ação não pode ser desfeita.', tipo: 'erro' })
dialog.fechar('confirmar-exclusao') // volta para o dialog "relato"

// Atualizar o conteúdo de um dialog já aberto (mesmo id)
dialog({ id: 'resumo', titulo: 'Resumo', conteudo: 'Gerando resumo...' })
dialog({ id: 'resumo', titulo: 'Resumo', conteudo: <Resumo dados={resposta} />, tipo: 'sucesso' })

// Sem id: usa o id gerado que a função retorna
const id = dialog({ titulo: 'Aviso', conteudo: 'Teste' })
dialog.fechar(id)

// Fechar tudo
dialog.fecharTodos()
```

## Comportamento

- **Abrir:** o fundo aparece com fade e o form desce do topo.
- **Fechar:** pelo X, pelo botão "Fechar", pela tecla **Esc** ou pelos métodos. O form sobe e some.
- **Esc fecha só o dialog do topo.** Apertar de novo fecha o próximo.
- **Clicar no fundo escuro não fecha**, para não perder dados de formulário por acidente.
- **Empilhados:** cada dialog tem seu próprio fundo. Os de cima escurecem menos, para a tela não ficar preta.
- **Rolagem:** enquanto houver pelo menos um dialog aberto, a barra de rolagem da página some (classe `dialog-aberto` no `<body>`). Se o conteúdo for maior que a tela, o body do dialog ganha rolagem própria.
- **Foco:** ao abrir, o foco vai para o dialog. Ao fechar, volta para onde estava antes dele abrir.
- **Toasts:** continuam visíveis por cima de todos os dialogs.

## Cuidados

- O `<Dialog />` fica **fora do router**. Por isso, `<Link>` e `useNavigate()` não funcionam dentro do conteúdo. Use `<a href="...">`, ou passe uma função criada no componente que abriu o dialog.
- O botão de ação (submit) e o evento de envio do form ainda não existem. Hoje o submit só é bloqueado (`preventDefault`).

## Testar pelo console do navegador

Em desenvolvimento (`npm run dev`), a função fica disponível em `window.dialog`. Abra o DevTools (F12) → Console e rode:

```js
dialog({ id: 'a', titulo: 'Primeiro', conteudo: 'Dialog A' })
dialog({ id: 'b', titulo: 'Erro', conteudo: 'Dialog B, por cima do A', tipo: 'erro' })
dialog.fechar('b')
dialog({ id: 'c', titulo: 'Tudo certo', conteudo: 'Sucesso', tipo: 'sucesso' })
dialog.fecharTodos()
```

## Arquivos

- `dialogStore.js`: a função `dialog()` e o estado global (zustand)
- `Dialog.jsx`: a pilha de dialogs e cada dialog
- `Dialog.scss`: estilos, animações e trava de rolagem
