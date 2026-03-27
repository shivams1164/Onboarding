# 🚀 HRMS Setup Commands Cheat Sheet

## Database Setup

### Create Database & Tables
```bash
# Option 1: Use MySQL CLI directly
mysql -u root -p < backend/src/main/resources/schema.sql

# Option 2: Interactive MySQL
mysql -u root -p
mysql> CREATE DATABASE IF NOT EXISTS hrms_db;
mysql> USE hrms_db;
mysql> SOURCE backend/src/main/resources/schema.sql;
```

### Verify Database
```bash
mysql -u root -p
mysql> USE hrms_db;
mysql> SHOW TABLES;
mysql> DESCRIBE employees;
```

---

## Backend Setup & Run

### Navigate to backend
```bash
cd backend
```

### Install Maven dependencies
```bash
mvn clean install
# Or with tests skipped
mvn clean install -DskipTests
```

### Run the application
```bash
# Option 1: Using Maven
mvn spring-boot:run

# Option 2: Using compiled JAR
mvn clean package -DskipTests
java -jar target/hrms-1.0.0.jar
```

### Common Maven commands
```bash
mvn clean                    # Clean build artifacts
mvn compile                  # Compile source
mvn test                     # Run tests
mvn package                  # Package JAR
mvn dependency:tree          # View dependencies
mvn clean dependency:purge   # Clear Maven cache
```

---

## Frontend Setup & Run

### Navigate to frontend
```bash
cd frontend
```

### Install npm dependencies
```bash
npm install
```

### Development server
```bash
npm run dev
# Visit http://localhost:3000
```

### Build for production
```bash
npm run build
npm start
```

### Lint check
```bash
npm run lint
```

---

## Environment Configuration

### Backend Configuration
File: `backend/src/main/resources/application.yml`

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/hrms_db
    username: root
    password: root  # Change this!
  jpa:
    hibernate:
      ddl-auto: update  # Use 'create' for fresh start
```

### Frontend Configuration
File: `frontend/.env.local` (create if not exists)

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

---

## Both Running Together

### Terminal 1: Backend
```bash
cd backend
mvn spring-boot:run
# Backend running on http://localhost:8080/api
```

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
# Frontend running on http://localhost:3000
```

### Terminal 3: (Optional) Monitor Logs
```bash
# Watch for any issues
tail -f backend/logs/application.log
```

---

## Testing API Endpoints

### Using cURL
```bash
# Create employee
curl -X POST http://localhost:8080/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "employeeId": "EMP001",
    "designation": "Engineer",
    "department": "Engineering",
    "dateOfJoining": "2024-01-15",
    "status": "ACTIVE"
  }'

# Get all employees
curl http://localhost:8080/api/employees

# Get single employee
curl http://localhost:8080/api/employees/1
```

### Using Postman
1. Import collection from `backend/` folder (if available)
2. Set base URL: `http://localhost:8080/api`
3. Test endpoints with provided examples

---

## Troubleshooting Commands

### Check if ports are available
```bash
# Check port 8080 (Backend)
lsof -i :8080
netstat -tuln | grep 8080

# Check port 3000 (Frontend)
lsof -i :3000
netstat -tuln | grep 3000
```

### Kill process on specific port
```bash
# Kill port 8080
lsof -i :8080 | awk 'NR != 1 {print $2}' | xargs kill -9

# Kill port 3000
lsof -i :3000 | awk 'NR != 1 {print $2}' | xargs kill -9

# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### MySQL Commands
```bash
# Connect to MySQL
mysql -u root -p

# List databases
SHOW DATABASES;

# Use specific database
USE hrms_db;

# List tables
SHOW TABLES;

# Describe table
DESCRIBE employees;

# Check data
SELECT * FROM employees LIMIT 5;

# Drop and recreate database
DROP DATABASE hrms_db;
CREATE DATABASE hrms_db;
SOURCE backend/src/main/resources/schema.sql;
```

### Java Commands
```bash
# Check Java version
java -version

