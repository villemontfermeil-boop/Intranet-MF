"use client";

import { useEffect, useState } from "react";
import "./style.css";
import { useRouter } from "next/navigation";
import { getSessionBoolean, getSessionItemOrEmpty } from "@/app/utils/sessionStorage";

function Moi() {
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
  const [image, setImage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [editing, setEditing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [backend, setBackend] = useState<any>({});

  const router = useRouter();

  const profileImage = image?.photo
    ? `${backend.api}/uploads/Photos/${image.photo}`
    : "/cerclePhoto.png";

  async function getBackend() {
    try {
      const tokenValue = getSessionItemOrEmpty("token");
      const res = await fetch(`/api/Montfermeil/connexion`, {
        headers: {
          authorization: tokenValue,
        },
      });
      const data = await res.json();
      setBackend(data);
      setLoading2(false);
    } catch (err) {
      console.log(err);
      setLoading2(false);
    }
  }

  async function getProfile(oneId: string) {
    if (!oneId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const tokenValue = getSessionItemOrEmpty("token");
      const response = await fetch(`/api/Montfermeil/users/Photo/${oneId}`, {
        headers: {
          Authorization: `Bearer ${tokenValue}`,
        },
      });

      if (response.status === 404) {
        setImage(null);
        return;
      }

      if (!response.ok) {
        console.log(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      setImage(data);
    } catch (e) {
      console.error("Erreur chargement photo:", e);
      setImage(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!getSessionBoolean("isConnected")) {
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
  }, []);

  useEffect(() => {
    if (!person.id) return;
    getBackend();
    getProfile(person.id);
  }, [person.id]);

  async function handleSubmit() {
    if (!file) {
      alert("Veuillez sélectionner un fichier");
      return;
    }

    const FD = new FormData();
    FD.append("file", file);
    const email = getSessionItemOrEmpty("mail");

    if (!email) {
      alert("Email introuvable, reconnecte-toi");
      return;
    }
    FD.append("email", email);

    try {
      setUploading(true);
      const tokenValue = getSessionItemOrEmpty("token");
      const response = await fetch("/api/Montfermeil/users/Photo/NewPhoto", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${tokenValue}`,
        },
        body: FD,
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

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  if (loading && loading2) {
    return (
      <div className="profile-spinner">
        <div className="spinner-element" />
        <p>Chargement de votre profil...</p>
      </div>
    );
  }

  return (
    <main className="profile-page">
      <section className="profile-header">
        <h1>
          <u>
            {person.nom} {person.prenom}
          </u>
        </h1>
      </section>

      <div className="profile-layout">
        <aside className="photo-card">
          <img src="/cadre.png" className="profile-frame" alt="cadre" />
          <img
            src={preview || profileImage}
            className={`profile-avatar ${loading ? "profile-avatar--loading" : ""}`}
            alt="profile"
          />
          <button
            className="profile-button"
            onClick={() => {
              setEditing(!editing);
              setFile(null);
              setPreview(null);
            }}
            disabled={uploading}
          >
            {editing ? "Annuler" : "Changer"}
          </button>
        </aside>

        <section className="profile-card">
          {!editing ? (
            <table className="profile-table">
              <tbody>
                <tr>
                  <th>Service:</th>
                  <td>{person.Service}</td>
                </tr>
                <tr>
                  <th>Localisation:</th>
                  <td>
                    <span className="profile-link" onClick={() => router.push(`/Annuaire/Organisme/${organisme}`)}>
                      <u>{person.fonction}</u>
                    </span>
                  </td>
                </tr>
                <tr>
                  <th>Numero:</th>
                  <td>
                    <u><a  style={{color: "blue"}}href={`tel:${person.numero}`}>{person.numero || "NON_DÉFINI"}</a></u>
                  </td>
                </tr>
                <tr>
                  <th>Téléphone pro:</th>
                  <td>
                    <u> <a style={{color: "blue"}} href={`tel:${person.telpro}`}>{person.telpro || "NON_DÉFINI"}</a></u>
                  </td>
                </tr>
                <tr>
                  <th>Email:</th>
                  <td>
                    <u> <a style={{color: "blue"}} href={`mailto:${person.mail}`}>{person.mail}</a></u>
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <table className="profile-table">
              <tbody>
                <tr>
                  <th>Nouvelle image</th>
                  <td>
                    <input
                      type="file"
                      accept="image/*"
                      className="profile-form-input"
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
                          const selected = files[0];
                          setFile(selected);
                          setPreview(URL.createObjectURL(selected));
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
                      className="profile-button"
                      disabled={uploading || !file}
                    >
                      {uploading ? "Envoi en cours..." : "Envoyer"}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </section>
      </div>
    </main>
  );
}

export default Moi;
