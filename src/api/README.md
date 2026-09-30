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
| `UsuarioApi` | `validarCPF(cpf, opcoes)`: `POST /usuarios/validar-cpf`. O **endpoint ainda não existe no Laravel** |
