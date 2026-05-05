package com.IntranetMF.Intranet;

import com.IntranetMF.Intranet.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.access.hierarchicalroles.RoleHierarchy;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true, securedEnabled = true, jsr250Enabled = true)
public class SecurityConfig {

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Bean
    public RoleHierarchy roleHierarchy() {
        return RoleHierarchyImpl.fromHierarchy("ROLE_ADMIN > ROLE_USER");
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // ROUTES PUBLIQUES
                        .requestMatchers("/salaries/**").permitAll()
                        .requestMatchers("/Oublie/modifier/motdepasse").permitAll()
                        .requestMatchers("/uploads/**").permitAll()
                        .requestMatchers("/Article/getArticle").permitAll()
                        .requestMatchers("/salaries/login").permitAll()
                        .requestMatchers("/salaries/logout").permitAll()
                        .requestMatchers("/auth/sync").permitAll()
                        .requestMatchers("/Oublie/motDePasse").permitAll()
                        .requestMatchers("/Article/upload").authenticated()
                        .requestMatchers("/media/**").permitAll()
                        .requestMatchers("/organigramme/{id}").permitAll()
                        .requestMatchers("/organigramme/nom/{recherche}").permitAll()
                        

                        // à verifier
                        .requestMatchers("/uploads/Photos/**").permitAll()

                        // ADMIN
                        .requestMatchers("/salaries/NewSalarie").hasRole("ADMIN")

                        // USER & ADMIN
                        .requestMatchers("/salaries/{id}").permitAll()
                        .requestMatchers("/Salarie/{email}").authenticated()
                        .requestMatchers("/Photo/Nouveaux").authenticated()
                        .requestMatchers("/Photo/Modifier").authenticated()
                        .requestMatchers("/Photo/Profile/**").permitAll()
                        .requestMatchers("/Organisme/**").permitAll()
                        .requestMatchers("/Article/newArticle").authenticated()
                        .requestMatchers("/Modification/Salarie/{id}").hasRole("ADMIN")
                        .requestMatchers("/salaries/PasswordReset").hasRole("ADMIN")

                        .anyRequest().permitAll() // tout le reste nécessite auth
                )
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> {
                    jwt.jwtAuthenticationConverter(new JwtAuthenticationConverter());
                }));

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {

        AuthenticationManagerBuilder auth = http.getSharedObject(AuthenticationManagerBuilder.class);

        auth.userDetailsService(userDetailsService)
                .passwordEncoder(passwordEncoder());

        return auth.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // a modifier avec les vrai adresse ip
        config.setAllowedOrigins(List.of("http://localhost:3000", "http://127.0.0.1:3000",
                "http://localhost:3001",
                "http://localhost",
                "https://keycloak.montfermeil.local:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}