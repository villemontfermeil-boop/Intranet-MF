package com.IntranetMF.Intranet.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.IntranetMF.Intranet.modele.LocalisationEnumMF.Localisation;
import com.IntranetMF.Intranet.modele.SalarieMF;
import com.IntranetMF.Intranet.modele.OganigrameMF;

public interface SalarieInterfacesMF extends JpaRepository<SalarieMF, Long> {

    List<SalarieMF> findByIsConnectedTrue();

    Optional<SalarieMF> findByMail(String mail);

    List<SalarieMF> findByLocalisation(Localisation localisation);

    List<SalarieMF> findByFonction(String fonction);

    // Repository
    List<SalarieMF> findByPrenomContainingIgnoreCaseOrNomContainingIgnoreCase(String prenom, String nom);
    List<SalarieMF> findByPrenomContainingIgnoreCaseAndNomContainingIgnoreCase(String prenom, String nom);
    List<SalarieMF> findByOganigrame(OganigrameMF oganigrameMF);

}
