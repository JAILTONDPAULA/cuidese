import { Capacitor } from '@capacitor/core'
import FetchHelper from '@/helpers/FetchHelper/FetchHelper'

// Requisições de autenticação (token Sanctum). A sessão em si fica no sessaoStore;
// estes métodos só falam com a API e devolvem o que o FetchHelper devolver.
class AutenticacaoApi {
	/**
	 * POST /login → 200 com { token, usuario }.
	 * Erros em texto puro: 401 (e-mail ou senha inválidos), 403 (e-mail não confirmado), 422 (validação), 429.
	 *
	 * @param {string} email
	 * @param {string} password
	 * @param {object} [opcoes] Opções extras do FetchHelper
	 */
	static login(email, password, opcoes) {
		return FetchHelper.call('/login', {
			metodo: 'POST',
			// dispositivo dá nome ao token na API ('web', 'android' ou 'ios'), para saber de onde é cada sessão
			dados: { email: email.trim(), password, dispositivo: Capacitor.getPlatform() },
			preload: 'Entrando',
			...opcoes,
		})
	}

	/**
	 * POST /login/google → 200 com { token, usuario } (mesmo formato do login por e-mail).
	 * A API valida o ID token com o Google, encontra ou cria o usuário e devolve a sessão.
	 * Endpoint ainda não existe no Laravel (etapa 2 do login com Google).
	 *
	 * @param {string} idToken O "credential" devolvido pelo botão do Google (JWT)
	 * @param {object} [opcoes] Opções extras do FetchHelper
	 */
	static loginGoogle(idToken, opcoes) {
		return FetchHelper.call('/login/google', {
			metodo: 'POST',
			dados: { id_token: idToken, dispositivo: Capacitor.getPlatform() },
			preload: 'Entrando com o Google',
			...opcoes,
		})
	}

	/**
	 * POST /logout → revoga o token atual na API (sai só deste aparelho). Exige estar logado.
	 *
	 * @param {object} [opcoes] Opções extras do FetchHelper
	 */
	static logout(opcoes) {
		return FetchHelper.call('/logout', { metodo: 'POST', preload: 'Saindo', ...opcoes })
	}

	/**
	 * GET /usuarios/eu → dados do usuário logado (o mesmo formato de "usuario" do login).
	 *
	 * @param {object} [opcoes] Opções extras do FetchHelper
	 */
	static eu(opcoes) {
		return FetchHelper.call('/usuarios/eu', opcoes)
	}
}

export default AutenticacaoApi
