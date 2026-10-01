import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faCircle, faXmark } from '@fortawesome/free-solid-svg-icons'
import UsuarioApi from '@/api/UsuarioApi'
import CodigoInput from '@/components/CodigoInput/CodigoInput'
import Logo from '@/components/Logo/Logo'
import SenhaInput from '@/components/SenhaInput/SenhaInput'
import { useOcultarPreload } from '@/components/Preload/preloadStore'
import { toast } from '@/components/Toast/toast'
import HashHelper from '@/helpers/HashHelper/HashHelper'
import SenhaHelper from '@/helpers/SenhaHelper/SenhaHelper'
import './ConfirmarSenha.scss'

const TAMANHO_CODIGO = 6

// Rota: /confirmar?c=<identificador do cadastro>&token=<hash do link do e-mail, opcional>
// - c: vai como tokenA na validação. Se estiver ausente ou errado, a API responde com erro (toast).
// - token: é o hash enviado no link do e-mail (não o código de 6 dígitos); vai direto como tokenB.
// Etapas: 1) confirmar o código (pré-validação do token); 2) criar a senha, que só aparece depois
// que o token for validado; o envio grava a senha (POST /usuarios/redefinir-senha) e leva ao login.
function ConfirmarSenha() {
	useOcultarPreload()
	const navigate = useNavigate()

	const [parametros] = useSearchParams()
	const identificador = parametros.get('c') ?? ''
	const tokenUrl = parametros.get('token') ?? ''

	const [codigo, setCodigo] = useState('')
	const [etapa, setEtapa] = useState('token') // 'token' | 'senha'
	const [tokenValidado, setTokenValidado] = useState('') // tokenB aceito pela API, para o envio da senha

	// Chama a pré-validação. Em caso de erro não faz nada aqui: o FetchHelper já mostra o toast
	// com a mensagem da API (ex.: "Token inválido.") e a pessoa pode corrigir o código.
	function validarToken(tokenB, opcoes) {
		return UsuarioApi.validarToken(identificador, tokenB, opcoes)
			.then((resposta) => {
				// A API devolve o código de 6 dígitos: preenche as caixas e avança para a senha
				setCodigo(String(resposta?.token ?? '').slice(0, TAMANHO_CODIGO))
				setTokenValidado(tokenB)
				setEtapa('senha')
			})
			.catch(() => {})
	}

	// Link do e-mail com token: valida sozinho ao abrir a tela.
	// O abort cancela a requisição se a pessoa sair antes (e evita a chamada duplicada do StrictMode).
	useEffect(() => {
		if (!tokenUrl) return
		const controller = new AbortController()
		validarToken(tokenUrl, { signal: controller.signal })
		return () => controller.abort()
		// eslint-disable-next-line react-hooks/exhaustive-deps -- roda só ao abrir a tela / trocar o token da URL
	}, [tokenUrl])

	// Ao digitar o último dígito, valida o código (tokenB = md5 do código)
	function handleCodigoChange(valor) {
		setCodigo(valor)
		if (valor.length === TAMANHO_CODIGO) validarToken(HashHelper.md5(valor))
	}

	// Nova senha: checklist dos requisitos enquanto digita, e confirmação igual
	const [senha, setSenha] = useState('')
	const [confirmacao, setConfirmacao] = useState('')
	const [senhaTocada, setSenhaTocada] = useState(false) // saiu do campo senha ao menos uma vez
	const [confirmacaoTocada, setConfirmacaoTocada] = useState(false)
	const senhaRef = useRef(null)
	const confirmacaoRef = useRef(null)

	const regras = SenhaHelper.verificar(senha)
	const senhaValida = regras.every((regra) => regra.ok)
	const senhasConferem = SenhaHelper.conferem(senha, confirmacao)
	const erroSenha = senhaTocada && !senhaValida
	const erroConfirmacao = confirmacaoTocada && Boolean(confirmacao) && !senhasConferem

	// Marca os campos como inválidos para o navegador, bloqueando o envio do form até estar tudo certo
	useEffect(() => {
		senhaRef.current?.setCustomValidity(SenhaHelper.motivoInvalido(senha) ?? '')
		confirmacaoRef.current?.setCustomValidity(senhasConferem ? '' : 'As senhas não conferem.')
	}, [senha, senhasConferem, etapa])

	// Só é chamado com a senha válida e a confirmação igual: o setCustomValidity dos campos
	// faz o navegador bloquear o envio antes. Em caso de erro, o FetchHelper já mostra o toast.
	function handleSubmit(event) {
		event.preventDefault()

		UsuarioApi.redefinirSenha(identificador, tokenValidado, senha)
			.then((resposta) => {
				toast(resposta?.mensagem ?? 'Senha definida com sucesso.', { tipo: 'sucesso', temporario: true })
				navigate('/login')
			})
			.catch(() => {})
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

				{/* Etapa 1: código de confirmação */}
				{etapa === 'token' && (
					<section className="auth__campos confirmar-senha__secao">
						<div>
							<h2 className="confirmar-senha__titulo">Código de confirmação</h2>
							<p className="confirmar-senha__texto">Digite o código de {TAMANHO_CODIGO} dígitos enviado para o seu e-mail.</p>
						</div>

						<div className="field">
							<CodigoInput tamanho={TAMANHO_CODIGO} valor={codigo} onChange={handleCodigoChange} autoFocus={!tokenUrl} />
							<small className="field__erro">Código inválido</small>
						</div>
					</section>
				)}

				{/* Etapa 2: nova senha (só depois do token validado) */}
				{etapa === 'senha' && (
					<section className="auth__campos confirmar-senha__secao">
						<input type="hidden" name="token" value={tokenValidado} />

						<div>
							<h2 className="confirmar-senha__titulo">Crie sua senha</h2>
							<p className="confirmar-senha__texto">Use a mesma senha nos dois campos.</p>
						</div>

						<label className={`field${erroSenha ? ' field--erro' : ''}`}>
							<span className="field__label">Senha</span>
							<SenhaInput
								ref={senhaRef}
								name="senha"
								autoComplete="new-password"
								placeholder="Crie uma senha"
								value={senha}
								onChange={(e) => setSenha(e.target.value)}
								onBlur={() => setSenhaTocada(true)}
								required
								autoFocus
							/>
						</label>

						{/* Requisitos: cinza = pendente, verde = atendido, vermelho = pendente depois de sair do campo */}
						<ul className="confirmar-senha__regras" aria-label="Requisitos da senha">
							{regras.map((regra) => {
								const situacao = regra.ok ? 'ok' : senhaTocada ? 'erro' : 'pendente'
								return (
									<li key={regra.id} className={`confirmar-senha__regra confirmar-senha__regra--${situacao}`}>
										<FontAwesomeIcon icon={{ ok: faCheck, erro: faXmark, pendente: faCircle }[situacao]} fixedWidth />
										{regra.texto}
									</li>
								)
							})}
						</ul>

						<label className={`field${erroConfirmacao ? ' field--erro' : ''}`}>
							<span className="field__label">Confirme a senha</span>
							<SenhaInput
								ref={confirmacaoRef}
								name="senha_confirmacao"
								autoComplete="new-password"
								placeholder="Repita a senha"
								value={confirmacao}
								onChange={(e) => setConfirmacao(e.target.value)}
								onBlur={() => setConfirmacaoTocada(true)}
								required
							/>
							<small className="field__erro">As senhas não conferem</small>
						</label>

						<button type="submit" className="btn btn--primario">
							Salvar senha
						</button>
					</section>
				)}

				<section className="auth__links">
					<Link to="/login">Voltar para o login</Link>
					<span className="auth__links-separador" aria-hidden="true">•</span>
					<Link to="/recuperar-senha">Solicitar redefinição de senha</Link>
				</section>

				<footer className="auth__footer">© {new Date().getFullYear()} Cuidese</footer>
			</form>
		</div>
	)
}

export default ConfirmarSenha
