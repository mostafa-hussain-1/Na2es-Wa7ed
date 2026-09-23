# Na2es Wa7ed (ناقص واحد) - Backend API

> A robust, scalable RESTful API built to power the **Na2es Wa7ed** platform, seamlessly connecting CS students for academic and extracurricular project team formations.

## 🛠 Tech Stack & Architecture

- **Runtime Environment:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB (with Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens) & bcrypt for password hashing
- **Hosting / Deployment:** Microsoft Azure
- **External APIs:** Codeforces API integration

## ✨ Key Features

- ** Secure Authentication & Authorization:** Role-based access control using JWT.
- ** Advanced Team Management:** Full lifecycle of team formation (Create teams, Apply, Cancel, Accept, Reject, and Kick members).
- ** Gamification & Profile Scoring:** Dynamic algorithm to calculate user profile scores based on provided data, tracks, and achievements to boost engagement.
- ** Codeforces Integration:** Real-time fetching of users' Codeforces handles, ratings, and ranks directly into their profiles.
- ** Projects Showcase:** Endpoints for users to upload and display their previous projects, creating a built-in portfolio.
- ** Optimized Queries:** Heavy use of Mongoose `populate` for efficient data retrieval across relational-like structures (Users, Teams, Projects).

## 📂 Project Structure

```text
📦 src
 ┣ 📂 config         # Database connection and Swagger API configuration
 ┣ 📂 controllers    # Request handlers and business logic
 ┣ 📂 helpers        # External integrations (Codeforces) and profile score calculation
 ┣ 📂 middlewares    # Custom middlewares (Auth and route validations)
 ┣ 📂 models         # Mongoose schemas (User, Team, Project)
 ┣ 📂 routes         # Express API route definitions
 ┗ 📜 server.ts      # Application entry point

📄 Root Files:
 ┣ 📜 .env.example   # Template for required environment variables
 ┣ 📜 package.json   # Project dependencies and scripts
 ┗ 📜 tsconfig.json  # TypeScript compiler configuration
