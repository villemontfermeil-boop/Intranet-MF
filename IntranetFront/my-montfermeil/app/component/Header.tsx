'use client';
import { useState, useEffect, use } from 'react';
import './stylheader.css';
function Header({ isConnectd }: { isConnectd?: boolean }) {
    const [clicked, setClicked] = useState(false);
    const [clientConnected, setClientConnected] = useState(false);
    useEffect(() => {
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

    }, [clicked]);

    return (
        <div className="Thebody">
            <header className="login-header">
                {/* <img src="app/component/logo.png" /> */}
                <h1>Welcome Back!</h1>
                <form className="login-form">{isConnectd == true ?
                    <button type="button" >Logout</button> : <>
                        <input type="text" placeholder="Email" id='Email' name="email" required />
                        <input type="password" placeholder="Password" id='Pass' name="password" required />
                        <button type="button" onClick={() => setClicked(true)}>Login</button>
                        <button type="button"  >Sign Up</button> </>}
                </form>
            </header>
        </div>
    );
}

async function handleLogin() {
    const email = document.getElementById('Email') as HTMLInputElement;
    const password = document.getElementById('Pass') as HTMLInputElement;
    const router = useRouter();
    
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
            return true;
        })
        .catch((error) => {
            console.error('Error:', error);
            return false;
        });
    return data;
}
export default Header;