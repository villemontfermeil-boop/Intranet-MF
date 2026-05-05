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

   
    useEffect(() => {
        // if(connexion == true){return}
        if (typeof window !== "undefined") {
            const keycloak = new Keycloak({
                url: "http://localhost:8081",
                realm: "intranet-montfermeil",
                clientId: "intranet-app",
            });

            keycloak.init({
                onLoad: 'login-required',
                checkLoginIframe: false,
                pkceMethod: 'S256'
            }).then(async (authenticated) => {
                if (!authenticated) {
                    keycloak.login();
                    return;
                }

                // ✅ utilisateur connecté via Keycloak
                setClientConnected(true);

                const user = keycloak.tokenParsed;
                console.log("Téléphone", user?.telephoneNumber);
                console.log("USER KEYCLOAK:", user);

                // 🔥 ENVOI AU BACKEND (IMPORTANT)
                try {
                    const syncData = {
                        username: user?.preferred_username || '',
                        email: user?.email || '',
                        nom: user?.family_name || '',
                        prenom: user?.given_name || '',
                        localisation: user?.department || '',
                        mobilePro: user?.mobile || '',
                        telephoneNumber: user?.telephoneNumber || '',
                        organisation : user?.company || '',
                        fonction : user?.title || '',
                    };

                    console.log("SENDING SYNC DATA:", syncData);

                    const syncResponse = await fetch('/api/Montfermeil/users/sync', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8',
                            Authorization: `Bearer ${keycloak.token}`
                        },
                        body: JSON.stringify(syncData)
                    });

                    console.log("SYNC RESPONSE STATUS:", syncResponse.status);

                    const syncResponseText = await syncResponse.json();
                    console.log("SYNC RESPONSE TEXT:", syncResponseText);
                    setdata(syncResponseText);
                    sessionStorage.setItem('id', syncResponseText.id);
                    sessionStorage.setItem('fonction', syncResponseText.organigramme.label || '')


                 


                    if (!syncResponse.ok) {
                        try {
                            const syncError = JSON.parse(syncResponseText);
                            console.error("SYNC FAILED:", {
                                status: syncResponse.status,
                                error: syncError.error,
                                details: syncError.details
                            });
                        } catch {
                            console.error("SYNC FAILED:", syncResponse.status, syncResponseText);
                        }
                    } else {

                        console.log("SYNC SUCCESS");
                    }
                } catch (syncError) {
                    console.error("SYNC EXCEPTION:", syncError);
                }
         

                // sessionStorage.setItem('id', data.id);
                console.log("id", sessionStorage.getItem("id"))
                sessionStorage.setItem('isConnected', 'true');
                sessionStorage.setItem('mail', user?.email || '');
                sessionStorage.setItem('nom', user?.family_name || '');
                sessionStorage.setItem('prenom', user?.given_name || '')
                sessionStorage.setItem('localisation', user?.title || '')
                sessionStorage.setItem('token', keycloak.token || '')
                // sessionStorage.setItem('localisation', user?.department || '');
                sessionStorage.setItem('telephonepro', user?.mobile || '');
                sessionStorage.setItem('numero', user?.telephoneNumber || '');
                
                // Assuming admin role from Keycloak
                setAdmin(user?.realm_access?.roles?.includes('admin') || false);

            });

            setKc(keycloak);
        }
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

                                {sessionStorage.length > 0 && sessionStorage.getItem('fonction') == "Communication" && <button type="button" className='MenuButton' onClick={() => router.push("/Nouveau/Article")}>
                                    Nouvel article
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
