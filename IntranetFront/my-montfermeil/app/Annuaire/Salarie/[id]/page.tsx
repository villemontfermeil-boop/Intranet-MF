'use client';

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import "./style.css";

function SalariePage() {
    const params = useParams();
    const id = params?.id ? Number(params.id) : undefined;
    
    // États pour les données
    const [salarie, setSalarie] = useState<any>({});
    const [image, setImage] = useState<any>({});
    const [loading, setLoading] = useState(true); // État de chargement
    
    const profileImage = `http://localhost:8080/uploads/Photos/${image.photo}`;
    
    console.log("Il contient :", image);

    // Redirection si non connecté
    if (typeof window !== 'undefined' && (sessionStorage.length === 0 || sessionStorage.length == null)) {
        window.location.href = "/";
    }

    async function LookingForid(id: number) {
        const identifiant = sessionStorage.getItem("mail");
        const password = sessionStorage.getItem("MDP");
        const credential = btoa(`${identifiant}:${password}`);
        
        try {
            const response = await fetch(`/api/Montfermeil/users/${id}`);
            const data = await response.json();
            setSalarie(data);
        } catch (error) {
            console.log(error);
        }
    }

    async function getProfile(oneId: number) {
        try {
            const reponse = await fetch(`/api/Montfermeil/users/Photo/${oneId}`);
            const json = await reponse.json();
            setImage(json);
            console.log(json);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        if (!id || isNaN(id)) return;
        
        // Chargement des données
        const loadData = async () => {
            setLoading(true);
            await Promise.all([
                LookingForid(id),
                getProfile(id)
            ]);
            setLoading(false);
        };
        
        loadData();
    }, [id]);

    // 🔹 AFFICHAGE DU CHARGEMENT
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
                    Chargement du profil...
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
        <div>
            <div style={{ placeItems: "center" }}>
                <h1>
                    <u>
                        {salarie.nom}
                        {"   "}
                        {salarie.prenom}
                    </u>
                </h1>
                
                <div className="PhotoCLass">
                    <img src="/cadre.png" className="Conteneur" alt="cadre" />

                    {image.status !== 500 
                        ? <img src={profileImage} className="PP" alt="photo profil" />
                        : <img className="PP" src="/cerclePhoto.png" alt="photo par défaut" />
                    }
                </div>
                
                <table border={1} style={{ textAlign: "center", marginRight: "200px" }}>
                    <thead>
                        <tr>
                            <th style={{ paddingRight: "50%" }}>
                                Fonction:
                            </th>
                            <td>
                                {salarie.fonction}
                            </td>
                        </tr>
                        <tr>
                            <th style={{ paddingRight: "50%" }}>
                                Localisation:
                            </th>
                            <td>
                                {salarie.localisation}
                            </td>
                        </tr>
                        <tr>
                            <th style={{ paddingRight: "50%" }}>
                                Numero:
                            </th>
                            <td>
                                {salarie.numero}
                            </td>
                        </tr>
                        <tr>
                            <th style={{ paddingRight: "50%" }}>
                                Téléphone pro:
                            </th>
                            <td>
                                {salarie.telephonepro || 'NON_DÉFINI'}
                            </td>
                        </tr>
                        <tr>
                            <th style={{ paddingRight: "50%" }}>
                                Email:
                            </th>
                            <td>
                               <a href={`mailto:${salarie.mail}`}> {salarie.mail}</a>
                            </td>
                        </tr>
                        <tr>
                            <th style={{ paddingRight: "0%" }}>
                                Statut sur le site :
                            </th>
                            <td>
                                {salarie.isConnected ? 
                                    <img src="/checkbox.png" style={{ width: "10%" }} alt="connecté" /> : 
                                    <img src="/cross.png" style={{ width: "10%" }} alt="déconnecté" />
                                }
                            </td>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>
    );
}

export default SalariePage;