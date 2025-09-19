// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Mobile Navigation Toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link and update active state
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Remove active class from all links
        navLinks.forEach(l => l.classList.remove('active'));
        // Add active class to clicked link
        link.classList.add('active');
        
        // Close mobile menu
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Enhanced Navbar scroll effects and progress indicator
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.getElementById('scroll-progress');
    const scrolled = window.scrollY > 50;
    
    // Navbar background
    if (scrolled) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Progress indicator
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled_percentage = (winScroll / height) * 100;
    scrollProgress.style.width = scrolled_percentage + '%';
});

// Enhanced scroll animations for stats
function animateStats(container = null) {
    // If container is provided, only animate stats within that container
    const selector = container ? container.querySelectorAll('.stat-number') : document.querySelectorAll('.stat-number');
    
    selector.forEach(stat => {
        // Skip if already animated
        if (stat.classList.contains('animated')) return;
        stat.classList.add('animated');
        
        // Check if it has data-target attribute (Why Suchakra section)
        if (stat.hasAttribute('data-target')) {
            const target = parseInt(stat.getAttribute('data-target'));
            const increment = target / 80;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current);
            }, 25);
            return;
        }
        
        // Handle stats bar numbers (static text)
        const originalText = stat.textContent;
        
        // Skip animation for non-numeric stats
        if (originalText === 'Certified' || originalText === '24/7') return;
        
        // Extract numeric value and suffix
        let target, suffix = '';
        if (originalText.includes('+')) {
            target = parseInt(originalText.replace('+', ''));
            suffix = '+';
        } else if (originalText.includes('/') && !originalText.includes('24/7')) {
            target = parseFloat(originalText.split('/')[0]);
            suffix = '/5';
        } else {
            target = parseInt(originalText);
        }
        
        const increment = target / 80; // Slower animation
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (suffix === '/5') {
                stat.textContent = current.toFixed(1) + suffix;
            } else {
                stat.textContent = Math.floor(current) + suffix;
            }
        }, 25);
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('stat-item')) {
                // Find the stats container and animate only those stats
                const statsContainer = entry.target.closest('.stats');
                if (statsContainer) {
                    animateStats(statsContainer);
                }
            }
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animations
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.stat-item, .service-card, .testimonial-card, .partner-logo');
    animatedElements.forEach(el => observer.observe(el));
});

// Stats bar animation handler
document.addEventListener('DOMContentLoaded', () => {
    // Stats bar scroll animation
    const statsCards = document.querySelectorAll('.stat-card');
    const statsBarObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                // Animate stats bar numbers
                const statNumber = entry.target.querySelector('.stat-number');
                if (statNumber && !statNumber.classList.contains('animated')) {
                    animateStats(entry.target);
                }
            }
        });
    }, { threshold: 0.3 });

    statsCards.forEach(card => {
        statsBarObserver.observe(card);
    });
});

// Form handling
const contactForm = document.querySelector('.contact-form .form');
const newsletterForm = document.querySelector('.newsletter-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Show success message
        showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
        
        // Reset form
        contactForm.reset();
    });
}

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = newsletterForm.querySelector('.newsletter-input').value;
        
        if (email) {
            showNotification('Thank you for subscribing to our newsletter!', 'success');
            newsletterForm.reset();
        }
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 4px;
        transition: background-color 0.2s;
    }
    
    .notification-close:hover {
        background: rgba(255, 255, 255, 0.2);
    }
