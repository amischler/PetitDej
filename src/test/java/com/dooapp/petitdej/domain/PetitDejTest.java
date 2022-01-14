package com.dooapp.petitdej.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.dooapp.petitdej.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PetitDejTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PetitDej.class);
        PetitDej petitDej1 = new PetitDej();
        petitDej1.setId(1L);
        PetitDej petitDej2 = new PetitDej();
        petitDej2.setId(petitDej1.getId());
        assertThat(petitDej1).isEqualTo(petitDej2);
        petitDej2.setId(2L);
        assertThat(petitDej1).isNotEqualTo(petitDej2);
        petitDej1.setId(null);
        assertThat(petitDej1).isNotEqualTo(petitDej2);
    }
}
