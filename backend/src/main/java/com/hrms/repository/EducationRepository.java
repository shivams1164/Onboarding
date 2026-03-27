package com.hrms.repository;

import com.hrms.entity.Education;
import com.hrms.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EducationRepository extends JpaRepository<Education, Long> {
    List<Education> findByEmployee(Employee employee);
}
