// js/events.js
import {
    financialData,
    referralsDB,
    professionalData,
    patientsDB,
    nextConsultation,
    tasks,
    consultationItems,
    doctorAvailability,
    fetchAccountHolderName
} from './data.js';

import {
    screens,
    navItems,
    showToast,
    showScreen,
    showModal,
    hideModal,
    animateValue,
    animateSlotMachine,
    renderTasks,
    renderNextConsultation,
    renderAgenda,
    renderPatientList,
    renderPatients,
    renderPatientHistory,
    renderProfile,
    renderFinancialScreen,
    renderDevelopmentScreen,
    renderSecurityScreen,
    renderPaymentMethodDetails,
    renderReferralsScreen,
    renderRewardsScreen,
    renderSupportScreen,
    renderWaitingRoom,
    renderConsultationScreen,
    renderReviewSignScreen,
    renderCommunityForum,
    renderForumTopicDetail,
    openNewTopicModal,
    renderLoginScreen,
    renderEmailLoginScreen,
    renderRegisterSuccessScreen,
    renderRegisterScreen,
    renderVerifySignatureScreen,
    renderForgotPasswordScreen,
    renderForgotSuccessScreen,
    activateSlideToConfirm,
    openWithdrawAmountModal,
    openWithdrawMethodModal,
    showAddBankAccountModal,
    showAddYapePlinModal,
    showReceiptModal,
    openApplyForTalkModal,
    openChangePasswordModal,
    renderConsultationItems,
    openManualAddModal,
    openScheduleModal,
    generatePDF
} from './ui.js';

function handleWithdrawalMethodSelection(method, amount) {
    if (method === 'savings') {
        if (financialData.bankAccounts.length === 0) {
            showAddBankAccountModal(amount);
        } else {
            const account = financialData.bankAccounts[0];
            activateSlideToConfirm(amount, account.holderName, `${account.bank} - ****${account.accountNumber.slice(-4)}`);
        }
    } else if (method === 'yape') {
        if (!financialData.yape || !financialData.yape.number) {
            showAddYapePlinModal('Yape', amount);
        } else {
            activateSlideToConfirm(amount, `Yape: ${financialData.yape.name}`, financialData.yape.number);
        }
    } else if (method === 'plin') {
        if (!financialData.plin || !financialData.plin.number) {
            showAddYapePlinModal('Plin', amount);
        } else {
            activateSlideToConfirm(amount, `Plin: ${financialData.plin.name}`, financialData.plin.number);
        }
    }
}


