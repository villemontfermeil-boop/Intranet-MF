package com.IntranetMF.Intranet.modele;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="Oganigrame_MF")
public class OganigrameMF {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="LABEL_MF")
    private String label;

    @Column(name="ADRESSE_MF")
    private String adresse;

    @Column(name="TELEPHONE_MF")
    private String telephone;

    // GETTERS & SETTERS

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }
}