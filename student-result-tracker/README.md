# Student Result Tracker

A REST API that lets you add students, record their subject marks, and view their grade and pass/fail status automatically.

## Tech Stack
- **Backend Framework**: Python Flask
- **Containerization**: Docker & Docker Compose
- **CI/CD Pipeline**: Jenkins & GitHub Actions
- **Container Orchestration**: Kubernetes

## Architecture Diagram

```text
+--------+       +---------+       +------------+       +------------+
|        |       |         |       |            |       |            |
| GitHub +------>+ Jenkins +------>+ Docker Hub +------>+ Kubernetes |
|        |       |         |       |            |       |            |
+--------+       +---------+       +------------+       +------------+
```

## How to Run Locally with Docker

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
   docker-compose up
   ```

The application will be accessible at `http://localhost:5000`.

## How to Run on Kubernetes

1. **Apply the Deployment and Service**
   Ensure your Kubernetes cluster is running (e.g., minikube) and apply the configurations:
   ```bash
   kubectl apply -f k8s/deployment.yml
   kubectl apply -f k8s/service.yml
   ```

2. **Access the Application**
   The application will be exposed via a NodePort service on port `30001`. You can access it at:
   ```
   http://localhost:30001/students
   ```

## Sample API Responses

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
