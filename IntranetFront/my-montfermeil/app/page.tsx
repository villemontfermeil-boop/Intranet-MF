'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "@/app/home.css";
import { getSessionBoolean, getSessionItemOrEmpty } from "@/app/utils/sessionStorage";

function HomePage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true); // État de chargement
    const [error, setError] = useState<string | null>(null); // État d'erreur
    const router = useRouter();

    const prefix = process.env.NEXT_PUBLIC_PREFIX ?? "";
    const normalizedPrefix = prefix ? (prefix.endsWith("/") ? prefix : `${prefix}/`) : "";

    const isVideo = (fileName: string) => {
        const videoExtensions = ["mp4", "webm", "ogg"];
        const parts = fileName.split(".");
        const extension = parts.pop()?.toLowerCase();
        return videoExtensions.includes(extension || "");
    };

    const Awidth = "40%"
    const isImage = (fileName: string) => {
        const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
        const parts = fileName.split(".");
        const extension = parts.pop()?.toLowerCase();
        return imageExtensions.includes(extension || "");
    };

    async function getArticle() {
        try {
            setLoading(true); // Début du chargement
            setError(null); // Réinitialise l'erreur

            const response = await fetch("/api/Montfermeil/articles/", {
                headers: {
                    'Authorization': `Bearer ${getSessionItemOrEmpty('token')}`
                }
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const json = await response.json();
            console.log(json); // Vérifie le JSON reçu

            // Normalise la réponse en tableau pour éviter "data.map is not a function"
            let articles: any[] = [];
            if (Array.isArray(json)) {
                articles = json;
            } else if (json && typeof json === "object") {
                if (Array.isArray(json.data)) {
                    articles = json.data;
                } else if (Array.isArray((json as any).articles)) {
                    articles = (json as any).articles;
                } else if (Array.isArray((json as any)._embedded?.articles)) {
                    articles = (json as any)._embedded.articles;
                } else if (json && (json.titre || json.title || json.id || json.mediaName)) {
                    // L'API a renvoyé un seul objet article — le transformer en tableau
                    articles = [json as any];
                } else {
                    console.warn("API returned an object but no articles array found, defaulting to empty array", json);
                }
            } else {
                console.warn("API returned non-object/non-array response", json);
            }

            setData(articles);
        } catch (error) {
            console.error("Erreur lors du chargement des articles:", error);
            setError("Impossible de charger les articles. Veuillez réessayer et pensez à rafraichir la page.");
        } finally {
            setLoading(false); // Fin du chargement (succès ou erreur)
        }
    }

    async function deleteArticle(Articleid: string) {
        setLoading(true)
        const nom = getSessionItemOrEmpty("nom");
        const prenom = getSessionItemOrEmpty("prenom");
        const body = new URLSearchParams({ nom, Prenom: prenom });
        const token = getSessionItemOrEmpty("token");
        console.log("nom", nom)
        console.log("id", Articleid)
        try {
            const reponse = await fetch(`/api/Montfermeil/articles/delete/${Articleid}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization :  `Bearer ${token}`,

                },

                body: body.toString()
            })
            if (reponse.ok) {
                setLoading(false)

                alert("suprression éffectuer: " + reponse);
                console.log(reponse)
                router.refresh()
            }
        } catch (ex) {
            console.log(ex)
            setLoading(false)

        }
    }


    useEffect(() => {
        getArticle();
    }, []);

    // 🔹 AFFICHAGE DU LOADER PENDANT LE CHARGEMENT
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
                <p style={{ marginTop: "20px", fontSize: "18px", color: "#666" }}>
                    Chargement des actualités...
                </p>

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

    // 🔹 AFFICHAGE EN CAS D'ERREUR
    if (error) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                flexDirection: "column",
                textAlign: "center"
            }}>
                <p style={{ fontSize: "18px", color: "red", marginBottom: "20px" }}>
                    ❌ {error}
                </p>
                <button
                    onClick={() => getArticle()}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#3498db",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "16px"
                    }}
                >
                    Réessayer
                </button>
            </div>
        );
    }

    // 🔹 AFFICHAGE SI AUCUN ARTICLE
    if (data.length === 0) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "50vh"
            }}>
                <p style={{ fontSize: "18px", color: "#666" }}>
                    Aucun article disponible pour le moment.
                </p>
            </div>
        );
    }

    // 🔹 AFFICHAGE NORMAL DES ARTICLES
    return (
        <>

            <h1 className="title">
                <u>Bienvenue sur l'intranet de la ville de montfermeil 2.0</u>
            </h1>

            <div className="articles-container" style={{ alignItems: "center" }}>
                {data.map((value, index) => (
                    <div key={index} style={
                        value.type == "Évennement" ? {


                            border: "2px solid #3498db",
                            borderRadius: "12px",
                            padding: "25px",
                            marginTop: "5%",
                            textAlign: "center",
                            backgroundColor: "#fff8f8",
                            boxShadow: "0 6px 18px rgba(196, 30, 58, 0.15)",
                            borderTop: "6px solid #3c1ec4",
                            position: "relative",
                            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                            width: Awidth,




                        }
                            : value.type == "Important" ? {
                                border: "4px solid #e74c3c",
                                borderRadius: "12px",
                                padding: "25px",
                                marginTop: "5%",
                                textAlign: "center",
                                backgroundColor: "#fef5f5",
                                boxShadow: "0 8px 25px rgba(231, 76, 60, 0.3)",
                                borderLeft: "8px solid #c0392b",
                                borderRight: "4px solid #e74c3c",
                                animation: "pulseImportant 2s infinite",
                                transform: "scale(1.02)",
                                position: "relative",
                                zIndex: 1,
                                width: Awidth

                            }
                                : value.type == "Annonce" ? {
                                    border: "3px solid #27ae60",
                                    borderRadius: "12px",
                                    padding: "25px",
                                    marginTop: "5%",
                                    textAlign: "center",
                                    backgroundColor: "#f0fff4",
                                    boxShadow: "0 8px 20px rgba(39, 174, 96, 0.2)",
                                    borderLeft: "6px solid #229954",
                                    transition: "transform 0.3s ease",
                                    width: Awidth

                                }
                                    : value.type == "Message" ? {
                                        border: "3px solid #f39c12",
                                        borderRadius: "12px",
                                        padding: "25px",
                                        marginTop: "5%",
                                        textAlign: "center",
                                        backgroundColor: "#fff4e6",
                                        boxShadow: "0 8px 20px rgba(243, 156, 18, 0.2)",
                                        borderLeft: "6px solid #e67e22",
                                        borderBottom: "3px solid #f39c12",
                                        width: Awidth

                                    }
                                        : value.type == "Non_défini" ? {
                                            border: "2px solid #95a5a6",
                                            borderRadius: "10px",
                                            padding: "20px",
                                            marginTop: "5%",
                                            textAlign: "center",
                                            backgroundColor: "#f8f9fa",
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                                            borderLeft: "4px solid #7f8c8d",
                                            opacity: 0.9,
                                            width: Awidth

                                        }
                                            : {
                                                border: "2px solid #bdc3c7",
                                                borderRadius: "8px",
                                                padding: "18px",
                                                marginTop: "5%",
                                                textAlign: "center",
                                                backgroundColor: "#ffffff",
                                                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                                                borderLeft: "4px solid #95a5a6",
                                                width: Awidth

                                            }
                    }>
                        {getSessionBoolean("isConnected") && getSessionItemOrEmpty("fonction") === "COMMUNICATION" ? <button onClick={() => deleteArticle(value.id.toString())} style={{ width: "50px", height: "40px" }}>
                            <img src="/cross.png" alt="" style={{ width: "30px", height: "30px" }} />

                        </button> : ""

                        }
                        <h4><u>{value.titre}</u></h4>
                        <p>Créé le : {value.creation}</p>

                        {getSessionBoolean("isConnected") ? (
                            <div>

                                <p>
                                    Par: <u>
                                        <a className="author-link" onClick={() => router.push(`/Annuaire/Salarie/${value.salarie.id}`)}>
                                            {value.salarie.nom} {value.salarie.prenom}
                                        </a>
                                    </u>
                                </p>

                            </div>
                        ) : (
                            <p>Par: {value.salarie.nom} {value.salarie.prenom}</p>
                        )}

                        <p>{value.description}</p>

                        {value.mediaName && isVideo(value.mediaName) && (
                            <video controls className="media">
                                <source src={`${normalizedPrefix}${value.mediaName}`} />
                                Votre navigateur ne supporte pas la vidéo.
                            </video>
                        )}

                        {value.mediaName && isImage(value.mediaName) && (
                            <img
                                src={`${normalizedPrefix}${value.mediaName}`}
                                alt={value.description}
                                className="media"
                                onError={(e) => {
                                    console.log(`Erreur chargement image: ${value.mediaName}`);
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        )}
                    </div>
                ))}
            </div>
            <div className="legend-container" style={{
                backgroundColor: "#f8f9fa",
                borderRadius: "12px",
                padding: "20px",
                margin: "20px auto",
                maxWidth: "900px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                border: "1px solid #e0e0e0"
            }}>
                <h3 style={{
                    textAlign: "center",
                    marginBottom: "20px",
                    color: "#2c3e50",
                    fontSize: "1.3em",
                    fontWeight: "bold",
                    borderBottom: "2px solid #3498db",
                    paddingBottom: "10px"
                }}>
                    📋 Légende des articles
                </h3>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "15px"
                }}>
                    {/* Important */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px",
                        backgroundColor: "#fff5f5",
                        borderRadius: "8px",
                        border: "1px solid #e74c3c"
                    }}>
                        <div style={{
                            width: "30px",
                            height: "30px",
                            backgroundColor: "#e74c3c",
                            borderRadius: "6px",
                            boxShadow: "0 2px 5px rgba(231, 76, 60, 0.3)"
                        }}></div>
                        <div>
                            <strong style={{ color: "#c0392b" }}>Important</strong>
                            <p style={{ margin: 0, fontSize: "0.85em", color: "#666" }}>
                                ⚠️ Information prioritaire
                            </p>
                        </div>
                    </div>



                    {/* Événement */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px",
                        backgroundColor: "#eef7ff",
                        borderRadius: "8px",
                        border: "1px solid #3498db"
                    }}>
                        <div style={{
                            width: "30px",
                            height: "30px",
                            backgroundColor: "#3498db",
                            borderRadius: "6px",
                            boxShadow: "0 2px 5px rgba(52, 152, 219, 0.3)"
                        }}></div>
                        <div>
                            <strong style={{ color: "#2980b9" }}>Événement</strong>
                            <p style={{ margin: 0, fontSize: "0.85em", color: "#666" }}>
                                📅 Date à retenir
                            </p>
                        </div>
                    </div>

                    {/* Annonce */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px",
                        backgroundColor: "#f0fff4",
                        borderRadius: "8px",
                        border: "1px solid #27ae60"
                    }}>
                        <div style={{
                            width: "30px",
                            height: "30px",
                            backgroundColor: "#27ae60",
                            borderRadius: "6px",
                            boxShadow: "0 2px 5px rgba(39, 174, 96, 0.3)"
                        }}></div>
                        <div>
                            <strong style={{ color: "#229954" }}>Annonce</strong>
                            <p style={{ margin: 0, fontSize: "0.85em", color: "#666" }}>
                                📢 Information générale
                            </p>
                        </div>
                    </div>

                    {/* Message */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px",
                        backgroundColor: "#fff4e6",
                        borderRadius: "8px",
                        border: "1px solid #f39c12"
                    }}>
                        <div style={{
                            width: "30px",
                            height: "30px",
                            backgroundColor: "#f39c12",
                            borderRadius: "6px",
                            boxShadow: "0 2px 5px rgba(243, 156, 18, 0.3)"
                        }}></div>
                        <div>
                            <strong style={{ color: "#e67e22" }}>Message</strong>
                            <p style={{ margin: 0, fontSize: "0.85em", color: "#666" }}>
                                💬 Communication interne
                            </p>
                        </div>
                    </div>

                    {/* Information */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px",
                        backgroundColor: "#f0e6ff",
                        borderRadius: "8px",
                        border: "1px solid #9b59b6",
                        boxShadow: "0 2px 8px rgba(155, 89, 182, 0.15)",
                        borderLeft: "1px solid #8e44ad"
                    }}>
                        <div style={{
                            width: "30px",
                            height: "30px",
                            backgroundColor: "#9b59b6",
                            borderRadius: "6px",
                            boxShadow: "0 2px 5px rgba(155, 89, 182, 0.3)"
                        }}></div>
                        <div>
                            <strong style={{ color: "#8e44ad", fontSize: "1.1em" }}>Information</strong>
                            <p style={{ margin: 0, fontSize: "0.85em", color: "#666" }}>
                                ℹ️ Information générale
                            </p>
                        </div>
                    </div>

                    {/* Non défini */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "8px",
                        border: "1px solid #95a5a6"
                    }}>
                        <div style={{
                            width: "30px",
                            height: "30px",
                            backgroundColor: "#95a5a6",
                            borderRadius: "6px",
                            boxShadow: "0 2px 5px rgba(149, 165, 166, 0.3)"
                        }}></div>
                        <div>
                            <strong style={{ color: "#7f8c8d" }}>Non défini</strong>
                            <p style={{ margin: 0, fontSize: "0.85em", color: "#666" }}>
                                ⚪ Type non spécifié
                            </p>
                        </div>
                    </div>
                </div>

                {/* Note supplémentaire */}
                <div style={{
                    marginTop: "20px",
                    padding: "10px",
                    backgroundColor: "#e8f4fd",
                    borderRadius: "8px",
                    borderLeft: "4px solid #3498db",
                    fontSize: "0.9em",
                    color: "#2c3e50"
                }}>
                    <span style={{ fontWeight: "bold" }}>ℹ️ Note :</span> Les articles importants et urgents sont mis en avant avec des animations pour attirer votre attention.
                </div>
            </div>

            {/* Animation pour l'urgent */}
            <style jsx>{`
    @keyframes pulseLegend {
        0% { opacity: 1; }
        50% { opacity: 0.6; transform: scale(0.95); }
        100% { opacity: 1; transform: scale(1); }
    }
`}
            </style>
        </>
    );
}

export default HomePage;