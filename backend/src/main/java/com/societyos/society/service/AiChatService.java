package com.societyos.society.service;

import com.societyos.ai.provider.AiProvider;
import com.societyos.society.dto.AiConversationResponse;
import com.societyos.society.dto.AiMessageResponse;
import com.societyos.society.dto.CreateAiConversationRequest;
import com.societyos.society.dto.SendAiMessageRequest;
import com.societyos.society.entity.AiConversation;
import com.societyos.society.entity.AiMessage;
import com.societyos.society.entity.AiMessageRole;
import com.societyos.society.entity.Society;
import com.societyos.society.repository.AiConversationRepository;
import com.societyos.society.repository.AiMessageRepository;
import com.societyos.society.repository.SocietyRepository;
import com.societyos.user.entity.User;
import com.societyos.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AiChatService {

    private final AiConversationRepository aiConversationRepository;
    private final AiMessageRepository aiMessageRepository;
    private final SocietyRepository societyRepository;
    private final UserRepository userRepository;
    private final AiProvider aiProvider;

    @Transactional
    public AiConversationResponse createConversation(
            UUID societyId,
            UUID userId,
            CreateAiConversationRequest request
    ) {
        Society society = societyRepository.findById(societyId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Society not found"
                ));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "User not found"
                ));

        AiConversation conversation = new AiConversation();

        conversation.setSociety(society);
        conversation.setUser(user);
        conversation.setTitle(request.title());

        return toConversationResponse(
                aiConversationRepository.save(conversation)
        );
    }

    @Transactional(readOnly = true)
    public List<AiConversationResponse> getConversations(
            UUID societyId,
            UUID userId
    ) {
        return aiConversationRepository
                .findBySocietyIdAndUserIdOrderByUpdatedAtDesc(
                        societyId,
                        userId
                )
                .stream()
                .map(this::toConversationResponse)
                .toList();
    }

    @Transactional
    public AiMessageResponse sendMessage(
            UUID societyId,
            UUID userId,
            UUID conversationId,
            SendAiMessageRequest request
    ) {
        AiConversation conversation =
                aiConversationRepository.findById(conversationId)
                        .orElseThrow(() -> new IllegalArgumentException(
                                "Conversation not found"
                        ));

        verifyConversationOwnership(
                conversation,
                societyId,
                userId
        );

        AiMessage userMessage = new AiMessage();

        userMessage.setConversation(conversation);
        userMessage.setRole(AiMessageRole.USER);
        userMessage.setContent(request.content());

        aiMessageRepository.save(userMessage);

        String aiResponse = aiProvider.generateResponse(
                request.content()
        );

        AiMessage assistantMessage = new AiMessage();

        assistantMessage.setConversation(conversation);
        assistantMessage.setRole(AiMessageRole.ASSISTANT);
        assistantMessage.setContent(aiResponse);

        AiMessage savedAssistantMessage =
                aiMessageRepository.save(assistantMessage);

        return toMessageResponse(savedAssistantMessage);
    }

    @Transactional(readOnly = true)
    public List<AiMessageResponse> getMessages(
            UUID societyId,
            UUID userId,
            UUID conversationId
    ) {
        AiConversation conversation =
                aiConversationRepository.findById(conversationId)
                        .orElseThrow(() -> new IllegalArgumentException(
                                "Conversation not found"
                        ));

        verifyConversationOwnership(
                conversation,
                societyId,
                userId
        );

        return aiMessageRepository
                .findByConversationIdOrderByCreatedAtAsc(conversationId)
                .stream()
                .map(this::toMessageResponse)
                .toList();
    }

    private void verifyConversationOwnership(
            AiConversation conversation,
            UUID societyId,
            UUID userId
    ) {
        if (!conversation.getSociety().getId().equals(societyId)) {
            throw new IllegalArgumentException(
                    "Conversation does not belong to this society"
            );
        }

        if (!conversation.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException(
                    "Conversation does not belong to this user"
            );
        }
    }

    private AiConversationResponse toConversationResponse(
            AiConversation conversation
    ) {
        return new AiConversationResponse(
                conversation.getId(),
                conversation.getSociety().getId(),
                conversation.getUser().getId(),
                conversation.getTitle(),
                conversation.getCreatedAt(),
                conversation.getUpdatedAt()
        );
    }

    private AiMessageResponse toMessageResponse(
            AiMessage message
    ) {
        return new AiMessageResponse(
                message.getId(),
                message.getConversation().getId(),
                message.getRole(),
                message.getContent(),
                message.getCreatedAt()
        );
    }
}