
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { json } from 'stream/consumers';
interface Props {
    params: { id: string };
}

function SalarieModification() {

    const router = useRouter();
    const params = useParams();
    const [isInPasswordMode, SetPasswordMode] = useState(false);
    const show = !isInPasswordMode;
    const [submitButton, SetSubmit] = useState<boolean>(false);
    const [echouay, setEchouay] = useState<boolean>(true)

    const [passwordForgot, setNewpassword] = useState({
        mdp: ''
    })
    const [loading, setLoading] = useState(true); // État de chargement
    const [button, setButton] = useState<boolean>(false);
    const login = sessionStorage.getItem('mail')
    const password = sessionStorage.getItem('MDP')
    const [data, SetData] = useState<any | null>(null);
    const [personne, SetPersonne] = useState({
        nom: '',
        prenom: '',
        tele: '',
        telepro: '',
        mail: '',
        fonction: '',
        localisationS: ''
    })
    const id = params.id
    const idValue = id ?
        (Array.isArray(id) ? id[0] : id) :
        '';
    const number = parseInt(idValue)
    const api = async () => {
        try {
            const reponse = await fetch(`/api/Montfermeil/users/${idValue}`)
            const result = await reponse.json();
            SetData(result);
            SetPersonne({
                nom: result.nom ?? '',
                prenom: result.prenom ?? '',
                tele: result.numero ?? '',
                telepro: result.numeroPro ?? '',
                mail: result.mail ?? '',
                fonction: result.fonction ?? '',
                localisationS: result.localisation ?? 'NON_DEFINI'
            });
            setLoading(false); // Début du chargement

        } catch (error) {
            console.log(error)
        }
    }

    async function SendData(
        fonction: string,
        nomP: string,
        prenomP: string,
        emailP: string,
        telephoneportableP: string,
        localisationH: string,
        telpro: string
    ) {
        const payload = new URLSearchParams({
            nom: nomP,
            prenom: prenomP,
            mail: emailP,
            numero: telephoneportableP,
            numeroPro: telpro || '0',
            fonction: fonction,
            localisation: localisationH
        });

        try {
            const response = await fetch(`/api/Montfermeil/users/Modification/Salarie/${idValue}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: payload
            });

            if (!response.ok) {
                alert(`Erreur lors de la modification : ${response.statusText}`);
                return null;
            }

            alert("Modification effectuée avec succès !");
            router.push("/");
        } catch (error) {
            console.error(error);
        }
    }


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        SetPersonne({ ...personne, [e.target.name]: e.target.value });
    };

    const handlechangePassword = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setNewpassword({ ...passwordForgot, [e.target.name]: e.target.value })
    }
    function motDePasseValide(mdp: string): boolean {
        const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        return pattern.test(mdp);
    }

    async function passwordReset() {
        if (motDePasseValide(passwordForgot.mdp)) {
            try {
                const users = {
                    id: idValue || '',
                    password: passwordForgot.mdp || ''
                }
                const response = await fetch("/api/Montfermeil/users/PasswordReset", {
                    method: "PATCH",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams(users as Record<string, string>)
                })
                alert("Modification éffectuer avec succès");
                router.push('/')

            } catch (error) {
                console.log(error)
            }
        } else {
            setEchouay(false);
        }

    }
    useEffect(() => {
        if (sessionStorage.length == 0 || !sessionStorage.getItem('isAdmin')) {
            router.push('/')
        } else {
            api();
        }
    }, [])

    useEffect(() => {
        if (button) {
            SendData(personne.fonction, personne.nom, personne.prenom, personne.mail, personne.tele, personne.localisationS, personne.telepro);
            setButton(false);
        }
        if (submitButton && !button) {
            passwordReset()
            SetSubmit(false);
        }
    }, [button, submitButton])

    if (loading) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                flexDirection: "column"
            }}>
                <div className="spinner"></div>
                <p style={{ marginTop: "20px", fontSize: "18px", color: "#666" }}>
                    Chargement du salarié..
                </p>

                <style jsx>{`
                    .spinner {
                        border: 4px solid rgba(0, 0, 0, 0.1);
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                        border-left-color: #3498db;
                        animation: spin 1s linear infinite;
                    }
                    
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

  

    return (
        <div style={{ placeItems: "center" }}>
            <h1>Voici l'id : {id} </h1>
            <div style={{ placeItems: "center" }}>
                <button hidden={isInPasswordMode} onClick={() => SetPasswordMode(true)}>Modifier le mot de passe</button>
                <button hidden={show} onClick={() => SetPasswordMode(false)}>Modifier le salarié</button>

            </div>
            <div hidden={isInPasswordMode}>
                <table
                    border={1}
                    style={{
                        borderColor: "red",
                        margin: "auto",
                        width: "80%"
                    }}
                >
                    <thead>
                        <tr>
                            <th>Champ</th>
                            <th>Valeur</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <th>Nom</th>
                            <td>
                                <input
                                    name="nom"
                                    type="text"
                                    value={personne.nom}
                                    onChange={handleChange}
                                />
                            </td>
                        </tr>

                        <tr>
                            <th>Prénom</th>
                            <td>
                                <input
                                    name="prenom"
                                    type="text"
                                    value={personne.prenom}
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>

                        <tr>
                            <th>Email</th>
                            <td>
                                <input
                                    name="mail"
                                    type="email"
                                    value={personne.mail}
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>

                        <tr>
                            <th>Téléphone</th>
                            <td>
                                <input
                                    name="tele"
                                    type="text"
                                    pattern='[0-9]{*,10}'
                                    value={personne.tele}
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>TéléphonePro</th>
                            <td>
                                <input
                                    name="telepro"
                                    type="text"
                                    pattern='[0-9]{*,10}'
                                    value={personne.telepro}
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>

                        <tr>
                            <th>Service</th>
                            <td>
                                <div style={{ marginBottom: "5px" }}>
                                    <strong>Actuelle :</strong>
                                    <textarea
                                        value={personne.localisationS}
                                        disabled
                                        readOnly
                                    />
                                </div>

                                <div>
                                    <strong>Nouvelle :</strong>
                                    <select
                                        name="localisationS"
                                        value={personne.localisationS}
                                        onChange={handleChange}
                                    >
                                        <option value="NON_DEFINI">NON_DEFINI</option>
                                        <option value="VILLE_ÉDUCATIVE">VILLE_ÉDUCATIVE</option>
                                        <option value="PROSPERTCTIVE_ET_MUTATION_URBAINES">PROSPERTCTIVE_ET_MUTATION_URBAINES</option>
                                        <option value="VILLE_CULTURELLE">VILLE_CULTURELLE</option>
                                        <option value="VILLE_MODERNE">VILLE_MODERNE</option>
                                        <option value="COHÉSION_LOCALE">COHÉSION_LOCALE</option>
                                        <option value="VILLE_ATTRACTIVE">VILLE_ATTRACTIVE</option>
                                        <option value="DIRECTION_GÉNÉRALE">DIRECTION_GÉNÉRALE</option>
                                    </select>
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <th>Service</th>
                            <td>
                                {/* <input
                                    name="fonction"
                                    type="text"
                                    value={personne.fonction}
                                    onChange={handleChange}
                                    required
                                /> */}
                                <select
                                    name="fonction"
                                    value={personne.fonction}
                                    onChange={handleChange}
                                >
                                    <option disabled>--Direction Générale--</option>
                                    <option value="Police municipales">Police municipales</option>
                                    <option value="Cabinet">Cabinet</option>
                                    <option value="Communication">Communication</option>


                                    <option disabled>--Ville éducative--</option>
                                    <option value="4 Multi-accueils">4 Multi-acceuils</option>
                                    <option value="Relais petite enfance">Relais petite enfance</option>
                                    <option value="Scolaire restauration entretien">Scolaire restauration entretien</option>
                                    <option value="Enfance">Enfance</option>
                                    <option value="PRE">PRE</option>
                                    <option value="Jeunesse">Jeunesse</option>
                                    <option value="Animations sportives">Animations sportives</option>
                                    <option value="PIJ">PIJ</option>
                                    <option value="Mediation">Mediation</option>


                                    <option disabled>--Prospective et mutations urbaines--</option>
                                    <option value="Développement Urbain: Urbanisme">Développement Urbain: Urbanisme</option>
                                    <option value="Développement Urbain: Foncier">Développement Urbain: Foncier</option>
                                    <option value="Développement Urbain: PPSP">Développement Urbain: PPSP</option>
                                    <option value="Stratégies territoriales">Stratégies territoriales</option>
                                    <option value="Performance de l'habitat">Performance de l'habitat</option>


                                    <option disabled>--Ville attractive--</option>
                                    <option value="Batiments">Batiments</option>
                                    <option value="Festivités logistique">Festivités logistique</option>
                                    <option value="Ville nourricière">Ville nourricière</option>
                                    <option value="Transition énergétique">Transition énergétique</option>
                                    <option value="Environnement">Environnement</option>
                                    <option value="Mission d'appui">Mission d'appui</option>
                                    <option value="Espace public">Espace public</option>



                                    <option disabled>--Ville moderne--</option>
                                    <option value="Ressources humaines">Ressources humaines</option>
                                    <option value="Affaires juridiques">Affaires juridiques</option>
                                    <option value="Commandes publique">Commandes publique</option>
                                    <option value="Transformation numérique">Transformation numérique</option>
                                    <option value="Finances">Finances</option>
                                    <option value="Archives documentation">Archives documentation</option>
                                    <option value="Guichet unique">Guichet unique</option>


                                    <option disabled>--Cohésion local--</option>
                                    <option value="Agora">Agora</option>
                                    <option value="Vie des quartiers et citoyenneté">Vie des quartiers et citoyenneté</option>
                                    <option value="Animation commerciale patrimoniale">Animation commerciale patrimoniale</option>
                                    <option value="CCAS">CCAS</option>
                                    <option value="Inclusion et développement numérique">Inclusion et développement numérique</option>


                                    <option disabled>--Ville culturelle--</option>
                                    <option value="Ecoles municipales">Ecoles municipales</option>
                                    <option value="Programmation culturelle">Programmation culturelle</option>
                                    <option value="Coopération culturelle-Médicis">Coopération culturelle-Médicis</option>
                                    <option value="Grands évènements">Grands évènements</option>
                                    <option value="Médiathèque-Ludothèque">Médiathèque-Ludothèque</option>










                                </select>
                            </td>
                        </tr>

                        <tr>
                            <td colSpan={2}>
                                <button
                                    style={{ width: "100%" }}
                                    type="button"
                                    onClick={() => setButton(true)}
                                >
                                    Envoyer
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

            </div>
            <div hidden={show}>
                <table border={1}
                    style={{
                        borderColor: "red",
                        margin: "auto",
                        width: "80%"
                    }}

                >
                    <thead>
                        <tr>
                            <th>
                                Nouveau mot de passe:
                            </th>
                            <td>
                                <input style={{ width: "95%" }} onChange={handlechangePassword} type="password" name="mdp" id="" />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <button style={{ width: "100%" }} onClick={() => SetSubmit(true)} type="submit">Envoyer</button>
                            </td>
                        </tr>
                    </thead>
                </table>
                <div hidden={echouay}><h4 style={{ color: "red", textAlign: "center" }}><u>Veillez à ce que le mot de passe contienne : 1 lettre majuscule, 1 lettre minuscule, 1 caractère spécial, 1 chiffre, et qu'il comporte plus de 8 caractères.</u></h4></div>

            </div>

        </div>
    )
}

export default SalarieModification;