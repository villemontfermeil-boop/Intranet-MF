'use client';
import { useState, useEffect } from 'react';
import './stylheader.css';
import { useRouter } from 'next/navigation';
import { Console } from 'console';

function Header({nom} : {nom:string | null}) {
    const [clicked, setClicked] = useState(false);
    const [clickedOUT, setClickedOUT] = useState(false);
    const [clientConnected, setClientConnected] = useState(false);
    const admin = sessionStorage.getItem('isAdmin') === 'true';
    const router = useRouter();
   

    // Use sessionStorage so the user stays logged on refresh but is cleared on tab close.
    useEffect(() => {
        // Initialize connection state from sessionStorage on mount
        const isConnected = sessionStorage.getItem('isConnected') === 'true';
        setClientConnected(isConnected);

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

            setClientConnected(true);
            router.refresh();
            console.log('Login successful', data);
            console.log('data',nom)
                
                
            return true;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    }

    /* =========================
       LOGOUT BOUTON
       ========================= */
    async function handleLogout() {
        try {
            await fetch('http://localhost:8080/salaries/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer intranetMF-token'
                },
                body: new URLSearchParams({
                    mail: sessionStorage.getItem('mail') || ''
                })
            });
        } catch (e) {
            console.error('Logout error:', e);
        }

        sessionStorage.clear();
        setClientConnected(false);
        router.refresh();
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
                <img src="/logo.png" className='styleLogo'/>

            <header className="login-header">
                
                <form className="login-form">

                    {clientConnected ? (
                        <>
                            <button type="button" onClick={() => setClickedOUT(true)}>
                                Logout
                            </button>
                            {admin && <button type="button" onClick={() => router.push('/Nouveau/Salarie')}>Admin Panel</button>}
                        </>
                    ) : (
                        <>
                            <input type="text" placeholder="Email" id="Email" required />
                            <input type="password" placeholder="Password" id="Pass" required />
                            <button type="button" onClick={() => setClicked(true)}>
                                Login
                            </button>
                            <button type="button">Sign Up</button>
                        </>
                    )}
                </form>
            </header>
        </div>
    );
}

export default Header;
