package com.societyos.society.controller;

import com.societyos.society.dto.AiConversationResponse;
import com.societyos.society.dto.AiMessageResponse;
import com.societyos.society.dto.CreateAiConversationRequest;
import com.societyos.society.dto.SendAiMessageRequest;
import com.societyos.society.service.AiChatService;
import com.societyos.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/societies")
@RequiredArgsConstructor
public class AiChatController {

    private final AiChatService aiChatService;

    @PostMapping("/{societyId}/ai/conversations")
    public AiConversationResponse createConversation(
            @PathVariable UUID societyId,
            @Valid @RequestBody CreateAiConversationRequest request,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        return aiChatService.createConversation(
                societyId,
                user.getId(),
                request
        );
    }

    @GetMapping("/{societyId}/ai/conversations")
    public List<AiConversationResponse> getConversations(
            @PathVariable UUID societyId,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        return aiChatService.getConversations(
                societyId,
                user.getId()
        );
    }

    @PostMapping(
            "/{societyId}/ai/conversations/{conversationId}/messages"
    )
    public AiMessageResponse sendMessage(
            @PathVariable UUID societyId,
            @PathVariable UUID conversationId,
            @Valid @RequestBody SendAiMessageRequest request,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        return aiChatService.sendMessage(
                societyId,
                user.getId(),
                conversationId,
                request
        );
    }

    @GetMapping(
            "/{societyId}/ai/conversations/{conversationId}/messages"
    )
    public List<AiMessageResponse> getMessages(
            @PathVariable UUID societyId,
            @PathVariable UUID conversationId,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        return aiChatService.getMessages(
                societyId,
                user.getId(),
                conversationId
        );
    }
}