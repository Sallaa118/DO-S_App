const addBtn = document.getElementById("add-btn");
const popup = document.getElementById("popup");
const addScheduleBtn = document.getElementById("add-schedule-btn");
const scheduleList = document.querySelector(".schedule-list");
const searchInput = document.getElementById("search");
const clearBtn = document.getElementById("clear-btn");
const editPopup = document.getElementById("edit-popup");
const editScheduleBtn = document.getElementById("edit-schedule-btn");

// Add Schedule Popup
addBtn.addEventListener("click", () => {
    popup.style.display = "flex";
});

addScheduleBtn.addEventListener("click", () => {
    const title = document.getElementById("title").value;
    const notes = document.getElementById("notes").value;
    const deadline = document.getElementById("deadline").value;

    if (title && notes && deadline) {
        const newItem = document.createElement("li");
        newItem.classList.add("schedule-item");
        newItem.innerHTML = `
            <h3 class="schedule-title">${title}</h3>
            <p class="schedule-notes">${notes}</p>
            <p class="schedule-deadline">Deadline: ${deadline}</p>
            <div class="btn-group">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
                <button class="done-btn">Done</button>
            </div>
        `;
        scheduleList.appendChild(newItem);
        sortSchedules(); // Automatically sort schedules by deadline
        popup.style.display = "none";
        showAlert("Schedule added successfully!", "success");
    } else {
        showAlert("Please fill out all fields!", "danger");
    }
});

// Clear Button Functionality
clearBtn.addEventListener("click", () => {
    document.getElementById("title").value = "";
    document.getElementById("notes").value = "";
    document.getElementById("deadline").value = "";
    showAlert("Fields cleared!", "success");
});

// Apply Flatpickr to date inputs
flatpickr("#deadline", {
    altInput: true,
    altFormat: "F j, Y",
    dateFormat: "Y-m-d",
    theme: "dark"
});

// Search Functionality
searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    document.querySelectorAll(".schedule-item").forEach(item => {
        const title = item.querySelector(".schedule-title").textContent.toLowerCase();
        item.style.display = title.includes(query) ? "block" : "none";
    });
});

// Edit Schedule Popup
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-btn")) {
        const scheduleItem = e.target.closest(".schedule-item");

        const title = scheduleItem.querySelector(".schedule-title").textContent;
        const notes = scheduleItem.querySelector(".schedule-notes").textContent;
        const deadline = scheduleItem.querySelector(".schedule-deadline").textContent.replace("Deadline: ", "");

        document.getElementById("edit-title").value = title;
        document.getElementById("edit-notes").value = notes;
        document.getElementById("edit-deadline").value = deadline;

        editPopup.style.display = "flex";

        editScheduleBtn.onclick = () => {
            const newTitle = document.getElementById("edit-title").value;
            const newNotes = document.getElementById("edit-notes").value;
            const newDeadline = document.getElementById("edit-deadline").value;

            if (newTitle && newNotes && newDeadline) {
                scheduleItem.querySelector(".schedule-title").textContent = newTitle;
                scheduleItem.querySelector(".schedule-notes").textContent = newNotes;
                scheduleItem.querySelector(".schedule-deadline").textContent = `Deadline: ${newDeadline}`;
                sortSchedules(); // Automatically sort schedules after editing
                editPopup.style.display = "none";
                showAlert("Schedule updated successfully!", "success");
            } else {
                showAlert("Please fill out all fields!", "danger");
            }
        };
    }
});

// Delete and Done Buttons
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
        const scheduleItem = e.target.closest(".schedule-item");
        scheduleItem.remove();
        showAlert("Schedule deleted successfully!", "danger");
    } else if (e.target.classList.contains("done-btn")) {
        const scheduleItem = e.target.closest(".schedule-item");
        scheduleItem.remove();
        showAlert("Schedule marked as done!", "success");
    }
});

// Close Popup on Outside Click
window.addEventListener("click", (e) => {
    if (e.target === popup) {
        popup.style.display = "none";
    } else if (e.target === editPopup) {
        editPopup.style.display = "none";
    }
});

// Styled Alert Function
function showAlert(message, type) {
    const alertBox = document.createElement("div");
    alertBox.className = `alert alert-${type}`;
    alertBox.textContent = message;

    document.body.appendChild(alertBox);

    setTimeout(() => {
        alertBox.remove();
    }, 3000);
}

// Sorting Functionality
function sortSchedules() {
    const items = Array.from(document.querySelectorAll(".schedule-item"));
    items.sort((a, b) => {
        const dateA = new Date(a.querySelector(".schedule-deadline").textContent.replace("Deadline: ", ""));
        const dateB = new Date(b.querySelector(".schedule-deadline").textContent.replace("Deadline: ", ""));
        return dateA - dateB; // Sort in ascending order (earliest deadline first)
    });

    // Append sorted items back to the list
    items.forEach(item => scheduleList.appendChild(item));
}
