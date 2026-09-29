import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useToastStore } from './toast'
import './Toast.scss'

function ToastItem({ id, conteudo, tipo, html, saindo }) {
	const fechar = useToastStore((s) => s.fechar)
	const remover = useToastStore((s) => s.remover)

	// Remove do estado só depois que a animação de saída terminar
	function handleAnimationEnd(event) {
		if (saindo && event.target === event.currentTarget) remover(id)
	}

	return (
		<div
			className={`toast toast--${tipo}${saindo ? ' toast--saindo' : ''}`}
			role={tipo === 'erro' ? 'alert' : 'status'}
			onAnimationEnd={handleAnimationEnd}
		>
			{html ? (
				<div className="toast__conteudo" dangerouslySetInnerHTML={{ __html: conteudo }} />
			) : (
				<div className="toast__conteudo">{conteudo}</div>
			)}

			<button type="button" className="toast__fechar" aria-label="Fechar" onClick={() => fechar(id)}>
				<FontAwesomeIcon icon={faXmark} />
			</button>
		</div>
	)
}

// Container global dos toasts. Renderizado uma única vez em main.jsx.
function Toaster() {
	const toasts = useToastStore((s) => s.toasts)

	return (
		<div className="toaster" aria-live="polite">
			{toasts.map((t) => (
				<ToastItem key={t.id} {...t} />
			))}
		</div>
	)
}

export default Toaster
