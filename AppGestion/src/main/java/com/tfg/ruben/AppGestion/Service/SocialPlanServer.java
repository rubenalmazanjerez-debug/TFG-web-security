package com.tfg.ruben.AppGestion.Service;

import com.tfg.ruben.AppGestion.Entity.SocialPlan;

import java.util.List;

public interface SocialPlanServer {

    List<SocialPlan> findAllSocialPlan();

    SocialPlan saveSocialPlan(SocialPlan socialPlan);

    SocialPlan findSocialPlanById(Long id);

    SocialPlan updateSocialPlan(SocialPlan socialPlan);

    void deleteSocialPlan(Long id);

}
