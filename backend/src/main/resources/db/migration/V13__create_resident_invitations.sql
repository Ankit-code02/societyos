CREATE TABLE resident_invitations (
                                      id UUID PRIMARY KEY,

                                      society_id UUID NOT NULL,
                                      unit_id UUID NOT NULL,
                                      invited_by UUID NOT NULL,

                                      email VARCHAR(255) NOT NULL,

                                      token_hash VARCHAR(255) NOT NULL UNIQUE,

                                      expires_at TIMESTAMPTZ NOT NULL,
                                      accepted_at TIMESTAMPTZ,

                                      status VARCHAR(30) NOT NULL,

                                      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                      CONSTRAINT fk_resident_invitations_society
                                          FOREIGN KEY (society_id)
                                              REFERENCES societies(id)
                                              ON DELETE CASCADE,

                                      CONSTRAINT fk_resident_invitations_unit
                                          FOREIGN KEY (unit_id)
                                              REFERENCES society_units(id),

                                      CONSTRAINT fk_resident_invitations_invited_by
                                          FOREIGN KEY (invited_by)
                                              REFERENCES users(id)
);

CREATE INDEX idx_resident_invitations_email
    ON resident_invitations(email);

CREATE INDEX idx_resident_invitations_society
    ON resident_invitations(society_id);

CREATE INDEX idx_resident_invitations_unit
    ON resident_invitations(unit_id);