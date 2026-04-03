'use client';
import { useState, useEffect } from 'react';
import './stylheader.css';
import { useRouter } from 'next/navigation';


//AJOUTER UN NOMBRE DE TENTATIVE DE CONNEXION

function Header({ nom }: { nom: string | null }) {
    const [clicked, setClicked] = useState(false);
    const [clickedOUT, setClickedOUT] = useState(false);
    const [clientConnected, setClientConnected] = useState(false);
    const [admin, setAdmin] = useState(false);
    const router = useRouter();
    const [menu, SetMenu] = useState(false)
    const [Entrer, SetEntrer] = useState(false)


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
    }, []);

    /* =========================
       LOGIN
       ========================= */
    async function handleLogin() {
        const email = document.getElementById('Email') as HTMLInputElement;
        const password = document.getElementById('Pass') as HTMLInputElement;
        const FormBody = new URLSearchParams({
            mail: email.value,
            password: password.value
        })
        if (!email || !password) return false;

        try {
            const response = await fetch('/api/Montfermeil/users/login', {
                method: 'POST',
                body: FormBody
            });

            const data = await response.json();
            if (data.id == null || data.nom == null || data.prenom == null || data.isAdmin == null || data.numero == null) {
                alert("Email invalide ou mot de passe incorrecte")
                return false
            }
            sessionStorage.setItem('id', data.id);

            sessionStorage.setItem('nom', data.nom);
            sessionStorage.setItem('prenom', data.prenom);
            sessionStorage.setItem('mail', data.mail);
            sessionStorage.setItem('isAdmin', data.isAdmin);
            sessionStorage.setItem('isConnected', 'true');
            sessionStorage.setItem('numero', data.numero);
            sessionStorage.setItem('MDP', password.value);
            sessionStorage.setItem('localisation', data.localisation);
            sessionStorage.setItem('fonction', data.fonction);
            sessionStorage.setItem('telephonepro', data.telephonepro);



            setClientConnected(true);
            router.refresh();
            alert(`Bienvenue ${data.nom} ${data.prenom}`)
            console.log("BACKEND DATA:", data)
            console.log('Login successful', data);
            console.log('data', sessionStorage)
            document.cookie = `Admin=${sessionStorage.getItem('isConnected')}; path=/`
            document.cookie = `mail=${sessionStorage.getItem('mail')}; path=/`
            document.cookie = `MDP=${password.value}; path=/`
            const othercredential = btoa(`${data.mail}:${password.value}`);
            document.cookie = 'credential=' + othercredential + '; path=/';
            return true;
        } catch (error) {
            console.log(error)
            alert("Email invalide ou mot de passe incorrecte ET vérifié également que vous n'etes pas déja connecter sur le site depuis un autre navigateur")
            return false;
        }
    }

    /* =========================
       LOGOUT BOUTON
       ========================= */
    async function handleLogout() {


        try {
            await fetch("/api/Montfermeil/users/logout", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    mail: sessionStorage.getItem('mail') || ''
                })
            })
            sessionStorage.clear()
            document.cookie = "mail=; Max-Age=0; path=/";
            document.cookie = "MDP=; Max-Age=0; path=/";
            document.cookie = "credential=; Max-Age=0; path=/";
        } catch (e) {
            console.error('Logout error:', e);
        }
        console.log(sessionStorage.getItem('mail'));

        sessionStorage.clear();
        setClientConnected(false);
        router.push('/')
    }

    useEffect(() => {
        const performLogin = async () => {
            if (clicked) {
                const success = await handleLogin();
                if (success) {
                    setClicked(false);
                    location.reload()
                } else {
                    setClicked(false)


                }
            }

            if (clickedOUT) {
                await handleLogout();
                setClickedOUT(false);
            }
        };

        performLogin();
    }, [clicked, clickedOUT, Entrer]);



    return (
        <div className="Thebody">
            <img src="/logo.png" onClick={() => router.push('/')} className='styleLogo' />

            <header className="login-header" >

                <form className="login-form" >

                    {/* Bouton menu visible seulement en mobile */}
                    <button
                        type="button"
                        className="menu-toggle"
                        onClick={() => SetMenu(!menu)}
                    >
                        ☰ Menu
                    </button>

                    <div className={`menu-container ${menu ? "open" : ""}`}>
                        <a href='/Nouveau/MotsDePasse' onMouseEnter={()=> SetEntrer(true)}  onMouseLeave={() => SetEntrer(false)}style={Entrer ? {color: "lightblue"} : {}}> Mots de passe oublié ? </a>

                        <button type="button" className='MenuButton' onClick={() => router.push('/Application')}>
                            Application
                        </button>

                        {clientConnected ? (
                            <>


                                {admin == true && (
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

                                <button type='button' className='MenuButton' onClick={() => router.push('/Profil')} > Mon profil </button>

                                <button type="button" className='MenuButton' onClick={() => setClickedOUT(true)}>
                                    <u style={{ color: "lightblue" }}>Déconnexion</u>
                                </button>

                            </>
                        ) : (
                            <>

                                <input type="text" placeholder="Email" id="Email" required />
                                <input type="password" placeholder="Password" id="Pass" required />
                                <button type="button" onClick={() => setClicked(true)}>Login</button>

                            </>
                        )}
                    </div>
                </form>
            </header>
        </div>
    );
}

export default Header;
