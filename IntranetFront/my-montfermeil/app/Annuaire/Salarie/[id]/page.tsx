'use client';

import { Params } from "next/dist/server/request/params";
import { useParams } from "next/navigation";
import { Router, useRouter } from "next/router";
import { useEffect, useState } from "react";





function SalariePage() {
    const params = useParams();
    const id = params?.id ? parseInt(params.id as string) : 0;
    const [salarie, SetSalarie] = useState<any>({})
    
    if (sessionStorage.length == 0 || sessionStorage.length == null) {
       window.location.href="/"
    }
    async function LookingForid(id: number) {

        const identifiant = sessionStorage.getItem("mail")
        const password = sessionStorage.getItem("MDP")

        const credential = btoa(`${identifiant}:${password}`)
        try {
            const response = await fetch(`/api/Montfermeil/users/${id}`)
            const data = await response.json();
            SetSalarie(data);



        } catch (error) {
            console.log(error)



        }
    }

    useEffect(() => {

        LookingForid(id)
    }, [])
    console.log(salarie)
    return (
        <div>
            <div style={{ placeItems: "center" }}>
                <h1>
                    <u>
                        {salarie.nom}
                        {"   "}
                        {salarie.prenom}
                    </u>
                </h1>
                <table border={1} style={{ textAlign: "center" }} >
                    <thead >
                        <tr>
                            <th style={{ paddingRight: "50%" }}>
                                Fonction:
                            </th>
                            <td>
                                {salarie.fonction}
                            </td>
                        </tr>
                        <tr>
                            <th style={{ paddingRight: "50%" }}>
                                Localisation:
                            </th>
                            <td>
                                {salarie.localisation}
                            </td>
                        </tr>
                        <tr>
                            <th style={{ paddingRight: "50%" }}>
                                Numero:
                            </th>
                            <td>
                                {salarie.numero}
                            </td>
                        </tr>
                        <tr>
                            <th style={{ paddingRight: "50%" }}>
                                Téléphone pro:
                            </th>
                            <td>
                                {salarie.telephonepro || 'NON_DÉFINI'}
                            </td>
                        </tr>
                        <tr>
                            <th style={{ paddingRight: "50%" }}>
                                Email:
                            </th>
                            <td>
                               <a href={`mailTo:${salarie.mail}`}> {salarie.mail}</a>
                            </td>
                        </tr>
                        <tr>
                            <th style={{ paddingRight: "0%" }}>
                                Statut sur le site :
                            </th>
                            <td>
                                {salarie.isConnected ? <img src="/checkbox.png" style={{ width: "10%" }} /> : <img src="/cross.png" style={{ width: "10%" }} />}
                            </td>
                        </tr>

                    </thead>
                </table>
            </div>
        </div>
    );
}

export default SalariePage;