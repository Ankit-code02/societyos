package com.societyos.society.repository;

import com.societyos.society.entity.Society;
import com.societyos.society.entity.SocietyStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SocietyRepository extends JpaRepository<Society, UUID> {

    List<Society> findByStatus(SocietyStatus status);
}