package com.tfg.ruben.AppGestion.Entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name="SocialPlan")
public class SocialPlan
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="name", length = 50, nullable = false)
    private String name;

    @Column(name="description", length = 500)
    private String description;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "owner_id", nullable = false)
    private Student owner;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "social_plan_activities",
            joinColumns = @JoinColumn(name = "social_plan_id"),
            inverseJoinColumns = @JoinColumn(name = "activity_id")
    )
    private List<Activity> activityList;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "social_plan_participants",
            joinColumns = @JoinColumn(name = "social_plan_id"),
            inverseJoinColumns = @JoinColumn(name = "student_id")
    )
    private List<Student> usertList;

    public SocialPlan(){
    }

    public SocialPlan(Long id, String name, String description, Student owner, List<Activity> activityList) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.owner = owner;
        this.activityList = activityList;
    }

    public SocialPlan(String name, String description, Student owner, List<Activity> activityList) {
        this.name = name;
        this.description = description;
        this.owner = owner;
        this.activityList = activityList;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Student getOwner() {
        return owner;
    }

    public void setOwner(Student owner) {
        this.owner = owner;
    }

    public List<Activity> getActivityList() {
        return activityList;
    }

    public void setActivityList(List<Activity> activityList) {
        this.activityList = activityList;
    }

    public List<Student> getUserList() {
        return usertList;
    }

    public void setUserList(List<Student> usertList) {
        this.usertList = usertList;
    }
}
