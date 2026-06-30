package com.IntranetMF.Intranet.repository;
import java.util.List;
import java.util.Optional;

import com.IntranetMF.Intranet.modele.OganigrameMF;
import com.IntranetMF.Intranet.modele.TelechargementMF;
import org.springframework.data.jpa.repository.JpaRepository;
public interface TelechargementInterface extends JpaRepository<TelechargementMF, Long> {
    
    List<TelechargementMF> findByOganigrame(OganigrameMF oganigrameMF);
    int countByOganigrameId(Long organigrammeId);

}
