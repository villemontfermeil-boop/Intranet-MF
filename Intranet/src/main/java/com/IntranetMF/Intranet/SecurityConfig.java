package com.IntranetMF.Intranet;

import com.IntranetMF.Intranet.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
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

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // ROUTES PUBLIQUES

                        .requestMatchers("/uploads/**").permitAll()
                        .requestMatchers("/Article/getArticle").permitAll()
                        .requestMatchers("/salaries/login").permitAll()
                        .requestMatchers("/Article/upload").authenticated()
                        .requestMatchers("/media/**").permitAll()
                        
                        // ADMIN
                        .requestMatchers("/salaries/NewSalarie").hasRole("ADMIN")

                        // USER & ADMIN
                        .requestMatchers("/salaries/{id}").hasAnyRole("USER", "ADMIN")
                        .requestMatchers("/salaries/logout").authenticated()
                        .requestMatchers("/Salarie/{email}").authenticated()
                        .requestMatchers("/Article/newArticle").authenticated()
                        .requestMatchers("/Modification/Salarie/{id}").hasRole("ADMIN")

                        .anyRequest().authenticated() // tout le reste nécessite auth
                )
                .httpBasic(Customizer.withDefaults());

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
                "http://localhost"));
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