import { NavLink } from 'react-router-dom'
import AutenticacaoApi from '@/api/AutenticacaoApi'
import { sessao, useSessaoStore } from '@/stores/sessaoStore'
import './Header.scss'

function Header() {
	const logado = useSessaoStore((s) => Boolean(s.token))

	// Revoga o token na API e apaga a sessão do aparelho, mesmo se a API falhar
	// (ex.: token já expirado). A RotaProtegida leva ao login sozinha.
	function handleSair() {
		AutenticacaoApi.logout()
			.catch(() => {})
			.finally(() => sessao.sair())
	}

	return (
		<header className="header">
			<div className="header__inner">
				<NavLink to="/" className="header__logo">
					Cuidese
				</NavLink>

				<nav className="header__nav">
					<NavLink to="/" end>
						Relato
					</NavLink>
					<NavLink to="/historico">Histórico</NavLink>
					{logado ? (
						<button type="button" className="header__sair" onClick={handleSair}>
							Sair
						</button>
					) : (
						<NavLink to="/login">Entrar</NavLink>
					)}
				</nav>
			</div>
		</header>
	)
}

export default Header
