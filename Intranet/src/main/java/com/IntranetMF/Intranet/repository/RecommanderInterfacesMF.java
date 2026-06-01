package com.IntranetMF.Intranet.repository;

import com.IntranetMF.Intranet.modele.RecommandeMF;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.time.LocalDate;
import com.IntranetMF.Intranet.modele.RecommandeMF;

public interface RecommanderInterfacesMF extends JpaRepository<RecommandeMF, Long> {

    List<RecommandeMF> findByRecommanderContainingIgnoreCaseOrderByDateDesc(String recommander);

    List<RecommandeMF> findAllByOrderByDateDesc();
}
