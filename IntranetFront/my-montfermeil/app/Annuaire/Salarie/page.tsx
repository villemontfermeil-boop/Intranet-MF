'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import "@/app/Annuaire/Salarie/style.css";


function ModifierSalarie() {

    const [search, SetSearch] = useState<string>("")
    const [pepole, Setpeople] = useState<any[]>([]);
    const [visible, SetVisible] = useState(true);
    const routeur = useRouter();

    async function LookingForName(name: string) {

        const identifiant = sessionStorage.getItem("mail")
        const password = sessionStorage.getItem("MDP")

        const credential = btoa(`${identifiant}:${password}`)
        try {
            const response = await fetch(`/api/Montfermeil/users/Salarie/${name}`)
            const data = await response.json();
            Setpeople(data);
            SetVisible(true)
            console.log(data)


        } catch (error) {
            console.log(error)
            SetVisible(true)


        }
    }
    useEffect(() => {
        if (sessionStorage.length == 0 || sessionStorage == null) {
            routeur.push("/");
        }

    }, [])
    useEffect(() => {

        if (search.trim() !== "") {
            //temps de chargement
            SetVisible(false)

            setTimeout(() => {
                LookingForName(search);
            }, 1000);

        } else {
            Setpeople([]);
        }

    }, [search])

    return (
        <div className="container">
            <input
                type="text"
                value={search}
                onChange={(e) => SetSearch(e.target.value)}
                placeholder="Rechercher un salarié par nom..."
                className="search-input"
            />
            <div>
                <h3 className="results-title">Résultats ({pepole.length})</h3>

                <h2 hidden={visible}>Chargement... </h2>

                {pepole.length > 0 ? (
                    <div className="table-container">
                        <table className="montableau">
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Prénom</th>
                                    <th>Téléphone</th>
                                    <th className="hide-on-mobile">Tél. Pro</th>
                                    <th>Email</th>
                                    <th className="hide-on-tablet">Fonction</th>
                                    <th>Services</th>
                                    <th>Découvrir</th>
                                    {/* Ajouter une collone lieux */}
                                    {sessionStorage.getItem("isAdmin") == 'true' && <th>Modifier</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {pepole.map((person, index) => (
                                    <tr key={index}>
                                        <td data-label="Nom">{person.nom || 'N/A'}</td>
                                        <td data-label="Prénom">{person.prenom || 'N/A'}</td>
                                        <td data-label="Téléphone">{person.numero || 'N/A'}</td>
                                        <td className="hide-on-mobile" data-label="Tél. Pro">{person.telephonepro || 'N/A'}</td>
                                        <td data-label="Email">
                                            <a href={`mailto:${person.mail || 'N/A'}`}>
                                                {person.mail || 'N/A'}
                                            </a>
                                        </td>
                                        <td className="hide-on-tablet" data-label="Fonction">{person.fonction || 'N/A'}</td>
                                        <td data-label="Services">{person.localisation || 'N/A'}</td>
                                        <td><button onClick={() => routeur.push(`/Annuaire/Salarie/${person.id}`)}
                                            className="modifier-btn">Voir</button></td>
                                        {sessionStorage.getItem("isAdmin") == 'true' && (

                                            <td data-label="Actions">
                                                <button
                                                    onClick={() => routeur.push(`/Annuaire/${person.id}`)}
                                                    className="modifier-btn"
                                                >
                                                    Modifier
                                                </button>
                                            </td>
                                        )}

                                    </tr>
                                ))}

                            </tbody>
                        </table>

                    </div>

                ) : search.length > 0 ? (
                    <p className="no-results">Aucun résultat trouvé pour "{search}"</p>
                ) : null}
            </div>
        </div>
    )
}

export default ModifierSalarie;