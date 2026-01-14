'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "@/app/home.css";

function HomePage() {
    const [data, setData] = useState<any[]>([]);
    
    const router = useRouter();
    
    const prefix = process.env.NEXT_PUBLIC_PREFIX ?? "";
    const normalizedPrefix = prefix ? (prefix.endsWith("/") ? prefix : `${prefix}/`) : "";
    const isVideo = (fileName: string) => {
        const videoExtensions = ["mp4", "webm", "ogg"];
        const parts = fileName.split(".");
        const extension = parts.pop()?.toLowerCase();
        return videoExtensions.includes(extension || "");
    };

    const isImage = (fileName: string) => {
        const imageExtensions = ["jpg", "jpeg", "png", "gif","webp"];
        const parts = fileName.split(".");
        const extension = parts.pop()?.toLowerCase();
        return imageExtensions.includes(extension || "");
    };

    async function getArticle() {
        try {
            const response = await fetch("/api/Montfermeil/articles/");
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
            console.log(error);
        }
    }

    useEffect(() => {
        getArticle();
    }, []);

    return (
        <>
            <h1 className="title">
                <u>Bienvenue sur l'intranet de la ville de montfermeil 2.0</u>
            </h1>

            <div className="articles-container">
                {data.map((value, index) => (
                    <div key={index} style={{ border: "3px solid #3498db", placeItems: "center", marginTop: "5%" }}>

                        <h4><u>{value.titre}</u></h4>
                        <p>Créer le : {value.creation}</p>

                        {sessionStorage.getItem("isConnected") == "true" ? <p >Par: <u><a  className="author-link" onClick={() => router.push(`/Annuaire/Salarie/${value.salarie.id}`)}>{value.salarie.nom} {value.salarie.prenom}</a></u></p> : <p>Par: {value.salarie.nom} {value.salarie.prenom}</p>}
                        <p>{value.description}</p>

                        {value.mediaName && isVideo(value.mediaName) && (
                            <video controls  className="media">
                                <source src={`${normalizedPrefix}${value.mediaName}`} />
                                <h1>{`${normalizedPrefix}${value.mediaName}`}</h1>
                            </video>
                        )}

                        {value.mediaName && isImage(value.mediaName) && (
                            <img
                                src={`${normalizedPrefix}${value.mediaName}`}
                                alt={value.description}
                               className="media"
                            />
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}

export default HomePage;
