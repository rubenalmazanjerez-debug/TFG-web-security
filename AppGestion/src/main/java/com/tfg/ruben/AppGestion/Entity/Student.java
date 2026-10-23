package com.tfg.ruben.AppGestion.Entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name="student")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name= "name",length = 50, nullable = false)
    private String name;

    @Column(name= "email",length = 100, nullable = false, unique = true)
    private String email;

    @Column(name="password", length = 250, nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @Column(name= "surname",length = 50, nullable = false)
    private String surname;

    @Column(name= "age", nullable = false)
    private int age;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role = Role.User;


    public Student() {
    }

    public Student(Long id, String name, String surname, String email, String password, int age) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.surname = surname;
        this.password = password;
        this.age = age;
    }

    public Student(String name, String surname, String email, String password, int age) {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.password = password;
        this.age = age;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() { return role; }

    public void setRole(Role role) { this.role = role; }
}
