'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./style.css";
import { getSessionItemOrEmpty } from "@/app/utils/sessionStorage";






function infoDesServices() {
    const [organisme, SetOrganisme] = useState<any[]>([])
    const [loading, setLoading] = useState(false);
    const [hider, setHider] = useState(false);
    const routeur = useRouter();

    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState("");

    async function getOrganisme() {
        setLoading(true)
        try {
            const token = getSessionItemOrEmpty("token");

            const data = await fetch("/api/Montfermeil/organisation/label/all", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const json = await data.json();

            SetOrganisme(json);
            console.log(json)
            setLoading(false)

        } catch (ex) {
            console.log(ex)
            setLoading(false)


        }
    }


    async function setOrganisme() {
        setLoading(true)

        if (!file) {
            alert("Choisis un fichier");
            setLoading(false)

            return;
        }

        const formData = new FormData();

        // fichier physique
        formData.append("file", file);

        // nom du fichier (texte)
        formData.append("nom", fileName || file.name);
        formData.append("organisme", String(getSessionItemOrEmpty("organisme")) || '');

        try {
            const token = getSessionItemOrEmpty("token");

            const data = await fetch("/api/Montfermeil/download/new", {
                method: "POST",

                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            })

            const json = await data.json();

            SetOrganisme(json);
            console.log(json)
            alert("Ajout éfectuer avec succès")
            routeur.push("/")
            setHider(false)
            setLoading(false)

        } catch (ex) {
            console.log(ex)
            setLoading(false)


        }
    }



    useEffect(() => {
        getOrganisme()
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
                    Chargement des organisme...
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
        <div className="organisme-page">
            <section className="organisme-panel">
                <div className="organisme-header">
                    <div>
                        <h2>Organismes & services</h2>
                        <p>Consultez les organismes disponibles et importez un document.</p>
                    </div>
                    <button
                        className="toggle-btn"
                        onClick={() => setHider(!hider)}
                    >
                        {hider ? "Masquer le formulaire" : "Ajouter un document"}
                    </button>
                </div>

                <div className="table-wrapper">
                    <table className="table-salaries">
                        <tbody hidden={!hider}>
                            <tr>
                                <td>
                                    <input
                                        type="file"
                                        className="file-input"
                                        onChange={(e) => {
                                            const file = e.target.files;
                                            if (file && file.length > 0) {
                                                setFileName(file[0].name);
                                                setFile(file[0]);
                                            } else {
                                                setFile(null);
                                            }
                                        }}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <button
                                        className="submit-btn"
                                        type="submit"
                                        onClick={() => setOrganisme()}
                                    >
                                        Envoyer
                                    </button>
                                </td>
                            </tr>
                        </tbody>

                        <tbody hidden={hider}>
                            {Array.isArray(organisme) && organisme.map((value, index) => (
                                <tr key={index}>
                                    <td>
                                        <button
                                            className="organisme-link"
                                            onClick={() => routeur.push(`/Annuaire/Organisme/info-des-services/${value.id}`)}
                                        >
                                            {value.label}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );

}


export default infoDesServices;