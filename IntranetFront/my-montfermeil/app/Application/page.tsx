'use client'
import { useRouter } from "next/navigation";




function ApplicationSite() {

    const routeur = useRouter()
    return (
        <div style={{placeItems: "center"}}>
            <h2 style={{textAlign: "center"}}><u>Vous pouvez interagir avec les images, ils vous redirigeront vers les pages concernées.</u></h2>
            <table border={1}>
                <tbody>
                    <tr>
                        <td>
                            <img src="/outlook.png" onClick={() =>window.location.href = "https://outlook.office365.com/mail"} alt="" style={{ height: "160px" , cursor: "pointer"}} />
                        </td>
                        <td>
                            <img src="/glpi.png" alt=""onClick={() =>window.location.href = "https://glpi.montfermeil.fr/glpi"}  style={{ height: "130px", cursor: "pointer" }} />

                        </td>
                        <td>
                            <img src="/ciril.png" onClick={() =>window.location.href = "https://s-cirilweb.montfermeil.fr"} alt="" style={{ height: "140px", cursor: "pointer" }} />

                        </td>
                    </tr>
                    <tr>
                        <td>
                            <img src="/atal.png" onClick={() =>window.location.href = "https://s-atalweb.montfermeil.fr/Account/Login?ReturnUrl=%2F"} alt="" style={{ height: "140px", cursor: "pointer" }} />

                        </td>
                        <td>
                            <img src="/arpege.png" onClick={() =>window.location.href = "https://www.espaces-citoyens.net/montfermeil/espaces-agents/#/login"} alt="" style={{ height: "60px", cursor: "pointer" }} />

                        </td>
                        <td>
                            <img src="/ciril-group.png" onClick={() =>window.location.href = "https://cirilcourrier:9090/CivilNetDocument/"} alt="" style={{ height: "60px", display: "flex", justifyContent: "center", marginLeft: "80px", cursor: "pointer" }} />

                        </td>


                    </tr>
                    <tr>
                        <td>
                            <img src="webdebil.png" onClick={() =>window.location.href = "https://webdebil-ville.montfermeil/users/login"} style={{ height: "150px", marginLeft: "40px", cursor: "pointer" }} alt="" />
                        </td>
                        <td>
                            <img src="MF.png" onClick={() =>window.location.href = "https://www.ville-montfermeil.fr/page-daccueil/"} style={{height: "170px", marginLeft: "10px", cursor: "pointer"}} alt="" />

                        </td>
                        <td>
                            <img src="concerto.png" onClick={() =>window.location.href = "https://concerto.arperge.fr/montfermeil/ConcertoPetiteEnfance/#/login"} style={{ height: "50px", marginRight: "20px", cursor: "pointer" }} alt="" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

    )
}

export default ApplicationSite;