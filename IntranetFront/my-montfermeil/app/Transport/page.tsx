'use client';
import { useState } from "react";
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
    const [messages, setMessages] = useState<string[]>([]);

    async function GetT4nfo() {
        try {
            const reponse = await fetch(
                "https://prim.iledefrance-mobilites.fr/marketplace/general-message?LineRef=STIF%3ALine%3A%3AC01727%3A"
            ,{
                headers:{
                    "apikey":"fSByGMLkoTqTW1l6a7Jr0XkA4684icTg"
                }
            });
            const data: ApiResponse = await reponse.json();

            const msgs = data.Siri.ServiceDelivery.GeneralMessageDelivery.flatMap(gmd =>
                gmd.InfoMessage.flatMap(im =>
                    im.Content.Message.map(m => m.MessageText.value)
                )
            );

            setMessages(msgs);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div>
            <button onClick={GetT4nfo}>Charger les messages</button>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
        </div>
    );
}

export default PageTransport;
