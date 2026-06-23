package com.IntranetMF.Intranet.modele;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AiServices {

  @Value("${mistral.api.key}")
  private String apiKey;

  private final RestTemplate restTemplate = new RestTemplate();
  private final ObjectMapper mapper = new ObjectMapper();

  public String askAi(String prompt) {

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.setBearerAuth(apiKey);

    try {
      ObjectNode root = mapper.createObjectNode();
      root.put("model", "mistral-small-latest");

      ArrayNode messages = mapper.createArrayNode();
      ObjectNode message = mapper.createObjectNode();

      message.put("role", "user");
      message.put("content", prompt);

      messages.add(message);
      root.set("messages", messages);

      String body = mapper.writeValueAsString(root);

      HttpEntity<String> request = new HttpEntity<>(body, headers);

      ResponseEntity<String> response = restTemplate.postForEntity(
          "https://api.mistral.ai/v1/chat/completions",
          request,
          String.class);

      JsonNode json = mapper.readTree(response.getBody());
      System.out.print(json.path("choices")
          .get(0)
          .path("message")
          .path("content")
          .asText());
      return json.path("choices")
          .get(0)
          .path("message")
          .path("content")
          .asText();

    } catch (Exception e) {
      e.printStackTrace(); 
      throw new RuntimeException("Erreur IA", e);
    }
  }
}