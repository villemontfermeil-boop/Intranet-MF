
'use client'
import { useEffect, useState } from "react";
import "@/app/Annuaire/Recommander/style.css";


function pageRecommander() {

    const [recommander, setRecommander] = useState<any[]>([]);
    const [loading, setLoading] = useState(true); // État de chargement

    async function getRecommander() {
        const token = sessionStorage.getItem("token") || ""
        try {
            const data = await fetch("/api/Montfermeil/recommend/all", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const json = await data.json();
            setRecommander(json);
            setLoading(false)

        } catch (ex) {
            console.log(ex)
            setLoading(false)

        }



    }

    useEffect(() => {
        getRecommander();
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

    return (
        <div >
            <h1 style={{ textAlign: "center" , left: "20px" }}><u>Recommander</u></h1>

            <div className="table-container">

                <table className="table-salaries" style={{ textAlign: "center" }}>
                    <tbody>
                        <tr>
                            <th>
                                Date
                            </th>
                            <th>
                                n° de recommander
                            </th>
                            <th>
                                Services
                            </th>
                        </tr>

                        {recommander.map((value, index) => (
                            <tr key={index}>
                                <td>
                                    {value.date}
                                </td>
                                <td>
                                    {value.recommande}

                                </td>
                                <td>
                                    {value.service}

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

    )
}


export default pageRecommander;