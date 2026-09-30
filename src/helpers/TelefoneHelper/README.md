# TelefoneHelper

Classe com métodos estáticos para telefone brasileiro, fixo ou celular, sempre com DDD: máscara, validação e tipo. Não precisa instanciar (não use `new`).

## Uso

```js
import TelefoneHelper from '@/helpers/TelefoneHelper/TelefoneHelper'

TelefoneHelper.mascarar('85999998888')       // '(85) 9 9999-8888'
TelefoneHelper.validar('(85) 3222-3333')     // true
TelefoneHelper.motivoInvalido('(85) 9999-8888') // 'Faltou o 9 do celular.'
TelefoneHelper.tipo('(85) 9 9999-8888')      // 'celular'
```

## Métodos

### `TelefoneHelper.mascarar(valor)` → `string`

Remove tudo o que não for número e aplica a máscara aos poucos, conforme a quantidade de dígitos. Foi feito para ser usado enquanto a pessoa digita.

- **Até 10 dígitos:** formato de **fixo**, `(85) 9999-9999`.
- **11 dígitos:** formato de **celular**, `(85) 9 9999-9999`.
- **Acima de 11:** os excedentes, que são os últimos digitados, são descartados.
- **`+55` no início:** é removido. Isso é comum quando o navegador preenche o telefone automaticamente.

| Entrada | Saída |
|---|---|
| `'8'` | `'(8'` |
| `'85'` | `'(85'` |
| `'859'` | `'(85) 9'` |
| `'859999'` | `'(85) 9999'` |
| `'8599999'` | `'(85) 9999-9'` |
| `'8532223333'` | `'(85) 3222-3333'` (fixo) |
| `'85999998888'` | `'(85) 9 9999-8888'` (celular) |
| `'859999988887'` | `'(85) 9 9999-8888'` (o 12º dígito é descartado) |
| `'+55 85 99999-8888'` | `'(85) 9 9999-8888'` |

### `TelefoneHelper.validar(telefone)` → `boolean`

Retorna `true` se o telefone é válido. Aceita o valor com ou sem máscara. As regras estão no `motivoInvalido`, logo abaixo.

### `TelefoneHelper.motivoInvalido(telefone)` → `string | null`

Faz a mesma validação, mas diz **por que** o telefone é inválido, ou `null` se estiver válido. Use para mostrar a mensagem ao usuário.

| Regra | Exemplo inválido | Mensagem |
|---|---|---|
| Ter 10 (fixo) ou 11 (celular) dígitos | `(85) 9999` | Telefone incompleto, com DDD. |
| DDD existente no Brasil (67 DDDs da Anatel) | `(20) 9 9999-8888` | DDD 20 não existe. |
| Celular (11 dígitos) começa com 9 | `(85) 8 9999-8888` | Celular começa com 9 após o DDD. |
| 8 dígitos começando com 6–9 é celular sem o 9 | `(85) 9999-8888` | Faltou o 9 do celular. |
| Fixo começa com 2, 3, 4 ou 5 | `(85) 1222-3333` | Fixo começa com 2, 3, 4 ou 5. |
| Número sem todos os dígitos iguais | `(85) 3333-3333` | Número de telefone inválido. |

As mensagens são curtas de propósito, porque aparecem embaixo do campo, que pode estar em meia coluna.

### `TelefoneHelper.tipo(telefone)` → `'celular' | 'fixo' | null`

Diz o tipo pela quantidade de dígitos, **sem validar**: 11 é `'celular'`, 10 é `'fixo'`, e qualquer outra quantidade é `null`.

### `TelefoneHelper.DDDS` → `Set<number>`

Os DDDs válidos no Brasil. Útil, por exemplo, para montar um select de DDD.

## Exemplo num input

Veja o campo Telefone em `src/pages/Cadastro/Cadastro.jsx`:
- **Enquanto digita:** o campo recebe a máscara.
- **Com 11 dígitos, ou ao sair do campo:** o telefone é validado. Com 10 dígitos, não dá para saber se é um fixo completo ou um celular incompleto, por isso a validação espera.

## Cuidados

- **Remova a máscara antes de enviar para a API:** `telefone.replace(/\D/g, '')`.
- **A validação confere o formato, não se o número existe ou está ativo.** Para ter certeza de que o número é da pessoa, só com confirmação por SMS ou WhatsApp.
- **A lista de DDDs segue a Anatel.** Se um DDD novo for criado, adicione-o ao `Set` no topo do arquivo.
