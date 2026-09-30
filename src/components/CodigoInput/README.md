# CodigoInput

Campo de código numérico em caixas separadas, uma por dígito. Serve, por exemplo, para o código de 6 dígitos enviado por e-mail.

## Uso

```jsx
import CodigoInput from '@/components/CodigoInput/CodigoInput'

const [codigo, setCodigo] = useState('')

<div className="field">
	<span className="field__label">Código de confirmação</span>
	<CodigoInput valor={codigo} onChange={setCodigo} name="token" />
</div>
```

O componente é **controlado**: quem usa guarda o valor num `useState` e o passa em `valor` e `onChange`.

## Props

| Prop | Tipo | Padrão | Descrição |
|---|---|---|---|
| `valor` | `string` | `''` | Os dígitos já digitados (ex.: `'1234'`) |
| `onChange` | `(valor: string) => void` | — | Chamado com o novo valor a cada alteração |
| `tamanho` | `number` | `6` | Quantidade de caixas |
| `name` | `string` | — | Se informado, cria um `<input type="hidden">` com o valor completo, para o `FormData` do form |
| `autoFocus` | `boolean` | `false` | Foca a primeira caixa ao abrir |
| `disabled` | `boolean` | `false` | Desabilita todas as caixas |

## Comportamento

- **Digitar** um número preenche a caixa e passa para a próxima.
- **Colar** o código inteiro (`123456`) em qualquer caixa distribui os dígitos a partir dela.
- **Preenchimento automático:** no celular, o teclado sugere o código recebido (`autocomplete="one-time-code"`), e ele é distribuído nas caixas.
- **Backspace** numa caixa vazia apaga o dígito anterior e volta para ela.
- **Setas** ← e → navegam entre as caixas.
- **Preenchimento em sequência:** não dá para pular caixas. Clicar numa caixa depois da primeira vazia leva o foco para a primeira vazia. Por isso, o valor é sempre uma string contínua, sem buracos.
- **Letras e símbolos** são ignorados.
- Ao focar uma caixa preenchida, o conteúdo é selecionado, e o próximo dígito digitado o substitui.

## Cuidados

- Use dentro de um `.field`, como no exemplo, para herdar o visual padrão dos campos, incluindo a classe `field--erro`.
- **O `<input type="hidden">` não é validado pelo navegador** (`required` não funciona nele). Confira se o código está completo antes de enviar, com `codigo.length === 6`.
- Os números são tratados no `onChange`, e não no `onKeyDown`, porque os teclados virtuais do Android não informam a tecla digitada no keydown.
