package com.tfg.ruben.AppGestion.Entity;

import jakarta.persistence.*;

@Entity
@Table(name="activity")
public class Activity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="name", length = 30, nullable = false)
    private String name;

    @Column(name="description", length = 500)
    private String description;

    public Activity() {
    }

    public Activity(Long id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    public Activity(String description, String name) {
        this.description = description;
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
