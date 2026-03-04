package com.IntranetMF.Intranet.controller;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;

import com.IntranetMF.Intranet.modele.SalarieMF;
import com.IntranetMF.Intranet.repository.SalarieInterfacesMF;

import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/salaries")
public class SalarieControllerMF {

    @Autowired
    private PasswordEncoder passwordEncoder;

    public final SalarieInterfacesMF salarieControllerMF;

    public SalarieControllerMF(SalarieInterfacesMF salarieControllerMF) {
        this.salarieControllerMF = salarieControllerMF;
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public SalarieMF getMethodName(@PathVariable Long id) {
        var salarieOpt = salarieControllerMF.findById(id);
        if (salarieOpt.isPresent()) {
            SalarieMF salarie = salarieOpt.get();
           
            return salarie;
        } else {
            throw new RuntimeException("Salarie not found with id: " + id);
        }
    }

    @GetMapping("/")
    @PreAuthorize("hasRole('ADMIN')")
    public Iterable<SalarieMF> getAllSalaries() {
        return salarieControllerMF.findAll();
    }

    @GetMapping("/Salarie/{nom}")
    @PreAuthorize("hasRole('USER')")
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
            return salarie;
        } else {
            throw new RuntimeException("Aucun salarié trouvé pour : " + nom);
        }
    }

    @PatchMapping("/Modification/Salarie/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public SalarieMF ModifyASalarier(
            @PathVariable Long id,
            @RequestParam String nom,
            @RequestParam String prenom,
            @RequestParam String mail,
            @RequestParam Integer numero,
            @RequestParam Integer numeroPro,
            @RequestParam String fonction,
            @RequestParam String localisation) {

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
            return salarieControllerMF.save(salarier); // sauvegarde de l'objet existant modifié
        } else {
            throw new RuntimeException("Aucun salarié trouvé pour cet ID: " + id);
        }
    }

    @Transactional
    @PostMapping("/NewSalarie")
    @PreAuthorize("hasRole('ADMIN')")
    public SalarieMF createSalarie(
            @RequestParam String nom,
            @RequestParam String prenom,
            @RequestParam String mail,
            @RequestParam Integer numero,
            @RequestParam Integer numeroPro,
            @RequestParam String fonction,
            @RequestParam String password,
            @RequestParam String localisation,
            @RequestHeader(value = "X-Admin-Token", required = false) String adminToken) {

        // if (adminToken == null || !adminToken.equals("adminMF-token")){
        // throw new RuntimeException("Unauthorized: Admin access required to create a
        // new salarie.");
        // }
        SalarieMF newSalarie = new SalarieMF();
        newSalarie.setNom(nom);
        newSalarie.setPrenom(prenom);
        newSalarie.setMail(mail);
        newSalarie.setTelPro(numeroPro);
        newSalarie.setNumero(numero);
        newSalarie.setFonction(fonction);

        if (!checkingPassword(password).equals("OK")) {
            throw new RuntimeException("Password validation failed: " + checkingPassword(password));
        }

        String encodedPassword = passwordEncoder.encode(password);
        newSalarie.setPassword(encodedPassword);
        newSalarie.setIsAdmin(false);
        newSalarie.setLocalisation(
                com.IntranetMF.Intranet.modele.LocalisationEnumMF.Localisation.valueOf(localisation));
        newSalarie.setIsConnected(false);
        
                    System.out.print(newSalarie);

        return salarieControllerMF.save(newSalarie);
    }

    @PostMapping("/login")
    public SalarieMF loginSalarie(
            @RequestParam String mail,
            @RequestParam String password,
            @RequestHeader(value = "Authorization", required = true) String authorization) {

        if (authorization == null || !authorization.equals("Bearer intranetMF-token")) {
            throw new RuntimeException("Unauthorized: Valid token required to login.");
        }

        var salarieOpt = salarieControllerMF.findByMail(mail);
        if (salarieOpt.isPresent()) {
            SalarieMF salarie = salarieOpt.get();


            
             if (salarie.getIsConnected() == true){
                throw new RuntimeException("L'utilisateur est déja connecter");
            }
            ZonedDateTime parisTime = ZonedDateTime.now(ZoneId.of("Europe/Paris"));
            LocalDateTime localDateTime = parisTime.toLocalDateTime();

            if (passwordEncoder.matches(password, salarie.getPassword())) {
                salarie.setIsConnected(true);
                salarie.setBeginLogin(localDateTime);

                salarieControllerMF.save(salarie);

                // Pour voir qui c'est connecter
                System.out.println("Salarier:" + salarie);
                System.out.println("Heure système : " + LocalDateTime.now());
                System.out.println("Heure UTC : " + Instant.now());
                System.out.println("Fuseau par défaut : " + ZoneId.systemDefault());
                return salarie;
            } else {
                throw new RuntimeException("Invalid account: ");
            }
        } else {
            throw new RuntimeException("Invalid account: ");
        }
    }

    @PostMapping("/logout")
    public SalarieMF logoutSalarie(
            @RequestParam String mail) {

        var salarieOpt = salarieControllerMF.findByMail(mail);
        if (salarieOpt.isPresent()) {
            SalarieMF salarie = salarieOpt.get();

             if (salarie.getIsConnected() == false){
                throw new RuntimeException("L'utilisateur doit etre connecter sur le site");
            }

            ZonedDateTime parisTime = ZonedDateTime.now(ZoneId.of("Europe/Paris"));
            LocalDateTime localDateTime = parisTime.toLocalDateTime();

            salarie.setIsConnected(false);
            salarie.setLastLogin(localDateTime);
            salarieControllerMF.save(salarie);

            // Pour voir qui c'est déconnecter
            System.out.println("Salarier:" + salarie);
            System.out.println("Heure système : " + LocalDateTime.now());
            System.out.println("Heure UTC : " + Instant.now());
            System.out.println("Fuseau par défaut : " + ZoneId.systemDefault());
            return salarie;
        } else {
            throw new RuntimeException("Salarie not found");
        }
    }

    @PatchMapping("/PasswordReset")
    @PreAuthorize("hasRole('ADMIN')")
    public String passwordReset(@RequestParam Long id, @RequestParam String password) {
        Optional<SalarieMF> salarie = salarieControllerMF.findById(id);
        if (salarie.isPresent()) {
            SalarieMF LeSalarier = salarie.get();

            if (!checkingPassword(password).equals("OK")) {
                throw new RuntimeException("Password validation failed: " + checkingPassword(password));
            }

            String encodedPassword = passwordEncoder.encode(password);
            LeSalarier.setPassword(encodedPassword);

            salarieControllerMF.save(LeSalarier);
            System.out.println("Mots de passe: " + password);
            System.out.println("Réinitialisation éffectuer avec succes");
            return "Réinitialisation éffectuer avec succes";
        } else {
            return "identifiant inconnue";
        }
    }

    /*
     * Cette méthode vérifie si le mot de passe respecte les critères de sécurité
     * suivants :
     * - Au moins 8 caractères de long
     * - Contient au moins une lettre majuscule
     * - Contient au moins une lettre minuscule
     * - Contient au moins un chiffre
     * - Contient au moins un caractère spécial (!@#$%^&*())
     */

    public String checkingPassword(String password) {
        if (password.length() < 8) {
            return "Password must be at least 8 characters long.";
        } else if (!password.matches(".*[A-Z].*")) {
            return "Password must contain at least one uppercase letter.";
        } else if (!password.matches(".*[a-z].*")) {
            return "Password must contain at least one lowercase letter.";
        } else if (!password.matches(".*\\d.*")) {
            return "Password must contain at least one digit.";
        } else if (!password.matches(".*[!@#$%^&*()].*")) {
            return "Password must contain at least one special character (!@#$%^&*()).";
        } else {
            return "OK";
        }

    }

}
