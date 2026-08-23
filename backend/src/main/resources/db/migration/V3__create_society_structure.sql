CREATE TABLE society_buildings (
                                   id UUID PRIMARY KEY,
                                   society_id UUID NOT NULL,
                                   name VARCHAR(100) NOT NULL,
                                   code VARCHAR(30) NOT NULL,
                                   floor_count INTEGER NOT NULL,
                                   unit_count INTEGER NOT NULL,
                                   created_at TIMESTAMPTZ NOT NULL,
                                   updated_at TIMESTAMPTZ NOT NULL,

                                   CONSTRAINT fk_society_buildings_society
                                       FOREIGN KEY (society_id)
                                           REFERENCES societies(id),

                                   CONSTRAINT uq_society_building_code
                                       UNIQUE (society_id, code),

                                   CONSTRAINT chk_society_building_floor_count
                                       CHECK (floor_count > 0),

                                   CONSTRAINT chk_society_building_unit_count
                                       CHECK (unit_count > 0)
);

CREATE INDEX idx_society_buildings_society
    ON society_buildings(society_id);

CREATE TABLE society_units (
                               id UUID PRIMARY KEY,
                               building_id UUID NOT NULL,
                               unit_number VARCHAR(30) NOT NULL,
                               floor_number INTEGER NOT NULL,
                               unit_type VARCHAR(30) NOT NULL,
                               status VARCHAR(30) NOT NULL,
                               created_at TIMESTAMPTZ NOT NULL,
                               updated_at TIMESTAMPTZ NOT NULL,

                               CONSTRAINT fk_society_units_building
                                   FOREIGN KEY (building_id)
                                       REFERENCES society_buildings(id),

                               CONSTRAINT uq_society_unit_number
                                   UNIQUE (building_id, unit_number),

                               CONSTRAINT chk_society_unit_floor_number
                                   CHECK (floor_number >= 0)
);

CREATE INDEX idx_society_units_building
    ON society_units(building_id);