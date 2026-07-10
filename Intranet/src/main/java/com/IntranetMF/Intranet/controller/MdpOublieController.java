// package com.IntranetMF.Intranet.controller;

// import java.io.IOException;
// import java.nio.charset.StandardCharsets;
// import java.nio.file.Files;
// import java.nio.file.Path;
// import java.nio.file.Paths;
// import java.nio.file.StandardCopyOption;
// import java.nio.file.StandardOpenOption;
// import java.time.LocalDate;
// import java.time.LocalDateTime;
// import java.util.List;
// import java.util.Optional;
// import java.util.UUID;
// import java.nio.file.Path;
// import java.nio.file.Files;
// import java.io.File;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.access.prepost.PreAuthorize;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.web.bind.annotation.DeleteMapping;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PatchMapping;
// import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RequestParam;
// import org.springframework.web.bind.annotation.RestController;
// import org.springframework.web.multipart.MultipartFile;

// import com.IntranetMF.Intranet.modele.MdpOublieMF;
// import com.IntranetMF.Intranet.modele.SalarieMF;
// import com.IntranetMF.Intranet.repository.MdpOublieInterfaces;
// import com.IntranetMF.Intranet.repository.SalarieInterfacesMF;
// import org.springframework.web.bind.annotation.RequestBody;

// /**
//  * Controller REST pour le workflow de mot de passe oublié.
//  *
//  * Permet de créer une demande de réinitialisation, de consulter le statut
//  * et de modifier le mot de passe.
//  */
// @RestController
// @RequestMapping("/Oublie")
// public class MdpOublieController {

//     private final SalarieInterfacesMF salarieInterfacesMF;
//     private final MdpOublieInterfaces mdpOublieInterfaces;

//     @Autowired
//     private PasswordEncoder passwordEncoder;

//     private String logDir = "log/MotDePasseOublie/" + LocalDate.now().getYear() + "/"
//             + LocalDate.now().getMonthValue() + "/"
//             + LocalDate.now().getDayOfMonth();

//     public MdpOublieController(MdpOublieInterfaces mdpOublieInterfaces, SalarieInterfacesMF salarieInterfacesMF) {
//         this.salarieInterfacesMF = salarieInterfacesMF;
//         this.mdpOublieInterfaces = mdpOublieInterfaces;
//     }

//     /**
//      * Crée une demande de réinitialisation de mot de passe.
//      *
//      * @param email    L'adresse e-mail du salarié.
//      * @param password Le nouveau mot de passe à enregistrer.
//      * @return l'enregistrement de réinitialisation créé.
//      */
//     @PostMapping("/motDePasse")
//     public MdpOublieMF nouveauMdpOublie(@RequestParam("email") String email,
//             @RequestParam("password") String password) {

//         // 1. Vérifier si le salarié existe
//         SalarieMF salarie = salarieInterfacesMF.findByMail(email)
//                 .orElseThrow(() -> new RuntimeException("Salarie not found with email : " + email));

//         // 2. Chercher le compte MdpOublie, ou en créer un nouveau
//         Optional<MdpOublieMF> compte = mdpOublieInterfaces.findBySalarie(salarie);
//         // .orElse(new MdpOublieMF()); // Créer un nouveau si pas trouvé
//         if (compte.isEmpty()) {
//             MdpOublieMF nouveaux = new MdpOublieMF();
//             // 3. Remplir les infos du compte
//             nouveaux.setSalarie(salarie);
//             nouveaux.setActuel(salarie.getPassword());
//             nouveaux.setChange(passwordEncoder.encode(password));
//             nouveaux.setOublie(true);
//             nouveaux.setDate();
//             nouveaux.setDateExpiration();
//             salarie.setPassword(passwordEncoder.encode(password));

