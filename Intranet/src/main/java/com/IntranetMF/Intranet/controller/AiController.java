package com.IntranetMF.Intranet.controller;

import com.IntranetMF.Intranet.modele.SalarieMF;
import com.IntranetMF.Intranet.repository.SalarieInterfacesMF;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import com.IntranetMF.Intranet.modele.AiServices;
import java.util.Optional;

@RestController
@RequestMapping("/ai")
public class AiController {

    private final AiServices aiService;
    private final SalarieInterfacesMF salarieInterfacesMF;

    public AiController(AiServices aiService, SalarieInterfacesMF salarieInterfacesMF) {
        this.aiService = aiService;
        this.salarieInterfacesMF = salarieInterfacesMF;
    }

    @PostMapping(value="/ask", produces = "text/plain;charset=UTF-8")
    public String ask(@AuthenticationPrincipal Jwt jwt, @RequestBody String prompt) {

        String email = jwt.getClaim("email");

        Optional<SalarieMF> salarie = salarieInterfacesMF.findByMail(email);

        if (salarie.isPresent()) {

            if (salarie.get().getIsConnected()) {
                return aiService.askAi("**Attention tout ce que tu va répondre le client peut le voir donc repond juste au reponse stp **Sache que tu es un agent IA de montfermeil tout les message qui suit tu peux leur répondre sans soucis mais si il pose des question en dehors de montfermeil ou de la mairie aide les différemment  bien sur répons les poliment, voici le prompte du client : "+prompt);
            }

            throw new RuntimeException("Vous devez être connecté");
        }

        throw new RuntimeException("Salarié inexistant");
    }

    @GetMapping("/test")
    public String test() {
        return "OK";
    }

}
