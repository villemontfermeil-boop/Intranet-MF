package com.IntranetMF.Intranet.modele;

import com.IntranetMF.Intranet.modele.SalarieMF;

import com.IntranetMF.Intranet.modele.ArticleEnumMF;
import com.IntranetMF.Intranet.modele.ArticleEnumMF.TypeArticle;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.LocalDate;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ArticleMF")
public class ArticleMF {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "SALARIE_ID")
    private SalarieMF salarie;

    @Column(name = "TITRE_MF")
    private String titre;

    @Column(name = "DESCRIPTION_MF", nullable = false, columnDefinition="TEXT")
    private String description;

    @Column(name = "DATE_CREATION", nullable = false)
    private LocalDate date;

    @Column(name = "TYPE", nullable = false)
    @Enumerated(EnumType.STRING)
    private TypeArticle type;

    @Column(name = "MEDIA_MF", nullable = true)
    private String media;

    @Column(name = "MEDIA_PATH", nullable = true)
    private String path;

    public String getDescription() {
        return description;
    }

    public String getTitre() {
        return titre;
    }

    public Long getId() {
        return id;
    }

    public SalarieMF getSalarie() {
        return salarie;
    }

    public String getCreation() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        return this.date.format(formatter);
    }

    public String getMediaName() {
        return media;
    }

    public String getPath() {
        return path;
    }

    public TypeArticle getType() {
        return type;
    }

    // SETTER
    public void setDescription(String value) {
        this.description = value;
    }

    public void setSalarie(SalarieMF unSalarier) {

        this.salarie = unSalarier;

    }

    public void setCreation() {
        this.date = LocalDate.now();
    }

    public void setMediaName(String value) {
        this.media = value;
    }

    public void setPath(String value) {
        this.path = value;
    }

    public void setType(TypeArticle types) {
        this.type = types;
    }

    public void setTitre(String titres) {
        this.titre = titres;
    }

}
