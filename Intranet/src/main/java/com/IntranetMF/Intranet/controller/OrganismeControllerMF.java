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
import com.IntranetMF.Intranet.modele.OganigrameMF;
import java.util.List;

import com.IntranetMF.Intranet.repository.OrganismeInterfacesMF;
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

@RestController
@RequestMapping("/Organisme")
public class OrganismeControllerMF {

    private final String uploadDir = "uploads/Photos";
    private final SalarieInterfacesMF salarieMF;
    private final OrganismeInterfacesMF OrganismMF;

    private String logDir = "log/Organigramme/" + LocalDate.now().getYear() + "/"
            + LocalDate.now().getMonthValue() + "/"
            + LocalDate.now().getDayOfMonth();

    public OrganismeControllerMF(OrganismeInterfacesMF organismMF, SalarieInterfacesMF salarieMF) {
        this.OrganismMF = organismMF;
        this.salarieMF = salarieMF;
    }

    @PostMapping("/nouveaux")
    public OganigrameMF newOrganigramme(@RequestParam String label, @RequestParam String adresse,
            @RequestParam String telephone) {
        OganigrameMF unOrganigramme = new OganigrameMF();
        unOrganigramme.setLabel(label);
        unOrganigramme.setTelephone(telephone);
        unOrganigramme.setAdresse(adresse);

        return OrganismMF.save(unOrganigramme);

    }

    @GetMapping("/organigramme")
    public List<OganigrameMF> getOrganigramme() {
        List<OganigrameMF> OG = OrganismMF.findAll();

        return OG;
    }

    @GetMapping("/organigramme/nom/{recherche}")
    public List<OganigrameMF> findOrganismeByLabel(@PathVariable String recherche) {

        String[] coupage = recherche.trim().split("\\s+");

        List<OganigrameMF> organismes;

        if (coupage.length >= 2) {
            String mot1 = coupage[0];
            String mot2 = coupage[1];

            // 👉 on cherche les 2 mots dans le label
            organismes = OrganismMF
                    .findByLabelContainingIgnoreCaseAndLabelContainingIgnoreCase(mot1, mot2);

        } else {
            String mot = coupage[0];

            organismes = OrganismMF.findByLabelContainingIgnoreCase(mot);
        }

        if (!organismes.isEmpty()) {
            logContenu("Recherche organisme : " + recherche);
            return organismes;
        } else {
            return List.of();
        }
    }

    @GetMapping("/organigramme/{id}")
    public OganigrameMF getOrganigrammeById(@PathVariable Long id) {
        Optional<OganigrameMF> OG = OrganismMF.findById(id);

        if (OG.isPresent()) {
            return OG.get();

        } else {
            throw new RuntimeException("Aucun organisme avec cette id : " + id);

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
