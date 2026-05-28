'use client'
import { useRouter } from "next/navigation";




function ApplicationSite() {

    const routeur = useRouter()
    return (
        <div style={{placeItems: "center"}}>
            <h2 style={{textAlign: "center"}}><u>Vous pouvez interagir avec les images, elles vous redirigeront vers les pages concernées.</u></h2>
            <table border={1}>
                <tbody>
                    <tr>
                        <td>
                            <a href="https://outlook.office365.com/mail" target="_blank" rel="noopener noreferrer">
                                <img src="/outlook.png" alt="Outlook" style={{ height: "160px", cursor: "pointer" }} />
                            </a>
                        </td>
                        <td>
                            <a href="https://glpi.montfermeil.fr/glpi" target="_blank" rel="noopener noreferrer">
                                <img src="/glpi.png" alt="GLPI" style={{ height: "130px", cursor: "pointer" }} />
                            </a>
                        </td>
                        <td>
                            <a href="https://s-cirilweb.montfermeil.fr" target="_blank" rel="noopener noreferrer">
                                <img src="/ciril.png" alt="CIRIL" style={{ height: "140px", cursor: "pointer" }} />
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <a href="https://s-atalweb.montfermeil.fr/Account/Login?ReturnUrl=%2F" target="_blank" rel="noopener noreferrer">
                                <img src="/atal.png" alt="ATAL" style={{ height: "140px", cursor: "pointer" }} />
                            </a>
                        </td>
                        <td>
                            <a href="https://www.espaces-citoyens.net/montfermeil/espaces-agents/#/login" target="_blank" rel="noopener noreferrer">
                                <img src="/arpege.png" alt="ARPEGE" style={{ height: "60px", cursor: "pointer" }} />
                            </a>
                        </td>
                        <td>
                            <a href="https://cirilcourrier:9090/CivilNetDocument/" target="_blank" rel="noopener noreferrer">
                                <img src="/ciril-group.png" alt="CIRIL Group" style={{ height: "60px", display: "flex", justifyContent: "center", marginLeft: "80px", cursor: "pointer" }} />
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <a href="https://webdebil-ville.montfermeil/users/login" target="_blank" rel="noopener noreferrer">
                                <img src="webdebil.png" style={{ height: "150px", marginLeft: "40px", cursor: "pointer" }} alt="WebDebil" />
                            </a>
                        </td>
                        <td>
                            <a href="https://www.ville-montfermeil.fr/page-daccueil/" target="_blank" rel="noopener noreferrer">
                                <img src="MF.png" style={{ height: "170px", marginLeft: "10px", cursor: "pointer" }} alt="Ville Montfermeil" />
                            </a>
                        </td>
                        <td>
                            <a href="https://concerto.arperge.fr/montfermeil/ConcertoPetiteEnfance/#/login" target="_blank" rel="noopener noreferrer">
                                <img src="concerto.png" style={{ height: "50px", marginRight: "20px", cursor: "pointer" }} alt="Concerto" />
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

    )
}

export default ApplicationSite;