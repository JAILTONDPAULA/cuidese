import { create } from 'zustand'

export const TIPOS = ['primary', 'alerta', 'erro', 'sucesso']

let proximoId = 0

// Estado global dos toasts. O <Toaster /> (em main.jsx) lê daqui e renderiza.
export const useToastStore = create((set) => ({
	toasts: [],

	adicionar: (toast) => set((s) => ({ toasts: [...s.toasts, toast] })),

	// Marca como "saindo" para tocar a animação; o Toaster remove quando ela termina
	fechar: (id) => set((s) => ({ toasts: s.toasts.map((t) => (t.id === id ? { ...t, saindo: true } : t)) })),

	remover: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

/**
 * Exibe um toast. Pode ser chamada de qualquer lugar (componente, função, store).
 *
 * @param {string|import('react').ReactNode} conteudo Texto ou JSX
 * @param {object} [opcoes]
 * @param {'primary'|'alerta'|'erro'|'sucesso'} [opcoes.tipo='primary']
 * @param {boolean} [opcoes.temporario=false] Some sozinho depois de `duracao`
 * @param {number} [opcoes.duracao=5000] Tempo em ms até sumir (só se temporario)
 * @param {boolean} [opcoes.html=false] Interpreta a string como HTML. Só use com conteúdo confiável.
 * @returns {number} id do toast, para fechar com toast.fechar(id)
 */
export function toast(conteudo, { tipo = 'primary', temporario = false, duracao = 5000, html = false } = {}) {
	const id = ++proximoId
	const { adicionar, fechar } = useToastStore.getState()

	adicionar({
		id,
		conteudo,
		tipo: TIPOS.includes(tipo) ? tipo : 'primary',
		html,
		saindo: false,
	})

	if (temporario) setTimeout(() => fechar(id), duracao)

	return id
}

toast.fechar = (id) => useToastStore.getState().fechar(id)

toast.fecharTodos = () => {
	const { toasts, fechar } = useToastStore.getState()
	toasts.forEach((t) => fechar(t.id))
}
