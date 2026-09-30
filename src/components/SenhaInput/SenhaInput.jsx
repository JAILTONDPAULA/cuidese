import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import './SenhaInput.scss'

// Input de senha com botão (olho) que alterna entre password e text.
// Repassa todas as props para o <input> (name, placeholder, required, value, onChange...).
function SenhaInput(props) {
	const [visivel, setVisivel] = useState(false)

	return (
		<div className="senha-input">
			<input {...props} type={visivel ? 'text' : 'password'} />

			<button
				type="button"
				className="senha-input__alternar"
				aria-label={visivel ? 'Ocultar senha' : 'Mostrar senha'}
				aria-pressed={visivel}
				onClick={() => setVisivel((v) => !v)}
			>
				<FontAwesomeIcon icon={visivel ? faEyeSlash : faEye} />
			</button>
		</div>
	)
}

export default SenhaInput
