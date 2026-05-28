package com.IntranetMF.Intranet.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import java.util.UUID;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import java.util.Optional;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Files;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import java.nio.file.StandardCopyOption;
import java.nio.file.StandardOpenOption;
import jakarta.transaction.Transactional;
import jakarta.websocket.server.PathParam;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import com.IntranetMF.Intranet.modele.TelechargementMF;
import com.IntranetMF.Intranet.repository.TelechargementInterface;
import com.IntranetMF.Intranet.modele.SalarieMF;
import com.IntranetMF.Intranet.repository.SalarieInterfacesMF;
import com.IntranetMF.Intranet.modele.ArticleMF;
import com.IntranetMF.Intranet.modele.OganigrameMF;
import com.IntranetMF.Intranet.repository.OrganismeInterfacesMF;

/**
 * Controller REST pour les fichiers de téléchargement.
 *
 * Permet d'uploader, lister, récupérer et supprimer des fichiers liés
 * aux organigrammes.
 */
@RestController
@RequestMapping("/telechargement")
public class TelechargementController {

    private final TelechargementInterface telechargementInterface;
    private final SalarieInterfacesMF salarieControllerMF;
    private final OrganismeInterfacesMF organismeInterfacesMF;
    private final String uploadDir = "uploads/Documents";

    private String logDir = "log/Telechargement/"
            + LocalDate.now().getYear() + "/"
            + LocalDate.now().getMonthValue() + "/"
            + LocalDate.now().getDayOfMonth();

    public TelechargementController(TelechargementInterface t, SalarieInterfacesMF s, OrganismeInterfacesMF o) {
        this.telechargementInterface = t;
        this.salarieControllerMF = s;
        this.organismeInterfacesMF = o;
    }

