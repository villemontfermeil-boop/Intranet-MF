package com.IntranetMF.Intranet.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.IntranetMF.Intranet.modele.PhotoMF;
import com.IntranetMF.Intranet.modele.SalarieMF;

public interface PhotoInterfacesMF extends JpaRepository<PhotoMF,Long>{


    Optional<PhotoMF> findBySalarie (SalarieMF unsalarie);
}
