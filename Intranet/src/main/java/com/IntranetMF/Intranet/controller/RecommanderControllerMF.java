package com.IntranetMF.Intranet.controller;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.DataFormat;
import org.apache.poi.ss.usermodel.Row;
import org.springframework.format.annotation.DateTimeFormat;
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
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.IntranetMF.Intranet.repository.RecommanderInterfacesMF;
import com.IntranetMF.Intranet.repository.SalarieInterfacesMF;

import jakarta.servlet.http.HttpServletResponse;

import com.IntranetMF.Intranet.modele.SalarieMF;
import com.IntranetMF.Intranet.modele.OganigrameMF;
import com.IntranetMF.Intranet.modele.RecommandeMF;

/**
 * Controller REST pour gérer les recommandations.
 *
 * Permet de créer, lister et rechercher des recommandations de courrier.
 */
@RestController
@RequestMapping("/recommander")
public class RecommanderControllerMF {

    private final RecommanderInterfacesMF recommanderInterfacesMF;

    private final SalarieInterfacesMF salarieInterfacesMF;

    private String logDir = "log/Recommander/" + LocalDate.now().getYear() + "/"
            + LocalDate.now().getMonthValue() + "/"
            + LocalDate.now().getDayOfMonth();

    private RecommanderControllerMF(RecommanderInterfacesMF r, SalarieInterfacesMF s) {
        this.recommanderInterfacesMF = r;
        this.salarieInterfacesMF = s;
    }

    /**
     * Crée une nouvelle recommandation de courrier.
     *
     * @param jwt         Le jeton JWT de l'utilisateur authentifié.
     * @param Recommander Le texte de la recommandation.
     * @param date        La date souhaitée.
     * @param services    Le service destinataire.
     * @return la recommandation enregistrée.
     */
    @PostMapping("/nouveaux")
    public RecommandeMF newRecommander(@AuthenticationPrincipal Jwt jwt, @RequestParam String Recommander,
            @RequestParam @DateTimeFormat(pattern = "dd/MM/yyyy") LocalDate date, @RequestParam String services) {
        String email = jwt.getClaim("email");
        Optional<SalarieMF> personne = salarieInterfacesMF.findByMail(email);

        if (!personne.isPresent()) {
            throw new RuntimeException("Compte innexistant");

        } else {
            SalarieMF salarie = personne.get();

            if (!salarie.getIsConnected()) {
                throw new RuntimeException("Vous devez etre connecter pour pouvoir réaliser cette requette");

            } else {
                if ("COURRIER".equals(salarie.getOrganigramme().getLabel())) {

                    RecommandeMF recommander = new RecommandeMF();
                    recommander.setRecommande(Recommander);
                    recommander.setService(services);
                    recommander.setDate(date);
                    logContenu(salarie.getNom() + " " + salarie.getPrenom() + " à ajouter un recommander");

                    return recommanderInterfacesMF.save(recommander);

                } else {
                    throw new RuntimeException("Vous devez etre du service courier");

                }
            }
        }

    }

    /**
     * Récupère toutes les recommandations triées par date décroissante.
     *
     * @param jwt Le jeton JWT de l'utilisateur authentifié.
     * @return la liste des recommandations.
     */
    @GetMapping("/recommander")
    public List<RecommandeMF> getAllRecommander(@AuthenticationPrincipal Jwt jwt) {
        String email = jwt.getClaim("email");
        Optional<SalarieMF> personne = salarieInterfacesMF.findByMail(email);

        if (personne.isPresent()) {
            if (personne.get().getIsConnected()) {
                if ("COURRIER".equals(personne.get().getOrganigramme().getLabel())) {
                    List<RecommandeMF> recommander = recommanderInterfacesMF.findAllByOrderByDateDesc();
                    logContenu(personne.get().getNom() + " " + personne.get().getPrenom()
                            + " à chercher tout les recommander");

                    return recommander;
                }
                throw new RuntimeException("Vous devez etre du service courrier");

            }
            throw new RuntimeException("Vous devez etre connecter");

        }
        throw new RuntimeException("Aucun salarié trouver");

    }

    /**
     * Recherche des recommandations par numéro ou mot-clé.
     *
     * @param jwt       Le jeton JWT de l'utilisateur authentifié.
     * @param recherche Le terme de recherche.
     * @return la liste des recommandations correspondantes.
     */
    @GetMapping("/numero/{recherche}")
    public List<RecommandeMF> findRecommander(@AuthenticationPrincipal Jwt jwt, @PathVariable String recherche) {

        String email = jwt.getClaim("email");
        Optional<SalarieMF> personne = salarieInterfacesMF.findByMail(email);

        if (!personne.isPresent()) {
            throw new RuntimeException("Aucun salarié trouver");

        }

        if (!personne.get().getIsConnected()) {
            throw new RuntimeException("Vous devez etre connecter");

        }
        if (!"COURRIER".equals(personne.get().getOrganigramme().getLabel())) {
            throw new RuntimeException("Vous devez etre du service courrier");

        }

        List<RecommandeMF> recommanders;

        recommanders = recommanderInterfacesMF.findByRecommanderContainingIgnoreCaseOrderByDateDesc(recherche);

        if (!recommanders.isEmpty()) {
            logContenu(personne.get().getNom() + " " + personne.get().getPrenom() + " à  chercher:  " + recherche);
            return recommanders;
        } else {
            return List.of();
        }
    }

    @GetMapping("/export/excel")
    public void exportExcel(@AuthenticationPrincipal Jwt jwt ,HttpServletResponse response) throws IOException {

         String email = jwt.getClaim("email");
        Optional<SalarieMF> personne = salarieInterfacesMF.findByMail(email);

        if (!personne.isPresent()) {
            throw new RuntimeException("Aucun salarié trouver");

        }

        if (!personne.get().getIsConnected()) {
            throw new RuntimeException("Vous devez etre connecter");

        }
        if (!"COURRIER".equals(personne.get().getOrganigramme().getLabel())) {
            throw new RuntimeException("Vous devez etre du service courrier");

        }
        response.setContentType(
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader(
                "Content-Disposition",
                "attachment; filename=export.xlsx");

        XSSFWorkbook workbook = new XSSFWorkbook();

        var sheet = workbook.createSheet("Données");

        DataFormat dataFormat = workbook.createDataFormat();
        CellStyle dateCellStyle = workbook.createCellStyle();
        dateCellStyle.setDataFormat(dataFormat.getFormat("yyyy-mm-dd"));

        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("ID");
        header.createCell(1).setCellValue("Date_envoie");
        header.createCell(2).setCellValue("Recommande");
        header.createCell(3).setCellValue("Service");

        int rowNum = 1;

        for (RecommandeMF r : recommanderInterfacesMF.findAll()) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(r.getId());
            Cell dateCell = row.createCell(1);
            if (r.getDate() != null) {
                dateCell.setCellValue(Date.from(r.getDate().atStartOfDay(ZoneId.systemDefault()).toInstant()));
                dateCell.setCellStyle(dateCellStyle);
            }
            row.createCell(2).setCellValue(r.getRecommande());
            row.createCell(3).setCellValue(r.getService());
        }
logContenu(personne.get().getNom() + " "+ personne.get().getPrenom()+ "A récupérer l'excel des recommecommandé" );
        workbook.write(response.getOutputStream());
        workbook.close();
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
