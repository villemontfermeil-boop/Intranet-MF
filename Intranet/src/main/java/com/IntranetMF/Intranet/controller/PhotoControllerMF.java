package com.IntranetMF.Intranet.controller;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

import java.nio.file.Files;
import java.io.File;
import java.io.IOException;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.UUID;
import com.IntranetMF.Intranet.repository.PhotoInterfacesMF;
import com.IntranetMF.Intranet.modele.PhotoMF;
import com.IntranetMF.Intranet.modele.SalarieMF;
import com.IntranetMF.Intranet.repository.SalarieInterfacesMF;


@RestController
@RequestMapping("/Photo")
public class PhotoControllerMF {

    private final String uploadDir = "uploads/Photos";
    private final PhotoInterfacesMF photoInterfacesMF ;
    private final SalarieInterfacesMF salarieMF ;


    public PhotoControllerMF(PhotoInterfacesMF photoInterfacesMF, SalarieInterfacesMF salarieMF){
        this.photoInterfacesMF = photoInterfacesMF;
        this.salarieMF = salarieMF;
    }

    @PostMapping("/Nouveaux")
    public ResponseEntity<String> newPhoto(@RequestParam("file") MultipartFile file, @RequestParam Long id) {
        if (!file.getContentType().startsWith("image/")) {
            return ResponseEntity.badRequest().body("Fichier invalide");

        }

        try {
            File fichier = new File(uploadDir);

            if (!fichier.exists()) {
                fichier.mkdirs();
            }

            String nomDuFichier = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path cheminPath = Paths.get(uploadDir, nomDuFichier);

            Files.copy(file.getInputStream(), cheminPath, StandardCopyOption.REPLACE_EXISTING);

            SalarieMF unSalarie = salarieMF.findById(id).orElseThrow(() -> new RuntimeException("Salarié non trouver"));
            PhotoMF unePhotoMF = new PhotoMF();
            unePhotoMF.setModification();
            unePhotoMF.setPhoto(nomDuFichier);
            unePhotoMF.setPath(uploadDir);
            unePhotoMF.setSalarieMF(unSalarie);
            photoInterfacesMF.save(unePhotoMF);
            
            System.out.print("Le salarié"+ unSalarie.getNom() +" "+ unSalarie.getPrenom() + " à changer son profil");
            return ResponseEntity.ok("Image ajouter à " + LocalDate.now());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Il y'a une erreur");

        }
    }


    @GetMapping("/Profile/{id}")
    public Optional<PhotoMF> getProfileImage(@PathVariable Long id) {
        Optional<PhotoMF> profil = photoInterfacesMF.findById(id);
        if (profil.isPresent()){
            return profil;
        }else{
            throw new RuntimeException("Salarie not found with id: " + id);

        }
        
    }
    
}