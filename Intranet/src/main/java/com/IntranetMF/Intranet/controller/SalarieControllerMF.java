package com.IntranetMF.Intranet.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.Optional;

import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Files;
import com.IntranetMF.Intranet.modele.SalarieMF;
import com.IntranetMF.Intranet.modele.OganigrameMF;
import com.IntranetMF.Intranet.repository.SalarieInterfacesMF;
import com.IntranetMF.Intranet.repository.OrganismeInterfacesMF;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import jakarta.transaction.Transactional;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@RestController
@RequestMapping("/salaries")
public class SalarieControllerMF {

    private String logDir = "log/Salarie/"
            + LocalDate.now().getYear() + "/"
            + LocalDate.now().getMonthValue() + "/"
            + LocalDate.now().getDayOfMonth();

    public final SalarieInterfacesMF salarieControllerMF;
    public final OrganismeInterfacesMF oganigrameMF;

    @PersistenceContext
    private EntityManager entityManager;

    public SalarieControllerMF(SalarieInterfacesMF salarieControllerMF, OrganismeInterfacesMF oganigrameMF) {
        this.salarieControllerMF = salarieControllerMF;
        this.oganigrameMF = oganigrameMF;
    }

    @GetMapping("/{id}")
    public SalarieMF getMethodName(@AuthenticationPrincipal Jwt jwt, @PathVariable Long id) {

        String email = jwt.getClaim("email");
        Optional<SalarieMF> personne = salarieControllerMF.findByMail(email);

        if (!personne.isPresent()) {
            throw new RuntimeException("Compte innexistant");
        }

        var salarieOpt = salarieControllerMF.findById(id);
        if (salarieOpt.isPresent()) {
            SalarieMF salarie = salarieOpt.get();
            String text = salarie.getNom() + " " + salarie.getPrenom() + " . A été rechercher. Par "
                    + personne.get().getPrenom() + " " + salarie.getNom();
            logContenu(text);
            return salarie;
        } else {
            throw new RuntimeException("Salarie not found with id: " + id);
        }

    }

