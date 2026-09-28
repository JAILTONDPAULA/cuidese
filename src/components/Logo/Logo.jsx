import { useEffect, useRef } from 'react'
import './Logo.scss'

// Símbolo desenhado numa área de 100x100 e escalado para o tamanho pedido.
// - Arco em "C" (tertiary): o C de Cuidese e um abraço, o cuidado.
// - Coração (primary): a saúde, no centro do cuidado.
// - Ponto na abertura do C (secondary): energia, o "você" sendo cuidado.
function desenharSimbolo(canvas, tamanho) {
	const dpr = window.devicePixelRatio || 1
	canvas.width = tamanho * dpr
	canvas.height = tamanho * dpr

	const ctx = canvas.getContext('2d')
	const cor = (nome) => getComputedStyle(document.documentElement).getPropertyValue(nome).trim()

	ctx.setTransform(1, 0, 0, 1, 0, 0)
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	ctx.scale((tamanho * dpr) / 100, (tamanho * dpr) / 100)

	// Arco em C, aberto para a direita
	ctx.beginPath()
	ctx.arc(50, 50, 40, 0.25 * Math.PI, 1.75 * Math.PI)
	ctx.lineWidth = 11
	ctx.lineCap = 'round'
	ctx.strokeStyle = cor('--tertiary-500')
	ctx.stroke()

	// Coração
	const x = 47
	const y = 31
	const w = 42
	const h = 40
	ctx.beginPath()
	ctx.moveTo(x, y + h * 0.3)
	ctx.bezierCurveTo(x, y, x - w / 2, y, x - w / 2, y + h * 0.3)
	ctx.bezierCurveTo(x - w / 2, y + h * 0.6, x, y + h * 0.8, x, y + h)
	ctx.bezierCurveTo(x, y + h * 0.8, x + w / 2, y + h * 0.6, x + w / 2, y + h * 0.3)
	ctx.bezierCurveTo(x + w / 2, y, x, y, x, y + h * 0.3)
	ctx.fillStyle = cor('--primary-500')
	ctx.fill()

	// Ponto na abertura do C
	ctx.beginPath()
	ctx.arc(88, 50, 8, 0, 2 * Math.PI)
	ctx.fillStyle = cor('--secondary-500')
	ctx.fill()
}

// Uso:
// <Logo />                          símbolo + texto, em linha
// <Logo direcao="coluna" />         símbolo em cima do texto
// <Logo texto={false} />            só o símbolo
// <Logo simbolo={false} />          só o texto
function Logo({ tamanho = 40, direcao = 'linha', simbolo = true, texto = true }) {
	const canvasRef = useRef(null)

	useEffect(() => {
		if (simbolo) desenharSimbolo(canvasRef.current, tamanho)
	}, [simbolo, tamanho])

	return (
		<span
			className={`logo logo--${direcao}`}
			style={{ '--logo-tamanho': `${tamanho}px` }}
			role={texto ? undefined : 'img'}
			aria-label={texto ? undefined : 'Cuidese'}
		>
			{simbolo && (
				<canvas ref={canvasRef} className="logo__simbolo" style={{ width: tamanho, height: tamanho }} aria-hidden="true" />
			)}

			{texto && (
				<span className="logo__texto">
					Cuide<span className="logo__texto-se">se</span>
				</span>
			)}
		</span>
	)
}

export default Logo
