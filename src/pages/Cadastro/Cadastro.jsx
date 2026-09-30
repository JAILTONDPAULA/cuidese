import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import UsuarioApi from '@/api/UsuarioApi'
import { dialog } from '@/components/Dialog/dialogStore'
import Logo from '@/components/Logo/Logo'
import { toast } from '@/components/Toast/toast'
import CPFHelper from '@/helpers/CPFHelper/CPFHelper'
import { ApiErro } from '@/helpers/FetchHelper/FetchHelper'
import TelefoneHelper from '@/helpers/TelefoneHelper/TelefoneHelper'
import { useOcultarPreload } from '@/components/Preload/preloadStore'

// Hoje no formato AAAA-MM-DD, para impedir data de nascimento no futuro
const HOJE = new Date().toISOString().slice(0, 10)

// Primeira etapa do cadastro: dados pessoais, sem senha.
// Os "name" dos campos são os que o POST /usuarios da API espera (ver UsuarioApi.cadastrar).
function Cadastro() {
	useOcultarPreload()
	const navigate = useNavigate()

	// CPF controlado: o valor exibido vem sempre do estado, já com máscara
	const [cpf, setCpf] = useState('')
	const [cpfInvalido, setCpfInvalido] = useState(false)

	function handleCpfChange(event) {
		const mascarado = CPFHelper.mascarar(event.target.value)
		const completo = mascarado.replace(/\D/g, '').length === 11
		const invalido = completo && !CPFHelper.validar(mascarado)

		// Com 11 dígitos, um 12º digitado é descartado e o valor não muda: não repete o toast
		if (invalido && mascarado !== cpf) {
			toast('O CPF informado não é válido. Confira os números.', { tipo: 'erro', temporario: true })
		}

		// setCustomValidity faz o navegador tratar o campo como inválido (bloqueia o envio do form)
		event.target.setCustomValidity(invalido ? 'CPF inválido' : '')
		setCpf(mascarado)
		setCpfInvalido(invalido)
	}

	// Telefone controlado, como o CPF. Com 10 dígitos não dá para saber se terminou (fixo) ou se
	// ainda falta um (celular); por isso o erro aparece ao completar 11 dígitos ou ao sair do campo.
	const [telefone, setTelefone] = useState('')
	const [telefoneErro, setTelefoneErro] = useState('')
	const telefoneAvisado = useRef('') // último valor que gerou toast, para não repetir

	function atualizarTelefone(input, valor, mostrarErro) {
		const motivo = valor ? (TelefoneHelper.motivoInvalido(valor) ?? '') : ''

		// Bloqueia o envio do form enquanto for inválido, mesmo sem mostrar o erro ainda
		input.setCustomValidity(motivo)

		// Se o erro já está na tela, acompanha a digitação (some ao corrigir)
		if (mostrarErro || telefoneErro) setTelefoneErro(motivo)

		if (mostrarErro && motivo && valor !== telefoneAvisado.current) {
			toast(motivo, { tipo: 'erro', temporario: true })
			telefoneAvisado.current = valor
		}
	}

	function handleTelefoneChange(event) {
		const mascarado = TelefoneHelper.mascarar(event.target.value)
		setTelefone(mascarado)
		atualizarTelefone(event.target, mascarado, TelefoneHelper.tipo(mascarado) === 'celular')
	}

	function handleTelefoneBlur(event) {
		atualizarTelefone(event.target, telefone, true)
	}

	// Só é chamado com todos os campos válidos: o navegador bloqueia o envio antes
	// (required, pattern e setCustomValidity do CPF e do telefone)
	function handleSubmit(event) {
		event.preventDefault()

		// Lê todos os campos pelo "name" de cada um
		const dados = Object.fromEntries(new FormData(event.currentTarget))

		UsuarioApi.cadastrar(dados, { silenciar: [409] })
			.then((resposta) => {
				// A API devolve { token } identificando o cadastro; vai no "c" da tela de confirmação.
				// Sem token, abre a confirmação sem "c": o problema é tratado na validação do token.
				toast(resposta?.mensagem ?? 'Cadastro realizado com sucesso!', { tipo: 'sucesso', temporario: true })
				navigate(resposta?.token ? `/confirmar?c=${encodeURIComponent(resposta.token)}` : '/confirmar')
			})
			.catch((erro) => {
				// 409: CPF ou e-mail já cadastrado; o corpo traz a mensagem pronta da API.
				// Os demais erros já foram avisados por toast pelo FetchHelper.
				if (erro instanceof ApiErro && erro.status === 409) {
					dialog({ id: 'cadastro-existente', titulo: 'Cadastro já existe', conteudo: erro.corpo, tipo: 'alerta' })
				}
			})
	}

	return (
		<div className="auth">
			<form className="auth__card" onSubmit={handleSubmit}>
				<header className="auth__header">
					<h1 className="auth__title">
						<Logo tamanho={44} />
					</h1>
					<p className="auth__subtitle">Crie sua conta para começar a cuidar da sua saúde</p>
				</header>

				<section className="auth__campos">
					<label className="field">
						<span className="field__label">Nome completo</span>
						<input
							type="text"
							name="nome"
							autoComplete="name"
							placeholder="Seu nome completo"
							required
							onChange={(e) => e.target.value = e.target.value.toUpperCase()}
						/>
						<small className="field__erro">Informe seu nome completo</small>
					</label>

					<div className="auth__linha">
						<label className={`field${cpfInvalido ? ' field--erro' : ''}`}>
							<span className="field__label">CPF</span>
							<input
								type="text"
								name="cpf"
								inputMode="numeric"
								placeholder="000.000.000-00"
								pattern="\d{3}\.\d{3}\.\d{3}-\d{2}"
								value={cpf}
								onChange={handleCpfChange}
								required
							/>
							<small className="field__erro">Informe um CPF válido</small>
						</label>

						<label className={`field${telefoneErro ? ' field--erro' : ''}`}>
							<span className="field__label">Telefone</span>
							<input
								type="tel"
								name="telefone"
								autoComplete="tel-national"
								placeholder="(00) 0 0000-0000"
								pattern="\(\d{2}\) (9 )?\d{4}-\d{4}"
								value={telefone}
								onChange={handleTelefoneChange}
								onBlur={handleTelefoneBlur}
								required
							/>
							<small className="field__erro">{telefoneErro || 'Informe um telefone válido'}</small>
						</label>
					</div>

					<label className="field">
						<span className="field__label">E-mail</span>
						<input type="email" name="email" autoComplete="email" placeholder="seu@email.com" required />
						<small className="field__dica">Vamos enviar uma confirmação para este e-mail</small>
						<small className="field__erro">Informe um e-mail válido</small>
					</label>

					<div className="auth__linha">
						<label className="field">
							<span className="field__label">Data de nascimento</span>
							<input type="date" name="data_nascimento" autoComplete="bday" max={HOJE} required />
							<small className="field__erro">Informe sua data de nascimento</small>
						</label>

						<label className="field">
							<span className="field__label">Sexo</span>
							<select name="sexo" defaultValue="" required>
								<option value="" disabled>
									Selecione
								</option>
								<option value="F">Feminino</option>
								<option value="M">Masculino</option>
								<option value="O">Outro</option>
								<option value="N">Prefiro não informar</option>
							</select>
							<small className="field__erro">Selecione uma opção</small>
						</label>
					</div>

					<button type="submit" className="btn btn--primario">
						Continuar
					</button>
				</section>

				<section className="auth__links">
					Já tem uma conta?
					<Link to="/login">Entrar</Link>
				</section>

				<footer className="auth__footer">© {new Date().getFullYear()} Cuidese</footer>
			</form>
		</div>
	)
}

export default Cadastro
