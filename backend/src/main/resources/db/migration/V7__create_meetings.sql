CREATE TABLE society_meetings (
                                  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                                  society_id UUID NOT NULL,
                                  created_by UUID NOT NULL,

                                  title VARCHAR(200) NOT NULL,
                                  description TEXT,

                                  scheduled_at TIMESTAMPTZ NOT NULL,
                                  venue VARCHAR(200) NOT NULL,

                                  status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED',

                                  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                  CONSTRAINT fk_meetings_society
                                      FOREIGN KEY (society_id)
                                          REFERENCES societies(id),

                                  CONSTRAINT fk_meetings_created_by
                                      FOREIGN KEY (created_by)
                                          REFERENCES users(id)
);

CREATE INDEX idx_meetings_society
    ON society_meetings(society_id);

CREATE INDEX idx_meetings_status
    ON society_meetings(status);

CREATE INDEX idx_meetings_scheduled_at
    ON society_meetings(scheduled_at);