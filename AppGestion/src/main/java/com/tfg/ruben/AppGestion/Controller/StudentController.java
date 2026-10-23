package com.tfg.ruben.AppGestion.Controller;

import com.tfg.ruben.AppGestion.Entity.Student;
import com.tfg.ruben.AppGestion.Service.StudentServer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/student")
@CrossOrigin(origins = "http://localhost:4200")
public class StudentController {

    @Autowired
    private StudentServer studentServer;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("")
    public List<Student> findAllStudents(){
        return this.studentServer.findAllStudents();
    }

    @PostMapping("")
    public Student saveStudent(@RequestBody Student student){
        student.setPassword(this.passwordEncoder.encode(student.getPassword()));
        return this.studentServer.saveStudent(student);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        Student student = this.studentServer.findStudentById(id);
        if (student == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Student with id: " + id);
        }
        return ResponseEntity.ok(student);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Student> getStudentByEmail(@PathVariable String email){
        Student student = this.studentServer.findStudentByEmail(email);
        if(student == null){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Student with email: " + email);
        }
        return ResponseEntity.ok(student);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudentById(@PathVariable Long id,@RequestBody Student studentInfo) {
        Student student = this.studentServer.findStudentById(id);
        if (student == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No Student with id: " + id);
        }

        student.setName(studentInfo.getName());
        student.setAge(studentInfo.getAge());
        student.setEmail(studentInfo.getEmail());
        student.setSurname(studentInfo.getSurname());

        if(studentInfo.getPassword() != null && !studentInfo.getPassword().isEmpty()){
            student.setPassword(this.passwordEncoder.encode(studentInfo.getPassword()));
        }

        Student updatedStudent = this.studentServer.updateStudent(student);
        return ResponseEntity.ok(updatedStudent);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean >> deleteStudent(@PathVariable Long id){
        if(this.studentServer.findStudentById(id)==null){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "There is no Student with such id: "+ id);
        }
        try {
            this.studentServer.deleteStudent(id);
            Map<String, Boolean> response = new HashMap<>();
            response.put("delete", Boolean.TRUE);
            return ResponseEntity.ok(response);
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Cannot delete account. You are participating in or own Social Plans. Please leave or delete your plans first.");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials){
        String email = credentials.get("email");
        String password = credentials.get("password");

        Student student = this.studentServer.findStudentByEmail(email);

        if(student != null && this.passwordEncoder.matches(password, student.getPassword())){
            return ResponseEntity.ok(Map.of("message", "Succesfull login", "student", student));

        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect email or password");
    }
}
