package com.IntranetMF.Intranet.modele;

import com.IntranetMF.Intranet.modele.OganigrameMF;

import java.time.LocalDateTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "TelechargementMF")
public class TelechargementMF {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(name = "NOM_FICHIER")
    private String nom;

    @Column(name = "PATH")
    private String path;

    @Column(name = "DATE_AJOUT")
    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "OGANIGRAMME_ID", nullable = true)
    private OganigrameMF oganigrame;

    public OganigrameMF getOrganisme() {
        return oganigrame;
    }

    public void setOrganisme(OganigrameMF o) {
        this.oganigrame = o;
    }

    // ----------------------------

    public Long getId() {

        return this.id;
    }

    public String getNom() {
        return this.nom;
    }

    public void setNom(String n) {
        this.nom = n;
    }

    // -----------------------

    public String getPath() {

        return this.path;
    }

    public void setPath(String p) {

        this.path = p;

    }

    // -----------------------

    public LocalDate getdate() {

        return this.date;
    }

    public void setDate(LocalDate d) {

        this.date = d;

    }

}
