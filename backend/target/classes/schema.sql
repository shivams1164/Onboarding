-- HRMS Database Schema

-- Create the database
CREATE DATABASE IF NOT EXISTS hrms_db;
USE hrms_db;

-- Employees table
CREATE TABLE IF NOT EXISTS employees (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    employee_id VARCHAR(50) NOT NULL UNIQUE,
    designation VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    date_of_joining VARCHAR(20) NOT NULL,
    status VARCHAR(50) NOT NULL,
    profile_photo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Personal Details table
CREATE TABLE IF NOT EXISTS personal_details (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    employee_id BIGINT NOT NULL UNIQUE,
    date_of_birth VARCHAR(20),
    gender VARCHAR(20),
    blood_group VARCHAR(5),
    marital_status VARCHAR(50),
    nationality VARCHAR(100),
    aadhar_number VARCHAR(20),
    pan_number VARCHAR(20),
    passport_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Addresses table
CREATE TABLE IF NOT EXISTS addresses (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    employee_id BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL,
    street VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    zip_code VARCHAR(10),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Education table
CREATE TABLE IF NOT EXISTS education (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    employee_id BIGINT NOT NULL,
    degree VARCHAR(100),
    field_of_study VARCHAR(100),
    school VARCHAR(255),
    start_date VARCHAR(20),
    end_date VARCHAR(20),
    description TEXT,
    certificate_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Employment table
CREATE TABLE IF NOT EXISTS employment (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    employee_id BIGINT NOT NULL,
    job_title VARCHAR(100),
    department VARCHAR(100),
    start_date VARCHAR(20),
    end_date VARCHAR(20),
    is_current_job BOOLEAN DEFAULT FALSE,
    reporting_manager VARCHAR(255),
    salary DECIMAL(10, 2),
    employment_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Family Members table
CREATE TABLE IF NOT EXISTS family_members (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    employee_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    relationship VARCHAR(50),
    date_of_birth VARCHAR(20),
    mobile_number VARCHAR(20),
    dependent_status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Bank Details table
CREATE TABLE IF NOT EXISTS bank_details (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    employee_id BIGINT NOT NULL UNIQUE,
    account_holder_name VARCHAR(255),
    account_number VARCHAR(30),
    ifsc_code VARCHAR(20),
    bank_name VARCHAR(100),
    branch_name VARCHAR(100),
    account_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- PF Details table
CREATE TABLE IF NOT EXISTS pf_details (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    employee_id BIGINT NOT NULL UNIQUE,
    uan VARCHAR(20),
    pf_number VARCHAR(50),
    pf_joining_date VARCHAR(20),
    employee_contribution DECIMAL(10, 2),
    employer_contribution DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    employee_id BIGINT NOT NULL,
    type VARCHAR(50),
    file_name VARCHAR(255),
    file_url VARCHAR(500),
    expiry_date VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Assets table
CREATE TABLE IF NOT EXISTS assets (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    employee_id BIGINT NOT NULL,
    type VARCHAR(50),
    serial_number VARCHAR(100),
    allocation_date VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Indexes for better query performance
CREATE INDEX idx_employee_department ON employees(department);
CREATE INDEX idx_employee_status ON employees(status);
CREATE INDEX idx_employee_email ON employees(email);
CREATE INDEX idx_address_employee ON addresses(employee_id);
CREATE INDEX idx_education_employee ON education(employee_id);
CREATE INDEX idx_employment_employee ON employment(employee_id);
CREATE INDEX idx_family_employee ON family_members(employee_id);
CREATE INDEX idx_document_employee ON documents(employee_id);
CREATE INDEX idx_asset_employee ON assets(employee_id);
