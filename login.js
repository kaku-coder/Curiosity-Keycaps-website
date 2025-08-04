// Login and Registration functionality
class AuthManager {
    constructor() {
        this.users = this.loadUsers();
        this.currentUser = this.loadCurrentUser();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupPasswordToggles();
        this.checkRememberedUser();
    }

    setupEventListeners() {
        // Form switching
        document.getElementById('showRegister').addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegisterForm();
        });

        document.getElementById('showLogin').addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginForm();
        });

        // Form submissions
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        // Go to home button
        document.getElementById('goToHome').addEventListener('click', () => {
            window.location.href = 'index.html';
        });

        // Social login buttons (demo functionality)
        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSocialLogin(btn.classList.contains('google') ? 'Google' : 'Facebook');
            });
        });
    }

    setupPasswordToggles() {
        document.querySelectorAll('.toggle-password').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const input = e.target.previousElementSibling;
                const type = input.type === 'password' ? 'text' : 'password';
                input.type = type;
                e.target.classList.toggle('ri-eye-line');
                e.target.classList.toggle('ri-eye-off-line');
            });
        });
    }

    showRegisterForm() {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('register-form').style.display = 'block';
        
        // Update header text
        document.querySelector('.header h1').textContent = 'Join Us';
        document.querySelector('.header p').textContent = 'Create your account to start shopping';
    }

    showLoginForm() {
        document.getElementById('register-form').style.display = 'none';
        document.getElementById('login-form').style.display = 'block';
        
        // Update header text
        document.querySelector('.header h1').textContent = 'Welcome Back';
        document.querySelector('.header p').textContent = 'Sign in to your account to continue shopping';
    }

    handleLogin() {
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Validation
        if (!this.validateEmail(email)) {
            this.showError('Please enter a valid email address');
            return;
        }

        if (password.length < 6) {
            this.showError('Password must be at least 6 characters long');
            return;
        }

        // Check if user exists
        const user = this.users.find(u => u.email === email);
        if (!user) {
            this.showError('User not found. Please check your email or register.');
            return;
        }

        // Check password
        if (user.password !== password) {
            this.showError('Incorrect password. Please try again.');
            return;
        }

        // Login successful
        this.currentUser = user;
        this.saveCurrentUser();
        
        if (rememberMe) {
            this.saveRememberedUser(email);
        } else {
            this.removeRememberedUser();
        }

        this.showSuccessMessage();
    }

    handleRegister() {
        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const phone = document.getElementById('registerPhone').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;

        // Validation
        if (name.length < 2) {
            this.showError('Name must be at least 2 characters long');
            return;
        }

        if (!this.validateEmail(email)) {
            this.showError('Please enter a valid email address');
            return;
        }

        if (phone.length < 10) {
            this.showError('Please enter a valid phone number');
            return;
        }

        if (password.length < 6) {
            this.showError('Password must be at least 6 characters long');
            return;
        }

        if (password !== confirmPassword) {
            this.showError('Passwords do not match');
            return;
        }

        if (!agreeTerms) {
            this.showError('Please agree to the Terms & Conditions');
            return;
        }

        // Check if user already exists
        if (this.users.find(u => u.email === email)) {
            this.showError('User with this email already exists. Please login instead.');
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            phone: phone,
            password: password,
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        this.saveUsers();

        // Auto login after registration
        this.currentUser = newUser;
        this.saveCurrentUser();

        this.showSuccessMessage('Account created successfully!');
    }

    handleSocialLogin(provider) {
        // Demo functionality - in real app, this would integrate with OAuth
        this.showError(`${provider} login is not implemented in this demo. Please use email/password.`);
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showError(message) {
        // Create error notification
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #e74c3c;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            max-width: 300px;
        `;

        document.body.appendChild(notification);

        // Remove notification after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    showSuccessMessage(message = 'Login successful!') {
        const successMessage = document.getElementById('successMessage');
        const successText = successMessage.querySelector('p');
        successText.textContent = message;
        successMessage.style.display = 'flex';
    }

    checkRememberedUser() {
        const rememberedEmail = localStorage.getItem('rememberedUser');
        if (rememberedEmail) {
            document.getElementById('loginEmail').value = rememberedEmail;
            document.getElementById('rememberMe').checked = true;
        }
    }

    saveRememberedUser(email) {
        localStorage.setItem('rememberedUser', email);
    }

    removeRememberedUser() {
        localStorage.removeItem('rememberedUser');
    }

    saveCurrentUser() {
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }

    loadCurrentUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }

    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }

    loadUsers() {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    }

    // Public methods for other scripts
    getCurrentUser() {
        return this.currentUser;
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
}

// Initialize authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});

// Add animation styles for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style); 