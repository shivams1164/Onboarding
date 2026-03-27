# HRMS - Employee Management System 🎯

A premium, modern **Employee Management System (HRMS)** built with **Next.js**, **TypeScript**, **Spring Boot**, and **MySQL**. 

Perfect for enterprises that need a professional HR platform similar to **Zoho People**, **Keka**, or **Darwinbox**.

---

## ⚡ Quick Start (5 minutes)

### 1 Database Setup
```bash
# Open MySQL and run
mysql -u root -p < backend/src/main/resources/schema.sql
```

### 2. Start Backend (Terminal 1)
```powershell
cd backend
.\mvnw.cmd spring-boot:run
# Runs on http://localhost:8080/api
```

### 3. Start Frontend (Terminal 2)
```powershell
cd frontend
npm install
npm.cmd run dev
# Runs on http://localhost:3000
```

✅ **Done!** Go to http://localhost:3000 to see your HRMS dashboard.

---

## 🎨 Features

### Frontend UI
- ✨ **Modern Corporate Dashboard** - Clean, professional design
- 👤 **Employee Profile** - 9-tab profile dashboard with all details
- 📋 **Employee List** - Searchable, filterable table with pagination
- 📝 **Multi-Step Form** - Add employee with validation
- 🎭 **Responsive Design** - Works on desktop and mobile
- 🎯 **Data Masking** - Secure display of sensitive data (Phone, Aadhar, PAN, etc.)

### Backend API
- ✅ **Full CRUD** - Create, Read, Update, Delete operations
- 📊 **Nested Resources** - Manage related data (addresses, education, employment, etc.)
- 🔒 **Type-Safe** - DTOs with validation
- 🌐 **RESTful** - Clean API design
- ⚙️ **Spring Boot 3** - Latest enterprise framework

### Database
- 🗂️ **Normalized Schema** - Proper relationships with 10+ tables
- 🔑 **Foreign Keys** - Cascade delete for data integrity
- 📈 **Indexed** - Optimized queries for performance
- ⏰ **Timestamps** - Auto-track creation and updates

---

## 📁 Folder Structure

```
frontend/              # Next.js + Tailwind UI
├── src/
│   ├── app/          # Pages (Dashboard, Employees, Profile)
│   ├── components/   # Reusable components (Layout, Tabs, Tables)
│   ├── lib/          # API, schemas, utilities
│   └── types/        # TypeScript types
└── ...

backend/              # Spring Boot + JPA
├── src/main/java/com/hrms/
│   ├── entity/       # JPA entities
│   ├── repository/   # Data access layer
│   ├── service/      # Business logic
│   ├── controller/   # REST endpoints
│   └── dto/          # Data Transfer Objects
└── ...
```

---

## 🌐 API Endpoints (Key Examples)

```
POST   /employees                    # Create employee
GET    /employees                    # List employees
GET    /employees/{id}               # Get details
PUT    /employees/{id}               # Update
DELETE /employees/{id}               # Delete

GET    /employees/{id}/education     # Get education
POST   /employees/{id}/education     # Add education
GET    /employees/{id}/addresses     # Get addresses
POST   /employees/{id}/addresses     # Add address
... and more!
```

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS, React Hook Form |
| Backend | Spring Boot 3, JPA/Hibernate, MySQL |
| Database | MySQL 8, Indexes, Foreign Keys |
| Tools | Maven, npm, Docker |

---

## 🎯 Use Cases

- ✅ Small businesses building their HR system
- ✅ Enterprises replacing legacy HRMS
- ✅ Companies needing a custom HR platform
- ✅ Educational institutions managing staff
- ✅ Consulting firms tracking employees

---

## 📝 Sample Data

Once running, you can add employees:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@company.com",
  "phone": "9876543210",
  "employeeId": "EMP001",
  "designation": "Senior Engineer",
  "department": "Engineering",
  "dateOfJoining": "2024-01-15",
  "status": "ACTIVE"
}
```

---

## 🔧 Configuration

### Database (backend/src/main/resources/application.yml)
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/hrms_db
    username: root
    password: root
```

