import { useLayoutEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Background from '@/components/Background/Background'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import Preload from '@/components/Preload/Preload'
import { preload } from '@/components/Preload/preloadStore'
import './MainLayout.scss'

// Rotas que não exibem header e footer
const ROTAS_SEM_HEADER_FOOTER = ['/login', '/cadastro']

// Template principal (equivalente ao layout Blade "main").
// Toda tela declarada como filha desta rota é renderizada no lugar do <Outlet />.
function MainLayout() {
	const { pathname } = useLocation()
	const exibirHeaderFooter = !ROTAS_SEM_HEADER_FOOTER.includes(pathname)

	// Cada página começa com o preload na tela; a própria página o oculta quando estiver pronta.
	// useLayoutEffect roda antes dos useEffect das páginas, então o "mostrar" daqui
	// sempre acontece antes do "ocultar" delas.
	useLayoutEffect(() => {
		preload.iniciarPagina()
	}, [pathname])

	return (
		<div className="main-layout">
			<Preload />
			<Background />

			{exibirHeaderFooter && <Header />}

			<main className="main-layout__content">
				<Outlet />
			</main>

			{exibirHeaderFooter && <Footer />}
		</div>
	)
}

export default MainLayout
