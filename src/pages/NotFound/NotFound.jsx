import { Link } from 'react-router-dom'
import { useOcultarPreload } from '@/components/Preload/preloadStore'

function NotFound() {
	useOcultarPreload()

	return (
		<section>
			<h1>Página não encontrada</h1>
			<Link to="/">Voltar para o início</Link>
		</section>
	)
}

export default NotFound
