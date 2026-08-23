package com.societyos.society.repository;

import com.societyos.society.entity.AiConversation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AiConversationRepository
        extends JpaRepository<AiConversation, UUID> {

    List<AiConversation> findBySocietyIdAndUserIdOrderByUpdatedAtDesc(
            UUID societyId,
            UUID userId
    );
}