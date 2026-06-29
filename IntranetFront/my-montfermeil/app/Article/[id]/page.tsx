'use client'
import { useParams } from "next/navigation";
import { getSessionBoolean, getSessionItemOrEmpty } from "@/app/utils/sessionStorage";
import { useEffect, useState } from "react";
import "./style.css"




function unArticle() {
    const params = useParams();
    const [data, setData] = useState<any>({})
    const id = params.id
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

        } catch (ex) {
            console.log("une érreur est survenue")
        }
    }


    useEffect(() => {
        getArticleById()
    }, [])

    return (
        <div style={{ textAlign: "center" }}>
           <u> <h1>{data.titre}</h1></u>
            <table>
                <tbody>

                    <tr>
                        <td colSpan={2}>
                            <b><p>Créer par <a target="blank" href={`/Annuaire/Salarie/${data.salarie?.id}`}>{data.salarie?.nom} {data.salarie?.prenom}</a> le {data.creation}</p></b>

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