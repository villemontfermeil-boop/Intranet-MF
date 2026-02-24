package com.IntranetMF.Intranet.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.IntranetMF.Intranet.modele.LocalisationEnumMF.Localisation;
import com.IntranetMF.Intranet.modele.PhotoMF;

public interface PhotoInterfacesMF extends JpaRepository<PhotoMF,Long>{

}