# Check Maven version
mvn -version

# Build JAR
mvn clean package

# Run JAR with debug
java -jar target/hrms-1.0.0.jar --debug
```

### Node/npm Commands
```bash
# Check Node version
node -v

# Check npm version
npm -v

# Clear npm cache
npm cache clean --force

# Update npm
npm install -g npm@latest

# List global packages
npm list -g
```

---

## Git Commands (if version controlling)

```bash
# Clone repository
git clone <repo-url>

# Create feature branch
git checkout -b feature/new-feature

# Stage changes
git add .

# Commit changes
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/new-feature

# Switch branches
git checkout main
git checkout develop

# Merge branch
git merge feature/new-feature
```

---

## Docker Commands (Optional)

### Build images
```bash
cd backend
docker build -t hrms-backend:1.0 .

cd frontend
docker build -t hrms-frontend:1.0 .
```

### Run containers
```bash
docker run -d -p 8080:8080 hrms-backend:1.0
docker run -d -p 3000:3000 hrms-frontend:1.0
```

### Docker compose (if docker-compose.yml exists)
```bash
docker-compose up -d
docker-compose down
docker-compose logs -f
```

---

## Monitoring & Debugging

### Backend Logs
```bash
# Check Spring Boot logs
tail -f target/logs/application.log

# More verbose logging
mvn spring-boot:run -Dlogging.level.com.hrms=DEBUG
```

### Frontend DevTools
- Press `F12` in browser
- Check Console tab for errors
- Network tab to see API calls
- Storage tab for local data

### API Response Check
```bash
# Install jq for pretty JSON output
sudo apt-get install jq  # Linux
brew install jq          # Mac

# Pretty print API response
curl http://localhost:8080/api/employees | jq .
```

---

## Performance Tweaks

### Frontend
```bash
# Run production build
npm run build
npm start

# Check bundle size
npm run build -- --analyze
```

### Backend
```xml
<!-- In pom.xml for production -->
<maven.compiler.optimize>true</maven.compiler.optimize>
```

---

## Reset & Clean Start

### Complete Reset
```bash
# 1. Stop both applications

# 2. Drop and recreate database
mysql -u root -p < backend/src/main/resources/schema.sql

# 3. Clean backend
cd backend
mvn clean

# 4. Clean frontend
cd frontend
rm -rf node_modules
rm -rf .next
npm install

# 5. Start fresh
# Terminal 1: Backend
cd backend && mvn spring-boot:run

# Terminal 2: Frontend
cd frontend && npm run dev
```

---

## Common Issues & Fixes

### "Port already in use"
```bash
# Kill the process and retry
lsof -i :<port> | awk 'NR != 1 {print $2}' | xargs kill -9
```

### "Cannot find MySQL"
```bash
# Check MySQL is running
mysql -u root -p
# Or restart MySQL service
```

### "404 API not found"
```bash
# Verify backend URL in frontend
# Check .env.local has correct NEXT_PUBLIC_API_URL
```

### "CORS error"
```bash
# Backend should have @CrossOrigin annotation
# Check controller class for proper origin
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Setup DB | `mysql -u root -p < backend/src/main/resources/schema.sql` |
| Run Backend | `cd backend && mvn spring-boot:run` |
| Run Frontend | `cd frontend && npm run dev` |
| Build Backend | `cd backend && mvn clean package` |
| Build Frontend | `cd frontend && npm run build` |
| Test API | `curl http://localhost:8080/api/employees` |
| View Frontend | `http://localhost:3000` |
| Kill port 8080 | `lsof -i :8080 \| awk 'NR != 1 {print $2}' \| xargs kill -9` |
| Kill port 3000 | `lsof -i :3000 \| awk 'NR != 1 {print $2}' \| xargs kill -9` |

---

✅ **You're all set!** Follow these commands for a smooth HRMS setup and development.
