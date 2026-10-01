import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import RotaProtegida from '@/routes/RotaProtegida'
import Relato from '@/pages/Relato/Relato'
import Historico from '@/pages/Historico/Historico'
import Login from '@/pages/Login/Login'
import Cadastro from '@/pages/Cadastro/Cadastro'
import ConfirmarSenha from '@/pages/ConfirmarSenha/ConfirmarSenha'
import RecuperarSenha from '@/pages/RecuperarSenha/RecuperarSenha'
import NotFound from '@/pages/NotFound/NotFound'

// Cada rota filha de MainLayout é renderizada dentro do template principal.
// Para uma nova tela: crie o componente em src/pages e adicione-o em "children";
// se exigir login, coloque-a dentro do grupo da RotaProtegida.
const router = createBrowserRouter([
	{
		path: '/',
		element: <MainLayout />,
		children: [
			// Telas que exigem login
			{
				element: <RotaProtegida />,
				children: [
					{ index: true, element: <Relato /> },
					{ path: 'historico', element: <Historico /> },
				],
			},

			// Telas públicas
			{ path: 'login', element: <Login /> },
			{ path: 'cadastro', element: <Cadastro /> },
			// /confirmar?c=<identificador do cadastro>&token=<hash do link do e-mail, opcional>
			{ path: 'confirmar', element: <ConfirmarSenha /> },
			{ path: 'recuperar-senha', element: <RecuperarSenha /> },
			{ path: '*', element: <NotFound /> },
		],
	},
])

export default router
