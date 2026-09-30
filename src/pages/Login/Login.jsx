import { Link } from 'react-router-dom'
import GoogleIcon from '@/components/icons/GoogleIcon'
import Logo from '@/components/Logo/Logo'
import { useOcultarPreload } from '@/components/Preload/preloadStore'
import './Login.scss'

function Login() {
	useOcultarPreload()

	// Provedor de autenticação ainda não definido (ver CLAUDE.md > Pontos em aberto)
	function handleSubmit(event) {
		event.preventDefault()
	}

	function handleGoogleLogin() {}

	return (
		<div className="auth">
			<form className="auth__card" onSubmit={handleSubmit}>
				<header className="auth__header">
					<h1 className="auth__title">
						<Logo tamanho={44} />
					</h1>
					<p className="auth__subtitle">Sua saúde, do sintoma ao cuidado certo</p>
				</header>

				<section className="auth__campos">
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

					<button type="submit" className="btn btn--primario">
						Entrar
					</button>
				</section>

				<section className="login__google">
					<p className="login__divisor">ou acesse com sua conta Google</p>

					<button type="button" className="btn btn--contorno" onClick={handleGoogleLogin}>
						<GoogleIcon />
						Entrar com Google
					</button>
				</section>

				<section className="auth__links">
					<Link to="/recuperar-senha">Esqueci minha senha</Link>
					<span className="auth__links-separador" aria-hidden="true">•</span>
					<Link to="/cadastro">Cadastre-se</Link>
				</section>

				<footer className="auth__footer">© {new Date().getFullYear()} Cuidese</footer>
			</form>
		</div>
	)
}

export default Login
