document.addEventListener('DOMContentLoaded', function () {
    let formSubmissions = [];
    const whatsappNumber = '9552558083'; // ✅ Configurable WhatsApp number

    // Only run export-related code on index page
    const isIndexPage = window.location.pathname.endsWith('index.html') || 
                       window.location.pathname.endsWith('/') || 
                       window.location.pathname === '';

    // ========== DATA MANAGEMENT FUNCTIONS ==========
    function loadFormData() {
        const savedData = localStorage.getItem('formSubmissions');
        if (savedData) {
            formSubmissions = JSON.parse(savedData);
        }
        updateCounter();
    }

    function saveFormData(formData) {
        formData.timestamp = new Date().toISOString();
        formSubmissions.push(formData);
        localStorage.setItem('formSubmissions', JSON.stringify(formSubmissions));
        updateCounter();
        return true;
    }

    function updateCounter() {
        const counter = document.getElementById('dataCount');
        if (counter) {
            counter.textContent = `${formSubmissions.length} submission${formSubmissions.length !== 1 ? 's' : ''}`;
            // Hide counter on non-index pages
            if (!isIndexPage) counter.style.display = 'none';
        }
    }

    // ========== NAVBAR FUNCTIONALITY ==========
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links li');

    if (burger && navLinks) {
        burger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            burger.classList.toggle('active');
        });

        navLinksItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                burger.classList.remove('active');
            });
        });
    }

    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 0);
    });

    // ========== BOOKING MODAL FUNCTIONALITY ==========
    const modal = document.getElementById('bookingModal');
    const bookBtns = document.querySelectorAll('.book-btn');
    const closeBtn = document.querySelector('.close-btn');

    if (modal) {
        bookBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            });
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // ========== FORM HANDLERS ==========
    // Booking form submission
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = {
                name: document.getElementById('name').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                event: document.getElementById('event').value,
                eventName: document.querySelector(`#event option[value="${document.getElementById('event').value}"]`).textContent,
                tickets: document.getElementById('tickets').value,
                paymentStatus: 'Pending Verification',
                type: 'Event Registration'
            };

            if (!formData.name || !formData.phone || !formData.event || formData.tickets < 1) {
                alert('Please fill all required fields correctly.');
                return;
            }

            if (!saveFormData(formData)) return;

            const message = `Hello, I would like to register for the ${formData.eventName}.\n\nName: ${formData.name} \nPhone: ${formData.phone}\nTickets: ${formData.tickets}\n\nI have made the payment via QR code.`;
            const encodedMessage = encodeURIComponent(message);

            window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');

            if (modal) modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            bookingForm.reset();
        });
    }

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = {
                name: document.getElementById('contactName').value.trim(),
                phone: document.getElementById('contactPhone').value.trim(),
                subject: document.getElementById('contactSubject').value.trim(),
                message: document.getElementById('contactMessage').value.trim(),
                type: 'Contact Form'
            };

            if (!formData.name || !formData.phone || !formData.subject || !formData.message) {
                alert('Please complete all required fields.');
                return;
            }

            if (!saveFormData(formData)) return;

            const message = `New contact message:\n\nName: ${formData.name}\nPhone: ${formData.phone}\nSubject: ${formData.subject}\nMessage: ${formData.message}`;
            const encodedMessage = encodeURIComponent(message);

            window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');

            alert(`Thank you, ${formData.name}! Your message has been sent via WhatsApp.`);
            contactForm.reset();
        });
    }

    // ========== EXPORT FUNCTIONALITY (INDEX PAGE ONLY) ==========
    if (isIndexPage) {
        const exportBtn = document.getElementById("exportBtn");
        const passwordModal = document.getElementById("passwordModal");
        const passwordForm = document.getElementById("passwordForm");
        const adminPasswordInput = document.getElementById("adminPassword");
        const passwordError = document.getElementById("passwordError");
        const closeBtns = document.querySelectorAll(".close-btn");
        const correctPassword = "admin123"; // Set your password

        function getSavedSubmissions() {
            const saved = localStorage.getItem('formSubmissions');
            if (!saved) return [];

            return JSON.parse(saved).map(item => {
                return {
                    Name: item.name || '',
                    Phone: item.phone || '',
                    Event: item.eventName || item.event || '',
                    Tickets: item.tickets || '',
                    Type: item.type || '',
                    Date: item.timestamp ? new Date(item.timestamp).toLocaleDateString() : ''
                };
            });
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

        if (exportBtn) {
            exportBtn.addEventListener("click", () => {
                passwordModal.style.display = "block";
            });
        }

        if (closeBtns) {
            closeBtns.forEach(btn => {
                btn.addEventListener("click", () => {
                    if (passwordModal) passwordModal.style.display = "none";
                    if (passwordError) passwordError.style.display = "none";
                    if (adminPasswordInput) adminPasswordInput.value = "";
                });
            });
        }

        if (passwordForm) {
            passwordForm.addEventListener("submit", function (e) {
                e.preventDefault();
                const enteredPassword = adminPasswordInput.value;

                if (enteredPassword === correctPassword) {
                    passwordModal.style.display = "none";
                    passwordError.style.display = "none";
                    adminPasswordInput.value = "";
                    exportToExcel();
                } else {
                    passwordError.style.display = "block";
                }
            });
        }
    } else {
        // Hide export elements on non-index pages
        const exportBtn = document.getElementById("exportBtn");
        const dataCount = document.getElementById("dataCount");
        if (exportBtn) exportBtn.style.display = "none";
        if (dataCount) dataCount.style.display = "none";
    }

    // ========== INITIALIZATION ==========
    loadFormData();

    // Smooth scrolling for anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});