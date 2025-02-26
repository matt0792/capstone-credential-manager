
# Login Manager

A React-based web application that provides user authentication, role-based access control, and management features for employees and credentials. It uses React Router for navigation and includes both public and protected routes.
## Features

- **User Authentication:** Login and registration functionality with protected routes
- **Role-Based Access Control:** Different views for regular users and admins.
- **Employee Management:** View and manage employee lists and permissions.
- **Credential Management:** Add and update credentials.
## Tech Stack

**Client:** React, React Router, Bootstrap Icons

**State Management:** React's useState and useEffect hooks

**Routing:** react-router-dom

**Server:** Node, Express

**Authentication:** JWT for user auth and protected routes


## Installation

Clone Repo

```bash
git clone https://github.com/mett0792/capstone-credential-manager.git
```

Start the backend server

```bash
cd backend/
npm install 
node server.js
```

Start the Frontend (Seperate terminal window)

```bash
cd frontend/
npm install
npm run dev
```


## Usage/Examples

- **Login:** Navigate to /login to access login page
- **Register:** Navigate to /register to create a new account
- **Home:** After auth, users are redirected to the home page (/)
- **User Page:** View personal details at /user
- **Admin Page:** Admins can manage employees at /admin
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGO_URI`

`JWT_SECRET`


## 🔗 Links
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://github.com/matt0792)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/matt-thompson-615a3124b/)

