
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
interface Props {
    params: { id: string };
}

function SalarieModification() {

    const router = useRouter();
    const params = useParams();
    const login = sessionStorage.getItem('mail')
    const password = sessionStorage.getItem('MDP')
    const [data, SetData] = useState<any | null>(null);
    const id = params.id
    const credential = btoa(`${login}:${password}`)
    const api = async () => {
        try {
            const reponse = await fetch(`http://localhost:8080/salaries/${id}`, {
                method: "GET",
                headers: {
                    'Authorization': `Basic ${credential}`
                }
            })
            SetData(await reponse.json());
        } catch (error) {
            console.log(error)
            console.log(credential)
        }
    }

    useEffect(() => {
        if (sessionStorage.length == 0 || !sessionStorage.getItem('isAdmin')) {
            router.push('/')
        } else {
            api();
        }
    }, [])

    console.log(data)
    return (
        <div>
            <h1>Voici l'id : {id} </h1>
            <div>
                <table border={1} style={{ borderColor: "red", display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                    <thead>
                        <tr>
                            <th>
                                Nom
                            </th>
                            <td><input type="text" value={data?.nom || 'NA'} /></td>
                        </tr>
                        <tr>
                            <th>
                                Prénom
                            </th>
                            <td><input type="text" value={data?.prenom || 'NA'} required /></td>

                        </tr>
                        <tr>
                            <th>
                                Email
                            </th>
                            <td><input type="text" value={data?.mail || 'NA'} required /></td>

                        </tr>

                        <tr>
                            <th>
                                Téléphone
                            </th>
                            <td><input type="text" value={data?.numero || 'NA'} required /></td>

                        </tr>

                        <tr>

                            <th>
                                Localisation
                            </th>
                            <td><span>Localisation actuelle: </span><textarea disabled  value={data?.localisation || 'NA'} readOnly /> <span>Nouvelle localisation: </span>
                                <select name="localisation" >
                                    <option value="NON_DEFINI">NON_DEFINI</option>
                                    <option value="COMMUNICATION">COMMUNICATION</option>
                                    <option value="CABINET_DU_MAIRE">CABINET_DU_MAIRE</option>
                                    <option value="ELUS">ELUS</option>
                                    <option value="POLICE_MUNICIPALE">POLICE_MUNICIPALE</option>
                                    <option value="PROSPECTIVE_ET_MUTATIONS_URBAINES">PROSPECTIVE_ET_MUTATIONS_URBAINES</option>
                                    <option value="VIE_HABITANT_ET_VIE_DE_LA_CITE">VIE_HABITANT_ET_VIE_DE_LA_CITE</option>
                                    <option value="VILLE_ATTRACTIVE">VILLE_ATTRACTIVE</option>
                                    <option value="VILLE_MODERNE">VILLE_MODERNE</option>
                                </select>


                            </td>

                        </tr>
                        <tr>
                            <th>
                                Fonction
                            </th>
                            <td><input type="text" value={data?.fonction || 'NA'} required /></td>

                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <button style={{ width: '100%' }} type='submit'>Envoyer</button>
                            </td>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>
    )
}

export default SalarieModification;