import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import CodigoInput from '@/components/CodigoInput/CodigoInput'
import Logo from '@/components/Logo/Logo'
import SenhaInput from '@/components/SenhaInput/SenhaInput'
import { useOcultarPreload } from '@/components/Preload/preloadStore'
import './ConfirmarSenha.scss'

const TAMANHO_CODIGO = 6

// Rota: /confirmar?c=<md5 do e-mail>&token=<6 dígitos, opcional>
// "c" identifica o cadastro (vem do cadastro ou do link do e-mail). Se estiver ausente ou errado,
// o problema é tratado pela resposta da API ao validar o token, não aqui na tela.
// Duas seções: confirmação do código e criação da senha.
// Quando cada seção aparece e o envio serão implementados depois.
function ConfirmarSenha() {
	useOcultarPreload()

	const [parametros] = useSearchParams()
	const identificador = parametros.get('c') ?? ''

	// Se o link já trouxe o token, as caixas começam preenchidas
	const tokenUrl = (parametros.get('token') ?? '').replace(/\D/g, '').slice(0, TAMANHO_CODIGO)
	const [codigo, setCodigo] = useState(tokenUrl)

	// Lógica de envio será implementada depois
	function handleSubmit(event) {
		event.preventDefault()
	}

	return (
		<div className="auth">
			<form className="auth__card" onSubmit={handleSubmit}>
				<header className="auth__header">
					<h1 className="auth__title">
						<Logo tamanho={44} />
					</h1>
					<p className="auth__subtitle">Confirme seu e-mail e crie sua senha</p>
				</header>

				<input type="hidden" name="c" value={identificador} />

				{/* Seção 1: código de confirmação */}
				<section className="auth__campos confirmar-senha__secao">
					<div>
						<h2 className="confirmar-senha__titulo">Código de confirmação</h2>
						<p className="confirmar-senha__texto">Digite o código de {TAMANHO_CODIGO} dígitos enviado para o seu e-mail.</p>
					</div>

					<div className="field">
						<CodigoInput tamanho={TAMANHO_CODIGO} valor={codigo} onChange={setCodigo} name="token" />
						<small className="field__erro">Código inválido</small>
					</div>

					<button type="button" className="btn btn--contorno">
						Confirmar código
					</button>
				</section>

				{/* Seção 2: nova senha */}
				<section className="auth__campos confirmar-senha__secao">
					<div>
						<h2 className="confirmar-senha__titulo">Crie sua senha</h2>
						<p className="confirmar-senha__texto">Use a mesma senha nos dois campos.</p>
					</div>

					<label className="field">
						<span className="field__label">Senha</span>
						<SenhaInput name="senha" autoComplete="new-password" placeholder="Crie uma senha" required />
						<small className="field__erro">Informe uma senha</small>
					</label>

					<label className="field">
						<span className="field__label">Confirme a senha</span>
						<SenhaInput name="senha_confirmacao" autoComplete="new-password" placeholder="Repita a senha" required />
						<small className="field__erro">As senhas não conferem</small>
					</label>

					<button type="submit" className="btn btn--primario">
						Salvar senha
					</button>
				</section>

				<section className="auth__links">
					<Link to="/login">Voltar para o login</Link>
				</section>

				<footer className="auth__footer">© {new Date().getFullYear()} Cuidese</footer>
			</form>
		</div>
	)
}

export default ConfirmarSenha
