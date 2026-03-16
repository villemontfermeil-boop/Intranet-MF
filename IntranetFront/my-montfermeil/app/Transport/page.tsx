'use client';
import { useEffect, useState } from "react";
interface MessageText {
    value: string;
    lang: string;
}

interface Message {
    MessageType: string;
    MessageText: MessageText;
}

interface Content {
    LineRef: { value: string }[];
    Message: Message[];
}

interface InfoMessage {
    FormatRef: string;
    RecordedAtTime: string;
    ItemIdentifier: string;
    InfoMessageIdentifier: { value: string };
    InfoChannelRef: { value: string };
    ValidUntilTime: string;
    Content: Content;
}

interface GeneralMessageDelivery {
    ResponseTimestamp: string;
    Version: string;
    Status: string;
    InfoMessage: InfoMessage[];
}

interface ServiceDelivery {
    ResponseTimestamp: string;
    ProducerRef: string;
    ResponseMessageIdentifier: string;
    GeneralMessageDelivery: GeneralMessageDelivery[];
}

interface Siri {
    ServiceDelivery: ServiceDelivery;
}

interface ApiResponse {
    Siri: Siri;
}


function PageTransport() {
    const [messages, setMessages] = useState<any[]>([]);
    const Transport = {
        "T4": "C01843",
        "146" : "C01171",
        "602": "C01574",
        "603": "C01575",
        "604": "C01576",
        "613": "C01581",
        "643": "C02092",
        "1": "C01423",
        "5": "C01427",
        "T1": "C01389",
        "E" : "C01853",
        "B" : "C01831",
        "605" : "C01577"
    }

    const [choix, setChoix] = useState<string>('');


    async function GetInfo(ligne: string) {
        try {
            const reponse = await fetch(
                `https://prim.iledefrance-mobilites.fr/marketplace/general-message?LineRef=STIF:Line::${ligne}:`,
                {
                    headers: {
                        apikey: "fSByGMLkoTqTW1l6a7Jr0XkA4684icTg"
                    }
                }
            );

            const data: ApiResponse = await reponse.json();

            const importantMessages = data.Siri.ServiceDelivery.GeneralMessageDelivery.flatMap(gmd =>
                gmd.InfoMessage.flatMap(info =>
                    info.Content.Message.map(msg => ({
                        type: msg.MessageType,
                        text: msg.MessageText.value,
                        line: info.Content.LineRef[0]?.value
                    }))
                )
            );

            setMessages(importantMessages);

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
            <h3 style={{textAlign: "center"}}><u >Choisissez le transport qui vous intéresse</u></h3>
            <div style={{alignItems: "center", display: "flex", justifyContent: "center", gap: "20px"}}>
                <button onClick={() => setChoix(Transport.T4)}><img style={{width: '50px', height: "50px"}} src={"/t4.png"}/></button>
                <button onClick={() => setChoix(Transport[1])}><img style={{width: '50px', height: "50px"}} src={"/bus-1.png"}/></button>
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
                <h1 style={{textAlign: "center"}}>Aucune information pour le moment</h1>
            ) : (
                <ul>
                    {messages.map((msg, index) => (
                        <li key={index}>
                            <strong>{msg.type}</strong> : {msg.text}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default PageTransport;
