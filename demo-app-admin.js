// Configuración de trabajadores con DNIs, contraseñas y horarios específicos
let TRABAJADORES = {
    'BORJA CARRERAS MARTIN': { dni: '53615032P', password: 'BCM-K8L3X', telefono: '642057351', email: 'borjacarreras@redescarreras.es', horario: 'PLANTA EXTERNA: 08:00 - 14:00 / 15:00 - 17:00', active: true },
    'DAVID MORENO GOMEZ': { dni: '46846909A', password: 'DMG-P4N7Q', telefono: '630604899', email: 'davidmorenogomez76@gmail.com', horario: 'PLANTA EXTERNA: 08:00 - 14:00 / 15:00 - 17:00', active: true },
    'EDGAR ALONSO SANCHEZ SUAREZ': { dni: 'X8723873L', password: 'EAS-M9R2T', telefono: '631830324', email: 'alonsing001@gmail.com', horario: 'PLANTA EXTERNA: 08:00 - 14:00 / 15:00 - 17:00', active: true },
    'JAVIER CARRERAS MARTIN': { dni: '53996573W', password: 'JCM-V6Z8B', telefono: '667283903', email: 'jcm63881@gmail.com', horario: 'PLANTA EXTERNA: 08:00 - 14:00 / 15:00 - 17:00', active: true },
    'JOSE ANTONIO CARRERAS MARTIN': { dni: '06587470V', password: 'JAC-H3F5Y', telefono: '642276302', email: 'carrerasmartin87@gmail.com', horario: 'PLANTA EXTERNA: 08:00 - 14:00 / 15:00 - 17:00', active: true },
    'JOSE FERNANDO SANCHEZ MARULANDA': { dni: 'Y5482295Y', password: 'JFS-L7W1D', telefono: '652151329', email: 'josesanchezmarulanda@gmail.com', horario: 'PLANTA EXTERNA: 08:00 - 14:00 / 15:00 - 17:00', active: true },
    'JUAN CARLOS SANCHEZ MARULANDA': { dni: 'Y7721584S', password: 'JCS-N4G9E', telefono: '662048856', email: 'juankmarulandasanchez@gmail.com', horario: 'PLANTA EXTERNA: 08:00 - 14:00 / 15:00 - 17:00', active: true },
    'JUAN PEDRO SUAREZ DELGADO': { dni: '06587577D', password: 'JPS-C8J2A', telefono: '610713439', email: 'juampetena3107@gmail.com', horario: 'PLANTA EXTERNA: 08:00 - 14:00 / 15:00 - 17:00', active: true },
    'LUIS MIGUEL HIDALGO EGEA': { dni: '01187902K', password: 'LMH-S5K6P', telefono: '662495955', email: 'hidalgomiguel842@gmail.com', horario: 'PLANTA EXTERNA: 08:00 - 14:00 / 15:00 - 17:00', active: true },
    'ANTONIO MANUEL LOPEZ GARCÍA': { dni: '05680005V', password: 'AML-T9X4R', telefono: '642122184', email: 'manoloespiderman@hotmail.com', horario: 'PLANTA EXTERNA: 08:00 - 14:00 / 15:00 - 17:00', active: true },
    'AARON LOPEZ MUÑOZ': { dni: '05739933F', password: 'ALM-F3Q7U', telefono: '643661386', email: 'aaronlm1999@gmail.com', horario: 'PLANTA EXTERNA: 08:00 - 14:00 / 15:00 - 17:00', active: true },
    'JUAN SIMON DE LA FUENTE': { dni: '51471948H', password: 'JSF-W2Y8I', telefono: '', email: '', horario: 'OFICINA: 08:00 - 16:00', active: true },
    'JHON ALEXANDER ARROYAVE CÁRDENAS': { dni: 'X8335756G', password: 'JAA-Z6M1O', telefono: '', email: '', horario: 'OFICINA: 08:00 - 16:00', active: true }
};

// Contraseña de administrador
const ADMIN_PASSWORD = 'Admin2025!';

class RegistroHorarioApp {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.modalCanvas = null;
        this.modalCtx = null;
        this.isDrawing = false;
        this.currentUser = null;
        this.currentScreen = 'timeRestriction';
        this.pendingSignatureDate = null;
        this.isAuthenticated = false;
        this.isAdmin = false;
        this.currentMonth = new Date();
        this.editingUser = null;
        
        this.loadWorkers();
        this.loadSettings();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.populateWorkerSelects();
        this.initSignatureCanvas();
        // DEMO MODE: Sin restricción horaria - siempre disponible
        this.showDemoMode();
        this.registerServiceWorker();
        this.loadSavedPasswords();
        
        // Eliminada funcionalidad de emails
        
        setInterval(() => this.updateCurrentTime(), 1000);
        
