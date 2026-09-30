import FetchHelper from '@/helpers/FetchHelper/FetchHelper'

// Requisições do domínio Usuário. Cada método já sabe a URL e as opções;
// devolve o que o FetchHelper devolver, e a página trata o retorno.
class UsuarioApi {
	/**
	 * Cadastro inicial (sem senha). POST /usuarios → 201 com { mensagem, token }; o token identifica
	 * o cadastro na tela de confirmação (/confirmar?c=<token>).
	 * Erros: 422 (validação) e 409 (CPF ou e-mail já cadastrado), com a mensagem em texto puro no corpo.
	 *
	 * @param {object} dados
	 * @param {string} dados.nome
	 * @param {string} dados.cpf Com ou sem máscara (é enviado só com os dígitos)
	 * @param {string} dados.email
	 * @param {string} dados.telefone Com ou sem máscara (é enviado só com os dígitos)
	 * @param {string} dados.data_nascimento AAAA-MM-DD
	 * @param {'F'|'M'|'O'|'N'} dados.sexo
	 * @param {object} [opcoes] Opções extras do FetchHelper (ex.: { silenciar: [409] })
	 */
	static cadastrar({ nome, cpf, email, telefone, data_nascimento, sexo }, opcoes) {
		return FetchHelper.call('/usuarios', {
			metodo: 'POST',
			dados: {
				nome: nome.trim(),
				cpf: cpf.replace(/\D/g, ''),
				email: email.trim(),
				telefone: telefone.replace(/\D/g, ''),
				data_nascimento,
				sexo,
			},
			preload: 'Criando sua conta',
			...opcoes,
		})
	}
}

export default UsuarioApi
