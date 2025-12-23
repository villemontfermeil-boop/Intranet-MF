package com.IntranetMF.Intranet;
import com.IntranetMF.Intranet.modele.SalarieMF;
import com.IntranetMF.Intranet.repository.SalarieInterfacesMF;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.ArrayList;
import org.springframework.context.annotation.Bean;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;


@Service
public class UserDetailsServiceImpl implements UserDetailsService  {

    @Autowired
    private SalarieInterfacesMF salarieRepository;

    @Override
    public UserDetails  loadUserByUsername(String email){
        SalarieMF unSalarie = salarieRepository.findByMail(email).orElseThrow(() -> new UsernameNotFoundException("L'email n'a pas été trouvé"));

        List<GrantedAuthority> authority = new ArrayList<>();

        if(unSalarie.getIsAdmin() && unSalarie.getIsAdmin() != null){
            authority.add( new SimpleGrantedAuthority("ROLE_ADMIN"));
            System.out.println("Vous etes connecter en tant qu'admin");
        }else{
            authority.add( new SimpleGrantedAuthority("ROLE_USER"));
            System.out.println("Vous etes connecter en tant que salarié");

        }

        return new User(
            unSalarie.getMail(),
            unSalarie.getPassword(),
            authority

        );
    }


}
