'use client';

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import "@/app/Annuaire/Organisme/[id]/style.css";

function getOrganisme() {
    const params = useParams();
    const id = params.id;

    const [organisme, setOrganisme] = useState<any>(null);
    const [salaries, setSalaries] = useState<any[]>([]);
    const [photos, setPhotos] = useState<{ [key: string]: string }>({});
    const [api, setApi] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const token = typeof window !== "undefined"
        ? sessionStorage.getItem("token")
        : null;

    // 🔹 BACKEND
    async function getBackend() {
        const res = await fetch(`/api/Montfermeil/connexion`, {
            headers: { authorization: token || "" }
        });

        const data = await res.json();
        setApi(data);
    }

    // 🔹 ORGANISME
    async function findOrganismeById() {
        const res = await fetch(`/api/Montfermeil/organisation/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const json = await res.json();
        setOrganisme(json);
    }

    // 🔹 SALARIES
    async function findSalaries() {
        const res = await fetch(`/api/Montfermeil/organisation/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const json = await res.json();
        setSalaries(json);
        return json;
    }

    // 🔹 PHOTOS
    async function fetchPhotos(users: any[]) {
        const results: any = {};

        await Promise.all(
            users.map(async (user) => {
                try {
                    const res = await fetch(
                        `/api/Montfermeil/users/Photo/${user.id}`,
                        {
                            headers: { Authorization: `Bearer ${token}` }
                        }
                    );

                    if (!res.ok) {
                        results[user.id] = null;
                        return;
                    }

                    const data = await res.json();

                    results[user.id] = data.photo
                        ? `${data.path}/${data.photo}`
                        : null;

                } catch {
                    results[user.id] = null;
                }
            })
        );

        setPhotos(results);
    }

    // 🔥 INIT PROPRE
    useEffect(() => {
        if (!id || !token) return;

        const init = async () => {
            try {
                setLoading(true);

                await getBackend();
                await findOrganismeById();

                const users = await findSalaries();
                await fetchPhotos(users);

            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        init();
    }, [id, token]);

    // 🔄 LOADING
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
                <p>Chargement...</p>
            </div>
        );
    }

    return (
        <div className="Main">
            <h1><u>{organisme?.label}</u></h1>

            <table className="theTable">
                <tbody>
                    <tr>
                        <td>
                            <a
                                href={`https://www.google.com/search?q=${organisme?.adresse}`}
                                target="_blank"
                            >
                                <b>{organisme?.adresse}</b>
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <a href={`tel:${organisme?.telephone}`}>
                                {organisme?.telephone}
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div className="table-container">
                <table className="table-salaries">
                    <thead>
                        <tr>
                            <th>Profil</th>
                            <th>Prénom</th>
                            <th>Email</th>
                            <th>Téléphone</th>
                        </tr>
                    </thead>

                    <tbody>
                        {salaries.map((user) => (
                            <tr key={user.id}>
                                <td>
                                    <img
                                        src={
                                            photos[user.id]
                                                ? `${api?.api}/${photos[user.id]}`
                                                : "/cerclePhoto.png"
                                        }
                                        width="50"
                                    />
                                </td>

                                <td>
                                    <a style={{color: "blue"}} href={`/Annuaire/Salarie/${user.id}`}>
                                        {user.prenom} {user.nom}
                                    </a>
                                </td>

                                <td>
                                    <a style={{color: "blue"}} href={`mailto:${user.mail}`}>
                                        {user.mail}
                                    </a>
                                </td>

                                <td>
                                    <a style={{color: "blue"}} href={`tel:${user.telephonepro}`}>
                                        {user.telephonepro}
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default getOrganisme;