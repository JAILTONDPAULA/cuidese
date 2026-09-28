import { Link } from 'react-router-dom'

function NotFound() {
	return (
		<section>
			<h1>Página não encontrada</h1>
			<Link to="/">Voltar para o início</Link>
		</section>
	)
}

export default NotFound
