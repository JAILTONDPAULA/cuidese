import { NavLink } from 'react-router-dom'
import './Header.scss'

function Header() {
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
					<NavLink to="/login">Entrar</NavLink>
				</nav>
			</div>
		</header>
	)
}

export default Header
