package com.dooapp.petitdej.repository;

import com.dooapp.petitdej.domain.PetitDej;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the PetitDej entity.
 */
@Repository
public interface PetitDejRepository extends JpaRepository<PetitDej, Long> {
    @Query("select petitDej from PetitDej petitDej where petitDej.organisateur.login = ?#{principal.username}")
    List<PetitDej> findByOrganisateurIsCurrentUser();

    @Query(
        value = "select distinct petitDej from PetitDej petitDej left join fetch petitDej.participants",
        countQuery = "select count(distinct petitDej) from PetitDej petitDej"
    )
    Page<PetitDej> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct petitDej from PetitDej petitDej left join fetch petitDej.participants")
    List<PetitDej> findAllWithEagerRelationships();

    @Query("select petitDej from PetitDej petitDej left join fetch petitDej.participants where petitDej.id =:id")
    Optional<PetitDej> findOneWithEagerRelationships(@Param("id") Long id);
}
