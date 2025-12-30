'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "@/app/home.css";

function HomePage() {
    const [data, setData] = useState<any[]>([]);
    const path = "http://localhost:8080/media/";
    const router = useRouter();

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
            const response = await fetch("http://localhost:8080/Article/getArticle");
            const json = await response.json();
            console.log(json); // Vérifie le JSON reçu
            setData(json);
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
                                <source src={`${path}${value.mediaName}`} />
                            </video>
                        )}

                        {value.mediaName && isImage(value.mediaName) && (
                            <img
                                src={`${path}${value.mediaName}`}
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
