
'use client'
import { useEffect, useState } from "react";
import "@/app/Annuaire/Recommander/style.css";
import { useRouter } from "next/navigation";

type RecommanderType = {
    recommander: string;
    date: string;
    services: string;
}
function pageRecommander() {

    const [recommander, setRecommander] = useState<any[]>([]);
    const [loading, setLoading] = useState(true); // État de chargement
    const [text, setText] = useState("");
    const [numero, setnumero] = useState("");
    const [cacher, setCacher] = useState<boolean>(false);
    const formData = new FormData();
    const routeur = useRouter()
    const [exportButton, setExport] = useState<boolean>(false);
    const [data2, setData2] = useState<any>([]);
    const [recommanderNew, setRecommanderNew] = useState<RecommanderType>({
        recommander: "",
        date: "",
        services: ""
    });




    useEffect(() => {
        if (sessionStorage.length == 0 || sessionStorage.length == null || sessionStorage.getItem("fonction") != "COURRIER") {
            alert("Vous devez etre de ce service pour pouvoir y accéder")
            routeur.push('/')
        }
    }, [])
    async function getRecommander() {
        const token = sessionStorage.getItem("token") || "";
        setLoading(true);

        try {
            const data = await fetch("/api/Montfermeil/recommend/all", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const json = await data.json();
            setRecommander(json);
            setLoading(false);
        } catch (ex) {
            console.log(ex)
            setLoading(false);

        }
    }


    async function getRecommanderInExcel() {
        const token = sessionStorage.getItem("token") || "";
        setLoading(true);

        try {

            const data = await fetch(`/api/Montfermeil/recommend/export`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!data.ok) {
                throw new Error("Erreur export");
            }

            const blob = await data.blob();

            const downloadUrl = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = "export.xlsx";

            document.body.appendChild(a);
            a.click();
            a.remove();

            window.URL.revokeObjectURL(downloadUrl);
            setLoading(false);

        } catch (ex) {
            console.log(ex)
            setLoading(false);


        }
    }


    async function getRecommanderByName(nom: string) {
        const token = sessionStorage.getItem("token") || "";
        setLoading(true);

        try {

            const data = await fetch(`/api/Montfermeil/recommend/${nom}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const json = await data.json();
            setRecommander(json);
            setLoading(false);

        } catch (ex) {
            console.log(ex)
            setLoading(false);


        }
    }


    async function nouveauxRecommander() {
        const token = sessionStorage.getItem("token") || "";
        setLoading(true);


        try {
            formData.append("Recommander", recommanderNew.recommander);
            formData.append("date", recommanderNew.date);
            formData.append("services", recommanderNew.services);


            const data = await fetch("/api/Montfermeil/recommend/new", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            const json = await data.json();
            setRecommander(json);
            setLoading(false);
            setCacher(false)
            alert("Ajout éffectuer avec succès")
            window.location.reload();

            // routeur.refresh()
        } catch (ex) {
            console.log(ex)
            setLoading(false);


        }
    }

    useEffect(() => {

        const timer = setTimeout(() => {

            const loadData = async () => {
                setLoading(true);

                if (text.trim() === "") {
                    await getRecommander();
                } else {
                    await getRecommanderByName(text);
                }
            };

            loadData();
        }, 500);

        return () => clearTimeout(timer);
    }, [text]);

    useEffect(() => {
        if (exportButton) {
            getRecommanderInExcel()
        }
        setExport(false)

    }, [exportButton]);


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

                {text == "" ? <p style={{ marginTop: "20px", fontSize: "18px", color: "#666" }}> Chargement de l'organisme.. </p> : <p style={{ marginTop: "20px", fontSize: "18px", color: "#666" }}> Chargement du recommander</p>}

                <style jsx>{`
                    .spinner {
                        border: 4px solid rgba(0, 0, 0, 0.1);
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                        border-left-color: #3498db;
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
            <h1 className="page-title">Recommandations Courrier</h1>
            <button onClick={() => cacher == false ? setCacher(true) : setCacher(false)}>
                {cacher ? "Annuler" : "Ajouter un recommander"}
            </button>
            <button onClick={() => exportButton == false ? setExport(true) : setExport(false)}>
                Exporter en Excel
            </button>

            <div className="table-container" hidden={cacher}>
                {/* <div className="action-buttons">
               
                </div> */}

                <div className="search-container">
                    <input
                        placeholder="🔍 Rechercher par n° ou mot-clé..."
                        type="text"
                        onChange={(e) => setnumero(e.target.value)}
                    />
                    <button type="submit" onClick={() => setText(numero)}>Chercher</button>
                </div>

                <table className="table-salaries" style={{ textAlign: "center" }}>
                    <tbody>
                        <tr>
                            <th>
                                Date
                            </th>
                            <th>
                                n° de recommandé
                            </th>
                            <th>
                                Services
                            </th>
                        </tr>

                        {Array.isArray(recommander) && recommander?.map((value, index) => (
                            <tr key={index}>
                                <td>
                                    {new Date(value.date).toLocaleDateString("fr-FR", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric"
                                    })}
                                </td>
                                <td>
                                    {value.recommande}

                                </td>
                                <td>
                                    {value.service}

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="table-container form-container" hidden={cacher == true ? false : true}>
                <h2 style={{ color: "#2c3e50", marginBottom: "25px" }}>Ajouter une nouvelle recommandation</h2>
                <table>
                    <tbody>
                        <tr>
                            <th style={{ textAlign: "left", color: "#667eea", fontWeight: "600" }}>Date</th>
                            <th style={{ textAlign: "left", color: "#667eea", fontWeight: "600" }}>Numéro Recommandé</th>
                            <th style={{ textAlign: "left", color: "#667eea", fontWeight: "600" }}>Service</th>
                        </tr>
                        <tr>
                            <td>
                                <input
                                    type="date"
                                    onChange={(e) =>
                                        setRecommanderNew({
                                            ...recommanderNew,
                                            date: e.target.value
                                        })
                                    }
                                />
                            </td>

                            <td>
                                <input
                                    type="text"
                                    placeholder="Ex: REC-001"
                                    onChange={(e) =>
                                        setRecommanderNew({
                                            ...recommanderNew,
                                            recommander: e.target.value
                                        })
                                    }
                                />
                            </td>

                            <td>
                                <input
                                    type="text"
                                    placeholder="Ex: Courrier"
                                    onChange={(e) =>
                                        setRecommanderNew({
                                            ...recommanderNew,
                                            services: e.target.value
                                        })
                                    }
                                />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={3}>
                                <button onClick={() => nouveauxRecommander()}>✓ Ajouter</button>
                            </td>
                        </tr>
                    </tbody>
                </table>

            </div>

        </div>

    )
}


export default pageRecommander;