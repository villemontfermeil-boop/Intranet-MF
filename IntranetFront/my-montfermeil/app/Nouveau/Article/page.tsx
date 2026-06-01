'use client';

import { useEffect, useState } from "react";
import "@/app/Nouveau/Article/style.css";
import { useRouter } from "next/navigation";
import { getSessionItemOrEmpty } from "@/app/utils/sessionStorage";

function CreationArticle() {
  const [file, setFile] = useState<File | null>(null);
  const [fonction, setFonction] = useState<string | null>(null);
  const router = useRouter();

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
        alert("Erreur: " + (json.error || "Une erreur est survenue"));
      }
    } catch (error) {
      console.error(error);
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
                  <option value="Non_defini">Non défini</option>
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
