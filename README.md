# Node JS Starter Template with sequelize ORM

A starter template for any Enterprise Applications, Rest APIs or Microservices with Node.js, Express and Sequelize ORM for MySQL, PostgreSQL or others.
This project offers production ready environment with all necessary supports for validation, unit testing, socket, redis and many more.
## Manual Installation

Clone the repo:

```bash
git clone https://github.com/ItzSamdam/Node-Js-Starter-Template.git
cd Node-Js-Starter-Template
```

Install the dependencies:

```bash
yarn install
```

Set the environment variables:

```bash
cp .env.example .env

# open .env and modify the environment variables (if needed)
```

## Commands

Running locally:

```bash
yarn dev
```

Running in production:

```bash
yarn start
```

Testing:

```bash
# run all tests
yarn test

```

## Project Structure

```
public\
src\
 |--config\         # Environment variables and configuration related things
 |--controllers\    # Route controllers (controller layer)
 |--daom\           # Data Access Object for models
 |--database\       # Migrations and Seed files
 |--middlewares\    # Provide Security Layer in app
 |--models\         # Sequelize models (data layer)
 |--routes\         # Routes
 |--services\       # Business logic (service layer)
 |--utilities\      # Utilities classes and functions
 |--validators\     # Request data validation schemas
 |--app.js          # Express app
 |--cronJobs.js     # Job Scheduler
 |--server.js        # App entry point
```