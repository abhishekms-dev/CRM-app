package com.crm.crm_backend.repository;

import com.crm.crm_backend.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    List<Customer> findByAdminId(Long adminId);
}
