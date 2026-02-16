package com.crm.crm_backend.service.impl;

import com.crm.crm_backend.entity.Admin;
import com.crm.crm_backend.repository.AdminRepository;
import com.crm.crm_backend.service.AdminService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminServiceImpl implements AdminService {

    private final AdminRepository repository;

    public AdminServiceImpl(AdminRepository repository) {
        this.repository = repository;
    }

    public Admin save(Admin admin) {
        return repository.save(admin);
    }

    public List<Admin> getAll() {
        return repository.findAll();
    }
}
