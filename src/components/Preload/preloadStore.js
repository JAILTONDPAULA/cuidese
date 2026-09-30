import { useEffect } from 'react'
import { create } from 'zustand'

export const TEXTO_PADRAO = 'Carregando'

// Estado global do preload. Começa visível: cada página decide quando ocultar.
// estado: 'visivel' → 'saindo' (animação de saída) → 'oculto'
export const usePreloadStore = create((set) => ({
	estado: 'visivel',
	texto: TEXTO_PADRAO,

	mostrar: (texto = TEXTO_PADRAO) => set({ estado: 'visivel', texto }),

	alterarTexto: (texto) => set({ texto }),

	ocultar: () => set((s) => (s.estado === 'visivel' ? { estado: 'saindo' } : s)),

	// Chamado pelo componente quando a animação de saída termina
	finalizar: () => set((s) => (s.estado === 'saindo' ? { estado: 'oculto' } : s)),
}))

export const preload = {
	/** Mostra o preload. @param {string} [texto='Carregando'] */
	mostrar: (texto) => usePreloadStore.getState().mostrar(texto),

	/** Troca o texto com o preload já aberto (ex.: 'Gerando resumo...'). @param {string} texto */
	texto: (texto) => usePreloadStore.getState().alterarTexto(texto),

	/** Oculta o preload (com animação de saída). */
	ocultar: () => usePreloadStore.getState().ocultar(),
}

/**
 * Oculta o preload assim que a página termina de montar.
 * Para páginas que não dependem de requisição: basta chamar no topo do componente.
 */
export function useOcultarPreload() {
	useEffect(() => {
		preload.ocultar()
	}, [])
}
