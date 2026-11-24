package com.tfg.ruben.AppGestion.Service;

import com.tfg.ruben.AppGestion.Entity.Activity;
import com.tfg.ruben.AppGestion.Repository.ActivityRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActivityServerImpl implements ActivityServer{

    private final ActivityRepository activityRepository;

    public ActivityServerImpl(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    @Override
    public List<Activity> findAllActivities() {
        return this.activityRepository.findAll();
    }

    @Override
    public Activity saveActivity(Activity activity) {
        return this.activityRepository.save(activity);
    }

    @Override
    public Activity findActivityById(Long id) {
        if(this.activityRepository.findById(id).isPresent()){
            return this.activityRepository.findById(id).get();
        }
        return null;
    }

    @Override
    public Activity updateActivity(Activity activity) {
        return this.activityRepository.save(activity);
    }

    @Override
    public void deleteActivity(Long id) {
        this.activityRepository.deleteById(id);

    }
}
