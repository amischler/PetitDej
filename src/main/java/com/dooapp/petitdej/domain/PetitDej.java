package com.dooapp.petitdej.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A PetitDej.
 */
@Entity
@Table(name = "petit_dej")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class PetitDej implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "commentaire")
    private String commentaire;

    @ManyToOne
    @JsonIgnoreProperties(value = { "petitDejs" }, allowSetters = true)
    private Lieu lieu;

    @ManyToOne
    private User organisateur;

    @ManyToMany
    @JoinTable(
        name = "rel_petit_dej__participants",
        joinColumns = @JoinColumn(name = "petit_dej_id"),
        inverseJoinColumns = @JoinColumn(name = "participants_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<User> participants = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public PetitDej id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public PetitDej date(LocalDate date) {
        this.setDate(date);
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getCommentaire() {
        return this.commentaire;
    }

    public PetitDej commentaire(String commentaire) {
        this.setCommentaire(commentaire);
        return this;
    }

    public void setCommentaire(String commentaire) {
        this.commentaire = commentaire;
    }

    public Lieu getLieu() {
        return this.lieu;
    }

    public void setLieu(Lieu lieu) {
        this.lieu = lieu;
    }

    public PetitDej lieu(Lieu lieu) {
        this.setLieu(lieu);
        return this;
    }

    public User getOrganisateur() {
        return this.organisateur;
    }

    public void setOrganisateur(User user) {
        this.organisateur = user;
    }

    public PetitDej organisateur(User user) {
        this.setOrganisateur(user);
        return this;
    }

    public Set<User> getParticipants() {
        return this.participants;
    }

    public void setParticipants(Set<User> users) {
        this.participants = users;
    }

    public PetitDej participants(Set<User> users) {
        this.setParticipants(users);
        return this;
    }

    public PetitDej addParticipants(User user) {
        this.participants.add(user);
        return this;
    }

    public PetitDej removeParticipants(User user) {
        this.participants.remove(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PetitDej)) {
            return false;
        }
        return id != null && id.equals(((PetitDej) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PetitDej{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", commentaire='" + getCommentaire() + "'" +
            "}";
    }
}