//             // 4. Gérer le compteur
//             Integer nbreOublie = nouveaux.getNbreOublie();
//             if (nbreOublie == null || nbreOublie == 0) {
//                 nouveaux.setNbreOublie(1);
//             } else if (nbreOublie >= 3) {
//                 throw new RuntimeException("Nombre de réinitialisation atteint");
//             } else {
//                 nouveaux.setNbreOublie(1);
//             }

//             logContenu(salarie.getNom() + ' ' + salarie.getPrenom() + " a changé son mot de passe");

//             return mdpOublieInterfaces.save(nouveaux); // Save gère à la fois création et mise à jour
//         }

//         throw new RuntimeException("Salarié existe déja sur la table");

//     }

//     /**
//      * Obtient le statut d'une demande de mot de passe oublié.
//      *
//      * @param id     L'identifiant de la demande.
//      * @param nom    Le nom du salarié.
//      * @param prenom Le prénom du salarié.
//      * @return l'objet de mot de passe oublié correspondant.
//      */
//     @GetMapping("/Change/{id}")
//     public MdpOublieMF getStatus(@PathVariable Long id, @RequestParam("Nom") String nom,
//             @RequestParam("Prenom") String prenom) {
//         Optional<MdpOublieMF> mdp = mdpOublieInterfaces.findById(id);
//         Optional<SalarieMF> salarie = salarieInterfacesMF.findById(id);

//         if (mdp.isPresent()) {
//             if (salarie.isPresent()) {
//                 logContenu(salarie.get().getNom() + ' ' + salarie.get().getPrenom()
//                         + " a cherché ces information sur  son mot de passe");
//                 return mdp.get();

//             }
//         }
//         throw new RuntimeException("Salarié non trouvé");

//     }

//     /**
//      * Met à jour le mot de passe d'un salarié après une demande oubli.
//      *
//      * @param email    L'adresse e-mail du salarié.
//      * @param password Le nouveau mot de passe.
//      * @return l'objet MdpOublieMF mis à jour.
//      */
//     @PatchMapping("/modifier/motdepasse")
//     public MdpOublieMF modifierMdpOublie(@RequestParam("email") String email,
//             @RequestParam("password") String password) {

//         Optional<SalarieMF> salarie = salarieInterfacesMF.findByMail(email);
//         if (salarie.isPresent()) {
//             Optional<MdpOublieMF> salarieMdp = mdpOublieInterfaces.findBySalarie(salarie.get());
//             if (salarieMdp.isPresent()) {
//                 if (salarieMdp.get().getNbreOublie() < 3) {
//                     MdpOublieMF newPassword = salarieMdp.get();

//                     newPassword.setActuel(salarie.get().getPassword());
//                     newPassword.setChange(passwordEncoder.encode(password));
//                     newPassword.setDate();
//                     newPassword.setDateExpiration();
//                     newPassword.setOublie(true);
//                     newPassword.setNbreOublie(1);
//                     salarie.get().setPassword(passwordEncoder.encode(password));

//                     return mdpOublieInterfaces.save(newPassword);
//                 } else {
//                     throw new RuntimeException("Nombre de réinitialisation atteint");

//                 }

//             }
//             throw new RuntimeException("Salarié non trouvé 1");

//         }
//         throw new RuntimeException("Salarié non trouvé 2");

//     }

//     public void logContenu(String message) {
//         String nomDuFichier = "LogsSalarier.txt";
//         Path cheminPath = Paths.get(logDir, nomDuFichier);

//         // créer dossier si nécessaire
//         File dir = new File(logDir);
//         if (!dir.exists()) {
//             dir.mkdirs();
//         }

//         String contenu = LocalDateTime.now() + " - " + message + "\n";

//         try {
//             Files.write(
//                     cheminPath, // ✅ on passe le Path du fichier
//                     contenu.getBytes(StandardCharsets.UTF_8),
//                     StandardOpenOption.CREATE,
//                     StandardOpenOption.APPEND);
//         } catch (IOException e) {
//             e.printStackTrace(); // au moins loguer l'erreur
//         }
//     }
// }
