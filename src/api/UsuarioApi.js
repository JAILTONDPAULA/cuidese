import FetchHelper from '@/helpers/FetchHelper/FetchHelper'

// Requisições do domínio Usuário. Cada método já sabe a URL e as opções;
// devolve o que o FetchHelper devolver, e a página trata o retorno.
class UsuarioApi {
	/**
	 * Verifica o CPF no backend (ex.: se já está cadastrado).
	 * Endpoint ainda não existe no Laravel: ajustar a URL quando for criado.
	 *
	 * @param {string} cpf Com ou sem máscara (é enviado só com os dígitos)
	 * @param {object} [opcoes] Opções extras do FetchHelper (ex.: { signal, preload: false })
	 */
	static validarCPF(cpf, opcoes) {
		return FetchHelper.call('/usuarios/validar-cpf', {
			metodo: 'POST',
			dados: { cpf: String(cpf).replace(/\D/g, '') },
			preload: 'Validando CPF',
			...opcoes,
		})
	}
}

export default UsuarioApi
