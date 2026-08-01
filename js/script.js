/* ==========================================================
   William Afoakwa — Portfolio Script
   Handles: dark/light (black & white) theme toggle, navbar
   scroll effect, mobile nav auto-close, active link highlight,
   portfolio filtering, skill bar animation, contact form,
   and back-to-top button.
   ========================================================== */

document.addEventListener('DOMContentLoaded', function () {

    /* ----------------------------------------------------
       1. THEME TOGGLE (Black & White theme)
       ---------------------------------------------------- */
    const themeBtn = document.getElementById('themeBtn');
    const htmlEl = document.documentElement;
    const bodyEl = document.body;
    const THEME_KEY = 'portfolio-theme';

    function applyTheme(theme) {
        if (theme === 'dark') {
            htmlEl.classList.add('dark-mode');
            bodyEl.classList.add('dark-mode');
            if (themeBtn) {
                themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
                themeBtn.setAttribute('title', 'Toggle Light Mode');
            }
        } else {
            htmlEl.classList.remove('dark-mode');
            bodyEl.classList.remove('dark-mode');
            if (themeBtn) {
                themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
                themeBtn.setAttribute('title', 'Toggle Dark Mode');
            }
        }
    }

    // Load saved preference, otherwise respect system preference
    let savedTheme = null;
    try {
        savedTheme = localStorage.getItem(THEME_KEY);
    } catch (e) {
        savedTheme = null;
    }

    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        applyTheme('dark');
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', function () {
            const isDark = bodyEl.classList.contains('dark-mode');
            const nextTheme = isDark ? 'light' : 'dark';
            applyTheme(nextTheme);
            try {
                localStorage.setItem(THEME_KEY, nextTheme);
            } catch (e) { /* ignore storage errors */ }
        });
    }

    /* ----------------------------------------------------
       2. NAVBAR SCROLL EFFECT
       ---------------------------------------------------- */
    const navbar = document.getElementById('navbar');
    function handleNavbarScroll() {
        if (!navbar) return;
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll();

    /* ----------------------------------------------------
       3. ACTIVE NAV LINK (multi-page) + MOBILE MENU CLOSE
       ---------------------------------------------------- */
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.getElementById('navbarNav');

    function setActiveLinkByPage() {
        let currentPage = window.location.pathname.split('/').pop();
        if (currentPage === '') currentPage = 'index.html';

        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href');
            link.classList.toggle('active', linkPage === currentPage);
        });
    }
    setActiveLinkByPage();

    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });

    /* ----------------------------------------------------
       4. PORTFOLIO / PROJECT FILTERING
       ---------------------------------------------------- */
    const filterButtons = document.querySelectorAll('.btn-filter');
    const projectItems = document.querySelectorAll('.project-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            projectItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    item.classList.remove('hidden');
                    item.style.display = '';
                } else {
                    item.classList.add('hidden');
                    item.style.display = 'none';
                }
            });
        });
    });

    /* ----------------------------------------------------
       5. ANIMATE SKILL BARS WHEN THEY SCROLL INTO VIEW
       ---------------------------------------------------- */
    const progressBars = document.querySelectorAll('.progress-bar');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const targetWidth = bar.style.width;
                bar.style.width = '0%';
                requestAnimationFrame(() => {
                    bar.style.transition = 'width 1.2s ease';
                    bar.style.width = targetWidth;
                });
                skillObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.4 });

    progressBars.forEach(bar => skillObserver.observe(bar));

    /* ----------------------------------------------------
       6. FADE-IN ANIMATION FOR CARDS ON SCROLL
       ---------------------------------------------------- */
    const animatedItems = document.querySelectorAll(
        '.highlight-card, .service-card, .project-card, .timeline-item, .contact-card, .soft-skill-card'
    );
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    animatedItems.forEach(item => fadeObserver.observe(item));

    /* ----------------------------------------------------
       7. CONTACT FORM SUBMISSION (client-side handling)
       ---------------------------------------------------- */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !subject || !message) {
                showFormAlert('Please fill in all fields.', 'danger');
                return;
            }

            // Build a mailto link as a lightweight fallback since there's no backend.
            const mailBody = encodeURIComponent(
                `Name: ${name}\nEmail: ${email}\n\n${message}`
            );
            const mailtoLink = `mailto:williamankapong@gmail.com?subject=${encodeURIComponent(subject)}&body=${mailBody}`;

            window.location.href = mailtoLink;
            showFormAlert('Opening your email client to send the message...', 'success');
            contactForm.reset();
        });
    }

    function showFormAlert(message, type) {
        const existingAlert = document.querySelector('.form-alert');
        if (existingAlert) existingAlert.remove();

        const alert = document.createElement('div');
        alert.className = `alert alert-${type} form-alert mt-3`;
        alert.textContent = message;
        contactForm.appendChild(alert);

        setTimeout(() => alert.remove(), 5000);
    }

    /* ----------------------------------------------------
       8. BACK TO TOP BUTTON
       ---------------------------------------------------- */
    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

});
