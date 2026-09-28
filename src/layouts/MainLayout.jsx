import { Outlet } from 'react-router-dom'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import '@/styles/global.scss'
import './MainLayout.scss'

// Template principal (equivalente ao layout Blade "main").
// Toda tela declarada como filha desta rota é renderizada no lugar do <Outlet />.
function MainLayout() {
	return (
		<div className="main-layout">
			<Header />

			<main className="main-layout__content">
				<Outlet />
			</main>

			<Footer />
		</div>
	)
}

export default MainLayout
