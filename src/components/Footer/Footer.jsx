import './Footer.scss'

function Footer() {
	return (
		<footer className="footer">
			<div className="footer__inner">© {new Date().getFullYear()} Cuidese</div>
		</footer>
	)
}

export default Footer
