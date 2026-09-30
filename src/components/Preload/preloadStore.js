import { useEffect } from 'react'
import { create } from 'zustand'

export const TEXTO_PADRAO = 'Carregando'

// Estado global do preload. Começa visível: cada página decide quando ocultar.
// estado: 'visivel' → 'saindo' (animação de saída) → 'oculto'
// contador: quantos "pedidos" de preload estão ativos (página carregando + requisições em andamento).
// Cada mostrar() soma 1 e cada ocultar() subtrai 1; o preload só some quando chega a zero,
// assim uma requisição que termina primeiro não fecha o preload de outra ainda em andamento.
export const usePreloadStore = create((set) => ({
	estado: 'visivel',
	texto: TEXTO_PADRAO,
	contador: 1,

	// Sem texto: mantém o atual se já estiver visível, senão volta ao padrão
	mostrar: (texto) =>
		set((s) => ({
			contador: s.contador + 1,
			estado: 'visivel',
			texto: texto ?? (s.estado === 'visivel' ? s.texto : TEXTO_PADRAO),
		})),

	alterarTexto: (texto) => set({ texto }),

	ocultar: () =>
		set((s) => {
			const contador = Math.max(0, s.contador - 1)
			return contador === 0 && s.estado === 'visivel' ? { contador, estado: 'saindo' } : { contador }
		}),

	// Início de cada página (chamado pelo MainLayout): zera sobras da página anterior
	iniciarPagina: () => set({ contador: 1, estado: 'visivel', texto: TEXTO_PADRAO }),

	// Chamado pelo componente quando a animação de saída termina
	finalizar: () => set((s) => (s.estado === 'saindo' ? { estado: 'oculto' } : s)),
}))

export const preload = {
	/** Mostra o preload (soma 1 no contador). @param {string} [texto] */
	mostrar: (texto) => usePreloadStore.getState().mostrar(texto),

	/** Troca o texto com o preload já aberto (ex.: 'Gerando resumo...'). @param {string} texto */
	texto: (texto) => usePreloadStore.getState().alterarTexto(texto),

	/** Subtrai 1 do contador; oculta (com animação) quando chegar a zero. */
	ocultar: () => usePreloadStore.getState().ocultar(),

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
		preload.ocultar()
	}, [])
}