    @GetMapping("/email/{email}")
    public SalarieMF getEmail(@AuthenticationPrincipal Jwt jwt, @PathVariable String email) {
        Optional<SalarieMF> unSalarie = salarieControllerMF.findByMail(email);

        String emailV = jwt.getClaim("email");
        Optional<SalarieMF> personne = salarieControllerMF.findByMail(email);

        if (!personne.isPresent()) {
            throw new RuntimeException("Compte innexistant");
        }

        if (unSalarie.isPresent()) {

            String text = email + "  A été rechercher. Par "
                    + personne.get().getPrenom() + " " + personne.get().getNom();
            logContenu(text);
            return unSalarie.get();
        } else {
            throw new RuntimeException("Salarie not found with email: " + email);

        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/test-role")
    public Object test(Authentication auth) {
        return auth.getAuthorities();
    }

    @GetMapping("/")
    public Iterable<SalarieMF> getAllSalaries(@AuthenticationPrincipal Jwt jwt) {

        String email = jwt.getClaim("email");
        Optional<SalarieMF> personne = salarieControllerMF.findByMail(email);

        if (!personne.isPresent()) {
            throw new RuntimeException("Compte innexistant");
        }

        String text = personne.get().getPrenom() + " " + personne.get().getNom() + " A chercher tout les utilisateur";
        logContenu(text);

        return salarieControllerMF.findAll();
    }

    @GetMapping("/Salarie/{nom}")
    public List<SalarieMF> findSalarierbymail(@AuthenticationPrincipal Jwt jwt, @PathVariable String nom) {

        String[] coupage = nom.trim().split("\\s+"); // Séparer en mots

        List<SalarieMF> salarie;

        String email = jwt.getClaim("email");
        Optional<SalarieMF> personne = salarieControllerMF.findByMail(email);

        if (!personne.isPresent()) {
            throw new RuntimeException("Compte innexistant");
        }

        if (coupage.length >= 2) {
            String prenom = coupage[0];
            String nomFamille = coupage[1];
            // Recherche par prénom ET nom
            salarie = salarieControllerMF.findByPrenomContainingIgnoreCaseAndNomContainingIgnoreCase(prenom,
                    nomFamille);
        } else {
            // Si un seul mot, recherche sur prénom OU nom
            String mot = coupage[0];
            salarie = salarieControllerMF.findByPrenomContainingIgnoreCaseOrNomContainingIgnoreCase(mot, mot);
        }

        if (!salarie.isEmpty()) {
            String text = personne.get().getPrenom() + " " + personne.get().getNom() + " A chercher " + nom;
            logContenu(text);
            return salarie;
        } else {
            return List.of();
        }
    }

    @GetMapping("/organigramme/{id}")
    public List<SalarieMF> getOrganigrammeById(@AuthenticationPrincipal Jwt jwt, @PathVariable Long id) {
        Optional<OganigrameMF> OG = oganigrameMF.findById(id);

        String email = jwt.getClaim("email");
        Optional<SalarieMF> personne = salarieControllerMF.findByMail(email);

        if (!personne.isPresent()) {
            throw new RuntimeException("Compte innexistant");
        }

        if (OG.isPresent()) {
            List<SalarieMF> salarieorganigramme = salarieControllerMF.findByOganigrame(OG.get());
            String text = personne.get().getPrenom() + " " + personne.get().getNom()
                    + " A chercher l'orgnigramme numéro  " + id;
            logContenu(text);
            return salarieorganigramme;

        }
        throw new RuntimeException("Aucun organisme avec cette id : " + id);

    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/Modification/Salarie/{id}")
    public SalarieMF ModifyASalarier(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long id,
            @RequestParam String nom,
            @RequestParam String prenom,
            @RequestParam String mail,
            @RequestParam String numero,
            @RequestParam String numeroPro,
            @RequestParam String fonction,
            @RequestParam String localisation) {

        if (!numero.matches("\\d+")) {
            throw new IllegalArgumentException("Numéro invalide : uniquement des chiffres autorisés");
        }
        if (!numeroPro.matches("\\d+")) {
            throw new IllegalArgumentException("Numéro invalide : uniquement des chiffres autorisés");
        }

        String email = jwt.getClaim("email");
        Optional<SalarieMF> personne = salarieControllerMF.findByMail(email);

        if (!personne.isPresent()) {
            throw new RuntimeException("Compte innexistant");
        }

        var salarierOpt = salarieControllerMF.findById(id);
        if (salarierOpt.isPresent()) {
            SalarieMF salarier = salarierOpt.get(); // on prend l'objet existant
            salarier.setNom(nom);
            salarier.setPrenom(prenom); // ici on met bien le prénom
            salarier.setMail(mail);
            salarier.setNumero(numero);
            salarier.setTelPro(numeroPro);
            salarier.setFonction(fonction);
            salarier.setLocalisation(
                    com.IntranetMF.Intranet.modele.LocalisationEnumMF.Localisation.valueOf(localisation));
            System.out.print(salarier);

            String text = personne.get().getPrenom() + " " + personne.get().getNom() + " a modifier : "
                    + salarier.getNom() + " " + salarier.getPrenom();
            logContenu(text);
            return salarieControllerMF.save(salarier); // sauvegarde de l'objet existant modifié
        } else {
            throw new RuntimeException("Aucun salarié trouvé pour cet ID: " + id);
        }
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/NewSalarie")
    public SalarieMF createSalarie(
            @AuthenticationPrincipal Jwt jwt, @RequestParam String nom,
            @RequestParam String prenom,
            @RequestParam String mail,
            @RequestParam String numero,
            @RequestParam String numeroPro,
            @RequestParam String fonction,
            @RequestParam String localisation) {

        if (!numero.matches("\\d+")) {
            throw new IllegalArgumentException("Numéro invalide : uniquement des chiffres autorisés");
        }
        if (!numeroPro.matches("\\d+")) {
            throw new IllegalArgumentException("Numéro invalide : uniquement des chiffres autorisés");
        }

        String email = jwt.getClaim("email");
        Optional<SalarieMF> personne = salarieControllerMF.findByMail(email);

        if (!personne.isPresent()) {
            throw new RuntimeException("Compte innexistant");
        }
        SalarieMF newSalarie = new SalarieMF();
        newSalarie.setNom(nom);
        newSalarie.setPrenom(prenom);
        newSalarie.setMail(mail);
        newSalarie.setTelPro(numeroPro);
        newSalarie.setNumero(numero);
        newSalarie.setFonction(fonction);

        newSalarie.setIsAdmin(false);
        newSalarie.setLocalisation(
                com.IntranetMF.Intranet.modele.LocalisationEnumMF.Localisation.valueOf(localisation));
        newSalarie.setIsConnected(false);

        int intNum = 1;
        Long longNum = Long.valueOf(intNum);
        Optional<OganigrameMF> og = oganigrameMF.findById(longNum);

        newSalarie.setOrganigramme(og.get());

        System.out.print(newSalarie);
        String text = personne.get().getPrenom() + " " + personne.get().getNom() +" a ajouter : " + nom + " " + prenom;
        logContenu(text);
        return salarieControllerMF.save(newSalarie);
    }

    @PostMapping("/sync")
    public SalarieMF syncUser(@RequestBody Map<String, String> userData) {
        String email = userData.get("email");

        var salarieOpt = salarieControllerMF.findByMail(email);

        if (salarieOpt.isPresent()) {
            SalarieMF existing = salarieOpt.get();
            existing.setIsConnected(true);
            // Update other fields if needed
            existing.setNom(userData.get("nom"));
            existing.setPrenom(userData.get("prenom"));
            return salarieControllerMF.save(existing);
        }

        // Create new
        SalarieMF newUser = new SalarieMF();
        newUser.setMail(email);
        newUser.setNom(userData.get("nom"));
        newUser.setPrenom(userData.get("prenom"));
        newUser.setIsConnected(true);
        newUser.setIsAdmin(false);
        // Set defaults
        newUser.setLocalisation(com.IntranetMF.Intranet.modele.LocalisationEnumMF.Localisation.NON_DEFINI); // Assuming
                                                                                                            // default
        newUser.setNumero(userData.get("telephoneNumber"));
        newUser.setTelPro(userData.get("mobilePro"));
        newUser.setFonction(userData.get("fonction"));

        String text = "Nouveau utilisateur synchronisé : " + userData.get("nom") + " " + userData.get("prenom");
        logContenu(text);
        return salarieControllerMF.save(newUser);
    }

    @PostMapping("/logout")
    @Transactional
    public SalarieMF logoutSalarie(@RequestParam String email) {
        System.out.println("\n====================================");
        System.out.println("🔓 LOGOUT REQUEST START");
        System.out.println("UserData: " + email);
        System.out.println("====================================\n");

        System.out.println("📧 Looking for email: " + email);

        if (email == null || email.isEmpty()) {
            System.out.println("❌ ERROR: Email is required for logout");
            throw new RuntimeException("Email is required for logout");
        }

        var salarieOpt = salarieControllerMF.findByMail(email);

        if (salarieOpt.isPresent()) {
            SalarieMF salarie = salarieOpt.get();
            System.out.println("✅ User found - Name: " + salarie.getNom() + " " + salarie.getPrenom());
            System.out.println("   Current isConnected: " + salarie.getIsConnected());
            System.out.println("   Current beginLogin: " + salarie.getBeginLogin());

            salarie.setIsConnected(false);
            salarie.setLastLogin(LocalDateTime.now());
            System.out.println("   Set isConnected to: " + salarie.getIsConnected());
            System.out.println("   Set lastLogin to: " + salarie.getLastLogin());

            SalarieMF saved = salarieControllerMF.save(salarie);
            entityManager.flush(); // Force immediate database update
            System.out.println("   Saved - isConnected is now: " + saved.getIsConnected());
            System.out.println("   Saved - lastLogin is now: " + saved.getLastLogin());

            String logText = "🔓 DÉCONNEXION: " + salarie.getNom() + " " + salarie.getPrenom() + " s'est déconnecté à "
                    + salarie.getLastLogin();
            System.out.println(logText);
            logContenu(logText);

            System.out.println("✅ LOGOUT SUCCESS\n");
            return saved;
        } else {
            System.out.println("❌ User NOT found with email: " + email);
            throw new RuntimeException("Salarie not found with email: " + email);
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
