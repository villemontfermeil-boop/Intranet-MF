package com.IntranetMF.Intranet.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.IntranetMF.Intranet.modele.ArticleMF;
import com.IntranetMF.Intranet.modele.SalarieMF;
import com.IntranetMF.Intranet.repository.ArticleInterfacesMF;
import com.IntranetMF.Intranet.repository.SalarieInterfacesMF;

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
        return articleControllerMF.findAllByOrderByDateDesc();

    }

    @PostMapping(value = "/upload", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('USER')")
    public ArticleMF uploadFile(
            @RequestParam("description") String description,
            @RequestParam("salarieId") Long salarieId,
            @RequestParam("type") String type,
            @RequestParam("titre") String titre,
            @RequestParam(value = "file", required = false) MultipartFile file) { // <-- file optionnel

        try {
            String uniqueFileName = null; // Nom du fichier si présent

            // 1. Vérifier que le fichier est présent et non vide
            if (file != null && !file.isEmpty()) {
                String originalFilename = file.getOriginalFilename();
                String fileExtension = "";
                if (originalFilename != null && originalFilename.contains(".")) {
                    fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
                }
                uniqueFileName = UUID.randomUUID().toString() + fileExtension;

                // Créer le dossier uploads s'il n'existe pas
                Path uploadDir = Paths.get("src/main/resources/static/uploads");
                if (!Files.exists(uploadDir)) {
                    Files.createDirectories(uploadDir);
                }

                // Sauvegarder le fichier
                Path filePath = uploadDir.resolve(uniqueFileName);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            }

            // 2. Trouver le salarié
            SalarieMF salarie = salarieInterfacesMF.findById(salarieId)
                    .orElseThrow(() -> new RuntimeException("Salarié non trouvé avec ID: " + salarieId));

            // 3. Créer l'article
            ArticleMF article = new ArticleMF();
            article.setDescription(description);
            article.setCreation(); // Date actuelle
            article.setTitre(titre);
            article.setType(com.IntranetMF.Intranet.modele.ArticleEnumMF.TypeArticle.valueOf(type));
            article.setSalarie(salarie);

            // 4. Si fichier présent, enregistrer le nom et chemin
            if (uniqueFileName != null) {
                article.setMediaName(uniqueFileName);
                article.setPath("/uploads/" + uniqueFileName);
            }

            // 5. Sauvegarder dans la BDD
            articleControllerMF.save(article);

            return article;

        } catch (Exception e) {
            e.printStackTrace(); // Log
            return null;
        }
    }

}
