package com.dooapp.petitdej.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.dooapp.petitdej.IntegrationTest;
import com.dooapp.petitdej.domain.PetitDej;
import com.dooapp.petitdej.repository.PetitDejRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link PetitDejResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class PetitDejResourceIT {

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_COMMENTAIRE = "AAAAAAAAAA";
    private static final String UPDATED_COMMENTAIRE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/petit-dejs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PetitDejRepository petitDejRepository;

    @Mock
    private PetitDejRepository petitDejRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPetitDejMockMvc;

    private PetitDej petitDej;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PetitDej createEntity(EntityManager em) {
        PetitDej petitDej = new PetitDej().date(DEFAULT_DATE).commentaire(DEFAULT_COMMENTAIRE);
        return petitDej;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PetitDej createUpdatedEntity(EntityManager em) {
        PetitDej petitDej = new PetitDej().date(UPDATED_DATE).commentaire(UPDATED_COMMENTAIRE);
        return petitDej;
    }

    @BeforeEach
    public void initTest() {
        petitDej = createEntity(em);
    }

    @Test
    @Transactional
    void createPetitDej() throws Exception {
        int databaseSizeBeforeCreate = petitDejRepository.findAll().size();
        // Create the PetitDej
        restPetitDejMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(petitDej)))
            .andExpect(status().isCreated());

        // Validate the PetitDej in the database
        List<PetitDej> petitDejList = petitDejRepository.findAll();
        assertThat(petitDejList).hasSize(databaseSizeBeforeCreate + 1);
        PetitDej testPetitDej = petitDejList.get(petitDejList.size() - 1);
        assertThat(testPetitDej.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testPetitDej.getCommentaire()).isEqualTo(DEFAULT_COMMENTAIRE);
    }

    @Test
    @Transactional
    void createPetitDejWithExistingId() throws Exception {
        // Create the PetitDej with an existing ID
        petitDej.setId(1L);

        int databaseSizeBeforeCreate = petitDejRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPetitDejMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(petitDej)))
            .andExpect(status().isBadRequest());

        // Validate the PetitDej in the database
        List<PetitDej> petitDejList = petitDejRepository.findAll();
        assertThat(petitDejList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = petitDejRepository.findAll().size();
        // set the field null
        petitDej.setDate(null);

        // Create the PetitDej, which fails.

        restPetitDejMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(petitDej)))
            .andExpect(status().isBadRequest());

        List<PetitDej> petitDejList = petitDejRepository.findAll();
        assertThat(petitDejList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllPetitDejs() throws Exception {
        // Initialize the database
        petitDejRepository.saveAndFlush(petitDej);

        // Get all the petitDejList
        restPetitDejMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(petitDej.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].commentaire").value(hasItem(DEFAULT_COMMENTAIRE)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllPetitDejsWithEagerRelationshipsIsEnabled() throws Exception {
        when(petitDejRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restPetitDejMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(petitDejRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllPetitDejsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(petitDejRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restPetitDejMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(petitDejRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getPetitDej() throws Exception {
        // Initialize the database
        petitDejRepository.saveAndFlush(petitDej);

        // Get the petitDej
        restPetitDejMockMvc
            .perform(get(ENTITY_API_URL_ID, petitDej.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(petitDej.getId().intValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.commentaire").value(DEFAULT_COMMENTAIRE));
    }

    @Test
    @Transactional
    void getNonExistingPetitDej() throws Exception {
        // Get the petitDej
        restPetitDejMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewPetitDej() throws Exception {
        // Initialize the database
        petitDejRepository.saveAndFlush(petitDej);

        int databaseSizeBeforeUpdate = petitDejRepository.findAll().size();

        // Update the petitDej
        PetitDej updatedPetitDej = petitDejRepository.findById(petitDej.getId()).get();
        // Disconnect from session so that the updates on updatedPetitDej are not directly saved in db
        em.detach(updatedPetitDej);
        updatedPetitDej.date(UPDATED_DATE).commentaire(UPDATED_COMMENTAIRE);

        restPetitDejMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPetitDej.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPetitDej))
            )
            .andExpect(status().isOk());

        // Validate the PetitDej in the database
        List<PetitDej> petitDejList = petitDejRepository.findAll();
        assertThat(petitDejList).hasSize(databaseSizeBeforeUpdate);
        PetitDej testPetitDej = petitDejList.get(petitDejList.size() - 1);
        assertThat(testPetitDej.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testPetitDej.getCommentaire()).isEqualTo(UPDATED_COMMENTAIRE);
    }

    @Test
    @Transactional
    void putNonExistingPetitDej() throws Exception {
        int databaseSizeBeforeUpdate = petitDejRepository.findAll().size();
        petitDej.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPetitDejMockMvc
            .perform(
                put(ENTITY_API_URL_ID, petitDej.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(petitDej))
            )
            .andExpect(status().isBadRequest());

        // Validate the PetitDej in the database
        List<PetitDej> petitDejList = petitDejRepository.findAll();
        assertThat(petitDejList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPetitDej() throws Exception {
        int databaseSizeBeforeUpdate = petitDejRepository.findAll().size();
        petitDej.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPetitDejMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(petitDej))
            )
            .andExpect(status().isBadRequest());

        // Validate the PetitDej in the database
        List<PetitDej> petitDejList = petitDejRepository.findAll();
        assertThat(petitDejList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPetitDej() throws Exception {
        int databaseSizeBeforeUpdate = petitDejRepository.findAll().size();
        petitDej.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPetitDejMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(petitDej)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the PetitDej in the database
        List<PetitDej> petitDejList = petitDejRepository.findAll();
        assertThat(petitDejList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePetitDejWithPatch() throws Exception {
        // Initialize the database
        petitDejRepository.saveAndFlush(petitDej);

        int databaseSizeBeforeUpdate = petitDejRepository.findAll().size();

        // Update the petitDej using partial update
        PetitDej partialUpdatedPetitDej = new PetitDej();
        partialUpdatedPetitDej.setId(petitDej.getId());

        partialUpdatedPetitDej.commentaire(UPDATED_COMMENTAIRE);

        restPetitDejMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPetitDej.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPetitDej))
            )
            .andExpect(status().isOk());

        // Validate the PetitDej in the database
        List<PetitDej> petitDejList = petitDejRepository.findAll();
        assertThat(petitDejList).hasSize(databaseSizeBeforeUpdate);
        PetitDej testPetitDej = petitDejList.get(petitDejList.size() - 1);
        assertThat(testPetitDej.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testPetitDej.getCommentaire()).isEqualTo(UPDATED_COMMENTAIRE);
    }

    @Test
    @Transactional
    void fullUpdatePetitDejWithPatch() throws Exception {
        // Initialize the database
        petitDejRepository.saveAndFlush(petitDej);

        int databaseSizeBeforeUpdate = petitDejRepository.findAll().size();

        // Update the petitDej using partial update
        PetitDej partialUpdatedPetitDej = new PetitDej();
        partialUpdatedPetitDej.setId(petitDej.getId());

        partialUpdatedPetitDej.date(UPDATED_DATE).commentaire(UPDATED_COMMENTAIRE);

        restPetitDejMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPetitDej.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPetitDej))
            )
            .andExpect(status().isOk());

        // Validate the PetitDej in the database
        List<PetitDej> petitDejList = petitDejRepository.findAll();
        assertThat(petitDejList).hasSize(databaseSizeBeforeUpdate);
        PetitDej testPetitDej = petitDejList.get(petitDejList.size() - 1);
        assertThat(testPetitDej.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testPetitDej.getCommentaire()).isEqualTo(UPDATED_COMMENTAIRE);
    }

    @Test
    @Transactional
    void patchNonExistingPetitDej() throws Exception {
        int databaseSizeBeforeUpdate = petitDejRepository.findAll().size();
        petitDej.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPetitDejMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, petitDej.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(petitDej))
            )
            .andExpect(status().isBadRequest());

        // Validate the PetitDej in the database
        List<PetitDej> petitDejList = petitDejRepository.findAll();
        assertThat(petitDejList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPetitDej() throws Exception {
        int databaseSizeBeforeUpdate = petitDejRepository.findAll().size();
        petitDej.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPetitDejMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(petitDej))
            )
            .andExpect(status().isBadRequest());

        // Validate the PetitDej in the database
        List<PetitDej> petitDejList = petitDejRepository.findAll();
        assertThat(petitDejList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPetitDej() throws Exception {
        int databaseSizeBeforeUpdate = petitDejRepository.findAll().size();
        petitDej.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPetitDejMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(petitDej)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the PetitDej in the database
        List<PetitDej> petitDejList = petitDejRepository.findAll();
        assertThat(petitDejList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePetitDej() throws Exception {
        // Initialize the database
        petitDejRepository.saveAndFlush(petitDej);

        int databaseSizeBeforeDelete = petitDejRepository.findAll().size();

        // Delete the petitDej
        restPetitDejMockMvc
            .perform(delete(ENTITY_API_URL_ID, petitDej.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<PetitDej> petitDejList = petitDejRepository.findAll();
        assertThat(petitDejList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
