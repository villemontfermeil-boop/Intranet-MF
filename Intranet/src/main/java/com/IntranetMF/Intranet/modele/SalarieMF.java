package com.IntranetMF.Intranet.modele;
import java.time.LocalDateTime;

import com.IntranetMF.Intranet.modele.LocalisationEnumMF.Localisation;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.NoArgsConstructor;

@Entity
@Table(name= "Salarie_MF")
@NoArgsConstructor
public class SalarieMF {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name= "ID_MF")
    private Long id;

    @Column(name ="NOM_MF")
    private String nom;

    @Column(name= "PRENOM_MF")
    private String prenom;

    @Column(name= "EMAIL_MF")
    private String mail;
    
    @Column(name= "TELEPHONE_MF")
    private String numero;

    @Column(name= "TELEPHONE_PRO")
    private String numeroPro;

    @Column(name= "FONCTION_MF")
    private String fonction;

    @Column(name="PASSWORD_MF")
    private String password;

    @Column(name="IS_ADMIN")
    private Boolean isAdmin;

    @Column(name="LOCALISATION_MF")
    @Enumerated(EnumType.STRING)
    private Localisation localisation;

    
    @Column(name="BEGIN_LOGIN")
    private LocalDateTime beginLogin;

    @Column(name="LAST_LOGIN")
    private LocalDateTime lastLogin;

    @Column(name="IS_CONNECTED")
    private Boolean isConnected;




    //Getters
    public Long getId() {
        return id;
    }
    public String getNom() {
        return nom;
    }
    public String getPrenom() {
        return prenom;
    }
    public String getFonction() {
        return fonction;
    }
    public String getNumero() {
        return numero;
    }
    public Localisation getLocalisation() {
        return localisation;
    }
    public Boolean getIsConnected() {
        return isConnected;
    }
    public String getMail() {
        return mail;
    }

    public String getPassword() {
        return password;
    }
    public LocalDateTime getBeginLogin() {
        return beginLogin;
    }
    public LocalDateTime getLastLogin() {
        return lastLogin;
    }
    public Boolean getIsAdmin() {
        return isAdmin;
    }

    public String getTelephonepro(){
        return numeroPro;
    }




    //Setters
    public void setId(Long id) {
        this.id = id;
    }
    public void setNom(String nom) {
        this.nom = nom;
    }
    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }
    public void setFonction(String fonction) {
        this.fonction = fonction;
    }
    public void setNumero(String numero) {
        this.numero = numero;
    }
    public void setLocalisation(Localisation localisation) {
        this.localisation = localisation;
    }
    public void setIsConnected(Boolean isConnected) {
        this.isConnected = isConnected;
    }

    public void setMail(String mail) {
        this.mail = mail;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public void setBeginLogin(LocalDateTime beginLogin) {
        this.beginLogin = beginLogin;
    }
    public void setLastLogin(LocalDateTime lastLogin) {
        this.lastLogin = lastLogin;
    }
    public void setIsAdmin(Boolean isAdmin) {
        this.isAdmin = isAdmin;
    }
    public void setTelPro(String tel){
        this.numeroPro = tel;
    }
    




  
    

}
