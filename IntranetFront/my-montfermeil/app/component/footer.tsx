import './stylheader.css';



function footer() {

    const hauteurFooter = "50px"
    const date = new Date()

    const atoday = date.getFullYear()
    return (
        <footer className="site-footer" style={{marginTop: hauteurFooter, position: "relative"}} >
            <div className="footer-content">
                <p>© {atoday} site intranet de Montfermeil. Réservés au agents de la mairire.</p>
                <div className="footer-links">
                    <a href="/Apropos">À propos</a>
                    <a href="mailto:service.communication@montfermeil.onmicrosoft.com">Contact</a>
                    <a href="/Confidentialite">Confidentialité</a>
                </div>
            </div>
        </footer>
    )
}
export default footer;