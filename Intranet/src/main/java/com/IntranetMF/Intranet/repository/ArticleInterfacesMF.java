package com.IntranetMF.Intranet.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.time.LocalDate;

import com.IntranetMF.Intranet.modele.ArticleMF;

public interface ArticleInterfacesMF extends JpaRepository<ArticleMF, Long> {

    List<ArticleMF> findByDate(LocalDate date);

       // Récupérer toutes les actualités triées par date (ordre croissant)
    List<ArticleMF> findAllByOrderByDateAsc();
    
    // Récupérer toutes les actualités triées par date (ordre décroissant)
    List<ArticleMF> findAllByOrderByDateDesc();
    
    // Récupérer les actualités d'un certain type triées par date
    List<ArticleMF> findByTypeOrderByDateDesc(String type);

}
