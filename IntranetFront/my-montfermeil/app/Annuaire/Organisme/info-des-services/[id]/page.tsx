'use client'

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./style.css";

function infoDesServices() {
    const [fichier, SetFichier] = useState<any[]>([])
    const [loading, setLoading] = useState(false);
    const routeur = useRouter();
    const [api, setApi] = useState<any>({})

    const params = useParams();
    const id = params.id;


    async function getBackend() {
        setLoading(true)

        try {
            const token = sessionStorage.getItem("token")
            const res = await fetch(`/api/Montfermeil/connexion`, {
                headers: { authorization: token || "" }
            });

            const data = await res.json();
            setApi(data);
            setLoading(false)

        } catch (ex) {
            console.log(ex)
            setLoading(false)

        }
    }



    async function getFichier() {
        setLoading(true)
        try {
            const token = sessionStorage.getItem("token");

            const data = await fetch(`/api/Montfermeil/download/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const json = await data.json();

            SetFichier(json);
            console.log(json)
            setLoading(false)

        } catch (ex) {
            console.log(ex)
            setLoading(false)


        }
    }


    async function deleteFichier(id : string) {
        setLoading(true)
        try {
            const token = sessionStorage.getItem("token");

            const data = await fetch(`/api/Montfermeil/download/${id}/delete`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const json = await data.json();

            SetFichier(json);
            console.log(json)
            setLoading(false)

        } catch (ex) {
            console.log(ex)
            setLoading(false)


        }
    }




    useEffect(() => {
        getFichier()
        if (fichier) {
            getBackend()
        }
    }, [])

    if (loading) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                flexDirection: "column"
            }}>
                <div className="spinner"></div>
                <p style={{ marginTop: "20px", fontSize: "18px" }}>
                    Chargement des fichier...
                </p>

                <style jsx>{`
                    .spinner {
                        border: 4px solid rgba(0, 0, 0, 0.1);
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                        border-left-color: #09f;
                        animation: spin 1s linear infinite;
                    }
                    
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }
    return (
        <div className="Main">

            <h2>Liste des fichiers</h2>

            <div className="table-container">
                <table className="table-salaries">
                    <thead>
                        <tr>
                            <th colSpan={id == sessionStorage.getItem("organisme") ? 2 : 0}>Nom du fichier</th>
                        </tr>
                        {id == sessionStorage.getItem("organisme") && <tr>
                            <th> </th>
                        </tr>}

                    </thead>

                    <tbody>
                        {Array.isArray(fichier) && fichier.length > 0 ? (
                            fichier.map((value, index) => (
                                <tr key={index}>
                                    <td >
                                        <a
                                            style={{
                                                cursor: "pointer",
                                                color: "blue",
                                                margin: 0
                                            }}
                                            href={`${api.api}/${value.path}`}
                                            target="blank"
                                        >{value.nom}</a>
                                    </td>
                                    {id == sessionStorage.getItem("organisme") && 
                                    <td><button onClick={()=> deleteFichier(value.id)}><img width={30} src="/delete.png" alt="supprimer" /></button></td>}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td>Aucun fichier trouvé</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );


}

export default infoDesServices;