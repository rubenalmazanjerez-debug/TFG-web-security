package com.tfg.ruben.AppGestion.Service;

import com.tfg.ruben.AppGestion.Entity.SocialPlan;
import com.tfg.ruben.AppGestion.Entity.Student;
import com.tfg.ruben.AppGestion.Repository.SocialPlanRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SocialPlanServerImpl implements SocialPlanServer{

    private final SocialPlanRepository socialPlanRepository;

    public SocialPlanServerImpl(SocialPlanRepository socialPlanRepository) {
        this.socialPlanRepository = socialPlanRepository;
    }

    @Override
    public List<SocialPlan> findAllSocialPlan(){
        return this.socialPlanRepository.findAll();
    }

    @Override
    public SocialPlan saveSocialPlan(SocialPlan socialPlan){
        Student owner = socialPlan.getOwner();
        if(owner != null){
            if(socialPlan.getUserList() == null){
                socialPlan.setUserList(new ArrayList<>());
            }
            if(socialPlan.getActivityList() == null){
                socialPlan.setActivityList(new ArrayList<>());
            }
            if (socialPlan.getUserList().stream().noneMatch(s -> s.getId().equals(owner.getId()))) {
                socialPlan.getUserList().add(owner);
            }
        }
        return this.socialPlanRepository.save(socialPlan);
    }

    @Override
    public SocialPlan findSocialPlanById(Long id){
        if(this.socialPlanRepository.findById(id).isPresent()){
            return this.socialPlanRepository.findById(id).get();
        }
        return null;
    }

    @Override
    public SocialPlan updateSocialPlan(SocialPlan socialPlan) {
        return this.socialPlanRepository.save(socialPlan);
    }

    @Override
    public void deleteSocialPlan(Long id) {
        this.socialPlanRepository.deleteById(id);
    }


}
