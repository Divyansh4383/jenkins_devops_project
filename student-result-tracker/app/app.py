from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

# In-memory storage for students
students = [
    {
        "name": "Rahul Sharma",
        "roll": "101",
        "marks": {"Math": 88, "Science": 91, "English": 76}
    },
    {
        "name": "Priya Singh",
        "roll": "102",
        "marks": {"Math": 55, "Science": 60, "English": 48}
    },
    {
        "name": "Arjun Mehta",
        "roll": "103",
        "marks": {"Math": 95, "Science": 89, "English": 92}
    }
]

def calculate_grade(average):
    if average >= 90:
        return "A (Excellent)"
    elif average >= 75:
        return "B (Good)"
    elif average >= 60:
        return "C (Average)"
    else:
        return "F (Fail)"

def process_student(student):
    marks = student.get("marks", {})
    if not marks:
        return {**student, "average": 0, "grade": "F (Fail)"}
    
    total = sum(marks.values())
    count = len(marks)
    average = round(total / count, 2)
    grade = calculate_grade(average)
    
    return {
        "name": student["name"],
        "roll": student["roll"],
        "marks": marks,
        "average": average,
        "grade": grade
    }

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/students', methods=['GET'])
def get_students():
    result = [process_student(student) for student in students]
    return jsonify(result), 200

@app.route('/students/<roll>', methods=['GET'])
def get_student(roll):
    student = next((s for s in students if s["roll"] == str(roll)), None)
    if student:
        return jsonify(process_student(student)), 200
    return jsonify({"error": "Student not found"}), 404

@app.route('/students', methods=['POST'])
def add_student():
    data = request.json
    name = data.get("name")
    roll = str(data.get("roll"))
    
    if not name or not roll:
        return jsonify({"error": "Name and roll number are required"}), 400
        
    if any(s["roll"] == roll for s in students):
        return jsonify({"error": "Student with this roll number already exists"}), 400
        
    new_student = {"name": name, "roll": roll, "marks": {}}
    students.append(new_student)
    
    return jsonify({"message": "Student added successfully", "student": new_student}), 201

@app.route('/students/results', methods=['POST'])
def add_marks():
    data = request.json
    roll = str(data.get("roll"))
    subject = data.get("subject")
    marks_obtained = data.get("marks")
    
    if not roll or not subject or marks_obtained is None:
        return jsonify({"error": "Roll number, subject, and marks are required"}), 400
        
    student = next((s for s in students if s["roll"] == roll), None)
    if not student:
        return jsonify({"error": "Student not found"}), 404
        
    try:
        marks_obtained = float(marks_obtained)
    except ValueError:
        return jsonify({"error": "Marks must be a number"}), 400
        
    student["marks"][subject] = marks_obtained
    return jsonify({
        "message": "Marks updated successfully", 
        "student": process_student(student)
    }), 200

if __name__ == '__main__':
    # Run the app on all interfaces, port 5000
    app.run(host='0.0.0.0', port=5000)
