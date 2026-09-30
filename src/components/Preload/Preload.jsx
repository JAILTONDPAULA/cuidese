import { useEffect } from 'react'
import Background from '@/components/Background/Background'
import Logo from '@/components/Logo/Logo'
import { usePreloadStore } from './preloadStore'
import './Preload.scss'

// Tempo sem ocultar até avisar no console (só em desenvolvimento)
const AVISO_MS = 10000

// Tela de carregamento global. Renderizada uma única vez no MainLayout; controlada pelo objeto preload.
function Preload() {
	const estado = usePreloadStore((s) => s.estado)
	const texto = usePreloadStore((s) => s.texto)
	const finalizar = usePreloadStore((s) => s.finalizar)
	const ativo = estado !== 'oculto'

	// Sem rolagem na página enquanto o preload estiver na tela
	useEffect(() => {
		if (!ativo) return
		document.body.classList.add('preload-ativo')
		return () => document.body.classList.remove('preload-ativo')
	}, [ativo])

	// Ajuda a achar página que esqueceu de chamar preload.ocultar()
	useEffect(() => {
		if (!import.meta.env.DEV || estado !== 'visivel') return
		const timer = setTimeout(() => {
			console.warn(
				`[Preload] visível há ${AVISO_MS / 1000}s em "${location.pathname}". ` +
					'A página chamou preload.ocultar() ou useOcultarPreload()?',
			)
		}, AVISO_MS)
		return () => clearTimeout(timer)
	}, [estado])

	if (!ativo) return null

	// Desmonta só depois que a animação de saída terminar
	function handleAnimationEnd(event) {
		if (estado === 'saindo' && event.target === event.currentTarget) finalizar()
	}

	return (
		<div
			className={`preload${estado === 'saindo' ? ' preload--saindo' : ''}`}
			role="status"
			aria-live="polite"
			onAnimationEnd={handleAnimationEnd}
		>
			<Background />

			<div className="preload__conteudo">
				<Logo tamanho={56} direcao="coluna" />
				<span className="preload__bolinhas" aria-hidden="true">
					<span />
					<span />
					<span />
				</span>
				<p className="preload__texto">{texto}</p>
			</div>
		</div>
	)
}

export default Preload
