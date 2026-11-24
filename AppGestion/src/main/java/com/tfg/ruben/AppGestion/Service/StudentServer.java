package com.tfg.ruben.AppGestion.Service;
import com.tfg.ruben.AppGestion.Entity.Student;
import java.util.List;

public interface StudentServer {

    List<Student> findAllStudents();

    Student saveStudent(Student student);

    Student findStudentById(Long id);

    Student findStudentByEmail(String Email);

    Student updateStudent(Student student);

    void deleteStudent(Long id);
}
