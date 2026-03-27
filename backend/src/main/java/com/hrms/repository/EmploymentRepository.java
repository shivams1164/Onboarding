package com.hrms.repository;

import com.hrms.entity.Employee;
import com.hrms.entity.Employment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmploymentRepository extends JpaRepository<Employment, Long> {
    List<Employment> findByEmployee(Employee employee);
}
