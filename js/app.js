// js/app.js
import { showScreen, renderLoginScreen, renderNextConsultation, renderTasks, setupDragToConfirm } from './ui.js';
import { setupEventListeners } from './events.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initial setup
    showScreen('login'); // Start with the login screen
    setupEventListeners();
    // Initial rendering for home screen if needed, or handled by showScreen('home')
    // renderNextConsultation(); // Already called within showScreen('home')
    // renderTasks(); // Already called within showScreen('home')
    // setupDragToConfirm(); // This is called within renderFinancialScreen

    // For development: auto-navigate to home if needed
    // setTimeout(() => {
    //     showScreen('home');
    // }, 100);
});
