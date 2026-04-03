import * as React from 'react';

interface EmailTemplateProps {
    email: string;
}

export function EmailTemplate({ email }: EmailTemplateProps, { MDP }: any) {
    return (
        <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ color: '#333' }}>Bienvenue !</h1>
            <h1>C'est des test par moi *yahaya* </h1>
            <h2>Chers Agent,</h2>
            <p>Voici vos identifiants de connexion :</p>

            <div style={{
                backgroundColor: '#f5f5f5',
                padding: '15px',
                borderRadius: '5px',
                margin: '20px 0'
            }}>

                <p style={{ margin: '5px 0' }}>
                    <strong>Mot de passe temporaire :</strong> <code style={{ fontSize: '16px' }}>{MDP}</code>
                </p>
            </div>

            <p style={{ color: '#666', fontSize: '14px' }}>
                ⚠️ Pour des raisons de sécurité, veuillez changer votre mot de passe après votre première connexion.
            </p>

            <p>Ce mot de passe est valable 24 heures.</p>

            <hr style={{ margin: '20px 0' }} />

            <p style={{ color: '#999', fontSize: '12px' }}>
                Si vous n'avez pas demandé ce compte, ignorez cet email.
            </p>
        </div>
    );
}