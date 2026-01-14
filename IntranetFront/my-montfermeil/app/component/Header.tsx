'use client';
import { useState, useEffect } from 'react';
import './stylheader.css';
import { useRouter } from 'next/navigation';
import { Console } from 'console';

//AJOUTER UN NOMBRE DE TENTATIVE DE CONNEXION

function Header({ nom }: { nom: string | null }) {
    const [clicked, setClicked] = useState(false);
    const [clickedOUT, setClickedOUT] = useState(false);
    const [clientConnected, setClientConnected] = useState(false);
    const [admin, setAdmin] = useState(false);
    const router = useRouter();
    const [menu, SetMenu] = useState(false)


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

                const data = new URLSearchParams({ mail }).toString();

                // Use sendBeacon so the request is more likely to complete during unload
                navigator.sendBeacon('http://localhost:8080/salaries/logout', data);
            } catch (e) {
                // best-effort; ignore errors during unload
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

        if (!email || !password) return false;

        try {
            const response = await fetch('http://localhost:8080/salaries/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer intranetMF-token'
                },
                body: new URLSearchParams({
                    mail: email.value,
                    password: password.value
                })
            });

            const data = await response.json();

            sessionStorage.setItem('id', data.id);
            sessionStorage.setItem('nom', data.nom);
            sessionStorage.setItem('prenom', data.prenom);
            sessionStorage.setItem('mail', data.mail);
            sessionStorage.setItem('isAdmin', data.isAdmin);
            sessionStorage.setItem('isConnected', 'true');
            sessionStorage.setItem('numero', data.numero);
            sessionStorage.setItem('MDP', password.value);

            setClientConnected(true);
            router.refresh();
            alert(`Bienvenue ${data.nom} ${data.prenom}`)
            console.log('Login successful', data);
            console.log('data', sessionStorage)
            const othercredential = btoa(`${data.mail}:${password.value}`);
            document.cookie = 'credential=' + othercredential + '; path=/';

            return true;
        } catch (error) {
            alert('Email invalide ou mot de passe incorrecte')
            return false;
        }
    }

    /* =========================
       LOGOUT BOUTON
       ========================= */
    async function handleLogout() {

        const credential = btoa(`${sessionStorage.getItem('mail')}:${sessionStorage.getItem('MDP')}`);
        try {
            await fetch('http://localhost:8080/salaries/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${credential}`
                },
                body: new URLSearchParams({
                    mail: sessionStorage.getItem('mail') || ''
                })
            });
        } catch (e) {
            console.error('Logout error:', e);
        }
        console.log(sessionStorage.getItem('mail'));

        sessionStorage.clear();
        setClientConnected(false);
        router.push('/')
    }

    useEffect(() => {
        if (clicked) {
            handleLogin();
            setClicked(false);
        }

        if (clickedOUT) {
            handleLogout();
            setClickedOUT(false);
        }
    }, [clicked, clickedOUT]);



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

                                {admin && (
                                    <button type="button" className='MenuButton' onClick={() => router.push("/Nouveau/Article")}>
                                        Nouvel article
                                    </button>
                                )}
                                 <button type="button" className='MenuButton' onClick={() => setClickedOUT(true)}>
                                    <u style={{color: "lightblue"}}>Déconnexion</u>
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
