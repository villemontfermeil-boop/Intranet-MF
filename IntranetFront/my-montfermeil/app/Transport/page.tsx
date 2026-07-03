'use client';
import { useEffect, useState } from "react";
import "./style.css";
interface Message {
    text: string;
}

interface Severity {
    name: string;
    effect: string;
}

interface Disruption {
    id: string;
    severity: Severity;
    messages: Message[];
}

interface ApiResponse {
    disruptions: Disruption[];
}

function PageTransport() {
    const [messages, setMessages] = useState<any[]>([]);
    const Transport = {
        "T4": "C01843",
        "146": "C01171",
        "602": "C01574",
        "603": "C01575",
        "604": "C01576",
        "613": "C01581",
        "643": "C02092",
        "1": "C01423",
        "5": "C01427",
        "T1": "C01389",
        "E": "C01853",
        "B": "C01831",
        "605": "C01577"
    }

    const [choix, setChoix] = useState<string>('');
    const [cle, setCle] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(false)

    const buttonClasses: Record<string, string> = {
        T4: 'btn-t4',
        1: 'btn-bus1',
        5: 'btn-bus5',
        146: 'btn-bus146',
        602: 'btn-bus602',
        603: 'btn-bus603',
        604: 'btn-bus604',
        605: 'btn-bus605',
        613: 'btn-bus613',
        643: 'btn-bus643',
        T1: 'btn-t1',
        E: 'btn-rer-e',
        B: 'btn-rer-b',
    };

    async function getKey() {

        try {
            setLoading(true)

            const token = sessionStorage.getItem("token") || ''
            const data = await fetch("/api/IFM", {
                method: "GET",
                headers: {
                    Authorization: token

                }
            })
            setCle(await data.json());
            setLoading(false)

        } catch (ex) {
            console.log(ex)
            alert("Probleme lors de la récuperation de la clé")
            setLoading(false)
        }

    }

    async function GetInfo(ligne: string) {
        const url = `https://prim.iledefrance-mobilites.fr/marketplace/v2/navitia/line_reports/lines/line%3AIDFM%3A${ligne}/line_reports`

        try {
            setLoading(true)

            const reponse = await fetch(
                url,
                {
                    headers: {
                        apikey: cle.clef
                    }
                }
            );

            const data: ApiResponse = await reponse.json();


            const formattedMessages = data.disruptions.map((d) => ({
                type: d.severity?.name,
                effect: d.severity?.effect,
                text: d.messages?.[0]?.text
            }));

            setMessages(formattedMessages);
            setLoading(false)


        } catch (e) {
            console.log(e);
            setLoading(false)

        }
    }

    useEffect(() => {
        if (choix) {
            GetInfo(choix)
            if (messages) {
                getKey()
            }
        }
    }, [choix])


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
            <h3 style={{ textAlign: "center" }}><u >Choisissez le transport qui vous intéresse</u></h3>
            <div className="transport-grid">
                <button className={`transport-btn ${buttonClasses.T4}`} onClick={() => setChoix(Transport.T4)}>
                    <img className="transport-icon" style={{ width: '50px', height: '50px' }} src="/t4.png" alt="T4" />
                </button>
                <button className={`transport-btn ${buttonClasses[1]}`} onClick={() => setChoix(Transport[1])}>
                    <img className="transport-icon" style={{ width: '50px', height: '50px' }} src="/bus-1.png" alt="Bus 1" />
                </button>
                <button className={`transport-btn ${buttonClasses[5]}`} onClick={() => setChoix(Transport[5])}>5</button>
                <button className={`transport-btn ${buttonClasses[146]}`} onClick={() => setChoix(Transport[146])}>146</button>
                <button className={`transport-btn ${buttonClasses[602]}`} onClick={() => setChoix(Transport[602])}>602</button>
                <button className={`transport-btn ${buttonClasses[603]}`} onClick={() => setChoix(Transport[603])}>603</button>
                <button className={`transport-btn ${buttonClasses[604]}`} onClick={() => setChoix(Transport[604])}>604</button>
                <button className={`transport-btn ${buttonClasses[605]}`} onClick={() => setChoix(Transport[605])}>605</button>
                <button className={`transport-btn ${buttonClasses[613]}`} onClick={() => setChoix(Transport[613])}>613</button>
                <button className={`transport-btn ${buttonClasses[643]}`} onClick={() => setChoix(Transport[643])}>643</button>
                <button className={`transport-btn ${buttonClasses.T1}`} onClick={() => setChoix(Transport.T1)}>T1</button>
                <button className={`transport-btn ${buttonClasses.E}`} onClick={() => setChoix(Transport.E)}>RER E</button>
                <button className={`transport-btn ${buttonClasses.B}`} onClick={() => setChoix(Transport.B)}>RER B</button>
            </div>
            {messages.length === 0 ? (
                <h1 style={{ textAlign: "center" }}>Aucune perturbation</h1>
            ) : (
                <ul>
                    {messages
                        .filter(
                            (msg) =>
                                msg.type !== "SIGNIFICANT_DELAYS" &&
                                msg.type !== "OTHER_EFFECT"
                        )
                        .map((msg, index) => (
                            <li key={index}>
                                <div
                                    className="messageHTML"
                                    dangerouslySetInnerHTML={{ __html: msg.text }}
                                />
                            </li>
                        ))}
                </ul>
            )}
        </div>
    );
}

export default PageTransport;
