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
@Table(name="PhotoMF")
public class PhotoMF {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;

    @ManyToOne
    @JoinColumn(name = "SALARIE_ID")
    private SalarieMF salarie;

    @Column(name = "PHOTO_MF")
    private String photo;
    
    @Column(name= "PATH_PHOTOMF")
    private String path;

    @Column(name = "DATE_DE_MODIFICATION")
    private LocalDate date;




    //Geter

    public Long getId(){
        return this.id;
    }

    public SalarieMF getSalarieMF(){
        return this.salarie;
    }

    public String getPhoto(){
        return this.photo;
    }

    public String getPath(){
        return this.path;
    }

    public String getDate(){
         DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        return this.date.format(formatter);
    }



    //Setter

    public void setSalarieMF(SalarieMF s){
        this.salarie = s;
    }

    public void setPhoto(String p){
        this.photo = p;
    }
    
    public void setPath(String P){
        this.path = P;
    }
    
    public void setModification(){
        this.date = LocalDate.now();
    }
}
