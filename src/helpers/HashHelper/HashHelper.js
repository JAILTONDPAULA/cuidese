import md5 from 'js-md5'

// Métodos de apoio para hash. Uso: HashHelper.md5('texto'), HashHelper.md5Email('Maria@Exemplo.com')
class HashHelper {
	/**
	 * MD5 do texto, em hexadecimal minúsculo (32 caracteres).
	 * Não use para senhas: MD5 é rápido de quebrar. Serve como identificador.
	 *
	 * @param {string} texto
	 * @returns {string}
	 */
	static md5(texto) {
		return md5(String(texto ?? ''))
	}

	/**
	 * MD5 do e-mail normalizado do mesmo jeito que o backend salva (trim + minúsculas),
	 * para o hash bater com o calculado a partir do e-mail no banco.
	 *
	 * @param {string} email
	 * @returns {string}
	 */
	static md5Email(email) {
		return HashHelper.md5(String(email ?? '').trim().toLowerCase())
	}
}

export default HashHelper
