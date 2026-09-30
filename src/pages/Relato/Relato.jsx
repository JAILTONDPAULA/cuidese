import { useOcultarPreload } from '@/components/Preload/preloadStore'
import './Relato.scss'

function Relato() {
	useOcultarPreload()

	return (
		<section className="relato">
			<h1>Como você está se sentindo?</h1>
			<p>Descreva seus sintomas com suas palavras.</p>
		</section>
	)
}

export default Relato
