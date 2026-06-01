package com.IntranetMF.Intranet;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.util.stream.Collectors;
import java.util.Collection;
import java.util.Map;
import java.util.List;

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
                        .requestMatchers("/Oublie/modifier/motdepasse").hasRole("ADMIN")
                        .requestMatchers("/uploads/**").permitAll()
                        .requestMatchers("/recommander/**").authenticated()
                        .requestMatchers("/Article/getArticle").permitAll()
                        .requestMatchers("/Article/deleteArticle/{id}").authenticated()
                        .requestMatchers("/salaries/login").authenticated()
                        .requestMatchers("/salaries/logout").permitAll()
                        .requestMatchers("/auth/sync").permitAll()
                        .requestMatchers("/Oublie/motDePasse").hasRole("ADMIN")
                        .requestMatchers("/Article/upload").authenticated()
                        .requestMatchers("/media/**").permitAll()
                        .requestMatchers("/organigramme/{id}").authenticated()
                        .requestMatchers("/organigramme/nom/{recherche}").authenticated()

                        // à verifier
                        .requestMatchers("/uploads/Photos/**").permitAll()

                        // ADMIN
                        .requestMatchers("/salaries/NewSalarie").hasRole("ADMIN")

                        // USER & ADMIN
                        .requestMatchers("/salaries/{id}").authenticated()
                        .requestMatchers("/Salarie/{email}").authenticated()
                        .requestMatchers("/test-role").hasRole("ADMIN")
                        .requestMatchers("/Photo/Nouveaux").authenticated()
                        .requestMatchers("/Photo/Modifier").authenticated()
                        .requestMatchers("/Photo/Profile/**").permitAll()
                        .requestMatchers("/Organisme/**").authenticated()
                        .requestMatchers("/Article/newArticle").authenticated()
                        .requestMatchers("/Modification/Salarie/{id}").hasRole("ADMIN")
                        .requestMatchers("/salaries/PasswordReset").hasRole("ADMIN")

                        .anyRequest().authenticated() // tout le reste nécessite auth
                )
               .oauth2ResourceServer(oauth2 ->
    oauth2.jwt(Customizer.withDefaults())
);

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
    public JwtAuthenticationConverter jwtAuthenticationConverter() {

        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();

        converter.setJwtGrantedAuthoritiesConverter(jwt -> {

            Map<String, Object> realmAccess = jwt.getClaim("realm_access");

            if (realmAccess == null || realmAccess.isEmpty()) {
                return List.of();
            }

            List<String> roles = (List<String>) realmAccess.get("roles");

            return roles.stream()
                    .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                    .collect(Collectors.toList());
        });

        return converter;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // a modifier avec les vrai adresse ip
        config.setAllowedOrigins(List.of("http://localhost:3000", "http://127.0.0.1:3000",
                "http://localhost:3001",
                "http://localhost",
                "https://keycloak.montfermeil.local:3000", "https://192.168.56.11:3000"));
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