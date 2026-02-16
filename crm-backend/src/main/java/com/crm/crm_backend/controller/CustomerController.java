package com.crm.crm_backend.controller;

import com.crm.crm_backend.entity.Customer;
import com.crm.crm_backend.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerController {

    private final CustomerService service;

    public CustomerController(CustomerService service) {
        this.service = service;
    }

    @GetMapping("/admin/{adminId}")
    public List<Customer> getByAdmin(@PathVariable Long adminId) {
        return service.getByAdmin(adminId);
    }

    @PostMapping("/admin/{adminId}")
    public Customer create(@PathVariable Long adminId, @Valid @RequestBody Customer customer) {
        return service.save(customer, adminId);
    }

    @PutMapping("/{id}")
    public Customer update(@PathVariable Long id, @Valid @RequestBody Customer customer) {
        return service.update(id, customer);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}