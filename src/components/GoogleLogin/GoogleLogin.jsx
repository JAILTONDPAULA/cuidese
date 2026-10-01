import { useEffect, useRef, useState } from 'react'
import { GOOGLE_CLIENT_ID as CLIENT_ID, GOOGLE_LOGIN_DISPONIVEL } from './googleConfig'
import './GoogleLogin.scss'

const SCRIPT_URL = 'https://accounts.google.com/gsi/client'

// Carrega o script do Google Identity Services uma única vez, mesmo com vários botões na tela
let carregamento = null
function carregarScript() {
	carregamento ??= new Promise((resolve, reject) => {
		const script = document.createElement('script')
		script.src = SCRIPT_URL
		script.async = true
		script.onload = () => resolve(window.google)
		script.onerror = () => {
			carregamento = null // permite tentar de novo
			reject(new Error('Não foi possível carregar o login do Google.'))
		}
		document.head.appendChild(script)
	})
	return carregamento
}

// Botão oficial "Fazer login com o Google" (Google Identity Services).
// Ao concluir, chama onCredencial com o ID token (JWT do Google), que deve ser enviado à API para validação.
// Funciona só na web: dentro do app (Capacitor), o Google bloqueia login em WebView e será usado um plugin nativo.
function GoogleLogin({ onCredencial, texto = 'signin_with' }) {
	const containerRef = useRef(null)
	const callbackRef = useRef(onCredencial)
	const [erro, setErro] = useState('')
	const disponivel = GOOGLE_LOGIN_DISPONIVEL

	// Mantém o callback mais recente sem reinicializar o Google a cada renderização
	useEffect(() => {
		callbackRef.current = onCredencial
	}, [onCredencial])

	useEffect(() => {
		if (!disponivel) return
		let ativo = true

		carregarScript()
			.then((google) => {
				if (!ativo || !containerRef.current) return

				google.accounts.id.initialize({
					client_id: CLIENT_ID,
					callback: (resposta) => callbackRef.current?.(resposta.credential),
					ux_mode: 'popup',
				})

				// O botão oficial não aceita largura em %: usa a do container (máximo 400px)
				google.accounts.id.renderButton(containerRef.current, {
					type: 'standard',
					theme: 'outline',
					size: 'large',
					shape: 'rectangular',
					text: texto,
					locale: 'pt-BR',
					width: Math.min(400, containerRef.current.offsetWidth || 400),
				})
			})
			.catch((e) => ativo && setErro(e.message))

		return () => {
			ativo = false
		}
	}, [disponivel, texto])

	if (!disponivel) {
		if (import.meta.env.DEV && !CLIENT_ID) console.warn('[GoogleLogin] Defina VITE_GOOGLE_CLIENT_ID no .env para ativar o login com Google.')
		return null
	}

	return (
		<div className="google-login">
			<div ref={containerRef} className="google-login__botao" />
			{erro && <small className="google-login__erro">{erro}</small>}
		</div>
	)
}

export default GoogleLogin
