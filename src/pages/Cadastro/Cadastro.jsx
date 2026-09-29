import { Link } from 'react-router-dom'
import Logo from '@/components/Logo/Logo'

// Hoje no formato AAAA-MM-DD, para impedir data de nascimento no futuro
const HOJE = new Date().toISOString().slice(0, 10)

// Primeira etapa do cadastro: dados pessoais, sem senha.
// Os "name" dos campos seguem o model User da API Laravel.
function Cadastro() {
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
						<input type="text" name="name" autoComplete="name" placeholder="Seu nome completo" required />
						<small className="field__erro">Informe seu nome completo</small>
					</label>

					<label className="field">
						<span className="field__label">CPF</span>
						<input
							type="text"
							name="cpf"
							inputMode="numeric"
							placeholder="000.000.000-00"
							maxLength={14}
							pattern="\d{3}\.?\d{3}\.?\d{3}-?\d{2}"
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
