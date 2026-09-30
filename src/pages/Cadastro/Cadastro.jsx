import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '@/components/Logo/Logo'
import { toast } from '@/components/Toast/toast'
import CPFHelper from '@/helpers/CPFHelper/CPFHelper'

// Hoje no formato AAAA-MM-DD, para impedir data de nascimento no futuro
const HOJE = new Date().toISOString().slice(0, 10)

// Primeira etapa do cadastro: dados pessoais, sem senha.
// Os "name" dos campos seguem o model User da API Laravel.
function Cadastro() {
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

	// Envio e validação do e-mail ainda não definidos
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
					<p className="auth__subtitle">Crie sua conta para começar a cuidar da sua saúde</p>
				</header>

				<section className="auth__campos">
					<label className="field">
						<span className="field__label">Nome completo</span>
						<input
							type="text"
							name="name"
							autoComplete="name"
							placeholder="Seu nome completo"
							required
							onChange={(e) => e.target.value = e.target.value.toUpperCase()}
						/>
						<small className="field__erro">Informe seu nome completo</small>
					</label>

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
								<option value="feminino">Feminino</option>
								<option value="masculino">Masculino</option>
								<option value="outro">Outro</option>
								<option value="nao_informado">Prefiro não informar</option>
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
