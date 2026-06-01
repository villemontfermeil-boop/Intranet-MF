'use client';

import React from "react";

export default function AboutPage() {
    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <h1 style={styles.title}>À propos de l’intranet</h1>

                <section>
                    <h2 style={styles.subtitle}>Un site privé et sécurisé</h2>
                    <p style={styles.text}>
                        Ce site est un <strong>intranet privé</strong>, exclusivement destiné aux
                        agents de la Ville de Montfermeil. Il n’est pas accessible au public et
                        nécessite une authentification pour accéder à son contenu.
                    </p>
                </section>

                <section>
                    <h2 style={styles.subtitle}>Objectif du site</h2>
                    <p style={styles.text}>
                        L’objectif de cet intranet est de centraliser les informations,
                        applications et ressources nécessaires au bon fonctionnement des services
                        municipaux, tout en garantissant la confidentialité des données.
                    </p>
                </section>

                <section>
                    <h2 style={styles.subtitle}>Mises à jour et nouveaux contenus</h2>
                    <p style={styles.text}>
                        Le site est amené à évoluer régulièrement. Des <strong>mises à jour
                        techniques</strong> ainsi que de <strong>nouveaux contenus</strong> seront
                        ajoutés afin d’améliorer l’expérience utilisateur et de répondre aux besoins
                        des agents.
                    </p>
                    <p style={styles.text}>
                        Certaines fonctionnalités peuvent être modifiées ou enrichies au fil du temps.
                    </p>
                </section>

                <section>
                    <h2 style={styles.subtitle}>Utilisation responsable</h2>
                    <p style={styles.text}>
                        Chaque utilisateur est invité à utiliser ce site de manière responsable
                        et à respecter les règles de sécurité et de confidentialité en vigueur.
                    </p>
                </section>

                <p style={styles.footer}>
                    L’accès à cet intranet est réservé aux agents de la mairie. En l’utilisant, l’utilisateur reconnaît son statut et s’engage à en respecter les règles d’usage.
                </p>
            </div>
        </div>
    );
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
    footer: {
        marginTop: "30px",
        fontStyle: "italic",
        color: "#555",
    },
};
