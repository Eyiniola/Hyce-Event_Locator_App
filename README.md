# Event Locator API

## Description  
The Event Locator API is a **Node.js and Express** application that allows users to create, manage, and search for events based on location. It leverages **Sequelize ORM with MySQL** and supports geospatial queries to find events near a given location. The application also includes user authentication, user preferences, event categorization, notifications, and a favorites system.

---

## Table of Contents  
1. [Installation](#installation)  
2. [Configuration](#configuration)  
3. [Running the Application](#running-the-application)  
4. [Features](#features)  
5. [API Endpoints](#api-endpoints)  
6. [Database Schema](#database-schema)  
7. [Postman API Documentation](#postman-api-documentation)  

---

## 1. Installation  

### Prerequisites  
Ensure you have the following installed on your machine:  
- **Node.js** (v16+ recommended)  
- **MySQL** (with spatial indexing support)  
- **Postman** (for API testing)  

### Clone the Repository  


### Install Dependencies  
```bash
npm install
```

---

## 2. Configuration  

### Create a `.env` File  
Inside the root directory, create a `.env` file and configure the following:  
```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=event_locator
DB_DIALECT=mysql
JWT_SECRET=your_secret_key
```

---

## 3. Running the Application  

### Start the MySQL Server  
Ensure your MySQL server is running. Then, create the database manually:  
```sql
CREATE DATABASE event_locator;
```

### Run Migrations and Seeders  
```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

### Start the Server  
```bash
npm start
```
The server will run on `http://localhost:3000`.

---

## 4. Features  
✅ **User Authentication** (JWT-based login & registration)  
✅ **User Preferences** (Set location, manage interests)  
✅ **Create and Manage Events** (CRUD operations)  
✅ **Geolocation Search** (Find events within a radius)  
✅ **Favorites System** (Save favorite events)  
✅ **Notifications** (Real-time updates on saved events)  

---

## 5. API Endpoints  

### User Routes  
| Method | Endpoint                             | Description                        | Auth Required |
|--------|--------------------------------------|------------------------------------|--------------|
| POST   | `/api/users/register`               | Register a new user                | ❌ No        |
| POST   | `/api/users/login`                  | Login user & get token             | ❌ No        |
| GET    | `/api/users/:id/preferences`        | Get user preferences               | ✅ Yes      |
| PUT    | `/api/users/:id/location`           | Update user location               | ✅ Yes      |
| PUT    | `/api/users/:userId`                | Update user profile                | ✅ Yes      |
| DELETE | `/api/users/:userId`                | Delete user account                | ✅ Yes      |

### Favorites Routes  
| Method | Endpoint                                  | Description                     | Auth Required |
|--------|-------------------------------------------|---------------------------------|--------------|
| POST   | `/api/users/:userId/favorites/:eventId`  | Add event to favorites          | ✅ Yes      |
| GET    | `/api/users/:userId/favorites`           | Get user's favorite events      | ✅ Yes      |
| DELETE | `/api/users/:userId/favorites/:eventId`  | Remove event from favorites     | ✅ Yes      |

### Event Routes  
| Method | Endpoint                     | Description                        | Auth Required |
|--------|------------------------------|------------------------------------|--------------|
| GET    | `/api/events/`               | Get all events                     | ❌ No        |
| GET    | `/api/events/events`         | Get events by category             | ❌ No        |
| GET    | `/api/events/location`       | Search events by location          | ❌ No        |
| GET    | `/api/events/:id`            | Get event details                  | ❌ No        |
| POST   | `/api/events/`               | Create an event                    | ✅ Yes (User/Admin) |
| PUT    | `/api/events/:id`            | Update an event                    | ✅ Yes (Admin) |
| DELETE | `/api/events/:id`            | Delete an event                    | ✅ Yes (Admin) |

### Search Event by Location Example  
To search for events near **latitude: 1.9523, longitude: 30.0856** within **10km**, use:  
```
GET http://localhost:3000/api/events/location?longitude=30.0856&latitude=1.9523&radius=10
```

### Notification Routes  
| Method | Endpoint                         | Description                        | Auth Required |
|--------|----------------------------------|------------------------------------|--------------|
| POST   | `/api/notifications/publish`    | Send notification to a user        | ✅ Yes (Admin) |
| GET    | `/api/notifications/user/:userId` | Get user notifications             | ✅ Yes      |

---

## 6. Database Schema  

### User Model
```js
User = {
  id: INT (Primary Key),
  name: STRING,
  email: STRING,
  password: STRING (Hashed),
  createdAt: DATE,
  updatedAt: DATE
}
```

### Event Model
```js
Event = {
  id: INT (Primary Key),
  title: STRING,
  description: TEXT,
  eventDateTime: DATETIME,
  location: {
    type: "Point",
    coordinates: [longitude, latitude]
  },
  categoryId: INT (Foreign Key)
}
```

### Notification Model
```js
Notification = {
  id: INT (Primary Key),
  userId: INT (Foreign Key),
  eventId: INT (Foreign Key),
  message: TEXT,
  createdAt: DATE
}
```

---

## 7. Postman API Documentation  
📄 **[Download the Postman Collection](https://web.postman.co/workspace/59f468e1-3767-484c-8073-da65c916de33/collection/42357137-79b29570-e9bc-4147-94d1-844bb9acfbea?action=share&source=copy-link&creator=42357137)** *(Replace with actual link)*  
You can import this into Postman and test all API endpoints.  

---

## Future Enhancements  
- 📌 Implement **real-time notifications** with WebSockets.  
- 📌 Add **ticket booking system** for events.  
- 📌 Improve **map integration** using Google Maps API.  


