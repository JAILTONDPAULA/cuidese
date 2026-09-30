# Classes de API

Cada domínio do app tem uma classe em `src/api/<Dominio>Api.js`, com métodos estáticos. Exemplos: `UsuarioApi`, `RelatoApi`, `ResumoApi`, `RecomendacaoApi`.

Cada método:

- já sabe a **URL**, o **método HTTP** e as **opções** da requisição;
- recebe só os dados de negócio (ex.: o CPF);
- chama o `FetchHelper` e **devolve exatamente o que ele devolver**, uma Promise;
- aceita um último parâmetro `opcoes`, repassado ao `FetchHelper`, para a página sobrescrever algo quando precisar (`signal`, `preload: false` etc.).

Quem trata o retorno é a **página** que chamou. Preload, toast de erro e validação do formato ficam por conta do `FetchHelper` (veja `src/helpers/FetchHelper/README.md`).

## Criando uma classe

```js
// src/api/RelatoApi.js
import FetchHelper from '@/helpers/FetchHelper/FetchHelper'

class RelatoApi {
	static listar(opcoes) {
		return FetchHelper.call('/relatos', { preload: 'Buscando seu histórico', ...opcoes })
	}

	static criar(texto, opcoes) {
		return FetchHelper.call('/relatos', { metodo: 'POST', dados: { texto }, ...opcoes })
	}
}

export default RelatoApi
```

O `...opcoes` vem **por último**, para a página conseguir sobrescrever qualquer padrão do método.

## Usando na página

```jsx
import UsuarioApi from '@/api/UsuarioApi'

// Numa ação (clique, envio de form)
function handleContinuar() {
	UsuarioApi.validarCPF(cpf)
		.then((resposta) => {
			/* sucesso: tratar a resposta */
		})
		.catch(() => setCpfInvalido(true)) // o toast de erro já foi mostrado
}

// Ao abrir a página, cancelando se a pessoa sair antes da resposta
useEffect(() => {
	const controller = new AbortController()
	RelatoApi.listar({ signal: controller.signal }).then(setRelatos).catch(() => {})
	return () => controller.abort()
}, [])
```

## Classes existentes

| Classe | Métodos |
|---|---|
| `UsuarioApi` | `cadastrar({ nome, cpf, email, telefone, data_nascimento, sexo }, opcoes)`: `POST /usuarios`. Envia CPF e telefone só com os dígitos. O `sexo` é `F`, `M`, `O` ou `N`. Retorna **201** com `{ mensagem, token }`. O `token` identifica o cadastro e vai para `/confirmar?c=<token>`. Erros: **422** (validação) e **409** (CPF ou e-mail já cadastrado), com a mensagem em texto puro no corpo |

## Tratando um status específico na página

Quando a página quer tratar um erro do seu jeito (ex.: abrir um dialog no 409), ela passa `silenciar` para o FetchHelper não mostrar o toast daquele status. Os outros erros continuam com toast normalmente:

```js
UsuarioApi.cadastrar(dados, { silenciar: [409] }).catch((erro) => {
	if (erro instanceof ApiErro && erro.status === 409) {
		dialog({ id: 'cadastro-existente', titulo: 'Cadastro já existe', conteudo: erro.corpo, tipo: 'alerta' })
	}
})
```
