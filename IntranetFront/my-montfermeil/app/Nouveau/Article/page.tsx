'use client';

import { useEffect, useState } from "react";
import "@/app/Nouveau/Article/style.css";
import { useRouter } from "next/navigation";

function CreationArticle() {
    const path = process.env.UPLOAD;

    const [file, SetFile] = useState<File | null>();
    const [submit, SetisSubmit] = useState(false);
    const [result, SetResult] = useState([])
    const router = useRouter();

    const [article, SetArticle] = useState({
        Titre: '',
        Desc: '',
        Types: 'Non_défini',
        Media: file,
        MediaNom: file?.name
    })

    useEffect(() => {

        if (sessionStorage.length == 0 || sessionStorage.getItem('fonction') != "COMMUNICATION") {
            router.push('/');
        }
    })

    async function HandleSubmit() {
        try {
            const token = sessionStorage.getItem('token') || ''

            const formData = new FormData();


            formData.append('description', article.Desc);
            formData.append('titre', article.Titre);
            formData.append('type', article.Types);

            const salarieId = sessionStorage.getItem('id');
            if (salarieId) {
                formData.append('salarieId', salarieId);
            } else {
                return alert("aucun ID")
            }


            if (article.Media) {
                formData.append('file', article.Media);
            }






            const reponse = await fetch("/api/Montfermeil/articles/upload", {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`
                },

                body: formData
            })
            // SetResult(await reponse.json());
            alert("Votre Article a été ajouter")
            // console.log(await reponse.text())
            SetisSubmit(false)
            router.push('/')

        } catch (error) {
            console.log(error)
            console.log(article)

        }

    }
    const handleChange = (e: any) => {
        const { name, value, type, files } = e.target;

        if (type === 'file' && files && files.length > 0) {
            SetArticle(prev => ({
                ...prev,
                Media: files[0],
                MediaNom: files[0].name
            }));
        } else {
            SetArticle(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };



    const handleChangeTextArea = (e: any) => {
        SetArticle({ ...article, [e.target.name]: e.target.value });
    };

    useEffect(() => {

        if (submit) {
            HandleSubmit();
        }
    }, [submit])
    return (

        <div style={{ placeItems: "center" }}>
            {
                sessionStorage.length == 0 || sessionStorage.getItem('fonction') == "COMMUNICATION" ?
                    <div>
                        <h1><u>Bienvenue dans la création d'un article</u></h1>
                        <p style={{ textAlign: "center" }}>Notes: il est préférable pour les media que vous allez ajouter, <br />qu'il soit en extension (Images :"jpg", "jpeg", "png", "gif","webp"; Video : "mp4", "webm", "ogg";)</p>

                        <table border={1} style={{ borderColor: "blue", borderRadius: "15px" }}>
                            <thead >
                                <tr>
                                    <th>
                                        <p>Le titre de votre article:</p>
                                    </th>
                                    <td>
                                        <input onChange={handleChange} type="text" name="Titre" id="" />
                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                        <p>La description ou les détails de votre article:</p>
                                    </th>
                                    <td>
                                        <textarea onChange={handleChangeTextArea} name="Desc" style={{ width: "98%", height: "100%" }} />
                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                        <p>Types d'évennement:</p>
                                    </th>
                                    <td>
                                        <select onChange={handleChange} name="Types" >
                                            <option value="Non_defini">Non défini</option>
                                            <option value="Message">Message</option>
                                            {/* <option value="ANNONCE">Annonce</option> */}
                                            <option value="Évennement">Évènement</option>
                                            <option value="Information">Information</option>
                                            <option value="Important">Important</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                        <p>Une image ou une video: </p>
                                    </th>
                                    <td>
                                        <input onChange={handleChange} accept="image/*,video/*" type="file" name="Media" id="" />
                                    </td>

                                </tr>
                                <tr>
                                    <td colSpan={2}>
                                        <input type="submit" value="Envoyer" style={{ width: "100%", borderRadius: "15px" }} onClick={() => SetisSubmit(true)} />
                                    </td>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    : <div>
                        <h1>Interdit</h1>
                    </div>}
        </div>
    )
}
export default CreationArticle;