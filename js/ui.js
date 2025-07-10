// js/ui.js
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

// --- Elements ---
const screens = {
    login: document.getElementById('screen-login'),
    emailLogin: document.getElementById('screen-email-login'),
    onboarding: document.getElementById('screen-onboarding'),
    home: document.getElementById('screen-home'),
    agenda: document.getElementById('screen-agenda'),
    patients: document.getElementById('screen-patients'),
    patientHistory: document.getElementById('screen-patient-history'),
    profile: document.getElementById('screen-profile'),
    waitingRoom: document.getElementById('screen-waiting-room'),
    consultation: document.getElementById('screen-consultation'),
    reviewSign: document.getElementById('screen-review-sign'),
    financial: document.getElementById('screen-financial'),
    development: document.getElementById('screen-development'),
    security: document.getElementById('screen-security'),
    support: document.getElementById('screen-support'),
    referrals: document.getElementById('screen-referrals'),
    rewards: document.getElementById('screen-rewards'),
    communityForum: document.getElementById('screen-community-forum'),
    forumTopic: document.getElementById('screen-forum-topic'),
    register: document.getElementById('screen-register'),
    verifySignature: document.getElementById('screen-verify-signature'),
    registerSuccess: document.getElementById('screen-register-success'),
    forgotPassword: document.getElementById('screen-forgot-password'),
    forgotSuccess: document.getElementById('screen-forgot-success'),
};

const navItems = {
    home: document.getElementById('nav-home'),
    agenda: document.getElementById('nav-agenda'),
    patients: document.getElementById('nav-patients'),
    profile: document.getElementById('nav-profile'),
};

const header = document.getElementById('header');
const bottomNav = document.getElementById('bottom-nav');
const fab = document.getElementById('fab-ai');
const toast = document.getElementById('toast-notification');
const modalContainer = document.getElementById('modal-container');

