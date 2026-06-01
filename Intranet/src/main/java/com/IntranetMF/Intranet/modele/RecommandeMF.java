package com.IntranetMF.Intranet.modele;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "RecommandeMF")
public class RecommandeMF {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "DATE_ENVOIE_MF")
    private LocalDate date;

    @Column(name = "RECOMMANDE_MF")
    private String recommander;

    @Column(name = "SERVICE_MF")
    private String service;

    // getter
    public Long getId() {
        return this.id;
    }

    public LocalDate getDate() {
        return this.date;

    }

    public String getRecommande() {
        return this.recommander;
    }

    public String getService() {
        return this.service;
    }

    // setter

    public void setDate(LocalDate d) {

        this.date = d;

    }

    public void setRecommande(String e) {
        this.recommander = e;
    }

    public void setService(String e) {
        this.service = e;
    }

}
