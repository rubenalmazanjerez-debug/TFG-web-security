package com.tfg.ruben.AppGestion.Controller;

import com.tfg.ruben.AppGestion.Entity.Activity;
import com.tfg.ruben.AppGestion.Service.ActivityServer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/activity")
@CrossOrigin(origins = "http://localhost:4200")
public class ActivityController {

    @Autowired
    private ActivityServer activityServer;

    @GetMapping("")
    public List<Activity> findAll() {
        return this.activityServer.findAllActivities();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Activity> findById(@PathVariable Long id) {
        Activity activity = this.activityServer.findActivityById(id);
        if (activity == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Activity with id: " + id);
        }
        return ResponseEntity.ok(activity);
    }

    @PostMapping("")
    public ResponseEntity<Activity> create(@RequestBody Activity activity) {
        if (activity.getName() == null || activity.getName().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Activity name is required");
        }
        return ResponseEntity.ok(this.activityServer.saveActivity(activity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Activity> update(@PathVariable Long id, @RequestBody Activity activityInfo) {
        Activity activity = this.activityServer.findActivityById(id);
        if (activity == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Activity with id: " + id);
        }
        activity.setName(activityInfo.getName());
        activity.setDescription(activityInfo.getDescription());
        return ResponseEntity.ok(this.activityServer.saveActivity(activity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> delete(@PathVariable Long id) {
        if (this.activityServer.findActivityById(id) == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Activity with id: " + id);
        }
        this.activityServer.deleteActivity(id);
        Map<String, Boolean> response = new HashMap<>();
        response.put("delete", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }
}
