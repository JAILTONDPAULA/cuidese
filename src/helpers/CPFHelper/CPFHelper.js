// Métodos de apoio para CPF. Uso: CPFHelper.validar('123.456.789-09'), CPFHelper.mascarar('12345')
class CPFHelper {
	/**
	 * Valida o CPF pelos dígitos verificadores. Aceita com ou sem máscara.
	 *
	 * @param {string} cpf
	 * @returns {boolean} false se não tiver exatamente 11 dígitos, se todos forem iguais
	 *   (ex.: 111.111.111-11, que passaria no cálculo) ou se os verificadores não baterem
	 */
	static validar(cpf) {
		const digitos = String(cpf ?? '').replace(/\D/g, '')

		if (!/^\d{11}$/.test(digitos)) return false
		if (/^(\d)\1{10}$/.test(digitos)) return false

		const numeros = [...digitos].map(Number)

		// Cada verificador: soma dos dígitos anteriores × pesos decrescentes (10..2 e depois 11..2)
		const verificador = (quantidade) => {
			const soma = numeros.slice(0, quantidade).reduce((total, n, i) => total + n * (quantidade + 1 - i), 0)
			const resto = (soma * 10) % 11
			return resto === 10 ? 0 : resto
		}

		return verificador(9) === numeros[9] && verificador(10) === numeros[10]
	}

	/**
	 * Aplica a máscara do CPF conforme a quantidade de dígitos, removendo tudo que não for número.
	 * Acima de 11 dígitos, os excedentes (os últimos digitados) são descartados.
	 *
	 * @example
	 * CPFHelper.mascarar('1234')        // '123.4'
	 * CPFHelper.mascarar('1234564569')  // '123.456.456-9'
	 * CPFHelper.mascarar('123456789091') // '123.456.789-09'
	 *
	 * @param {string} valor
	 * @returns {string}
	 */
	static mascarar(valor) {
		return String(valor ?? '')
			.replace(/\D/g, '')
			.slice(0, 11)
			.replace(/(\d{3})(\d)/, '$1.$2')
			.replace(/(\d{3})(\d)/, '$1.$2')
			.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
	}
}

export default CPFHelper
