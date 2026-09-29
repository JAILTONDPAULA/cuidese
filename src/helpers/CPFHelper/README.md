# CPFHelper

Classe com métodos estáticos para trabalhar com CPF: validar e aplicar máscara. Não precisa instanciar (não use `new`).

## Uso

```js
import CPFHelper from '@/helpers/CPFHelper/CPFHelper'

CPFHelper.validar('529.982.247-25') // true
CPFHelper.mascarar('52998224725')   // '529.982.247-25'
```

## Métodos

### `CPFHelper.validar(cpf)` → `boolean`

Confere se o CPF é válido pelos dois dígitos verificadores. Aceita o valor com ou sem máscara, porque pontos, traço e espaços são ignorados.

Retorna `false` quando:

- o valor tem menos (ou mais) de 11 dígitos;
- todos os dígitos são iguais, como `111.111.111-11`. Esses CPFs passam no cálculo, mas são inválidos pela Receita;
- os dígitos verificadores não batem;
- o valor é vazio, `null` ou `undefined`.

```js
CPFHelper.validar('529.982.247-25') // true
CPFHelper.validar('52998224725')    // true  (sem máscara)
CPFHelper.validar('529.982.247-24') // false (verificador errado)
CPFHelper.validar('111.111.111-11') // false (dígitos repetidos)
CPFHelper.validar('5299822472')     // false (10 dígitos)
```

### `CPFHelper.mascarar(valor)` → `string`

Remove tudo o que não for número e devolve o valor com a máscara `000.000.000-00`, aplicada aos poucos conforme a quantidade de dígitos. Foi feito para ser usado enquanto a pessoa digita.

| Entrada | Saída |
|---|---|
| `'123'` | `'123'` |
| `'1234'` | `'123.4'` |
| `'1234567'` | `'123.456.7'` |
| `'1234564569'` | `'123.456.456-9'` |
| `'12345678909'` | `'123.456.789-09'` |
| `'123456789091'` | `'123.456.789-09'` (o 12º dígito é descartado) |
| `'abc123.45-6x'` | `'123.456'` (letras e símbolos são removidos) |

**Limite de 11 dígitos:** depois do 11º dígito, os excedentes, que são os últimos digitados, são descartados. Na prática, o campo não aceita mais números.

### Exemplo num input

```jsx
<input
	name="cpf"
	inputMode="numeric"
	onChange={(e) => (e.target.value = CPFHelper.mascarar(e.target.value))}
	onBlur={(e) => e.target.setCustomValidity(CPFHelper.validar(e.target.value) ? '' : 'CPF inválido')}
/>
```

## Cuidados

- O backend guarda o CPF **só com os 11 dígitos**. Antes de enviar, remova a máscara com `cpf.replace(/\D/g, '')`.
- A máscara usa expressões regulares em sequência: primeiro remove os não números (`/\D/g`), depois insere o 1º ponto, o 2º ponto e por fim o traço (`$1-$2`), só quando já existem dígitos suficientes para cada parte.
