document.addEventListener('DOMContentLoaded', function () {
    let formSubmissions = [];
    const whatsappNumber = '9552558083'; // Configurable WhatsApp number

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

    // ========== SMOOTH SCROLLING ==========
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

    // ========== INITIALIZATION ==========
    loadFormData();
});