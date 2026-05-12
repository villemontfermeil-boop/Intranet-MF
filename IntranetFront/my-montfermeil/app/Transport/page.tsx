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

    async function GetInfo(ligne: string) {
        const url = `https://prim.iledefrance-mobilites.fr/marketplace/v2/navitia/line_reports/lines/line%3AIDFM%3A${ligne}/line_reports`

        try {
            const reponse = await fetch(
                url,
                {
                    headers: {
                        apikey: "fSByGMLkoTqTW1l6a7Jr0XkA4684icTg"
                    }
                }
            );

            const data: ApiResponse = await reponse.json();

            console.log(data);

            const formattedMessages = data.disruptions.map((d) => ({
                type: d.severity?.name,
                effect: d.severity?.effect,
                text: d.messages?.[0]?.text
            }));

            setMessages(formattedMessages);

        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        if (choix) {
            GetInfo(choix)
            console.log(choix)
        }
    }, [choix])

    return (
        <div>
            <h3 style={{ textAlign: "center" }}><u >Choisissez le transport qui vous intéresse</u></h3>
            <div style={{ alignItems: "center", display: "flex", justifyContent: "center", gap: "20px", fontFamily: '"Brown Pro", sans-serif' }}>
                <button onClick={() => setChoix(Transport.T4)}><img style={{ width: '50px', height: "50px" }} src={"/t4.png"} /></button>
                <button onClick={() => setChoix(Transport[1])}><img style={{ width: '50px', height: "50px" }} src={"/bus-1.png"} /></button>
                <button onClick={() => setChoix(Transport[5])}>5</button>
                <button onClick={() => setChoix(Transport[146])}>146</button>
                <button onClick={() => setChoix(Transport[602])}>602</button>
                <button onClick={() => setChoix(Transport[603])}>603</button>
                <button onClick={() => setChoix(Transport[604])}>604</button>
                <button onClick={() => setChoix(Transport[605])}>605</button>
                <button onClick={() => setChoix(Transport[613])}>613</button>
                <button onClick={() => setChoix(Transport[643])}>643</button>
                <button onClick={() => setChoix(Transport.T1)}>T1</button>
                <button onClick={() => setChoix(Transport.E)}>RER E</button>
                <button onClick={() => setChoix(Transport.B)}>RER B</button>

            </div>
            {messages.length === 0 ? (
                <h1 style={{textAlign: "center"}}>Aucune perturbation</h1>
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
