'use client';
import { useState, useEffect, use } from 'react';
import './stylheader.css';
import { useRouter } from 'next/navigation';
function Header({ isConnectd }: { isConnectd?: boolean }) {
    const [clicked, setClicked] = useState(false);
    const [clickedOUT, setClickedOUT] = useState(false);
    const [clientConnected, setClientConnected] = useState(false);
    const router = useRouter();

    async function handleLogin() {
    const email = document.getElementById('Email') as HTMLInputElement;
    const password = document.getElementById('Pass') as HTMLInputElement;
    
    if (!email || !password) {
        console.error('Email or Password input not found');
        return false;
    }
    var data = await fetch('http://localhost:8080/salaries/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer intranetMF-token'
        },
        body: new URLSearchParams({
            mail: email.value,
            password: password.value
        })
    }).then((response) => response.json())
        .then((data) => {
            console.log('Success:', data);
            localStorage.setItem('id', data.id);
            localStorage.setItem('nom', data.nom);
            localStorage.setItem('prenom', data.prenom);
            localStorage.setItem('mail', data.mail);
            localStorage.setItem('isAdmin', data.isAdmin);
            localStorage.setItem('isConnected', data.isConnected);
            localStorage.setItem('numero', data.numero);
            

            router.refresh();
            return true;
        })
        .catch((error) => {
            console.error('Error:', error);
            return false;
        });
    return data;
}
    async function handleLogout() {

        var data = await fetch('http://localhost:8080/salaries/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer intranetMF-token'
            },
            body: new URLSearchParams({
                mail: localStorage.getItem('mail') || ''
            })
        }).then((response) => response.json())

        if (!data.error) {
            console.log('Logout Success:', data);
             localStorage.removeItem('salarieData');
             localStorage.clear();
            router.refresh();
            isConnectd = false;
        }else {
            console.error('Logout Error:', data.error);
        }
       
    }
    useEffect(() => {
        if (clickedOUT) {
            handleLogout();
            setClickedOUT(false);
        }
        if (clicked) {
            (async () => {
                const result = await handleLogin();
                setClientConnected(result);
            })();
            setClicked(false);
        }
        if (clientConnected) {
         isConnectd = true;
        }else{
         isConnectd = false;
        }

    }, [clicked, clickedOUT]);

    return (
        <div className="Thebody">
            <header className="login-header">
                {/* <img src="app/component/logo.png" /> */}
                <h1>Welcome Back!</h1>
                <form className="login-form">{isConnectd == true ?
                    <button type="button" onClick={() => setClickedOUT(true)} >Logout</button> : <>
                        <input type="text" placeholder="Email" id='Email' name="email" required />
                        <input type="password" placeholder="Password" id='Pass' name="password" required />
                        <button type="button" onClick={() => setClicked(true)}>Login</button>
                        <button type="button"  >Sign Up</button> </>}
                </form>
            </header>
        </div>
    );
}


export default Header;