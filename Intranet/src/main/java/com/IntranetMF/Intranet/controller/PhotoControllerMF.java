package com.IntranetMF.Intranet.controller;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.io.File;
import java.io.IOException;
import java.nio.file.StandardCopyOption;
import java.nio.file.StandardOpenOption;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;
import com.IntranetMF.Intranet.repository.PhotoInterfacesMF;
import com.IntranetMF.Intranet.modele.PhotoMF;
import com.IntranetMF.Intranet.modele.SalarieMF;
import com.IntranetMF.Intranet.repository.SalarieInterfacesMF;

/**
 * Controller REST pour gérer les photos de profil des salariés.
 *
 * Permet d'ajouter, récupérer et modifier l'image de profil d'un salarié.
 */
@RestController
@RequestMapping("/Photo")
public class PhotoControllerMF {

    private final String uploadDir = "uploads/Photos";
    private final PhotoInterfacesMF photoInterfacesMF;
    private final SalarieInterfacesMF salarieMF;

    private String logDir = "log/Photo/" + LocalDate.now().getYear() + "/"
            + LocalDate.now().getMonthValue() + "/"
            + LocalDate.now().getDayOfMonth();

    public PhotoControllerMF(PhotoInterfacesMF photoInterfacesMF, SalarieInterfacesMF salarieMF) {
        this.photoInterfacesMF = photoInterfacesMF;
        this.salarieMF = salarieMF;
    }

/**
     * Enregistre une nouvelle photo de profil pour un salarié.
     *
     * @param file Le fichier image téléchargé.
     * @param mail L'adresse e-mail du salarié.
     * @return une réponse HTTP contenant un message de succès ou d'erreur.
     */
    @PostMapping("/Nouveaux")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> newPhoto(@RequestParam("file") MultipartFile file, @RequestParam String mail) {
        if (!file.getContentType().startsWith("image/")) {
            return ResponseEntity.badRequest().body("Fichier invalide");

        }
        Optional<SalarieMF> verificationDuSalarie = salarieMF.findByMail(mail);
        if (verificationDuSalarie.isPresent()) {
            SalarieMF salarie = verificationDuSalarie.get();
            if (salarie.getIsConnected() == false) {
                throw new RuntimeException("L'utilisateur doit etre connecter sur le site");
            }
            Optional<PhotoMF> photo = photoInterfacesMF.findBySalarie(salarie);

            if (photo.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Le salarier à déja une photo");
            }

        } else {
            return ResponseEntity.badRequest().body("Salarier non trouvé");

        }

        try {
            File fichier = new File(uploadDir);

            if (!fichier.exists()) {
                fichier.mkdirs();
            }

            String nomDuFichier = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path cheminPath = Paths.get(uploadDir, nomDuFichier);

            Files.copy(file.getInputStream(), cheminPath, StandardCopyOption.REPLACE_EXISTING);

            SalarieMF unSalarie = salarieMF.findByMail(mail).orElseThrow(() -> new RuntimeException("Salarié non trouver"));
            PhotoMF unePhotoMF = new PhotoMF();
            unePhotoMF.setModification();
            unePhotoMF.setPhoto(nomDuFichier);
            unePhotoMF.setPath(uploadDir);
            unePhotoMF.setSalarieMF(unSalarie);
            photoInterfacesMF.save(unePhotoMF);

            System.out.print("Le salarié" + unSalarie.getNom() + " " + unSalarie.getPrenom() + " à changer son profil");

            String text = unSalarie.getNom() + " " + unSalarie.getPrenom() + " à changer sa photo de profil : "
                    + nomDuFichier;

            logContenu(text);
            return ResponseEntity.ok("Image ajouter à " + LocalDate.now());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Il y'a une erreur");

        }
    }

/**
     * Récupère la photo de profil d'un salarié.
     *
     * @param id L'identifiant du salarié.
     * @return un Optional contenant la photo si trouvée.
     */
    @GetMapping("/Profile/{id}")
    @PreAuthorize("hasRole('USER')")
    public Optional<PhotoMF> getProfileImage(@PathVariable Long id) {
        Optional<SalarieMF> salarie = salarieMF.findById(id);

        if (salarie.isPresent()) {
            Optional<PhotoMF> profil = photoInterfacesMF.findBySalarie(salarie.get());
            if (profil.isPresent()) {

                String text = "Un salarié à chercher le photo de profil de :" + salarie.get().getNom() + " "
                        + salarie.get().getPrenom();
                logContenu(text);
                return profil;
            } else {
                throw new RuntimeException("2: Salarie not found with id: " + id);

            }
        }
        throw new RuntimeException("1: Salarie not found with id: " + id);

    }

/**
     * Modifie la photo de profil existante d'un salarié.
     *
     * @param file  Le nouveau fichier image.
     * @param email L'adresse e-mail du salarié.
     * @return une réponse HTTP indiquant le résultat de la modification.
     */
    @PutMapping("/Modifier")
    public ResponseEntity<String> modifyProfileImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam String email) {

        // Vérifier que c'est bien un fichier .jpg /.png

        System.out.println("Recherche du salarié avec l'ID: " + email);
        Optional<SalarieMF> salarier = salarieMF.findByMail(email);

        if (salarier.isPresent()) {
            SalarieMF Lesalarier = salarier.get();
            System.out.println("Salarié trouvé: " + Lesalarier.getNom() + " " + Lesalarier.getPrenom());

            if (Lesalarier.getIsConnected() == false) {
                throw new RuntimeException("L'utilisateur doit etre connecter sur le site");
            }
            Optional<PhotoMF> unePhoto = photoInterfacesMF.findBySalarie(Lesalarier);

            if (unePhoto.isPresent()) {
                PhotoMF nouvellePhoto = unePhoto.get();

                try {

                    String ancienNomFichier = nouvellePhoto.getPhoto();
                    System.out.println("Ancien fichier: " + ancienNomFichier);

                    String nouveauNomFichier = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                    Path nouveauChemin = Paths.get(uploadDir, nouveauNomFichier);

                    if (ancienNomFichier != null && !ancienNomFichier.isEmpty()) {
                        Path ancienChemin = Paths.get(uploadDir, ancienNomFichier);
                        if (Files.exists(ancienChemin)) {
                            Files.delete(ancienChemin);
                            System.out.println("Ancien fichier supprimé: " + ancienNomFichier);
                        } else {
                            System.out.println("Ancien fichier non trouvé sur le disque: " + ancienNomFichier);
                        }
                    }

                    // 4️⃣ Sauvegarder le NOUVEAU fichier
                    Files.copy(file.getInputStream(), nouveauChemin, StandardCopyOption.REPLACE_EXISTING);
                    System.out.println("Nouveau fichier sauvegardé: " + nouveauNomFichier);

                    // 5️⃣ Mettre à jour la base de données avec le NOUVEAU nom
                    nouvellePhoto.setPhoto(nouveauNomFichier);
                    nouvellePhoto.setModification();
                    // Si vous avez un champ path, mettez-le à jour aussi
                    // nouvellePhoto.setPath(uploadDir);

                    PhotoMF saved = photoInterfacesMF.save(nouvellePhoto);

                    System.out.println("Le salarié " + Lesalarier.getNom() + " " + Lesalarier.getPrenom() +
                            " a changé son image le " + LocalDate.now());

                    String text = "Le salarié " + Lesalarier.getNom() + " " + Lesalarier.getPrenom() +
                            " a changé son image le " + LocalDate.now();
                          
                    logContenu(text);

                    return ResponseEntity.status(HttpStatus.ACCEPTED)
                            .body("Image modifiée avec succès ");

                } catch (IOException ex) {
                    ex.printStackTrace();
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("Erreur IO: " + ex.getMessage());
                }
            } else {
                return ResponseEntity.badRequest().body("Photo non trouvée pour le salarié : " + email);
            }
        }

        return ResponseEntity.badRequest().body("Salarié non trouvé : " + email);
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