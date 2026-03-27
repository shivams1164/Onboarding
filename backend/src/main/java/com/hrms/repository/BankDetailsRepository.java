package com.hrms.repository;

import com.hrms.entity.BankDetails;
import com.hrms.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BankDetailsRepository extends JpaRepository<BankDetails, Long> {
    Optional<BankDetails> findByEmployee(Employee employee);
}
