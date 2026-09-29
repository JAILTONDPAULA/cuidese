import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
// Estilos globais antes das rotas, para as telas poderem sobrescrevê-los
import '@/styles/global.scss'
import router from '@/routes'
import Toaster from '@/components/Toast/Toaster'
import { toast } from '@/components/Toast/toast'

// Em desenvolvimento, expõe toast() no console do navegador para testes
if (import.meta.env.DEV) window.toast = toast

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<RouterProvider router={router} />
		<Toaster />
	</StrictMode>,
)
