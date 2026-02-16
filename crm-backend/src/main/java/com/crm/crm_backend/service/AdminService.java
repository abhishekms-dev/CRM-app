package com.crm.crm_backend.service;

import com.crm.crm_backend.entity.Admin;
import java.util.List;

public interface AdminService {
    Admin save(Admin admin);
    List<Admin> getAll();
}
