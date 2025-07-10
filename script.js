document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const screens = {
        login: document.getElementById('screen-login'), // New: main login
        emailLogin: document.getElementById('screen-email-login'), // New: email login
        onboarding: document.getElementById('screen-onboarding'), // Keep for register success redirect
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
    // --- Mock Backend for Name Lookups ---
    const mockApiDatabase = {
        yape: { '987654321': 'ANA M. PEREZ G.' },
        plin: { '912345678': 'ANA PEREZ' },
        bank: { '19112345678099': 'ANA MARIA PEREZ GARCIA' }
    };
    // --- Database ---
    let financialData = {
        balance: 9450,
        piggyBank: 300,
        transactions: [
            { id: `VIT-${Date.now() - 10000}`, date: '04/07/2025', description: 'Consulta - Jorge García', amount: 150 },
            { id: `VIT-${Date.now() - 20000}`, date: '02/07/2025', description: 'Consulta - María López', amount: 150 },
            { id: `VIT-${Date.now() - 30000}`, date: '01/07/2025', description: 'Retiro a Cuenta BCP', amount: -2000 },
            { id: `VIT-${Date.now() - 40000}`, date: '28/06/2025', description: 'Consulta - Carlos Mendoza', amount: 150 },
        ],
        bankAccounts: [], // Start empty
        yape: null, // Start empty
        plin: null, // Start empty
        lastWithdrawalId: null
    };
    let referralsDB = [
        { name: 'Dr. Carlos Martínez', date: '15/06/2025', status: 'Completado', earnings: 50 },
        { name: 'Dra. Lucía Torres', date: '22/06/2025', status: 'Completado', earnings: 50 },
        { name: 'Dr. Javier Ríos', date: '01/07/2025', status: 'Pendiente', earnings: 0 }
    ];
    let professionalData = {
        points: 1235,
        level: 'Médico Senior',
        nextLevel: 'Médico Confiable',
        nextLevelPoints: 1250,
        rewards: [
            { id: 1, title: 'Ser Ponente en Evento Virtual', description: 'Postula un tema para dar una conferencia a la comunidad de pacientes y aumenta tu visibilidad.', cost: 150, type: 'apply', claimed: false, status: 'available' },
            { id: 2, title: 'Acceso a Herramientas Premium IA', description: 'Acceso anticipado a nuevas funcionalidades de diagnóstico avanzado.', cost: 300, type: 'redeem', claimed: false },
            { id: 3, title: 'Asesoría de Marca Personal', description: 'Sesiones uno a uno con expertos en marketing digital para potenciar tu presencia en línea.', cost: 450, type: 'redeem', claimed: false },
        ],
        forumTopics: [
            {
                id: 1,
                title: 'Manejo de la Hipertensión Arterial en Pacientes Diabéticos',
                description: 'Abro este hilo para discutir las últimas guías y nuestras experiencias clínicas en el manejo de la HTA en pacientes con DM2. ¿Cuáles son sus esquemas de tratamiento preferidos? ¿Cómo abordan la inercia terapéutica?',
                category: 'Cardiología',
                author: 'Dr. Carlos Martínez',
                date: '03/07/2025',
                comments: [
                    { id: 101, author: 'Dra. Lucía Torres', text: 'Excelente tema. Personalmente, he tenido buenos resultados iniciando con un IECA/ARA II y un bloqueador de los canales de calcio. Es crucial monitorizar la función renal.', date: '04/07/2025' },
                    { id: 102, author: 'Dra. Ana Pérez', text: 'Concuerdo, Dra. Torres. También es importante la educación al paciente sobre la adherencia. Muchos no entienden la conexión entre ambas patologías.', date: '05/07/2025' }
                ]
            },
            {
                id: 2,
                title: 'Uso de la Inteligencia Artificial en el Diagnóstico por Imágenes',
                description: '¿Qué herramientas de IA están utilizando actualmente para analizar radiografías o tomografías? Me interesa conocer plataformas y su precisión en la práctica diaria.',
                category: 'Tecnología Médica',
                author: 'Dr. Javier Ríos',
                date: '02/07/2025',
                comments: []
            }
        ]
    };
    let patientsDB = [
        {
            id: 1,
            name: 'Jorge García',
            details: '34 años, Masculino, 1.75m, 80kg',
            avatar: 'https://placehold.co/80x80/dbeafe/1e3a8a?text=JG',
            allergies: 'Penicilina',
            adherence: 85,
            consultations: [
                {
                    date: '04/07/2025',
                    doctor: 'Dra. Ana Pérez',
                    triage: { 'PA': '145/92 mmHg', 'T': '36.8°C', 'FC': '88 lpm', 'FR': '18 rpm' },
                    soap: {
                        s: 'Paciente refiere persistencia de cefalea occipital de intensidad 7/10 desde hace 3 días, que no cede con analgésicos comunes. Reporta buena adherencia al tratamiento para HTA pero olvidó tomar la medicación ayer. Niega otros síntomas.',
                        o: 'Se constata PA elevada. Resto del examen físico sin alteraciones significativas.',
                        a: 'I10 - Hipertensión Esencial (Primaria), descompensada.',
                        p: 'Ajustar dosis de Losartán a 50mg cada 12 horas. Solicitar Perfil Lipídico y Glucosa. Indicar reposo por 3 días.'
                    },
                    exams: [
                        { name: 'Indicación de Laboratorio', file: 'lab_order_040725.pdf' },
                        { name: 'Receta Médica', file: 'prescription_040725.pdf' },
                        { name: 'Certificado de Descanso', file: 'certificate_040725.pdf' }
                    ]
                },
                {
                    date: '01/06/2025',
                    doctor: 'Dr. Carlos Martínez',
                    triage: { 'PA': '130/85 mmHg', 'T': '36.5°C', 'FC': '80 lpm', 'FR': '16 rpm' },
                    soap: {
                        s: 'Paciente acude a control, refiere sentirse bien y con buena adherencia al tratamiento.',
                        o: 'PA en rangos controlados. Examen físico normal.',
                        a: 'I10 - Hipertensión Esencial (Primaria), controlada.',
                        p: 'Continuar con tratamiento actual. Cita en 1 mes.'
                    },
                    exams: [ { name: 'Nota de Seguimiento', file: 'followup_note_010625.pdf' } ]
                }
            ]
        },
        {
            id: 2,
            name: 'María López',
            details: '28 años, Femenino, 1.65m, 60kg',
            avatar: 'https://placehold.co/80x80/fce7f3/831843?text=ML',
            allergies: 'Ninguna conocida',
            adherence: 95,
            consultations: [
                {
                    date: '02/07/2025',
                    doctor: 'Dra. Ana Pérez',
                    triage: { 'PA': '120/80 mmHg', 'T': '37.0°C', 'FC': '75 lpm', 'FR': '16 rpm' },
                    soap: {
                        s: 'Consulta de seguimiento por cuadro de migraña.',
                        o: 'Examen neurológico sin alteraciones.',
                        a: 'G43.9 - Migraña, no especificada.',
                        p: 'Continuar con tratamiento profiláctico. Educar sobre signos de alarma.'
                    },
                    exams: [ { name: 'Referencia a Neurología', file: 'referral_neuro_020725.pdf' } ]
                }
            ]
        },
        {
            id: 3,
            name: 'Carlos Mendoza',
            details: '45 años, Masculino, 1.80m, 90kg',
            avatar: 'https://placehold.co/80x80/dcfce7/14532d?text=CM',
            allergies: 'AINEs',
            adherence: 70,
             consultations: [
                 {
                    date: '28/06/2025',
                    doctor: 'Dr. Luis Torres',
                    triage: { 'PA': '135/88 mmHg', 'T': '36.9°C', 'FC': '92 lpm', 'FR': '20 rpm' },
                    soap: {
                        s: 'Paciente con tos productiva y fiebre de 2 días de evolución.',
                        o: 'Murmullo vesicular pasa bien en ambos campos pulmonares, se auscultan roncantes difusos.',
                        a: 'J20.9 - Bronquitis aguda, no especificada.',
                        p: 'Amoxicilina 500mg cada 8 horas por 7 días. Paracetamol condicional a fiebre. Control en 5 días.'
                    },
                    exams: [
                        { name: 'Resultados de Laboratorio', file: 'lab_results_280625.pdf' },
                        { name: 'Informe de Rayos X de Tórax', file: 'xray_report_280625.pdf' }
                    ]
                }
            ]
        },
         {
            id: 4,
            name: 'Sofía Rodríguez',
            details: '52 años, Femenino, 1.60m, 72kg',
            avatar: 'https://placehold.co/80x80/f3e8ff/581c87?text=SR',
            allergies: 'Yodo',
            adherence: 90,
            consultations: []
        }
    ];

    let nextConsultation = {
        visible: true,
        patient: 'Jorge García',
        time: '10:00 AM',
        reason: 'Seguimiento de hipertensión',
        status: 'scheduled'
    };
    let tasks = [
        { id: 1, text: 'Revisar resultados de laboratorio', patient: 'Carlos Mendoza', status: 'pending', items: [] },
        { id: 2, text: 'Consulta Firmada', patient: 'María López', status: 'completed', completedAt: '01/07/2025 - 10:30 AM', items: [] },
    ];
    let consultationItems = [];
    let doctorAvailability = {
        'Lunes': ['09:00 - 11:00', '15:00 - 17:00'],
        'Martes': ['09:00 - 11:00'],
        'Miércoles': ['09:00 - 11:00', '18:00 - 20:00'],
        'Jueves': [],
        'Viernes': ['09:00 - 11:00'],
        'Sábado': [],
        'Domingo': []
    };
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
        // Render the static structure of the screen
        screens.patients.innerHTML = `
            <h1 class="text-2xl font-bold text-gray-800 mb-4">Mis Pacientes</h1>
            <div class="relative mb-4">
                <input type="text" id="patient-search-input" placeholder="Buscar paciente..." class="w-full p-3 pl-10 border border-gray-300 rounded-lg bg-white">
                <i class="ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>
            <div id="patient-list-container" class="space-y-3">
                <!-- Patient list will be rendered here by renderPatientList -->
            </div>
        `;
        // Render the dynamic list into its container
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
            <!-- Resumen Paciente -->
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
            <!-- Línea de Tiempo -->
            <h3 class="font-bold text-lg text-gray-800 mb-2">Línea de Tiempo de Consultas</h3>
            <div class="space-y-4">
                ${patient.consultations.length > 0 ? patient.consultations.map((consult, index) => `
                <details class="bg-white rounded-lg border" ${index === 0 ? 'open' : ''}>
                    <summary class="font-bold text-gray-800 p-3 cursor-pointer flex justify-between items-center">
                        <span>${consult.date} (${consult.doctor})</span>
                        <i class="ph-caret-down"></i>
                    </summary>
                    <div class="p-4 border-t text-sm space-y-4">
                        <!-- Triage -->
                        <div class="bg-gray-50 p-3 rounded-md">
                            <h4 class="font-bold mb-2 text-gray-700">Triaje</h4>
                            <div class="grid grid-cols-2 gap-x-4 gap-y-1">
                                ${Object.entries(consult.triage).map(([key, value]) => `
                                    <p><strong>${key}:</strong> ${value}</p>
                                `).join('')}
                            </div>
                        </div>
                        <!-- SOAP -->
                        <div class="space-y-2">
                            <h4 class="font-bold text-gray-700">SOAP</h4>
                            <p><strong>S:</strong> ${consult.soap.s}</p>
                            <p><strong>O:</strong> ${consult.soap.o}</p>
                            <p><strong>A:</strong> ${consult.soap.a}</p>
                            <p><strong>P:</strong> ${consult.soap.p}</p>
                        </div>
                        <!-- Exámenes -->
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

            <!-- Drag to Confirm Withdrawal -->
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
        setupDragToConfirm();
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

        // Bank Account
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

        // Yape
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

        // Plin
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
        consultationItems = [];
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
        simulateAIConsultation();
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

     // --- Forum Functions ---
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

    // MODIFIED renderWelcomeScreen to be the new "Login"
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


    // REUSING renderOnboardingScreen as the new "Register Success" screen, renamed for clarity
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


    // --- Event Listeners ---
    document.body.addEventListener('click', (e) => {
        // Modals
        if (e.target.matches('.modal-overlay') || e.target.matches('.modal-close-btn')) {
            hideModal();
        }

        // --- Onboarding/Register/Forgot Password Flow ---
        if (e.target.closest('#google-login-btn')) {
            showToast("Iniciando sesión con Google...");
            setTimeout(() => {
                showScreen('home');
                renderNextConsultation();
                renderTasks();
            }, 1500);
        }

        if (e.target.closest('#continue-email-btn')) {
            showScreen('emailLogin');
        }

        if (e.target.closest('#login-btn')) { // This is for the email login form
            showToast("Iniciando sesión...");
            setTimeout(() => {
                showScreen('home');
                renderNextConsultation();
                renderTasks();
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
        if (e.target.closest('#nav-agenda')) { renderAgenda(); showScreen('agenda'); }
        if (e.target.closest('#nav-patients')) { renderPatients(); showScreen('patients'); }
        if (e.target.closest('#nav-profile')) { renderProfile(); showScreen('profile'); }

        // Profile Sub-menu navigation
        const profileMenuItem = e.target.closest('.profile-menu-item');
        if (profileMenuItem) {
            const targetScreen = profileMenuItem.dataset.target;
            if (targetScreen) showScreen(targetScreen);
        }

        // Back to profile
        if (e.target.closest('.back-to-profile')) {
            renderProfile();
            showScreen('profile');
        }

        // Back to development from forum
        if (e.target.closest('.back-to-development')) {
            showScreen('development');
        }

        // Back to forum list from topic
        if (e.target.closest('.back-to-forum')) {
            showScreen('communityForum');
        }


        // Patient History Flow
        if (e.target.closest('.view-history-btn')) {
            const patientId = parseInt(e.target.closest('.view-history-btn').dataset.patientId);
            showScreen('patientHistory', patientId);
        }
        if (e.target.closest('#back-to-patients')) { renderPatients(); showScreen('patients'); }

        // View/Download Document in History
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
        }

        // AI Assistant FAB
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

        // Online Toggle
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

        // Consultation Flow
        if (e.target.closest('#join-consultation-btn')) {
            renderWaitingRoom();
            setTimeout(() => { renderConsultationScreen(); }, 3000);
        }

        if (e.target.closest('#end-consultation-btn')) {
            const newTaskId = Date.now();
            tasks.unshift({ id: newTaskId, text: 'Revisar y Firmar Consulta', patient: 'Jorge García', status: 'pending', items: consultationItems });
            nextConsultation.status = 'pending_review';
            renderNextConsultation();
            renderTasks();
            showToast('Consulta finalizada. Tarea de firma creada.');
            showScreen('home');
        }

        // Task Flow
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
                // Update stats
                const consultationCountEl = document.getElementById('consultation-count');
                const startConsultations = parseInt(consultationCountEl.textContent);
                animateValue(consultationCountEl, startConsultations, startConsultations + 1, 1000);

                const incomeCountEl = document.getElementById('income-count');
                const startIncome = parseFloat(incomeCountEl.textContent.replace('S/ ', '').replace(',', ''));
                animateValue(incomeCountEl, startIncome, startIncome + 150, 1000, true, 'S/');
                // Update next consultation
                nextConsultation.visible = false;
                renderNextConsultation();

                renderTasks();
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
            const item = consultationItems.find(i => i.id === cardId);
            if (item) {
                item.status = 'discarded';
                renderConsultationItems();
            }
        }

        if(e.target.closest('.ai-edit-btn')) {
            const cardId = parseInt(e.target.closest('.card').dataset.id);
            openManualAddModal(cardId);
        }

        if(e.target.closest('#manual-add-btn')) {
            openManualAddModal();
        }

        if(e.target.closest('.review-edit-btn') || e.target.closest('.review-add-btn')) {
            const taskId = parseInt(e.target.dataset.taskId);
            const itemId = e.target.closest('.review-edit-btn') ? parseInt(e.target.dataset.id) : null;
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

            const targetArray = fromReview ? tasks.find(t => t.id === taskId).items : consultationItems;
            if (isNew) {
                const newType = selectedOption.value;
                const titles = { 'prescription': 'PRESCRIPCIÓN', 'lab_order': 'ORDEN DE LABORATORIO', 'certificate': 'CERTIFICADO DE DESCANSO' };
                const icons = { 'prescription': 'pill', 'lab_order': 'test-tube', 'certificate': 'bed' };
                const newItem = { id: Date.now(), type: 'order', icon: icons[newType], title: titles[newType], content: contentTextarea.value, status: 'confirmed' };
                targetArray.push(newItem);
            } else {
                const item = targetArray.find(i => i.id === itemId);
                if(item) {
                    item.content = contentTextarea.value;
                    item.status = 'confirmed';
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
            const container = e.target.closest('.screen').querySelector('#consultation-panel-container');
            if(container) {
                container.querySelectorAll('.clinical-panel-content').forEach(c => c.classList.add('hidden'));
                const targetPanel = container.querySelector(`#${e.target.dataset.target}`);
                if(targetPanel) targetPanel.classList.remove('hidden');
            }
        }

        // --- Agenda Schedule Logic ---
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

            // Reset all days first
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

        // Financial Screen Logic
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
            const amount = parseFloat(document.getElementById('withdraw-amount-input').value);
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
            const amount = amountStr ? parseFloat(amountStr) : null;

            const bank = document.getElementById('bank-name').value;
            const accountNumber = document.getElementById('account-number').value.replace(/-/g, '');
            const holderName = document.getElementById('holder-name-display').textContent;
            const cci = document.getElementById('cci-number')?.value || '';
            if (!bank || !accountNumber || !holderName || holderName === '...' || holderName === 'No encontrado') {
                showToast("Por favor complete y verifique los datos.");
                return;
            }

            const newAccount = { bank, accountNumber, holderName, cci };
            financialData.bankAccounts = [newAccount];

            hideModal();
            if (amount !== null) {
                activateSlideToConfirm(amount, newAccount.holderName, `${newAccount.bank} - ****${newAccount.accountNumber.slice(-4)}`);
            } else {
                renderSecurityScreen();
                showToast("Cuenta bancaria actualizada.");
            }
        }

        if (e.target.closest('#save-yape-plin-btn')) {
            const button = e.target.closest('#save-yape-plin-btn');
            const amountStr = button.dataset.amount;
            const amount = amountStr ? parseFloat(amountStr) : null;
            const method = button.dataset.method;
            const number = document.getElementById('yape-plin-number').value;
            const name = document.getElementById('holder-name-display').textContent;

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

            if (reward && professionalData.points >= reward.cost) {
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
                reward.status = 'applied';
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
            // In a real app, you'd add validation here
            hideModal();
            showToast("Contraseña actualizada correctamente.");
        }

        if (e.target.closest('#logout-btn')) {
            showToast("Cerrando sesión...");
            setTimeout(() => {
                showScreen('login'); // Redirect to the main login screen
            }, 1500);
        }

        // --- Forum Event Listeners ---
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
                professionalData.points += 5; // Add points for new topic
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
                professionalData.points += 2; // Add points for commenting
                renderForumTopicDetail(topicId);
                showToast('¡Comentario añadido! +2 Puntos Vitalis', true);
            } else {
                showToast('Por favor escriba un comentario.');
            }
        }

    });
    // --- Dynamic Search/Input Listeners ---
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
            const method = e.target.closest('.modal-content').querySelector('#save-yape-plin-btn').dataset.method.toLowerCase();
            if (number.length === 9) {
                nameDisplay.textContent = 'Buscando...';
                const holderName = await fetchAccountHolderName(number, method);
                nameDisplay.textContent = holderName || 'No encontrado';
            } else {
                nameDisplay.textContent = '...';
            }
        }

        if (e.target.matches('#account-number')) {
            const number = e.target.value.replace(/-/g, '');
            const nameDisplay = document.getElementById('holder-name-display');
            if (number.length >= 10) { // Arbitrary length for bank accounts
                nameDisplay.textContent = 'Verificando...';
                const holderName = await fetchAccountHolderName(number, 'bank');
                nameDisplay.textContent = holderName || 'No encontrado';
            } else {
                nameDisplay.textContent = '...';
            }
        }
    });
    document.body.addEventListener('change', (e) => {
         if (e.target.matches('#bank-name')) {
            const cciContainer = document.getElementById('cci-container');
            if (e.target.value === 'Otro') {
                cciContainer.classList.remove('hidden');
            } else {
                cciContainer.classList.add('hidden');
            }
        }
    });
    // --- Financial Flow Functions ---

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

    async function fetchAccountHolderName(number, type) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        const cleanNumber = number.replace(/-/g, '');
        return mockApiDatabase[type]?.[cleanNumber] || null;
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
        const targetArray = fromReview ? tasks.find(t => t.id === taskId).items : consultationItems;
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
                        <button id="confirm-manual-add-btn" data-task-id="${taskId}" data-from-review="${fromReview}" class="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold">Guardar</button>
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
        consultationItems = suggestions;

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

        // --- PDF Header ---
        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        doc.text("Historia Clínica 360° - Vitalis AI", margin, y);
        y += 10;
        // --- Patient Summary ---
        doc.setFontSize(14);
        doc.text(`Paciente: ${patient.name}`, margin, y);
        y += 6;
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(patient.details, margin, y);
        y += 6;
        doc.text(`Alergias: ${patient.allergies}`, margin, y);
        y += 10;

        // --- Consultations Loop ---
        patient.consultations.forEach(consult => {
            checkPageBreak(20); // Check space for section header
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(0);
            doc.text(`Consulta: ${consult.date} - ${consult.doctor}`, margin, y);
            y += 8;

            // Triage
            checkPageBreak(15);
            doc.setFontSize(10);
            doc.setFont(undefined, 'bold');
            doc.text("Triaje:", margin + 2, y);
            y += 5;
            doc.setFont(undefined, 'normal');
            let triageText = Object.entries(consult.triage).map(([k, v]) => `${k}: ${v}`).join(' | ');
            doc.text(triageText, margin + 2, y);
            y += 8;

            // SOAP
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

            // Exams
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

            y += 5; // Extra space between consultations
            if (patient.consultations.indexOf(consult) < patient.consultations.length - 1) {
                doc.setDrawColor(200);
                doc.line(margin, y, 196, y);
                y += 8;
            }
        });
        doc.save(`Historia_Clinica_${patient.name.replace(' ', '_')}.pdf`);
        showToast("Descargando PDF de la historia clínica completa.");
    }

    // --- Initial State ---
    showScreen('login'); // Start with the new login screen
});
