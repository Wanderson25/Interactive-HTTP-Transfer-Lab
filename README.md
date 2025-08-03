# 🚀 Interactive HTTP Transfer Lab

![Java](https://img.shields.io/badge/Java-17+-blue?style=for-the-badge&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.0-green?style=for-the-badge&logo=spring)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-4.x-purple?style=for-the-badge&logo=vite)

## Introduction

Ever wondered how a server streams a huge, dynamically generated report versus sending a simple image? This project is an interactive, full-stack web application designed to answer that exact question.

The HTTP Transfer Lab provides a hands-on visualization of the two primary data transfer mechanisms used in modern web APIs:

1.  **Standard Download (`Content-Length`):** Where the server knows the file's exact size upfront.
2.  **Streaming Download (`Transfer-Encoding: chunked`):** Where the server sends data in pieces as it becomes available, ideal for large or dynamically generated content.

Instead of just reading about the theory, this application lets you select a file size, run both scenarios against a live Java backend, and watch the entire process unfold with real-time animations and header inspection.

### Key Features

*   **Full-Stack Application:** A decoupled architecture with a Java Spring Boot backend and a React frontend.
*   **Interactive Visualization:** An animated data pipe shows a continuous flow for standard downloads and individual "packets" for chunked streams, making the difference intuitive.
*   **Real-time Server Simulation:** The Java backend simulates a real-world workload by adding a small delay between chunks in the streaming endpoint.
*   **Direct Header Comparison:** The final results panel displays the raw HTTP headers, allowing for direct verification of which transfer mechanism was used.

![Screenshot of the application in action]
*(Suggestion: Add a screenshot of your running application here!)*

---

## Tech Stack

| Backend              | Frontend             |
| -------------------- | -------------------- |
| Java 17+             | React 18             |
| Spring Boot 3        | Vite                 |
| Maven                | JavaScript (ES6+)    |
|                      | CSS                  |

---

## Getting Started

Follow these instructions to get the application running on your local machine.

### Prerequisites

You must have the following software installed:
*   **Java Development Kit (JDK)**: Version 17 or newer.
*   **Apache Maven**: Required to build the backend. (Comes bundled with most Java IDEs like IntelliJ and is easily configured in VS Code).
*   **Node.js**: Version 16 or newer (includes `npm`).

### How to Run the Project

The backend and frontend are separate applications and must be run in **two separate terminals**.

#### 1. Start the Backend (The Java Server)

1.  Open your first terminal and navigate into the `backend` directory:
    ```bash
    cd http-transfer-lab/backend
    ```
2.  Run the Spring Boot application using the Maven wrapper:

    *   On **Windows (PowerShell or CMD)**:
        ```powershell
        .\mvnw.cmd spring-boot:run
        ```
    *   On **macOS or Linux**:
        ```bash
        ./mvnw spring-boot:run
        ```
3.  Wait for the logs to show that the server has started. You should see a line similar to:
    `Tomcat started on port(s): 8081 (http)`

    **Keep this terminal running.**

#### 2. Start the Frontend (The React Website)

1.  Open a **new, separate terminal**.
2.  Navigate into the `frontend` directory:
    ```bash
    cd http-transfer-lab/frontend
    ```
3.  Install the necessary dependencies. (You only need to do this once.)
    ```bash
    npm install
    ```
4.  Start the frontend development server:
    ```bash
    npm run dev
    ```
5.  The terminal will provide you with a local URL, typically: `http://localhost:5173/`

    **Keep this second terminal running.**

#### 3. Access the Application

Open your web browser and go to the URL provided by the frontend server:

➡️ **http://localhost:5173**

You can now use the interactive lab! Adjust the slider and click the buttons to see the different download methods in action.