`;
document.head.appendChild(notificationStyles);

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroElements = document.querySelectorAll('.floating-element');
    
    if (hero) {
        heroElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }
});

// Button hover effects
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
        });
    });
});

// Service card hover effects
document.addEventListener('DOMContentLoaded', () => {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Animate hero elements
    const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-buttons, .hero-image');
    heroElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// Add loading styles
const loadingStyles = document.createElement('style');
loadingStyles.textContent = `
    .hero-title, .hero-subtitle, .hero-buttons, .hero-image {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .loaded .hero-title, .loaded .hero-subtitle, .loaded .hero-buttons, .loaded .hero-image {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(loadingStyles);

// Scroll to top functionality removed - using chatbot instead

// Add CSS variables to root for scroll to top button
document.documentElement.style.setProperty('--primary-color', '#0ea5e9');
document.documentElement.style.setProperty('--primary-dark', '#0284c7');

// Chatbot functionality
let chatbotResponses = {
    "what services do you offer?": "We offer comprehensive healthcare services including:\n• Physiotherapy & Rehabilitation\n• Aged Care Support\n• Mental Health & Disability Support\n• Dental Care\n• Home Care Services\n• 24/7 Medical Support\n\nWould you like to know more about any specific service?",
    
    "how do i book an appointment?": "Booking an appointment is easy! You can:\n\n📞 Call us at +64 210 702 266\n📧 Email us at info@suchakrahealthcare.com\n🌐 Use our online booking system\n🏥 Visit us at 99B Westchester Drive, Churton Park, Wellington\n\nOur team will help you schedule with the right specialist for your needs.",
    
    "what are your operating hours?": "Our operating hours are:\n\n🕐 Monday - Friday: 8:00 AM – 8:00 PM\n🕘 Saturday: 9:00 AM – 7:00 PM\n🕘 Sunday: 9:00 AM – 9:00 PM\n\n⚡ Emergency support available 24/7\n\nIs there a specific time you'd prefer for your appointment?",
    
    "how can i contact you?": "You can reach us through multiple channels:\n\n📞 Phone: +64 210 702 266\n📧 Email: info@suchakrahealthcare.com\n📍 Address: 99B Westchester Drive, Churton Park, Wellington 6037\n💬 Live Chat: Right here!\n\nWe typically respond within 15 minutes during business hours.",
    
    "what is physiotherapy?": "Physiotherapy helps restore movement and function when someone is affected by injury, illness or disability. Our services include:\n\n• Pain management\n• Injury rehabilitation\n• Movement improvement\n• Strength building\n• Post-surgery recovery\n\nOur certified physiotherapists create personalized treatment plans for optimal recovery.",
    
    "do you accept insurance?": "Yes, we work with most major insurance providers including:\n\n• ACC (for injury-related treatments)\n• Southern Cross Health Society\n• NIB Health Insurance\n• Most private health insurers\n\nPlease bring your insurance details when booking. We can help verify your coverage beforehand.",
    
    "what is aged care?": "Our aged care services provide compassionate support for elderly patients including:\n\n• Personal care assistance\n• Medication management\n• Social companionship\n• Meal preparation\n• Transportation services\n• Health monitoring\n\nWe focus on maintaining dignity and independence while ensuring safety and wellbeing.",
    
    "emergency": "🚨 For medical emergencies, please call 111 immediately.\n\nFor urgent but non-emergency healthcare needs:\n📞 Call us at +64 210 702 266\n\nOur 24/7 support team can provide guidance and arrange immediate care when needed.",
    
    "mental health": "We provide comprehensive mental health support including:\n\n• Individual counseling\n• Group therapy sessions\n• Crisis intervention\n• Disability support services\n• Wellness programs\n• Family support\n\nOur qualified mental health professionals are here to help you on your journey to wellness."
};

function initializeChatbot() {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotTyping = document.getElementById('chatbot-typing');
    const chatbotBadge = document.getElementById('chatbot-badge');
    const suggestionBtns = document.querySelectorAll('.suggestion-btn');

    // Check if all elements exist
    if (!chatbotToggle || !chatbotWindow) {
        console.error('Chatbot elements not found');
        return;
    }

    // Mark as initialized
    chatbotToggle.setAttribute('data-initialized', 'true');
    console.log('Chatbot elements found and initialized');

    let isOpen = false;

    // Toggle chatbot window
    chatbotToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Chatbot toggle clicked');
        isOpen = !isOpen;
        if (isOpen) {
            chatbotWindow.classList.add('active');
            if (chatbotBadge) chatbotBadge.style.display = 'none';
            
            // Mobile-specific opening behavior
            if (isMobile) {
                // Prevent body scroll when chatbot is open on mobile
                document.body.style.overflow = 'hidden';
                originalViewportHeight = window.innerHeight;
                
                // Focus input with delay on mobile to avoid keyboard issues
                setTimeout(() => {
                    if (chatbotInput) {
                        chatbotInput.focus();
                        chatbotInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 300);
            } else {
                // Desktop behavior
                if (chatbotInput) chatbotInput.focus();
            }
            console.log('Chatbot opened');
        } else {
            chatbotWindow.classList.remove('active');
            chatbotWindow.classList.remove('keyboard-open');
            
            // Restore body scroll on mobile
            if (isMobile) {
                document.body.style.overflow = '';
                keyboardOpen = false;
            }
            console.log('Chatbot closed');
        }
    });

    // Close chatbot
    chatbotClose.addEventListener('click', () => {
        isOpen = false;
        chatbotWindow.classList.remove('active');
        chatbotWindow.classList.remove('keyboard-open');
        
        // Restore body scroll and reset mobile state
        if (isMobile) {
            document.body.style.overflow = '';
            keyboardOpen = false;
        }
    });

    // Send message function
    function sendMessage(message) {
        if (!message.trim()) return;

        // Add user message
        addMessage(message, 'user');
        chatbotInput.value = '';

        // Show typing indicator
        showTyping();

        // Simulate bot response delay
        setTimeout(() => {
            hideTyping();
            const response = getBotResponse(message.toLowerCase());
            addMessage(response, 'bot');
        }, 1000 + Math.random() * 1000);
    }

    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const now = new Date();
        const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-${sender === 'bot' ? 'robot' : 'user'}"></i>
            </div>
            <div class="message-content">
                <p>${text.replace(/\n/g, '<br>')}</p>
                <span class="message-time">${timeString}</span>
            </div>
        `;

        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Get bot response
    function getBotResponse(message) {
        // Check for exact matches first
        for (let key in chatbotResponses) {
            if (message.includes(key)) {
                return chatbotResponses[key];
            }
        }

        // Check for keywords
        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return "Hello! Welcome to Suchakra Healthcare. I'm here to help you with any questions about our services, appointments, or general healthcare information. How can I assist you today?";
        }
        
        if (message.includes('thank') || message.includes('thanks')) {
            return "You're very welcome! Is there anything else I can help you with today? I'm here to assist with any questions about our healthcare services.";
        }

        if (message.includes('price') || message.includes('cost') || message.includes('fee')) {
            return "Our pricing varies depending on the service and your insurance coverage. For accurate pricing information, please:\n\n📞 Call us at +64 210 702 266\n📧 Email info@suchakrahealthcare.com\n\nWe'll provide a detailed quote based on your specific needs and insurance coverage.";
        }

        if (message.includes('location') || message.includes('address') || message.includes('where')) {
            return "📍 We're located at:\n99B Westchester Drive\nChurton Park, Wellington 6037\n\n🚗 Free parking available\n🚌 Public transport accessible\n\nWould you like directions or information about accessibility features?";
        }

        if (message.includes('doctor') || message.includes('specialist')) {
            return "We have a team of qualified specialists including:\n\n👨‍⚕️ General Practitioners\n🦴 Physiotherapists\n🧠 Mental Health Counselors\n🦷 Dental Professionals\n👴 Aged Care Specialists\n\nWould you like to know more about any specific specialist or book a consultation?";
        }

        // Default response
        return "I understand you're looking for information, but I'm not sure how to help with that specific question. Here are some things I can assist you with:\n\n• Our healthcare services\n• Booking appointments\n• Operating hours\n• Contact information\n• Insurance coverage\n\nYou can also call us directly at +64 210 702 266 for immediate assistance!";
    }

    // Show typing indicator
    function showTyping() {
        chatbotTyping.style.display = 'flex';
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Hide typing indicator
    function hideTyping() {
        chatbotTyping.style.display = 'none';
    }

    // Send button click
    chatbotSend.addEventListener('click', () => {
        sendMessage(chatbotInput.value);
    });

    // Enter key press with mobile optimization
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent form submission
            sendMessage(chatbotInput.value);
            
            // On mobile, briefly blur then refocus to prevent keyboard jumping
            if (isMobile) {
                chatbotInput.blur();
                setTimeout(() => {
                    chatbotInput.focus();
                }, 100);
            }
        }
    });
    
    // Mobile-specific touch optimizations
    if (isMobile) {
        // Prevent zoom on double tap for input
        chatbotInput.addEventListener('touchend', (e) => {
            e.preventDefault();
            chatbotInput.focus();
        });
        
        // Handle input focus for mobile keyboard
        chatbotInput.addEventListener('focus', () => {
            if (isOpen) {
                setTimeout(() => {
                    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                }, 300);
            }
        });
        
        // Improve touch scrolling for messages
        chatbotMessages.style.webkitOverflowScrolling = 'touch';
        
        // Close chatbot when clicking outside on mobile
        document.addEventListener('touchstart', (e) => {
            if (isOpen && !chatbotWindow.contains(e.target) && !chatbotToggle.contains(e.target)) {
                isOpen = false;
                chatbotWindow.classList.remove('active');
                chatbotWindow.classList.remove('keyboard-open');
                document.body.style.overflow = '';
                keyboardOpen = false;
            }
        });
    }

    // Suggestion buttons
    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const message = btn.getAttribute('data-message');
            sendMessage(message);
        });
    });

    // Auto-hide badge after some time
    setTimeout(() => {
        if (chatbotBadge) {
            chatbotBadge.style.display = 'none';
        }
    }, 10000);

    // Test click functionality
    console.log('Chatbot toggle element:', chatbotToggle);
    console.log('Chatbot window element:', chatbotWindow);
    
    // Add a visual indicator that chatbot is ready
    if (chatbotToggle) {
        chatbotToggle.title = 'Chat with Suchakra Assistant';
        chatbotToggle.style.cursor = 'pointer';
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing chatbot...');
    initializeChatbot();
});

// Also initialize on window load as backup
window.addEventListener('load', function() {
    if (!document.getElementById('chatbot-toggle').hasAttribute('data-initialized')) {
        console.log('Backup chatbot initialization...');
        initializeChatbot();
    }
});
