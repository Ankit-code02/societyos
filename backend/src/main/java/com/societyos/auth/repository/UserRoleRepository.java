package com.societyos.auth.repository;

import com.societyos.auth.entity.RoleCode;
import com.societyos.auth.entity.UserRole;
import com.societyos.auth.entity.UserRoleId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserRoleRepository
        extends JpaRepository<UserRole, UserRoleId> {

    boolean existsByUserIdAndRoleCode(
            UUID userId,
            RoleCode roleCode
    );
}