const existing = JSON.parse(localStorage.getItem("deadlines")) || [];

const newDeadline = {
  id: Date.now(),
  subject: title,
  date: deadlineDate,
  icon: "📘",
  description: "Submit your assignment"
};

existing.push(newDeadline);

localStorage.setItem("deadlines", JSON.stringify(existing));

// 🔔 SEND NOTIFICATION TO STUDENTS 
const users = JSON.parse(localStorage.getItem("users")) || [];
const students = users.filter((u) => u.role === "student");

students.forEach((s) => {
  addNotification(
    s.email,
    `⏰ New deadline added for "${title}" — due on ${new Date(deadlineDate).toLocaleString()}`
  );
});

// 🔥 Force navbar update
window.dispatchEvent(new Event("storage"));
