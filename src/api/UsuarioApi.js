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

	/**
	 * Pré-validação do token de confirmação. POST /usuarios/validar-token → 200 com { mensagem, token }
	 * (token = código de 6 dígitos). Erros em texto puro: 422 (faltou tokenA/tokenB), token inválido e 410 (expirado).
	 *
	 * @param {string} tokenA Identificador do cadastro (o "c" da URL)
	 * @param {string} tokenB Hash do token: o "token" do link do e-mail, ou o md5 do código digitado
	 * @param {object} [opcoes] Opções extras do FetchHelper (ex.: { signal })
	 */
	static validarToken(tokenA, tokenB, opcoes) {
		return FetchHelper.call('/usuarios/validar-token', {
			metodo: 'POST',
			dados: { tokenA, tokenB },
			preload: 'Validando o código',
			...opcoes,
		})
	}

	/**
	 * Define a nova senha depois do token validado. POST /usuarios/redefinir-senha → 200 com { mensagem }.
	 * Erros em texto puro: 422 (validação), token inválido e 410 (expirado).
	 *
	 * @param {string} tokenA Identificador do cadastro (o "c" da URL)
	 * @param {string} tokenB O mesmo tokenB aceito na validação do token
	 * @param {string} password A nova senha, em texto (o backend gera o hash)
	 * @param {object} [opcoes] Opções extras do FetchHelper
	 */
	static redefinirSenha(tokenA, tokenB, password, opcoes) {
		return FetchHelper.call('/usuarios/redefinir-senha', {
			metodo: 'POST',
			dados: { tokenA, tokenB, password },
			preload: 'Salvando sua senha',
			...opcoes,
		})
	}
}

export default UsuarioApi
