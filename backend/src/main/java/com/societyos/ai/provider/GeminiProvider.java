package com.societyos.ai.provider;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class GeminiProvider implements AiProvider {

    @Value("${ai.gemini.api-key}")
    private String apiKey;

    @Value("${ai.gemini.model}")
    private String model;

    private final RestClient restClient = RestClient.builder()
            .baseUrl("https://generativelanguage.googleapis.com")
            .build();

    @Override
    public String generateResponse(String userMessage) {

        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException(
                    "GEMINI_API_KEY is not configured"
            );
        }

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of(
                                "role", "user",
                                "parts", List.of(
                                        Map.of(
                                                "text",
                                                """
                                                You are the SocietyOS AI assistant.

                                                Help residents with society-related questions
                                                such as complaints, maintenance, announcements,
                                                meetings, and general society procedures.

                                                Be clear, concise, polite, and practical.

                                                If you do not have enough information about a
                                                SocietyOS-specific policy, say that the resident
                                                should contact the society administration rather
                                                than inventing a policy.

                                                User question:
                                                """ + userMessage
                                        )
                                )
                        )
                )
        );

        String response = restClient.post()
                .uri("/v1beta/models/" + model + ":generateContent")
                .header("x-goog-api-key", apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(requestBody)
                .retrieve()
                .body(String.class);

        return extractText(response);
    }

    private String extractText(String response) {

        Pattern pattern = Pattern.compile(
                "\"text\"\\s*:\\s*\"((?:\\\\.|[^\"\\\\])*)\""
        );

        Matcher matcher = pattern.matcher(response);

        if (!matcher.find()) {
            throw new IllegalStateException(
                    "Gemini response did not contain generated text"
            );
        }

        return unescapeJsonString(matcher.group(1));
    }

    private String unescapeJsonString(String value) {

        return value
                .replace("\\n", "\n")
                .replace("\\r", "\r")
                .replace("\\t", "\t")
                .replace("\\\"", "\"")
                .replace("\\\\", "\\");
    }
}