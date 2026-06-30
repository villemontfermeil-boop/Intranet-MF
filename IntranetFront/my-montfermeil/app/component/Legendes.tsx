


import "./styleLegendes.css"


function Legendes() {
    const legendItems = [
        {
            type: "Important",
            title: "Important",
            description: "⚠️ Information prioritaire",
            className: "legend-item--important",
        },
        {
            type: "Évennement",
            title: "Événement",
            description: "📅 Date à retenir",
            className: "legend-item--evenement",
        },
        {
            type: "Annonce",
            title: "Annonce",
            description: "📢 Information générale",
            className: "legend-item--annonce",
        },
        {
            type: "Message",
            title: "Message",
            description: "💬 Communication interne",
            className: "legend-item--message",
        },
        {
            type: "Information",
            title: "Information",
            description: "ℹ️ Information générale",
            className: "legend-item--information",
        },
        // {
        //     type: "Non_défini",
        //     title: "Non défini",
        //     description: "⚪ Type non spécifié",
        //     className: "legend-item--nondefini",
        // },
    ];


    return (
        <section className="legend-container">
            <h3 className="legend-title">📋 Légende des articles</h3>
            <div className="legend-grid">
                {legendItems.map((item) => (
                    <div key={item.type} className={`legend-item ${item.className}`}>
                        <div className="legend-dot" />
                        <div>
                            <strong>{item.title}</strong>
                            <p>{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="legend-note">
                <strong>ℹ️ Note :</strong> Les articles importants et urgents sont mis en avant pour attirer votre attention.
            </div>
        </section>
    )
}

export default Legendes;