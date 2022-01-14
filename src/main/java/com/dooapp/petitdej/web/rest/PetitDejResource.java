package com.dooapp.petitdej.web.rest;

import com.dooapp.petitdej.domain.PetitDej;
import com.dooapp.petitdej.repository.PetitDejRepository;
import com.dooapp.petitdej.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.dooapp.petitdej.domain.PetitDej}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PetitDejResource {

    private final Logger log = LoggerFactory.getLogger(PetitDejResource.class);

    private static final String ENTITY_NAME = "petitDej";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PetitDejRepository petitDejRepository;

    public PetitDejResource(PetitDejRepository petitDejRepository) {
        this.petitDejRepository = petitDejRepository;
    }

    /**
     * {@code POST  /petit-dejs} : Create a new petitDej.
     *
     * @param petitDej the petitDej to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new petitDej, or with status {@code 400 (Bad Request)} if the petitDej has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/petit-dejs")
    public ResponseEntity<PetitDej> createPetitDej(@Valid @RequestBody PetitDej petitDej) throws URISyntaxException {
        log.debug("REST request to save PetitDej : {}", petitDej);
        if (petitDej.getId() != null) {
            throw new BadRequestAlertException("A new petitDej cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PetitDej result = petitDejRepository.save(petitDej);
        return ResponseEntity
            .created(new URI("/api/petit-dejs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /petit-dejs/:id} : Updates an existing petitDej.
     *
     * @param id the id of the petitDej to save.
     * @param petitDej the petitDej to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated petitDej,
     * or with status {@code 400 (Bad Request)} if the petitDej is not valid,
     * or with status {@code 500 (Internal Server Error)} if the petitDej couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/petit-dejs/{id}")
    public ResponseEntity<PetitDej> updatePetitDej(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody PetitDej petitDej
    ) throws URISyntaxException {
        log.debug("REST request to update PetitDej : {}, {}", id, petitDej);
        if (petitDej.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, petitDej.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!petitDejRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        PetitDej result = petitDejRepository.save(petitDej);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, petitDej.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /petit-dejs/:id} : Partial updates given fields of an existing petitDej, field will ignore if it is null
     *
     * @param id the id of the petitDej to save.
     * @param petitDej the petitDej to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated petitDej,
     * or with status {@code 400 (Bad Request)} if the petitDej is not valid,
     * or with status {@code 404 (Not Found)} if the petitDej is not found,
     * or with status {@code 500 (Internal Server Error)} if the petitDej couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/petit-dejs/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<PetitDej> partialUpdatePetitDej(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody PetitDej petitDej
    ) throws URISyntaxException {
        log.debug("REST request to partial update PetitDej partially : {}, {}", id, petitDej);
        if (petitDej.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, petitDej.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!petitDejRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<PetitDej> result = petitDejRepository
            .findById(petitDej.getId())
            .map(existingPetitDej -> {
                if (petitDej.getDate() != null) {
                    existingPetitDej.setDate(petitDej.getDate());
                }
                if (petitDej.getCommentaire() != null) {
                    existingPetitDej.setCommentaire(petitDej.getCommentaire());
                }

                return existingPetitDej;
            })
            .map(petitDejRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, petitDej.getId().toString())
        );
    }

    /**
     * {@code GET  /petit-dejs} : get all the petitDejs.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of petitDejs in body.
     */
    @GetMapping("/petit-dejs")
    public List<PetitDej> getAllPetitDejs(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all PetitDejs");
        return petitDejRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /petit-dejs/:id} : get the "id" petitDej.
     *
     * @param id the id of the petitDej to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the petitDej, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/petit-dejs/{id}")
    public ResponseEntity<PetitDej> getPetitDej(@PathVariable Long id) {
        log.debug("REST request to get PetitDej : {}", id);
        Optional<PetitDej> petitDej = petitDejRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(petitDej);
    }

    /**
     * {@code DELETE  /petit-dejs/:id} : delete the "id" petitDej.
     *
     * @param id the id of the petitDej to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/petit-dejs/{id}")
    public ResponseEntity<Void> deletePetitDej(@PathVariable Long id) {
        log.debug("REST request to delete PetitDej : {}", id);
        petitDejRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
