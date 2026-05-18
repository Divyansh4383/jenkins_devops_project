document.addEventListener('DOMContentLoaded', () => {
    
    // DOM Elements
    const studentsTbody = document.getElementById('students-tbody');
    const refreshBtn = document.getElementById('refresh-btn');
    const addStudentForm = document.getElementById('add-student-form');
    const addMarksForm = document.getElementById('add-marks-form');

    // Helper: Show Toast Notification
    const showToast = (message, type = 'success') => {
        Toastify({
            text: message,
            duration: 3000,
            close: true,
            gravity: "bottom",
            position: "right",
            style: {
                background: type === 'success' ? "linear-gradient(to right, #00b09b, #96c93d)" : "linear-gradient(to right, #ff5f6d, #ffc371)",
                borderRadius: "8px",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px"
            }
        }).showToast();
    };

    // Helper: Determine Badge Class based on Grade
    const getBadgeClass = (gradeStr) => {
        if (!gradeStr) return '';
        const letter = gradeStr.charAt(0).toLowerCase();
        if (['a', 'b', 'c', 'f'].includes(letter)) {
            return `grade-${letter}`;
        }
        return '';
    };

    // Fetch and Display Students
    const fetchStudents = async () => {
        try {
            // Animate refresh button
            refreshBtn.style.transform = 'rotate(180deg)';
            setTimeout(() => refreshBtn.style.transform = 'none', 300);

            const response = await fetch('/students');
            if (!response.ok) throw new Error('Failed to fetch data');
            const data = await response.json();
            
            renderTable(data);
        } catch (error) {
            console.error('Error fetching students:', error);
            showToast('Failed to load student data', 'error');
        }
    };

    // Render Table Rows
    const renderTable = (students) => {
        studentsTbody.innerHTML = '';
        
        if (students.length === 0) {
            studentsTbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #94a3b8;">No records found.</td></tr>`;
            return;
        }

        students.forEach(student => {
            const tr = document.createElement('tr');
            
            // Format subjects HTML
            let subjectsHtml = '';
            if (student.marks && Object.keys(student.marks).length > 0) {
                for (const [subject, score] of Object.entries(student.marks)) {
                    subjectsHtml += `<span class="subject-tag">${subject}: <strong>${score}</strong></span>`;
                }
            } else {
                subjectsHtml = '<span style="color: #64748b; font-size: 0.8rem;">No marks recorded</span>';
            }

            const badgeClass = getBadgeClass(student.grade);

            tr.innerHTML = `
                <td><strong>${student.roll}</strong></td>
                <td>${student.name}</td>
                <td>${subjectsHtml}</td>
                <td><strong>${student.average}</strong></td>
                <td><span class="badge ${badgeClass}">${student.grade}</span></td>
            `;
            studentsTbody.appendChild(tr);
        });
    };

    // Handle Add Student Submit
    addStudentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('student-name').value.trim();
        const roll = document.getElementById('student-roll').value.trim();
        
        if (!name || !roll) {
            showToast('Please fill all fields', 'error');
            return;
        }

        try {
            const response = await fetch('/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, roll })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                showToast(result.message || 'Student added successfully!');
                addStudentForm.reset();
                fetchStudents(); // Refresh table
            } else {
                showToast(result.error || 'Failed to add student', 'error');
            }
        } catch (error) {
            console.error('Error adding student:', error);
            showToast('Server error occurred', 'error');
        }
    });

    // Handle Add Marks Submit
    addMarksForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const roll = document.getElementById('mark-roll').value.trim();
        const subject = document.getElementById('mark-subject').value.trim();
        const marks = document.getElementById('mark-score').value.trim();
        
        if (!roll || !subject || !marks) {
            showToast('Please fill all fields', 'error');
            return;
        }

        try {
            const response = await fetch('/students/results', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ roll, subject, marks: Number(marks) })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                showToast(result.message || 'Marks added successfully!');
                addMarksForm.reset();
                fetchStudents(); // Refresh table
            } else {
                showToast(result.error || 'Failed to add marks', 'error');
            }
        } catch (error) {
            console.error('Error adding marks:', error);
            showToast('Server error occurred', 'error');
        }
    });

    // Event Listeners
    refreshBtn.addEventListener('click', fetchStudents);

    // Initial Load
    fetchStudents();
});
