'use client'
import { useRouter } from "next/navigation";
import "./style.css";




function ApplicationSite() {

    const routeur = useRouter()
    return (
        <div className="application-page">
            <h2 className="application-heading"><u>Vous pouvez interagir avec les images, elles vous redirigeront vers les pages concernées.</u></h2>
            <div className="application-table-wrapper">
                <table className="application-table" border={1}>
                <tbody>
                    <tr>
                        <td>
                            <a href="https://outlook.office365.com/mail" target="_blank" rel="noopener noreferrer">
                                <img src="/outlook.png" alt="Outlook" className="app-image" />
                            </a>
                        </td>
                        <td>
                            <a href="https://glpi.montfermeil.fr/glpi" target="_blank" rel="noopener noreferrer">
                                <img src="/glpi.png" alt="GLPI" className="app-image" />
                            </a>
                        </td>
                        <td>
                            <a href="https://s-cirilweb.montfermeil.fr" target="_blank" rel="noopener noreferrer">
                                <img src="/ciril.png" alt="CIRIL" className="app-image" />
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <a href="https://s-atalweb.montfermeil.fr/Account/Login?ReturnUrl=%2F" target="_blank" rel="noopener noreferrer">
                                <img src="/atal.png" alt="ATAL" className="app-image" />
                            </a>
                        </td>
                        <td>
                            <a href="https://www.espaces-citoyens.net/montfermeil/espaces-agents/#/login" target="_blank" rel="noopener noreferrer">
                                <img src="/arpege.png" alt="ARPEGE" className="app-image" />
                            </a>
                        </td>
                        <td>
                            <a href="https://cirilcourrier:9090/CivilNetDocument/" target="_blank" rel="noopener noreferrer">
                                <img src="/ciril-group.png" alt="CIRIL Group" className="app-image" />
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <a href="https://webdebil-ville.montfermeil/users/login" target="_blank" rel="noopener noreferrer">
                                <img src="webdebil.png" alt="WebDebil" className="app-image" />
                            </a>
                        </td>
                        <td>
                            <a href="https://www.ville-montfermeil.fr/page-daccueil/" target="_blank" rel="noopener noreferrer">
                                <img src="MF.png" alt="Ville Montfermeil" className="app-image" />
                            </a>
                        </td>
                        <td>
                            <a href="https://concerto.arperge.fr/montfermeil/ConcertoPetiteEnfance/#/login" target="_blank" rel="noopener noreferrer">
                                <img src="concerto.png" alt="Concerto" className="app-image" />
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
            </div>
        </div>

    )
}

export default ApplicationSite;