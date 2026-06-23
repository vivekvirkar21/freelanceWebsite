document.addEventListener("DOMContentLoaded", () => {
    // Execute Initialization Layers
    initNavigation();
    initThemeEngine();
    initScrollPipeline();
    initPortfolioFiltering();
    initTestimonialSlider();
    initFormValidation();
    initScrollAnimations();
});

// ==========================================
// MOBILE NAVIGATION LOGIC
// ==========================================
function initNavigation() {
    const menuBtn = document.getElementById("menuBtn");
    const nav = document.getElementById("nav");
    const menuIcon = menuBtn?.querySelector("i");
    const navLinks = document.querySelectorAll("nav ul li a");

    menuBtn?.addEventListener("click", () => {
        nav.classList.toggle("active");
        if(nav.classList.contains("active")) {
            menuIcon.classList.replace("fa-bars", "fa-times");
        } else {
            menuIcon.classList.replace("fa-times", "fa-bars");
        }
    });

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("active");
            menuIcon?.classList.replace("fa-times", "fa-bars");
        });
    });
}

// ==========================================
// THEME PREFERENCE MANAGEMENT
// ==========================================
function initThemeEngine() {
    const themeBtn = document.getElementById("themeBtn");
    const themeIcon = themeBtn?.querySelector("i");

    function setTheme(mode) {
        if (mode === "dark") {
            document.body.classList.add("dark");
            themeIcon?.classList.replace("fa-moon", "fa-sun");
            localStorage.setItem("theme", "dark");
        } else {
            document.body.classList.remove("dark");
            themeIcon?.classList.replace("fa-sun", "fa-moon");
            localStorage.setItem("theme", "light");
        }
    }

    themeBtn?.addEventListener("click", () => {
        const isDark = document.body.classList.contains("dark");
        setTheme(isDark ? "light" : "dark");
    });

    if (localStorage.getItem("theme") === "dark") {
        setTheme("dark");
    }
}

// ==========================================
// SCROLL PERFORMANCE INDICATORS & TOP HANDLERS
// ==========================================
function initScrollPipeline() {
    const topBtn = document.getElementById("topBtn");
    const progressBar = document.getElementById("progressBar");

    window.addEventListener("scroll", () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0 && progressBar) {
            const progress = (window.scrollY / totalHeight) * 100;
            progressBar.style.width = `${progress}%`;
        }

        if (window.scrollY > 400) {
            topBtn?.classList.add("visible");
        } else {
            topBtn?.classList.remove("visible");
        }
    }, { passive: true });

    topBtn?.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

// ==========================================
// PORTFOLIO FILTERING (GSAP NATIVE TO PREVENT DEFECTS)
// ==========================================
function initPortfolioFiltering() {
    const filterBtns = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".portfolio-card");

    if(filterBtns.length === 0) return;

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filterTarget = btn.dataset.filter;

            if (typeof gsap !== 'undefined') {
                // Use GSAP to transition smoothly to avoid low opacity locks
                gsap.to(projectCards, {
                    opacity: 0,
                    scale: 0.95,
                    duration: 0.2,
                    onComplete: () => {
                        projectCards.forEach(card => {
                            if (filterTarget === "all" || card.classList.contains(filterTarget)) {
                                card.style.display = "block";
                            } else {
                                card.style.display = "none";
                            }
                        });
                        gsap.to(projectCards, {
                            opacity: 1,
                            scale: 1,
                            duration: 0.3,
                            clearProps: "transform" // Clear transform to let CSS hover animations work
                        });
                    }
                });
            } else {
                // Solid fallback if GSAP isn't online
                projectCards.forEach(card => {
                    if (filterTarget === "all" || card.classList.contains(filterTarget)) {
                        card.style.display = "block";
                        card.style.opacity = "1";
                    } else {
                        card.style.display = "none";
                    }
                });
            }
        });
    });
}

// ==========================================
// TESTIMONIAL VIEW CONTROL RUNTIMES
// ==========================================
function initTestimonialSlider() {
    let slideIndex = 0;
    const slides = document.querySelectorAll(".testimonial");
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");

    if(slides.length === 0) return;

    function renderSlide(targetIndex) {
        slides.forEach(slide => slide.classList.remove("active-slide"));
        slides[targetIndex].classList.add("active-slide");
    }

    nextBtn?.addEventListener("click", () => {
        slideIndex = (slideIndex + 1) % slides.length;
        renderSlide(slideIndex);
    });

    prevBtn?.addEventListener("click", () => {
        slideIndex = (slideIndex - 1 + slides.length) % slides.length;
        renderSlide(slideIndex);
    });
}

