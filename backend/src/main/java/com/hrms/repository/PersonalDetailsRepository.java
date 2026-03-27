package com.hrms.repository;

import com.hrms.entity.Employee;
import com.hrms.entity.PersonalDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PersonalDetailsRepository extends JpaRepository<PersonalDetails, Long> {
    Optional<PersonalDetails> findByEmployee(Employee employee);
}
