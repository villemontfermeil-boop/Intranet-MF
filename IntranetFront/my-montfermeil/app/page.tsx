'use client';

import { useEffect, useState } from "react";

function HomePage() {
    const [data, setData] = useState<any[]>([]);

    const isVideo = (fileName: string) => {
        const videoExtensions = ["mp4", "webm", "ogg"];
        const parts = fileName.split(".");
        const extension = parts.pop()?.toLowerCase();
        return videoExtensions.includes(extension || "");
    };

    const isImage = (fileName: string) => {
        const imageExtensions = ["jpg", "jpeg", "png", "gif"];
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
            <h1 style={{ textAlign: "center" }}>
                <u>Bienvenue sur l'intranet de la ville de montfermeil 2.0</u>
            </h1>

            <div>
                {data.map((value, index) => (
                    <div key={index}>
                        <h4><u>{value.titre}</u></h4>
                        <span>{value.creation}</span>
                        <p>{value.description}</p>

                        {value.mediaName && isVideo(value.mediaName) && (
                            <video controls width="400">
                                <source src={`http://localhost:8080/media/${value.mediaName}`} />
                            </video>
                        )}

                        {value.mediaName && isImage(value.mediaName) && (
                            <img
                                src={`http://localhost:8080/media/${value.mediaName}`}
                                alt={value.description}
                                width="400"
                            />
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}

export default HomePage;
