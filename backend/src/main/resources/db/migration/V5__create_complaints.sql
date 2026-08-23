CREATE TABLE society_complaints (
                                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                                    society_id UUID NOT NULL,
                                    created_by UUID NOT NULL,
                                    unit_id UUID,

                                    category VARCHAR(30) NOT NULL,
                                    title VARCHAR(150) NOT NULL,
                                    description TEXT NOT NULL,

                                    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
                                    status VARCHAR(30) NOT NULL DEFAULT 'OPEN',

                                    assigned_to UUID,
                                    resolution_note TEXT,

                                    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                    resolved_at TIMESTAMPTZ,

                                    CONSTRAINT fk_complaint_society
                                        FOREIGN KEY (society_id)
                                            REFERENCES societies(id),

                                    CONSTRAINT fk_complaint_creator
                                        FOREIGN KEY (created_by)
                                            REFERENCES users(id),

                                    CONSTRAINT fk_complaint_unit
                                        FOREIGN KEY (unit_id)
                                            REFERENCES society_units(id),

                                    CONSTRAINT fk_complaint_assignee
                                        FOREIGN KEY (assigned_to)
                                            REFERENCES users(id)
);

CREATE INDEX idx_society_complaints_society
    ON society_complaints(society_id);

CREATE INDEX idx_society_complaints_creator
    ON society_complaints(created_by);

CREATE INDEX idx_society_complaints_status
    ON society_complaints(status);

CREATE INDEX idx_society_complaints_assigned_to
    ON society_complaints(assigned_to);