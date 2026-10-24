
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Display the feedback form
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Handle form submission and validate data on the server
app.post("/submit", (req, res) => {
    const { name, email, subject, rating, feedback } = req.body;
    const errors = [];

    if (typeof name !== "string" || !name.trim()) {
        errors.push("Student name is required.");
    } else if (name.trim().length > 50) {
        errors.push("Name must be 50 characters or fewer.");
    }

    if (
        typeof email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
        errors.push("Please enter a valid email address.");
    }

    if (typeof subject !== "string" || !subject.trim()) {
        errors.push("Subject is required.");
    }

    if (!["1", "2", "3", "4", "5"].includes(rating)) {
        errors.push("Please select a valid rating.");
    }

    if (typeof feedback !== "string" || !feedback.trim()) {
        errors.push("Feedback is required.");
    } else if (feedback.trim().length > 500) {
        errors.push("Feedback must be 500 characters or fewer.");
    }

    // Display validation errors
    if (errors.length > 0) {
        const errorList = errors
            .map(error => `<li>${escapeHtml(error)}</li>`)
            .join("");

        return res.status(400).send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>Validation Errors</title>
                <link rel="stylesheet" href="/style.css">
            </head>
            <body>
                <main class="message-card error-card">
                    <div class="message-icon">!</div>
                    <h1>Please correct the errors</h1>
                    <p>Your feedback was not submitted.</p>
                    <ul class="error-list">${errorList}</ul>
                    <a class="button" href="/">Return to Form</a>
                </main>
            </body>
            </html>
        `);
    }

    // Display success message
    res.status(200).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Feedback Submitted</title>
            <link rel="stylesheet" href="/style.css">
        </head>
        <body>
            <main class="message-card success-card">
                <div class="message-icon">✓</div>
                <h1>Feedback Submitted!</h1>
                <p>Thank you, ${escapeHtml(name.trim())}.</p>
                <p>Your feedback has been received successfully.</p>
                <p><strong>Subject:</strong> ${escapeHtml(subject.trim())}</p>
                <p><strong>Rating:</strong> ${rating}/5</p>
                <a class="button" href="/">Submit Another Response</a>
            </main>
        </body>
        </html>
    `);
});

// Escape user input before displaying it in HTML
function escapeHtml(value) {
    return value.replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

// Handle unknown routes
app.use((req, res) => {
    res.status(404).send("404 - Page not found. <a href='/'>Go Home</a>");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
