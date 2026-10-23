package com.tfg.ruben.AppGestion.Controller;

import com.tfg.ruben.AppGestion.Entity.Activity;
import com.tfg.ruben.AppGestion.Entity.SocialPlan;
import com.tfg.ruben.AppGestion.Entity.Student;
import com.tfg.ruben.AppGestion.Service.ActivityServer;
import com.tfg.ruben.AppGestion.Service.SocialPlanServer;
import com.tfg.ruben.AppGestion.Service.StudentServer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/social-plan")
@CrossOrigin(origins = "http://localhost:4200")
public class SocialPlanController {

    @Autowired
    private SocialPlanServer socialPlanServer;

    @Autowired
    private StudentServer studentServer;

    @Autowired
    private ActivityServer activityServer;

    @GetMapping
    public List<SocialPlan> findAll() {
        return socialPlanServer.findAllSocialPlan();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SocialPlan> findById(@PathVariable Long id) {
        SocialPlan plan = this.socialPlanServer.findSocialPlanById(id);
        if (plan == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Plan with id: " + id);
        }
        return ResponseEntity.ok(plan);
    }

    @PostMapping
    public ResponseEntity<SocialPlan> create(@RequestBody SocialPlan socialPlan) {
        if (socialPlan.getOwner() == null || socialPlan.getOwner().getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Owner is required");
        }
        Student ownerFromDB = this.studentServer.findStudentById(socialPlan.getOwner().getId());

        if(ownerFromDB == null){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Owner not found");
        }

        socialPlan.setOwner(ownerFromDB);
        return ResponseEntity.ok(this.socialPlanServer.saveSocialPlan(socialPlan));
    }

    @PutMapping("/{planId}/add-participant/{studentId}")
    public ResponseEntity<SocialPlan> addParticipant(@PathVariable Long planId, @PathVariable Long studentId) {
        SocialPlan plan = this.socialPlanServer.findSocialPlanById(planId);
        Student student = this.studentServer.findStudentById(studentId);

        if (plan == null || student == null){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Plan and student are required");
        }

        if (plan.getUserList().stream().noneMatch(s -> s.getId().equals(studentId))) {
            plan.getUserList().add(student);
            this.socialPlanServer.saveSocialPlan(plan);
        }
        return ResponseEntity.ok(plan);
    }

    @PutMapping("/{planId}/remove-participant/{studentId}")
    public ResponseEntity<SocialPlan> removeParticipant(@PathVariable Long planId, @PathVariable Long studentId) {
        SocialPlan plan = this.socialPlanServer.findSocialPlanById(planId);
        Student student = this.studentServer.findStudentById(studentId);

        if (plan == null || student == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Plan or student not found");
        }

        if (plan.getOwner().getId().equals(studentId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The owner cannot leave their own plan");
        }

        plan.getUserList().removeIf(s -> s.getId().equals(studentId));
        this.socialPlanServer.saveSocialPlan(plan);
        return ResponseEntity.ok(plan);
    }

    @PutMapping("/{planId}/add-activity/{activityId}")
    public ResponseEntity<SocialPlan> addActivity(@PathVariable Long planId, @PathVariable Long activityId) {
        SocialPlan plan = this.socialPlanServer.findSocialPlanById(planId);
        Activity activity = this.activityServer.findActivityById(activityId);

        if (plan == null || activity == null){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Plan and activity are required");
        }

        if (plan.getActivityList().stream().noneMatch(a -> a.getId().equals(activityId))) {
            plan.getActivityList().add(activity);
            this.socialPlanServer.saveSocialPlan(plan);
        }
        return ResponseEntity.ok(plan);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> delete(@PathVariable Long id, @RequestParam Long requesterId) {

        SocialPlan plan = this.socialPlanServer.findSocialPlanById(id);
        if (plan == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "There is no Plan with such id");
        }

        if (!plan.getOwner().getId().equals(requesterId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the owner can delete this plan");
        }

        this.socialPlanServer.deleteSocialPlan(id);
        Map<String, Boolean> response = new HashMap<>();
        response.put("delete", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }
}
