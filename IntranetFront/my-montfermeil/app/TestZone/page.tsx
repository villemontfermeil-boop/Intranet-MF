'use client'; // obligatoire pour Next.js app directory

import { useEffect, useState } from "react";
import Keycloak from "keycloak-js";

export default function TestZone() {
    const [kc, setKc] = useState<Keycloak.KeycloakInstance | null>(null);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const keycloak = new Keycloak({
                url: "http://keycloak.montfermeil.local:8081/",
                realm: "intranet-montfermeil",
                clientId: "intranet-app",
            });

            keycloak.init({
                onLoad: 'check-sso'
            }).then(authenticated => {
                if (!authenticated) {
                    keycloak.login();
                }
            });
        }
    }, []);

    if (!kc) return <div>Loading Keycloak...</div>;

    return (
        <div>
            <h1>Test Zone</h1>
            <p>User is authenticated: {authenticated ? "Yes" : "No"}</p>
            <p>Username: {kc.tokenParsed?.preferred_username}</p>
        </div>
    );
}