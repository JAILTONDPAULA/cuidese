# SenhaHelper

Classe com métodos estáticos para os requisitos mínimos de segurança da senha e para conferir a confirmação. Não precisa instanciar (não use `new`).

## Requisitos

| `id` | Requisito |
|---|---|
| `tamanho` | Entre 8 e 12 caracteres |
| `minuscula` | Pelo menos uma letra minúscula (acentuadas contam: `ç`, `ã`…) |
| `maiuscula` | Pelo menos uma letra maiúscula (acentuadas contam: `Ç`, `Ã`…) |
| `numero` | Pelo menos um número |
| `especial` | Pelo menos um caractere especial: qualquer coisa que não seja letra, número ou espaço (`! @ # $ % & * . - _` …) |

Os requisitos ficam no array `SenhaHelper.REGRAS`, no topo do arquivo. Para mudar uma regra, mude só ali: o checklist da tela e as mensagens se ajustam sozinhos.

## Uso

```js
import SenhaHelper from '@/helpers/SenhaHelper/SenhaHelper'

SenhaHelper.validar('Abc@1234')                 // true
SenhaHelper.motivoInvalido('abc@1234')          // 'A senha precisa ter: uma letra maiúscula.'
SenhaHelper.conferem('Abc@1234', 'Abc@1234')    // true
```

## Métodos

### `SenhaHelper.verificar(senha)` → `{ id, texto, ok }[]`

Retorna o resultado de cada requisito, na ordem de `REGRAS`. É o que monta o checklist da tela `/confirmar`.

```js
SenhaHelper.verificar('abc@1234')
// [
// 	{ id: 'tamanho',   texto: 'Entre 8 e 12 caracteres', ok: true },
// 	{ id: 'minuscula', texto: 'Uma letra minúscula',     ok: true },
// 	{ id: 'maiuscula', texto: 'Uma letra maiúscula',     ok: false },
// 	...
// ]
```

### `SenhaHelper.validar(senha)` → `boolean`

Retorna `true` se a senha atende a **todos** os requisitos.

### `SenhaHelper.motivoInvalido(senha)` → `string | null`

Retorna uma mensagem com os requisitos que faltam, ou `null` se a senha for válida. Serve, por exemplo, para o `setCustomValidity` do campo.

| Senha | Resultado |
|---|---|
| `'Abc@1234'` | `null` (válida) |
| `'abc@1234'` | A senha precisa ter: uma letra maiúscula. |
| `'Abcd1234'` | A senha precisa ter: um caractere especial (ex.: ! @ # $ %). |
| `'Abc@12345678x'` | A senha precisa ter: entre 8 e 12 caracteres. |

### `SenhaHelper.conferem(senha, confirmacao)` → `boolean`

Retorna `true` se as duas são **iguais e não vazias**. Duas senhas vazias retornam `false`.

## Cuidados

- **A validação no frontend é só para ajudar quem está digitando.** O backend precisa validar as mesmas regras, porque dá para chamar a API sem passar pela tela. No Laravel: `Password::min(8)->max(12)->mixedCase()->numbers()->symbols()`, junto com `'max:12'`.
- **O tamanho é contado por caractere**, e não por byte: um emoji conta como 1.
- **Espaço é permitido**, mas não conta como caractere especial.
