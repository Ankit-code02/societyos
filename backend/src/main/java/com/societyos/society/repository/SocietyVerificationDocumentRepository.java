package com.societyos.society.repository;

import com.societyos.society.entity.SocietyVerificationDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SocietyVerificationDocumentRepository
        extends JpaRepository<SocietyVerificationDocument, UUID> {

    List<SocietyVerificationDocument> findByVerificationId(
            UUID verificationId
    );
}
