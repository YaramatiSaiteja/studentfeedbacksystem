// src/utils/storage.js

const COURSES_KEY = 'sfh_courses';
const FEEDBACK_KEY = 'sfh_feedback';

// --- Courses ---

export const getCourses = () => {
    return JSON.parse(localStorage.getItem(COURSES_KEY) || '[]');
};

export const createCourse = ({ title, description, instructor }) => {
    const courses = getCourses();
    const newCourse = {
        id: Date.now().toString(),
        title,
        description,
        instructor,
        createdAt: new Date().toISOString(),
    };
    courses.push(newCourse);
    localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
    return newCourse;
};

export const editCourse = (id, modifications) => {
    const courses = getCourses();
    const index = courses.findIndex(c => c.id === id);
    if (index > -1) {
        courses[index] = { ...courses[index], ...modifications, updatedAt: new Date().toISOString() };
        localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
        return courses[index];
    }
    return null;
};

export const deleteCourse = (id) => {
    let courses = getCourses();
    courses = courses.filter(c => c.id !== id);
    localStorage.setItem(COURSES_KEY, JSON.stringify(courses));

    // Cascade delete associated feedback
    let allFeedback = getAllFeedback();
    allFeedback = allFeedback.filter(f => f.courseId !== id);
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(allFeedback));
};

// --- Feedback ---

export const getCourseFeedback = (courseId) => {
    const allFeedback = JSON.parse(localStorage.getItem(FEEDBACK_KEY) || '[]');
    return allFeedback.filter(f => f.courseId === courseId);
};

export const submitFeedback = ({ courseId, studentId, courseRating, instructorRating, comment, ...rest }) => {
    const allFeedback = JSON.parse(localStorage.getItem(FEEDBACK_KEY) || '[]');

    // Optional: Prevent multiple submissions per student per course
    const existingIndex = allFeedback.findIndex(f => f.courseId === courseId && f.studentId === studentId);

    const newFeedback = {
        id: Date.now().toString(),
        courseId,
        studentId,
        courseRating: Number(courseRating),
        instructorRating: Number(instructorRating),
        comment,
        ...rest,
        submittedAt: new Date().toISOString(),
    };

    if (existingIndex > -1) {
        allFeedback[existingIndex] = newFeedback; // Update existing
    } else {
        allFeedback.push(newFeedback);
    }

    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(allFeedback));
    return newFeedback;
};

export const getAllFeedback = () => {
    return JSON.parse(localStorage.getItem(FEEDBACK_KEY) || '[]');
};

export const getStudentFeedback = (studentId) => {
    const allFeedback = getAllFeedback();
    return allFeedback.filter(f => f.studentId === studentId);
};

export const getPendingCourses = (studentId) => {
    const courses = getCourses();
    const studentFeedback = getStudentFeedback(studentId);

    // Create a Set of course IDs that the student has already evaluated
    const evaluatedCourseIds = new Set(studentFeedback.map(f => f.courseId));

    // Return courses that are missing from the Set
    return courses.filter(c => !evaluatedCourseIds.has(c.id));
};

export const getAnalytics = () => {
    const feedback = getAllFeedback();
    if (feedback.length === 0) {
        return {
            averageCourseRating: 0,
            averageInstructorRating: 0,
            totalFeedback: 0,
        };
    }

    const sumCourse = feedback.reduce((acc, curr) => acc + curr.courseRating, 0);
    const sumInstructor = feedback.reduce((acc, curr) => acc + curr.instructorRating, 0);

    return {
        averageCourseRating: (sumCourse / feedback.length).toFixed(1),
        averageInstructorRating: (sumInstructor / feedback.length).toFixed(1),
        totalFeedback: feedback.length,
    };
};
