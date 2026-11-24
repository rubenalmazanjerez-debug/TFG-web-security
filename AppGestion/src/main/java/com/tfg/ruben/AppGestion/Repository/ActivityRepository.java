package com.tfg.ruben.AppGestion.Repository;

import com.tfg.ruben.AppGestion.Entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
}
