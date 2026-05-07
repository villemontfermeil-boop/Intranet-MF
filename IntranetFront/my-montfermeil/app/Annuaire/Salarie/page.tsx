'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "@/app/Annuaire/Salarie/style.css";

function ModifierSalarie() {

    const [search, setSearch] = useState<string>("");
    const [people, setPeople] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // 🔥 fetch sécurisé
    async function fetchData(url: string) {
        const token = sessionStorage.getItem("token");

        try {
            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) return [];

            const text = await res.text();
            if (!text) return [];

            return JSON.parse(text);

        } catch (err) {
            console.log(err);
            return [];
        }
    }

    async function searchAll(name: string) {
        const [salaries, organismes] = await Promise.all([
            fetchData(`/api/Montfermeil/users/Salarie/${encodeURIComponent(name)}`),
            fetchData(`/api/Montfermeil/organisation/label/${encodeURIComponent(name)}`)
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
        if (!sessionStorage.getItem("token")) {
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
        }, 1300);

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
                                {sessionStorage.getItem("isAdmin") === 'true' && <th>Modifier</th>}
                            </tr>
                        </thead>

                        <tbody>
                            {people.map((p, index) => (
                                <tr key={index}>

                                    {p.type === "salarie" ? (
                                        <>
                                            <td>{p.nom ?? "N/A"} {p.prenom ?? ""}</td>

                                            <td>
                                                {p.numero
                                                    ? <a href={`tel:${p.numero}`}>{p.numero}</a>
                                                    : "Aucun"}
                                            </td>

                                            {/* 🔥 téléphone pro remis */}
                                            <td>
                                                {p.telephonepro
                                                    ? <a href={`tel:${p.telephonepro}`}>{p.telephonepro}</a>
                                                    : "Aucun"}
                                            </td>

                                            <td>
                                                {p.mail
                                                    ? <a href={`mailto:${p.mail}`}>{p.mail}</a>
                                                    : "Aucun"}
                                            </td>

                                            <td>
                                                {p.fonction ?? "N/A"}
                                            </td>

                                            <td>
                                                {p.organigramme ? (
                                                    <a href={`/Annuaire/Organisme/${p.organigramme.id}`}>
                                                        {p.organigramme.label}
                                                    </a>
                                                ) : "N/A"}
                                            </td>

                                            <td>
                                                <button
                                                    className="modifier-btn"
                                                    onClick={() => router.push(`/Annuaire/Salarie/${p.id}`)}
                                                >
                                                    Voir profil
                                                </button>
                                            </td>

                                            {sessionStorage.getItem("isAdmin") === 'true' && (
                                                <td>
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

                                            <td style={{textAlign: "center"}}><b>{p.label ?? "N/A"}</b></td>

                                            <td style={{textAlign: "center"}}>
                                                {p.telephone
                                                    ? <a href={`tel:${p.telephone}`}>{p.telephone}</a>
                                                    : "Aucun"}
                                            </td>

                                            {/* tel pro (vide pour organisme mais colonne conservée) */}
                                            <td style={{textAlign: "center"}}>-</td>
                                            <td style={{textAlign: "center"}}>-</td>
                                            <td style={{textAlign: "center"}}>-</td>


                                            <td style={{textAlign: "center"}}>
                                                <a
                                                    href={`https://www.google.com/search?q=${encodeURIComponent(p.adresse)}`}
                                                    target="_blank"
                                                >
                                                    {p.adresse ?? "N/A"}
                                                </a>
                                            </td>



                                            <td>
                                                <button
                                                    className="modifier-btn"
                                                    onClick={() => router.push(`/Annuaire/Organisme/${p.id}`)}
                                                >
                                                    Voir organisme
                                                </button>
                                            </td>

                                            {sessionStorage.getItem("isAdmin") === 'true' && (
                                                <td>-</td>
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