
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
        mail: '',
        password: '',
        numero: '',
        numeroPro: '',
        localisation: 'NON_DEFINI',
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
        
            const response = await fetch("/api/Montfermeil/users/NewSalarie", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',

                },
                body: new URLSearchParams(newSalarie as Record<string, string>)
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
                            name="mail"
                            placeholder="Email"
                            value={newSalarie.mail}
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
                            name="numeroPro"
                            placeholder="Téléphone pro"
                            value={newSalarie.numeroPro}
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

                        <select name="localisation" value={newSalarie.localisation || 'NON_DEFINI'} onChange={handleChange}>
                            <option value="NON_DEFINI">NON DEFINI</option>
                            <option value="VILLE_ÉDUCATIVE">VILLE ÉDUCATIVE</option>

                            <option value="PROSPERTCTIVE_ET_MUTATION_URBAINES">PROSPERTCTIVE ET MUTATION URBAINES</option>
                            <option value="VILLE_CULTURELLE">VILLE CULTURELLE</option>

                            <option value="COHÉSION_LOCALE">COHÉSION LOCALE</option>
                            <option value="VILLE_MODERNE">VILLE MODERNE</option>
                            <option value="VILLE_ATTRACTIVE">VILLE ATTRACTIVE</option>
                            <option value="DIRECTION_GÉNÉRALE">DIRECTION GÉNÉRALE</option>
                        </select>

                        <select
                            name="fonction"
                            value={newSalarie.fonction}
                            onChange={handleChange}
                        >
                            <option value="NON_DEFINI">NON DEFINI</option>

                            <option disabled>--Ville éducative--</option>
                            <option value="4 Multi-accueils">4 Multi-acceuils</option>
                            <option value="Relais petite enfance">Relais petite enfance</option>
                            <option value="Scolaire restauration entretien">Scolaire restauration entretien</option>
                            <option value="Enfance">Enfance</option>
                            <option value="PRE">PRE</option>
                            <option value="Jeunesse">Jeunesse</option>
                            <option value="Animations sportives">Animations sportives</option>
                            <option value="PIJ">PIJ</option>
                            <option value="Mediation">Mediation</option>

                            <option disabled>--Prospective et mutations urbaines--</option>
                            <option value="Développement Urbain: Urbanisme">Développement Urbain: Urbanisme</option>
                            <option value="Développement Urbain: Foncier">Développement Urbain: Foncier</option>
                            <option value="Développement Urbain: PPSP">Développement Urbain: PPSP</option>
                            <option value="Stratégies territoriales">Stratégies territoriales</option>
                            <option value="Performance de l'habitat">Performance de l'habitat</option>


                            <option disabled>--Ville culturelle--</option>
                            <option value="Ecoles municipales">Ecoles municipales</option>
                            <option value="Programmation culturelle">Programmation culturelle</option>
                            <option value="Coopération culturelle-Médicis">Coopération culturelle-Médicis</option>
                            <option value="Grands évènements">Grands évènements</option>
                            <option value="Médiathèque-Ludothèque">Médiathèque-Ludothèque</option>





                            <option disabled>--Cohésion local--</option>
                            <option value="Agora">Agora</option>
                            <option value="Vie des quartiers et citoyenneté">Vie des quartiers et citoyenneté</option>
                            <option value="Animation commerciale patrimoniale">Animation commerciale patrimoniale</option>
                            <option value="CCAS">CCAS</option>
                            <option value="Inclusion et développement numérique">Inclusion et développement numérique</option>

                            <option disabled>--Ville moderne--</option>
                            <option value="Ressources humaines">Ressources humaines</option>
                            <option value="Affaires juridiques">Affaires juridiques</option>
                            <option value="Commandes publique">Commandes publique</option>
                            <option value="Transformation numérique">Transformation numérique</option>
                            <option value="Finances">Finances</option>
                            <option value="Archives documentation">Archives documentation</option>
                            <option value="Guichet unique">Guichet unique</option>


                            <option disabled>--Ville attractive--</option>
                            <option value="Batiments">Batiments</option>
                            <option value="Festivités logistique">Festivités logistique</option>
                            <option value="Ville nourricière">Ville nourricière</option>
                            <option value="Transition énergétique">Transition énergétique</option>
                            <option value="Environnement">Environnement</option>
                            <option value="Mission d'appui">Mission d'appui</option>
                            <option value="Espace public">Espace public</option>



                            <option disabled>--Direction Générale--</option>
                            <option value="Police municipales">Police municipales</option>
                            <option value="Cabinet">Cabinet</option>
                            <option value="Communication">Communication</option>















                        </select>
                        <button type="submit">Créer</button>
                    </form>
                </div>
                <p style={{ textAlign: "center" }}>*Seuls les administrateurs peuvent créer un salarié. *</p>
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