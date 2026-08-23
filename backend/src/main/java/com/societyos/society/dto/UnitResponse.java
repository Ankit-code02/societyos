package com.societyos.society.dto;

import com.societyos.society.entity.Unit;
import lombok.Getter;

import java.util.UUID;

@Getter
public class UnitResponse {

    private final UUID id;
    private final UUID buildingId;
    private final String unitNumber;
    private final int floorNumber;
    private final String unitType;
    private final String status;

    public UnitResponse(Unit unit) {
        this.id = unit.getId();
        this.buildingId = unit.getBuilding().getId();
        this.unitNumber = unit.getUnitNumber();
        this.floorNumber = unit.getFloorNumber();
        this.unitType = unit.getUnitType();
        this.status = unit.getStatus();
    }
}