import { useEffect, useId, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faExclamation, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useDialogStore } from './dialogStore'
import './Dialog.scss'

// Ícone (branco, dentro de um selo com gradiente) ao lado do título; o tipo "primary" não tem ícone
const ICONES = {
	alerta: faExclamation,
	erro: faXmark,
	sucesso: faCheck,
}

function DialogItem({ id, titulo, conteudo, tipo, saindo }) {
	const fechar = useDialogStore((s) => s.fechar)
	const remover = useDialogStore((s) => s.remover)
	const formRef = useRef(null)
	const tituloId = useId()
	const icone = ICONES[tipo]

	// Ao abrir, o foco vai para o dialog; ao fechar, volta para onde estava
	useEffect(() => {
		const focoAnterior = document.activeElement
		formRef.current?.focus()
		return () => focoAnterior?.focus?.()
	}, [])

	// Remove do estado só depois que a animação de saída terminar
	function handleAnimationEnd(event) {
		if (saindo && event.target === event.currentTarget) remover(id)
	}

	// Envio do form: será implementado depois
	function handleSubmit(event) {
		event.preventDefault()
	}

	return (
		<div className={`dialog${saindo ? ' dialog--saindo' : ''}`} onAnimationEnd={handleAnimationEnd}>
			<form
				ref={formRef}
				className={`dialog__form dialog__form--${tipo}`}
				role="dialog"
				aria-modal="true"
				aria-labelledby={tituloId}
				tabIndex={-1}
				onSubmit={handleSubmit}
			>
				<header className="dialog__header">
					<h2 id={tituloId} className="dialog__titulo">
						{icone && (
							<span className="dialog__icone" aria-hidden="true">
								<FontAwesomeIcon icon={icone} />
							</span>
						)}
						{titulo}
					</h2>

					<button type="button" className="dialog__fechar-icone" aria-label="Fechar" onClick={() => fechar(id)}>
						<FontAwesomeIcon icon={faXmark} />
					</button>
				</header>

				<div className="dialog__body">{conteudo}</div>

				<footer className="dialog__footer">
					<button type="button" className="btn btn--contorno" onClick={() => fechar(id)}>
						Fechar
					</button>
				</footer>
			</form>
		</div>
	)
}

// Pilha global de dialogs. Renderizada uma única vez em main.jsx; aberta pela função dialog().
function Dialog() {
	const dialogs = useDialogStore((s) => s.dialogs)
	const temAberto = dialogs.length > 0

	// Enquanto houver algum aberto: sem rolagem na página, e Esc fecha só o do topo
	useEffect(() => {
		if (!temAberto) return

		document.body.classList.add('dialog-aberto')

		function handleKeyDown(event) {
			if (event.key !== 'Escape') return
			const { dialogs, fechar } = useDialogStore.getState()
			const topo = dialogs.findLast((d) => !d.saindo)
			if (topo) fechar(topo.id)
		}
		document.addEventListener('keydown', handleKeyDown)

		return () => {
			document.body.classList.remove('dialog-aberto')
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [temAberto])

	return dialogs.map((d) => <DialogItem key={d.id} {...d} />)
}

export default Dialog
