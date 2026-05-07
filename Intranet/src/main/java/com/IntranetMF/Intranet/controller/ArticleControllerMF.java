package com.IntranetMF.Intranet.controller;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.nio.file.StandardOpenOption;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.nio.file.Path;
import java.nio.file.Files;
import java.io.File;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
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
    private String logDir = "log/Article/" + LocalDate.now().getYear() + "/"
            + LocalDate.now().getMonthValue() + "/"
            + LocalDate.now().getDayOfMonth();

    public ArticleControllerMF(ArticleInterfacesMF articleControllerMF, SalarieInterfacesMF salarieInterfacesMF) {
        this.articleControllerMF = articleControllerMF;
        this.salarieInterfacesMF = salarieInterfacesMF;
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public Optional<ArticleMF> GetArticleWithId(@PathVariable Long id) {
        Optional<ArticleMF> article = articleControllerMF.findById(id);
        if (article.isPresent()) {
            String text = "Un salarier à chercher l'article" + article.get().getTitre();

            logContenu(text);
            return article;
        } else {
            throw new RuntimeException("Salarie not found with id: " + id);

        }
    }

    @GetMapping("/getArticle")
    @PreAuthorize("hasRole('USER')")
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
            if (type == null || type.isEmpty()) {
                System.out.println("Le type est vide");
            article.setType(com.IntranetMF.Intranet.modele.ArticleEnumMF.TypeArticle.Non_défini );

            }else{
            article.setType(com.IntranetMF.Intranet.modele.ArticleEnumMF.TypeArticle.valueOf(type));

            }
            article.setSalarie(salarie);

            // 4. Si fichier présent, enregistrer le nom et chemin
            if (uniqueFileName != null) {
                article.setMediaName(uniqueFileName);
                article.setPath("/uploads/" + uniqueFileName);
            }
            String text = salarie.getNom() + " " + salarie.getPrenom() + " à publier un article appelé : " + titre;

            logContenu(text);
            // 5. Sauvegarder dans la BDD
            articleControllerMF.save(article);

            return article;

        } catch (Exception e) {
            e.printStackTrace(); // Log
            return null;
        }
    }

    @PreAuthorize("hasRole('USER')")
    @DeleteMapping("/deleteArticle/{id}")
    public ResponseEntity<String> deleteArticle(
            @PathVariable Long id,
            @RequestParam("nom") String nom,
            @RequestParam("Prenom") String prenom) {

        Optional<ArticleMF> article = articleControllerMF.findById(id);

        if (article.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("L'article n'a pas été trouvé");
        }

        ArticleMF articleMF = article.get();
        String pathFichier = articleMF.getPath();

        if (pathFichier != null && !pathFichier.trim().isEmpty()) {
            try {
                Path chemin = Paths.get(pathFichier);
                Files.deleteIfExists(chemin);
                System.out.println("Fichier supprimé : " + chemin);
            } catch (IOException e) {
                System.out.println("Erreur suppression fichier : " + e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Erreur lors de la suppression du fichier");
            }
        } else {
            System.out.println("Aucun fichier à supprimer pour cet article");
        }

        articleControllerMF.deleteById(id);

        String text = nom + " " + prenom + " a supprimé l'article : " + articleMF.getTitre();
        logContenu(text);

        return ResponseEntity.status(HttpStatus.ACCEPTED)
                .body("L'article a bien été supprimé");
    }

    public void logContenu(String message) {
        String nomDuFichier = "LogsSalarier.txt";
        Path cheminPath = Paths.get(logDir, nomDuFichier);

        // créer dossier si nécessaire
        File dir = new File(logDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        String contenu = LocalDateTime.now() + " - " + message + "\n";

        try {
            Files.write(
                    cheminPath, // ✅ on passe le Path du fichier
                    contenu.getBytes(StandardCharsets.UTF_8),
                    StandardOpenOption.CREATE,
                    StandardOpenOption.APPEND);
        } catch (IOException e) {
            e.printStackTrace(); // au moins loguer l'erreur
        }
    }

}
