package com.IntranetMF.Intranet.controller;

import java.nio.file.Paths;
import java.time.LocalDateTime;

import com.IntranetMF.Intranet.modele.ArticleMF;
import com.IntranetMF.Intranet.modele.SalarieMF;
import com.IntranetMF.Intranet.repository.ArticleInterfacesMF;
import com.IntranetMF.Intranet.repository.SalarieInterfacesMF;

import org.springframework.web.bind.annotation.RequestParam;

import jakarta.websocket.server.PathParam;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.IntranetMF.Intranet.modele.ArticleMF;

@RestController
@RequestMapping("/Article")
public class ArticleControllerMF {
    private final ArticleInterfacesMF articleControllerMF;
    private final SalarieInterfacesMF salarieInterfacesMF;

    public ArticleControllerMF(ArticleInterfacesMF articleControllerMF, SalarieInterfacesMF salarieInterfacesMF) {
        this.articleControllerMF = articleControllerMF;
        this.salarieInterfacesMF = salarieInterfacesMF;
    }

    @GetMapping("/{id}")
    public Optional<ArticleMF> GetArticleWithId(@PathVariable Long id) {
        Optional<ArticleMF> article = articleControllerMF.findById(id);
        if (article.isPresent()) {
            return article;
        } else {
            throw new RuntimeException("Salarie not found with id: " + id);

        }
    }

    @GetMapping("/getArticle")
    public List<ArticleMF> getArticle() {
        return articleControllerMF.findAll();

    }

    @PostMapping(value = "/upload", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ArticleMF uploadFile(
            @RequestParam("description") String description,
            @RequestParam("salarieId") Long salarieId,
            @RequestParam("type") String type,
            @RequestParam("titre") String titre,
            @RequestParam("file") MultipartFile file) {

        try {
            // 1. Vérifier que le fichier n'est pas vide
            if (file.isEmpty()) {
                return null;
            }

            // 2. Générer un nom unique pour le fichier
            String originalFilename = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String uniqueFileName = UUID.randomUUID().toString() + fileExtension;

            // 3. Créer le dossier "uploads" s'il n'existe pas
            Path uploadDir = Paths.get("src/main/resources/static/uploads");
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            // 4. Sauvegarder le fichier sur le disque
            Path filePath = uploadDir.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // 5. Trouver le salarié
            SalarieMF salarie = salarieInterfacesMF.findById(salarieId)
                    .orElseThrow(() -> new RuntimeException("Salarié non trouvé avec ID: " + salarieId));

            // 6. Créer l'article (comme ta méthode NewArticle mais avec fichier)
            ArticleMF article = new ArticleMF();
            article.setDescription(description);
            article.setCreation(); // Met la date actuelle
            article.setMediaName(uniqueFileName); // Nom unique du fichier
            article.setPath("/uploads/" + uniqueFileName); // Chemin d'accès
            article.setSalarie(salarie);
            article.setTitre(titre);
            article.setType(com.IntranetMF.Intranet.modele.ArticleEnumMF.TypeArticle.valueOf(type));

            // 7. Sauvegarder dans la BDD
            articleControllerMF.save(article);

            return  article;

        } catch (Exception e) {
            e.printStackTrace(); // Pour voir l'erreur dans les logs
            return null;
        }
    }

}
