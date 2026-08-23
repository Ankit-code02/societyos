-- ============================================================
-- SocietyOS Module 1
-- Identity, Authentication & Society Onboarding
-- ============================================================

-- =========================
-- Roles
-- =========================

CREATE TABLE roles (
                       id UUID PRIMARY KEY,
                       code VARCHAR(50) NOT NULL UNIQUE,
                       name VARCHAR(100) NOT NULL,
                       created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- Users
-- =========================

CREATE TABLE users (
                       id UUID PRIMARY KEY,
                       first_name VARCHAR(100) NOT NULL,
                       last_name VARCHAR(100) NOT NULL,
                       email VARCHAR(255) NOT NULL UNIQUE,
                       phone VARCHAR(20) NOT NULL UNIQUE,
                       password_hash VARCHAR(255) NOT NULL,
                       status VARCHAR(30) NOT NULL,
                       email_verified_at TIMESTAMPTZ,
                       phone_verified_at TIMESTAMPTZ,
                       created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                       CONSTRAINT chk_users_status
                           CHECK (status IN (
                                             'PENDING_VERIFICATION',
                                             'ACTIVE',
                                             'SUSPENDED'
                               ))
);

CREATE INDEX idx_users_status
    ON users(status);

-- =========================
-- User Roles
-- =========================

CREATE TABLE user_roles (
                            user_id UUID NOT NULL,
                            role_id UUID NOT NULL,

                            PRIMARY KEY (user_id, role_id),

                            CONSTRAINT fk_user_roles_user
                                FOREIGN KEY (user_id)
                                    REFERENCES users(id)
                                    ON DELETE CASCADE,

                            CONSTRAINT fk_user_roles_role
                                FOREIGN KEY (role_id)
                                    REFERENCES roles(id)
                                    ON DELETE CASCADE
);

-- =========================
-- OTP Verifications
-- =========================

CREATE TABLE otp_verifications (
                                   id UUID PRIMARY KEY,
                                   user_id UUID NOT NULL,
                                   channel VARCHAR(20) NOT NULL,
                                   purpose VARCHAR(30) NOT NULL,
                                   otp_hash VARCHAR(255) NOT NULL,
                                   expires_at TIMESTAMPTZ NOT NULL,
                                   attempt_count INTEGER NOT NULL DEFAULT 0,
                                   verified_at TIMESTAMPTZ,
                                   created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                   CONSTRAINT fk_otp_user
                                       FOREIGN KEY (user_id)
                                           REFERENCES users(id)
                                           ON DELETE CASCADE,

                                   CONSTRAINT chk_otp_channel
                                       CHECK (channel IN ('EMAIL', 'PHONE')),

                                   CONSTRAINT chk_otp_purpose
                                       CHECK (
                                           purpose IN (
                                                       'REGISTRATION',
                                                       'PASSWORD_RESET',
                                                       'CHANGE_EMAIL',
                                                       'CHANGE_PHONE'
                                               )
                                           ),

                                   CONSTRAINT chk_otp_attempt_count
                                       CHECK (attempt_count >= 0)
);

CREATE INDEX idx_otp_user_channel_purpose
    ON otp_verifications(user_id, channel, purpose);

CREATE INDEX idx_otp_expires_at
    ON otp_verifications(expires_at);

-- =========================
-- Refresh Tokens
-- =========================

CREATE TABLE refresh_tokens (
                                id UUID PRIMARY KEY,
                                user_id UUID NOT NULL,
                                token_hash VARCHAR(255) NOT NULL UNIQUE,
                                expires_at TIMESTAMPTZ NOT NULL,
                                revoked_at TIMESTAMPTZ,
                                created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                CONSTRAINT fk_refresh_token_user
                                    FOREIGN KEY (user_id)
                                        REFERENCES users(id)
                                        ON DELETE CASCADE
);

CREATE INDEX idx_refresh_tokens_user_id
    ON refresh_tokens(user_id);

-- =========================
-- Societies
-- =========================

CREATE TABLE societies (
                           id UUID PRIMARY KEY,
                           name VARCHAR(255) NOT NULL,
                           address_line VARCHAR(500) NOT NULL,
                           city VARCHAR(100) NOT NULL,
                           state VARCHAR(100) NOT NULL,
                           pin_code VARCHAR(10) NOT NULL,
                           building_count INTEGER NOT NULL,
                           unit_count INTEGER NOT NULL,
                           status VARCHAR(30) NOT NULL,
                           created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                           CONSTRAINT chk_society_status
                               CHECK (
                                   status IN (
                                              'DRAFT',
                                              'PENDING_VERIFICATION',
                                              'VERIFIED',
                                              'SUSPENDED'
                                       )
                                   ),

                           CONSTRAINT chk_society_building_count
                               CHECK (building_count >= 0),

                           CONSTRAINT chk_society_unit_count
                               CHECK (unit_count >= 0)
);

CREATE INDEX idx_societies_status
    ON societies(status);

-- =========================
-- Society Verifications
-- =========================

CREATE TABLE society_verifications (
                                       id UUID PRIMARY KEY,
                                       society_id UUID NOT NULL,
                                       applicant_user_id UUID NOT NULL,
                                       claimed_position VARCHAR(40) NOT NULL,
                                       status VARCHAR(30) NOT NULL,
                                       rejection_reason VARCHAR(1000),
                                       submitted_at TIMESTAMPTZ,
                                       reviewed_at TIMESTAMPTZ,
                                       reviewed_by UUID,
                                       created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                       updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                       CONSTRAINT fk_society_verification_society
                                           FOREIGN KEY (society_id)
                                               REFERENCES societies(id)
                                               ON DELETE CASCADE,

                                       CONSTRAINT fk_society_verification_applicant
                                           FOREIGN KEY (applicant_user_id)
                                               REFERENCES users(id),

                                       CONSTRAINT fk_society_verification_reviewer
                                           FOREIGN KEY (reviewed_by)
                                               REFERENCES users(id),

                                       CONSTRAINT chk_claimed_position
                                           CHECK (
                                               claimed_position IN (
                                                                    'OWNER',
                                                                    'SECRETARY',
                                                                    'AUTHORIZED_REPRESENTATIVE'
                                                   )
                                               ),

                                       CONSTRAINT chk_verification_status
                                           CHECK (
                                               status IN (
                                                          'PENDING',
                                                          'UNDER_REVIEW',
                                                          'APPROVED',
                                                          'REJECTED'
                                                   )
                                               )
);

CREATE INDEX idx_society_verifications_status
    ON society_verifications(status);

CREATE INDEX idx_society_verifications_applicant
    ON society_verifications(applicant_user_id);

-- =========================
-- Society Verification Documents
-- =========================

CREATE TABLE society_verification_documents (
                                                id UUID PRIMARY KEY,
                                                verification_id UUID NOT NULL,
                                                file_name VARCHAR(255) NOT NULL,
                                                storage_key VARCHAR(500) NOT NULL,
                                                document_type VARCHAR(50) NOT NULL,
                                                uploaded_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                                CONSTRAINT fk_verification_document
                                                    FOREIGN KEY (verification_id)
                                                        REFERENCES society_verifications(id)
                                                        ON DELETE CASCADE
);

CREATE INDEX idx_verification_documents_verification
    ON society_verification_documents(verification_id);

-- =========================
-- Society Members
-- =========================

CREATE TABLE society_members (
                                 id UUID PRIMARY KEY,
                                 society_id UUID NOT NULL,
                                 user_id UUID NOT NULL,
                                 role VARCHAR(30) NOT NULL,
                                 position VARCHAR(40) NOT NULL,
                                 status VARCHAR(30) NOT NULL,
                                 joined_at TIMESTAMPTZ,
                                 created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                 updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                 CONSTRAINT fk_society_member_society
                                     FOREIGN KEY (society_id)
                                         REFERENCES societies(id)
                                         ON DELETE CASCADE,

                                 CONSTRAINT fk_society_member_user
                                     FOREIGN KEY (user_id)
                                         REFERENCES users(id)
                                         ON DELETE CASCADE,

                                 CONSTRAINT uq_society_member
                                     UNIQUE (society_id, user_id),

                                 CONSTRAINT chk_society_member_role
                                     CHECK (
                                         role IN (
                                                  'SOCIETY_ADMIN',
                                                  'RESIDENT'
                                             )
                                         ),

                                 CONSTRAINT chk_society_member_position
                                     CHECK (
                                         position IN (
                                                      'OWNER',
                                                      'SECRETARY',
                                                      'AUTHORIZED_REPRESENTATIVE',
                                                      'RESIDENT'
                                             )
                                         ),

                                 CONSTRAINT chk_society_member_status
                                     CHECK (
                                         status IN (
                                                    'PENDING',
                                                    'ACTIVE',
                                                    'SUSPENDED',
                                                    'REMOVED'
                                             )
                                         )
);

CREATE INDEX idx_society_members_user
    ON society_members(user_id);

CREATE INDEX idx_society_members_society
    ON society_members(society_id);

-- =========================
-- Admin Invitations
-- =========================

CREATE TABLE admin_invitations (
                                   id UUID PRIMARY KEY,
                                   society_id UUID NOT NULL,
                                   invited_by UUID NOT NULL,
                                   email VARCHAR(255) NOT NULL,
                                   position VARCHAR(40) NOT NULL,
                                   token_hash VARCHAR(255) NOT NULL UNIQUE,
                                   expires_at TIMESTAMPTZ NOT NULL,
                                   accepted_at TIMESTAMPTZ,
                                   status VARCHAR(30) NOT NULL,
                                   created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                   CONSTRAINT fk_admin_invitation_society
                                       FOREIGN KEY (society_id)
                                           REFERENCES societies(id)
                                           ON DELETE CASCADE,

                                   CONSTRAINT fk_admin_invitation_inviter
                                       FOREIGN KEY (invited_by)
                                           REFERENCES users(id),

                                   CONSTRAINT chk_admin_invitation_position
                                       CHECK (
                                           position IN (
                                                        'OWNER',
                                                        'SECRETARY',
                                                        'AUTHORIZED_REPRESENTATIVE'
                                               )
                                           ),

                                   CONSTRAINT chk_admin_invitation_status
                                       CHECK (
                                           status IN (
                                                      'PENDING',
                                                      'ACCEPTED',
                                                      'EXPIRED',
                                                      'CANCELLED'
                                               )
                                           )
);

CREATE INDEX idx_admin_invitations_email
    ON admin_invitations(email);

CREATE INDEX idx_admin_invitations_society
    ON admin_invitations(society_id);
-- =========================
-- Initial Roles
-- =========================

INSERT INTO roles (id, code, name)
VALUES
    (gen_random_uuid(), 'SUPER_ADMIN', 'Platform Administrator'),
    (gen_random_uuid(), 'USER', 'Verified User'),
    (gen_random_uuid(), 'SOCIETY_ADMIN', 'Society Administrator'),
    (gen_random_uuid(), 'RESIDENT', 'Society Resident');