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

    String body = """
        {
          "model": "mistral-small-latest",
          "messages": [
            {
              "role": "user",
              "content": "%s"
            }
          ]
        }
        """.formatted(prompt);

    HttpEntity<String> request = new HttpEntity<>(body, headers);

    ResponseEntity<String> response = restTemplate.postForEntity(
        "https://api.mistral.ai/v1/chat/completions",
        request,
        String.class);

    try {
      JsonNode root = mapper.readTree(response.getBody());
      String content = root.path("choices")
          .get(0)
          .path("message")
          .path("content")
          .asText();
      System.out.println("MESSAGE: " + content);

      return root.path("choices")
          .get(0)
          .path("message")
          .path("content")
          .asText();

    } catch (Exception e) {
      throw new RuntimeException("Erreur parsing IA", e);
    }
  }
}