'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "@/app/home.css";
import { getSessionBoolean, getSessionItemOrEmpty } from "@/app/utils/sessionStorage";

interface Article {
  id?: number | string;
  titre?: string;
  creation?: string;
  description?: string;
  type?: string;
  mediaName?: string;
  salarie?: {
    id?: string;
    nom?: string;
    prenom?: string;
  };
}



function HomePage() {
  const [data, setData] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const prefix = process.env.NEXT_PUBLIC_PREFIX ?? "";
  const normalizedPrefix = prefix ? (prefix.endsWith("/") ? prefix : `${prefix}/`) : "";

  const isVideo = (fileName: string) => {
    const videoExtensions = ["mp4", "webm", "ogg"];
    const parts = fileName.split(".");
    const extension = parts.pop()?.toLowerCase();
    return videoExtensions.includes(extension || "");
  };

  const isImage = (fileName: string) => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
    const parts = fileName.split(".");
    const extension = parts.pop()?.toLowerCase();
    return imageExtensions.includes(extension || "");
  };

  const getArticleClass = (type = "") => {
    const normalized = type.trim().toLowerCase();

    if (normalized === "évennement" || normalized === "evennement") {
      return "article-card article-card--evenement";
    }

    if (normalized === "important") {
      return "article-card article-card--important";
    }

    if (normalized === "annonce") {
      return "article-card article-card--annonce";
    }

    if (normalized === "message") {
      return "article-card article-card--message";
    }

    if (normalized === "information") {
      return "article-card article-card--information";
    }

    if (normalized === "non_défini" || normalized === "non_defini") {
      return "article-card article-card--nondefini";
    }

    return "article-card article-card--default";
  };

  async function getArticle() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/Montfermeil/articles/", {
        headers: {
          Authorization: `Bearer ${getSessionItemOrEmpty("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const json = await response.json();
      console.log(json);

      let articles: any[] = [];
      if (Array.isArray(json)) {
        articles = json;
      } else if (json && typeof json === "object") {
        if (Array.isArray(json.data)) {
          articles = json.data;
        } else if (Array.isArray((json as any).articles)) {
          articles = (json as any).articles;
        } else if (Array.isArray((json as any)._embedded?.articles)) {
          articles = (json as any)._embedded.articles;
        } else if (json && (json.titre || json.title || json.id || json.mediaName)) {
          articles = [json as any];
        } else {
          console.warn("API returned an object but no articles array found, defaulting to empty array", json);
        }
      } else {
        console.warn("API returned non-object/non-array response", json);
      }

      setData(articles);
    } catch (error) {
      console.error("Erreur lors du chargement des articles:", error);
      setError("Impossible de charger les articles. Veuillez réessayer et pensez à rafraichir la page.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteArticle(Articleid: string) {
    setLoading(true);
    const nom = getSessionItemOrEmpty("nom");
    const prenom = getSessionItemOrEmpty("prenom");
    const body = new URLSearchParams({ nom, Prenom: prenom });
    const token = getSessionItemOrEmpty("token");

    try {
      const response = await fetch(`/api/Montfermeil/articles/delete/${Articleid}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
        body: body.toString(),
      });

      if (response.ok) {
        alert("Suppression effectuée.");
        router.refresh();
      } else {
        console.error("Erreur suppression article", response.statusText);
      }
    } catch (ex) {
      console.error(ex);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getArticle();
  }, []);

  if (loading) {
    return (
      <div className="spinner-state">
        <div className="spinner" />
        <p className="spinner-text">Chargement des actualités…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <p>❌ {error}</p>
        <button className="retry-button" onClick={getArticle}>
          Réessayer
        </button>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="empty-state">
        <p>Aucun article disponible pour le moment.</p>
      </div>
    );
  }

  return (
    <main className="home-page">
      <section className="hero-section">
        <h1 className="home-title">Bienvenue sur l'intranet de la ville de Montfermeil 2.0</h1>
        <p className="home-subtitle">
          Retrouvez les dernières actualités, événements et messages internes dans un espace moderne et clair.
        </p>
      </section>

      <section className="articles-container">
        {data.map((value, index) => {
          const articleKey = value.id ? value.id.toString() : `article-${index}`;
          return (
            <article key={articleKey} className={getArticleClass(value.type)}>
              {getSessionBoolean("isConnected") && getSessionItemOrEmpty("fonction") === "COMMUNICATION" && (
                <button className="article-delete-button" type="button" onClick={() => deleteArticle(value.id?.toString() ?? "")}> 
                  <img src="/cross.png" alt="Supprimer" />
                </button>
              )}

              <h4 className="article-card__title"><u>{value.titre}</u></h4>
              <div className="article-meta">
                <span>Créé le : {value.creation}</span>
                <span>
                  Par: {getSessionBoolean("isConnected") ? (
                    <a className="author-link" onClick={() => router.push(`/Annuaire/Salarie/${value.salarie?.id}`)}>
                      {value.salarie?.nom} {value.salarie?.prenom}
                    </a>
                  ) : (
                    `${value.salarie?.nom ?? ""} ${value.salarie?.prenom ?? ""}`
                  )}
                </span>
              </div>
              <p className="article-text" style={{textAlign: "center"}}>{value.description}</p>

              {value.mediaName && isVideo(value.mediaName) && (
                <video controls className="media">
                  <source src={`${normalizedPrefix}${value.mediaName}`} />
                  Votre navigateur ne supporte pas la vidéo.
                </video>
              )}

              {value.mediaName && isImage(value.mediaName) && (
                <img
                  src={`${normalizedPrefix}${value.mediaName}`}
                  alt={value.description}
                  className="media"
                />
              )}
            </article>
          );
        })}
      </section>

      
    </main>
  );
}

export default HomePage;
