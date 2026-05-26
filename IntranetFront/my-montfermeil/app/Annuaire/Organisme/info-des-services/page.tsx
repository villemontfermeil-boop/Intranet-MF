'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";






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
            const token = sessionStorage.getItem("token");

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
        formData.append("organisme", String(sessionStorage.getItem("organisme")) || '');

        try {
            const token = sessionStorage.getItem("token");

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
        <div
            style={{
                maxHeight: "400px",
                overflowY: "auto",
                border: "1px solid #ccc",
                borderRadius: "10px",
                width: "300px",
                margin: "auto",
                marginTop: "5%"

            }}
        >

            <table
                className="table-salaries"
                style={{
                    textAlign: "center",
                    width: "100%",
                    borderCollapse: "collapse",
                }}
            >


                <tbody hidden={hider == false ? false : true}>
                    {Array.isArray(organisme) &&
                        organisme.map((value, index) => (
                            <tr key={index}>
                                <td
                                    style={{
                                        padding: "8px",
                                        borderBottom: "1px solid #eee"
                                    }}
                                >
                                    <p
                                        style={{
                                            cursor: "pointer",
                                            color: "blue",
                                            margin: 0
                                        }}
                                        onClick={() =>
                                            routeur.push(`/Annuaire/Organisme/info-des-services/${value.id}`)
                                        }
                                    >
                                        {value.label}
                                    </p>
                                </td>
                            </tr>

                        ))}
                </tbody>

                <tbody hidden={!hider ? true : false}>
                    <tr>
                        <td>
                            <input type="file" onChange={(e) => { const file = e.target.files; if (file && file.length > 0) { setFileName(file[0].name), setFile(file[0]) } else { setFile(null) } }} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button type="submit" onClick={() => setOrganisme()}>Emvoyer</button>
                        </td>
                    </tr>
                </tbody>

            </table>
            <button style={{width: "100%"}} onClick={() => hider == false ? setHider(true) : setHider(false)}>Ajouter un document</button>

        </div>
    );

}


export default infoDesServices;