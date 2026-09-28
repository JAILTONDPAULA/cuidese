import { Link } from 'react-router-dom'
import GoogleIcon from '@/components/icons/GoogleIcon'
import './Login.scss'

function Login() {
	// Provedor de autenticação ainda não definido (ver CLAUDE.md > Pontos em aberto)
	function handleSubmit(event) {
		event.preventDefault()
	}

	function handleGoogleLogin() {}

	return (
		<div className="login">
			<form className="login__form" onSubmit={handleSubmit}>
				<header className="login__header">
					<h1 className="login__title">Cuidese</h1>
					<p className="login__subtitle">Entre para relatar seus sintomas</p>
				</header>

				<section className="login__credenciais">
					<label className="field">
						<span className="field__label">E-mail</span>
						<input type="email" name="email" autoComplete="email" placeholder="seu@email.com" required />
						<small className="field__erro">Informe um e-mail válido</small>
					</label>

					<label className="field">
						<span className="field__label">Senha</span>
						<input type="password" name="senha" autoComplete="current-password" placeholder="Sua senha" required />
						<small className="field__erro">Informe sua senha</small>
					</label>

					<button type="submit" className="login__btn-entrar">
						Entrar
					</button>
				</section>

				<section className="login__google">
					<p className="login__divisor">ou acesse com sua conta Google</p>

					<button type="button" className="login__btn-google" onClick={handleGoogleLogin}>
						<GoogleIcon />
						Entrar com Google
					</button>
				</section>

				<section className="login__reset">
					<Link to="/recuperar-senha">Esqueci minha senha</Link>
				</section>

				<footer className="login__footer">© {new Date().getFullYear()} Cuidese</footer>
			</form>
		</div>
	)
}

export default Login
