import { Outlet, useLocation } from 'react-router-dom'
import Background from '@/components/Background/Background'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import './MainLayout.scss'

// Rotas que não exibem header e footer
const ROTAS_SEM_HEADER_FOOTER = ['/login', '/cadastro']

// Template principal (equivalente ao layout Blade "main").
// Toda tela declarada como filha desta rota é renderizada no lugar do <Outlet />.
function MainLayout() {
	const { pathname } = useLocation()
	const exibirHeaderFooter = !ROTAS_SEM_HEADER_FOOTER.includes(pathname)

	return (
		<div className="main-layout">
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
