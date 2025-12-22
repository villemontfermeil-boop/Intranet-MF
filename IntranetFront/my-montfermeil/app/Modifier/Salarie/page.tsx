'use client'

import { defaultConfig } from "next/dist/server/config-shared";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"



function ModifierSalarie() {

    const [search, SetSearch] = useState<string>("")
    const [pepole, Setpeople] = useState<any[]>([]);
    const routeur = useRouter();


    async function LookingForName(name: string ) {

        const identifiant = sessionStorage.getItem("mail")
        const password = sessionStorage.getItem("MDP")

        const credential = btoa(`${identifiant}:${password}`)
        console.log(identifiant ,password  )
        try {
            const response = await fetch(`http://localhost:8080/salaries/Salarie/${encodeURIComponent(name)}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${credential}`
                }


            })
            const data = await response.json();
            Setpeople(data);

        } catch (error) {
            console.log(error)
            
        }
    }
    useEffect(() => {

        LookingForName(search);
    }, [search])

    function handlechange({ e }: { e: string }) {
        SetSearch(e)
    }
    {console.log(pepole)}
     return (
        <div style={{ padding: '20px' }}>
            <input 
                type="text" 
                value={search}
                onChange={(e) => SetSearch(e.target.value)} 
                placeholder="Rechercher un salarié par nom..."
                style={{ 
                    padding: '10px', 
                    width: '300px',
                    marginBottom: '20px'
                }}
            />
            
            {/* Affichage des résultats */}
            <div>
                <h3>Résultats ({pepole.length})</h3>
                {pepole.length > 0 ? (
                    <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f2f2f2' }}>
                                <th style={{ padding: '10px' }}>Nom</th>
                                <th style={{ padding: '10px' }}>Prénom</th>
                                <th style={{ padding: '10px' }}>Email</th>
                                <th style={{ padding: '10px' }}>Poste</th>
                                {sessionStorage.getItem("isAdmin") && <th style={{ padding: '10px' }}>Modifier</th>}
                                
                            </tr>
                        </thead>
                        <tbody>
                            {pepole.map((person, index) => (
                                <tr key={index}>
                                    <td style={{ padding: '10px' }}>{person.nom || 'N/A'}</td>
                                    <td style={{ padding: '10px' }}>{person.prenom || 'N/A'}</td>
                                    <td style={{ padding: '10px' }}>{person.mail || 'N/A'}</td>
                                    <td style={{ padding: '10px' }}>{person.localisation || 'N/A'}</td>
                                    {sessionStorage.getItem("isAdmin") && <button id={index.toString()} onClick={(event) => routeur.push("")} style={{width: "100%", height: "100px"}}>Modifier</button>}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : search.length > 0 ? (
                    <p>Aucun résultat trouvé pour "{search}"</p>
                ) : null}
            </div>
        </div>
    )
}
export default ModifierSalarie;