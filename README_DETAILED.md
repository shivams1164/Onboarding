# HRMS - Modern Employee Management System

A full-stack enterprise HRMS (Human Resource Management System) built with **Next.js**, **TypeScript**, **Spring Boot**, and **MySQL**. Features a premium, corporate dashboard UI with comprehensive employee management capabilities.

## 🏗️ Architecture & Technology Stack

### Frontend
- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS** (v4)
- **React Hook Form** + **Zod** (Validation)
- **Radix UI** (Component primitives)
- **Axios** (API client)
- **Lucide React** (Icons)

### Backend
- **Spring Boot 3.2**
- **Java 17**
- **JPA/Hibernate** (ORM)
- **MySQL 8.0**
- **ModelMapper** (DTO conversion)
- **Lombok** (Boilerplate reduction)

### Database
- **MySQL 8.0+** with proper relationships and indexes

---

## 📁 Project Structure

```
crud_1/
├── frontend/                    # Next.js Frontend Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── dashboard/      # Dashboard page
│   │   │   ├── employees/      # Employees list and detail pages
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── layout/         # Layout components (Sidebar, Navbar)
│   │   │   ├── ui/             # Reusable UI components
│   │   │   └── employee/       # Employee-specific components (Tabs, Tables)
│   │   ├── lib/
│   │   │   ├── api.ts          # Axios API client
│   │   │   ├── schemas.ts      # Zod validation schemas
│   │   │   └── utils.ts        # Utility functions
│   │   └── types/
│   │       └── employee.ts     # TypeScript types
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── postcss.config.mjs
│
└── backend/                     # Spring Boot Backend Application
    ├── src/main/java/com/hrms/
    │   ├── HrmsApplication.java # Main Spring Boot class
    │   ├── config/              # Configuration classes
    │   ├── entity/              # JPA entities
    │   ├── repository/          # Spring Data JPA repositories
    │   ├── service/             # Business logic layer
    │   ├── controller/          # REST API controllers
    │   ├── dto/                 # Data Transfer Objects
    │   └── exception/           # Exception handling
    ├── src/main/resources/
    │   ├── application.yml      # Spring Boot configuration
    │   └── schema.sql           # Database schema
    └── pom.xml                  # Maven configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** and **npm**
- **Java 17+**
- **Maven 3.8+**
- **MySQL 8.0+**
- **Git**

### 1. Clone the Repository
```bash
git clone <repository-url>
cd crud_1
```

### 2. Database Setup

#### Option A: Using MySQL CLI
```bash
mysql -u root -p
```

Then run:
```sql
CREATE DATABASE IF NOT EXISTS hrms_db;
USE hrms_db;
-- Then copy and paste the entire content of backend/src/main/resources/schema.sql
```

#### Option B: Using SQL file directly
```bash
mysql -u root -p hrms_db < backend/src/main/resources/schema.sql
```

**Database Configuration:**
- Database: `hrms_db`
- Host: `localhost`
- Port: `3306`
- Default credentials in `backend/src/main/resources/application.yml`

### 3. Backend Setup

```bash
cd backend

# Install dependencies
mvn clean install

