package com.crm.crm_backend.service;

import com.crm.crm_backend.entity.Customer;
import java.util.List;

public interface CustomerService {
    List<Customer> getByAdmin(Long adminId);
    Customer save(Customer customer, Long adminId);
    Customer update(Long id, Customer customer);
    void delete(Long id);
}
