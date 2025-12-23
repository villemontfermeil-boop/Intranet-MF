
'use client'

import { useEffect, useState } from "react";
import '@/app/Nouveau/Salarie/style.css'

import { useRouter } from "next/navigation";


function AdminPanel() {

    const [isAdmin, setIsadmin] = useState<boolean>(false)
    const router = useRouter();

    const [newSalarie, setNewSalarie] = useState({
        nom: '',
        prenom: '',
        email: '',
        password: '',
        numero: '',
        telpro: '',
        localisation: '',
        fonction: 'NON_DEFINI'
    })
    useEffect(() => {
        const visiteur = sessionStorage.getItem('isAdmin');
        setIsadmin(visiteur === "true");

    }, [])
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setNewSalarie({ ...newSalarie, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Données du formulaire :', newSalarie);

        // if(newSalarie.password.length<8  ){

        // }

        try {
            const idnetifiantAdmin = sessionStorage.getItem("mail");
            const passwordAdmin = sessionStorage.getItem("MDP");
            const credential = btoa(`${idnetifiantAdmin}:${passwordAdmin}`)

            //zone a supprimer en prod

            console.log("Credential", sessionStorage);
            console.log("Data", newSalarie);

            //
            const response = await fetch("http://localhost:8080/salaries/NewSalarie", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${credential}`
                },
                body: new URLSearchParams({
                    nom: newSalarie.nom,
                    prenom: newSalarie.prenom,
                    mail: newSalarie.email,
                    numero: String(newSalarie.numero),
                    numeroPro: String(newSalarie.telpro),
                    fonction: newSalarie.fonction,
                    password: newSalarie.password,
                    localisation: newSalarie.localisation || 'NON_DEFINI'
                })


            }
            );
            console.log(response);
            console.log("Headers:", Object.fromEntries(response.headers.entries()));
            alert(`${newSalarie.nom} ${newSalarie.prenom} à été ajouter`)
            router.push('/')
        } catch (error) {
            console.log(error);


        }
    }

    if (isAdmin == true) {
        return (
            <div>
                <h1>
                    Admin Panel

                </h1>
                <div className="form-container">
                    <h2>Créer un nouveau salarié</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="nom"
                            placeholder="Nom"
                            value={newSalarie.nom}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="prenom"
                            placeholder="Prénom"
                            value={newSalarie.prenom}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={newSalarie.email}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="numero"
                            name="numero"
                            placeholder="numero"
                            value={newSalarie.numero}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="numero"
                            name="telpro"
                            placeholder="Téléphone pro"
                            value={newSalarie.telpro}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Mot de passe"
                            value={newSalarie.password}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="fonction"
                            name="fonction"
                            placeholder="Fonction (ex: Directeur de cabinet) "
                            value={newSalarie.fonction}
                            onChange={handleChange}
                            required
                        />

                        <select name="localisation" value={newSalarie.localisation || 'NON_DEFINI'} onChange={handleChange}>
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
                        <button type="submit">Créer</button>
                    </form>
                </div>
            </div>
        )
    } else {
        return (

            <div>
                <h1>
                    Interdit
                </h1>
            </div>
        )
    }
}

export default AdminPanel;  