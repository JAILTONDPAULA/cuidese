import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import UsuarioApi from '@/api/UsuarioApi'
import { dialog } from '@/components/Dialog/dialogStore'
import Logo from '@/components/Logo/Logo'
import { useOcultarPreload } from '@/components/Preload/preloadStore'
import { toast } from '@/components/Toast/toast'
import CPFHelper from '@/helpers/CPFHelper/CPFHelper'
import './RecuperarSenha.scss'

const OPCOES = [
	{ valor: 'email', rotulo: 'E-mail' },
	{ valor: 'cpf', rotulo: 'CPF' },
]

// Solicitar redefinição de senha: a pessoa identifica a conta pelo e-mail ou pelo CPF.
// Um seletor escolhe qual campo aparece (um campo único que adivinhasse o tipo aplicaria a máscara
// de CPF em e-mails que começam com números). O envio pede o e-mail com o link de redefinição;
// a API não devolve token (não revela se a conta existe), então o caminho segue pelo link do e-mail.
function RecuperarSenha() {
	useOcultarPreload()
	const navigate = useNavigate()

	const [identificarPor, setIdentificarPor] = useState('email') // 'email' | 'cpf'
	const campoRef = useRef(null)

	// CPF controlado, igual ao cadastro: máscara enquanto digita e validação ao completar 11 dígitos
	const [cpf, setCpf] = useState('')
	const [cpfInvalido, setCpfInvalido] = useState(false)

	function handleCpfChange(event) {
		const mascarado = CPFHelper.mascarar(event.target.value)
		const completo = mascarado.replace(/\D/g, '').length === 11
		const invalido = completo && !CPFHelper.validar(mascarado)

		if (invalido && mascarado !== cpf) {
			toast('O CPF informado não é válido. Confira os números.', { tipo: 'erro', temporario: true })
		}

		event.target.setCustomValidity(invalido ? 'CPF inválido' : '')
		setCpf(mascarado)
		setCpfInvalido(invalido)
	}

	// Ao trocar a opção, limpa o campo anterior e leva o foco para o novo
	function handleOpcaoChange(valor) {
		setIdentificarPor(valor)
		setCpf('')
		setCpfInvalido(false)
		requestAnimationFrame(() => campoRef.current?.focus())
	}

	// Só é chamado com o campo válido: o navegador bloqueia o envio antes (required, type=email,
	// pattern e setCustomValidity do CPF). Envia só o campo da opção escolhida: e-mail OU CPF.
	function handleSubmit(event) {
		event.preventDefault()

		const identificacao =
			identificarPor === 'email' ? { email: new FormData(event.currentTarget).get('email') } : { cpf }

		UsuarioApi.solicitarRedefinicaoSenha(identificacao)
			.then((resposta) => {
				// A API devolve o e-mail de destino mascarado (ex.: "ja***@hotmail.com"),
				// para a pessoa saber em qual caixa de entrada procurar
				dialog({
					id: 'redefinicao-solicitada',
					titulo: 'Verifique seu e-mail',
					conteudo: (
						<div className="recuperar-senha__enviado">
							<p>{resposta?.mensagem ?? 'Enviamos um e-mail com as instruções para redefinir a senha.'}</p>
							{resposta?.email && (
								<p>
									Enviado para: <strong className="recuperar-senha__email">{resposta.email}</strong>
								</p>
							)}
						</div>
					),
					tipo: 'sucesso',
				})
				navigate('/login')
			})
			.catch(() => {}) // o FetchHelper já mostrou o toast com a mensagem da API
	}

	return (
		<div className="auth">
			<form className="auth__card" onSubmit={handleSubmit}>
				<header className="auth__header">
					<h1 className="auth__title">
						<Logo tamanho={44} />
					</h1>
					<p className="auth__subtitle">Informe seu e-mail ou CPF para redefinir sua senha</p>
				</header>

				<section className="auth__campos">
					<div className="recuperar-senha__opcoes" role="radiogroup" aria-label="Identificar a conta por">
						{OPCOES.map((opcao) => (
							<label key={opcao.valor} className="recuperar-senha__opcao">
								<input
									type="radio"
									name="identificar_por"
									value={opcao.valor}
									checked={identificarPor === opcao.valor}
									onChange={() => handleOpcaoChange(opcao.valor)}
								/>
								{opcao.rotulo}
							</label>
						))}
					</div>

					{/* key diferente em cada campo: sem ela, o React reaproveitaria o mesmo <input> ao trocar
					    de opção, e o e-mail apareceria com o CPF digitado (e vice-versa) */}
					{identificarPor === 'email' ? (
						<label key="email" className="field">
							<span className="field__label">E-mail</span>
							<input
								ref={campoRef}
								type="email"
								name="email"
								autoComplete="email"
								placeholder="seu@email.com"
								pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
								required
								autoFocus
							/>
							<small className="field__dica">O e-mail usado no cadastro</small>
							<small className="field__erro">Informe um e-mail válido</small>
						</label>
					) : (
						<label key="cpf" className={`field${cpfInvalido ? ' field--erro' : ''}`}>
							<span className="field__label">CPF</span>
							<input
								ref={campoRef}
								type="text"
								name="cpf"
								inputMode="numeric"
								placeholder="000.000.000-00"
								pattern="\d{3}\.\d{3}\.\d{3}-\d{2}"
								value={cpf}
								onChange={handleCpfChange}
								required
							/>
							<small className="field__dica">O CPF usado no cadastro</small>
							<small className="field__erro">Informe um CPF válido</small>
						</label>
					)}

					<button type="submit" className="btn btn--primario">
						Continuar
					</button>
				</section>

				<section className="auth__links">
					<Link to="/login">Voltar para o login</Link>
					<span className="auth__links-separador" aria-hidden="true">•</span>
					<Link to="/cadastro">Criar conta</Link>
				</section>

				<footer className="auth__footer">© {new Date().getFullYear()} Cuidese</footer>
			</form>
		</div>
	)
}

export default RecuperarSenha
