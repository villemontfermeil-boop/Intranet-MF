'use client';
import { useState, useEffect } from 'react';
import './stylheader.css';
import { useRouter } from 'next/navigation';
import Keycloak from 'keycloak-js';

function Header({ nom }: { nom: string | null }) {
    const [clientConnected, setClientConnected] = useState(false);
    const [admin, setAdmin] = useState(false);
    const router = useRouter();
    const [menu, SetMenu] = useState(false);
    const [Entrer, SetEntrer] = useState(false);
    const [data, setdata] = useState<any>();
    const [kc, setKc] = useState<Keycloak.KeycloakInstance | null>(null);
    // const [connexion , setConnexion ] = useState<boolean>(false)





    // Use sessionStorage so the user stays logged on refresh but is cleared on tab close.
    useEffect(() => {
        // Initialize connection state from sessionStorage on mount
        try {
            const isConnected = sessionStorage.getItem('isConnected') === 'true';
            setClientConnected(isConnected);
            setAdmin(sessionStorage.getItem('isAdmin') === 'true');
        } catch (e) {
            setClientConnected(false);
            setAdmin(false);
        }

        // Send a logout request to server when the page is being unloaded because of a close.
        // We try to skip sending on a reload by checking the navigation type.
        const handleBeforeUnload = () => {
            try {
                // Detect reload where possible
                let isReload = false;
                try {
                    const navEntries = performance.getEntriesByType && performance.getEntriesByType('navigation');
                    if (navEntries && navEntries.length) {
                        isReload = (navEntries[0] as PerformanceNavigationTiming).type === 'reload';
                    } else if ((performance as any).navigation) {
                        isReload = (performance as any).navigation.type === 1; // TYPE_RELOAD
                    }
                } catch (e) {
                    // ignore and assume not a reload
                }

                if (isReload) return; // don't logout on refresh

                const mail = sessionStorage.getItem('mail');
                if (!mail) return;

                const body = new Blob(
                    [new URLSearchParams({ mail }).toString()],
                    { type: "application/x-www-form-urlencoded" }
                );

                navigator.sendBeacon('/api/Montfermeil/users/logout', body);
            } catch (e) {
                // best-effort; ignore errors during unload
                console.log(e)
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };

    }
    )
    
    useEffect(() => {
        if (typeof window === "undefined") return;

        const keycloak = new Keycloak({
            url: "http://localhost:8081",
            realm: "intranet-montfermeil",
            clientId: "intranet-app",
        });

        let refreshInterval: NodeJS.Timeout;

        keycloak.init({
            onLoad: "login-required",
            checkLoginIframe: false,
            pkceMethod: "S256",
        }).then(async (authenticated) => {

            if (!authenticated) {
                keycloak.login();
                return;
            }

            setClientConnected(true);

            const user = keycloak.tokenParsed;

            // =========================
            // 🔄 AUTO REFRESH TOKEN
            // =========================
            refreshInterval = setInterval(() => {
                keycloak.updateToken(30)
                    .then((refreshed) => {
                        if (refreshed) {
                            sessionStorage.setItem("token", keycloak.token || "");
                            console.log("🔄 Token refreshed");
                        }
                    })
                    .catch(() => {
                        console.log("❌ Refresh failed → logout");

                        keycloak.logout({
                            redirectUri: window.location.origin,
                        });
                    });
            }, 10000);

            keycloak.onTokenExpired = () => {
                keycloak.updateToken(5).catch(() => {
                    keycloak.logout({
                        redirectUri: window.location.origin,
                    });
                });
            };

            // =========================
            // 🧠 SYNC BDD (UNE SEULE FOIS)
            // =========================
            const alreadySynced = sessionStorage.getItem("synced");

            if (!alreadySynced) {
                try {
                    const syncData = {
                        username: user?.preferred_username || "",
                        email: user?.email || "",
                        nom: user?.family_name || "",
                        prenom: user?.given_name || "",
                        roles: user?.realm_access?.roles?.toString() || "",
                        localisation: user?.department || "",
                        mobilePro: user?.mobile || "",
                        telephoneNumber: user?.telephoneNumber || "",
                        organisation: user?.company || "",
                        fonction: user?.title || "",
                    };

                    const res = await fetch("/api/Montfermeil/users/sync", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${keycloak.token}`,
                        },
                        body: JSON.stringify(syncData),
                    });

                    const data = await res.json();

                    setdata(data);

                    sessionStorage.setItem("id", data.id);
                    sessionStorage.setItem("fonction", data?.organigramme?.label || "");
                    sessionStorage.setItem("synced", "true");

                    console.log("✅ SYNC OK");
                } catch (err) {
                    console.error("❌ SYNC ERROR", err);
                }
            }

            // =========================
            // 💾 SESSION STORAGE
            // =========================
            sessionStorage.setItem("isConnected", "true");
            sessionStorage.setItem("mail", user?.email || "");
            sessionStorage.setItem("nom", user?.family_name || "");
            sessionStorage.setItem("prenom", user?.given_name || "");
            sessionStorage.setItem("token", keycloak.token || "");
            sessionStorage.setItem("telephonepro", user?.mobile || "");
            sessionStorage.setItem("numero", user?.telephoneNumber || "");

            setAdmin(user?.realm_access?.roles?.includes("admin") || false);

        });

        setKc(keycloak);

        // =========================
        // 🧹 CLEANUP PROPRE
        // =========================
        return () => {
            if (refreshInterval) {
                clearInterval(refreshInterval);
            }
        };

    }, []);



    /* =========================
       LOGOUT BOUTON
       ========================= */
    async function handleLogout() {
        try {
            const userEmail = sessionStorage.getItem('mail');

            // Notify backend of logout before clearing session
            if (userEmail) {
                try {
                    await fetch('/api/Montfermeil/users/logout', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: new URLSearchParams({
                            email: userEmail
                        })
                    });
                } catch (e) {
                    console.error('Backend logout error:', e);
                }
            }

            // Clear session storage immediately
            sessionStorage.clear();
            setClientConnected(false);
            setAdmin(false);


            // Then logout from Keycloak (redirects to home)
            if (kc) {
                await kc.logout({
                    redirectUri: window.location.origin
                });
                // setConnexion(false)
            } else {
                router.push('/');
            }
        } catch (e) {
            console.error('Logout error:', e);
            // Force logout locally if Keycloak fails
            sessionStorage.clear();
            router.push('/');
        }
    };
    return (
        <div className="Thebody">
            <img src="/logo.png" onClick={() => router.push('/')} className='styleLogo' />

            <header className="login-header">
                <form className="login-form">
                    {/* Bouton menu visible seulement en mobile */}
                    <button
                        type="button"
                        className="menu-toggle"
                        onClick={() => SetMenu(!menu)}
                    >
                        ☰ Menu
                    </button>

                    <div className={`menu-container ${menu ? "open" : ""}`}>
                        <a href='/Nouveau/MotsDePasse' onMouseEnter={() => SetEntrer(true)} onMouseLeave={() => SetEntrer(false)} style={Entrer ? { color: "lightblue" } : {}}> Mots de passe oublié ? </a>

                        <button type="button" className='MenuButton' onClick={() => router.push('/Application')}>
                            Application
                        </button>

                        {clientConnected ? (
                            <>
                                {admin && (
                                    <button type="button" className='MenuButton' onClick={() => router.push('/Nouveau/Salarie')}>
                                        Nouvel agent
                                    </button>
                                )}

                                <button type="button" className='MenuButton' onClick={() => router.push('/Annuaire/Salarie')}>
                                    Les agents
                                </button>
                                <button type='button' className='MenuButton' onClick={() => router.push('/Transport')}>
                                    Transport
                                </button>

                                {sessionStorage.length > 0 && sessionStorage.getItem('fonction') == "COMMUNICATION" && <button type="button" className='MenuButton' onClick={() => router.push("/Nouveau/Article")}>
                                    Nouvel article
                                </button>}
                                {sessionStorage.length > 0 && sessionStorage.getItem('fonction') == "COURRIER" && <button type="button" className='MenuButton' onClick={() => router.push("/Annuaire/Recommander")}>
                                    Recommander
                                </button>}

                                <button type='button' className='MenuButton' onClick={() => router.push('/Profil')}> Mon profil </button>

                                <button type="button" className='MenuButton' onClick={handleLogout}>
                                    <u style={{ color: "lightblue" }}>Déconnexion</u>
                                </button>
                            </>
                        ) : (
                            <div>Loading Keycloak...</div>
                        )}
                    </div>
                </form>
            </header>
        </div>
    );
}

export default Header;