// ==========================================
// VALIDATION LOGIC & SYSTEM TOASTS
// ==========================================
function initFormValidation() {
    const form = document.getElementById("contactForm");
    if(!form) return;

    function emitToast(message, variant = "success") {
        const toast = document.createElement("div");
        toast.className = `toast ${variant}`;
        toast.innerText = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add("show"), 50);
        
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), 350);
        }, 3500);
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const inputs = {
            name: document.getElementById("name"),
            email: document.getElementById("email"),
            phone: document.getElementById("phone"),
            subject: document.getElementById("subject"),
            message: document.getElementById("message")
        };

        let isFormValid = true;

        Object.values(inputs).forEach(input => input?.classList.remove("input-error"));

        if (!inputs.name || inputs.name.value.trim().length < 3) {
            inputs.name?.classList.add("input-error");
            emitToast("Name parameter must exceed 2 characters.", "error");
            isFormValid = false;
        }

        if (!inputs.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputs.email.value)) {
            inputs.email?.classList.add("input-error");
            emitToast("Provide a valid operational email format.", "error");
            isFormValid = false;
        }

        if (!inputs.phone || !/^[0-9]{10}$/.test(inputs.phone.value.replace(/\s+/g, ""))) {
            inputs.phone?.classList.add("input-error");
            emitToast("Phone target requires exactly 10 digits.", "error");
            isFormValid = false;
        }

        if (!inputs.subject || inputs.subject.value.trim() === "") {
            inputs.subject?.classList.add("input-error");
            emitToast("Subject designation missing.", "error");
            isFormValid = false;
        }

        if (!inputs.message || inputs.message.value.trim().length < 15) {
            inputs.message?.classList.add("input-error");
            emitToast("Message content field must exceed 15 characters.", "error");
            isFormValid = false;
        }

        if (isFormValid) {
            emitToast("Data parameters validated. Message sent successfully!", "success");
            form.reset();
        }
    });
}

// ==========================================
// ANIMATION REVEALS & TIMING FIXES
// ==========================================
function initScrollAnimations() {
    // 1. Hero Dynamic Typewriter
    const typewriterElement = document.getElementById('typewriter');
    if (typewriterElement) {
        const structuralMatrix = ["Businesses", "Startups", "Agencies", "Creators"];
        let wordPointer = 0, charPointer = 0, deleteToggle = false;

        function runTypeEngine() {
            const currentString = structuralMatrix[wordPointer];
            const activeSubString = deleteToggle 
                ? currentString.substring(0, charPointer - 1) 
                : currentString.substring(0, charPointer + 1);

            typewriterElement.textContent = activeSubString;
            let dynamicInterval = deleteToggle ? 45 : 90;

            if (!deleteToggle && activeSubString === currentString) {
                dynamicInterval = 2000; 
                deleteToggle = true;
            } else if (deleteToggle && activeSubString === "") {
                deleteToggle = false;
                wordPointer = (wordPointer + 1) % structuralMatrix.length;
                dynamicInterval = 450; 
            } else {
                charPointer += deleteToggle ? -1 : 1;
            }
            setTimeout(runTypeEngine, dynamicInterval);
        }
        runTypeEngine();
    }

    // 2. Animated Counter Engine
    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
        const runCounterMechanics = () => {
            counters.forEach(counter => {
                const triggerUpdate = () => {
                    const maximumValue = +counter.getAttribute('data-target');
                    const ongoingMetric = +counter.innerText;
                    const incrementStep = maximumValue / 80;

                    if (ongoingMetric < maximumValue) {
                        counter.innerText = Math.ceil(ongoingMetric + incrementStep);
                        setTimeout(triggerUpdate, 20);
                    } else {
                        counter.innerText = maximumValue;
                    }
                };
                triggerUpdate();
            });
        };

        const statsContainer = document.querySelector('.stats');
        if (statsContainer) {
            const scrollIntersectionObserver = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    runCounterMechanics();
                    scrollIntersectionObserver.disconnect();
                }
            }, { threshold: 0.2 });
            scrollIntersectionObserver.observe(statsContainer);
        }
    }

    // 3. Skill Bars Native GSAP Sequence
    const skillContainer = document.querySelector('.skills');
    if (skillContainer) {
        const skillObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                document.querySelectorAll('.skill .bar span').forEach(bar => {
                    const targetWidth = bar.getAttribute('data-width') || "100%";
                    if (typeof gsap !== 'undefined') {
                        gsap.fromTo(bar, { width: "0%" }, { width: targetWidth, duration: 1.2, ease: "power2.out" });
                    } else {
                        bar.style.width = targetWidth;
                    }
                });
                skillObserver.disconnect();
            }
        }, { threshold: 0.1 });
        skillObserver.observe(skillContainer);
    }

    // 4. GSAP Structural View Sequence Orchestration (Fixed Opacity Lockouts)
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Hero Target Animation Intro
        gsap.from(".hero-text > *", {
            y: 25,
            opacity: 0,
            duration: 0.75,
            stagger: 0.15,
            ease: "power3.out"
        });

        gsap.from(".hero-image img", {
            scale: 0.95,
            opacity: 0,
            duration: 0.95,
            delay: 0.35,
            ease: "power2.out"
        });

        // Global Scroll Reveal Loop
        gsap.utils.toArray("section:not(.hero)").forEach(section => {
            const structuralElements = section.querySelectorAll(".section-title, .card, .cta-content, .about-image, .about-content, .timeline-item, .portfolio-card, .testimonial-slider");
            if (structuralElements.length === 0) return;

            gsap.from(structuralElements, {
                scrollTrigger: {
                    trigger: section,
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                y: 30,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out",
                clearProps: "opacity,transform" // CRITICAL FIX: Releases controls to prevent low opacity/stuck defects
            });
        });
    }
}