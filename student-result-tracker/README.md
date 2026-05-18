# Student Result Tracker DevOps Project

A full-stack web application that lets you add students, record their subject marks, and view their grades automatically. This project serves as a complete demonstration of the modern DevOps lifecycle.

## 🚀 The DevOps Pipeline (Why These Tools?)

This project was built to showcase a professional software delivery pipeline. Here is exactly what each tool does and why we use it:

### 1. GitHub (Version Control)
* **What it does:** Stores our code safely in the cloud.
* **Why we use it:** It allows multiple developers to collaborate without overwriting each other's work, and keeps a history of every change made to the project.

### 2. GitHub Actions (Continuous Integration / Validation)
* **What it does:** Automatically runs a script (`ci.yml`) the moment new code is pushed to GitHub.
* **Why we use it:** It acts as a "spell-checker" for our code. It performs a test build to ensure the code isn't broken before we waste time or server resources trying to deploy it. In our project, it tests the build but does *not* push to Docker Hub.

### 3. Jenkins (Continuous Delivery)
* **What it does:** An automation server running on our own machine. It detects changes, builds the official Docker container, tests it locally, and securely uploads it to Docker Hub.
* **Why we use it:** Jenkins takes over the heavy lifting. Instead of a human manually typing commands to build and upload the software every time the code changes, Jenkins completely automates the delivery process (`Jenkinsfile`).

### 4. Docker (Containerization)
* **What it does:** Packages our Python Flask backend, frontend code, and all dependencies into a single, standardized "box" called a container.
* **Why we use it:** It eliminates the "it works on my machine" problem. A Docker container will run exactly the same way on a developer's laptop as it will on a massive production server.

### 5. Docker Hub (Image Registry)
* **What it does:** A cloud storage warehouse for Docker containers. 
* **Why we use it:** Jenkins uploads our finished container here, and Kubernetes downloads it from here. It acts as the bridge between our build server and our production servers.

### 6. Kubernetes (Orchestration & Hosting)
* **What it does:** It pulls our container from Docker Hub and runs it for the world to see. It manages our running application.
* **Why we use it:** If our application crashes, Kubernetes instantly restarts it (Self-healing). If we get a massive spike in user traffic, Kubernetes can duplicate the container to handle the load (Scaling). We use a `Deployment` to ensure high availability (2 replicas) and a `Service` to expose it to the web.

---

## 🏗️ Architecture Diagram

```text
+--------+       +---------+       +------------+       +------------+
|        |       |         |       |            |       |            |
| GitHub +------>+ Jenkins +------>+ Docker Hub +------>+ Kubernetes |
|   |    |       |         |       |            |       |            |
+---+----+       +---------+       +------------+       +------------+
    |
    v
+---+------------+
| GitHub Actions | (Test Build Only)
+----------------+
```

## 💻 How to Run Locally with Docker

1. **Build the Docker Image**
   ```bash
   docker build -t student-tracker .
   ```

2. **Run the Application using Docker**
   ```bash
   docker run -p 5000:5000 student-tracker
   ```

3. **Alternatively, Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

The application UI will be accessible at `http://localhost:5000`.

## 🚢 How to Run on Kubernetes

1. **Apply the Deployment and Service**
   Ensure your Kubernetes cluster is running (e.g., Docker Desktop or minikube) and apply the configurations:
   ```bash
   kubectl apply -f k8s/deployment.yml
   kubectl apply -f k8s/service.yml
   ```

2. **Access the Application**
   The application will be exposed via a NodePort service on port `30001`. You can access the UI at:
   ```
   http://localhost:30001/
   ```

## 📊 Sample API Responses

### List all students (`GET /students`)

```json
[
  {
    "average": 85.0,
    "grade": "B (Good)",
    "marks": {
      "English": 76,
      "Math": 88,
      "Science": 91
    },
    "name": "Rahul Sharma",
    "roll": "101"
  },
  {
    "average": 54.33,
    "grade": "F (Fail)",
    "marks": {
      "English": 48,
      "Math": 55,
      "Science": 60
    },
    "name": "Priya Singh",
    "roll": "102"
  },
  {
    "average": 92.0,
    "grade": "A (Excellent)",
    "marks": {
      "English": 92,
      "Math": 95,
      "Science": 89
    },
    "name": "Arjun Mehta",
    "roll": "103"
  }
]
```
