package com.hrms.repository;

import com.hrms.entity.Employee;
import com.hrms.entity.PFDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PFDetailsRepository extends JpaRepository<PFDetails, Long> {
    Optional<PFDetails> findByEmployee(Employee employee);
}
