import { Preferences } from '@capacitor/preferences'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

// Armazenamento unificado: o @capacitor/preferences usa o localStorage na web,
// SharedPreferences no Android e UserDefaults no iOS, com a mesma API.
// Para trocar por um armazenamento criptografado no celular, só este objeto muda.
const armazenamento = {
	getItem: async (chave) => (await Preferences.get({ key: chave })).value,
	setItem: (chave, valor) => Preferences.set({ key: chave, value: valor }),
	removeItem: (chave) => Preferences.remove({ key: chave }),
}

// Sessão do usuário logado. token e usuario são salvos e voltam ao reabrir o app.
// carregada indica que o armazenamento já foi lido: antes disso, token é null mesmo com sessão salva.
export const useSessaoStore = create(
	persist(
		(set) => ({
			token: null,
			usuario: null,
			carregada: false,

			entrar: (token, usuario) => set({ token, usuario }),

			sair: () => set({ token: null, usuario: null }),
		}),
		{
			name: 'cuidese-sessao',
			storage: createJSONStorage(() => armazenamento),
			partialize: ({ token, usuario }) => ({ token, usuario }), // carregada não é salvo
			onRehydrateStorage: () => () => useSessaoStore.setState({ carregada: true }),
		},
	),
)

export const sessao = {
	/** @returns {string|null} token atual (para o header Authorization) */
	token: () => useSessaoStore.getState().token,

	/** @returns {object|null} dados do usuário logado */
	usuario: () => useSessaoStore.getState().usuario,

	/** @returns {boolean} */
	logado: () => Boolean(useSessaoStore.getState().token),

	/** Guarda a sessão depois do login. */
	entrar: (token, usuario) => useSessaoStore.getState().entrar(token, usuario),

	/** Apaga a sessão do aparelho (não revoga o token na API; para isso use AutenticacaoApi.logout). */
	sair: () => useSessaoStore.getState().sair(),
}
