let birthdays = [];

// Save birthdays to local storage
function saveToLocalStorage() {
    localStorage.setItem("birthdays", JSON.stringify(birthdays));
}

// Load birthdays from local storage
function loadFromLocalStorage() {
    const storedBirthdays = localStorage.getItem("birthdays");
    if (storedBirthdays) {
        birthdays = JSON.parse(storedBirthdays);
    }
}

// Show specific page
function showPage(pageId) {
    document.querySelectorAll("div.page").forEach(page => {
        page.classList.add("hidden");
    });
    document.getElementById(pageId).classList.remove("hidden");
}

// Event listeners for landing page buttons
document.getElementById("add-button").addEventListener("click", () => {
    showPage("add-page");
});

document.getElementById("summary-button").addEventListener("click", () => {
    renderSummary();
    showPage("summary-page");
});

document.getElementById("delete-button").addEventListener("click", () => {
    populateDeleteDropdown();
    showPage("delete-page");
});

// Add Birthday
document.getElementById("add-submit").addEventListener("click", () => {
    const name = document.getElementById("name").value;
    const date = document.getElementById("date").value;

    if (name && date) {
        birthdays.push({ name, date });
        saveToLocalStorage();
        alert("Birthday added successfully!");
        document.getElementById("name").value = "";
        document.getElementById("date").value = "";
    } else {
        alert("Please fill out all fields.");
    }
});

// Populate Summary Page
function renderSummary() {
    const container = document.getElementById("summary-container");
    container.innerHTML = "";

    // Group birthdays by month
    const grouped = birthdays.reduce((acc, b) => {
        const month = new Date(b.date).toLocaleString("en-US", { month: "long" });
        if (!acc[month]) acc[month] = [];
        acc[month].push(b);
        return acc;
    }, {});

    // Sort months in order from January to December
    const monthOrder = [
        "January", "February", "March", "April", "May", "June", "July", 
        "August", "September", "October", "November", "December"
    ];

    monthOrder.forEach(month => {
        if (grouped[month]) {
            const monthSection = document.createElement("div");
            monthSection.className = "month-section";
            monthSection.setAttribute("data-month", month);
            monthSection.innerHTML = `<h3>${month}</h3>`;

            const table = document.createElement("table");
            table.innerHTML = `<tr><th>Name</th><th>Date</th></tr>`;

            grouped[month].sort((a, b) => new Date(a.date) - new Date(b.date)).forEach(b => {
                table.innerHTML += `<tr><td>${b.name}</td><td>${new Date(b.date).toLocaleString("en-US", { day: "numeric", month: "short" })}</td></tr>`;
            });

            monthSection.appendChild(table);
            container.appendChild(monthSection);
        }
    });
}

// Populate Delete Dropdown
function populateDeleteDropdown() {
    const dropdown = document.getElementById("delete-dropdown");
    dropdown.innerHTML = "";
    birthdays.forEach(b => {
        const option = document.createElement("option");
        option.value = b.name;
        option.textContent = b.name;
        dropdown.appendChild(option);
    });
}

document.getElementById("delete-submit").addEventListener("click", () => {
    const selectedName = document.getElementById("delete-dropdown").value;
    if (selectedName) {
        birthdays = birthdays.filter(b => b.name !== selectedName);
        saveToLocalStorage();
        populateDeleteDropdown();
        alert("Birthday deleted successfully!");
    }
});

// Load birthdays on page load
loadFromLocalStorage();

// Populate Delete Dropdown on page load
window.onload = populateDeleteDropdown;
