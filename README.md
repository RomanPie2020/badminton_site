# BadmickTogether

Full-stack web application for badminton players to find partners and manage events. Built with React and Node.js, featuring a client-server architecture, Dockerized development environment, and modern frontend tooling.

---

## Project Overview

**BadmickTogether** helps badminton enthusiasts quickly find partners, join or organize games, and track their participation. The app makes it easy to see who’s attending events, manage personal schedules, and stay connected with the badminton community — saving time and simplifying game organization.

---

## Technology Stack

- **Frontend:** React, RTKQuery, Vite, TailwindCSS
- **Frontend:** Express.js, PostgreSQL, Sequelize ORM
- **Languages:** JavaScript, TypeScript  
- **Tooling:** ESLint, tsconfig
- **Containerization:** Docker, docker‑compose

---

## Features

* **User authentication & authorization** via **OAuth** or **email/password**, with **JWT-based** session handling.
* **Event management (CRUD)** — create, view, update, and delete events.
* **Event filtering & search** — find events by multiple criteria.
* **User profile page** — view and manage personal information and settings.
* **Participant list** — see all users who joined an event along with their details.
* **My Events page** — track events you joined or are participating in.
* **Client‑server architecture** — REST API endpoints connecting frontend and backend.
* **Dockerized development environment** — setup and run the full application locally with Docker and Docker Compose.

---

## API collection
- https://documenter.getpostman.com/view/10560412/2sB3dPR9gW
  
---

## UI

### Home Page
![Home view](docs/screenshots/screenshot-01-home.png)

### SignUp Page
![SignUp Page](docs/screenshots/screenshot-02-signup.png)

### Events Page
![Events Page](docs/screenshots/screenshot-03-events.png)

### MyEvents Page
![MyEvents Page](docs/screenshots/screenshot-04-myevents.png)

### Profile Page
![Profile Page](docs/screenshots/screenshot-05-profile.png)

---

## Quick Start

### Clone the repository
```bash
git clone https://github.com/RomanPie2020/BadmickTogether.git
cd BadmickTogether
```

## Run locally without Docker
### Client
```bash
cd client
npm install
npm run dev
```

### Server
```bash
cd ../server
npm install
```

### Run database migrations
```bash
npx sequelize-cli db:migrate
```

### (Optional) Seed initial data
```bash
npx sequelize-cli db:seed:all
```

### Start server
```bash
npm run dev
```

## Run with Docker
```bash
docker-compose up --build
```

---

## Environment Configuration

- Add OAuth credentials and other secrets to environment variables for both client and server.  
- Provide database connection details and any API keys via `.env` or your preferred secret management.  
- Consider adding a `.env.example` file listing required variables.

---

## Repository Structure

- **client** — React + RTKQuery + Vite frontend: UI components, routes, forms, Tailwind styles.  
- **server** — Backend API: authentication logic and data handling.  
- **docker-compose.yml** — Compose configuration to run services in containers.  
- Configuration files: `tailwind.config.js`, `tsconfig.json`, `.eslintrc`, etc.

---

## Recommendations for Improvement

- Add a detailed `.env.example` and documentation for required environment variables.  
- Implement unit and integration tests for critical components and API endpoints.  
- Configure CI to run linting and tests on pull requests.  

---

## Contributing

- Open an issue to discuss new features or bugs.  
- Submit pull requests with a clear description of changes and tests where applicable.  
- Follow existing code style and linting rules.

---

## Contact

For questions or help with the codebase, open an issue or submit a pull request in the repository.
