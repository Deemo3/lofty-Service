document.addEventListener('DOMContentLoaded', () => {
    // Main sections
    const loginSection = document.getElementById('loginSection');
    const registerSection = document.getElementById('registerSection');

    // Top switch buttons
    const showLoginBtn = document.getElementById('showLoginBtn');
    const showRegisterBtn = document.getElementById('showRegisterBtn');

    // Links to switch between pages
    const createAccountLink = document.getElementById('createAccountLink'); // From login page to register
    const showLoginFromSidebar = document.getElementById('showLoginFromSidebar'); // From sidebar to login page

    // Forms
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Multi-step registration elements
    const mainSidebar = document.getElementById('mainSidebar'); // The sidebar container
    const loginSidebarContent = document.getElementById('loginSidebarContent'); // Login sidebar content
    const registrationSidebarContent = document.getElementById('registrationSidebarContent'); // Registration sidebar content

    const registerSteps = registerSection.querySelectorAll('.register-step');
    const nextStepBtns = registerSection.querySelectorAll('.next-step-btn');
    const prevStepBtns = registerSection.querySelectorAll('.prev-step-btn');
    const stepsIndicatorItems = document.querySelectorAll('.steps-indicator .step-item');
    const progressBar = document.querySelector('.progress-bar');

    let currentRegisterStep = 0; 

    // functions to switch between Login/Register 
    function showAuthSection(sectionToShow) {
        loginSection.classList.remove('active');
        registerSection.classList.remove('active');

        // Deactivate switch buttons
        showLoginBtn.classList.remove('active');
        showRegisterBtn.classList.remove('active');

        // Hide both sidebar contents initially
        loginSidebarContent.style.display = 'none';
        registrationSidebarContent.style.display = 'none';

        if (sectionToShow === 'login') {
            loginSection.classList.add('active');
            showLoginBtn.classList.add('active');
            loginSidebarContent.style.display = 'flex'; 
            showRegisterStep(0);
        } else if (sectionToShow === 'register') {
            registerSection.classList.add('active');
            showRegisterBtn.classList.add('active');
            registrationSidebarContent.style.display = 'flex'; 
            showRegisterStep(currentRegisterStep);
        }
    }

    // Functions specific to registration steps
    function showRegisterStep(stepIndex) {
        if (stepIndex < 0) stepIndex = 0;
        if (stepIndex >= registerSteps.length) stepIndex = registerSteps.length - 1;

        registerSteps.forEach((step, index) => {
            step.classList.toggle('active', index === stepIndex);
        });
        stepsIndicatorItems.forEach((item, index) => {
            item.classList.toggle('active', index === stepIndex);
        });

        currentRegisterStep = stepIndex;
        updateProgressBar();
        updateSummary(); 
    }

    function updateProgressBar() {
        const progress = ((currentRegisterStep + 1) / registerSteps.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    function updateSummary() {
        if (currentRegisterStep === 2) {
            const emailInput = document.getElementById('regEmail');
            let username = 'Guest';
            if (emailInput && emailInput.value) {
                // Get the username part before @
                username = emailInput.value.split('@')[0];
                username = username.charAt(0).toUpperCase() + username.slice(1);
            }
            const welcomeMessageElement = document.querySelector('.welcome-message');
            if (welcomeMessageElement) {
                welcomeMessageElement.textContent = `Welcome ${username} to Lofty Services`;
            }
        }
    }

    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', () => {
            const passwordInput = toggle.previousElementSibling;
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            // Toggle eye icon
            toggle.querySelector('i').classList.toggle('fa-eye');
            toggle.querySelector('i').classList.toggle('fa-eye-slash');
        });
    });

    // Handle form events and buttons

    // switch buttons (Login/Register)
    showLoginBtn.addEventListener('click', () => showAuthSection('login'));
    showRegisterBtn.addEventListener('click', () => showAuthSection('register'));

    // "Register now for free" link on the login page
    createAccountLink.addEventListener('click', (event) => {
        event.preventDefault();
        showAuthSection('register');
    });

    // "Back to Login Page" link in the sidebar
    showLoginFromSidebar.addEventListener('click', (event) => {
        event.preventDefault();
        showAuthSection('login');
    });

    // Clicking on step indicator items in the sidebar
    stepsIndicatorItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            if (index <= currentRegisterStep + 1) { 
                showRegisterStep(index);
            }
        });
    });

    // "Next" buttons in registration steps
    nextStepBtns.forEach(button => {
        button.addEventListener('click', () => {
            const currentStepElement = registerSteps[currentRegisterStep];
            const currentInputs = currentStepElement.querySelectorAll('input[required]');
            let allInputsValid = true;

            
            currentInputs.forEach(input => {
                input.classList.remove('error-input');
            });

            // Validate required fields for the current step
            currentInputs.forEach(input => {
                if (!input.value.trim()) { 
                    allInputsValid = false;
                    input.classList.add('error-input'); 
                }
            });

            // check for password confirmation in first step
            if (currentRegisterStep === 0) {
                const password = document.getElementById('regPassword').value;
                const confirmPassword = document.getElementById('confirmPassword').value;

                if (password !== confirmPassword) {
                    alert('Passwords do not match!');
                    document.getElementById('regPassword').classList.add('error-input');
                    document.getElementById('confirmPassword').classList.add('error-input');
                    allInputsValid = false;
                }
            }

            if (allInputsValid) {
                if (currentRegisterStep < registerSteps.length - 1) {
                    showRegisterStep(currentRegisterStep + 1);
                }
            } else {
                alert('Please fill in all required fields correctly.');
            }
        });
    });

    // "Back" buttons in registration steps
    prevStepBtns.forEach(button => {
        button.addEventListener('click', () => {
            if (currentRegisterStep > 0) {
                showRegisterStep(currentRegisterStep - 1);
            }
        });
    });

    // Handle login form submission
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

       
        
        console.log('Login Attempt:');
        console.log('Email:', email);
        console.log('Password:', password);
        alert('Login attempted with Email: ' + email);
    });

    // Handle registration (final step)
    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const currentStepElement = registerSteps[currentRegisterStep];
        const currentInputs = currentStepElement.querySelectorAll('input[required]');
        let allInputsValid = true;

        // Check required fields (final step) 
        currentInputs.forEach(input => {
            if (!input.value.trim()) {
                allInputsValid = false;
                input.classList.add('error-input');
            }
        });

        // Collect all form data 
        if (allInputsValid) {
            const formData = new FormData(registerForm);
            const data = {};
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            const selectedSources = Array.from(document.querySelectorAll('input[name="source"]:checked'))
                                         .map(checkbox => checkbox.value);
            data['how_heard_about_us'] = selectedSources;

            console.log('Registration Data:', data);
            alert('Registration complete! Check console for data.');
        } else {
            alert('Please complete all required fields before registering.');
        }
    });

    // Initial display: Login part 
    showAuthSection('login');
}); 