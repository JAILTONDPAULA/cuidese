import { useEffect } from 'react'
import { create } from 'zustand'

export const TEXTO_PADRAO = 'Carregando'

// Estado global do preload. Começa visível: cada página decide quando ocultar.
// estado: 'visivel' → 'saindo' (animação de saída) → 'oculto'
//
// O preload fica na tela enquanto houver algo pendente:
// - paginaPendente: a página que está abrindo ainda não chamou useOcultarPreload()
// - requisicoes: quantos mostrar() (ex.: requisições do FetchHelper) ainda não tiveram o ocultar()
//
// geracao muda a cada troca de página. Cada mostrar() devolve um ticket com a geração;
// um ocultar(ticket) de uma página anterior é ignorado, para uma requisição antiga que termina
// depois da navegação não fechar o preload da página nova.
function pendente(s) {
	return s.paginaPendente || s.requisicoes > 0
}

// Recalcula o estado visual a partir do que está pendente
function comEstado(s) {
	if (pendente(s)) return { ...s, estado: 'visivel' }
	return { ...s, estado: s.estado === 'visivel' ? 'saindo' : s.estado }
}

export const usePreloadStore = create((set, get) => ({
	estado: 'visivel',
	texto: TEXTO_PADRAO,
	geracao: 0,
	paginaPendente: true,
	requisicoes: 0,

	// Sem texto: mantém o atual se já estiver visível, senão volta ao padrão
	mostrar: (texto) => {
		set((s) =>
			comEstado({
				...s,
				requisicoes: s.requisicoes + 1,
				texto: texto ?? (s.estado === 'visivel' ? s.texto : TEXTO_PADRAO),
			}),
		)
		return { geracao: get().geracao }
	},

	alterarTexto: (texto) => set({ texto }),

	// Sem ticket: vale para a página atual (uso manual)
	ocultar: (ticket) =>
		set((s) => {
			if (ticket && ticket.geracao !== s.geracao) return s
			return comEstado({ ...s, requisicoes: Math.max(0, s.requisicoes - 1) })
		}),

	// Libera a parte da página. Chamar de novo não faz nada (o StrictMode roda os efeitos duas vezes)
	liberarPagina: () => set((s) => (s.paginaPendente ? comEstado({ ...s, paginaPendente: false }) : s)),

	// Início de cada página (chamado pelo MainLayout): nova geração, página pendente, sem requisições
	iniciarPagina: () =>
		set((s) => ({ geracao: s.geracao + 1, paginaPendente: true, requisicoes: 0, estado: 'visivel', texto: TEXTO_PADRAO })),

	// Chamado pelo componente quando a animação de saída termina
	finalizar: () => set((s) => (s.estado === 'saindo' ? { estado: 'oculto' } : s)),
}))

export const preload = {
	/**
	 * Mostra o preload até o ocultar() correspondente.
	 * @param {string} [texto]
	 * @returns {{ geracao: number }} ticket para passar ao ocultar()
	 */
	mostrar: (texto) => usePreloadStore.getState().mostrar(texto),

	/** Troca o texto com o preload já aberto (ex.: 'Gerando resumo...'). @param {string} texto */
	texto: (texto) => usePreloadStore.getState().alterarTexto(texto),

	/**
	 * Encerra um mostrar(). O preload some quando não houver mais nada pendente.
	 * @param {{ geracao: number }} [ticket] o retorno do mostrar(); ignorado se for de outra página
	 */
	ocultar: (ticket) => usePreloadStore.getState().ocultar(ticket),

	/** Uso interno do MainLayout, a cada troca de página. */
	iniciarPagina: () => usePreloadStore.getState().iniciarPagina(),
}

/**
 * Libera o preload da página assim que ela termina de montar.
 * Toda página deve chamar no topo do componente. Requisições feitas pelo FetchHelper
 * mantêm o preload na tela sozinhas até terminarem.
 */
export function useOcultarPreload() {
	useEffect(() => {
		usePreloadStore.getState().liberarPagina()
	}, [])
}
