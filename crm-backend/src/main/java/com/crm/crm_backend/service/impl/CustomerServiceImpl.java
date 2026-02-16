package com.crm.crm_backend.service.impl;

import com.crm.crm_backend.entity.Admin;
import com.crm.crm_backend.entity.Customer;
import com.crm.crm_backend.exception.ResourceNotFoundException;
import com.crm.crm_backend.repository.AdminRepository;
import com.crm.crm_backend.repository.CustomerRepository;
import com.crm.crm_backend.service.CustomerService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final AdminRepository adminRepository;

    public CustomerServiceImpl(CustomerRepository customerRepository, AdminRepository adminRepository) {
        this.customerRepository = customerRepository;
        this.adminRepository = adminRepository;
    }

    public List<Customer> getByAdmin(Long adminId) {
        return customerRepository.findByAdminId(adminId);
    }

    public Customer save(Customer customer, Long adminId) {
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));
        customer.setAdmin(admin);
        if (customer.getStatus() == null || customer.getStatus().isEmpty()) {
            customer.setStatus("ACTIVE");
        }
        return customerRepository.save(customer);
    }

    public Customer update(Long id, Customer customer) {
        Customer existing = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        if (customer.getName() != null) {
            existing.setName(customer.getName());
        }
        if (customer.getEmail() != null) {
            existing.setEmail(customer.getEmail());
        }
        if (customer.getPhone() != null) {
            existing.setPhone(customer.getPhone());
        }
        if (customer.getStatus() != null) {
            existing.setStatus(customer.getStatus());
        }

        return customerRepository.save(existing);
    }

    public void delete(Long id) {
        if (!customerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Customer not found");
        }
        customerRepository.deleteById(id);
    }
}