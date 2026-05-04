package com.IntranetMF.Intranet.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

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
    public SalarieMF getMethodName(@PathVariable Long id) {
        var salarieOpt = salarieControllerMF.findById(id);
        if (salarieOpt.isPresent()) {
            SalarieMF salarie = salarieOpt.get();
            String text = salarie.getNom() + " " + salarie.getPrenom() + " . A été rechercher.";
            logContenu(text);
            return salarie;
        } else {
            throw new RuntimeException("Salarie not found with id: " + id);
        }

    }

    @GetMapping("/email/{email}")
    public SalarieMF getEmail(@PathVariable String email) {
        Optional<SalarieMF> unSalarie = salarieControllerMF.findByMail(email);

        if (unSalarie.isPresent()) {
            return unSalarie.get();
        } else {
            throw new RuntimeException("Salarie not found with email: " + email);

        }
    }

    @GetMapping("/")
    public Iterable<SalarieMF> getAllSalaries() {

        String text = "Un admin à recherecher tout les utilisateur";
        logContenu(text);

        return salarieControllerMF.findAll();
    }

    @GetMapping("/Salarie/{nom}")
    public List<SalarieMF> findSalarierbymail(@PathVariable String nom) {

        String[] coupage = nom.trim().split("\\s+"); // Séparer en mots

        List<SalarieMF> salarie;

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
            String text = "Un salarié a rechercher: " + nom;
            logContenu(text);
            return salarie;
        } else {
            return List.of();
        }
    }

    @PatchMapping("/Modification/Salarie/{id}")
    public SalarieMF ModifyASalarier(
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

            String text = "Un admin a modifier : " + salarier.getNom() + " " + salarier.getPrenom();
            logContenu(text);
            return salarieControllerMF.save(salarier); // sauvegarde de l'objet existant modifié
        } else {
            throw new RuntimeException("Aucun salarié trouvé pour cet ID: " + id);
        }
    }

    @Transactional
    @PostMapping("/NewSalarie")
    public SalarieMF createSalarie(
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
        String text = "Un admin a ajouter : " + nom + " " + prenom;
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
        newUser.setNumero("0000000000"); // Default
        newUser.setTelPro("0000000000"); // Default
        newUser.setFonction("User"); // Default

        String text = "Nouveau utilisateur synchronisé : " + userData.get("nom") + " " + userData.get("prenom");
        logContenu(text);
        return salarieControllerMF.save(newUser);
    }

    @PostMapping("/logout")
    @Transactional
    public SalarieMF logoutSalarie(@RequestBody Map<String, String> userData) {
        System.out.println("\n====================================");
        System.out.println("🔓 LOGOUT REQUEST START");
        System.out.println("UserData: " + userData);
        System.out.println("====================================\n");

        String email = userData.getOrDefault("mail", userData.get("email"));
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
