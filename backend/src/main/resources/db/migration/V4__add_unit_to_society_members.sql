ALTER TABLE society_members
    ADD COLUMN unit_id UUID;

ALTER TABLE society_members
    ADD CONSTRAINT fk_society_members_unit
        FOREIGN KEY (unit_id)
            REFERENCES society_units(id);

CREATE INDEX idx_society_members_unit
    ON society_members(unit_id);