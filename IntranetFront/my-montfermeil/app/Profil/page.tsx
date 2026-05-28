"use client";

import { useEffect, useState } from "react";
import "./style.css";
import { useRouter } from "next/navigation";
import { getSessionBoolean, getSessionItemOrEmpty, isBrowser } from "@/app/utils/sessionStorage";

function Moi() {
  // États pour les données
  const [person, setPerson] = useState({
    nom: "",
    prenom: "",
    mail: "",
    numero: "",
    Service: "",
    fonction: "",
    telpro: "",
    id: "",
  });
  const [organisme, setOrganisme] = useState("");
  const [token, setToken] = useState("");

  console.log(person);
  // États pour l'image et le chargement
  const [image, setImage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);

  // États pour l'édition
  const [editing, setEditing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [backend, setBackend] = useState<any>({});

  const router = useRouter();

  // Image de profil (avec fallback)
  const profileImage = image?.photo
    ? `${backend.api}/uploads/Photos/${image.photo}`
    : "/cerclePhoto.png";

  async function getBackend() {
    try {
      const tokenValue = getSessionItemOrEmpty('token');

      const res = await fetch(`/api/Montfermeil/connexion`, {
        headers: {
          authorization: tokenValue,
        },
      });
      const data = await res.json();

      console.log("DATA api :", data);

      setBackend(data);
      setLoading2(false);
    } catch (err) {
      console.log(err);
    }
  }

  // 🔹 Récupération photo utilisateur
  async function getProfile(oneId: string) {
    if (!oneId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const tokenValue = getSessionItemOrEmpty('token');
      const response = await fetch(`/api/Montfermeil/users/Photo/${oneId}`, {
        headers: {
          Authorization: `Bearer ${tokenValue}`,
        },
      });

      // 🔹 Pas de photo => image par défaut
      if (response.status === 404) {
        console.log("Pas de photo utilisateur");
        setImage(null);
        return;
      }

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      setImage(data);

    } catch (e) {

      console.error("Erreur chargement photo:", e);

      // 🔹 fallback image par défaut
      setImage(null);

    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (!isBrowser || !getSessionBoolean("isConnected")) {
      return;
    }

    setPerson({
      nom: getSessionItemOrEmpty("nom"),
      prenom: getSessionItemOrEmpty("prenom"),
      mail: getSessionItemOrEmpty("mail"),
      numero: getSessionItemOrEmpty("numero"),
      Service: getSessionItemOrEmpty("localisation"),
      fonction: getSessionItemOrEmpty("fonction"),
      telpro: getSessionItemOrEmpty("telephonepro"),
      id: getSessionItemOrEmpty("id"),
    });

    setOrganisme(getSessionItemOrEmpty("organisme"));
    setToken(getSessionItemOrEmpty("token"));
  }, []);

  // Chargement initial
  useEffect(() => {
    if (!person.id) return;

    getBackend();
    getProfile(person.id);
  }, [person.id]);

  // 🔹 Envoi de la nouvelle photo
  async function handleSubmit() {
    if (!file) {
      alert("Veuillez sélectionner un fichier");
      return;
    }

    const FD = new FormData();
    FD.append("file", file as File);
    const email = getSessionItemOrEmpty("mail");

    if (!email) {
      alert("Email introuvable, reconnecte-toi")
      return
    }
    console.log("EMAIL ENVOYÉ =", email)
    FD.append("email", email)

    try {
      setUploading(true);
      const tokenValue = getSessionItemOrEmpty('token');
      const response = await fetch("api/Montfermeil/users/Photo/NewPhoto", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${tokenValue}`
        },
        body: FD
      });

      const json = await response.json();

      if (response.ok) {
        alert("Modification effectuée avec succès");
        router.push("/");
        router.refresh();
      } else {
        alert("Erreur: " + (json.error || "Une erreur est survenue"));
      }
    } catch (ex) {
      console.error(ex);
      alert("Erreur de connexion au serveur");
    } finally {
      setUploading(false);
    }
  }

  // 🔹 Nettoyage des URLs de preview
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // Afficher un loader pendant le chargement initial
  if (loading && loading2) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column"
      }}>
        <div className="spinner"></div>
        <p style={{ marginTop: "20px" }}>Chargement de votre profil...</p>

        {/* Style pour le spinner */}
        <style jsx>{`
          .spinner {
            border: 4px solid rgba(0, 0, 0, 0.1);
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border-left-color: #09f;
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
  console.log(organisme)



  return (
    <div>
      <div style={{ placeItems: "center" }}>
        <h1>
          <u>
            {person.nom} {person.prenom}
          </u>
        </h1>

        <div className="layout">
          <div className="PhotoCLass">
            <img src="/cadre.png" className="Conteneur" alt="cadre" />

            {/* IMAGE avec indicateur de chargement si pas encore chargée */}
            <img
              src={preview || profileImage}
              className="PP"
              alt="profile"
              style={{ opacity: loading ? 0.5 : 1 }}
            />

            <button
              className="MenuButtonN"
              onClick={() => {
                setEditing(!editing);
                setFile(null);
                setPreview(null);
              }}
              disabled={uploading}
            >
              {editing ? "Annuler" : "Changer"}
            </button>
          </div>

          {/* MODE VISUALISATION */}
          {!editing ? (
            <table border={1} className="MyTable">
              <tbody>
                <tr>
                  <th>Service:</th>
                  <td>{person.Service}</td>

                </tr>
                <tr>
                  <th>Localisation:</th>
                  <td
                    onClick={() => router.push(`/Annuaire/Organisme/${organisme}`)}
                    style={{ cursor: "pointer", color: "blue" }}
                  > <u>
                    {person.fonction}
                  </u></td>


                </tr>
                <tr>
                  <th>Numero:</th>
                  <td><a href={`tel:${person.numero}`}>{person.numero || "NON_DÉFINI"}</a></td>
                </tr>
                <tr>
                  <th>Téléphone pro:</th>
                  <td><a href={`tel:${person.telpro}`}>{person.telpro || "NON_DÉFINI"}</a></td>
                </tr>
                <tr>
                  <th>Email:</th>
                  <td>
                    <a href={`mailto:${person.mail}`}>
                      {person.mail}
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            /* MODE ÉDITION */
            <table border={1} className="MyTable">
              <tbody>
                <tr>
                  <th>Nouvelle image</th>
                  <td>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
                          const selected = files[0];
                          setFile(selected);
                          const previewUrl = URL.createObjectURL(selected);
                          setPreview(previewUrl);
                        }
                      }}
                      disabled={uploading}
                    />
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <button
                      onClick={handleSubmit}
                      style={{
                        width: "100%",
                        padding: "10px",
                        backgroundColor: uploading ? "#ccc" : "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: uploading ? "not-allowed" : "pointer"
                      }}
                      disabled={uploading || !file}
                    >
                      {uploading ? (
                        <span>
                          <span style={{ marginRight: "10px" }}>⏳</span>
                          Envoi en cours...
                        </span>
                      ) : (
                        "Envoyer"
                      )}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Moi;