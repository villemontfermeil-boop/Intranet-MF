'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "@/app/Annuaire/Salarie/style.css";
import { getSessionBoolean, getSessionItemOrEmpty } from "@/app/utils/sessionStorage";

function ModifierSalarie() {

    const [search, setSearch] = useState<string>("");
    const [people, setPeople] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // 🔥 fetch sécurisé
    async function fetchData(url: string, options: RequestInit = {}) {
        const token = getSessionItemOrEmpty("token");

        const res = await fetch(url, {
            ...options,
            headers: {
                Authorization: `Bearer ${token}`,
                ...(options.headers || {})
            }
        });

        if (!res.ok) return [];

        const text = await res.text();
        return text ? JSON.parse(text) : [];
    }

    async function searchAll(name: string) {
        const token = getSessionItemOrEmpty("token");

        const [salaries, organismes] = await Promise.all([
            fetchData(
                `/api/Montfermeil/users/Salarie/${encodeURIComponent(name)}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            ),
            fetchData(
                `/api/Montfermeil/organisation/label/${encodeURIComponent(name)}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
        ]);

        const formattedSalaries = salaries.map((s: any) => ({
            ...s,
            type: "salarie"
        }));

        const formattedOrganismes = organismes.map((o: any) => ({
            ...o,
            type: "organisme"
        }));

        return [...formattedSalaries, ...formattedOrganismes];
    }

    // 🔥 protection accès
    useEffect(() => {
        if (!getSessionItemOrEmpty("token")) {
            router.push("/");
        }
    }, []);

    // 🔥 debounce propre
    useEffect(() => {
        if (!search.trim()) {
            setPeople([]);
            return;
        }

        setLoading(true);

        const timer = setTimeout(async () => {
            const results = await searchAll(search);
            setPeople(results);
            setLoading(false);
        }, 700);

        return () => clearTimeout(timer);

    }, [search]);

    console.log(people)

    return (
        <div className="container">

            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un salarié ou organisme..."
                className="search-input"
            />

            <h3 className="results-title">
                Résultats ({people.length})
            </h3>

            {loading && <h2>Chargement...</h2>}

            {people.length > 0 ? (
                <div className="table-container">
                    <table className="montableau">
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Téléphone</th>
                                <th>Tél. Pro</th>
                                <th>Email</th>
                                <th>Service</th>
                                <th>Localisation</th>
                                <th>Découvrir</th>
                                {getSessionBoolean("isAdmin") && <th>Modifier</th>}
                            </tr>
                        </thead>

                        <tbody>
                            {people.map((p, index) => (
                                <tr key={index}>

                                    {p.type === "salarie" ? (
                                        <>
                                            <td data-label="Nom">{p.nom ?? "N/A"} {p.prenom ?? ""}</td>

                                            <td data-label="Téléphone">
                                                {p.numero
                                                    ? <a style={{color: "blue"}} href={`tel:${p.numero}`}><u>{p.numero}</u></a>
                                                    : "Aucun"}
                                            </td>

                                            {/* 🔥 téléphone pro remis */}
                                            <td data-label="Tél. Pro">
                                                {p.telephonepro
                                                    ? <a style={{color: "blue"}} href={`tel:${p.telephonepro}`}><u>{p.telephonepro} </u></a>
                                                    : "Aucun"}
                                            </td>

                                            <td data-label="Email">
                                                {p.mail
                                                    ? <a style={{color: "blue"}} href={`mailto:${p.mail}`}><u>{p.mail} </u></a>
                                                    : "Aucun"}
                                            </td>

                                            <td data-label="Service">
                                                {p.fonction ?? "N/A"}
                                            </td>

                                            <td data-label="Localisation">
                                                {p.organigramme ? (
                                                    <u><a style={{color:"blue"}} href={`/Annuaire/Organisme/${p.organigramme.id}`}>
                                                        {p.organigramme.label}
                                                    </a></u>
                                                ) : "N/A"}
                                            </td>

                                            <td data-label="Découvrir">
                                                <button
                                                    className="modifier-btn"
                                                    onClick={() => router.push(`/Annuaire/Salarie/${p.id}`)}
                                                >
                                                    Voir profil
                                                </button>
                                            </td>

                                            {getSessionBoolean("isAdmin") && (
                                                <td data-label="Modifier">
                                                    <button
                                                        className="modifier-btn"
                                                        onClick={() => router.push(`/Annuaire/${p.id}`)}
                                                    >
                                                        Modifier
                                                    </button>
                                                </td>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            {/* 🔥 ORGANISME ALIGNÉ SUR MÊME STRUCTURE */}

                                            <td data-label="Nom / Organisme" style={{ textAlign: "center" }}><b>{p.label ?? "N/A"}</b></td>

                                            <td data-label="Téléphone" style={{ textAlign: "center" }}>
                                                {p.telephone
                                                    ? <a href={`tel:${p.telephone}`}>{p.telephone}</a>
                                                    : "Aucun"}
                                            </td>

                                            {/* tel pro (vide pour organisme mais colonne conservée) */}
                                            <td data-label="Tél. Pro" style={{ textAlign: "center" }}>-</td>
                                            <td data-label="Email" style={{ textAlign: "center" }}>-</td>
                                            <td data-label="Service" style={{ textAlign: "center" }}>-</td>

                                            <td data-label="Localisation" style={{ textAlign: "center" }}>
                                                <a
                                                    href={`https://www.google.com/search?q=${encodeURIComponent(p.adresse)}`}
                                                    target="_blank"
                                                >
                                                    {p.adresse ?? "N/A"}
                                                </a>
                                            </td>

                                            <td data-label="Découvrir">
                                                <button
                                                    className="modifier-btn"
                                                    onClick={() => router.push(`/Annuaire/Organisme/${p.id}`)}
                                                >
                                                    Voir organisme
                                                </button>
                                            </td>

                                            {getSessionBoolean("isAdmin") && (
                                                <td data-label="Modifier">-</td>
                                            )}
                                        </>
                                    )}

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            ) : search.length > 0 && !loading ? (
                <p className="no-results">
                    Aucun résultat trouvé pour "{search}"
                </p>
            ) : null}

        </div>
    );
}

export default ModifierSalarie;