function setupEventListeners() {
    document.body.addEventListener('click', async (e) => {
        // Modals
        if (e.target.matches('.modal-overlay') || e.target.matches('.modal-close-btn') || e.target.closest('.modal-close-btn')) {
            hideModal();
        }

        // --- Onboarding/Register/Forgot Password Flow ---
        if (e.target.closest('#google-login-btn')) {
            showToast("Iniciando sesión con Google...");
            setTimeout(() => {
                showScreen('home');
            }, 1500);
        }

        if (e.target.closest('#continue-email-btn')) {
            showScreen('emailLogin');
        }

        if (e.target.closest('#login-btn')) {
            showToast("Iniciando sesión...");
            setTimeout(() => {
                showScreen('home');
            }, 1500);
        }
        if (e.target.closest('#register-link') || e.target.closest('#register-link-from-email')) {
            e.preventDefault();
            showScreen('register');
        }
        if (e.target.closest('#back-to-main-login') || e.target.closest('#back-to-login-from-register') || e.target.closest('.back-to-login-btn')) {
            e.preventDefault();
            showScreen('login');
        }
        if (e.target.closest('#register-form-btn')) {
            const termsCheckbox = document.getElementById('terms-checkbox');
            if (!termsCheckbox.checked) {
                showToast('Debe aceptar los términos y condiciones.');
                return;
            }
            showScreen('verifySignature');
        }
        if (e.target.closest('#verify-signature-btn')) {
            const code = document.getElementById('signature-code').value;
            if (code.length < 6) {
                showToast('Por favor ingrese el código de 6 dígitos.');
                return;
            }
            showScreen('registerSuccess');
        }
        if (e.target.closest('#forgot-password-link')) {
            e.preventDefault();
            showScreen('forgotPassword');
        }
        if (e.target.closest('#recover-password-btn')) {
            showScreen('forgotSuccess');
        }

        // Navigation
        if (e.target.closest('#nav-home')) { showScreen('home'); }
        if (e.target.closest('#nav-agenda')) { showScreen('agenda'); }
        if (e.target.closest('#nav-patients')) { showScreen('patients'); }
        if (e.target.closest('#nav-profile')) { showScreen('profile'); }

        // Profile Sub-menu navigation
        const profileMenuItem = e.target.closest('.profile-menu-item');
        if (profileMenuItem) {
            const targetScreen = profileMenuItem.dataset.target;
            if (targetScreen) showScreen(targetScreen);
        }

        if (e.target.closest('.back-to-profile')) {
            showScreen('profile');
        }
        if (e.target.closest('.back-to-development')) {
            showScreen('development');
        }
        if (e.target.closest('.back-to-forum')) {
            showScreen('communityForum');
        }

        // Patient History Flow
        if (e.target.closest('.view-history-btn')) {
            const patientId = parseInt(e.target.closest('.view-history-btn').dataset.patientId);
            showScreen('patientHistory', patientId);
        }
        if (e.target.closest('#back-to-patients')) { showScreen('patients'); }

        if (e.target.closest('.view-document-btn')) {
            const button = e.target.closest('.view-document-btn');
            const fileName = button.dataset.fileName;
            const fileContent = button.dataset.fileContent;
            showModal(`
                <div class="modal-overlay">
                    <div class="modal-content">
                        <div class="flex justify-between items-center mb-4">
                            <h2 class="font-bold text-lg text-gray-800 flex items-center gap-2"><i class="ph-file-pdf"></i>${fileName}</h2>
                            <button class="modal-close-btn text-gray-500"><i class="ph-x text-xl"></i></button>
                        </div>
                        <div class="bg-gray-100 p-3 rounded-lg text-sm text-gray-700 mb-4 h-48 overflow-y-auto">
                            <p>${fileContent}</p>
                        </div>
                        <div class="flex space-x-2">
                            <button class="modal-close-btn w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold">Cerrar</button>
                            <button id="confirm-download-btn" class="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold">Descargar</button>
                        </div>
                    </div>
                </div>
            `);
        }

        if (e.target.closest('#confirm-download-btn')) {
            hideModal();
            showToast('Descargando documento...');
            // Placeholder for actual download logic
        }

        if (e.target.closest('#fab-ai')) {
            showModal(`
                <div class="modal-overlay">
                    <div class="modal-content">
                        <div class="flex justify-between items-center mb-4">
                            <h2 class="font-bold text-lg text-gray-800 flex items-center"><i class="ph-brain mr-2"></i>Asistente Clínico IA</h2>
                            <button class="modal-close-btn text-gray-500"><i class="ph-x text-xl"></i></button>
                        </div>
                        <div class="bg-gray-100 p-3 rounded-lg text-sm text-gray-700 mb-4 h-48 overflow-y-auto">
                            <p>Hola Dra. Pérez, ¿en qué puedo ayudarle?</p>
                        </div>
                        <input type="text" placeholder="Escriba su consulta..." class="w-full p-2 border rounded-md">
                    </div>
                </div>
            `);
        }

        if (e.target.closest('#online-toggle')) {
            const toggle = e.target.closest('#online-toggle');
            const indicator = toggle.querySelector('span');
            const statusText = document.getElementById('online-status-text');
            toggle.classList.toggle('available');
            if (toggle.classList.contains('available')) {
                indicator.style.transform = 'translateX(22px)';
                statusText.textContent = 'Disponible Ahora';
                statusText.className = 'online-status-text available';
                showToast('Ahora estás disponible');
            } else {
                indicator.style.transform = 'translateX(4px)';
                statusText.textContent = 'No Disponible';
                statusText.className = 'online-status-text unavailable';
                showToast('Ahora no estás disponible');
            }
        }

        if (e.target.closest('#join-consultation-btn')) {
            renderWaitingRoom();
            setTimeout(() => { renderConsultationScreen(); }, 3000);
        }

        if (e.target.closest('#end-consultation-btn')) {
            const newTaskId = Date.now();
            tasks.unshift({ id: newTaskId, text: 'Revisar y Firmar Consulta', patient: 'Jorge García', status: 'pending', items: [...consultationItems] });
            nextConsultation.status = 'pending_review';
            consultationItems.length = 0; // Clear for next consultation
            showToast('Consulta finalizada. Tarea de firma creada.');
            showScreen('home');
        }

        if (e.target.closest('.review-task-btn')) {
            const taskId = parseInt(e.target.closest('.review-task-btn').dataset.taskId);
            renderReviewSignScreen(taskId);
        }

        if (e.target.closest('#back-to-home-from-review')) {
            showScreen('home');
        }

        if (e.target.closest('#sign-and-seal-btn')) {
            const taskId = parseInt(e.target.dataset.taskId);
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                task.status = 'completed';
                task.completedAt = new Date().toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' });
                const consultationCountEl = document.getElementById('consultation-count');
                if (consultationCountEl) {
                    const startConsultations = parseInt(consultationCountEl.textContent);
                    animateValue(consultationCountEl, startConsultations, startConsultations + 1, 1000);
                }
                const incomeCountEl = document.getElementById('income-count');
                 if (incomeCountEl) {
                    const currentIncomeText = incomeCountEl.textContent.replace('S/ ', '').replace(',', '');
                    const startIncome = parseFloat(currentIncomeText);
                    animateValue(incomeCountEl, startIncome, startIncome + 150, 1000, true, 'S/');
                }
                nextConsultation.visible = false;
                showToast('Registro firmado. +10 Puntos Vitalis!', true);
                showScreen('home');
            }
        }

        if (e.target.closest('.view-past-soap')) {
            showModal(`
                <div class="modal-overlay">
                    <div class="modal-content text-sm">
                        <h3 class="font-bold mb-2">SOAP 01/07/2025</h3>
                        <p><strong>S:</strong> Paciente refiere buena adherencia a tratamiento.</p>
                        <p><strong>O:</strong> PA controlada.</p>
                        <p><strong>A:</strong> HTA controlada.</p>
                        <p><strong>P:</strong> Continuar tratamiento.</p>
                        <button class="modal-close-btn mt-4 w-full bg-gray-200 py-2 rounded-lg">Cerrar</button>
                    </div>
                </div>
            `);
        }

        if (e.target.closest('#capture-btn')) {
            showModal(`
                <div class="modal-overlay">
                    <div class="modal-content text-center">
                        <h2 class="font-bold text-lg text-gray-800 mb-2">Confirmar Captura</h2>
                        <img src="https://placehold.co/300x200/cccccc/333333?text=Simulación+de+foto" class="rounded-lg mb-4 mx-auto">
                        <div class="flex space-x-2">
                            <button class="w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold modal-close-btn">Descartar</button>
                            <button id="confirm-capture-btn" class="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold">Adjuntar</button>
                        </div>
                    </div>
                </div>
            `);
        }

        if (e.target.closest('#confirm-capture-btn')) {
            const newItem = { id: Date.now(), type: 'photo', icon: 'image', title: 'FOTOGRAFÍA CLÍNICA', content: 'captura_clinica_040725.jpg', status: 'confirmed' };
            consultationItems.push(newItem);
            renderConsultationItems();
            showToast('Imagen adjuntada a la consulta');
            hideModal();
        }

        if (e.target.closest('.ai-confirm-btn')) {
            const cardId = parseInt(e.target.closest('.card').dataset.id);
            const item = consultationItems.find(i => i.id === cardId);
            if (item) {
                item.status = 'confirmed';
                renderConsultationItems();
            }
        }

        if (e.target.closest('.review-confirm-btn')) {
            const taskId = parseInt(e.target.dataset.taskId);
            const itemId = parseInt(e.target.dataset.itemId);
            const task = tasks.find(t => t.id === taskId);
            const item = task.items.find(i => i.id === itemId);
            if (item) {
                item.status = 'confirmed';
                renderReviewSignScreen(taskId);
            }
        }

        if (e.target.closest('.ai-discard-btn')) {
            const cardId = parseInt(e.target.closest('.card').dataset.id);
            const itemIndex = consultationItems.findIndex(i => i.id === cardId);
            if (itemIndex > -1) {
                consultationItems.splice(itemIndex, 1); // Remove item
                renderConsultationItems();
            }
        }

        if(e.target.closest('.ai-edit-btn')) {
            const cardId = parseInt(e.target.closest('.card').dataset.id);
            openManualAddModal(cardId);
        }

        if(e.target.closest('#manual-add-btn')) {
            openManualAddModal(null, false, null);
        }

        if(e.target.closest('.review-edit-btn') || e.target.closest('.review-add-btn')) {
            const taskId = parseInt(e.target.dataset.taskId);
            const itemId = e.target.closest('.review-edit-btn') ? parseInt(e.target.dataset.itemId) : null;
            openManualAddModal(itemId, true, taskId);
        }

        if(e.target.closest('#confirm-manual-add-btn')) {
            const select = document.getElementById('manual-item-select');
            const contentTextarea = document.getElementById('manual-item-content');
            const fromReview = e.target.dataset.fromReview === 'true';
            const taskId = parseInt(e.target.dataset.taskId);

            const selectedOption = select.options[select.selectedIndex];
            const itemId = parseInt(selectedOption.value);
            const isNew = isNaN(itemId);

            let targetArray;
            if (fromReview) {
                const task = tasks.find(t => t.id === taskId);
                if (task) targetArray = task.items;
            } else {
                targetArray = consultationItems;
            }

            if (targetArray) {
                if (isNew) {
                    const newType = selectedOption.value; // This is 'prescription', 'lab_order', etc.
                    const titles = { 'prescription': 'PRESCRIPCIÓN', 'lab_order': 'ORDEN DE LABORATORIO', 'certificate': 'CERTIFICADO DE DESCANSO' };
                    const icons = { 'prescription': 'pill', 'lab_order': 'test-tube', 'certificate': 'bed' };
                    const newItem = { id: Date.now(), type: 'order', icon: icons[newType], title: titles[newType], content: contentTextarea.value, status: 'confirmed' };
                    targetArray.push(newItem);
                } else {
                    const item = targetArray.find(i => i.id === itemId);
                    if(item) {
                        item.content = contentTextarea.value;
                        item.status = 'confirmed'; // Confirm on edit
                    }
                }
            }

            if(fromReview) {
                renderReviewSignScreen(taskId);
            } else {
                renderConsultationItems();
            }
            hideModal();
        }

        if (e.target.matches('.clinical-tab-btn')) {
            document.querySelectorAll('.clinical-tab-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const panelContainer = document.getElementById('consultation-panel-container');
            if (panelContainer) {
                panelContainer.querySelectorAll('.clinical-panel-content').forEach(c => c.classList.add('hidden'));
                const targetPanel = panelContainer.querySelector(`#${e.target.dataset.target}`);
                if(targetPanel) targetPanel.classList.remove('hidden');
            }
        }

        if (e.target.closest('#define-schedule-btn')) {
            openScheduleModal();
        }

        if (e.target.closest('.day-selector-btn')) {
            e.target.classList.toggle('selected');
        }

        if (e.target.closest('.add-timeslot-btn')) {
            const editor = document.getElementById('time-slots-editor');
            if(editor) {
                const newTimeSlotRow = document.createElement('div');
                newTimeSlotRow.className = 'flex items-center space-x-2 time-slot-row';
                newTimeSlotRow.innerHTML = `
                    <input type="time" class="w-full p-2 border rounded-lg bg-white" value="09:00">
                    <span>-</span>
                    <input type="time" class="w-full p-2 border rounded-lg bg-white" value="11:00">
                    <button class="remove-timeslot-btn text-red-500 hover:text-red-700 p-1">
                        <i class="ph-trash text-xl"></i>
                    </button>
                `;
                editor.appendChild(newTimeSlotRow);
            }
        }

        if (e.target.closest('.remove-timeslot-btn')) {
            e.target.closest('.time-slot-row').remove();
        }

        if (e.target.closest('#save-schedule-btn')) {
            const selectedDays = [...document.querySelectorAll('.day-selector-btn.selected')].map(btn => btn.dataset.day);
            const timeSlots = [...document.querySelectorAll('.time-slot-row')].map(row => {
                const inputs = row.querySelectorAll('input[type="time"]');
                return `${inputs[0].value} - ${inputs[1].value}`;
            });
            if (selectedDays.length === 0) {
                showToast("Por favor seleccione al menos un día.");
                return;
            }

            Object.keys(doctorAvailability).forEach(day => doctorAvailability[day] = []);
            selectedDays.forEach(day => {
                doctorAvailability[day] = timeSlots;
            });
            hideModal();
            renderAgenda();
            showToast("Horarios actualizados correctamente.");
        }

        if (e.target.closest('#download-pdf-btn')) {
            const patientId = parseInt(e.target.dataset.patientId);
            generatePDF(patientId);
        }

        if (e.target.closest('.show-receipt-btn')) {
            const transactionId = e.target.closest('.show-receipt-btn').dataset.transactionId;
            const transaction = financialData.transactions.find(t => t.id === transactionId);
            if (transaction) {
                 showReceiptModal(transaction);
            }
        }

        if (e.target.closest('#withdraw-funds-btn')) {
            openWithdrawAmountModal();
        }

        if (e.target.closest('#next-to-method-btn')) {
            const amountInput = document.getElementById('withdraw-amount-input');
            const amount = parseFloat(amountInput.value);
            if (isNaN(amount) || amount <= 0) {
                showToast("Por favor ingrese un monto válido.");
                return;
            }
            if (amount > financialData.balance) {
                showToast("El monto a retirar no puede ser mayor a su saldo.");
                return;
            }
            openWithdrawMethodModal(amount);
        }

        if (e.target.closest('.withdraw-method-btn')) {
            const amount = parseFloat(e.target.closest('.withdraw-method-btn').dataset.amount);
            handleWithdrawalMethodSelection(e.target.closest('.withdraw-method-btn').dataset.method, amount);
        }

        if (e.target.closest('#save-bank-account-btn')) {
            const button = e.target.closest('#save-bank-account-btn');
            const amountStr = button.dataset.amount;
            const amount = (amountStr && amountStr !== "null") ? parseFloat(amountStr) : null;

            const bank = document.getElementById('bank-name').value;
            const accountNumberInput = document.getElementById('account-number');
            const accountNumber = accountNumberInput ? accountNumberInput.value.replace(/-/g, '') : '';
            const holderNameDisplay = document.getElementById('holder-name-display');
            const holderName = holderNameDisplay ? holderNameDisplay.textContent : '';
            const cciInput = document.getElementById('cci-number');
            const cci = cciInput ? cciInput.value : '';

            if (!bank || !accountNumber || !holderName || holderName === '...' || holderName === 'No encontrado') {
                showToast("Por favor complete y verifique los datos.");
                return;
            }

            const newAccount = { bank, accountNumber, holderName, cci };
            financialData.bankAccounts = [newAccount]; // Assuming only one bank account for now

            hideModal();
            if (amount !== null) {
                activateSlideToConfirm(amount, newAccount.holderName, `${newAccount.bank} - ****${newAccount.accountNumber.slice(-4)}`);
            } else {
                renderSecurityScreen(); // Re-render to show updated details
                showToast("Cuenta bancaria actualizada.");
            }
        }

        if (e.target.closest('#save-yape-plin-btn')) {
            const button = e.target.closest('#save-yape-plin-btn');
            const amountStr = button.dataset.amount;
            const amount = (amountStr && amountStr !== "null") ? parseFloat(amountStr) : null;
            const method = button.dataset.method;
            const numberInput = document.getElementById('yape-plin-number');
            const number = numberInput ? numberInput.value : '';
            const nameDisplay = document.getElementById('holder-name-display');
            const name = nameDisplay ? nameDisplay.textContent : '';


            if (!number || !/^\d{9}$/.test(number) || !name || name === '...' || name === 'No encontrado') {
                showToast("Por favor ingrese y verifique el número.");
                return;
            }

            if (method === 'Yape') financialData.yape = { name, number };
            if (method === 'Plin') financialData.plin = { name, number };

            hideModal();
            if (amount !== null) {
                activateSlideToConfirm(amount, `${method}: ${name}`, number);
            } else {
                renderSecurityScreen();
                showToast(`${method} actualizado.`);
            }
        }


        if (e.target.closest('.add-payment-method-btn') || e.target.closest('.change-payment-method-btn')) {
            const method = e.target.dataset.method;
            if (method === 'savings') {
                showAddBankAccountModal();
            } else if (method === 'yape' || method === 'plin') {
                showAddYapePlinModal(method.charAt(0).toUpperCase() + method.slice(1));
            }
        }

        if (e.target.closest('.redeem-reward-btn')) {
            const rewardId = parseInt(e.target.dataset.rewardId);
            const reward = professionalData.rewards.find(r => r.id === rewardId);

            if (reward && professionalData.points >= reward.cost && !reward.claimed && reward.status !== 'applied') {
                if (reward.type === 'apply') {
                    openApplyForTalkModal(rewardId);
                } else {
                    const startPoints = professionalData.points;
                    professionalData.points -= reward.cost;
                    reward.claimed = true;
                    showToast(`¡Has canjeado "${reward.title}"!`);
                    renderRewardsScreen();
                    const pointsEl = document.getElementById('points-balance-rewards');
                    if(pointsEl) {
                        animateSlotMachine(pointsEl, startPoints, professionalData.points, 500);
                    }
                }
            } else if (reward && (reward.claimed || reward.status === 'applied')) {
                 showToast("Ya has gestionado esta recompensa.");
            } else if (reward) {
                showToast("No tienes suficientes puntos.");
            }
        }


        if (e.target.closest('#submit-talk-application-btn')) {
            const rewardId = parseInt(e.target.dataset.rewardId);
            const reward = professionalData.rewards.find(r => r.id === rewardId);
            if (reward) {
                const startPoints = professionalData.points;
                professionalData.points -= reward.cost;
                reward.status = 'applied'; // Mark as applied
                showToast('Postulación enviada. ¡Gracias por tu interés!');
                hideModal();
                renderRewardsScreen();
                const pointsEl = document.getElementById('points-balance-rewards');
                if(pointsEl) {
                    animateSlotMachine(pointsEl, startPoints, professionalData.points, 500);
                }
            }
        }


        if (e.target.closest('#change-password-btn')) {
            openChangePasswordModal();
        }

        if (e.target.closest('#confirm-password-change-btn')) {
            hideModal();
            showToast("Contraseña actualizada correctamente.");
        }

        if (e.target.closest('#logout-btn')) {
            showToast("Cerrando sesión...");
            setTimeout(() => {
                showScreen('login');
            }, 1500);
        }

        if (e.target.closest('#new-topic-btn')) {
            openNewTopicModal();
        }

        if (e.target.closest('#submit-new-topic-btn')) {
            const title = document.getElementById('new-topic-title').value;
            const description = document.getElementById('new-topic-description').value;
            const category = document.getElementById('new-topic-category').value;

            if (title && description && category) {
                const newTopic = {
                    id: Date.now(),
                    title,
                    description,
                    category,
                    author: 'Dra. Ana Pérez',
                    date: new Date().toLocaleDateString('es-PE'),
                    comments: []
                };
                professionalData.forumTopics.unshift(newTopic);
                professionalData.points += 5;
                renderCommunityForum();
                hideModal();
                showToast('¡Tema creado! +5 Puntos Vitalis', true);
            } else {
                showToast('Por favor complete todos los campos.');
            }
        }

        if (e.target.closest('.view-topic-btn')) {
            const topicId = parseInt(e.target.closest('.view-topic-btn').dataset.topicId);
            showScreen('forumTopic', topicId);
        }

        if (e.target.closest('#submit-comment-btn')) {
            const topicId = parseInt(e.target.dataset.topicId);
            const commentText = document.getElementById('new-comment-input').value;
            const topic = professionalData.forumTopics.find(t => t.id === topicId);
            if (commentText && topic) {
                const newComment = {
                    id: Date.now(),
                    author: 'Dra. Ana Pérez',
                    text: commentText,
                    date: new Date().toLocaleDateString('es-PE')
                };
                topic.comments.push(newComment);
                professionalData.points += 2;
                renderForumTopicDetail(topicId); // Re-render the topic detail
                showToast('¡Comentario añadido! +2 Puntos Vitalis', true);
                 document.getElementById('new-comment-input').value = ''; // Clear textarea
            } else {
                showToast('Por favor escriba un comentario.');
            }
        }
    });

    document.body.addEventListener('input', async (e) => {
        if (e.target.matches('#patient-search-input')) {
            const searchTerm = e.target.value.toLowerCase();
            const filtered = patientsDB.filter(patient => patient.name.toLowerCase().includes(searchTerm));
            const container = document.getElementById('patient-list-container');
            renderPatientList(filtered, container);
        }

        if (e.target.matches('#forum-search-input')) {
            const searchTerm = e.target.value.toLowerCase();
            const filtered = professionalData.forumTopics.filter(topic =>
                topic.title.toLowerCase().includes(searchTerm) ||
                topic.description.toLowerCase().includes(searchTerm) ||
                topic.category.toLowerCase().includes(searchTerm)
            );
            renderCommunityForum(filtered);
        }

        if (e.target.matches('#yape-plin-number')) {
            const number = e.target.value;
            const nameDisplay = document.getElementById('holder-name-display');
            const modalContent = e.target.closest('.modal-content');
            if (!modalContent) return;
            const saveButton = modalContent.querySelector('#save-yape-plin-btn');
            if (!saveButton) return;
            const method = saveButton.dataset.method.toLowerCase();

            if (nameDisplay) {
                if (number.length === 9) {
                    nameDisplay.textContent = 'Buscando...';
                    const holderName = await fetchAccountHolderName(number, method);
                    nameDisplay.textContent = holderName || 'No encontrado';
                } else {
                    nameDisplay.textContent = '...';
                }
            }
        }

        if (e.target.matches('#account-number')) {
            const number = e.target.value.replace(/-/g, '');
            const nameDisplay = document.getElementById('holder-name-display');
            if (nameDisplay) {
                if (number.length >= 10) { // Arbitrary length for bank accounts
                    nameDisplay.textContent = 'Verificando...';
                    const holderName = await fetchAccountHolderName(number, 'bank');
                    nameDisplay.textContent = holderName || 'No encontrado';
                } else {
                    nameDisplay.textContent = '...';
                }
            }
        }
    });
    document.body.addEventListener('change', (e) => {
         if (e.target.matches('#bank-name')) {
            const cciContainer = document.getElementById('cci-container');
            if (cciContainer) {
                if (e.target.value === 'Otro') {
                    cciContainer.classList.remove('hidden');
                } else {
                    cciContainer.classList.add('hidden');
                }
            }
        }
    });
}

export { setupEventListeners, handleWithdrawalMethodSelection };
