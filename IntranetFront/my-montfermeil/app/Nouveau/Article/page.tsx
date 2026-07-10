'use client';

import { useEffect, useState } from "react";
import "@/app/Nouveau/Article/style.css";
import { useRouter } from "next/navigation";
import { getSessionItemOrEmpty } from "@/app/utils/sessionStorage";

function CreationArticle() {
  const [file, setFile] = useState<File | null>(null);
  const [fonction, setFonction] = useState<string | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);


  const [article, setArticle] = useState({
    Titre: "",
    Desc: "",
    Types: "Non_defini",
    Media: null as File | null,
    MediaNom: "",
  });

  useEffect(() => {
    const f = getSessionItemOrEmpty("fonction");
    setFonction(f || null);

    if (!f || f !== "COMMUNICATION") {
      router.push("/");
    }
  }, [router]);

  async function HandleSubmit() {
    try {
      setLoading(true);

      const token = getSessionItemOrEmpty("token");
      const formData = new FormData();

      formData.append("description", article.Desc);
      formData.append("titre", article.Titre);
      formData.append("type", article.Types);

      const salarieId = getSessionItemOrEmpty("id");
      if (!salarieId) {
        return alert("aucun ID");
      }

      formData.append("salarieId", salarieId);

      if (article.Media) {
        formData.append("file", article.Media);
      }

      const response = await fetch("/api/Montfermeil/articles/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert("Votre article a été ajouté");
        router.push("/");
      } else {
        const json = await response.json();
        setLoading(false);

        alert("Erreur: " + (json.error || "Une erreur est survenue"));
      }
    } catch (error) {
      console.error(error);
      setLoading(false);

      alert("Erreur lors de la publication de l'article.");
    }
  }

  const handleChange = (e: any) => {
    const { name, value, type, files } = e.target;

    if (type === "file" && files && files.length > 0) {
      setFile(files[0]);
      setArticle((prev) => ({
        ...prev,
        Media: files[0],
        MediaNom: files[0].name,
      }));
      return;
    }

    setArticle((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeTextArea = (e: any) => {
    setArticle({ ...article, [e.target.name]: e.target.value });
  };

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
          Ajout de l'article..
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
    <main className="article-creation-page">
      <section className="article-creation-card">
        <h1>Bienvenue dans la création d'un article</h1>
        <p className="article-notes">
          Notes : pour les médias, privilégiez les extensions image (jpg, jpeg, png, gif, webp) ou vidéo (mp4, webm, ogg).
        </p>

        <table className="article-table">
          <tbody>
            <tr>
              <th>Le titre de votre article :</th>
              <td>
                <input
                  className="input-field"
                  onChange={handleChange}
                  type="text"
                  name="Titre"
                  value={article.Titre}
                />
              </td>
            </tr>
            <tr>
              <th>La description ou les détails :</th>
              <td>
                <textarea
                  className="textarea-field"
                  onChange={handleChangeTextArea}
                  name="Desc"
                  value={article.Desc}
                />
              </td>
            </tr>
            <tr>
              <th>Types d'événement :</th>
              <td>
                <select className="select-field" onChange={handleChange} name="Types" value={article.Types}>
                  {/* <option value="Non_defini">Non_defini</option> */}
                  <option value="Message">Message</option>
                  <option value="Évennement">Évènement</option>
                  <option value="Information">Information</option>
                  <option value="Important">Important</option>
                  <option value="Annonce">Annonce</option>
                </select>
              </td>
            </tr>
            <tr>
              <th>Une image ou une vidéo :</th>
              <td>
                <input
                  className="file-input"
                  onChange={handleChange}
                  accept="image/*,video/*"
                  type="file"
                  name="Media"
                />
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                <button className="submit-button" type="button" onClick={HandleSubmit}>
                  Envoyer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  );
}
export default CreationArticle;
