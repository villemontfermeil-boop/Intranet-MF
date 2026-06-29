'use client'
import { useParams } from "next/navigation";
import { getSessionBoolean, getSessionItemOrEmpty } from "@/app/utils/sessionStorage";
import { useEffect, useState } from "react";
import "./style.css"




function unArticle() {
    const params = useParams();
    const [data, setData] = useState<any>({})
    const id = params.id
    const [loading, setLoading] = useState(false);

    const prefix = process.env.NEXT_PUBLIC_PREFIX ?? "";
    const normalizedPrefix = prefix ? (prefix.endsWith("/") ? prefix : `${prefix}/`) : "";
    const isVideo = (fileName: string) => {
        const videoExtensions = ["mp4", "webm", "ogg"];
        const extension = fileName.split(".").pop()?.toLowerCase();
        return videoExtensions.includes(extension || "");
    };

    const isImage = (fileName: string) => {
        const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
        const extension = fileName.split(".").pop()?.toLowerCase();
        return imageExtensions.includes(extension || "");
    };

    async function getArticleById() {
        setLoading(true)

        const token = getSessionItemOrEmpty("token");

        try {
            const article = await fetch(`/api/Montfermeil/articles/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            const json = await article.json();

            console.log(json)
            setData(json);
            setLoading(false)

        } catch (ex) {
            console.log("une érreur est survenue")
            setLoading(false)

        }
    }


    useEffect(() => {
        getArticleById()
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
                    Chargement de l'article...
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
        <div style={{ textAlign: "center" }}>
            <u> <h1>{data.titre}</h1></u>
            <table>
                <tbody>

                    <tr>
                        <td colSpan={2}>
                            <b><p>Créer par <a className="author-link" target="blank" href={`/Annuaire/Salarie/${data.salarie?.id}`}>{data.salarie?.nom} {data.salarie?.prenom}</a> le {data.creation}</p></b>

                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}>

                            {data.mediaName && isVideo(data.mediaName) && (
                                <video controls className="mediaa">
                                    <source src={`${normalizedPrefix}${data.mediaName}`} />
                                    Votre navigateur ne supporte pas la vidéo.
                                </video>
                            )}

                            {data.mediaName && isImage(data.mediaName) && (
                                <img
                                    src={`${normalizedPrefix}${data.mediaName}`}
                                    alt={data.description || "image article"}
                                    className="mediaa"
                                />
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            <p>{data.description}</p>
                        </td>
                    </tr>
                </tbody>

            </table>
        </div>
    )
}

export default unArticle;