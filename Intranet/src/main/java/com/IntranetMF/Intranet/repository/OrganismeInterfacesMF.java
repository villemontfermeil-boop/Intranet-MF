package com.IntranetMF.Intranet.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.time.LocalDate;

import com.IntranetMF.Intranet.modele.ArticleMF;
import com.IntranetMF.Intranet.modele.OganigrameMF;
public interface OrganismeInterfacesMF extends JpaRepository<OganigrameMF, Long> {
    

}