        // DEMO MODE: Verificación final después de todo el setup
        setTimeout(() => {
            console.log('🔄 DEMO: Verificación final del modo demo');
            this.showDemoMode();
        }, 100);
    }

    // === GESTIÓN DE TRABAJADORES ===
    loadWorkers() {
        const saved = localStorage.getItem('app_trabajadores');
        if (saved) {
            try {
                TRABAJADORES = JSON.parse(saved);
            } catch (e) {
                console.error('Error al cargar trabajadores:', e);
            }
        }
    }

    saveWorkers() {
        localStorage.setItem('app_trabajadores', JSON.stringify(TRABAJADORES));
        this.populateWorkerSelects();
    }

    // === DÍAS FESTIVOS ===
    getHolidays() {
        return JSON.parse(localStorage.getItem('app_holidays') || '[]');
    }

    saveHolidays(holidays) {
        localStorage.setItem('app_holidays', JSON.stringify(holidays));
    }

    isHoliday(date) {
        const holidays = this.getHolidays();
        const dateStr = date.toISOString().split('T')[0];
        return holidays.includes(dateStr);
    }

    toggleHoliday(date) {
        const holidays = this.getHolidays();
        const dateStr = date.toISOString().split('T')[0];
        const index = holidays.indexOf(dateStr);
        
        if (index > -1) {
            holidays.splice(index, 1);
        } else {
            holidays.push(dateStr);
        }
        
        this.saveHolidays(holidays);
        this.renderCalendar();
        this.updateStats();
    }

    // === CONFIGURACIÓN ===
    loadSettings() {
        const saved = localStorage.getItem('app_settings_demo');
        if (saved) {
            try {
                this.settings = JSON.parse(saved);
            } catch (e) {
                console.error('Error al cargar configuración:', e);
                this.settings = { activationHour: 18 };
            }
        } else {
            this.settings = { activationHour: 18 };
        }
    }

    saveSettings() {
        const hour = parseInt(document.getElementById('activationHour').value);
        
        if (isNaN(hour) || hour < 0 || hour > 23) {
            alert('Por favor, ingresa una hora válida entre 0 y 23');
            return;
        }
        
        this.settings.activationHour = hour;
        localStorage.setItem('app_settings_demo', JSON.stringify(this.settings));
        
        this.updateSettingsUI();
        alert(`✅ Configuración guardada correctamente.\n\nLa aplicación estará disponible a partir de las ${hour.toString().padStart(2, '0')}:00 horas.`);
    }

    updateSettingsUI() {
        const hour = this.settings.activationHour;
        const hourInput = document.getElementById('activationHour');
        const currentHourDisplay = document.getElementById('currentActivationHour');
        
        if (hourInput) {
            hourInput.value = hour;
        }
        
        if (currentHourDisplay) {
            currentHourDisplay.textContent = `${hour.toString().padStart(2, '0')}:00`;
        }
    }

    setupEventListeners() {
        // Botón de acceso admin
        document.getElementById('adminAccessBtn')?.addEventListener('click', () => this.showAdminAuth());
        
        // Admin auth
        document.getElementById('adminAuthForm')?.addEventListener('submit', (e) => this.handleAdminAuth(e));
        document.getElementById('closeAdminAuth')?.addEventListener('click', () => this.closeAdminAuthModal());
        document.getElementById('cancelAdminAuth')?.addEventListener('click', () => this.closeAdminAuthModal());
        
        // Admin tabs
        document.querySelectorAll('.admin-tab').forEach(tab => {
            tab.addEventListener('click', () => this.switchAdminTab(tab.dataset.tab));
        });
        
        // Admin actions
        document.getElementById('exitAdminBtn')?.addEventListener('click', () => this.exitAdmin());
        document.getElementById('addUserBtn')?.addEventListener('click', () => this.showUserModal());
        document.getElementById('userForm')?.addEventListener('submit', (e) => this.handleUserForm(e));
        document.getElementById('closeUserModal')?.addEventListener('click', () => this.closeUserModal());
        document.getElementById('cancelUserModal')?.addEventListener('click', () => this.closeUserModal());
        
        // Calendario
        document.getElementById('prevMonth')?.addEventListener('click', () => this.changeMonth(-1));
        document.getElementById('nextMonth')?.addEventListener('click', () => this.changeMonth(1));
        
        // Exportar
        document.getElementById('exportBtn')?.addEventListener('click', () => this.handleExport());
        document.getElementById('exportFormat')?.addEventListener('change', (e) => this.updateExportUI(e.target.value));
        
        // Configuración
        document.getElementById('saveSettingsBtn')?.addEventListener('click', () => this.saveSettings());
        
        // Navegación principal
        document.getElementById('menuAccessBtn')?.addEventListener('click', () => this.showAuthScreen());
        document.getElementById('newSignatureBtn')?.addEventListener('click', () => this.showSignatureScreen());
        document.getElementById('pendingSignaturesBtn')?.addEventListener('click', () => this.showPendingSignatures());
        document.getElementById('completedSignaturesBtn')?.addEventListener('click', () => this.showCompletedSignatures());
        
        document.getElementById('backToSignBtn')?.addEventListener('click', () => this.showSignatureScreen());
        document.getElementById('backToMenuBtn1')?.addEventListener('click', () => this.showMainMenu());
        document.getElementById('backToMenuBtn2')?.addEventListener('click', () => this.showMainMenu());
        
        document.getElementById('authForm')?.addEventListener('submit', (e) => this.handleAuth(e));
        
        document.getElementById('trabajador')?.addEventListener('change', (e) => {
            this.updateWorkerInfo(e.target.value);
        });
        
        document.getElementById('authTrabajador')?.addEventListener('change', (e) => {
            this.loadSavedPasswordForWorker(e.target.value);
        });
        
        document.getElementById('showPassword')?.addEventListener('click', () => {
            this.togglePasswordVisibility();
        });

        document.getElementById('clearSignature')?.addEventListener('click', () => {
            this.clearSignature();
        });
        
        document.getElementById('clearModalSignature')?.addEventListener('click', () => {
            this.clearModalSignature();
        });

        document.getElementById('registroForm')?.addEventListener('submit', (e) => {
            this.handleFormSubmit(e);
        });
        
        document.getElementById('closeModal')?.addEventListener('click', () => this.closeModal());
        document.getElementById('cancelSignature')?.addEventListener('click', () => this.closeModal());
        document.getElementById('confirmSignature')?.addEventListener('click', () => this.confirmPendingSignature());

        // Eventos de conexión eliminados
    }

    // === ADMINISTRADOR ===
    showAdminAuth() {
        document.getElementById('adminAuthModal').style.display = 'flex';
        document.getElementById('adminPassword').value = '';
        document.getElementById('adminPassword').focus();
    }

    closeAdminAuthModal() {
        document.getElementById('adminAuthModal').style.display = 'none';
    }

    handleAdminAuth(e) {
        e.preventDefault();
        const password = document.getElementById('adminPassword').value;
        
        if (password === ADMIN_PASSWORD) {
            this.isAdmin = true;
            this.closeAdminAuthModal();
            this.showAdminPanel();
        } else {
            alert('Contraseña incorrecta');
            document.getElementById('adminPassword').value = '';
        }
    }

    showAdminPanel() {
        // Mostrar solo el panel de admin y ocultar todo lo demás
        this.showScreen('adminPanel');
        
        // Actualizar datos
        this.updateStats();
        this.renderUsersTable();
        this.renderCalendar();
        this.renderWorkerStats();
        this.populateExportWorkers();
        this.updateSettingsUI();
    }

    exitAdmin() {
        this.isAdmin = false;
        document.getElementById('adminPanel').style.display = 'none';
        this.checkTimeRestriction();
    }

    switchAdminTab(tabName) {
        document.querySelectorAll('.admin-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.admin-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}Tab`).classList.add('active');
    }

    updateStats() {
        const activeWorkers = Object.values(TRABAJADORES).filter(w => w.active).length;
        document.getElementById('totalWorkers').textContent = activeWorkers;
        
        const today = new Date().toISOString().split('T')[0];
        let signaturesToday = 0;
        
        Object.keys(TRABAJADORES).forEach(worker => {
            const signatures = this.getSignedDates(worker);
            if (signatures.some(s => s.date === today)) {
                signaturesToday++;
            }
        });
        
        document.getElementById('signaturesToday').textContent = signaturesToday;
        document.getElementById('pendingToday').textContent = activeWorkers - signaturesToday;
        document.getElementById('totalHolidays').textContent = this.getHolidays().length;
    }

    renderUsersTable() {
        const tbody = document.getElementById('usersTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        Object.entries(TRABAJADORES).forEach(([nombre, data]) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${nombre}</td>
                <td>${data.dni}</td>
                <td><small>${data.horario}</small></td>
                <td>
                    <span class="status-badge ${data.active ? 'status-active' : 'status-inactive'}">
                        ${data.active ? 'Activo' : 'Inactivo'}
                    </span>
                </td>
                <td>
                    <button class="btn-icon" onclick="app.toggleUserStatus('${nombre}')" title="${data.active ? 'Desactivar' : 'Activar'}">
                        <i class="fas fa-${data.active ? 'toggle-on' : 'toggle-off'}"></i>
                    </button>
                    <button class="btn-icon" onclick="app.editUser('${nombre}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete" onclick="app.deleteUser('${nombre}')" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    showUserModal(nombre = null) {
        this.editingUser = nombre;
        const modal = document.getElementById('userModal');
        const title = document.getElementById('userModalTitle');
        
        if (nombre) {
            title.textContent = 'Editar Trabajador';
            const user = TRABAJADORES[nombre];
            document.getElementById('userName').value = nombre;
            document.getElementById('userDNI').value = user.dni;
            document.getElementById('userPassword').value = user.password;
            document.getElementById('userSchedule').value = user.horario;
            document.getElementById('userEmail').value = user.email || '';
            document.getElementById('userPhone').value = user.telefono || '';
            document.getElementById('userName').readOnly = true;
        } else {
            title.textContent = 'Añadir Trabajador';
            document.getElementById('userForm').reset();
            document.getElementById('userName').readOnly = false;
        }
        
        modal.style.display = 'flex';
    }

    closeUserModal() {
        document.getElementById('userModal').style.display = 'none';
        this.editingUser = null;
    }

    handleUserForm(e) {
        e.preventDefault();
        
        const nombre = document.getElementById('userName').value.trim().toUpperCase();
        const dni = document.getElementById('userDNI').value.trim().toUpperCase();
        const password = document.getElementById('userPassword').value.trim();
        const horario = document.getElementById('userSchedule').value;
        const email = document.getElementById('userEmail').value.trim();
        const telefono = document.getElementById('userPhone').value.trim();
        
        if (this.editingUser) {
            // Editar usuario existente
            if (this.editingUser !== nombre && TRABAJADORES[nombre]) {
                alert('Ya existe un trabajador con ese nombre');
                return;
            }
            
            if (this.editingUser !== nombre) {
                // Si cambió el nombre, eliminar el antiguo
                delete TRABAJADORES[this.editingUser];
            }
        } else {
            // Nuevo usuario
            if (TRABAJADORES[nombre]) {
                alert('Ya existe un trabajador con ese nombre');
                return;
            }
        }
        
        TRABAJADORES[nombre] = {
            dni,
            password,
            horario,
            email,
            telefono,
            active: TRABAJADORES[nombre]?.active ?? true
        };
        
        this.saveWorkers();
        this.renderUsersTable();
        this.updateStats();
        this.closeUserModal();
        
        alert(`Trabajador ${this.editingUser ? 'actualizado' : 'añadido'} correctamente`);
    }

    editUser(nombre) {
        this.showUserModal(nombre);
    }

    toggleUserStatus(nombre) {
        if (TRABAJADORES[nombre]) {
            TRABAJADORES[nombre].active = !TRABAJADORES[nombre].active;
            this.saveWorkers();
            this.renderUsersTable();
            this.updateStats();
        }
    }

    deleteUser(nombre) {
        if (confirm(`¿Estás seguro de eliminar a ${nombre}?`)) {
            delete TRABAJADORES[nombre];
            this.saveWorkers();
            this.renderUsersTable();
            this.updateStats();
        }
    }

    // === CALENDARIO ===
    changeMonth(delta) {
        this.currentMonth.setMonth(this.currentMonth.getMonth() + delta);
        this.renderCalendar();
    }

    renderCalendar() {
        const grid = document.getElementById('calendarGrid');
        const monthTitle = document.getElementById('currentMonth');
        
        if (!grid || !monthTitle) return;
        
        const year = this.currentMonth.getFullYear();
        const month = this.currentMonth.getMonth();
        
        monthTitle.textContent = new Date(year, month, 1).toLocaleDateString('es-ES', {
            month: 'long',
            year: 'numeric'
        });
        
        grid.innerHTML = '';
        
        // Días de la semana
        ['L', 'M', 'X', 'J', 'V', 'S', 'D'].forEach(day => {
            const div = document.createElement('div');
            div.style.fontWeight = 'bold';
            div.style.textAlign = 'center';
            div.style.padding = '10px';
            div.textContent = day;
            grid.appendChild(div);
        });
        
        // Primer día del mes
        const firstDay = new Date(year, month, 1);
        const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
        
        // Espacios en blanco
        for (let i = 0; i < startDay; i++) {
            const div = document.createElement('div');
            grid.appendChild(div);
        }
        
        // Días del mes
        const lastDay = new Date(year, month + 1, 0).getDate();
        
        for (let day = 1; day <= lastDay; day++) {
            const date = new Date(year, month, day);
            const div = document.createElement('div');
            div.className = 'calendar-day';
            div.textContent = day;
            
            const dayOfWeek = date.getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                div.classList.add('weekend');
            }
            
            if (this.isHoliday(date)) {
                div.classList.add('holiday');
            }
            
            // Solo permitir marcar laborables como festivos
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                div.addEventListener('click', () => this.toggleHoliday(date));
            }
            
            grid.appendChild(div);
        }
    }

    // === EXPORTAR A EXCEL Y PDF ===
    populateExportWorkers() {
        const select = document.getElementById('exportWorker');
        if (!select) return;
        
        select.innerHTML = '<option value="">Todos los trabajadores</option>';
        
        Object.keys(TRABAJADORES).forEach(nombre => {
            const option = document.createElement('option');
            option.value = nombre;
            option.textContent = nombre;
            select.appendChild(option);
        });
    }

    updateExportUI(format) {
        // Actualizar interfaz según el formato seleccionado
        console.log('Formato seleccionado:', format);
    }

    handleExport() {
        const format = document.getElementById('exportFormat').value;
        
        if (format === 'excel') {
            this.exportToExcel();
        } else if (format === 'pdf') {
            this.exportToPDF();
        }
    }

    exportToExcel() {
        const fromDate = document.getElementById('exportFromDate').value;
        const toDate = document.getElementById('exportToDate').value;
        const worker = document.getElementById('exportWorker').value;
        
        if (!fromDate || !toDate) {
            alert('Por favor selecciona el rango de fechas');
            return;
        }
        
        const data = [];
        data.push(['Trabajador', 'DNI', 'Fecha', 'Hora', 'Horario', 'Estado']);
        
        const workers = worker ? [worker] : Object.keys(TRABAJADORES);
        
        workers.forEach(trabajador => {
            const signatures = this.getSignedDates(trabajador);
            signatures.forEach(sig => {
                if (sig.date >= fromDate && sig.date <= toDate) {
                    data.push([
                        trabajador,
                        TRABAJADORES[trabajador].dni,
                        sig.fecha,
                        sig.hora,
                        sig.horario,
                        'Firmado'
                    ]);
                }
            });
        });
        
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(data);
        
        // Ajustar anchos de columna
        ws['!cols'] = [
            { wch: 30 },
            { wch: 12 },
            { wch: 12 },
            { wch: 10 },
            { wch: 40 },
            { wch: 10 }
        ];
        
        XLSX.utils.book_append_sheet(wb, ws, 'Registro Horario');
        
        const fileName = worker 
            ? `registro_${worker.replace(/\s+/g, '_')}_${fromDate}_${toDate}.xlsx`
            : `registro_todos_${fromDate}_${toDate}.xlsx`;
        
        XLSX.writeFile(wb, fileName);
        
        alert('✅ Archivo Excel generado correctamente');
    }

    async exportToPDF() {
        const fromDate = document.getElementById('exportFromDate').value;
        const toDate = document.getElementById('exportToDate').value;
        const worker = document.getElementById('exportWorker').value;
        
        if (!fromDate || !toDate) {
            alert('Por favor selecciona el rango de fechas');
            return;
        }
        
        const workers = worker ? [worker] : Object.keys(TRABAJADORES);
        
        if (worker) {
            // Descarga individual: todos los PDFs de un trabajador
            await this.downloadWorkerPDFs(worker, fromDate, toDate);
        } else {
            // Descarga general: todos los trabajadores
            await this.downloadAllWorkersPDFs(workers, fromDate, toDate);
        }
    }

    async downloadWorkerPDFs(trabajador, fromDate, toDate) {
        const signatures = this.getSignedDates(trabajador);
        const filteredSignatures = signatures.filter(sig => sig.date >= fromDate && sig.date <= toDate);
        
        if (filteredSignatures.length === 0) {
            alert(`No hay firmas registradas para ${trabajador} en el rango de fechas seleccionado`);
            return;
        }
        
        let count = 0;
        for (const sig of filteredSignatures) {
            try {
                await this.generatePDF(sig);
                count++;
                // Pequeña pausa para no saturar el navegador
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                console.error(`Error al generar PDF para ${sig.fecha}:`, error);
            }
        }
        
        alert(`✅ ${count} PDF${count !== 1 ? 's' : ''} descargado${count !== 1 ? 's' : ''} correctamente para ${trabajador}`);
    }

    async downloadAllWorkersPDFs(workers, fromDate, toDate) {
        let totalCount = 0;
        
        for (const trabajador of workers) {
            const signatures = this.getSignedDates(trabajador);
            const filteredSignatures = signatures.filter(sig => sig.date >= fromDate && sig.date <= toDate);
            
            for (const sig of filteredSignatures) {
                try {
                    await this.generatePDF(sig);
                    totalCount++;
                    // Pequeña pausa para no saturar el navegador
                    await new Promise(resolve => setTimeout(resolve, 500));
                } catch (error) {
                    console.error(`Error al generar PDF para ${trabajador} - ${sig.fecha}:`, error);
                }
            }
        }
        
        alert(`✅ ${totalCount} PDF${totalCount !== 1 ? 's' : ''} descargado${totalCount !== 1 ? 's' : ''} correctamente de todos los trabajadores`);
    }

    renderWorkerStats() {
        const container = document.getElementById('workerStats');
        if (!container) return;
        
        const stats = Object.entries(TRABAJADORES).map(([nombre, data]) => {
            const signatures = this.getSignedDates(nombre);
            return {
                nombre,
                dni: data.dni,
                total: signatures.length,
                active: data.active
            };
        }).sort((a, b) => b.total - a.total);
        
        container.innerHTML = stats.map(stat => `
            <div style="display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #e2e8f0;">
                <div>
                    <strong>${stat.nombre}</strong>
                    <small style="color: #64748b; margin-left: 10px;">${stat.dni}</small>
                </div>
                <div>
                    <span class="status-badge ${stat.active ? 'status-active' : 'status-inactive'}" style="margin-right: 10px;">
                        ${stat.active ? 'Activo' : 'Inactivo'}
                    </span>
                    <strong>${stat.total}</strong> firmas
                </div>
            </div>
        `).join('');
    }

    // === FUNCIONES ORIGINALES ===
    
    populateWorkerSelects() {
        const selects = ['trabajador', 'authTrabajador'];
        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (select) {
                select.innerHTML = '<option value="">- Selecciona tu nombre -</option>';
                Object.entries(TRABAJADORES).forEach(([nombre, data]) => {
                    if (data.active) {
                        const option = document.createElement('option');
                        option.value = nombre;
                        option.textContent = nombre;
                        select.appendChild(option);
                    }
                });
            }
        });
    }

    updateWorkerInfo(trabajadorNombre) {
        const dniInput = document.getElementById('dni');
        const horarioSelect = document.getElementById('horario');
        
        if (trabajadorNombre && TRABAJADORES[trabajadorNombre]) {
            const dni = TRABAJADORES[trabajadorNombre].dni;
            const dniOculto = '****' + dni.slice(4);
            dniInput.value = dniOculto;
            horarioSelect.value = TRABAJADORES[trabajadorNombre].horario;
            
            // Verificar si ya firmó hoy
            this.checkIfSignedToday(trabajadorNombre);
        } else {
            dniInput.value = '';
            horarioSelect.value = '';
            this.resetSignatureUI();
        }
    }

    showScreen(screenId) {
        // DEMO MODE: NUNCA mostrar restricción de tiempo
        if (screenId === 'timeRestriction') {
            console.log('🚫 DEMO MODE: Bloqueando intento de mostrar timeRestriction');
            screenId = 'mainContent'; // Redirigir a contenido principal
        }
        
        const screens = [
            'timeRestriction', 'mainMenu', 'authScreen', 'mainContent',
            'pendingSignaturesScreen', 'completedSignaturesScreen', 'adminPanel'
        ];
        
        screens.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                // En modo demo, NUNCA mostrar timeRestriction
                if (id === 'timeRestriction') {
                    element.style.display = 'none';
                    element.style.visibility = 'hidden';
                } else {
                    element.style.display = id === screenId ? 'block' : 'none';
                }
            }
        });
        
        this.currentScreen = screenId;
        console.log(`📱 DEMO: Cambiando a pantalla: ${screenId}`);
    }

    showDemoMode() {
        // En modo demo, la aplicación siempre está disponible - FORZAR ACCESO
        console.log('🚀 DEMO MODE: Activando modo demo sin restricciones');
        
        // Ocultar completamente cualquier restricción de tiempo
        const timeRestriction = document.getElementById('timeRestriction');
        if (timeRestriction) {
            timeRestriction.style.display = 'none';
            timeRestriction.style.visibility = 'hidden';
        }
        
        // Mostrar contenido principal
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.style.display = 'block';
            mainContent.style.visibility = 'visible';
        }
        
        // Asegurar que estamos en la pantalla principal
        this.currentScreen = 'mainContent';
        
        // Agregar banner de demo
        this.addDemoBanner();
        this.updateCurrentTime();
        
        console.log('✅ DEMO MODE: Aplicación lista para uso sin restricciones');
    }

    addDemoBanner() {
        // Evitar duplicados
        if (document.querySelector('.demo-banner-added')) return;
        
        const demoBanner = document.createElement('div');
        demoBanner.className = 'demo-banner-added';
        demoBanner.style.cssText = `
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: white;
            text-align: center;
            padding: 12px;
            font-weight: 600;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            animation: pulse 2s infinite;
        `;
        demoBanner.innerHTML = `
            <i class="fas fa-star"></i>
            MODO DEMO - Aplicación disponible sin restricción horaria para pruebas
            <i class="fas fa-star"></i>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.8; }
                100% { opacity: 1; }
            }
            
            /* DEMO MODE: Forzar ocultación de timeRestriction */
            #timeRestriction {
                display: none !important;
                visibility: hidden !important;
            }
            
            /* DEMO MODE: Asegurar visibilidad del contenido principal */
            #mainContent {
                display: block !important;
                visibility: visible !important;
            }
        `;
        document.head.appendChild(style);
        
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.insertBefore(demoBanner, mainContent.firstChild);
        }
    }

    showMainMenu() {
        this.showScreen('mainMenu');
        this.updateCurrentTime('menuCurrentTime');
    }

    showAuthScreen() {
        this.showScreen('authScreen');
    }

    showSignatureScreen() {
        this.showScreen('mainContent');
        this.updateCurrentTime('currentTime');
    }

    async handleAuth(e) {
        e.preventDefault();
        
        const trabajador = document.getElementById('authTrabajador').value;
        const password = document.getElementById('authPassword').value;
        
        if (!trabajador || !password) {
            this.showMessage('Por favor, completa todos los campos', 'error', 'auth');
            return;
        }
        
        if (TRABAJADORES[trabajador] && TRABAJADORES[trabajador].password === password && TRABAJADORES[trabajador].active) {
            this.currentUser = trabajador;
            this.isAuthenticated = true;
            this.showMainMenu();
            this.showMessage(`✅ Bienvenido, ${trabajador}`, 'success', 'auth');
            document.getElementById('authPassword').value = '';
        } else {
            this.showMessage('Credenciales incorrectas o usuario inactivo', 'error', 'auth');
        }
    }

    getWorkDays(startDate, endDate) {
        const workDays = [];
        const current = new Date(startDate);
        
        while (current <= endDate) {
            const dayOfWeek = current.getDay();
            if (dayOfWeek >= 1 && dayOfWeek <= 5 && !this.isHoliday(current)) {
                workDays.push(new Date(current));
            }
            current.setDate(current.getDate() + 1);
        }
        
        return workDays;
    }

    getSignedDates(trabajador) {
        const key = `signatures_demo_${trabajador.replace(/\s+/g, '_')}`;
        return JSON.parse(localStorage.getItem(key) || '[]');
    }

    addSignedDate(trabajador, date, signatureData) {
        const key = `signatures_demo_${trabajador.replace(/\s+/g, '_')}`;
        const signatures = this.getSignedDates(trabajador);
        
        const dateString = date.toISOString().split('T')[0];
        
        const existingIndex = signatures.findIndex(s => s.date === dateString);
        
        if (existingIndex >= 0) {
            signatures[existingIndex] = { date: dateString, ...signatureData };
        } else {
            signatures.push({ date: dateString, ...signatureData });
        }
        
        localStorage.setItem(key, JSON.stringify(signatures));
    }

    showPendingSignatures() {
        if (!this.isAuthenticated) {
            this.showAuthScreen();
            return;
        }
        
        this.showScreen('pendingSignaturesScreen');
        
        const APP_START_DATE = new Date('2025-10-01');
        const today = new Date();
        
        if (today < APP_START_DATE) {
            this.renderUserInfo('pendingUserInfo');
            this.renderPendingDaysBeforeStart();
            return;
        }
        
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        
        const startDate = APP_START_DATE > thirtyDaysAgo ? APP_START_DATE : thirtyDaysAgo;
        
        const workDays = this.getWorkDays(startDate, today);
        const signedDates = this.getSignedDates(this.currentUser);
        const signedDateStrings = signedDates.map(s => s.date);
        
        const pendingDays = workDays.filter(day => {
            const dateString = day.toISOString().split('T')[0];
            return !signedDateStrings.includes(dateString);
        });

        this.renderUserInfo('pendingUserInfo');
        this.renderPendingDays(pendingDays);
    }
    
    renderPendingDaysBeforeStart() {
        const container = document.getElementById('pendingList');
        if (!container) return;
        
        container.innerHTML = `
            <div class="pre-start-message">
                <i class="fas fa-calendar-plus" style="font-size: 3rem; color: #3b82f6; margin-bottom: 20px;"></i>
                <h3 style="color: #1e293b; margin-bottom: 15px;">Aplicación en Preparación</h3>
                <p style="color: #64748b; line-height: 1.6; margin-bottom: 20px;">
                    La aplicación de registro horario estará disponible a partir del 
                    <strong style="color: #3b82f6;">1 de octubre de 2025</strong>.
                </p>
            </div>
        `;
    }

    showCompletedSignatures() {
        if (!this.isAuthenticated) {
            this.showAuthScreen();
            return;
        }
        
        this.showScreen('completedSignaturesScreen');
        
        const signedDates = this.getSignedDates(this.currentUser);
        
        this.renderUserInfo('completedUserInfo');
        this.renderCompletedDays(signedDates);
    }

    renderUserInfo(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const worker = TRABAJADORES[this.currentUser];
        
        container.innerHTML = `
            <h3><i class="fas fa-user"></i> ${this.currentUser}</h3>
            <p><strong>DNI:</strong> ${worker.dni}</p>
            <p><strong>Horario:</strong> ${worker.horario}</p>
        `;
    }

    renderPendingDays(pendingDays) {
        const container = document.getElementById('pendingList');
        if (!container) return;
        
        if (pendingDays.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-check-circle"></i>
                    <h3>¡Todas las firmas están al día!</h3>
                    <p>No tienes días pendientes por firmar</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = pendingDays.map(day => {
            const isToday = this.isToday(day);
            const dateString = day.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            return `
                <div class="day-item pending">
                    <div class="day-info">
                        <h4>${dateString}</h4>
                        <p class="status-pending">
                            <i class="fas fa-exclamation-triangle"></i>
                            ${isToday ? 'Hoy - Pendiente' : 'Pendiente de firmar'}
                        </p>
                    </div>
                    <div class="day-actions">
                        <button class="btn-small btn-warning" onclick="app.openSignatureModal('${day.toISOString()}')">
                            <i class="fas fa-signature"></i>
                            Firmar
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderCompletedDays(signedDates) {
        const container = document.getElementById('completedList');
        if (!container) return;
        
        if (signedDates.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-times"></i>
                    <h3>Sin firmas registradas</h3>
                    <p>No hay registros de firmas completadas</p>
                </div>
            `;
            return;
        }
        
        signedDates.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        container.innerHTML = signedDates.map(signature => {
            const date = new Date(signature.date);
            const dateString = date.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            return `
                <div class="day-item completed">
                    <div class="day-info">
                        <h4>${dateString}</h4>
                        <p class="status-completed">
                            <i class="fas fa-check-circle"></i>
                            Firmado el ${signature.fecha} a las ${signature.hora}
                        </p>
                    </div>
                    <div class="day-actions">
                        <button class="btn-small btn-info" onclick="app.downloadPDF('${signature.date}')">
                            <i class="fas fa-download"></i>
                            Descargar PDF
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    openSignatureModal(dateString) {
        const date = new Date(dateString);
        this.pendingSignatureDate = date;
        
        const dateFormatted = date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        document.getElementById('modalDayInfo').innerHTML = `
            <div class="user-info">
                <h3><i class="fas fa-calendar-day"></i> ${dateFormatted}</h3>
                <p><strong>Trabajador:</strong> ${this.currentUser}</p>
                <p><strong>Horario:</strong> ${TRABAJADORES[this.currentUser].horario}</p>
            </div>
        `;
        
        this.initModalSignatureCanvas();
        this.clearModalSignature();
        document.getElementById('signSpecificDayModal').style.display = 'flex';
    }

    closeModal() {
        document.getElementById('signSpecificDayModal').style.display = 'none';
        this.pendingSignatureDate = null;
    }

    async confirmPendingSignature() {
        if (!this.pendingSignatureDate || !this.currentUser) return;
        
        if (this.isModalCanvasEmpty()) {
            this.showMessage('⚠️ Debes firmar en el área designada antes de enviar el registro. La firma es obligatoria para validar tu jornada laboral.', 'error');
            return;
        }
        
        const confirmBtn = document.getElementById('confirmSignature');
        const originalText = confirmBtn.innerHTML;
        confirmBtn.innerHTML = '<div class="loading"></div> Procesando...';
        confirmBtn.disabled = true;
        
        try {
            const formData = {
                trabajador: this.currentUser,
                dni: TRABAJADORES[this.currentUser].dni,
                horario: TRABAJADORES[this.currentUser].horario,
                fecha: this.pendingSignatureDate.toLocaleDateString('es-ES'),
                hora: new Date().toLocaleTimeString('es-ES'),
                firma: this.modalCanvas.toDataURL(),
                registroFecha: this.pendingSignatureDate.toISOString().split('T')[0]
            };
            
            await this.generatePDF(formData);
            this.addSignedDate(this.currentUser, this.pendingSignatureDate, formData);
            
            this.showMessage('✅ Firma registrada exitosamente', 'success');
            this.closeModal();
            
            if (this.currentScreen === 'pendingSignaturesScreen') {
                this.showPendingSignatures();
            }
            
        } catch (error) {
            console.error('Error al procesar la firma:', error);
            this.showMessage('Error al procesar la firma. Inténtalo de nuevo.', 'error');
        } finally {
            confirmBtn.innerHTML = originalText;
            confirmBtn.disabled = false;
        }
    }

    async downloadPDF(dateString) {
        const signedDates = this.getSignedDates(this.currentUser);
        const signature = signedDates.find(s => s.date === dateString);
        
        if (!signature) {
            this.showMessage('No se encontró la firma para esta fecha', 'error');
            return;
        }
        
        try {
            await this.generatePDF(signature);
            this.showMessage('✅ PDF descargado exitosamente', 'success');
        } catch (error) {
            console.error('Error al generar PDF:', error);
            this.showMessage('Error al generar el PDF', 'error');
        }
    }

    togglePasswordVisibility() {
        const passwordInput = document.getElementById('password');
        const showPasswordBtn = document.getElementById('showPassword');
        const icon = showPasswordBtn.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            passwordInput.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }

    initSignatureCanvas() {
        this.canvas = document.getElementById('signatureCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas(this.canvas, this.ctx);
    }

    initModalSignatureCanvas() {
        this.modalCanvas = document.getElementById('modalSignatureCanvas');
        if (!this.modalCanvas) return;
        
        this.modalCtx = this.modalCanvas.getContext('2d');
        this.setupCanvas(this.modalCanvas, this.modalCtx);
    }

    setupCanvas(canvas, ctx) {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        canvas.addEventListener('mousedown', (e) => this.startDrawing(e, canvas, ctx));
        canvas.addEventListener('mousemove', (e) => this.draw(e, canvas, ctx));
        canvas.addEventListener('mouseup', () => this.stopDrawing());
        canvas.addEventListener('mouseout', () => this.stopDrawing());

        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
        });

        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
        });

        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const mouseEvent = new MouseEvent('mouseup', {});
            canvas.dispatchEvent(mouseEvent);
        });
    }

    startDrawing(e, canvas, ctx) {
        this.isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    draw(e, canvas, ctx) {
        if (!this.isDrawing) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    stopDrawing() {
        this.isDrawing = false;
    }

    clearSignature() {
        if (this.ctx && this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    clearModalSignature() {
        if (this.modalCtx && this.modalCanvas) {
            this.modalCtx.clearRect(0, 0, this.modalCanvas.width, this.modalCanvas.height);
        }
    }

    checkTimeRestriction() {
        const now = new Date();
        const hour = now.getHours();
        const activationHour = this.settings?.activationHour || 18;
        
        if (hour >= activationHour) {
            this.showSignatureScreen();
        } else {
            this.showScreen('timeRestriction');
        }
        
        this.updateCurrentTime();
    }

    updateCurrentTime(elementId = 'currentTime') {
        const now = new Date();
        const timeString = now.toLocaleString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        const currentTimeElement = document.getElementById(elementId);
        if (currentTimeElement) {
            currentTimeElement.textContent = `Hora actual: ${timeString}`;
        }
    }

    validateForm() {
        const trabajador = document.getElementById('trabajador').value;
        const horario = document.getElementById('horario').value;
        const password = document.getElementById('password').value;
        
        if (!trabajador) {
            this.showMessage('Por favor, selecciona un trabajador.', 'error', 'main');
            return false;
        }
        
        if (!horario) {
            this.showMessage('Por favor, selecciona un horario laboral.', 'error', 'main');
            return false;
        }
        
        if (!password) {
            this.showMessage('Por favor, ingresa tu contraseña.', 'error', 'main');
            return false;
        }
        
        if (TRABAJADORES[trabajador] && TRABAJADORES[trabajador].password !== password) {
            this.showMessage('Contraseña incorrecta. Contacta con el administrador si no recuerdas tu contraseña.', 'error', 'main');
            return false;
        }
        
        if (this.isCanvasEmpty()) {
            this.showMessage('⚠️ Debes firmar en el área designada antes de enviar el registro. La firma es obligatoria para validar tu jornada laboral.', 'error', 'main');
            return false;
        }
        
        return true;
    }

    isCanvasEmpty() {
        const blank = document.createElement('canvas');
        blank.width = this.canvas.width;
        blank.height = this.canvas.height;
        return this.canvas.toDataURL() === blank.toDataURL();
    }

    isModalCanvasEmpty() {
        const blank = document.createElement('canvas');
        blank.width = this.modalCanvas.width;
        blank.height = this.modalCanvas.height;
        return this.modalCanvas.toDataURL() === blank.toDataURL();
    }

    isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        // Verificar si ya firmó hoy
        const trabajador = document.getElementById('trabajador').value;
        if (trabajador) {
            const today = new Date();
            const todayString = today.toISOString().split('T')[0];
            const signedDates = this.getSignedDates(trabajador);
            const alreadySigned = signedDates.find(s => s.date === todayString);
            
            if (alreadySigned) {
                this.showMessage('⚠️ Ya has firmado hoy. Solo puedes firmar una vez por día.', 'error', 'main');
                this.showAlreadySignedState(alreadySigned);
                return;
            }
        }
        
        if (!this.validateForm()) {
            return;
        }
        
        const submitBtn = document.getElementById('submitBtn');
        const originalContent = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<div class="loading"></div> Procesando...';
        submitBtn.disabled = true;
        
        try {
            const formData = this.getFormData();
            await this.generatePDF(formData);
            
            const today = new Date();
            this.addSignedDate(formData.trabajador, today, formData);
            
            this.showMessage('✅ Registro completado exitosamente. PDF descargado.', 'success', 'main');
            this.resetForm();
            
        } catch (error) {
            console.error('Error al procesar el registro:', error);
            this.showMessage('Error al procesar el registro. Inténtalo de nuevo.', 'error', 'main');
        } finally {
            submitBtn.innerHTML = originalContent;
            submitBtn.disabled = false;
        }
    }

    getFormData() {
        const now = new Date();
        const trabajador = document.getElementById('trabajador').value;
        
        return {
            trabajador: trabajador,
            dni: TRABAJADORES[trabajador].dni,
            horario: document.getElementById('horario').value,
            fecha: now.toLocaleDateString('es-ES'),
            hora: now.toLocaleTimeString('es-ES'),
            firma: this.canvas.toDataURL(),
            registroFecha: now.toISOString().split('T')[0]
        };
    }

    async generatePDF(data) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.setFont('helvetica');
        
        let logoBase64 = '';
        try {
            logoBase64 = await this.getLogoBase64();
        } catch (error) {
            console.warn('No se pudo cargar el logo:', error);
        }
        
        if (logoBase64) {
            doc.addImage(logoBase64, 'PNG', 15, 15, 25, 25);
        }
        
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(37, 99, 235);
        doc.text('REGISTRO HORARIO LABORAL', 105, 30, { align: 'center' });
        
        // Banner DEMO
        doc.setFontSize(10);
        doc.setTextColor(255, 99, 71);
        doc.text('*** DOCUMENTO DEMO - NO VÁLIDO LEGALMENTE ***', 105, 20, { align: 'center' });
        doc.setTextColor(0, 0, 0);
        
        doc.setDrawColor(37, 99, 235);
        doc.setLineWidth(1);
        doc.line(20, 45, 190, 45);
        
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(20, 50, 170, 20, 3, 3, 'F');
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(71, 85, 105);
        doc.text('HORARIOS LABORALES:', 25, 58);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text('PLANTA EXTERNA: 08:00 - 14:00 / 15:00 - 17:00', 25, 63);
        doc.text('OFICINA: 08:00 - 16:00', 25, 67);
        
        doc.setFillColor(37, 99, 235);
        doc.roundedRect(20, 80, 170, 8, 2, 2, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('DATOS DEL TRABAJADOR', 25, 86);
        
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(20, 95, 85, 8, 1, 1, 'F');
        doc.roundedRect(105, 95, 85, 8, 1, 1, 'F');
        doc.setFont('helvetica', 'bold');
        doc.text('Nombre y Apellidos:', 23, 101);
        doc.text('DNI:', 108, 101);
        doc.setFont('helvetica', 'normal');
        doc.text(data.trabajador.length > 25 ? data.trabajador.substring(0, 25) + '...' : data.trabajador, 23, 105);
        doc.text(data.dni, 108, 105);
        
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(20, 110, 85, 8, 1, 1, 'F');
        doc.roundedRect(105, 110, 85, 8, 1, 1, 'F');
        doc.setFont('helvetica', 'bold');
        doc.text('Fecha de Registro:', 23, 116);
        doc.text('Hora de Registro:', 108, 116);
        doc.setFont('helvetica', 'normal');
        doc.text(data.fecha, 23, 120);
        doc.text(data.hora, 108, 120);
        
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(20, 125, 170, 8, 1, 1, 'F');
        doc.setFont('helvetica', 'bold');
        doc.text('Horario Laboral:', 23, 131);
        doc.setFont('helvetica', 'normal');
        doc.text(data.horario, 23, 135);
        
        doc.setFillColor(37, 99, 235);
        doc.roundedRect(20, 145, 170, 8, 2, 2, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('DECLARACIÓN LEGAL', 25, 151);
        
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        const declaracion = '"Declaro que, en virtud de la Ley 8/1980, de 10 de marzo, del Estatuto de los Trabajadores, así como de la normativa vigente sobre registro de jornada laboral, procedo a firmar y confirmar que las horas trabajadas han sido registradas correctamente en el presente formulario. Firmo para constancia de que las horas consignadas en este registro corresponden a las realizadas durante mi jornada laboral. Acepto que la información proporcionada sea almacenada conforme a la legislación laboral vigente."';
        
        const splitDeclaracion = doc.splitTextToSize(declaracion, 170);
        doc.text(splitDeclaracion, 20, 160);
        
        doc.setFillColor(37, 99, 235);
        doc.roundedRect(20, 200, 170, 8, 2, 2, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('FIRMA DIGITAL DEL TRABAJADOR', 25, 206);
        
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.roundedRect(20, 215, 100, 35, 2, 2);
        
        if (data.firma && data.firma !== 'data:,') {
            doc.addImage(data.firma, 'PNG', 22, 217, 96, 31);
        }
        
        doc.setTextColor(71, 85, 105);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Trabajador: ${data.trabajador}`, 125, 225);
        doc.text(`DNI: ${data.dni}`, 125, 230);
        doc.text(`Fecha: ${data.fecha}`, 125, 235);
        doc.text(`Hora: ${data.hora}`, 125, 240);
        
        doc.setDrawColor(37, 99, 235);
        doc.setLineWidth(0.5);
        doc.line(20, 260, 190, 260);
        
        doc.setTextColor(100, 116, 139);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.text(`Documento generado automáticamente el ${data.fecha} a las ${data.hora}`, 105, 270, { align: 'center' });
        doc.text('Sistema de Registro Horario Laboral - Redes Carreras (DEMO)', 105, 275, { align: 'center' });
        
        const pdfBlob = doc.output('blob');
        const fileName = `DEMO_registro_${data.dni}_${data.fecha.replace(/\//g, '-')}.pdf`;
        
        doc.save(fileName);
        
        return pdfBlob;
    }

    async getLogoBase64() {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = this.width;
                canvas.height = this.height;
                ctx.drawImage(this, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            };
            img.onerror = reject;
            img.src = 'registro_app/logo-redes_Transparente-216x216.png';
        });
    }

    // Funcionalidad de email eliminada

    resetForm() {
        document.getElementById('registroForm').reset();
        document.getElementById('dni').value = '';
        this.clearSignature();
    }

    showMessage(message, type, target = 'default') {
        let statusMessage;
        
        if (target === 'auth') {
            statusMessage = document.getElementById('authStatusMessage');
        } else if (target === 'main') {
            statusMessage = document.getElementById('mainStatusMessage');
        } else {
            statusMessage = document.getElementById('statusMessage');
        }
        
        if (statusMessage) {
            statusMessage.textContent = message;
            statusMessage.className = `status-message ${type} show`;
            
            if (message.includes('✅ Bienvenido')) {
                statusMessage.classList.add('welcome-message');
            } else {
                statusMessage.classList.remove('welcome-message');
            }
            
            setTimeout(() => {
                statusMessage.classList.remove('show');
                statusMessage.classList.remove('welcome-message');
            }, 5000);
        }
    }

    // Función de estado de conexión eliminada

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('./registro_app/sw.js');
                console.log('Service Worker registrado exitosamente:', registration);
            } catch (error) {
                console.log('Error al registrar Service Worker:', error);
            }
        }
    }
    
    loadSavedPasswords() {
        console.log('🔑 Sistema de contraseñas guardadas inicializado');
    }
    
    loadSavedPasswordForWorker(trabajador) {
        // Función para futura implementación
    }
    
    checkIfSignedToday(trabajador) {
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];
        const signedDates = this.getSignedDates(trabajador);
        const todaySignature = signedDates.find(s => s.date === todayString);
        
        if (todaySignature) {
            this.showAlreadySignedState(todaySignature);
        } else {
            this.resetSignatureUI();
        }
    }
    
    showAlreadySignedState(signatureData) {
        // Ocultar canvas y botón de firma
        const signatureSection = document.querySelector('.signature-section');
        const submitBtn = document.getElementById('submitBtn');
        const passwordGroup = document.getElementById('password').closest('.form-group');
        
        if (signatureSection) {
            signatureSection.style.display = 'none';
        }
        if (submitBtn) {
            submitBtn.style.display = 'none';
        }
        if (passwordGroup) {
            passwordGroup.style.display = 'none';
        }
        
        // Mostrar mensaje y botón de descarga
        let alreadySignedDiv = document.getElementById('alreadySignedDiv');
        if (!alreadySignedDiv) {
            alreadySignedDiv = document.createElement('div');
            alreadySignedDiv.id = 'alreadySignedDiv';
            alreadySignedDiv.style.cssText = 'margin-top: 20px; padding: 20px; background: #dcfce7; border-left: 4px solid #16a34a; border-radius: 8px;';
            document.getElementById('registroForm').appendChild(alreadySignedDiv);
        }
        
        alreadySignedDiv.innerHTML = `
            <div style="margin-bottom: 15px;">
                <h3 style="color: #15803d; margin: 0 0 10px 0;">
                    <i class="fas fa-check-circle"></i> Ya has firmado hoy
                </h3>
                <p style="color: #166534; margin: 5px 0;">
                    <strong>Fecha de firma:</strong> ${signatureData.fecha}
                </p>
                <p style="color: #166534; margin: 5px 0;">
                    <strong>Hora de firma:</strong> ${signatureData.hora}
                </p>
                <p style="color: #166534; margin: 10px 0 0 0; font-size: 0.9rem;">
                    Solo puedes firmar una vez por día. Puedes descargar tu documento firmado a continuación:
                </p>
            </div>
            <button type="button" class="btn-primary" onclick="app.downloadTodayPDF()" style="background: #16a34a;">
                <i class="fas fa-download"></i>
                Descargar PDF de Hoy
            </button>
        `;
    }
    
    resetSignatureUI() {
        // Mostrar canvas y botón de firma
        const signatureSection = document.querySelector('.signature-section');
        const submitBtn = document.getElementById('submitBtn');
        const passwordGroup = document.getElementById('password').closest('.form-group');
        const alreadySignedDiv = document.getElementById('alreadySignedDiv');
        
        if (signatureSection) {
            signatureSection.style.display = 'block';
        }
        if (submitBtn) {
            submitBtn.style.display = 'block';
        }
        if (passwordGroup) {
            passwordGroup.style.display = 'block';
        }
        if (alreadySignedDiv) {
            alreadySignedDiv.remove();
        }
    }
    
    async downloadTodayPDF() {
        const trabajador = document.getElementById('trabajador').value;
        if (!trabajador) return;
        
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];
        
        // Obtener la firma del día de hoy
        const signedDates = this.getSignedDates(trabajador);
        const signature = signedDates.find(s => s.date === todayString);
        
        if (!signature) {
            this.showMessage('No se encontró la firma para hoy', 'error', 'main');
            return;
        }
        
        try {
            await this.generatePDF(signature);
            this.showMessage('✅ PDF descargado exitosamente', 'success', 'main');
        } catch (error) {
            console.error('Error al generar PDF:', error);
            this.showMessage('Error al generar el PDF', 'error', 'main');
        }
    }
}

let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new RegistroHorarioApp();
});
