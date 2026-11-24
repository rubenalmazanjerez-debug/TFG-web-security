package com.tfg.ruben.AppGestion.Service;

import com.tfg.ruben.AppGestion.Entity.Activity;

import java.util.List;

public interface ActivityServer {

    List<Activity> findAllActivities();

    Activity saveActivity(Activity activity);

    Activity findActivityById(Long id);

    Activity updateActivity(Activity activity);

    void deleteActivity(Long id);
}
