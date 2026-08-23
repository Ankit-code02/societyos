CREATE TABLE maintenance_dues (
                                  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                                  society_id UUID NOT NULL,
                                  unit_id UUID NOT NULL,
                                  created_by UUID NOT NULL,

                                  title VARCHAR(200) NOT NULL,
                                  description TEXT,

                                  amount NUMERIC(12,2) NOT NULL,
                                  due_date DATE NOT NULL,

                                  status VARCHAR(20) NOT NULL DEFAULT 'PENDING',

                                  paid_at TIMESTAMPTZ,
                                  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                  CONSTRAINT fk_maintenance_dues_society
                                      FOREIGN KEY (society_id)
                                          REFERENCES societies(id),

                                  CONSTRAINT fk_maintenance_dues_unit
                                      FOREIGN KEY (unit_id)
                                          REFERENCES society_units(id),

                                  CONSTRAINT fk_maintenance_dues_created_by
                                      FOREIGN KEY (created_by)
                                          REFERENCES users(id),

                                  CONSTRAINT chk_maintenance_dues_amount
                                      CHECK (amount > 0)
);

CREATE INDEX idx_maintenance_dues_society
    ON maintenance_dues(society_id);

CREATE INDEX idx_maintenance_dues_unit
    ON maintenance_dues(unit_id);

CREATE INDEX idx_maintenance_dues_status
    ON maintenance_dues(status);

CREATE INDEX idx_maintenance_dues_due_date
    ON maintenance_dues(due_date);