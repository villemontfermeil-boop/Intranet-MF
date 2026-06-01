'use client';

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import "./style.css";

function SalariePage() {
    const params = useParams();
    const id = params?.id ? Number(params.id) : undefined;

    // États pour les données
    const [salarie, setSalarie] = useState<any>({});
    const [backend, setBackend] = useState<any>({});

    const [image, setImage] = useState<any>({});
    const [loading, setLoading] = useState(true); // État de chargement

    const profileImage = `${backend.api}/uploads/Photos/${image.photo}`;

    console.log("Il contient :", image);

    // Redirection si non connecté
    if (typeof window !== 'undefined' && (sessionStorage.length === 0 || sessionStorage.length == null)) {
        window.location.href = "/";
    }

    async function LookingForid(id: number) {
        const token = sessionStorage.getItem("token")
        try {
            const response = await fetch(`/api/Montfermeil/users/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log( data);
            setSalarie(data);
        } catch (error) {
            console.log("L ERRRRRRRRRRREURRRRRRRRRRRRR",error);
        }
    }

    async function getBackend() {

        const token = sessionStorage.getItem('token') || ''
        console.log(token);
        try {

            const res = await fetch(`/api/Montfermeil/connexion`,
                {
                    headers: {
                        'authorization': token
                    },
                }
            );
            const data = await res.json();

            console.log("DATA api :", data);


            setBackend(data);

        } catch (err) {
            console.log(err);
        }
    }

    async function getProfile(oneId: number) {
        try {
            const token = sessionStorage.getItem("token");
            const reponse = await fetch(`/api/Montfermeil/users/Photo/${oneId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
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
                getProfile(id),
                getBackend()
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
        <main className="profile-page">
            <section className="profile-header">
                <h1>
                    <u>
                        {salarie.nom} {salarie.prenom}
                    </u>
                </h1>
            </section>

            <div className="profile-layout">
                <aside className="photo-card">
                    <img src="/cadre.png" className="profile-frame" alt="cadre" />
                    {image.status !== 500 ? (
                        <img src={profileImage} className="profile-avatar" alt="photo profil" />
                    ) : (
                        <img className="profile-avatar" src="/cerclePhoto.png" alt="photo par défaut" />
                    )}
                </aside>

                <section className="profile-card">
                    <table className="profile-table">
                        <tbody>
                            <tr>
                                <th>Service :</th>
                                <td>{salarie.fonction}</td>
                            </tr>
                            <tr>
                                <th>Localisation :</th>
                                <td>
                                    <a className="profile-link" href={`/Annuaire/Organisme/${salarie.organigramme?.id}`}>
                                        {salarie.organigramme?.label || 'Non défini'}
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <th>Numéro :</th>
                                <td>
                                    <a className="profile-link" href={`tel:${salarie.numero}`}>
                                        {salarie.numero || 'NON_DÉFINI'}
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <th>Téléphone pro :</th>
                                <td>
                                    <a className="profile-link" href={`tel:${salarie.telephonepro || ''}`}>
                                        {salarie.telephonepro || 'NON_DÉFINI'}
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <th>Email :</th>
                                <td>
                                    <a className="profile-link" href={`mailto:${salarie.mail}`}>
                                        {salarie.mail || 'Non défini'}
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <th>Statut :</th>
                                <td>
                                    {salarie.isConnected ? (
                                        <img src="/checkbox.png" className="profile-status-icon" alt="connecté" />
                                    ) : (
                                        <img src="/cross.png" className="profile-status-icon" alt="déconnecté" />
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>
            </div>
        </main>
    );
}

export default SalariePage;