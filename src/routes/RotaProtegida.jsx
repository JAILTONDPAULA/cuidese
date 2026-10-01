import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSessaoStore } from '@/stores/sessaoStore'

// Envolve as rotas que exigem login. Sem sessão, leva ao /login guardando o destino,
// para voltar a ele depois de entrar. Enquanto a sessão salva ainda está sendo lida do
// armazenamento, não renderiza nada (o preload continua na tela).
function RotaProtegida() {
	const carregada = useSessaoStore((s) => s.carregada)
	const token = useSessaoStore((s) => s.token)
	const location = useLocation()

	if (!carregada) return null

	if (!token) return <Navigate to="/login" replace state={{ destino: location.pathname + location.search }} />

	return <Outlet />
}

export default RotaProtegida
