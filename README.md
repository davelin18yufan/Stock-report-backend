# Stock Report 
This README provides instructions for setting up and running the backend of the Stock-report project.

## frontend deploy on 
[gh-pages](https://davelin18yufan.github.io/Stock-report-frontend)

## Prerequisites

Before getting started, make sure you have the following installed:

+ Node.js (v12 or higher)
+ MySQL database

## Installation

1. Clone the repository:

    git clone https://github.com/davelin18yufan/Stock-report-backend.git

2. Navigate to the backend directory:

    cd Project
    
3. Install the dependencies:

    npm install

4. **Configure the database connection:**

Open the config/config.json file and update the following fields with your database connection details:

    "development": {
      "username": "your_database_username",
      "password": "your_database_password",
      "database": "your_database_name",
      "host": "your_database_host",
      "dialect": "mysql"
    }

5. Set up the database:

Create a new database in your MySQL server.
You may use GUI tools such as MySQL workbench

6. Run database migrations:

        npx sequelize db:migrate

This will create the necessary tables in your database.

7. Start the server:

        npm start

The server will run on http://localhost:5000 by default.
cause the frontend might using the default port 3000.

## Usage

This backend serves as a simple database for the frontend web application. Users can register, authenticate, post reports, browse and comment on other users' posts.

## Backend APIs

To access the backend APIs, use the following base URL: http://localhost:5000/api

## Backend Authentication

To access the backend admin panel, **you need to manually add a user to the database with the appropriate isAdmin field value.** This user will have administrative privileges and can access the backend.
The frontend application allows users to register themselves. After registration, they can log in to access the frontend features.

## Contributing

If you'd like to contribute to this project, please follow these steps:

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Commit your changes
5. Push to the branch
6. Submit a pull request

Feel free to reach out to us if you have any questions or need further assistance. Happy coding!