# Start the Spring Boot application
mvn spring-boot:run
```

The backend will start on **http://localhost:8080/api**

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on **http://localhost:3000**

---

## 📊 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Core Endpoints

#### Employee Management
- `POST /employees` - Create new employee
- `GET /employees` - Get all employees
- `GET /employees/{id}` - Get employee by ID
- `PUT /employees/{id}` - Update employee
- `DELETE /employees/{id}` - Delete employee

#### Personal Details
- `GET /employees/{id}/personal-details` - Get personal details
- `PUT /employees/{id}/personal-details` - Update personal details

#### Addresses
- `GET /employees/{id}/addresses` - Get all addresses
- `POST /employees/{id}/addresses` - Add address
- `DELETE /employees/{id}/addresses/{addressId}` - Delete address

#### Education
- `GET /employees/{id}/education` - Get education records
- `POST /employees/{id}/education` - Add education
- `DELETE /employees/{id}/education/{educationId}` - Delete education

#### Employment
- `GET /employees/{id}/employment` - Get employment history
- `POST /employees/{id}/employment` - Add employment
- `DELETE /employees/{id}/employment/{employmentId}` - Delete employment

#### Family
- `GET /employees/{id}/family` - Get family members
- `POST /employees/{id}/family` - Add family member
- `DELETE /employees/{id}/family/{memberId}` - Delete family member

#### Bank & PF Details
- `GET /employees/{id}/bank-details` - Get bank details
- `PUT /employees/{id}/bank-details` - Update bank details
- `GET /employees/{id}/pf-details` - Get PF details
- `PUT /employees/{id}/pf-details` - Update PF details

#### Documents
- `GET /employees/{id}/documents` - Get documents
- `POST /employees/{id}/documents` - Upload document
- `DELETE /employees/{id}/documents/{documentId}` - Delete document

#### Assets
- `GET /employees/{id}/assets` - Get assets
- `POST /employees/{id}/assets` - Add asset
- `DELETE /employees/{id}/assets/{assetId}` - Delete asset

### Response Format
All API responses follow this format:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

---

## 🎨 Frontend Features

### Pages
1. **Dashboard** (`/dashboard`)
   - Overview stats
   - Recent activity
   - Quick actions

2. **Employees List** (`/employees`)
   - Searchable table
   - Filtering by department and status
   - Pagination
   - Quick actions (View, Edit, Delete)

3. **Employee Profile** (`/employees/[id]`)
   - Profile header with photo
   - 9 tabs with detailed information:
     - Overview
     - Personal Details
     - Address
     - Education
     - Employment
     - Family
     - Bank & PF
     - Documents
     - Assets

4. **Add/Edit Employee** (`/employees/new`)
   - 4-step stepper form
   - Form validation with Zod
   - Save as draft
   - Inline error messages

### UI Components
- **Card** - Elevated, default, and flat variants
- **Button** - Primary, secondary, destructive, outline, ghost
- **Tabs** - Radix-based tab system
- **Modal/Dialog** - For confirmations
- **Form Elements** - Input, Textarea, Select, Label
- **Badge** - Status indicators
- **Table** - Employee listing with actions

### Utilities
- **Masking Functions** - Phone, Aadhar, PAN, Bank account
- **Formatting** - Dates, currency
- **Calculations** - Age from DOB
- **Status Indicators** - Color-coded status badges

---

## 🔧 Backend Features

### Entity Relationships
```
Employee (1) --> (1) PersonalDetails
Employee (1) --> (*) Addresses
Employee (1) --> (*) Education
Employee (1) --> (*) Employment
Employee (1) --> (*) FamilyMembers
Employee (1) --> (1) BankDetails
Employee (1) --> (1) PFDetails
Employee (1) --> (*) Documents
Employee (1) --> (*) Assets
```

### Service Architecture
- **EmployeeService** - Centralized business logic
- **Controllers** - REST endpoints with CrossOrigin support
- **Repositories** - Spring Data JPA for database operations
- **DTOs** - Type-safe data transfer
- **Exception Handler** - Global error handling

### Key Features
- CORS enabled for frontend communication
- Cascading deletes for data integrity
- Timestamp tracking (createdAt, updatedAt)
- Automatic enum handling
- ModelMapper for DTO conversion
- Lombok for reduced boilerplate

---

## 🔒 Security & Validation

### Frontend
- **Zod Schemas** - Runtime validation
- **React Hook Form** - Form state management
- **Data Masking** - Sensitive data display
- **Type Safety** - Full TypeScript support

### Backend
- **Spring Validation** - Entity-level constraints
- **Exception Handling** - Global error responses
- **CORS Configuration** - Restricted origins
- **Cascading Operations** - Safe delete operations

---

## 📝 Configuration

### Frontend Environment Variables
Create `.env.local` in the `frontend/` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Backend Configuration
Edit `backend/src/main/resources/application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/hrms_db
    username: root
    password: root
```

---

## 🧪 Testing

### Frontend
```bash
cd frontend
npm run dev       # Start development server
npm run build     # Build for production
npm run lint      # Run ESLint
```

### Backend
```bash
cd backend
mvn clean test     # Run unit tests
mvn clean package  # Build JAR
```

---

## 📚 Database Schema

### Key Tables
- **employees** - Core employee data
- **personal_details** - Bio, government IDs, etc.
- **addresses** - Multiple address types
- **education** - Academic qualifications
- **employment** - Job history
- **family_members** - Dependent information
- **bank_details** - Bank account information
- **pf_details** - Provident fund details
- **documents** - File attachments
- **assets** - Allocated equipment

All tables include:
- Primary keys (Auto-increment)
- Foreign key constraints with CASCADE delete
- Timestamp fields (createdAt, updatedAt)
- Proper indexes for performance

---

## 🚢 Deployment

### Docker (Optional)
```dockerfile
# Backend
FROM openjdk:17-jdk
COPY target/hrms-1.0.0.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]

# Frontend
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
CMD ["npm", "start"]
```

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
# Deploy the `.next` folder
```

**Backend:**
```bash
cd backend
mvn clean package -DskipTests
# Deploy the JAR file
```

---

## 🐛 Troubleshooting

### Database Connection Issues
- Verify MySQL is running: `mysql -u root -p`
- Check connection credentials in `application.yml`
- Ensure `hrms_db` database exists

### CORS Errors
- Frontend should use `http://localhost:8080/api` (check `.env.local`)
- Backend has `@CrossOrigin(origins = "http://localhost:3000")`

### Port Already in Use
```bash
# Kill process on port 8080 (Backend)
lsof -i :8080 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill process on port 3000 (Frontend)
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Build Issues
```bash
# Clear Maven cache
mvn clean -DskipTests

# Clear npm cache
npm cache clean --force
```

---

## 📝 Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/employee-edit
   ```

2. **Make changes** (Frontend or Backend)

3. **Test locally**
   ```bash
   # Frontend
   npm run dev
   
   # Backend
   mvn spring-boot:run
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: add employee edit form"
   git push origin feature/employee-edit
   ```

---

## 📈 Future Enhancements

- [ ] Authentication & Authorization (JWT/OAuth)
- [ ] Email notifications
- [ ] File upload to cloud storage
- [ ] Advanced reporting & analytics
- [ ] Mobile app (React Native)
- [ ] Performance optimizations (caching, pagination)
- [ ] Dark mode support
- [ ] Multi-language support
- [ ] Audit logging
- [ ] Bulk import/export

---

## 👥 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🤝 Support

For issues, questions, or suggestions, please open an issue in the repository.

---

## 📞 Contact

- Project Maintainer: Your Name
- Email: your.email@example.com
- LinkedIn: [Your LinkedIn Profile]

---

**Built with ❤️ by a Full-Stack Team** 🚀
