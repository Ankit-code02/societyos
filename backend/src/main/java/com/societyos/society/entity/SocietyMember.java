package com.societyos.society.entity;

import com.societyos.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(
        name = "society_members",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uq_society_member",
                        columnNames = {"society_id", "user_id"}
                )
        },
        indexes = {
                @Index(
                        name = "idx_society_members_user",
                        columnList = "user_id"
                ),
                @Index(
                        name = "idx_society_members_society",
                        columnList = "society_id"
                ),
                @Index(
                        name = "idx_society_members_unit",
                        columnList = "unit_id"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
public class SocietyMember {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "society_id", nullable = false)
    private Society society;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unit_id")
    private Unit unit;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private SocietyMemberRole role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private SocietyPosition position;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private SocietyMemberStatus status;

    @Column(name = "joined_at")
    private OffsetDateTime joinedAt;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        OffsetDateTime now = OffsetDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = OffsetDateTime.now();
    }
}