import { preload } from '@/components/Preload/preloadStore'
import { toast } from '@/components/Toast/toast'
import { sessao } from '@/stores/sessaoStore'

const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

const RETORNOS = ['json', 'text', 'blob', 'response']

// Erro de resposta da API (status fora de 2xx, ou corpo fora do formato pedido).
// Guarda o corpo puro para a página poder inspecionar no .catch().
export class ApiErro extends Error {
	constructor(mensagem, { status, corpo, resposta }) {
		super(mensagem)
		this.name = 'ApiErro'
		this.status = status
		this.corpo = corpo
		this.resposta = resposta
	}
}

// Todas as requisições do app passam por aqui: monta a chamada (com o token da sessão),
// controla o preload, valida o formato do retorno e avisa erros por toast.
class FetchHelper {
	/**
	 * @param {string} url Caminho relativo à VITE_API_URL (ex.: '/usuarios') ou URL absoluta
	 * @param {object} [opcoes]
	 * @param {'GET'|'POST'|'PUT'|'PATCH'|'DELETE'} [opcoes.metodo='GET']
	 * @param {object|FormData|null} [opcoes.dados=null] GET: vira query string; demais: corpo (objeto vira JSON)
	 * @param {'json'|'text'|'blob'|'response'} [opcoes.retorno='json'] Formato devolvido em caso de sucesso
	 * @param {boolean|string} [opcoes.preload=true] Mostra o preload durante a requisição; uma string vira o texto dele
	 * @param {object|null} [opcoes.headers=null] Headers extras (sobrescrevem os padrões)
	 * @param {AbortSignal} [opcoes.signal] Para cancelar (AbortController)
	 * @param {number[]} [opcoes.silenciar=[]] Status HTTP que não geram toast, porque a página vai tratá-los (ex.: [409])
	 * @returns {Promise<any>} O corpo no formato de `retorno`
	 * @throws {ApiErro|Error} Depois de mostrar o toast; a página decide o que fazer no .catch()
	 */
	static async call(
		url,
		{ metodo = 'GET', dados = null, retorno = 'json', preload: comPreload = true, headers = null, signal, silenciar = [] } = {},
	) {
		if (!RETORNOS.includes(retorno)) throw new Error(`FetchHelper: retorno "${retorno}" inválido. Use: ${RETORNOS.join(', ')}`)

		const { endereco, init, token } = FetchHelper.#montar(url, { metodo, dados, headers, signal })

		// O ticket garante que o ocultar() só afete a página em que a requisição começou
		const ticket = comPreload ? preload.mostrar(typeof comPreload === 'string' ? comPreload : undefined) : null

		try {
			const resposta = await fetch(endereco, init)

			// fetch só rejeita em falha de rede; status de erro precisa ser checado aqui
			if (!resposta.ok) {
				throw new ApiErro(`HTTP ${resposta.status}`, { status: resposta.status, corpo: await resposta.text(), resposta })
			}

			return await FetchHelper.#ler(resposta, retorno)
		} catch (erro) {
			// Sem toast quando o cancelamento é intencional (ex.: saiu da página)
			// ou quando a página avisou que trata aquele status
			const silenciado = erro instanceof ApiErro && silenciar.includes(erro.status)
			if (erro.name !== 'AbortError' && !silenciado) FetchHelper.#avisar(erro)

			// 401 com token: a sessão expirou ou foi revogada. Apaga a sessão do aparelho, e as rotas
			// protegidas levam ao login. Só se o token recusado ainda for o atual (não derruba um login novo).
			if (erro instanceof ApiErro && erro.status === 401 && token && token === sessao.token()) sessao.sair()

			throw erro
		} finally {
			if (ticket) preload.ocultar(ticket)
		}
	}

	static #montar(url, { metodo, dados, headers, signal }) {
		const method = metodo.toUpperCase()
		const daApi = !/^https?:\/\//.test(url)
		let endereco = daApi ? API_URL + url : url
		const padrao = {}
		let body

		// O token vai só para a nossa API (URL relativa), nunca para URLs externas
		const token = daApi ? sessao.token() : null
		if (token) padrao.Authorization = `Bearer ${token}`

		if (dados != null) {
			if (method === 'GET' || method === 'HEAD') {
				endereco += (endereco.includes('?') ? '&' : '?') + new URLSearchParams(dados)
			} else if (dados instanceof FormData || dados instanceof Blob || dados instanceof URLSearchParams) {
				body = dados // o navegador define o Content-Type certo
			} else {
				body = JSON.stringify(dados)
				padrao['Content-Type'] = 'application/json'
			}
		}

		return { endereco, token, init: { method, body, signal, headers: { ...padrao, ...headers } } }
	}

	static async #ler(resposta, retorno) {
		if (retorno === 'response') return resposta
		if (retorno === 'blob') return resposta.blob()
		if (retorno === 'text') return resposta.text()

		// json: valida o formato; resposta vazia (ex.: 204) vira null
		const texto = await resposta.text()
		if (!texto) return null
		try {
			return JSON.parse(texto)
		} catch {
			throw new ApiErro('A resposta não é um JSON válido', { status: resposta.status, corpo: texto, resposta })
		}
	}

	// Mostra no toast o corpo exatamente como a API devolveu (texto ou HTML)
	static #avisar(erro) {
		if (!(erro instanceof ApiErro)) {
			toast(`Não foi possível conectar ao servidor. ${erro.message}`, { tipo: 'erro' })
			return
		}

		const corpo = erro.corpo || `${erro.message} (sem conteúdo na resposta)`
		const tipoConteudo = erro.resposta?.headers.get('content-type') ?? ''
		const ehHtml = tipoConteudo.includes('html') || /<[a-z][\s\S]*>/i.test(corpo)

		if (ehHtml) toast(FetchHelper.#limparHtml(corpo), { tipo: 'erro', html: true })
		else toast(corpo, { tipo: 'erro' })
	}

	// Mantém o conteúdo do HTML, mas tira o que afetaria o app: estilos e scripts da página de erro
	// (ex.: a tela de debug do Laravel), e atributos de evento (onclick, onerror...)
	static #limparHtml(html) {
		const doc = new DOMParser().parseFromString(html, 'text/html')
		doc.querySelectorAll('script, style, link, meta, iframe').forEach((el) => el.remove())
		doc.querySelectorAll('*').forEach((el) => {
			for (const { name } of [...el.attributes]) if (name.startsWith('on')) el.removeAttribute(name)
		})
		return doc.body.innerHTML.trim() || 'Erro sem conteúdo legível na resposta'
	}
}

export default FetchHelper
