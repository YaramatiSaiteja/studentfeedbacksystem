export const addNotification = (userEmail, msg) => {
  const notifs = JSON.parse(localStorage.getItem("notifications")) || [];

  const newNotif = {
    id: Date.now(),
    userEmail, // who receives the notification
    message: msg,
    time: new Date().toLocaleString(),
    read: false
  };

  notifs.push(newNotif);
  localStorage.setItem("notifications", JSON.stringify(notifs));

  // 🔥 IMPORTANT: Force update in Navbar without page reload
  window.dispatchEvent(new Event("storage"));
};
