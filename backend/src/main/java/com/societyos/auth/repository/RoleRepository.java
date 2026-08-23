package com.societyos.auth.repository;

import com.societyos.auth.entity.Role;
import com.societyos.auth.entity.RoleCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RoleRepository extends JpaRepository<Role, UUID> {

    Optional<Role> findByCode(RoleCode code);
}