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

import com.IntranetMF.Intranet.modele.SalarieMF;
import com.IntranetMF.Intranet.modele.RecommandeMF;

@RestController
@RequestMapping("/recommander")
public class RecommanderControllerMF {

    private final RecommanderInterfacesMF recommanderInterfacesMF;

    private final SalarieInterfacesMF salarieInterfacesMF;

    private RecommanderControllerMF(RecommanderInterfacesMF r, SalarieInterfacesMF s) {
        this.recommanderInterfacesMF = r;
        this.salarieInterfacesMF = s;
    }

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

                    return recommanderInterfacesMF.save(recommander);

                } else {
                    throw new RuntimeException("Vous devez etre du service courier");

                }
            }
        }

    }

    @GetMapping("/recommander")
    public List<RecommandeMF> getAllRecommander(@AuthenticationPrincipal Jwt jwt) {
        String email = jwt.getClaim("email");
        Optional<SalarieMF> personne = salarieInterfacesMF.findByMail(email);

        if (personne.isPresent()) {
            if (personne.get().getIsConnected()) {
                if ("COURRIER".equals(personne.get().getOrganigramme().getLabel())) {
                    List<RecommandeMF> recommander = recommanderInterfacesMF.findAll();

                    return recommander;
                }
                throw new RuntimeException("Vous devez etre du service courrier");

            }
            throw new RuntimeException("Vous devez etre connecter");

        }
        throw new RuntimeException("Aucun salarié trouver");

    }
}
