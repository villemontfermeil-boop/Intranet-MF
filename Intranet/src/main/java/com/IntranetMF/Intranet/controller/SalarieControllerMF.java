package com.IntranetMF.Intranet.controller;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
    public SalarieMF getMethodName(@PathVariable Long id) {
        var salarieOpt = salarieControllerMF.findById(id);
        if (salarieOpt.isPresent()) {
            return salarieOpt.get();
        } else {
            throw new RuntimeException("Salarie not found with id: " + id);
        }
    }
    
    @Transactional
    @PostMapping("/NewSalarie")
    public SalarieMF createSalarie(
            @RequestParam String nom,
            @RequestParam String prenom,
            @RequestParam String mail,
            @RequestParam Integer numero,
            @RequestParam String fonction,
            @RequestParam String password,
            @RequestParam String localisation,
            @RequestHeader(value = "Authorization", required = false) String authorization) {

                if(authorization == null || !authorization.equals("Bearer adminMF-token")) {
                    throw new RuntimeException("Unauthorized: Admin access required to create a new salarie.");
                }
        SalarieMF newSalarie = new SalarieMF();
        newSalarie.setNom(nom);
        newSalarie.setPrenom(prenom);
        newSalarie.setMail(mail);
        newSalarie.setNumero(numero);
        newSalarie.setFonction(fonction);
        
        if(!checkingPassword(password).equals("OK")) {
            throw new RuntimeException("Password validation failed: " + checkingPassword(password));
        }
       
        String encodedPassword = passwordEncoder.encode(password);
        newSalarie.setPassword(encodedPassword);
        newSalarie.setIsAdmin(false);
        newSalarie.setLocalisation(
                com.IntranetMF.Intranet.modele.LocalisationEnumMF.Localisation.valueOf(localisation));
        newSalarie.setIsConnected(false);

        return salarieControllerMF.save(newSalarie);
    }

    @PostMapping("/login")
    public SalarieMF loginSalarie(
            @RequestParam String mail,
            @RequestParam String password,
            @RequestHeader(value = "Authorization", required = true) String authorization) {

                if(authorization == null || !authorization.equals("Bearer intranetMF-token")) {
                    throw new RuntimeException("Unauthorized: Valid token required to login.");
                }

        var salarieOpt = salarieControllerMF.findByMail(mail);
        if (salarieOpt.isPresent()) {
            SalarieMF salarie = salarieOpt.get();
            LocalDateTime localDateTime = LocalDateTime.now();
            if (passwordEncoder.matches(password, salarie.getPassword())) {
                salarie.setIsConnected(true);
                salarie.setBeginLogin(localDateTime);
                salarieControllerMF.save(salarie);
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
            @RequestParam String mail,
            @RequestHeader(value = "Authorization", required = true) String authorization) {

                if(authorization == null || !authorization.equals("Bearer intranetMF-token")) {
                    throw new RuntimeException("Unauthorized: Valid token required to logout.");
                }
        var salarieOpt = salarieControllerMF.findByMail(mail);
        if (salarieOpt.isPresent()) {
            SalarieMF salarie = salarieOpt.get();
            LocalDateTime localDateTime = LocalDateTime.now();
            salarie.setIsConnected(false);
            salarie.setLastLogin(localDateTime);
            salarieControllerMF.save(salarie);
            return salarie;
        } else {
            throw new RuntimeException("Salarie not found");
        }
    }


    /*
    Cette méthode vérifie si le mot de passe respecte les critères de sécurité suivants :
    - Au moins 8 caractères de long
    - Contient au moins une lettre majuscule
    - Contient au moins une lettre minuscule
    - Contient au moins un chiffre
    - Contient au moins un caractère spécial (!@#$%^&*())
    */
    public String checkingPassword(String password) {
        if(password.length() < 8) {
           return "Password must be at least 8 characters long.";
        }else if(!password.matches(".*[A-Z].*")) {
            return "Password must contain at least one uppercase letter.";
        }else if(!password.matches(".*[a-z].*")) {
            return "Password must contain at least one lowercase letter.";
        }else if(!password.matches(".*\\d.*")) {
            return "Password must contain at least one digit.";
        } else if(!password.matches(".*[!@#$%^&*()].*")) {
            return "Password must contain at least one special character (!@#$%^&*()).";
        }else {
            return "OK";
        }
 
    }

}
