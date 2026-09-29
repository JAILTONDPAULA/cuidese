import { create } from 'zustand'

export const TIPOS = ['primary', 'alerta', 'erro', 'sucesso']

let proximoId = 0

// Estado global dos dialogs. Vários podem estar abertos, empilhados na ordem de abertura;
// o <Dialog /> (em main.jsx) lê daqui e renderiza.
export const useDialogStore = create((set) => ({
	dialogs: [], // [{ id, titulo, conteudo, tipo, saindo }]

	// Se já existir um dialog com o mesmo id, substitui o conteúdo dele
	abrir: (dialog) =>
		set((s) => ({
			dialogs: s.dialogs.some((d) => d.id === dialog.id)
				? s.dialogs.map((d) => (d.id === dialog.id ? dialog : d))
				: [...s.dialogs, dialog],
		})),

	// Marca como "saindo" para tocar a animação; o <Dialog /> remove quando ela termina
	fechar: (id) => set((s) => ({ dialogs: s.dialogs.map((d) => (d.id === id ? { ...d, saindo: true } : d)) })),

	fecharTodos: () => set((s) => ({ dialogs: s.dialogs.map((d) => ({ ...d, saindo: true })) })),

	remover: (id) => set((s) => ({ dialogs: s.dialogs.filter((d) => d.id !== id) })),
}))

/**
 * Abre um dialog. Pode ser chamada de qualquer lugar (componente, função, store).
 *
 * @param {object} opcoes
 * @param {string} [opcoes.id] Identificador para fechar depois com dialog.fechar(id).
 *   Se já houver um aberto com esse id, o conteúdo dele é substituído. Se omitido, é gerado.
 * @param {string} opcoes.titulo
 * @param {string|import('react').ReactNode} opcoes.conteudo Texto ou JSX (inclusive componentes)
 * @param {'primary'|'alerta'|'erro'|'sucesso'} [opcoes.tipo='primary']
 * @returns {string} o id do dialog
 */
export function dialog({ id, titulo, conteudo, tipo = 'primary' }) {
	const idFinal = id ?? `dialog-${++proximoId}`

	useDialogStore.getState().abrir({
		id: idFinal,
		titulo,
		conteudo,
		tipo: TIPOS.includes(tipo) ? tipo : 'primary',
		saindo: false,
	})

	return idFinal
}

dialog.fechar = (id) => useDialogStore.getState().fechar(id)

dialog.fecharTodos = () => useDialogStore.getState().fecharTodos()
