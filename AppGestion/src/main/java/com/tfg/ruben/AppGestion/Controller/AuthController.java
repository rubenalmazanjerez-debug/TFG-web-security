package com.tfg.ruben.AppGestion.Controller;

import com.tfg.ruben.AppGestion.Entity.Student;
import com.tfg.ruben.AppGestion.Service.StudentServer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private StudentServer studentServer;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Student student = this.studentServer.findStudentByEmail(email);

        if (student != null && this.passwordEncoder.matches(password, student.getPassword())) {
            return ResponseEntity.ok(Map.of("message", "Succesfull login", "student", student));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect email or password");
    }
}