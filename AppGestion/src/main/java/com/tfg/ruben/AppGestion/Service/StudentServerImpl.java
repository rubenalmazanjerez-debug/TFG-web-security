package com.tfg.ruben.AppGestion.Service;

import com.tfg.ruben.AppGestion.Entity.Student;
import com.tfg.ruben.AppGestion.Repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentServerImpl implements StudentServer {

    private final StudentRepository studentRepository;

    public StudentServerImpl(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    public List<Student> findAllStudents() {
        return this.studentRepository.findAll();
    }

    @Override
    public Student saveStudent(Student student) {
        return this.studentRepository.save(student);
    }

    @Override
    public Student findStudentById(Long id) {
        if(this.studentRepository.findById(id).isPresent()){
            return this.studentRepository.findById(id).get();
        }
        return null;
    }

    @Override
    public Student findStudentByEmail(String email) {
        return this.studentRepository.findByEmail(email);
    }

    @Override
    public Student updateStudent(Student student) {
        return this.studentRepository.save(student);
    }

    @Override
    public void deleteStudent(Long id) {
         this.studentRepository.deleteById(id);
    }
}
