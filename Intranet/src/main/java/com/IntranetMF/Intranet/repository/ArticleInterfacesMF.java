package com.IntranetMF.Intranet.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

import com.IntranetMF.Intranet.modele.ArticleMF;

public interface ArticleInterfacesMF extends JpaRepository<ArticleMF, Long> {

    List<ArticleMF> findByDate(LocalDateTime date);
}
