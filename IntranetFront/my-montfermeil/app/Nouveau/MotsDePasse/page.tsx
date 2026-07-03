'use client';


import { useState } from 'react';



export default function MotsDePasse() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const Maj = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const min = Maj.toLowerCase();
    const nombre = "0123456789"



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // ⚠️ N'oubliez pas ça !

        // Générer un mot de passe aléatoire
        let composition = "";

        for (let j = 0; j < 5; j++) { // 5 caractères suffisent
            const randomM = Math.floor(Math.random() * Maj.length); // 26, pas 27 !
            const randomm = Math.floor(Math.random() * min.length);
            const randomN = Math.floor(Math.random() * nombre.length);

            composition += Maj[randomM] + min[randomm] + nombre[randomN];
        }


        e.preventDefault();
        setLoading(true);
        setError('');



        try {
            let response = await fetch('/api/Montfermeil/users/PasswordForgot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: composition }),
            });
            if (!response.ok) {
                response = await fetch('/api/Montfermeil/users/PasswordForgot/Change', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password: composition }),
                });


            }
            const response2 = await fetch('/api/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, composition }),
            });

            if (!response2.ok) {
                throw new Error('Erreur lors de l\'envoi');
            } else {
                const Myformdata = new FormData()
                Myformdata.append("email", email)
                Myformdata.append("password", composition)
            }
            setSubmitted(true);

        } catch (ex) {
            console.log(ex)
            setError('Une erreur s\'est produite. Veuillez réessayer.');


            // }
            // } catch (err) {
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    Réinitialiser le mot de passe
                </h1>

                {submitted ? (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                        <p>Un lien de réinitialisation a été envoyé à {email}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Adresse email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="vous@exemple.com"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition"
                        >
                            {loading ? 'En cours...' : 'Envoyer le lien'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}