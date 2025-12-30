package com.IntranetMF.Intranet.controller;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;
import java.nio.file.Paths;

import java.nio.file.Files;

@RestController
@RequestMapping("/media")
public class MediaController {

     private final Path uploadDir = Paths.get("src/main/resources/static/uploads");

    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> getMedia(@PathVariable String filename) {
        try {
            // Utiliser uploadDir défini plus haut
            Path file = uploadDir.resolve(filename).normalize();
            Resource resource = new UrlResource(file.toUri());

            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            // Détecter le type MIME
            String contentType = Files.probeContentType(file);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

}