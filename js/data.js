// js/data.js

// Mock Backend for Name Lookups
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

async function fetchAccountHolderName(number, type) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    const cleanNumber = number.replace(/-/g, '');
    return mockApiDatabase[type]?.[cleanNumber] || null;
}

export {
    mockApiDatabase,
    financialData,
    referralsDB,
    professionalData,
    patientsDB,
    nextConsultation,
    tasks,
    consultationItems,
    doctorAvailability,
    fetchAccountHolderName
};
