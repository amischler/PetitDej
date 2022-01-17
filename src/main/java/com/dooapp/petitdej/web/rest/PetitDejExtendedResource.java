package com.dooapp.petitdej.web.rest;

import com.dooapp.petitdej.domain.PetitDej;
import com.dooapp.petitdej.domain.User;
import com.dooapp.petitdej.repository.PetitDejRepository;
import com.dooapp.petitdej.service.UserService;
import com.dooapp.petitdej.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;

import java.net.URISyntaxException;

/**
 * Extended REST controller for managing {@link com.dooapp.petitdej.domain.PetitDej}.
 */
@RestController
@RequestMapping("/api/v1")
@Transactional
public class PetitDejExtendedResource extends PetitDejResource {

    private final Logger log = LoggerFactory.getLogger(PetitDejResource.class);

    private static final String ENTITY_NAME = "petitDej";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PetitDejRepository petitDejRepository;

    private final UserService userService;

    public PetitDejExtendedResource(PetitDejRepository petitDejRepository, UserService userService) {
        super(petitDejRepository);
        this.petitDejRepository = petitDejRepository;
        this.userService = userService;
    }

    /**
     * {@code PUT  /petit-dejs/participate/:id} : Switch participation in an existing petitDej.
     *
     * @param id the id of the petitDej to participate in.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated petitDej,
     * or with status {@code 400 (Bad Request)} if the petitDej is not valid,
     * or with status {@code 500 (Internal Server Error)} if the petitDej couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @GetMapping("/petit-dejs/participate/{id}")
    public ResponseEntity<PetitDej> switchParticipationInPetitDej(
        @PathVariable(value = "id", required = false) final Long id) {
        final User user = userService.getUserWithAuthorities().get();
        log.debug("REST request of {} to participate in PetitDej : {}", user.getLogin(), id);

        if (!petitDejRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        PetitDej petitDej = petitDejRepository.getById(id);
        if (!petitDej.getParticipants().contains(user)) {
            petitDej.getParticipants().add(user);
        } else {
            petitDej.getParticipants().remove(user);
        }
        PetitDej result = petitDejRepository.save(petitDej);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, petitDej.getId().toString()))
            .body(result);
    }

}