### Frontend API URL (frontend/.env.local)
```
# Optional. Default is /backend (proxied via next.config.ts)
# Set only if you want to bypass proxy:
# NEXT_PUBLIC_API_URL=http://127.0.0.1:8080/api
```

---

## 📚 Documentation

- **Detailed Setup Guide**: [README_DETAILED.md](./README_DETAILED.md)
- API Documentation in controllers
- Database schema in [schema.sql](./backend/src/main/resources/schema.sql)

---

## 🚨 Requirements

- **Node.js** 18+
- **Java** 17+
- **MySQL** 8.0+
- **Git**

---

## 🐛 Troubleshooting

### MySQL Connection Failed
```bash
# Check MySQL running
mysql -u root -p

# Reset password if needed
mysql -u root -p < backend/src/main/resources/schema.sql
```

### Port Already in Use
```bash
# Windows PowerShell: kill process on port 8080
$pid = (Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty OwningProcess)
if ($pid) { Stop-Process -Id $pid -Force }

# Windows PowerShell: kill process on port 3000
$pid = (Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty OwningProcess)
if ($pid) { Stop-Process -Id $pid -Force }
```

### Frontend Can't Reach API
1. Make sure backend is running on `http://localhost:8080`.
2. Restart frontend after any config changes (`Ctrl+C`, then `npm.cmd run dev`).
3. If using `.env.local`, ensure `NEXT_PUBLIC_API_URL` is correct.

---

## 🤝 Next Steps

1. ✅ Explore the Dashboard (`/dashboard`)
2. ✅ Add an employee (`/employees/new`)
3. ✅ View employee profile (`/employees/[id]`)
4. ✅ Check the API in Postman (http://localhost:8080/api/employees)
5. ✅ Customize and extend!

---

## 📄 File Highlights

| File | Purpose |
|------|---------|
| `frontend/src/components/employee/EmployeeProfileHeader.tsx` | Profile card with photo |
| `frontend/src/components/employee/OverviewTab.tsx` | Summary cards |
| `frontend/src/app/employees/[id]/page.tsx` | Profile page with 9 tabs |
| `backend/src/main/java/com/hrms/service/EmployeeService.java` | Business logic |
| `backend/src/main/java/com/hrms/controller/EmployeeController.java` | REST endpoints |
| `backend/src/main/resources/application.yml` | Spring config |

---

## 🎨 UI Preview Features

- **Sidebar Navigation** - Dark theme, responsive
- **Search Bar** - Real-time search in navbar
- **Status Badges** - Color-coded (Active, Inactive, On Leave, Terminated)
- **Profile Tabs** - 9 comprehensive tabs for all employee data
- **Data Masking** - Phone shows `******1234`, Aadhar shows `********1234`
- **Responsive Tables** - Works on all screen sizes

---

## 📊 Database Tables

1. **employees** - Core employee data
2. **personal_details** - Bio & government IDs
3. **addresses** - Multiple addresses (Permanent, Current, Emergency)
4. **education** - Academic qualifications
5. **employment** - Job history
6. **family_members** - Dependents
7. **bank_details** - Bank account info
8. **pf_details** - Provident fund
9. **documents** - File attachments
10. **assets** - Equipment allocation

---

## 🚀 Production Ready

This codebase includes:
- ✅ Error handling
- ✅ Type safety
- ✅ Data validation
- ✅ Proper folder structure
- ✅ Reusable components
- ✅ API integration
- ✅ Database design

---

## 💡 Tips

- Use **Postman** to test API endpoints
- Check browser **DevTools** for API requests
- Database auto-creates tables on first run
- Mock data available in profile pages for demo

---

## 📞 Support

Refer to [README_DETAILED.md](./README_DETAILED.md) for expanded documentation,  troubleshooting, and deployment guides.

---

**Happy building! 🎉**
