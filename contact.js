document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    
    if (!contactForm) return; // Exit if contact form doesn't exist on this page

    // Form validation rules
    const validationRules = {
        fullName: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-Z\s]+$/,
            errorMessage: 'Please enter a valid full name (letters and spaces only)'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            errorMessage: 'Please enter a valid email address'
        },
        subject: {
            required: true,
            minLength: 3,
            errorMessage: 'Subject must be at least 3 characters long'
        },
        message: {
            required: true,
            minLength: 10,
            errorMessage: 'Message must be at least 10 characters long'
        }
    };

    // Real-time validation
    contactForm.addEventListener('input', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            validateField(e.target);
        }
    });

    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // Simulate form submission
            const formData = new FormData(contactForm);
            const formObject = Object.fromEntries(formData);
            
            console.log('Form submitted:', formObject);
            
            // Show success message
            successMessage.hidden = false;
            contactForm.reset();
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.hidden = true;
            }, 5000);
        }
    });

    function validateForm() {
        const fields = contactForm.querySelectorAll('input, textarea');
        let isValid = true;

        fields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    function validateField(field) {
        const fieldName = field.name;
        const value = field.value.trim();
        const rules = validationRules[fieldName];
        
        if (!rules) return true; // Skip validation if no rules defined

        // Get the correct error element ID based on field name
        let errorElementId;
        switch(fieldName) {
            case 'fullName':
                errorElementId = 'nameError';
                break;
            case 'email':
                errorElementId = 'emailError';
                break;
            case 'subject':
                errorElementId = 'subjectError';
                break;
            case 'message':
                errorElementId = 'messageError';
                break;
            default:
                return true; // Skip unknown fields
        }

        const errorElement = document.getElementById(errorElementId);

        // Clear previous error
        if (errorElement) {
            errorElement.textContent = '';
        }
        field.setCustomValidity('');

        // Check required field
        if (rules.required && !value) {
            showError(field, errorElement, 'This field is required');
            return false;
        }

        // Check min length
        if (rules.minLength && value.length < rules.minLength) {
            showError(field, errorElement, rules.errorMessage);
            return false;
        }

        // Check pattern
        if (rules.pattern && !rules.pattern.test(value)) {
            showError(field, errorElement, rules.errorMessage);
            return false;
        }

        // Valid field
        field.style.borderColor = '#27ae60';
        return true;
    }

    function showError(field, errorElement, message) {
        if (errorElement) {
            errorElement.textContent = message;
        }
        field.style.borderColor = '#e74c3c';
        field.setCustomValidity(message);
        
        // Add ARIA attributes for accessibility
        field.setAttribute('aria-invalid', 'true');
        if (errorElement) {
            field.setAttribute('aria-describedby', errorElement.id);
        }
    }

    function clearError(field) {
        const fieldName = field.name;
        let errorElementId;
        
        switch(fieldName) {
            case 'fullName':
                errorElementId = 'nameError';
                break;
            case 'email':
                errorElementId = 'emailError';
                break;
            case 'subject':
                errorElementId = 'subjectError';
                break;
            case 'message':
                errorElementId = 'messageError';
                break;
            default:
                return;
        }

        const errorElement = document.getElementById(errorElementId);
        if (errorElement) {
            errorElement.textContent = '';
        }
        
        field.style.borderColor = '#bdc3c7';
        field.setCustomValidity('');
        field.removeAttribute('aria-invalid');
    }

    // Enhanced keyboard navigation
    contactForm.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && !e.target.type === 'submit') {
            e.preventDefault();
            const formElements = Array.from(contactForm.elements);
            const currentIndex = formElements.indexOf(e.target);
            const nextElement = formElements[currentIndex + 1];
            
            if (nextElement) {
                nextElement.focus();
            }
        }
    });

    // Add ARIA live regions for screen readers
    const fields = contactForm.querySelectorAll('input, textarea');
    fields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        field.addEventListener('focus', function() {
            clearError(this);
        });
    });

    // Initialize form state
    function initializeForm() {
        // Clear any existing errors
        const errorElements = contactForm.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
        });

        // Reset field styles
        const fields = contactForm.querySelectorAll('input, textarea');
        fields.forEach(field => {
            field.style.borderColor = '#bdc3c7';
            field.setCustomValidity('');
        });

        // Ensure success message is hidden
        if (successMessage) {
            successMessage.hidden = true;
        }
    }

    // Initialize the form when page loads
    initializeForm();
});