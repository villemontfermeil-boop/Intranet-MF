package com.IntranetMF.Intranet.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

import com.IntranetMF.Intranet.modele.MdpOublieMF;
import com.IntranetMF.Intranet.modele.PhotoMF;
import com.IntranetMF.Intranet.modele.SalarieMF;

public interface MdpOublieInterfaces extends JpaRepository<MdpOublieMF, Long> {


       Optional<MdpOublieMF> findBySalarie (SalarieMF unsalarie);

}
