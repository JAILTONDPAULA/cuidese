import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import AutenticacaoApi from '@/api/AutenticacaoApi'
import GoogleLogin from '@/components/GoogleLogin/GoogleLogin'
import { GOOGLE_LOGIN_DISPONIVEL } from '@/components/GoogleLogin/googleConfig'
import Logo from '@/components/Logo/Logo'
import { useOcultarPreload } from '@/components/Preload/preloadStore'
import SenhaInput from '@/components/SenhaInput/SenhaInput'
import { sessao, useSessaoStore } from '@/stores/sessaoStore'
import './Login.scss'

function Login() {
	useOcultarPreload()
	const navigate = useNavigate()
	const location = useLocation()
	const logado = useSessaoStore((s) => s.carregada && Boolean(s.token))

	// Volta para a tela que pediu login (guardada pela RotaProtegida), ou para o início
	const destino = location.state?.destino ?? '/'

	// Só é chamado com os campos válidos (o navegador bloqueia o envio antes).
	// Erros (e-mail ou senha inválidos, e-mail não confirmado...) já vêm em toast pelo FetchHelper.
	function handleSubmit(event) {
		event.preventDefault()
		const { email, password } = Object.fromEntries(new FormData(event.currentTarget))

		AutenticacaoApi.login(email, password).then(entrar).catch(() => {})
	}

	// O botão do Google devolve o ID token; a API valida e devolve a sessão, como no login por e-mail
	function handleGoogleCredencial(idToken) {
		AutenticacaoApi.loginGoogle(idToken).then(entrar).catch(() => {})
	}

	function entrar({ token, usuario }) {
		sessao.entrar(token, usuario)
		navigate(destino, { replace: true })
	}

	// Já logado: não faz sentido ver o login
	if (logado) return <Navigate to={destino} replace />

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
						<input
							type="email"
							name="email"
							autoComplete="email"
							placeholder="seu@email.com"
							pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
							required
						/>
						<small className="field__erro">Informe um e-mail válido</small>
					</label>

					<label className="field">
						<span className="field__label">Senha</span>
						<SenhaInput name="password" autoComplete="current-password" placeholder="Sua senha" required />
						<small className="field__erro">Informe sua senha</small>
					</label>

					<button type="submit" className="btn btn--primario">
						Entrar
					</button>
				</section>

				{/* Só aparece com o VITE_GOOGLE_CLIENT_ID configurado e na web (ver GoogleLogin/README.md) */}
				{GOOGLE_LOGIN_DISPONIVEL && (
					<section className="login__google">
						<p className="login__divisor">ou acesse com sua conta Google</p>
						<GoogleLogin onCredencial={handleGoogleCredencial} />
					</section>
				)}

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
