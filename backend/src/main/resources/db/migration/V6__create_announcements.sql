CREATE TABLE society_announcements (
                                       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                                       society_id UUID NOT NULL,
                                       created_by UUID NOT NULL,

                                       title VARCHAR(200) NOT NULL,
                                       content TEXT NOT NULL,

                                       category VARCHAR(30) NOT NULL,

                                       status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',

                                       published_at TIMESTAMPTZ,

                                       created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                       updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                       CONSTRAINT fk_announcements_society
                                           FOREIGN KEY (society_id)
                                               REFERENCES societies(id),

                                       CONSTRAINT fk_announcements_created_by
                                           FOREIGN KEY (created_by)
                                               REFERENCES users(id)
);

CREATE INDEX idx_announcements_society
    ON society_announcements(society_id);

CREATE INDEX idx_announcements_status
    ON society_announcements(status);

CREATE INDEX idx_announcements_created_at
    ON society_announcements(created_at);