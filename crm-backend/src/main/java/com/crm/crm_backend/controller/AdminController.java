package com.crm.crm_backend.controller;

import com.crm.crm_backend.entity.Admin;
import com.crm.crm_backend.repository.AdminRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admins")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final AdminRepository repository;

    public AdminController(AdminRepository repository) {
        this.repository = repository;
    }

    @PostMapping("/login")
    public Admin login(@RequestBody Admin admin) {
        Admin found = repository.findByEmail(admin.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!admin.getPassword().equals(found.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        return found;
    }
}