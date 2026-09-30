// DDDs em uso no Brasil (Anatel). Números que não existem: 20, 23, 25, 26, 29, 30, 36, 39, 40, 50, 52, 56–60, 70, 72, 76, 78, 80, 90.
const DDDS = new Set([
	11, 12, 13, 14, 15, 16, 17, 18, 19,
	21, 22, 24, 27, 28,
	31, 32, 33, 34, 35, 37, 38,
	41, 42, 43, 44, 45, 46, 47, 48, 49,
	51, 53, 54, 55,
	61, 62, 63, 64, 65, 66, 67, 68, 69,
	71, 73, 74, 75, 77, 79,
	81, 82, 83, 84, 85, 86, 87, 88, 89,
	91, 92, 93, 94, 95, 96, 97, 98, 99,
])

// Métodos de apoio para telefone brasileiro (fixo e celular), sempre com DDD.
// Uso: TelefoneHelper.mascarar('85999999999'), TelefoneHelper.validar('(85) 9 9999-9999')
class TelefoneHelper {
	static DDDS = DDDS

	/**
	 * Aplica a máscara conforme a quantidade de dígitos, removendo tudo que não for número.
	 * Até 10 dígitos segue o formato fixo; com 11, formato celular. Acima de 11, os excedentes são descartados.
	 * Um "+55" no início (comum em preenchimento automático) é removido.
	 *
	 * @example
	 * TelefoneHelper.mascarar('85')          // '(85'
	 * TelefoneHelper.mascarar('859999')      // '(85) 9999'
	 * TelefoneHelper.mascarar('8532223333')  // '(85) 3222-3333'
	 * TelefoneHelper.mascarar('85999998888') // '(85) 9 9999-8888'
	 *
	 * @param {string} valor
	 * @returns {string}
	 */
	static mascarar(valor) {
		const texto = String(valor ?? '').trim()
		let digitos = texto.replace(/\D/g, '')
		if (texto.startsWith('+55')) digitos = digitos.slice(2)
		digitos = digitos.slice(0, 11)

		if (!digitos) return ''
		if (digitos.length <= 2) return `(${digitos}`
		if (digitos.length === 11) return digitos.replace(/^(\d{2})(\d)(\d{4})(\d{4})$/, '($1) $2 $3-$4')

		return digitos.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d{1,4})$/, '$1-$2')
	}

	/**
	 * Diz por que o telefone é inválido, ou null se for válido. Útil para mostrar a mensagem ao usuário.
	 * Regras: 10 dígitos (fixo) ou 11 (celular); DDD existente; celular começa com 9;
	 * fixo começa com 2, 3, 4 ou 5; número sem todos os dígitos iguais.
	 *
	 * @param {string} telefone Com ou sem máscara
	 * @returns {string|null}
	 */
	static motivoInvalido(telefone) {
		const digitos = String(telefone ?? '').replace(/\D/g, '')

		// Mensagens curtas: aparecem embaixo do campo, que pode estar em meia coluna
		if (digitos.length < 10) return 'Telefone incompleto, com DDD.'
		if (digitos.length > 11) return 'Telefone com dígitos demais.'

		const ddd = Number(digitos.slice(0, 2))
		if (!DDDS.has(ddd)) return `DDD ${digitos.slice(0, 2)} não existe.`

		const numero = digitos.slice(2)
		const primeiro = numero[0]

		if (numero.length === 9 && primeiro !== '9') return 'Celular começa com 9 após o DDD.'
		if (numero.length === 8 && /[6-9]/.test(primeiro)) return 'Faltou o 9 do celular.'
		if (numero.length === 8 && !/[2-5]/.test(primeiro)) return 'Fixo começa com 2, 3, 4 ou 5.'
		if (/^(\d)\1+$/.test(numero.slice(-8))) return 'Número de telefone inválido.'

		return null
	}

	/**
	 * @param {string} telefone Com ou sem máscara
	 * @returns {boolean}
	 */
	static validar(telefone) {
		return TelefoneHelper.motivoInvalido(telefone) === null
	}

	/**
	 * Tipo pelo número de dígitos, sem validar.
	 *
	 * @param {string} telefone Com ou sem máscara
	 * @returns {'celular'|'fixo'|null}
	 */
	static tipo(telefone) {
		const tamanho = String(telefone ?? '').replace(/\D/g, '').length
		if (tamanho === 11) return 'celular'
		if (tamanho === 10) return 'fixo'
		return null
	}
}

export default TelefoneHelper
