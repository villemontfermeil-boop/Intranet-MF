
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
interface Props {
    params: { id: string };
}

function SalarieModification() {

    const router = useRouter();
    const params = useParams();
    const [button, setButton] = useState<boolean>(false);
    const login = sessionStorage.getItem('mail')
    const password = sessionStorage.getItem('MDP')
    const [data, SetData] = useState<any | null>(null);
    const [personne, SetPersonne] = useState({
        nom: '',
        prenom: '',
        tele: '',
        mail: '',
        fonction: '',
        localisation: ''
    })
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
            const result = await reponse.json();
            SetData(result);
            SetPersonne({
                nom: result.nom ?? '',
                prenom: result.prenom ?? '',
                tele: result.numero ?? '',
                mail: result.mail ?? '',
                fonction: result.fonction ?? '',
                localisation: result.localisation ?? 'NON_DEFINI'
            });
        } catch (error) {
            console.log(error)
            console.log(credential)
        }
    }

    async function SendData(fonction: string, nomP: string, prenomP: string, emailP: string, telephoneportableP: string, localisationH: string) {
        try {

            const send = fetch(`http://localhost:8080/salaries/Modification/Salarie/${id}`, {
                method: "PATCH",
                headers: { 'Authorization': `Basic ${credential}` },
                body: new URLSearchParams({
                    nom: nomP,
                    prenom: prenomP,
                    mail: emailP,
                    numero: telephoneportableP,
                    fonction: fonction,
                    localisation: localisationH || 'NON_DEFINI'
                })
            })
            // alert('Modification éffectuer avec succès')
            // router.push('/')
            console.log(send)
        } catch (error) {

            console.log(error)
        }


    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        SetPersonne({ ...personne, [e.target.name]: e.target.value });
    };
    useEffect(() => {
        if (sessionStorage.length == 0 || !sessionStorage.getItem('isAdmin')) {
            router.push('/')
        } else {
            api();
        }
    }, [])

    useEffect(() => {
        if (button) {
            SendData(personne.fonction, personne.nom, personne.prenom, personne.mail, personne.tele, personne.localisation);
            setButton(false);
        }
    }, [button])

    console.log(data)
    return (
        <div>
            <h1>Voici l'id : {id} </h1>
            <div>
                <table
                    border={1}
                    style={{
                        borderColor: "red",
                        margin: "auto",
                        width: "80%"
                    }}
                >
                    <thead>
                        <tr>
                            <th>Champ</th>
                            <th>Valeur</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <th>Nom</th>
                            <td>
                                <input
                                    name="nom"
                                    type="text"
                                    value={personne.nom}
                                    onChange={handleChange}
                                />
                            </td>
                        </tr>

                        <tr>
                            <th>Prénom</th>
                            <td>
                                <input
                                    name="prenom"
                                    type="text"
                                    value={personne.prenom}
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>

                        <tr>
                            <th>Email</th>
                            <td>
                                <input
                                    name="mail"
                                    type="email"
                                    value={personne.mail}
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>

                        <tr>
                            <th>Téléphone</th>
                            <td>
                                <input
                                    name="tele"
                                    type="number"
                                    value={personne.tele}
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>

                        <tr>
                            <th>Localisation</th>
                            <td>
                                <div style={{ marginBottom: "5px" }}>
                                    <strong>Actuelle :</strong>
                                    <textarea
                                        value={personne.localisation}
                                        disabled
                                        readOnly
                                    />
                                </div>

                                <div>
                                    <strong>Nouvelle :</strong>
                                    <select
                                        name="localisation"
                                        value={personne.localisation}
                                        onChange={handleChange}
                                    >
                                        <option value="NON_DEFINI">NON_DEFINI</option>
                                        <option value="COMMUNICATION">COMMUNICATION</option>
                                        <option value="CABINET_DU_MAIRE">CABINET_DU_MAIRE</option>
                                        <option value="ELUS">ELUS</option>
                                        <option value="POLICE_MUNICIPALE">POLICE_MUNICIPALE</option>
                                        <option value="PROSPECTIVE_ET_MUTATIONS_URBAINES">
                                            PROSPECTIVE_ET_MUTATIONS_URBAINES
                                        </option>
                                        <option value="VIE_HABITANT_ET_VIE_DE_LA_CITE">
                                            VIE_HABITANT_ET_VIE_DE_LA_CITE
                                        </option>
                                        <option value="VILLE_ATTRACTIVE">VILLE_ATTRACTIVE</option>
                                        <option value="VILLE_MODERNE">VILLE_MODERNE</option>
                                    </select>
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <th>Fonction</th>
                            <td>
                                <input
                                    name="fonction"
                                    type="text"
                                    value={personne.fonction}
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>

                        <tr>
                            <td colSpan={2}>
                                <button
                                    style={{ width: "100%" }}
                                    type="button"
                                    onClick={() => setButton(true)}
                                >
                                    Envoyer
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

            </div>
        </div>
    )
}

export default SalarieModification;