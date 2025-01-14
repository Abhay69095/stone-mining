// login.js - Simplified version

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAqh33kJLnrqoewy45vAZX-tS2kAyBMugI",
    authDomain: "construction-721da.firebaseapp.com",
    projectId: "construction-721da",
    storageBucket: "construction-721da.firebasestorage.app",
    messagingSenderId: "285803522336",
    appId: "1:285803522336:web:b36df33957bbd78a560f45"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Add after Firebase initialization
try {
    const authConfig = auth.config;
    console.log('Auth domain:', authConfig.authDomain);
    console.log('Auth settings:', {
        apiKey: !!firebaseConfig.apiKey,
        authDomain: !!firebaseConfig.authDomain,
        projectId: !!firebaseConfig.projectId
    });
} catch (error) {
    console.error('Firebase Auth configuration error:', error);
}

// Alert helper function
export function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 3000);
}

export function setupAuthUI() {
    auth.onAuthStateChanged((user) => {
        const authContainer = document.querySelector('.auth-container');
        const mobileAuthButtons = document.querySelector('.auth-buttons-mobile');

        if (user) {
            // User is signed in logic
            if (authContainer) {
                authContainer.innerHTML = `
                    <button class="auth-btn" id="logoutBtn">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </button>`;
            }

            if (mobileAuthButtons) {
                mobileAuthButtons.innerHTML = `
                    <button class="auth-btn" id="mobileLogoutBtn">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </button>`;
            }

            setupLogoutHandlers();
        } else {
            // User is signed out logic
            if (authContainer) {
                authContainer.innerHTML = `
                    <button id="loginBtn" class="auth-btn">Login</button>
                    <button id="signupBtn" class="auth-btn">Sign Up</button>`;
            }

            if (mobileAuthButtons) {
                mobileAuthButtons.innerHTML = `
                    <button id="showLogin" class="auth-btn">Login</button>
                    <button id="showSignup" class="auth-btn">Sign Up</button>`;
            }

            setupAuthHandlers();
        }
    });
}

export function setupAuthHandlers() {
    setupLoginForm();
    setupSignupForm();
    setupGoogleSignIn();
    setupModalControls();
}

function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            // ... existing login form handler code ...
        });
    }
}

function setupSignupForm() {
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            // ... existing signup form handler code ...
        });
    }
}

function setupGoogleSignIn() {
    const googleSignInBtn = document.getElementById('googleSignIn');
    if (googleSignInBtn) {
        googleSignInBtn.addEventListener('click', async () => {
            let errorMessage = 'Google Sign-In failed';
            googleSignInBtn.disabled = true;
            googleSignInBtn.innerHTML = 'Signing in...';
            
            try {
                const result = await signInWithPopup(auth, provider);
                showAlert('success', 'Successfully signed in with Google');
            } catch (error) {
                // Handle specific error codes
                switch (error.code) {
                    case 'auth/popup-blocked':
                        errorMessage = 'Please allow popups for this website';
                        break;
                    case 'auth/popup-closed-by-user':
                        errorMessage = 'Sign-in cancelled. Please try again';
                        break;
                    case 'auth/unauthorized-domain':
                        errorMessage = 'This domain is not authorized for Google Sign-In';
                        break;
                    default:
                        errorMessage = error.message;
                }
                showAlert('error', errorMessage);
            } finally {
                // Reset button state
                googleSignInBtn.disabled = false;
                googleSignInBtn.innerHTML = `
                    <img src="google.png" alt="Google Logo">
                    Sign in with Google
                `;
            }
        });
    } else {
        console.error('Google Sign-In button not found');
    }
}

function setupModalControls() {
    // ... existing modal control code ...
}
function setupLogoutHandlers() {
    const logoutBtns = document.querySelectorAll('#logoutBtn, #mobileLogoutBtn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            try {
                await auth.signOut();
                showAlert('success', 'Logged out successfully');
            } catch (error) {
                showAlert('error', 'Error logging out');
            }
        });
    });
}

// Add this function to verify button exists
function verifyGoogleButton() {
    const button = document.getElementById('googleSignIn');
    console.log('Google button found:', !!button);
    if (button) {
        console.log('Google button properties:', {
            visible: button.offsetParent !== null,
            disabled: button.disabled,
            hasClickListener: button.onclick !== null
        });
    }
}

// Call this in your DOMContentLoaded event
document.addEventListener('DOMContentLoaded', () => {
    verifyGoogleButton();
    // ...existing setup code...
});