// --- UI Functions ---
function showToast(message, isPoints = false) {
    if (isPoints) {
        toast.innerHTML = `${message} <i class="ph-star-fill text-yellow-400 ml-1"></i>`;
    } else {
        toast.textContent = message;
    }
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

function showScreen(screenName, data = null) {
    Object.values(screens).forEach(s => s.classList.add('hidden'));
    const screenToShow = screens[screenName];
    if (screenToShow) {
        screenToShow.classList.remove('hidden');
    }

    const isFullScreen = ['login', 'emailLogin', 'onboarding', 'register', 'verifySignature', 'registerSuccess', 'forgotPassword', 'forgotSuccess', 'waitingRoom', 'consultation'].includes(screenName);
    const hasNav = ['home', 'agenda', 'patients', 'profile'].includes(screenName);

    header.style.display = hasNav ? 'flex' : 'none';
    bottomNav.style.display = hasNav ? 'flex' : 'none';
    fab.style.display = screenName === 'home' ? 'flex' : 'none';
    if (isFullScreen) {
        header.style.display = 'none';
        bottomNav.style.display = 'none';
        fab.style.display = 'none';
    }

    Object.values(navItems).forEach(item => item.classList.remove('active'));
    if (navItems[screenName]) {
        navItems[screenName].classList.add('active');
    } else if (['financial', 'development', 'security', 'support', 'referrals', 'rewards', 'communityForum', 'forumTopic'].includes(screenName)) {
        navItems.profile.classList.add('active');
    }

    // Render specific screens
    if (screenName === 'login') renderLoginScreen();
    if (screenName === 'emailLogin') renderEmailLoginScreen();
    if (screenName === 'onboarding') renderOnboardingScreen(); // Kept for redirect from register success
    if (screenName === 'register') renderRegisterScreen();
    if (screenName === 'verifySignature') renderVerifySignatureScreen();
    if (screenName === 'registerSuccess') renderRegisterSuccessScreen();
    if (screenName === 'forgotPassword') renderForgotPasswordScreen();
    if (screenName === 'forgotSuccess') renderForgotSuccessScreen();
    if (screenName === 'patientHistory' && data) renderPatientHistory(data);
    if (screenName === 'financial') renderFinancialScreen();
    if (screenName === 'development') renderDevelopmentScreen();
    if (screenName === 'security') renderSecurityScreen();
    if (screenName === 'support') renderSupportScreen();
    if (screenName === 'referrals') renderReferralsScreen();
    if (screenName === 'rewards') renderRewardsScreen();
    if (screenName === 'communityForum') renderCommunityForum();
    if (screenName === 'forumTopic' && data) renderForumTopicDetail(data);
    if (screenName === 'home') {
        renderNextConsultation();
        renderTasks();
    }
}

function showModal(content) {
    modalContainer.innerHTML = content;
    const overlay = modalContainer.querySelector('.modal-overlay');
    if (overlay) {
        setTimeout(() => overlay.classList.add('visible'), 10);
    }
}

function hideModal() {
    const overlay = modalContainer.querySelector('.modal-overlay');
    if (overlay) {
        overlay.classList.remove('visible');
        setTimeout(() => { modalContainer.innerHTML = ''; }, 300);
    }
}

function animateValue(element, start, end, duration, isCurrency = false, prefix = '') {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = start + (end - start) * progress;
        if (isCurrency) {
            element.textContent = `${prefix} ${currentValue.toLocaleString('es-PE', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        } else {
            element.textContent = Math.floor(currentValue);
        }
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
             if (isCurrency) {
                element.textContent = `${prefix} ${end.toLocaleString('es-PE', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            } else {
                element.textContent = end.toLocaleString();
            }
        }
    };
    window.requestAnimationFrame(step);
}

function animateSlotMachine(element, start, end, duration) {
    let current = start;
    const range = start - end;
    const stepTime = Math.abs(Math.floor(duration / range));
    const timer = setInterval(() => {
        current -= 1;
        element.textContent = `${current.toLocaleString()} Puntos Vitalis`;
        if (current <= end) {
            clearInterval(timer);
            element.textContent = `${end.toLocaleString()} Puntos Vitalis`;
        }
    }, stepTime);
}

function renderTasks() {
    const container = document.getElementById('tasks-container');
    if (!container) return;
    container.innerHTML = tasks.map(task => {
        if (task.status === 'pending') {
            return `
                <div class="bg-white p-4 rounded-lg border-l-4 border-amber-500 shadow-sm flex items-center justify-between cursor-pointer review-task-btn" data-task-id="${task.id}">
                    <div>
                        <p class="font-bold text-gray-800">${task.text}</p>
                        <p class="text-sm text-gray-600">Paciente: ${task.patient}</p>
                    </div>
                    <i class="ph-caret-right text-gray-400 text-xl"></i>
                </div>
            `;
        } else {
            return `
                <div class="bg-white p-4 rounded-lg border-l-4 border-green-500 shadow-sm flex items-center justify-between opacity-70">
                    <div>
                        <p class="font-semibold text-gray-700 line-through">${task.text}</p>
                        <p class="text-sm text-gray-500">Completado: ${task.completedAt}</p>
                    </div>
                    <i class="ph-check-circle text-green-500 text-2xl"></i>
                </div>
            `;
        }
    }).join('');
}

function renderNextConsultation() {
    const container = document.getElementById('next-consultation-container');
    if (!container) return;

    if (!nextConsultation.visible) {
        container.innerHTML = `<div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-center text-gray-500">No hay consultas próximas.</div>`;
        return;
    }

    let buttonHtml = '';
    if (nextConsultation.status === 'scheduled') {
        buttonHtml = `<button id="join-consultation-btn" class="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Unirse</button>`;
    } else if (nextConsultation.status === 'pending_review') {
        buttonHtml = `<button class="bg-amber-500 text-white px-5 py-2 rounded-lg font-semibold cursor-not-allowed">Revisión Pendiente</button>`;
    }

    container.innerHTML = `
        <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Próxima Consulta</p>
            <div class="flex items-center justify-between mt-3">
                <div>
                    <p class="font-bold text-lg text-gray-800">${nextConsultation.patient}</p>
                    <p class="text-sm text-gray-600">${nextConsultation.time} - ${nextConsultation.reason}</p>
                </div>
                ${buttonHtml}
            </div>
        </div>
    `;
}

function renderAgenda() {
    const container = screens.agenda;
    if (!container) return;

    const daysOfWeek = Object.keys(doctorAvailability);

    container.innerHTML = `
        <div class="flex items-center justify-between mb-4">
            <h1 class="text-2xl font-bold text-gray-800">Mi Agenda</h1>
            <button id="define-schedule-btn" class="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm">Definir Horarios</button>
        </div>
        <div id="agenda-view" class="space-y-4">
            ${daysOfWeek.map(day => `
                <div class="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 class="font-bold text-gray-800 mb-2">${day}</h3>
                    <div class="flex flex-wrap gap-2">
                        ${doctorAvailability[day].length > 0
                            ? doctorAvailability[day].map(slot => `<div class="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">${slot}</div>`).join('')
                            : '<p class="text-sm text-gray-400">No hay horarios definidos.</p>'
                        }
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderPatientList(patients, container) {
    if (!container) return;
    container.innerHTML = patients.length > 0 ? patients.map(patient => `
        <div class="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between">
            <div class="flex items-center">
                <img src="${patient.avatar}" alt="" class="w-10 h-10 rounded-full mr-3" onerror="this.onerror=null;this.src='https://placehold.co/40x40/cccccc/333333?text=??';">
                <div>
                    <p class="font-semibold text-gray-800">${patient.name}</p>
                    <p class="text-xs text-gray-500">${patient.details.split(',')[0]}</p>
                </div>
                ${tasks.some(t => t.patient === patient.name && t.status === 'pending') ? '<span class="ml-3 w-3 h-3 bg-yellow-400 rounded-full" title="Tareas pendientes"></span>' : ''}
            </div>
            <button class="view-history-btn text-blue-600 font-semibold text-sm" data-patient-id="${patient.id}">Ver Historia</button>
        </div>
    `).join('') : '<p class="text-center text-gray-500 mt-8">No se encontraron pacientes.</p>';
}

function renderPatients(filteredPatients = patientsDB) {
    screens.patients.innerHTML = `
        <h1 class="text-2xl font-bold text-gray-800 mb-4">Mis Pacientes</h1>
        <div class="relative mb-4">
            <input type="text" id="patient-search-input" placeholder="Buscar paciente..." class="w-full p-3 pl-10 border border-gray-300 rounded-lg bg-white">
            <i class="ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>
        <div id="patient-list-container" class="space-y-3">
        </div>
    `;
    const container = screens.patients.querySelector('#patient-list-container');
    renderPatientList(filteredPatients, container);
}

function renderPatientHistory(patientId) {
    const patient = patientsDB.find(p => p.id === patientId);
    if (!patient) return;

    screens.patientHistory.innerHTML = `
        <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
                <button id="back-to-patients" class="text-2xl text-gray-600 mr-4"><i class="ph-arrow-left"></i></button>
                <h1 class="text-xl font-bold text-gray-800">Historia Clínica 360°</h1>
            </div>
            <button id="download-pdf-btn" data-patient-id="${patient.id}" class="bg-blue-600 text-white px-3 py-1.5 rounded-lg font-semibold text-sm flex items-center gap-2"><i class="ph-download-simple"></i>PDF</button>
        </div>
        <div class="bg-white p-4 rounded-lg border border-gray-200 mb-4 space-y-3">
            <div class="text-center">
                <img src="${patient.avatar}" alt="" class="w-20 h-20 rounded-full mx-auto mb-2" onerror="this.onerror=null;this.src='https://placehold.co/80x80/cccccc/333333?text=??';">
                <h2 class="text-lg font-bold">${patient.name}</h2>
                <p class="text-sm text-gray-500">${patient.details}</p>
            </div>
            <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-r-lg">
                <p class="font-bold text-sm">Alergias: ${patient.allergies}</p>
            </div>
            <div class="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-3 rounded-r-lg">
                 <p class="font-bold text-sm">Adherencia Terapéutica (últimos 30d): ${patient.adherence}%</p>
            </div>
        </div>
        <h3 class="font-bold text-lg text-gray-800 mb-2">Línea de Tiempo de Consultas</h3>
        <div class="space-y-4">
            ${patient.consultations.length > 0 ? patient.consultations.map((consult, index) => `
            <details class="bg-white rounded-lg border" ${index === 0 ? 'open' : ''}>
                <summary class="font-bold text-gray-800 p-3 cursor-pointer flex justify-between items-center">
                    <span>${consult.date} (${consult.doctor})</span>
                    <i class="ph-caret-down"></i>
                </summary>
                <div class="p-4 border-t text-sm space-y-4">
                    <div class="bg-gray-50 p-3 rounded-md">
                        <h4 class="font-bold mb-2 text-gray-700">Triaje</h4>
                        <div class="grid grid-cols-2 gap-x-4 gap-y-1">
                            ${Object.entries(consult.triage).map(([key, value]) => `
                                <p><strong>${key}:</strong> ${value}</p>
                            `).join('')}
                        </div>
                    </div>
                    <div class="space-y-2">
                        <h4 class="font-bold text-gray-700">SOAP</h4>
                        <p><strong>S:</strong> ${consult.soap.s}</p>
                        <p><strong>O:</strong> ${consult.soap.o}</p>
                        <p><strong>A:</strong> ${consult.soap.a}</p>
                        <p><strong>P:</strong> ${consult.soap.p}</p>
                    </div>
                    ${consult.exams.length > 0 ? `
                    <div>
                        <h4 class="font-bold text-gray-700 mb-2">Exámenes y Documentos</h4>
                        <div class="space-y-2">
                            ${consult.exams.map(exam => `
                                <button class="view-document-btn flex items-center gap-2 p-2 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold w-full text-left" data-file-name="${exam.name}" data-file-content="Este es un documento de ejemplo para ${exam.name}. En una aplicación real, aquí se mostraría el contenido del PDF.">
                                    <i class="ph-file-pdf"></i>
                                    <span>${exam.name}</span>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}
                </div>
            </details>
            `).join('') : '<p class="text-center text-gray-500 p-4 bg-white rounded-lg border">No hay consultas registradas.</p>'}
        </div>
    `;
}

function renderProfile() {
    screens.profile.innerHTML = `
        <div class="text-center pt-4 pb-6">
            <img src="https://placehold.co/96x96/bfdbfe/1e3a8a?text=AP" alt="[Photo of Dr. Ana Pérez]" class="w-24 h-24 rounded-full mx-auto mb-3" onerror="this.onerror=null;this.src='https://placehold.co/96x96/cccccc/333333?text=AP';">
            <h1 class="text-2xl font-bold text-gray-800">Dra. Ana Pérez</h1>
            <p class="text-gray-500">Medicina General</p>
        </div>
        <div class="space-y-3">
            <div class="profile-menu-item" data-target="financial"><span><i class="ph-wallet mr-3"></i>Gestión Financiera</span><i class="ph-caret-right"></i></div>
            <div class="profile-menu-item" data-target="development"><span><i class="ph-trophy mr-3"></i>Desarrollo Profesional</span><i class="ph-caret-right"></i></div>
            <div class="profile-menu-item" data-target="rewards"><span><i class="ph-gift mr-3"></i>Programa de Recompensas</span><i class="ph-caret-right"></i></div>
            <div class="profile-menu-item" data-target="referrals"><span><i class="ph-users-three mr-3"></i>Programa de Referidos</span><i class="ph-caret-right"></i></div>
            <div class="profile-menu-item" data-target="security"><span><i class="ph-key mr-3"></i>Seguridad de la Cuenta</span><i class="ph-caret-right"></i></div>
            <div class="profile-menu-item" data-target="support"><span><i class="ph-question mr-3"></i>Soporte y Ayuda</span><i class="ph-caret-right"></i></div>
        </div>
    `;
}

function renderFinancialScreen() {
    screens.financial.style.backgroundColor = '#FFFFFF';
    screens.financial.innerHTML = `
        <div class="flex items-center mb-4 text-[#212529]">
            <button class="back-to-profile text-2xl mr-4"><i class="ph-arrow-left"></i></button>
            <h1 class="text-xl font-semibold">Gestión Financiera</h1>
        </div>

        <div class="bg-[#F5F5F5] p-4 rounded-xl mb-6">
            <div class="flex justify-between items-center">
                <div>
                    <p class="text-sm text-gray-500">Saldo Disponible</p>
                    <p id="financial-balance" class="text-3xl font-bold text-[#212529]">S/ ${financialData.balance.toLocaleString('es-PE', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                </div>
                <button id="withdraw-funds-btn" class="bg-[#28A745] text-white px-4 py-2 rounded-lg font-semibold text-sm ${financialData.balance > 0 ? '' : 'opacity-50 cursor-not-allowed'}" ${financialData.balance > 0 ? '' : 'disabled'}>Retirar</button>
            </div>
        </div>

        <div id="drag-to-confirm-container" class="w-full my-6 hidden">
            <div class="flex justify-between items-center text-center font-semibold text-sm mb-2">
                <p id="drag-label-left" class="w-1/3 text-left font-bold text-lg text-green-600"></p>
                <p class="w-1/3 text-gray-500 flex justify-center"><i class="ph-arrow-right text-xl"></i></p>
                <p id="drag-label-right" class="w-1/3 text-right text-gray-500"></p>
            </div>
            <div class="relative flex items-center h-20 bg-[#F5F5F5] rounded-full overflow-hidden">
                <div id="draggable-icon" class="absolute bg-[#28A745] rounded-full h-16 w-16 flex items-center justify-start cursor-grab active:cursor-grabbing z-10 shadow-lg text-white" style="left: 2px;">
                    <span class="font-semibold text-2xl pl-3">S/</span>
                </div>
                <div id="drop-target-right" class="absolute right-0 h-full w-1/3"></div>
            </div>
            <p class="text-center text-xs text-gray-400 mt-2">Desliza para confirmar el retiro</p>
        </div>

        <div class="mt-6">
            <h2 class="font-semibold text-[#212529] text-lg mb-2">Últimos Movimientos</h2>
            <div id="transactions-container" class="space-y-2">
                ${financialData.transactions.map(t => `
                    <div class="bg-white p-3 rounded-xl flex justify-between items-center border border-gray-200">
                        <div class="flex-grow">
                            <p class="font-semibold text-gray-800">${t.description}</p>
                            <p class="text-xs text-gray-500">ID: ${t.id}</p>
                        </div>
                        <div class="text-right ml-2 flex items-center">
                            <p class="font-bold ${t.amount > 0 ? 'text-[#28A745]' : 'text-[#DC3545]'}">${t.amount > 0 ? '+' : ''} S/ ${Math.abs(t.amount).toLocaleString('es-PE', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                            ${t.id === financialData.lastWithdrawalId ? `<button class="show-receipt-btn ml-2" data-transaction-id="${t.id}"><i class="ph-whatsapp-logo text-2xl text-[#28A745]"></i></button>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    setupDragToConfirm(); // This function will be moved to events.js or app.js
}

function renderDevelopmentScreen() {
    screens.development.innerHTML = `
        <div class="flex items-center mb-4">
            <button class="back-to-profile text-2xl text-gray-600 mr-4"><i class="ph-arrow-left"></i></button>
            <h1 class="text-xl font-bold text-gray-800">Desarrollo Profesional</h1>
        </div>
        <div class="bg-white p-4 rounded-lg border mb-4">
              <div>
                <div class="flex justify-between items-center text-sm font-semibold mb-1">
                    <span>${professionalData.level}</span>
                    <span>${professionalData.nextLevel}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                    <div class="bg-yellow-400 h-2.5 rounded-full" style="width: ${Math.min((professionalData.points / professionalData.nextLevelPoints) * 100, 100)}%"></div>
                </div>
                <p class="text-center text-xs text-gray-500 mt-1">Faltan ${Math.max(0, professionalData.nextLevelPoints - professionalData.points)} puntos para el siguiente nivel</p>
            </div>
        </div>
        <div class="text-center bg-white p-4 rounded-lg border mb-6">
            <i class="ph-trophy text-5xl text-yellow-500"></i>
            <p id="points-balance-dev" class="text-2xl font-bold text-gray-800 mt-2">${professionalData.points.toLocaleString()} Puntos Vitalis</p>
            <p class="text-sm text-gray-500">Nivel: ${professionalData.level}</p>
        </div>
        <div class="space-y-3">
            <div class="profile-menu-item" data-target="communityForum"><span><i class="ph-chats-circle mr-3"></i>Comunidad y Foros</span><i class="ph-caret-right"></i></div>
            <div class="profile-menu-item"><span><i class="ph-graduation-cap mr-3"></i>Cursos y Capacitación</span><i class="ph-caret-right"></i></div>
        </div>
    `;
}

function renderSecurityScreen() {
    screens.security.innerHTML = `
        <div class="flex items-center mb-4">
            <button class="back-to-profile text-2xl text-gray-600 mr-4"><i class="ph-arrow-left"></i></button>
            <h1 class="text-xl font-bold text-gray-800">Seguridad de la Cuenta</h1>
        </div>
        <div class="space-y-4">
            <div>
                <h3 class="font-semibold text-gray-700 mb-2">Métodos de Retiro</h3>
                <div class="space-y-2">
                    <div id="bank-account-details-container" class="bg-white p-4 rounded-lg border"></div>
                    <div id="yape-details-container" class="bg-white p-4 rounded-lg border"></div>
                    <div id="plin-details-container" class="bg-white p-4 rounded-lg border"></div>
                </div>
            </div>
            <div>
                <h3 class="font-semibold text-gray-700 mb-2">Autenticación</h3>
                <div class="space-y-2">
                    <button id="change-password-btn" class="w-full text-left bg-white p-4 rounded-lg border">Cambiar Contraseña</button>
                    <div class="bg-white p-4 rounded-lg border flex justify-between items-center">
                        <span>Autenticación de 2 Factores</span>
                        <div class="relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer bg-gray-300">
                            <span class="inline-block w-4 h-4 transform bg-white rounded-full" style="transform: translateX(4px);"></span>
                        </div>
                    </div>
                </div>
            </div>
             <div>
                <h3 class="font-semibold text-gray-700 mb-2">Cursos de Seguridad</h3>
                <div class="space-y-2">
                    <div class="bg-white p-4 rounded-lg border flex justify-between items-center"><span>Protección de Datos de Pacientes (HIPAA)</span><i class="ph-caret-right"></i></div>
                    <div class="bg-white p-4 rounded-lg border flex justify-between items-center"><span>Mejores Prácticas de Ciberseguridad</span><i class="ph-caret-right"></i></div>
                </div>
            </div>
            <div>
                <button id="logout-btn" class="w-full text-left bg-white p-4 rounded-lg border text-red-600 font-semibold">Cerrar Sesión</button>
            </div>
        </div>
    `;
    renderPaymentMethodDetails();
}

function renderPaymentMethodDetails() {
    const bankContainer = document.getElementById('bank-account-details-container');
    const yapeContainer = document.getElementById('yape-details-container');
    const plinContainer = document.getElementById('plin-details-container');

    const defaultAccount = financialData.bankAccounts[0];
    if (bankContainer) {
        if (defaultAccount) {
            bankContainer.innerHTML = `
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-3">
                        <i class="ph-bank text-2xl text-gray-500"></i>
                        <div>
                            <p class="font-semibold text-gray-800">${defaultAccount.holderName}</p>
                            <p class="text-sm text-gray-500">${defaultAccount.bank} - **** ${defaultAccount.accountNumber.slice(-4)}</p>
                        </div>
                    </div>
                    <button class="change-payment-method-btn text-blue-600 font-semibold text-sm" data-method="savings">Cambiar</button>
                </div>
            `;
        } else {
            bankContainer.innerHTML = `
                <div class="flex justify-between items-center">
                    <p class="text-gray-500">Cuenta Bancaria no registrada</p>
                    <button class="add-payment-method-btn text-blue-600 font-semibold text-sm" data-method="savings">Añadir</button>
                </div>
            `;
        }
    }

    if (yapeContainer) {
        if (financialData.yape && financialData.yape.number) {
            yapeContainer.innerHTML = `
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-3">
                        <img src="https://seeklogo.com/images/Y/yape-logo-343361418C-seeklogo.com.png" alt="[Icon of Yape]" class="h-6" onerror="this.style.display='none'">
                        <div>
                            <p class="font-semibold text-gray-800">${financialData.yape.name}</p>
                            <p class="text-sm text-gray-500">${financialData.yape.number}</p>
                        </div>
                    </div>
                    <button class="change-payment-method-btn text-blue-600 font-semibold text-sm" data-method="yape">Cambiar</button>
                </div>
            `;
        } else {
            yapeContainer.innerHTML = `
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-3">
                        <img src="https://seeklogo.com/images/Y/yape-logo-343361418C-seeklogo.com.png" alt="[Icon of Yape]" class="h-6 opacity-50" onerror="this.style.display='none'">
                        <p class="text-gray-500">Yape no registrado</p>
                    </div>
                    <button class="add-payment-method-btn text-blue-600 font-semibold text-sm" data-method="yape">Añadir</button>
                </div>
            `;
        }
    }

    if (plinContainer) {
        if (financialData.plin && financialData.plin.number) {
            plinContainer.innerHTML = `
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-3">
                        <img src="https://www.plin.com.pe/logo-plin.png" alt="[Icon of Plin]" class="h-5" onerror="this.style.display='none'">
                        <div>
                            <p class="font-semibold text-gray-800">${financialData.plin.name}</p>
                            <p class="text-sm text-gray-500">${financialData.plin.number}</p>
                        </div>
                    </div>
                    <button class="change-payment-method-btn text-blue-600 font-semibold text-sm" data-method="plin">Cambiar</button>
                </div>
            `;
        } else {
            plinContainer.innerHTML = `
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-3">
                        <img src="https://www.plin.com.pe/logo-plin.png" alt="[Icon of Plin]" class="h-5 opacity-50" onerror="this.style.display='none'">
                        <p class="text-gray-500">Plin no registrado</p>
                    </div>
                    <button class="add-payment-method-btn text-blue-600 font-semibold text-sm" data-method="plin">Añadir</button>
                </div>
            `;
        }
    }
}

function renderReferralsScreen() {
    const totalReferrals = referralsDB.length;
    const totalEarnings = referralsDB.reduce((sum, ref) => sum + ref.earnings, 0);
    screens.referrals.innerHTML = `
        <div class="flex items-center mb-4">
            <button class="back-to-profile text-2xl text-gray-600 mr-4"><i class="ph-arrow-left"></i></button>
            <h1 class="text-xl font-bold text-gray-800">Programa de Referidos</h1>
        </div>

        <div class="bg-white p-4 rounded-lg border border-gray-200 text-center mb-6">
            <p class="text-sm text-gray-600">Comparte tu código y gana 50 Puntos por cada médico que complete su primera consulta.</p>
            <div class="my-3 p-3 bg-blue-50 border-2 border-dashed border-blue-200 rounded-lg">
                <p id="referral-code" class="text-2xl font-bold text-blue-600 tracking-widest">VITALIS-APEREZ</p>
            </div>
            <div class="flex justify-center gap-2">
                <button id="copy-code-btn" class="bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg flex-1">Copiar</button>
                 <a href="https://api.whatsapp.com/send?text=Usa%20mi%20código%20VITALIS-APEREZ%20para%20unirte%20a%20Vitalis%20AI%20y%20gana%20beneficios." target="_blank" class="bg-green-500 text-white font-semibold px-4 py-2 rounded-lg flex-1 flex items-center justify-center gap-2">
                     <i class="ph-whatsapp-logo"></i> Compartir
                 </a>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <p class="text-sm font-semibold text-gray-500">Total Referidos</p>
                <p class="text-3xl font-bold text-gray-800 mt-1">${totalReferrals}</p>
            </div>
            <div class="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <p class="text-sm font-semibold text-gray-500">Puntos Ganados</p>
                <p class="text-3xl font-bold text-gray-800 mt-1">${totalEarnings.toLocaleString()}</p>
            </div>
        </div>

        <div>
            <h2 class="font-bold text-gray-800 text-lg mb-3">Historial de Referidos</h2>
            <div class="space-y-3">
                ${referralsDB.map(ref => {
                    let statusClass = '';
                    switch(ref.status) {
                        case 'Completado': statusClass = 'bg-green-100 text-green-800'; break;
                        case 'Pendiente': statusClass = 'bg-yellow-100 text-yellow-800'; break;
                    }
                    return `
                    <div class="bg-white p-4 rounded-lg border flex justify-between items-center">
                        <div>
                            <p class="font-semibold text-gray-800">${ref.name}</p>
                            <p class="text-xs text-gray-500">Referido el: ${ref.date}</p>
                        </div>
                        <div class="text-right">
                            <p class="font-bold text-green-600">+ ${ref.earnings} Puntos</p>
                            <span class="text-xs font-bold px-2 py-0.5 rounded-full ${statusClass}">${ref.status}</span>
                        </div>
                    </div>
                    `
                }).join('')}
            </div>
        </div>
    `;
}

function renderRewardsScreen() {
    screens.rewards.innerHTML = `
        <div class="flex items-center mb-4">
            <button class="back-to-profile text-2xl text-gray-600 mr-4"><i class="ph-arrow-left"></i></button>
            <h1 class="text-xl font-bold text-gray-800">Programa de Recompensas</h1>
        </div>

         <div class="bg-white p-4 rounded-lg border mb-4">
              <div>
                <div class="flex justify-between items-center text-sm font-semibold mb-1">
                    <span>${professionalData.level}</span>
                    <span>${professionalData.nextLevel}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                    <div class="bg-yellow-400 h-2.5 rounded-full" style="width: ${Math.min((professionalData.points / professionalData.nextLevelPoints) * 100, 100)}%"></div>
                </div>
                <p class="text-center text-xs text-gray-500 mt-1">Faltan ${Math.max(0, professionalData.nextLevelPoints - professionalData.points)} puntos para el siguiente nivel</p>
            </div>
        </div>

        <div class="text-center bg-white p-4 rounded-lg border mb-4">
            <i class="ph-trophy text-5xl text-yellow-500"></i>
            <p id="points-balance-rewards" class="text-2xl font-bold text-gray-800 mt-2">${professionalData.points.toLocaleString()} Puntos Vitalis</p>
            <p class="text-sm text-gray-500">Disponibles para canjear</p>
        </div>

        <div>
            <h2 class="font-bold text-gray-800 text-lg mb-3">Catálogo de Recompensas</h2>
            <div id="rewards-catalog" class="space-y-3">
                ${professionalData.rewards.map(reward => {
                    const canAfford = professionalData.points >= reward.cost;
                    let buttonText = reward.type === 'apply' ? 'Postular' : 'Canjear';
                    let buttonDisabled = !canAfford;
                    let buttonClass = canAfford ? 'bg-blue-600 text-white' : 'bg-blue-300 text-white cursor-not-allowed';

                    if (reward.status === 'applied') {
                        buttonText = 'Postulación Enviada';
                        buttonDisabled = true;
                        buttonClass = 'bg-yellow-500 text-white cursor-not-allowed';
                    } else if (reward.claimed) {
                        buttonText = 'Canjeado';
                        buttonDisabled = true;
                        buttonClass = 'bg-gray-300 text-gray-500 cursor-not-allowed';
                    }

                    return `
                    <div class="bg-white p-4 rounded-lg border">
                        <h3 class="font-bold text-gray-800">${reward.title}</h3>
                        <p class="text-sm text-gray-600 my-2">${reward.description}</p>
                        <div class="flex justify-between items-center mt-3">
                            <p class="font-bold text-blue-600">${reward.cost} Puntos</p>
                            <button class="redeem-reward-btn px-4 py-2 rounded-lg font-semibold text-sm ${buttonClass}"
                                    data-reward-id="${reward.id}"
                                    ${buttonDisabled ? 'disabled' : ''}>
                                ${buttonText}
                            </button>
                        </div>
                    </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

function renderSupportScreen() {
    screens.support.innerHTML = `
        <div class="flex items-center mb-4">
            <button class="back-to-profile text-2xl text-gray-600 mr-4"><i class="ph-arrow-left"></i></button>
            <h1 class="text-xl font-bold text-gray-800">Soporte y Ayuda</h1>
        </div>

        <div class="space-y-4">
            <div>
                <h3 class="font-semibold text-gray-700 mb-2">Preguntas Frecuentes</h3>
                <div class="space-y-2">
                    <details class="bg-white rounded-lg border">
                        <summary class="font-bold text-gray-800 p-3 cursor-pointer">¿Cómo defino o modifico mis horarios de atención?</summary>
                        <div class="p-3 border-t text-sm text-gray-600">
                            Para establecer tus horarios, ve a la pestaña "Agenda" en la barra de navegación inferior y presiona el botón "Definir Horarios". Podrás seleccionar los días y los bloques de tiempo en los que estarás disponible para consultas.
                        </div>
                    </details>
                    <details class="bg-white rounded-lg border">
                        <summary class="font-bold text-gray-800 p-3 cursor-pointer">¿Cómo funciona el retiro de mis ganancias?</summary>
                        <div class="p-3 border-t text-sm text-gray-600">
                            Puedes retirar tu saldo disponible desde "Perfil" > "Gestión Financiera". Ingresa el monto, elige un método de pago (cuenta bancaria, Yape o Plin) y confirma la transacción. Los fondos se procesarán en un plazo de 24 horas hábiles.
                        </div>
                    </details>
                    <details class="bg-white rounded-lg border">
                        <summary class="font-bold text-gray-800 p-3 cursor-pointer">¿Qué hago si la IA no transcribe correctamente?</summary>
                        <div class="p-3 border-t text-sm text-gray-600">
                            Durante la consulta, puedes editar manualmente cualquier campo del SOAP. Al finalizar, en la pantalla "Revisar y Firmar", tienes la oportunidad de corregir todas las secciones antes de sellar el registro clínico.
                        </div>
                    </details>
                </div>
            </div>

            <div>
                <h3 class="font-semibold text-gray-700 mb-2">Contactar a Soporte</h3>
                <div class="space-y-2">
                    <a href="https://wa.me/51999888777" target="_blank" class="w-full text-left bg-white p-4 rounded-lg border flex items-center gap-3">
                        <i class="ph-whatsapp-logo text-2xl text-green-500"></i>
                        <div>
                            <p class="font-bold">Chatear por WhatsApp</p>
                            <p class="text-xs text-gray-500">Respuesta usualmente en minutos.</p>
                        </div>
                    </a>
                    <a href="mailto:soporte@vitalis.ai" class="w-full text-left bg-white p-4 rounded-lg border flex items-center gap-3">
                        <i class="ph-envelope text-2xl text-blue-500"></i>
                        <div>
                            <p class="font-bold">Enviar un Email</p>
                            <p class="text-xs text-gray-500">soporte@vitalis.ai</p>
                        </div>
                    </a>
                     <a href="tel:+5116401234" class="w-full text-left bg-white p-4 rounded-lg border flex items-center gap-3">
                        <i class="ph-phone text-2xl text-gray-500"></i>
                        <div>
                            <p class="font-bold">Llamar a Central</p>
                            <p class="text-xs text-gray-500">(01) 640-1234</p>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    `;
}

function renderWaitingRoom() {
    screens.waitingRoom.innerHTML = `
        <i class="ph-clock-countdown text-6xl text-blue-600"></i>
        <h2 class="text-2xl font-bold text-gray-800 mt-4">Sala de Espera Virtual</h2>
        <p class="text-gray-600 mt-2 max-w-sm">Aguardando a que el paciente, Jorge García, se conecte a la consulta.</p>
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mt-8"></div>
        <p class="text-sm text-gray-500 mt-8">Se ha notificado al paciente. La consulta comenzará automáticamente.</p>
    `;
    showScreen('waitingRoom');
}

function renderConsultationScreen() {
    consultationItems.length = 0; // Clear previous items
    screens.consultation.innerHTML = `
        <div class="flex-grow relative bg-black flex items-center justify-center">
            <div class="absolute top-4 left-4 bg-black/50 p-2 rounded-lg text-xs flex items-center gap-2">
                <i class="ph-microphone text-green-400 animate-pulse"></i>
                <span>Vitalis AI está escuchando...</span>
            </div>
            <img src="https://placehold.co/400x300/cccccc/333333?text=Video+del+Paciente" class="w-full h-full object-cover" alt="[Patient video]">
            <div class="absolute top-4 right-4 w-24 h-32 bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-700">
                 <img src="https://placehold.co/96x96/bfdbfe/1e3a8a?text=AP" class="w-full h-full object-cover" alt="[Doctor preview]">
            </div>
        </div>
        <div class="bg-white text-gray-800 p-2 h-2/5 flex flex-col">
            <div class="flex-shrink-0 flex border-b border-gray-200">
                <div class="segmented-control w-full mb-2">
                    <button class="clinical-tab-btn active" data-target="panel-triage">Triaje</button>
                    <button class="clinical-tab-btn" data-target="panel-soap">SOAP (IA)</button>
                    <button class="clinical-tab-btn" data-target="panel-exams">Exámenes</button>
                </div>
            </div>
            <div id="consultation-panel-container" class="flex-grow overflow-y-auto mt-2 px-2">
                <div id="panel-triage" class="clinical-panel-content text-sm space-y-2">
                    <p><strong>Talla:</strong> 1.75 m</p>
                    <p><strong>Peso:</strong> 80 kg</p>
                    <p><strong>Temperatura:</strong> 36.8 °C</p>
                    <p><strong>Presión Arterial:</strong> 145/92 mmHg</p>
                    <p><strong>Motivo de Consulta (previo):</strong> "Dolor de cabeza y mareos."</p>
                </div>
                <div id="panel-soap" class="clinical-panel-content hidden space-y-2">
                   <p class="text-center text-gray-400 text-sm">Las sugerencias de la IA aparecerán aquí mientras habla.</p>
                </div>
                <div id="panel-exams" class="clinical-panel-content hidden text-sm">
                    <a href="#" class="block p-2 rounded-md bg-gray-100 hover:bg-gray-200">Perfil_Lipidico_25-06-25.pdf</a>
                </div>
            </div>
        </div>
        <div class="bg-gray-800 p-3 flex justify-between items-center">
              <div class="flex space-x-2">
                <button id="capture-btn" class="bg-gray-700 text-white w-12 h-12 rounded-full flex items-center justify-center" title="Tomar Foto"><i class="ph-camera text-2xl"></i></button>
                <button id="manual-add-btn" class="bg-gray-700 text-white w-12 h-12 rounded-full flex items-center justify-center" title="Añadir/Editar Manualmente"><i class="ph-list-plus text-2xl"></i></button>
            </div>
              <button id="end-consultation-btn" class="bg-red-600 text-white font-bold py-3 px-6 rounded-full">Finalizar Consulta</button>
        </div>
    `;
    showScreen('consultation');
    simulateAIConsultation(); // This will populate consultationItems and render them
}

function renderReviewSignScreen(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const unconfirmedItems = task.items.filter(item => item.status === 'suggested' && ['order', 'follow-up', 'photo'].includes(item.type));
    const signButtonDisabled = unconfirmedItems.length > 0;

    screens.reviewSign.innerHTML = `
        <div class="flex items-center mb-4">
            <button id="back-to-home-from-review" class="text-2xl text-gray-600 mr-4"><i class="ph-arrow-left"></i></button>
            <h1 class="text-xl font-bold text-gray-800">Revisar y Firmar Registro</h1>
        </div>
        <div class="bg-white p-3 rounded-lg border mb-4">
             <p class="text-sm text-center"><span class="font-bold">Paciente:</span> ${task.patient} | <span class="font-bold">Fecha:</span> ${new Date().toLocaleDateString('es-PE')}</p>
        </div>
        <div class="space-y-4">
            <details class="bg-white rounded-lg border" open>
                <summary class="font-bold text-gray-800 p-3 cursor-pointer flex justify-between">S: Subjetivo <i class="ph-caret-down"></i></summary>
                <div class="p-3 border-t">
                    <textarea class="w-full h-24 p-2 border rounded-md text-sm">${task.items.find(item => item.type === 'subjective')?.content || ''}</textarea>
                </div>
            </details>
            <details class="bg-white rounded-lg border" open>
                <summary class="font-bold text-gray-800 p-3 cursor-pointer flex justify-between">O: Objetivo <i class="ph-caret-down"></i></summary>
                <div class="p-3 border-t">
                    <textarea class="w-full h-24 p-2 border rounded-md text-sm">${task.items.find(item => item.type === 'objective')?.content || ''}</textarea>
                </div>
            </details>
            <details class="bg-white rounded-lg border" open>
                <summary class="font-bold text-gray-800 p-3 cursor-pointer flex justify-between">A: Apreciación / Diagnóstico <i class="ph-caret-down"></i></summary>
                <div class="p-3 border-t space-y-2">
                    <div class="flex items-center gap-2 bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1.5 rounded-md">
                        <span class="flex-grow">I10 - Hipertensión Esencial (Primaria)</span>
                        <button class="text-blue-500"><i class="ph-x"></i></button>
                    </div>
                    <input type="text" placeholder="Añadir diagnóstico (CIE-10)..." class="w-full p-2 border rounded-md text-sm">
                </div>
            </details>
            <details class="bg-white rounded-lg border" open>
                <summary class="font-bold text-gray-800 p-3 cursor-pointer flex justify-between">P: Plan de Trabajo <i class="ph-caret-down"></i></summary>
                <div class="p-3 border-t space-y-3">
                    ${task.items.filter(item => ['order', 'follow-up', 'photo'].includes(item.type) && item.status !== 'discarded').map(order => `
                        <div class="p-3 border rounded-lg flex justify-between items-center ${order.status === 'confirmed' ? 'bg-gray-50' : 'bg-yellow-100 border-yellow-400'}">
                            <div>
                                <p class="font-bold text-sm">${order.title}</p>
                                <p class="text-sm text-gray-600">${order.content}</p>
                            </div>
                            <div class="flex flex-col space-y-1">
                                ${order.status !== 'confirmed' ? `<button class="review-confirm-btn text-xs bg-green-100 text-green-700 font-semibold px-2 py-1 rounded-full" data-task-id="${task.id}" data-item-id="${order.id}">Confirmar</button>` : ''}
                                <button class="review-edit-btn text-xs bg-gray-200 text-gray-700 font-semibold px-2 py-1 rounded-full" data-task-id="${task.id}" data-item-id="${order.id}">Editar</button>
                            </div>
                        </div>
                    `).join('') || '<p class="text-sm text-gray-500">No hay un plan de trabajo definido.</p>'}
                    <button class="w-full text-sm font-semibold text-blue-600 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 review-add-btn" data-task-id="${task.id}">Añadir Item al Plan</button>
                </div>
            </details>
        </div>
        <div class="mt-6">
             <h4 class="font-semibold mb-2 text-gray-800">Firma del Médico</h4>
            <div class="bg-gray-100 border-dashed border-2 border-gray-300 rounded-lg p-4 text-center">
                 <img src="https://placehold.co/200x50/000000/ffffff?text=Dra.+Ana+Pérez" alt="[Doctor's signature]" class="mx-auto">
             </div>
        </div>
        <div class="mt-2 text-center">
            <button id="sign-and-seal-btn" data-task-id="${task.id}" class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold ${signButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}" ${signButtonDisabled ? 'disabled' : ''}>Firmar y Sellar Registro</button>
            ${signButtonDisabled ? '<p class="text-xs text-red-600 mt-2">Debe confirmar todas las sugerencias del Plan de Trabajo antes de firmar.</p>' : ''}
        </div>
    `;
    showScreen('reviewSign');
}

function renderCommunityForum(filteredTopics = professionalData.forumTopics) {
    screens.communityForum.innerHTML = `
        <div class="flex items-center mb-4">
            <button class="back-to-development text-2xl text-gray-600 mr-4"><i class="ph-arrow-left"></i></button>
            <h1 class="text-xl font-bold text-gray-800">Foro de la Comunidad</h1>
        </div>
        <div class="flex gap-2 mb-4">
            <div class="relative flex-grow">
                <input type="text" id="forum-search-input" placeholder="Buscar en el foro..." class="w-full p-3 pl-10 border border-gray-300 rounded-lg bg-white">
                <i class="ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>
            <button id="new-topic-btn" class="bg-blue-600 text-white px-4 rounded-lg font-semibold flex items-center justify-center">
                <i class="ph-plus text-xl"></i>
            </button>
        </div>
        <div id="forum-topics-container" class="space-y-3">
            ${filteredTopics.map(topic => `
                <div class="bg-white p-4 rounded-lg border border-gray-200 cursor-pointer view-topic-btn" data-topic-id="${topic.id}">
                    <div class="flex justify-between items-start">
                        <h3 class="font-bold text-gray-800 mb-1 flex-grow">${topic.title}</h3>
                        <span class="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-800 whitespace-nowrap">${topic.category}</span>
                    </div>
                    <p class="text-xs text-gray-500">Por: ${topic.author} - ${topic.date}</p>
                    <div class="flex items-center justify-end text-sm text-gray-600 mt-2">
                        <i class="ph-chat-circle-dots mr-1"></i>
                        <span>${topic.comments.length} Comentarios</span>
                    </div>
                </div>
            `).join('') || '<p class="text-center text-gray-500 mt-8">No se encontraron temas.</p>'}
        </div>
    `;
}

function renderForumTopicDetail(topicId) {
    const topic = professionalData.forumTopics.find(t => t.id === topicId);
    if (!topic) return;

    screens.forumTopic.innerHTML = `
        <div class="flex items-center mb-4">
            <button class="back-to-forum text-2xl text-gray-600 mr-4"><i class="ph-arrow-left"></i></button>
            <h1 class="text-xl font-bold text-gray-800 truncate">${topic.title}</h1>
        </div>
        <div class="bg-white p-4 rounded-lg border mb-4">
            <div class="flex justify-between items-center mb-2">
                <p class="text-sm text-gray-600">Por <span class="font-semibold">${topic.author}</span> el ${topic.date}</p>
                <span class="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-800">${topic.category}</span>
            </div>
            <p class="text-gray-800">${topic.description}</p>
        </div>

        <h2 class="font-bold text-lg text-gray-800 mb-3">Comentarios (${topic.comments.length})</h2>
        <div id="comments-container" class="space-y-3 mb-4">
            ${topic.comments.map(comment => `
                <div class="bg-white p-3 rounded-lg border">
                    <p class="text-sm text-gray-800">${comment.text}</p>
                    <p class="text-xs text-gray-500 mt-2">-- <span class="font-semibold">${comment.author}</span>, ${comment.date}</p>
                </div>
            `).join('') || '<p class="text-sm text-gray-500 bg-white p-3 rounded-lg border">No hay comentarios aún. ¡Sé el primero en participar!</p>'}
        </div>

        <div class="bg-white p-3 rounded-lg border">
             <h3 class="font-semibold text-gray-700 mb-2">Añadir un Comentario</h3>
            <textarea id="new-comment-input" class="w-full p-2 border rounded-md h-20" placeholder="Escribe tu comentario..."></textarea>
             <button id="submit-comment-btn" data-topic-id="${topic.id}" class="w-full bg-blue-600 text-white py-2 mt-2 rounded-lg font-semibold">Enviar Comentario</button>
        </div>
    `;
}

function openNewTopicModal() {
    showModal(`
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="font-bold text-lg text-gray-800">Iniciar Nuevo Tema de Debate</h2>
                    <button class="modal-close-btn text-gray-500"><i class="ph-x text-xl"></i></button>
                </div>
                <div class="space-y-3">
                    <input id="new-topic-title" type="text" placeholder="Título del Tema" class="w-full p-2 border rounded-md">
                    <textarea id="new-topic-description" class="w-full p-2 border rounded-md h-24" placeholder="Describe el tema o tu pregunta inicial..."></textarea>
                    <select id="new-topic-category" class="w-full p-2 border rounded-md bg-white">
                        <option value="" disabled selected>Seleccionar Categoría</option>
                         <option>Cardiología</option>
                         <option>Pediatría</option>
                         <option>Ginecología</option>
                         <option>Tecnología Médica</option>
                         <option>Casos Clínicos</option>
                         <option>General</option>
                    </select>
                </div>
                <div class="flex space-x-2 mt-6">
                    <button class="modal-close-btn w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold">Cancelar</button>
                    <button id="submit-new-topic-btn" class="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold">Publicar Tema</button>
                </div>
            </div>
        </div>
    `);
}

function renderLoginScreen() {
    screens.login.innerHTML = `
        <div class="w-full max-w-sm text-center">
            <i class="ph-heartbeat text-6xl text-blue-500 mx-auto mb-4"></i>
            <h1 class="text-3xl font-bold text-gray-800">Tu salud, en un solo lugar</h1>
            <p class="text-gray-500 mt-2 mb-8">Toma el control de tus citas, tratamientos y bienestar con Vitalis.</p>
            <div class="space-y-3">
                <button id="google-login-btn" class="btn-primary w-full !bg-white !text-gray-800 border border-gray-300">
                    <svg class="w-5 h-5 mr-3" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
                    Continuar con Google
                </button>
                <button id="continue-email-btn" class="btn-primary w-full">
                    Continuar con Correo
                </button>
                <p class="text-sm text-gray-600 pt-4">¿No tienes una cuenta? <a href="#" id="register-link" class="font-bold text-blue-500">Regístrate</a></p>
            </div>
        </div>
    `;
}

function renderEmailLoginScreen() {
    screens.emailLogin.innerHTML = `
        <div class="w-full max-w-sm text-center">
            <button id="back-to-main-login" class="absolute top-6 left-6 text-2xl text-gray-600"><i class="ph-arrow-left"></i></button>
            <h1 class="text-2xl font-bold text-slate-800 mt-4">Iniciar Sesión</h1>
            <p class="text-slate-500 mt-1 mb-6">Ingrese a su cuenta para continuar.</p>
            <div class="space-y-4 text-left">
                <input type="email" placeholder="Correo electrónico" value="ana.perez@vitalis.ai" class="w-full p-3 border border-slate-300 rounded-lg">
                <input type="password" placeholder="Contraseña" value="************" class="w-full p-3 border border-slate-300 rounded-lg">
            </div>
            <a href="#" id="forgot-password-link" class="text-sm text-slate-600 mt-4 block text-center">Olvidé mi contraseña</a>
            <button id="login-btn" class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold mt-4">Iniciar Sesión</button>
            <p class="text-xs text-slate-500 mt-4">¿Nuevo en Vitalis? <a href="#" id="register-link-from-email" class="font-semibold text-blue-600">Regístrese aquí</a></p>
        </div>
    `;
}

function renderOnboardingScreen() { // Kept for register success redirect logic, content moved to renderRegisterSuccessScreen
    renderRegisterSuccessScreen(); // Redirect to the new success screen
}


function renderRegisterSuccessScreen() {
    screens.registerSuccess.innerHTML = `
        <i class="ph-check-circle text-6xl text-green-500"></i>
        <h1 class="text-2xl font-bold text-gray-800 mt-4">¡Registro Enviado!</h1>
        <p class="text-gray-600 mt-2 max-w-sm">Gracias por unirte a Vitalis AI. Nuestro equipo administrativo validará tus credenciales y documentos.</p>
        <p class="text-gray-600 mt-2 max-w-sm">Recibirás una notificación por correo y SMS en un plazo de 24-48 horas una vez que tu perfil sea aprobado y habilitado para atender citas.</p>
        <button class="back-to-login-btn w-full max-w-sm bg-blue-600 text-white py-3 rounded-lg font-semibold mt-8">Volver al Inicio de Sesión</button>
    `;
}

function renderRegisterScreen() {
    screens.register.innerHTML = `
        <div class="flex items-center mb-4">
            <button id="back-to-login-from-register" class="text-2xl text-gray-600 mr-4"><i class="ph-arrow-left"></i></button>
            <h1 class="text-xl font-bold text-gray-800">Registro de Médico</h1>
        </div>
        <div class="space-y-4">
            <input type="text" placeholder="Nombre completo" class="w-full p-3 border border-slate-300 rounded-lg bg-white">
            <input type="tel" placeholder="Número de celular" class="w-full p-3 border border-slate-300 rounded-lg bg-white">
            <input type="text" placeholder="Número de CMP" class="w-full p-3 border border-slate-300 rounded-lg bg-white">
            <div>
                <label for="dni-upload" class="w-full text-center bg-white p-3 border border-slate-300 rounded-lg flex items-center justify-center gap-2 cursor-pointer">
                    <i class="ph-upload-simple"></i>
                    <span>Adjuntar DNI (Foto o PDF)</span>
                </label>
                <input type="file" id="dni-upload" class="hidden">
            </div>
            <input type="text" placeholder="Código de referido (opcional)" class="w-full p-3 border border-slate-300 rounded-lg bg-white">
            <div class="flex items-start space-x-3">
                <input type="checkbox" id="terms-checkbox" class="mt-1 h-4 w-4">
                <label for="terms-checkbox" class="text-xs text-gray-600">
                    He leído y acepto los <a href="#" class="text-blue-600 font-semibold">Términos y Condiciones</a> y la <a href="#" class="text-blue-600 font-semibold">Política de Privacidad</a> de Vitalis AI.
                </label>
            </div>
            <button id="register-form-btn" class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold mt-4">Registrarse</button>
        </div>
    `;
}

function renderVerifySignatureScreen() {
    screens.verifySignature.innerHTML = `
        <div class="w-full max-w-sm text-center">
            <i class="ph-fingerprint text-6xl text-blue-600"></i>
            <h1 class="text-2xl font-bold text-slate-800 mt-4">Validación de Doble Firma</h1>
            <p class="text-slate-500 mt-1 mb-6">Hemos enviado un código de 6 dígitos a tu celular para confirmar tu identidad.</p>
            <input type="text" id="signature-code" placeholder="------" maxlength="6" class="w-full text-center tracking-[1em] text-3xl font-bold p-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none mb-6">
            <button id="verify-signature-btn" class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold">Confirmar Firma</button>
            <button class="back-to-login-btn text-sm text-slate-600 mt-4">Volver al Inicio de Sesión</button>
        </div>
    `;
}

function renderForgotPasswordScreen() {
     screens.forgotPassword.innerHTML = `
         <div class="w-full max-w-sm text-center">
            <i class="ph-key text-6xl text-blue-600"></i>
            <h1 class="text-2xl font-bold text-slate-800 mt-4">Recuperar Contraseña</h1>
            <p class="text-slate-500 mt-1 mb-6">Ingresa tu correo electrónico registrado y te enviaremos las instrucciones.</p>
            <input type="email" placeholder="Correo electrónico" class="w-full p-3 border border-slate-300 rounded-lg bg-white mb-4">
            <button id="recover-password-btn" class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold">Recuperar Contraseña</button>
            <button class="back-to-login-btn text-sm text-slate-600 mt-4">Volver al Inicio de Sesión</button>
        </div>
    `;
}

function renderForgotSuccessScreen() {
     screens.forgotSuccess.innerHTML = `
        <i class="ph-paper-plane-tilt text-6xl text-green-500"></i>
        <h1 class="text-2xl font-bold text-gray-800 mt-4">Correo Enviado</h1>
        <p class="text-gray-600 mt-2 max-w-sm">Se han enviado las instrucciones para recuperar tu contraseña a tu correo electrónico.</p>
        <button class="back-to-login-btn w-full max-w-sm bg-blue-600 text-white py-3 rounded-lg font-semibold mt-8">Volver al Inicio de Sesión</button>
    `;
}


function setupDragToConfirm() {
    const draggable = document.getElementById('draggable-icon');
    if (!draggable) return;

    const dropTargetRight = document.getElementById('drop-target-right');
    const container = draggable.parentElement;

    let isDragging = false;
    let initialX;
    let xOffset = 0;
    let currentAmount = 0;
    let currentDestination = '';
    const dragStart = (e) => {
        if (document.getElementById('drag-to-confirm-container').classList.contains('hidden')) return;
        e.preventDefault();
        isDragging = true;
        draggable.style.transition = 'none';
        draggable.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.2), 0 8px 10px -6px rgba(0,0,0,0.2)';
        currentAmount = parseFloat(draggable.dataset.amount);
        currentDestination = draggable.dataset.destination;

        const rect = draggable.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        initialX = (e.type === 'touchstart' ? e.touches[0].clientX : e.clientX) - (rect.left - containerRect.left);
    };
    const drag = (e) => {
        if (!isDragging) return;
        e.preventDefault();

        let currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        xOffset = currentX - initialX;

        const containerWidth = container.offsetWidth;
        const draggableWidth = draggable.offsetWidth;
        const maxOffset = containerWidth - draggableWidth - 2; // 2px padding

        xOffset = Math.max(0, Math.min(xOffset, maxOffset));
        draggable.style.transform = `translateX(${xOffset}px)`;

        const draggableRect = draggable.getBoundingClientRect();
        const rightRect = dropTargetRight.getBoundingClientRect();
        if (draggableRect.right >= rightRect.left + (rightRect.width / 2)) {
            dropTargetRight.parentElement.style.backgroundColor = '#E8F5E9';
        } else {
            dropTargetRight.parentElement.style.backgroundColor = '#F5F5F5';
        }
    };
    const dragEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        draggable.style.transition = 'transform 0.2s ease-out, box-shadow 0.2s ease-out';
        draggable.style.boxShadow = '';
        dropTargetRight.parentElement.style.backgroundColor = '#F5F5F5';
        const draggableRect = draggable.getBoundingClientRect();
        const rightRect = dropTargetRight.getBoundingClientRect();

        if (draggableRect.right >= rightRect.left + (rightRect.width / 2)) {
            const amount = currentAmount;
            const destination = currentDestination;

            if (amount > 0 && destination) {
                const oldBalance = financialData.balance;
                financialData.balance -= amount;
                const newTransactionId = `VIT-${Date.now()}`;
                financialData.lastWithdrawalId = newTransactionId;
                financialData.transactions.unshift({
                    id: newTransactionId,
                    date: new Date().toLocaleString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'}),
                    description: `Retiro a ${destination}`,
                    amount: -amount
                });
                showToast(`Retiro de S/ ${amount.toFixed(2)} exitoso.`);

                const dragContainer = document.getElementById('drag-to-confirm-container');
                dragContainer.classList.add('hidden');

                renderFinancialScreen();
                setTimeout(() => {
                    const balanceEl = document.getElementById('financial-balance');
                    if (balanceEl) {
                        balanceEl.textContent = `S/ ${oldBalance.toLocaleString('es-PE', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
                        animateValue(balanceEl, oldBalance, financialData.balance, 1000, true, 'S/');
                    }
                }, 50);
            }
        }

        draggable.style.transform = `translateX(0px)`;
    };

    draggable.addEventListener('mousedown', dragStart);
    draggable.addEventListener('touchstart', dragStart, { passive: false });
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchend', dragEnd);
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, { passive: false });
}

function activateSlideToConfirm(amount, name, number) {
    hideModal();
    const container = document.getElementById('drag-to-confirm-container');
    const labelLeft = document.getElementById('drag-label-left');
    const labelRight = document.getElementById('drag-label-right');
    const draggable = document.getElementById('draggable-icon');
    if (container && labelLeft && labelRight && draggable) {
        labelLeft.textContent = `S/ ${amount.toLocaleString('es-PE', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        labelRight.innerHTML = `>> ${name}<br><span class="text-xs">${number}</span>`;
        draggable.dataset.amount = amount;
        draggable.dataset.destination = `${name} - ${number}`;
        draggable.style.transform = 'translateX(0)';
        container.classList.remove('hidden');
        showToast("Desliza el ícono para confirmar");
    }
}

function openWithdrawAmountModal() {
     showModal(`
         <div class="modal-overlay visible">
             <div class="modal-content text-center">
                 <h2 class="text-xl font-semibold text-[#212529] mb-2">Retirar Fondos</h2>
                 <p class="text-sm text-gray-500 mb-4">Ingresa el monto que deseas retirar.</p>
                 <input id="withdraw-amount-input" type="number" placeholder="S/ 0.00" class="w-full text-center text-4xl font-bold p-2 border-b-2 border-gray-300 focus:border-green-500 outline-none mb-6">
                 <div class="flex space-x-3">
                     <button class="modal-close-btn w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold">Cancelar</button>
                     <button id="next-to-method-btn" class="w-full bg-[#28A745] text-white py-3 rounded-lg font-semibold">Siguiente</button>
                 </div>
             </div>
         </div>
     `);
}

function openWithdrawMethodModal(amount) {
    showModal(`
        <div class="modal-overlay visible">
            <div class="modal-content">
                <h2 class="font-bold text-lg text-gray-800 mb-4">Seleccionar Destino</h2>
                <div class="space-y-3">
                    <button class="withdraw-method-btn w-full text-left bg-white p-4 rounded-lg border flex items-center gap-3" data-method="savings" data-amount="${amount}">
                        <i class="ph-bank text-2xl text-gray-500"></i>
                        <span>Cuenta Bancaria</span>
                    </button>
                    <button class="withdraw-method-btn w-full text-left bg-white p-4 rounded-lg border flex items-center gap-3" data-method="yape" data-amount="${amount}">
                        <img src="https://seeklogo.com/images/Y/yape-logo-343361418C-seeklogo.com.png" alt="[Icon of Yape]" class="h-6" onerror="this.style.display='none'">
                        <span>Yape</span>
                    </button>
                    <button class="withdraw-method-btn w-full text-left bg-white p-4 rounded-lg border flex items-center gap-3" data-method="plin" data-amount="${amount}">
                        <img src="https://www.plin.com.pe/logo-plin.png" alt="[Icon of Plin]" class="h-5" onerror="this.style.display='none'">
                        <span>Plin</span>
                    </button>
                </div>
                <button class="modal-close-btn mt-4 w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold">Cancelar</button>
            </div>
        </div>
    `);
}

function showAddBankAccountModal(amount = null) {
     showModal(`
         <div class="modal-overlay visible">
             <div class="modal-content">
                 <h2 class="font-bold text-lg text-gray-800 mb-4">Añadir Cuenta Bancaria</h2>
                 <div class="space-y-3">
                     <select id="bank-name" class="w-full p-2 border rounded-md bg-white">
                         <option value="" disabled selected>Seleccionar Banco</option>
                         <option value="BCP">BCP</option>
                         <option value="Interbank">Interbank</option>
                         <option value="BBVA">BBVA</option>
                         <option value="Otro">Otro</option>
                     </select>
                     <input id="account-number" type="text" placeholder="Número de Cuenta" class="w-full p-2 border rounded-md">
                     <div id="cci-container" class="hidden">
                         <input id="cci-number" type="text" placeholder="Cuenta Interbancaria (CCI)" class="w-full p-2 border rounded-md">
                     </div>
                     <div class="bg-gray-100 p-2 rounded-md text-center">
                         <p class="text-sm text-gray-500">Titular</p>
                         <p id="holder-name-display" class="font-bold text-gray-800">...</p>
                     </div>
                 </div>
                 <div class="flex space-x-2 mt-4">
                     <button class="modal-close-btn w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold">Cancelar</button>
                      <button id="save-bank-account-btn" data-amount="${amount || ''}" class="w-full bg-green-500 text-white py-2 rounded-lg font-semibold">Continuar</button>
                 </div>
             </div>
         </div>
     `);
}

function showAddYapePlinModal(method, amount = null) {
    showModal(`
        <div class="modal-overlay visible">
            <div class="modal-content">
                <h2 class="font-bold text-lg text-gray-800 mb-4">Añadir número de ${method}</h2>
                 <div class="space-y-3">
                     <input id="yape-plin-number" type="tel" placeholder="Número de celular" class="w-full p-2 border rounded-md" maxlength="9">
                     <div class="bg-gray-100 p-2 rounded-md text-center">
                         <p class="text-sm text-gray-500">Titular</p>
                         <p id="holder-name-display" class="font-bold text-gray-800">...</p>
                     </div>
                </div>
                <div class="flex space-x-2 mt-4">
                     <button class="modal-close-btn w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold">Cancelar</button>
                     <button id="save-yape-plin-btn" data-method="${method}" data-amount="${amount || ''}" class="w-full bg-green-500 text-white py-2 rounded-lg font-semibold">Continuar</button>
                </div>
            </div>
        </div>
    `);
}

function showReceiptModal(transaction) {
     const receiptHtml = `
         <div id="receipt-content" class="bg-white p-6 rounded-lg text-center">
             <i class="ph-check-circle-fill text-6xl text-green-500"></i>
             <h2 class="text-xl font-bold text-gray-800 mt-2">Retiro Exitoso</h2>
             <p class="text-4xl font-bold text-gray-800 my-4">S/ ${Math.abs(transaction.amount).toLocaleString('es-PE', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
             <div class="text-left space-y-3 border-t border-b py-4">
                 <div class="flex justify-between"><span class="text-gray-500">Para:</span><span class="font-semibold">${transaction.description.replace('Retiro a ', '')}</span></div>
                 <div class="flex justify-between"><span class="text-gray-500">Fecha y hora:</span><span class="font-semibold">${transaction.date}</span></div>
                 <div class="flex justify-between"><span class="text-gray-500">Cód. de Operación:</span><span class="font-semibold">${transaction.id}</span></div>
             </div>
         </div>
     `;
    const message = `*Comprobante de Retiro Vitalis AI*%0A%0A*Monto:* S/ ${Math.abs(transaction.amount).toFixed(2)}%0A*Destino:* ${transaction.description.replace('Retiro a ', '')}%0A*Fecha y Hora:* ${transaction.date}%0A*Código de Operación:* ${transaction.id}`;
    showModal(`
        <div class="modal-overlay visible">
            <div class="modal-content !p-0">
                ${receiptHtml}
                <div class="p-6">
                    <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(message)}" target="_blank" class="block w-full bg-green-500 text-white py-3 rounded-lg font-semibold text-center flex items-center justify-center gap-2">
                        <i class="ph-whatsapp-logo"></i>Compartir por WhatsApp
                    </a>
                    <button class="modal-close-btn mt-2 w-full text-gray-600 py-2 rounded-lg font-semibold">Cerrar</button>
                </div>
            </div>
        </div>
    `);
}

function openApplyForTalkModal(rewardId) {
    const reward = professionalData.rewards.find(r => r.id === rewardId);
    if (!reward) return;

    showModal(`
        <div class="modal-overlay visible">
            <div class="modal-content">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="font-bold text-lg text-gray-800">Postular a Ponencia</h2>
                    <button class="modal-close-btn text-gray-500"><i class="ph-x text-xl"></i></button>
                </div>
                <p class="text-sm text-gray-600 mb-4">Completa los detalles para tu postulación a "${reward.title}". Se descontarán ${reward.cost} puntos al enviar.</p>
                <div class="space-y-3">
                    <input type="text" id="talk-title" placeholder="Título de la Ponencia" class="w-full p-2 border rounded-md">
                    <textarea id="talk-description" class="w-full p-2 border rounded-md h-24" placeholder="Breve descripción..."></textarea>
                    <div class="grid grid-cols-2 gap-2">
                        <input type="date" id="talk-date" class="w-full p-2 border rounded-md">
                        <input type="time" id="talk-time" class="w-full p-2 border rounded-md">
                    </div>
                    <div>
                        <label for="talk-file" class="text-sm font-medium text-gray-700">Adjuntar archivo (opcional)</label>
                        <input type="file" id="talk-file" class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
                    </div>
                </div>
                <div class="flex space-x-2 mt-6">
                    <button class="modal-close-btn w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold">Cancelar</button>
                    <button id="submit-talk-application-btn" data-reward-id="${reward.id}" class="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold">Enviar Postulación</button>
                </div>
            </div>
        </div>
    `);
}

function openChangePasswordModal() {
    showModal(`
        <div class="modal-overlay visible">
            <div class="modal-content">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="font-bold text-lg text-gray-800">Cambiar Contraseña</h2>
                    <button class="modal-close-btn text-gray-500"><i class="ph-x text-xl"></i></button>
                </div>
                <div class="space-y-3">
                    <input type="password" placeholder="Contraseña Actual" class="w-full p-2 border rounded-md">
                    <input type="password" placeholder="Nueva Contraseña" class="w-full p-2 border rounded-md">
                    <input type="password" placeholder="Confirmar Nueva Contraseña" class="w-full p-2 border rounded-md">
                </div>
                <div class="flex space-x-2 mt-6">
                    <button class="modal-close-btn w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold">Cancelar</button>
                    <button id="confirm-password-change-btn" class="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold">Guardar Cambios</button>
                </div>
            </div>
        </div>
    `);
}

function renderConsultationItems() {
    const container = document.getElementById('panel-soap');
    if (!container) return;

    const visibleItems = consultationItems.filter(item => item.status !== 'discarded');
    if (visibleItems.length === 0) {
        container.innerHTML = `<p class="text-center text-gray-400 text-sm">Las sugerencias de la IA aparecerán aquí mientras habla.</p>`;
        return;
    }

    container.innerHTML = visibleItems.map(item => {
        const isConfirmed = item.status === 'confirmed';
        const cardClass = isConfirmed ? 'ai-confirmed-card' : 'ai-suggestion-card';
        const actionsHtml = isConfirmed
            ? `<button class="ai-edit-btn text-xs bg-gray-200 text-gray-700 font-semibold px-2 py-1 rounded-full">Editar</button>`
            : `<button class="ai-confirm-btn text-xs bg-indigo-100 text-indigo-700 font-semibold px-2 py-1 rounded-full">Confirmar</button>
               <button class="ai-discard-btn text-xs bg-gray-200 text-gray-700 font-semibold px-2 py-1 rounded-full">Descartar</button>`;

        return `
            <div class="${cardClass} card" data-id="${item.id}" data-type="${item.type}">
                <div class="flex items-start gap-3">
                    <i class="ph-${item.icon} text-xl text-indigo-600 mt-1"></i>
                    <div>
                        <h4 class="font-bold text-xs text-indigo-800">${item.title}</h4>
                        <p class="text-sm text-gray-800">${item.content}</p>
                        <div class="flex space-x-2 mt-2 ai-actions">
                            ${actionsHtml}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function openManualAddModal(itemIdToEdit = null, fromReview = false, taskId = null) {
    const targetArray = fromReview ? tasks.find(t => t.id === taskId)?.items : consultationItems;
    if (!targetArray) return;

    const suggestedItems = targetArray.filter(item => item.status === 'suggested');
    const itemToEdit = targetArray.find(item => item.id === itemIdToEdit);

    let optionsHtml = suggestedItems.map(item => `<option value="${item.id}">Editar sugerencia: ${item.title}</option>`).join('');
    optionsHtml += `
        <option value="prescription" ${itemToEdit ? 'disabled' : ''}>Añadir nueva Prescripción</option>
        <option value="lab_order" ${itemToEdit ? 'disabled' : ''}>Añadir nueva Orden de Lab.</option>
        <option value="certificate" ${itemToEdit ? 'disabled' : ''}>Añadir nuevo Certificado</option>
    `;
    const modalContent = itemToEdit ? itemToEdit.content : '';
    const modalTitle = itemToEdit ? `Editar: ${itemToEdit.title}` : 'Añadir/Editar Plan de Trabajo';
    showModal(`
        <div class="modal-overlay">
            <div class="modal-content">
                <h2 class="font-bold text-lg text-gray-800 mb-4">${modalTitle}</h2>
                <select id="manual-item-select" class="w-full p-2 border rounded-md mb-2 ${itemToEdit ? 'hidden' : ''}">
                    ${optionsHtml}
                </select>
                <div class="textarea-container">
                    <textarea id="manual-item-content" class="w-full p-2 pr-10 border rounded-md h-24" placeholder="Detalles...">${modalContent}</textarea>
                    <button class="dictate-icon-btn"><i class="ph-microphone"></i></button>
                </div>
                <div class="flex space-x-2 mt-4">
                    <button class="w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold modal-close-btn">Cancelar</button>
                    <button id="confirm-manual-add-btn" data-task-id="${taskId || ''}" data-from-review="${fromReview}" class="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold">Guardar</button>
                </div>
            </div>
        </div>
    `);

    const select = document.getElementById('manual-item-select');
    const textarea = document.getElementById('manual-item-content');
    if (itemToEdit) {
        select.innerHTML = `<option value="${itemToEdit.id}" selected>${itemToEdit.title}</option>`;
        select.disabled = true;
    }

    select.addEventListener('change', (e) => {
        const selectedId = parseInt(e.target.value);
        if (!isNaN(selectedId)) {
            const selectedItem = targetArray.find(i => i.id === selectedId);
            textarea.value = selectedItem ? selectedItem.content : '';
        } else {
            textarea.value = '';
        }
    });
}

function openScheduleModal() {
     showModal(`
         <div class="modal-overlay">
             <div class="modal-content">
                 <div class="flex justify-between items-center mb-4">
                     <h2 class="text-xl font-bold text-slate-800">Definir Horarios</h2>
                     <button class="modal-close-btn text-2xl text-slate-500 hover:text-slate-800">&times;</button>
                 </div>
                   <div class="space-y-4">
                       <div>
                           <p class="text-sm font-semibold text-slate-700 mb-2">Seleccionar días:</p>
                           <div class="grid grid-cols-7 gap-1 text-center">
                               <button class="day-selector-btn rounded-full p-2 text-xs font-bold" data-day="Lunes">L</button>
                               <button class="day-selector-btn rounded-full p-2 text-xs font-bold" data-day="Martes">M</button>
                               <button class="day-selector-btn rounded-full p-2 text-xs font-bold" data-day="Miércoles">M</button>
                               <button class="day-selector-btn rounded-full p-2 text-xs font-bold" data-day="Jueves">J</button>
                               <button class="day-selector-btn rounded-full p-2 text-xs font-bold" data-day="Viernes">V</button>
                               <button class="day-selector-btn rounded-full p-2 text-xs font-bold" data-day="Sábado">S</button>
                               <button class="day-selector-btn rounded-full p-2 text-xs font-bold" data-day="Domingo">D</button>
                           </div>
                       </div>
                       <div id="time-slots-editor" class="space-y-2">
                           <div class="flex items-center space-x-2 time-slot-row">
                               <input type="time" class="w-full p-2 border rounded-lg bg-white" value="09:00">
                               <span>-</span>
                               <input type="time" class="w-full p-2 border rounded-lg bg-white" value="11:00">
                               <button class="remove-timeslot-btn text-red-500 hover:text-red-700 p-1">
                                    <i class="ph-trash text-xl"></i>
                               </button>
                           </div>
                       </div>
                       <button class="add-timeslot-btn w-full text-sm font-semibold text-blue-600 py-2 rounded-lg bg-blue-50 hover:bg-blue-100">Añadir otro horario</button>
               </div>
                   <button id="save-schedule-btn" class="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold mt-6">Guardar Horarios</button>
             </div>
         </div>
     `);
}

function simulateAIConsultation() {
    const suggestions = [
        { id: 1, type: 'subjective', icon: 'chat-circle-dots', title: 'SÍNTOMA DETECTADO', content: 'Paciente refiere persistencia de cefalea occipital de intensidad 7/10 desde hace 3 días, que no cede con analgésicos comunes. Reporta buena adherencia al tratamiento para HTA pero olvidó tomar la medicación ayer. Niega otros síntomas.', status: 'suggested' },
        { id: 2, type: 'objective', icon: 'heartbeat', title: 'SIGNO VITAL DETECTADO', content: 'Funciones Vitales: PA: 150/95 mmHg, FC: 88 lpm, FR: 18 rpm, T: 36.8°C.', status: 'suggested' },
        { id: 3, type: 'order', icon: 'pill', title: 'PRESCRIPCIÓN SUGERIDA', content: 'Losartán 50mg, 1 tableta cada 12 horas por 30 días.', status: 'suggested' },
        { id: 4, type: 'order', icon: 'test-tube', title: 'ORDEN DE LABORATORIO SUGERIDA', content: 'Perfil Lipídico, Glucosa.', status: 'suggested' },
        { id: 5, type: 'order', icon: 'bed', title: 'CERTIFICADO DE DESCANSO SUGERIDO', content: '3 días a partir de 05/07/2025.', status: 'suggested' },
        { id: 6, type: 'follow-up', icon: 'calendar-plus', title: 'PRÓXIMA CITA SUGERIDA', content: 'Control en 2 semanas o según resultados de laboratorio.', status: 'suggested' },
    ];
    consultationItems.push(...suggestions); // Add to existing items

    setTimeout(() => {
        renderConsultationItems();
    }, 1000);
}

function generatePDF(patientId) {
    const patient = patientsDB.find(p => p.id === patientId);
    if (!patient) {
        showToast("Error al generar PDF: Paciente no encontrado.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const margin = 14;
    let y = 22;
    function checkPageBreak(requiredHeight) {
        if (y + requiredHeight > pageHeight - margin) {
            doc.addPage();
            y = margin;
        }
    }

    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text("Historia Clínica 360° - Vitalis AI", margin, y);
    y += 10;
    doc.setFontSize(14);
    doc.text(`Paciente: ${patient.name}`, margin, y);
    y += 6;
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(patient.details, margin, y);
    y += 6;
    doc.text(`Alergias: ${patient.allergies}`, margin, y);
    y += 10;

    patient.consultations.forEach(consult => {
        checkPageBreak(20);
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0);
        doc.text(`Consulta: ${consult.date} - ${consult.doctor}`, margin, y);
        y += 8;

        checkPageBreak(15);
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text("Triaje:", margin + 2, y);
        y += 5;
        doc.setFont(undefined, 'normal');
        let triageText = Object.entries(consult.triage).map(([k, v]) => `${k}: ${v}`).join(' | ');
        doc.text(triageText, margin + 2, y);
        y += 8;

        const addSOAPSection = (title, content) => {
            checkPageBreak(10);
            doc.setFont(undefined, 'bold');
            doc.text(title, margin + 2, y);
            y += 5;
            doc.setFont(undefined, 'normal');
            const splitContent = doc.splitTextToSize(content, 170);
            checkPageBreak(splitContent.length * 5);
            doc.text(splitContent, margin + 2, y);
            y += (splitContent.length * 5) + 3;
        };

        addSOAPSection("S: Subjetivo", consult.soap.s);
        addSOAPSection("O: Objetivo", consult.soap.o);
        addSOAPSection("A: Apreciación", consult.soap.a);
        addSOAPSection("P: Plan", consult.soap.p);

        if (consult.exams.length > 0) {
            checkPageBreak(10);
            doc.setFont(undefined, 'bold');
            doc.text("Exámenes y Documentos:", margin + 2, y);
            y += 5;
            doc.setFont(undefined, 'normal');
            consult.exams.forEach(exam => {
               checkPageBreak(5);
               doc.text(`- ${exam.name} (${exam.file})`, margin + 4, y);
               y += 5;
            });
        }

        y += 5;
        if (patient.consultations.indexOf(consult) < patient.consultations.length - 1) {
            doc.setDrawColor(200);
            doc.line(margin, y, 196, y);
            y += 8;
        }
    });
    doc.save(`Historia_Clinica_${patient.name.replace(' ', '_')}.pdf`);
    showToast("Descargando PDF de la historia clínica completa.");
}


export {
    screens,
    navItems,
    header,
    bottomNav,
    fab,
    toast,
    modalContainer,
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
    renderOnboardingScreen,
    renderRegisterSuccessScreen,
    renderRegisterScreen,
    renderVerifySignatureScreen,
    renderForgotPasswordScreen,
    renderForgotSuccessScreen,
    setupDragToConfirm,
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
    simulateAIConsultation,
    generatePDF
};
