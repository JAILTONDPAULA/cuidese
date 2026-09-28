import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
// Estilos globais antes das rotas, para as telas poderem sobrescrevê-los
import '@/styles/global.scss'
import router from '@/routes'

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
)
