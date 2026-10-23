package com.tfg.ruben.AppGestion;

import com.tfg.ruben.AppGestion.Repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AppGestionApplication implements CommandLineRunner {

	public static void main(String[] args) {
		SpringApplication.run(AppGestionApplication.class, args);
	}

	@Autowired
	private StudentRepository studentRepository;

	@Override
	public void run (String... args) throws Exception {
	}

}
