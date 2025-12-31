'use client'



function PrivacyPage() {
    
    return(<div style={styles.page}>
        
        <div style={styles.container}>
            <h1 style={styles.title}>Intranet de la Ville de Montfermeil</h1>

            <section>
                <h2 style={styles.subtitle}>Accès réservé aux agents</h2>
                <p style={styles.text}>
                    Ce site est un <strong>intranet professionnel strictement réservé aux agents
                        de la Ville de Montfermeil</strong>.
                    L’accès est limité aux utilisateurs disposant d’identifiants personnels
                    fournis par l’administration.
                </p>
            </section>

            <section>
                <h2 style={styles.subtitle}>Protection et utilisation des données</h2>
                <p style={styles.text}>
                    Les données accessibles sur cet intranet sont <strong>confidentielles,
                        sécurisées et destinées exclusivement à un usage interne</strong>.
                    Elles sont utilisées uniquement dans le cadre des missions professionnelles
                    des agents municipaux.
                </p>

                <div style={styles.box}>
                    🔒 <strong>
                        Aucune donnée n’est transmise, cédée ou communiquée à des organismes tiers,
                        publics ou privés.
                    </strong>
                </div>
            </section>

            <section>
                <h2 style={styles.subtitle}>Cadre légal et réglementaire</h2>
                <p style={styles.text}>
                    La gestion et la protection des données sont conformes aux textes suivants :
                </p>
                <ul style={styles.list}>
                    <li>
                        <strong>Règlement (UE) 2016/679</strong> du Parlement européen et du Conseil
                        du 27 avril 2016 — <em>Règlement Général sur la Protection des Données (RGPD)</em>
                    </li>
                    <li>
                        <strong>Loi n°78-17 du 6 janvier 1978</strong> relative à l’informatique,
                        aux fichiers et aux libertés, modifiée
                    </li>
                    <li>
                        <strong>Article 32 du RGPD</strong> — Sécurité du traitement des données
                    </li>
                    <li>
                        <strong>Article 226-16 du Code pénal</strong> — Atteinte aux droits
                        résultant des fichiers ou des traitements informatiques
                    </li>
                </ul>
            </section>

            <section>
                <h2 style={styles.subtitle}>Responsabilité des utilisateurs</h2>
                <p style={styles.text}>
                    Chaque agent est responsable de la confidentialité de ses identifiants.
                    Toute tentative d’accès frauduleux ou d’utilisation non autorisée du système
                    est interdite et peut entraîner des sanctions disciplinaires et pénales.
                </p>
            </section>

            <p style={styles.footer}>
                En accédant à cet intranet, l’utilisateur reconnaît avoir pris connaissance
                de ces règles et s’engage à les respecter.
            </p>
        </div>
    </div>);
}
const styles: { [key: string]: React.CSSProperties } = {
    page: {
        backgroundColor: "#f4f4f4",
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
    },
    container: {
        maxWidth: "900px",
        margin: "auto",
        backgroundColor: "#ffffff",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    },
    title: {
        textAlign: "center",
        marginBottom: "30px",
    },
    subtitle: {
        color: "#1c87c9",
        marginTop: "25px",
    },
    text: {
        lineHeight: "1.6",
        color: "#333",
    },
    box: {
        backgroundColor: "#eef6ff",
        borderLeft: "5px solid #1c87c9",
        padding: "15px",
        marginTop: "15px",
        borderRadius: "5px",
    },
    list: {
        marginLeft: "20px",
        lineHeight: "1.6",
    },
    footer: {
        marginTop: "30px",
        fontStyle: "italic",
        color: "#555",
    },
};

export default PrivacyPage;