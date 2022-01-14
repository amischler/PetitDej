package com.dooapp.petitdej.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Lieu.
 */
@Entity
@Table(name = "lieu")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Lieu implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "capacity")
    private Integer capacity;

    @OneToMany(mappedBy = "lieu")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "lieu", "organisateur", "participants" }, allowSetters = true)
    private Set<PetitDej> petitDejs = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Lieu id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Lieu name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getCapacity() {
        return this.capacity;
    }

    public Lieu capacity(Integer capacity) {
        this.setCapacity(capacity);
        return this;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public Set<PetitDej> getPetitDejs() {
        return this.petitDejs;
    }

    public void setPetitDejs(Set<PetitDej> petitDejs) {
        if (this.petitDejs != null) {
            this.petitDejs.forEach(i -> i.setLieu(null));
        }
        if (petitDejs != null) {
            petitDejs.forEach(i -> i.setLieu(this));
        }
        this.petitDejs = petitDejs;
    }

    public Lieu petitDejs(Set<PetitDej> petitDejs) {
        this.setPetitDejs(petitDejs);
        return this;
    }

    public Lieu addPetitDej(PetitDej petitDej) {
        this.petitDejs.add(petitDej);
        petitDej.setLieu(this);
        return this;
    }

    public Lieu removePetitDej(PetitDej petitDej) {
        this.petitDejs.remove(petitDej);
        petitDej.setLieu(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Lieu)) {
            return false;
        }
        return id != null && id.equals(((Lieu) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Lieu{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", capacity=" + getCapacity() +
            "}";
    }
}
