'use client';

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import "@/app/Annuaire/Organisme/[id]/style.css";


function getOrganisme() {
    const params = useParams();
    const [organisme, setOrganisme] = useState<any>({});
    const [salaries, setSalaries] = useState<any[]>([]);
    const [photos, setPhotos] = useState<{ [key: string]: string }>({});
    const [chargement1, setChargement1] = useState<boolean>(false);
    const [chargement2, setChargement2] = useState<boolean>(false);
    const [chargement3, setChargement3] = useState<boolean>(false);
    const [api, setApi] = useState<any>({});
    const [loading, setLoading] = useState(true); // État de chargement

    const id = params.id
    const idValue = id ?
        (Array.isArray(id) ? id[0] : id) :
        '';

    async function findOrganismeById() {

        try {
            const api = await fetch(`/api/Montfermeil/organisation/${id}`);

            const json = await api.json();
            console.log(json);
            setOrganisme(json);
            setChargement1(true);
        } catch (ex) {
            console.log(ex);
        }

    }

    async function findOrganismeByIdAndSalarie() {

        try {
            const api = await fetch(`/api/Montfermeil/organisation/users/${id}`);

            const json = await api.json();
            console.log(json);
            setSalaries(json);
            setChargement2(true);

        } catch (ex) {
            console.log(ex);
        }

    }
    async function fetchPhotos() {
        try {
            const results: any = {};

            await Promise.all(
                salaries.map(async (user) => {
                    const res = await fetch(`/api/Montfermeil/users/Photo/${user.id}`);
                    const data = await res.json();

                    console.log("DATA PHOTO :", data);

                    results[user.id] = data.photo
                        ? `${data.path}/${data.photo}`
                        : null;
                })
            );

            console.log("PHOTOS FINAL :", results);

            setPhotos(results);
            setChargement3(true);

        } catch (err) {
            console.log(err);
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


            setApi(data);
            setChargement3(true);

        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        if (salaries.length > 0) {
            fetchPhotos();
        }
    }, [salaries]);
    useEffect(() => {
        getBackend();

        findOrganismeById();
        findOrganismeByIdAndSalarie();

    }, [])

    useEffect(() => {

        if (chargement1 && chargement2 && chargement3) {
            setLoading(false)
        }

    }, [chargement1, chargement2, chargement3])


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
                    Chargement de l'organisme..
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


    console.log("API ACTUELEMEEEEEEEE: "+ Object.entries(api))
    return (
        <div className="Main">
            <h1><u>{organisme?.label}</u></h1>

            {/* TABLE INFOS ORGANISME */}
            <table className="theTable">
                <tbody>
                    <tr>
                        <td><a href={`https://www.google.com/search?q=${organisme?.adresse}`} target="blank"><b>{organisme?.adresse}</b></a></td>
                    </tr>
                    <tr>
                        <td><a href={`tel:${organisme?.telephone}`}>{organisme?.telephone}</a></td>
                    </tr>
                </tbody>
            </table>

            {/* TABLE SCROLLABLE */}
            <div className="table-container">
                <table className="table-salaries">
                    <thead>
                        <tr>
                            <th>Profil</th>
                            <th>Prénom</th>
                            <th>Email</th>
                            <th>Téléphone professionnel</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salaries.map((value, index) => (
                            <tr key={index} >

                                <td>
                                    {photos[value.id] ? (
                                        <img
                                            src={`${api.api}/${photos[value.id]}`}
                                            alt="photo"
                                            width="50"
                                        />
                                    ) : (
                                        <img src="/cerclePhoto.png" width="50" />
                                    )}
                                </td>

                                <td><a href={`/Annuaire/Salarie/${value.id}`}>{value.prenom} {value.nom}</a></td>
                                <td><a href={`mailto:${value.mail}`}>{value.mail}</a></td>
                                <td><a href={`tel:${value.telephonepro}`}>{value.telephonepro}</a></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default getOrganisme;