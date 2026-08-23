package com.societyos.society.dto;

import com.societyos.society.entity.Building;
import lombok.Getter;

import java.util.UUID;

@Getter
public class BuildingResponse {

    private final UUID id;
    private final UUID societyId;
    private final String name;
    private final String code;
    private final int floorCount;
    private final int unitCount;

    public BuildingResponse(Building building) {
        this.id = building.getId();
        this.societyId = building.getSociety().getId();
        this.name = building.getName();
        this.code = building.getCode();
        this.floorCount = building.getFloorCount();
        this.unitCount = building.getUnitCount();
    }
}