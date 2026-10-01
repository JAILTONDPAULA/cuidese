// Requisitos mínimos de segurança da senha. Letras acentuadas contam como letras (\p{L}),
// não como caractere especial.
const REGRAS = [
	{ id: 'tamanho', texto: 'Entre 8 e 12 caracteres', teste: (s) => [...s].length >= 8 && [...s].length <= 12 },
	{ id: 'minuscula', texto: 'Uma letra minúscula', teste: (s) => /\p{Ll}/u.test(s) },
	{ id: 'maiuscula', texto: 'Uma letra maiúscula', teste: (s) => /\p{Lu}/u.test(s) },
	{ id: 'numero', texto: 'Um número', teste: (s) => /\d/.test(s) },
	{ id: 'especial', texto: 'Um caractere especial (ex.: ! @ # $ %)', teste: (s) => /[^\p{L}\p{N}\s]/u.test(s) },
]

// Métodos de apoio para senha. Uso: SenhaHelper.validar('Abc@1234'), SenhaHelper.conferem(senha, confirmacao)
class SenhaHelper {
	static REGRAS = REGRAS

	/**
	 * Resultado de cada requisito, na ordem de REGRAS. Útil para montar um checklist na tela.
	 *
	 * @param {string} senha
	 * @returns {{ id: string, texto: string, ok: boolean }[]}
	 */
	static verificar(senha) {
		const texto = String(senha ?? '')
		return REGRAS.map(({ id, texto: descricao, teste }) => ({ id, texto: descricao, ok: teste(texto) }))
	}

	/**
	 * @param {string} senha
	 * @returns {boolean} true se atende a todos os requisitos
	 */
	static validar(senha) {
		return SenhaHelper.verificar(senha).every((regra) => regra.ok)
	}

	/**
	 * Mensagem com os requisitos que faltam, ou null se a senha for válida.
	 *
	 * @param {string} senha
	 * @returns {string|null} ex.: 'A senha precisa ter: uma letra maiúscula, um número.'
	 */
	static motivoInvalido(senha) {
		const faltando = SenhaHelper.verificar(senha).filter((regra) => !regra.ok)
		if (!faltando.length) return null
		return `A senha precisa ter: ${faltando.map((regra) => regra.texto.toLowerCase()).join(', ')}.`
	}

	/**
	 * Confere se a senha e a confirmação são iguais (e não vazias).
	 *
	 * @param {string} senha
	 * @param {string} confirmacao
	 * @returns {boolean}
	 */
	static conferem(senha, confirmacao) {
		return Boolean(senha) && senha === confirmacao
	}
}

export default SenhaHelper
