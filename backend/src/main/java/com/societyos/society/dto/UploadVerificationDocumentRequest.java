package com.societyos.society.dto;

import com.societyos.society.entity.SocietyDocumentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UploadVerificationDocumentRequest {

    @NotNull(message = "Document type is required")
    private SocietyDocumentType documentType;

    @NotBlank(message = "File name is required")
    @Size(
            max = 255,
            message = "File name must not exceed 255 characters"
    )
    private String fileName;

    @NotBlank(message = "Storage key is required")
    @Size(
            max = 500,
            message = "Storage key must not exceed 500 characters"
    )
    private String storageKey;
}