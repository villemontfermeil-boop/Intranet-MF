package com.IntranetMF.Intranet.repository;

import com.IntranetMF.Intranet.modele.SalarieMF;
import com.IntranetMF.Intranet.modele.LocalisationEnumMF.Localisation;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;


public interface SalarieInterfacesMF extends JpaRepository<SalarieMF, Long> {

    List<SalarieMF> findByIsConnectedTrue();
    Optional<SalarieMF> findByMail(String mail);
    List<SalarieMF> findByLocalisation(Localisation localisation);
    List<SalarieMF> findByFonction(String fonction);
     List<SalarieMF> findByNomContainingIgnoreCase(String nomPartiel);

}
