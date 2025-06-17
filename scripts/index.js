document.addEventListener("DOMContentLoaded", function() {
    // Export functionality only
    const exportBtn = document.getElementById("exportBtn");
    const passwordModal = document.getElementById("passwordModal");
    const passwordForm = document.getElementById("passwordForm");
    const adminPasswordInput = document.getElementById("adminPassword");
    const passwordError = document.getElementById("passwordError");
    const closeBtns = document.querySelectorAll(".close-btn");
    const correctPassword = "admin123";

    function getSavedSubmissions() {
        const saved = localStorage.getItem('formSubmissions');
        if (!saved) return [];
        return JSON.parse(saved).map(item => ({
            Name: item.name || '',
            Phone: item.phone || '',
            Event: item.eventName || item.event || '',
            Tickets: item.tickets || '',
            Type: item.type || '',
            Date: item.timestamp ? new Date(item.timestamp).toLocaleDateString() : ''
        }));
    }

    function exportToExcel() {
        const submissions = getSavedSubmissions();
        if (submissions.length === 0) {
            alert('No submissions to export.');
            return;
        }
        const worksheet = XLSX.utils.json_to_sheet(submissions);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
        const fileName = `BeautyDayToDay_Registrations_${new Date().toISOString().slice(0, 10)}.xlsx`;
        XLSX.writeFile(workbook, fileName);
    }

    if (exportBtn) exportBtn.addEventListener("click", () => {
        passwordModal.style.display = "block";
    });

    closeBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            passwordModal.style.display = "none";
            passwordError.style.display = "none";
            adminPasswordInput.value = "";
        });
    });

    if (passwordForm) passwordForm.addEventListener("submit", function(e) {
        e.preventDefault();
        if (adminPasswordInput.value === correctPassword) {
            passwordModal.style.display = "none";
            passwordError.style.display = "none";
            adminPasswordInput.value = "";
            exportToExcel();
        } else {
            passwordError.style.display = "block";
        }
    });
});