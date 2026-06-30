'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./style.css";
import { getSessionItemOrEmpty } from "@/app/utils/sessionStorage";

function InfoDesServices() {
    const [organisme, setOrganisme] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [hider, setHider] = useState(false);
    const router = useRouter();

    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState("");

    // ========================
    // GET ORGANISMES + COUNT
    // ========================
    async function getOrganisme() {
        setLoading(true);

        try {
            const token = getSessionItemOrEmpty("token");

            // 1. récupérer organismes
            const res = await fetch("/api/Montfermeil/organisation/label/all", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const json = await res.json();

            // 2. ajouter nombre de fichiers pour chaque organisme
            const enriched = await Promise.all(
                json.map(async (org: any) => {
                    try {
                        const resCount = await fetch(
                            `/api/Montfermeil/organisation/files/number/${org.id}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            }
                        );

                        const data = await resCount.json();

                        const count =
                            typeof data === "number"
                                ? data
                                : data.count ?? data.nombre ?? 0;

                        return {
                            ...org,
                            nombreFichiers: count
                        };
                    } catch (e) {
                        console.log("Erreur count org:", org.id, e);

                        return {
                            ...org,
                            nombreFichiers: 0
                        };
                    }
                })
            );

            setOrganisme(enriched);

            console.log("Organismes final :", enriched);
        } catch (ex) {
            console.log(ex);
        } finally {
            setLoading(false);
        }
    }

    // ========================
    // UPLOAD FILE
    // ========================
    async function uploadFile() {
        setLoading(true);

        if (!file) {
            alert("Choisis un fichier");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("nom", fileName || file.name);
        formData.append("organisme", String(getSessionItemOrEmpty("organisme")) || "");

        try {
            const token = getSessionItemOrEmpty("token");

            const res = await fetch("/api/Montfermeil/download/new", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            const json = await res.json();

            console.log(json);

            alert("Ajout effectué avec succès");

            router.push("/");
            setHider(false);

            // refresh list
            getOrganisme();

        } catch (ex) {
            console.log(ex);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getOrganisme();
    }, []);

    // ========================
    // LOADING UI
    // ========================
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
                <p style={{ marginTop: "20px" }}>
                    Chargement...
                </p>
            </div>
        );
    }

    // ========================
    // UI
    // ========================
    return (
        <div className="organisme-page">
            <section className="organisme-panel">

                <div className="organisme-header">
                    <div>
                        <h2>Organismes & services</h2>
                        <p>Consultez les organismes disponibles.</p>
                    </div>

                    <button className="toggle-btn" onClick={() => setHider(!hider)}>
                        {hider ? "Masquer" : "Ajouter"}
                    </button>
                </div>
                <div className="table-wrapper">
                    <table className="table-salaries">

                        {/* FORM */}
                        <tbody hidden={!hider}>
                            <tr>
                                <td>
                                    <input
                                        className="file-input"
                                        type="file"
                                        onChange={(e) => {
                                            const f = e.target.files;
                                            if (f && f.length > 0) {
                                                setFile(f[0]);
                                                setFileName(f[0].name);
                                            }
                                        }}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <button  className="submit-btn" onClick={uploadFile}>
                                        Envoyer
                                    </button>
                                </td>
                            </tr>
                        </tbody>

                        {/* LIST */}
                        <tbody hidden={hider}>
                            {organisme.map((value, index) => (
                                <tr key={index}>
                                    <td>
                                        <button
                                           className="organisme-link"
                                            onClick={() =>
                                                router.push(
                                                    `/Annuaire/Organisme/info-des-services/${value.id}`
                                                )
                                            }
                                        >
                                            {value.label}
                                        </button>
                                    </td>

                                    <td>
                                        {value.nombreFichiers} fichier(s)
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

export default InfoDesServices;