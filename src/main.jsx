import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
// Estilos globais antes das rotas, para as telas poderem sobrescrevê-los
import '@/styles/global.scss'
import router from '@/routes'
import Toaster from '@/components/Toast/Toaster'
import { toast } from '@/components/Toast/toast'
import Dialog from '@/components/Dialog/Dialog'
import { dialog } from '@/components/Dialog/dialogStore'
import { preload } from '@/components/Preload/preloadStore'
import FetchHelper from '@/helpers/FetchHelper/FetchHelper'
import { sessao } from '@/stores/sessaoStore'

// Em desenvolvimento, expõe toast(), dialog(), preload, FetchHelper e sessao no console do navegador para testes
if (import.meta.env.DEV) {
	window.toast = toast
	window.dialog = dialog
	window.preload = preload
	window.FetchHelper = FetchHelper
	window.sessao = sessao
}

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<RouterProvider router={router} />
		<Dialog />
		<Toaster />
	</StrictMode>,
)
