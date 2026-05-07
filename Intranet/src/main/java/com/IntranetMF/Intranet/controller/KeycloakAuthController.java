package com.IntranetMF.Intranet.controller;

import java.util.Optional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import com.IntranetMF.Intranet.modele.LocalisationEnumMF.Localisation;
import com.IntranetMF.Intranet.modele.OganigrameMF;
import com.IntranetMF.Intranet.modele.SalarieMF;
import com.IntranetMF.Intranet.repository.SalarieInterfacesMF;
import com.IntranetMF.Intranet.repository.OrganismeInterfacesMF;

@RestController
@RequestMapping("/auth")
public class KeycloakAuthController {

    private final SalarieInterfacesMF salarieRepository;
    private final OrganismeInterfacesMF oganigrameMF;

    @PersistenceContext
    private EntityManager entityManager;

    public KeycloakAuthController(SalarieInterfacesMF salarieRepository, OrganismeInterfacesMF oganigrameMF) {
        this.salarieRepository = salarieRepository;
        this.oganigrameMF = oganigrameMF;
    }

    /**
     * Endpoint public pour synchroniser les utilisateurs Keycloak
     * Accessible SANS authentification
     */
    @PostMapping("/sync")
    @Transactional
    public SalarieMF syncKeycloakUser(@RequestBody Map<String, String> userData) {
        System.out.println("\n====================================");
        System.out.println("🔐 KEYCLOAK SYNC START");
        System.out.println("UserData: " + userData);
        System.out.println("====================================\n");

        String email = userData.get("email");

        if (email == null || email.isEmpty()) {
            System.out.println("❌ ERROR: Email is required for sync");
            throw new RuntimeException("Email is required for sync");
        }

        Object rolesObj = userData.get("roles");

        boolean isAdmin = false;

        if (rolesObj instanceof List<?> rolesList) {
            isAdmin = rolesList.contains("ADMIN");
        } else if (rolesObj instanceof String rolesStr) {
            isAdmin = rolesStr.contains("ADMIN");
        }

        var salarieOpt = salarieRepository.findByMail(email);

        if (salarieOpt.isPresent()) {
            System.out.println("✅ User already exists - updating...");
            SalarieMF existing = salarieOpt.get();
            System.out.println("   Name: " + existing.getNom() + " " + existing.getPrenom());

            existing.setIsConnected(true);
            existing.setBeginLogin(LocalDateTime.now());
            existing.setNom(userData.getOrDefault("nom", existing.getNom()));
            existing.setPrenom(userData.getOrDefault("prenom", existing.getPrenom()));
            existing.setIsAdmin(isAdmin);
            System.out.println("   Set isConnected = true");
            System.out.println("   Set beginLogin = " + existing.getBeginLogin());

            SalarieMF saved = salarieRepository.save(existing);
            entityManager.flush(); // Force immediate database update
            System.out.println("✅ SYNCED (USER UPDATED)");
            System.out.println("   Saved isConnected: " + saved.getIsConnected());
            System.out.println("   Saved beginLogin: " + saved.getBeginLogin() + "\n");
            return saved;
        }
        SalarieMF newUser = new SalarieMF();

        Long organigrammeId = Long.parseLong(userData.getOrDefault("organisation", "0"));
        Optional<OganigrameMF> uneOrganisation = oganigrameMF.findById(organigrammeId);
        if (!uneOrganisation.isPresent()) {
            String defaultValue = "3";
            organigrammeId = Long.parseLong(defaultValue);
            Optional<OganigrameMF> uneOrganisation2 = oganigrameMF.findById(organigrammeId);

            newUser.setOrganigramme(uneOrganisation2.get());

        } else {
            newUser.setOrganigramme(uneOrganisation.get());

        }
        // Create new user
        System.out.println("📝 Creating new user...");
        newUser.setMail(email);
        newUser.setNom(userData.getOrDefault("nom", ""));
        newUser.setPrenom(userData.getOrDefault("prenom", ""));
        newUser.setIsConnected(true);
        newUser.setBeginLogin(LocalDateTime.now());

        newUser.setIsAdmin(isAdmin);

        if (userData.get("localisation") == null || userData.get("localisation").isEmpty()) {
            newUser.setLocalisation(Localisation.NON_DEFINI);
        } else {
            if (userData.get("localisation").equals("VILLE_╔DUCA")) {
                newUser.setLocalisation(Localisation.VILLE_ÉDUCATIVE);
            } else {
                newUser.setLocalisation(Localisation.valueOf(userData.getOrDefault("localisation", "NON_DEFINI")));
            }
        }

        // System.out.print(Localisation.valueOf(userData.getOrDefault("localisation", "NON_DEFINI").toString()));
        // Set defaults for required fields
        System.out.println("Localisation = " + newUser.getLocalisation());
        newUser.setNumero(userData.getOrDefault("telephoneNumber", ""));
        newUser.setTelPro(userData.getOrDefault("mobilePro", ""));
        newUser.setFonction(userData.getOrDefault("fonction", "NON_DEFINI"));

        SalarieMF saved = salarieRepository.save(newUser);
        entityManager.flush(); // Force immediate database update
        System.out.println("✅ SYNCED (USER CREATED)");
        System.out.println("   Email: " + saved.getMail());
        System.out.println("   Name: " + saved.getNom() + " " + saved.getPrenom());
        System.out.println("   isConnected: " + saved.getIsConnected());
        System.out.println("   beginLogin: " + saved.getBeginLogin() + "\n");
        return saved;
    }
}
