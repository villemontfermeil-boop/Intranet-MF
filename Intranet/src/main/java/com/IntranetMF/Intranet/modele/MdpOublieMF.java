package com.IntranetMF.Intranet.modele;

import com.IntranetMF.Intranet.modele.SalarieMF;

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
@Table(name = "MdpOublieMF")
public class MdpOublieMF {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "SALARIE_ID")
    private SalarieMF salarie;

    @Column(name = "MOT_DE_PASSE_ACTUEL")
    private String motdepasseactuel;

    @Column(name = "MOT_DE_PASSE_CHANGE")
    private String motdepassechange;

    @Column(name = "OUBLIER")
    private Boolean oublier;

    @Column(name = "NOMBRE_OUBLIE")
    private int nbroublier;

    @Column(name = "DATE_CREATION")
    private LocalDate date;

    @Column(name = "DATE_EXPIRATION")
    private LocalDateTime dateE;

    public Long getId() {
        return this.id;
    }

    public SalarieMF getSalarie() {
        return this.salarie;
    }

    public String getActuel() {
        return this.motdepasseactuel;
    }

    public String getChange() {
        return this.motdepassechange;
    }

    public String getDate() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        return this.date.format(formatter);
    }

    public LocalDateTime getDateExpiration() {
        return this.dateE;
    }

    public Boolean getOublie() {
        return this.oublier;
    }

    public int getNbreOublie() {
        return this.nbroublier;
    }

    public void setActuel(String mdp) {
        this.motdepasseactuel = mdp;
    }

    public void setChange(String mdpC) {
        this.motdepassechange = mdpC;
    }

    public void setDate() {
        this.date = LocalDate.now();

    }

    public void setDateExpiration() {

        this.dateE = LocalDateTime.now().plusHours(24);

    }

    public void setSalarie(SalarieMF unSalarie) {
        this.salarie = unSalarie;
    }

    public void setOublie(Boolean status) {
        this.oublier = status;
    }

    public void setNbreOublie(int nombre) {
        this.nbroublier += nombre;
    }

}
