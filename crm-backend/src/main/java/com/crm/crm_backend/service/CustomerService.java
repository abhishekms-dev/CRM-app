package com.crm.crm_backend.service;

import com.crm.crm_backend.entity.Customer;
import java.util.List;

public interface CustomerService {

    List<Customer> getAll();
    Customer save(Customer customer);
    void delete(Long id);
}
