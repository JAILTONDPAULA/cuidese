import './Background.scss'

// Pílulas na diagonal, saindo do canto inferior direito em direção ao superior esquerdo.
// x/y = distância da direita/de baixo; w/h = largura/altura; d = atraso da animação (s)
const PILULAS = [
	{ x: -80, y: 120, w: 520, h: 110, cor: 'var(--primary-500)', d: 0 },
	{ x: -40, y: -20, w: 380, h: 80, cor: 'var(--tertiary-500)', d: 0.15 },
	{ x: 160, y: -60, w: 300, h: 60, cor: 'var(--secondary-500)', d: 0.3 },
	{ x: -140, y: 300, w: 460, h: 70, cor: 'var(--primary-300)', d: 0.45 },
	{ x: 400, y: 40, w: 260, h: 50, cor: 'var(--tertiary-300)', d: 0.6 },
	{ x: 60, y: 420, w: 200, h: 40, cor: 'var(--secondary-300)', d: 0.75 },
]

// Círculos no sentido contrário das pílulas: agrupados no canto superior esquerdo,
// maiores no canto e diminuindo em direção ao centro.
// x/y = distância da esquerda/do topo; t = diâmetro; d = atraso da animação (s)
const CIRCULOS = [
	{ x: -40, y: -40, t: 160, cor: 'var(--primary-200)', d: 0 },
	{ x: 140, y: 30, t: 70, cor: 'var(--secondary-400)', d: 0.15 },
	{ x: 40, y: 150, t: 90, cor: 'var(--tertiary-300)', d: 0.3 },
	{ x: 240, y: -20, t: 44, cor: 'var(--tertiary-200)', d: 0.45 },
	{ x: 200, y: 130, t: 28, cor: 'var(--primary-400)', d: 0.6 },
	{ x: 20, y: 280, t: 36, cor: 'var(--secondary-300)', d: 0.75 },
	{ x: 330, y: 70, t: 20, cor: 'var(--primary-300)', d: 0.9 },
]

// Fundo decorativo: fica atrás de todo o conteúdo (z-index -1) e não recebe clique nem seleção.
function Background() {
	return (
		<section className="background" aria-hidden="true">
			{PILULAS.map((p, i) => (
				<div
					key={`p${i}`}
					className="background__pilula"
					style={{
						right: p.x,
						bottom: p.y,
						width: p.w,
						height: p.h,
						background: p.cor,
						animationDelay: `${p.d}s, ${p.d + 1.2}s`,
					}}
				/>
			))}

			{CIRCULOS.map((c, i) => (
				<div
					key={`c${i}`}
					className="background__circulo"
					style={{
						left: c.x,
						top: c.y,
						width: c.t,
						height: c.t,
						background: c.cor,
						animationDelay: `${c.d}s, ${c.d + 1}s`,
					}}
				/>
			))}
		</section>
	)
}

export default Background
