import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import Relato from '@/pages/Relato/Relato'
import Historico from '@/pages/Historico/Historico'
import Login from '@/pages/Login/Login'
import NotFound from '@/pages/NotFound/NotFound'

// Cada rota filha de MainLayout é renderizada dentro do template principal.
// Para uma nova tela: crie o componente em src/pages e adicione-o em "children".
const router = createBrowserRouter([
	{
		path: '/',
		element: <MainLayout />,
		children: [
			{ index: true, element: <Relato /> },
			{ path: 'historico', element: <Historico /> },
			{ path: 'login', element: <Login /> },
			{ path: '*', element: <NotFound /> },
		],
	},
])

export default router
