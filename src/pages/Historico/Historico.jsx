import { useOcultarPreload } from '@/components/Preload/preloadStore'

function Historico() {
	useOcultarPreload()

	return (
		<section>
			<h1>Histórico</h1>
			<p>Seus relatos e resumos anteriores aparecerão aqui.</p>
		</section>
	)
}

export default Historico