    /**
     * Enregistre un nouveau téléchargement de fichier.
     *
     * @param jwt       Le jeton JWT de l'utilisateur authentifié.
     * @param file      Le fichier téléchargé.
     * @param nom       Le nom donné au fichier.
     * @param organisme L'identifiant de l'organisme associé.
     * @return l'objet TelechargementMF créé.
     */
    @PostMapping(value = "/nouveaux/fichier", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public TelechargementMF nouveauxTelechargement(@AuthenticationPrincipal Jwt jwt,
            @RequestParam("file") MultipartFile file, String nom, Long organisme) {
        String email = jwt.getClaim("email");
        Optional<SalarieMF> salarie = salarieControllerMF.findByMail(email);

        if (salarie.isPresent()) {
            if (salarie.get().getIsConnected()) {

                try {
                    File fichier = new File(uploadDir);
                    if (!fichier.exists()) {
                        fichier.mkdir();
                    }
                    String nomDuFichier = UUID.randomUUID() + "_" + file.getOriginalFilename();
                    Path filePath = Paths.get(uploadDir, nomDuFichier);

                    Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                    Optional<OganigrameMF> organismme = organismeInterfacesMF.findById(organisme);

                    if (organismme.isPresent()) {
                        TelechargementMF fichierNouveaux = new TelechargementMF();
                        fichierNouveaux.setNom(nom);
                        fichierNouveaux.setPath(uploadDir + "/" + nomDuFichier);
                        LocalDate date = LocalDate.now();

                        fichierNouveaux.setDate(date);
                        fichierNouveaux.setOrganisme(organismme.get());
                    logContenu(salarie.get().getNom()+ " "+ salarie.get().getPrenom() + "A ajouter le documents :  "+nom );

                        return telechargementInterface.save(fichierNouveaux);
                    } else {
                        throw new RuntimeException("4 organisme invalide " + organisme);

                    }

                } catch (Exception ex) {
                    throw new RuntimeException("3" + ex);

                }

            } else {
                throw new RuntimeException("2: Vous devez etre connecter ");

            }

        } else {
            throw new RuntimeException("1: Salarie not found ");

        }
    }

    /**
     * Récupère la liste de tous les téléchargements.
     *
     * @param jwt Le jeton JWT de l'utilisateur authentifié.
     * @return la liste des téléchargements disponibles.
     */
    @GetMapping("/telechargement")
    public List<TelechargementMF> getTelechargement(@AuthenticationPrincipal Jwt jwt) {
        String email = jwt.getClaim("email");
        Optional<SalarieMF> salarie = salarieControllerMF.findByMail(email);
        List<TelechargementMF> fichiers = telechargementInterface.findAll();
        if (salarie.isPresent()) {
            logContenu(salarie.get().getNom() + " " + salarie.get().getPrenom() + "A chercher tout les  documents ");

            return fichiers;
        } else {
            throw new RuntimeException("1: Salarie not found ");

        }
    }

    /**
     * Récupère un téléchargement par son identifiant.
     *
     * @param jwt Le jeton JWT de l'utilisateur authentifié.
     * @param id  L'identifiant du téléchargement.
     * @return l'objet TelechargementMF correspondant.
     */
    @GetMapping("/telechargement/{id}")
    public TelechargementMF getTelechargementById(@AuthenticationPrincipal Jwt jwt,
            @PathVariable Long id) {
        String email = jwt.getClaim("email");
        Optional<SalarieMF> salarie = salarieControllerMF.findByMail(email);
        Optional<TelechargementMF> fichiers = telechargementInterface.findById(id);

        if (salarie.isPresent()) {

            if (fichiers.isPresent()) {
                logContenu(salarie.get().getNom() + " " + salarie.get().getPrenom() + "A chercher le documents :  "
                        + fichiers.get().getNom() + ". Id: " + fichiers.get().getId());

                return fichiers.get();
            } else {
                throw new RuntimeException("2: fichier non trouver ");

            }
        } else {
            throw new RuntimeException("1: Salarie not found ");

        }
    }

    /**
     * Supprime un téléchargement et le fichier associé.
     *
     * @param id  L'identifiant du téléchargement à supprimer.
     * @param jwt Le jeton JWT de l'utilisateur authentifié.
     * @return un message de confirmation.
     */
    @DeleteMapping("/organisme/supprimer/{id}")
    public String deleteTelechargement(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        String email = jwt.getClaim("email");
        Optional<SalarieMF> salarie = salarieControllerMF.findByMail(email);

        if (salarie.isPresent()) {
            Optional<TelechargementMF> telechargement = telechargementInterface.findById(id);
            if (telechargement.isPresent()) {

                TelechargementMF fichier = telechargement.get();
                String pathFichier = fichier.getPath();

                if (pathFichier != null && !pathFichier.trim().isEmpty()) {
                    try {
                        Path chemin = Paths.get(pathFichier);
                        Files.deleteIfExists(chemin);
                        System.out.println("Fichier supprimé : " + chemin);
                    } catch (IOException e) {
                        System.out.println("Erreur suppression fichier : " + e.getMessage());
                        throw new RuntimeException("5: érreur pour supprimer le fichier ");

                    }
                    logContenu(salarie.get().getNom() + " " + salarie.get().getPrenom()
                            + "A supprimer le documents liée à l'organisme " + telechargement.get().getOrganisme()
                            + ". le fichier etait: " + telechargement.get().getNom());

                    telechargementInterface.deleteById(id);

                    return "Suppression éffectuer";
                }
                throw new RuntimeException("4: chemin du  fichier non trouver ");

            }
            throw new RuntimeException("3: fichier non trouver ");

        }
        throw new RuntimeException("3: salarié non trouver ");

    }

    /**
     * Récupère les téléchargements associés à un organisme.
     *
     * @param jwt       Le jeton JWT de l'utilisateur authentifié.
     * @param organisme L'identifiant de l'organisme.
     * @return la liste des téléchargements pour l'organisme.
     */
    @GetMapping("/organisme/{organisme}")
    public List<TelechargementMF> getTelechargementByOrganisation(@AuthenticationPrincipal Jwt jwt,
            @PathVariable Long organisme) {
        String email = jwt.getClaim("email");
        Optional<SalarieMF> salarie = salarieControllerMF.findByMail(email);
        Optional<OganigrameMF> OG = organismeInterfacesMF.findById(organisme);

        if (salarie.isPresent()) {

            if (OG.isPresent()) {
                List<TelechargementMF> fichiers = telechargementInterface.findByOganigrame(OG.get());

                if (!fichiers.isEmpty()) {

                    logContenu(salarie.get().getNom() + " " + salarie.get().getPrenom()
                            + "A rechercher les documents liée à l'organisme " + organisme);
                    return fichiers;
                } else {
                    throw new RuntimeException("3: Aucun fichier trouver de ce group ");

                }
            } else {
                throw new RuntimeException("2: fichier non trouver ");

            }
        } else {
            throw new RuntimeException("1: Salarie not found ");

        }
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
