
const feedback = document.getElementById("feedback");
const charCount = document.getElementById("charCount");

if (feedback && charCount) {
    feedback.addEventListener("input", () => {
        charCount.textContent = `${feedback.value.length}/500 characters`;
    });
}
