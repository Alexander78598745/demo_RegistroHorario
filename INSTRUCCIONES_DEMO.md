# 🎮 Instrucciones para Probar la Demo

## 🚀 Inicio Rápido

### Versión con Administrador (RECOMENDADA)

**Archivo**: `index-admin.html`

#### Para Probar como Trabajador:
1. Abre `index-admin.html` en tu navegador
2. Espera a que sean las 18:00 o modifica temporalmente la restricción
3. Selecciona un trabajador del listado
4. Ingresa su contraseña (ver CREDENCIALES_ADMIN.md)
5. Completa el formulario de firma
6. ¡Firma digitalmente!
7. Descarga el PDF generado

#### Para Probar como Administrador:
1. Abre `index-admin.html` en tu navegador
2. Haz clic en el botón morado **"Admin"** (esquina inferior derecha)
3. Ingresa la contraseña: `Admin2025!`
4. Explora el panel de administrador:
   - ✅ Ver estadísticas en tiempo real
   - ✅ Gestionar usuarios (añadir, editar, activar/desactivar, eliminar)
   - ✅ Marcar días festivos en el calendario
   - ✅ Descargar reportes en Excel
   - ✅ Ver estadísticas por trabajador

---

## 📋 Pruebas Recomendadas

### Test 1: Dashboard de Admin
1. Accede al panel de admin
2. Observa las estadísticas en las tarjetas superiores
3. Verifica que muestren datos correctos

### Test 2: Añadir Usuario
1. En el panel de admin, pestaña "Gestión de Usuarios"
2. Haz clic en "Añadir Trabajador"
3. Completa el formulario:
   ```
   Nombre: JUAN PÉREZ LÓPEZ
   DNI: 12345678Z
   Contraseña: JPL-ABC123
   Horario: PLANTA EXTERNA
   Email: juan@ejemplo.com
   Teléfono: 600123456
   ```
4. Guarda y verifica que aparezca en la tabla

### Test 3: Desactivar Usuario
1. En la tabla de usuarios, busca al usuario recién creado
2. Haz clic en el icono de toggle (🔘)
3. Verifica que el estado cambie a "Inactivo"
4. Sal del panel de admin
5. Intenta iniciar sesión como ese usuario
6. Debe aparecer error: "Usuario inactivo"

### Test 4: Marcar Días Festivos
1. En el panel de admin, pestaña "Calendario Festivos"
2. Navega al mes actual
3. Haz clic en varios días laborables (lunes a viernes)
4. Verifica que se marquen en rojo
5. Haz clic de nuevo para desmarcarlos
6. Verifica que se actualice el contador "Días Festivos"

### Test 5: Exportar a Excel
1. En el panel de admin, pestaña "Informes y Descargas"
2. Selecciona un rango de fechas
3. Deja "Todos los trabajadores" o selecciona uno específico
4. Haz clic en "Descargar Excel"
5. Abre el archivo descargado y verifica el contenido

### Test 6: Firma de Trabajador
1. Sal del panel de admin
2. Selecciona un trabajador: **BORJA CARRERAS MARTIN**
3. Ingresa contraseña: **BCM-K8L3X**
4. Completa el formulario
5. Firma en el canvas
6. Envía el formulario
7. Verifica que se descargue el PDF
8. Abre el PDF y verifica:
   - Logo de la empresa
   - Datos del trabajador
   - Firma digital
   - Declaración legal

### Test 7: Ver Firmas Pendientes
1. Inicia sesión como trabajador
2. Accede al "Panel de Gestión"
3. Selecciona "Firmas Pendientes"
4. Verifica la lista de días sin firmar
5. Haz clic en "Firmar" en un día específico
6. Completa la firma
7. Verifica que desaparezca de pendientes

### Test 8: Ver Firmas Completadas
1. Con sesión iniciada
2. Ve a "Firmas Completadas"
3. Verifica la lista de días firmados
4. Haz clic en "Descargar PDF" de cualquier día
5. Verifica que se descargue el PDF correctamente

---

## 🎯 Escenarios de Uso Real

### Escenario 1: Nuevo Empleado
1. El admin añade al nuevo empleado
2. Genera una contraseña
3. Se la comunica al empleado
4. El empleado accede y firma su primer día

### Escenario 2: Empleado de Baja
1. El admin desactiva al empleado
2. El empleado no puede acceder
3. El historial se mantiene intacto
4. Cuando vuelva, se reactiva

### Escenario 3: Festivo Nacional
1. El admin marca el día como festivo
2. Los empleados no verán ese día como pendiente
3. No recibirán notificaciones ese día

### Escenario 4: Auditoría Mensual
1. El admin selecciona el mes completo
2. Exporta a Excel
3. Revisa las firmas de todos los empleados
4. Identifica días sin firmar

---

## 🔄 Comparación de Versiones

### `index-admin.html` (Nueva - CON Admin)
✅ Panel de administrador completo
✅ Gestión de usuarios
✅ Calendario de festivos
✅ Exportación a Excel
✅ Todas las funcionalidades originales

### `registro_app/index.html` (Original)
✅ Funcionalidad básica de firma
✅ Gestión de firmas pendientes/completadas
❌ Sin panel de administrador

### `registro_app/demo-index.html` (Demo sin restricción)
✅ Funcionalidad básica de firma
✅ Sin restricción horaria (siempre disponible)
❌ Sin panel de administrador

---

## 💡 Tips para la Demo

### Modificar Restricción Horaria (Temporal)

Si quieres probar sin esperar a las 18:00:

1. Abre `app-admin.js`
2. Busca la función `checkTimeRestriction()`:
   ```javascript
   checkTimeRestriction() {
       const now = new Date();
       const hour = now.getHours();
       
       if (hour >= 18) {  // Cambia 18 por 0 para siempre disponible
           this.showSignatureScreen();
       } else {
           this.showScreen('timeRestriction');
       }
       
       this.updateCurrentTime();
   }
   ```
3. Cambia `18` por `0`
4. Guarda y recarga la página

### Limpiar Datos de Prueba

Para empezar de cero:

1. Abre las DevTools del navegador (F12)
2. Ve a la pestaña "Application" > "Local Storage"
3. Elimina todas las entradas
4. Recarga la página

---

## 📱 Probar en Dispositivos

### Escritorio:
- Abre directamente el archivo HTML
- Usa Chrome DevTools para simular móvil (F12 > Toggle Device Toolbar)

### Móvil:
- Necesitas un servidor local (Python, Node, etc.)
- Ejemplo con Python:
  ```bash
  python -m http.server 8000
  ```
- Accede desde el móvil a: `http://tu-ip:8000/index-admin.html`

---

## ✅ Checklist de Prueba

### Panel de Administrador:
- [ ] Acceso con contraseña
- [ ] Dashboard con estadísticas
- [ ] Añadir usuario
- [ ] Editar usuario
- [ ] Activar/Desactivar usuario
- [ ] Eliminar usuario
- [ ] Marcar días festivos
- [ ] Desmarcar días festivos
- [ ] Exportar a Excel (todos)
- [ ] Exportar a Excel (un trabajador)
- [ ] Ver estadísticas por trabajador
- [ ] Navegación entre pestañas
- [ ] Salir del panel

### Funcionalidad de Trabajadores:
- [ ] Restricción horaria (18:00)
- [ ] Login con contraseña
- [ ] Selección de trabajador
- [ ] Auto-completar DNI y horario
- [ ] Firma digital en canvas
- [ ] Limpiar firma
- [ ] Validación de campos
- [ ] Generación de PDF
- [ ] Descarga de PDF
- [ ] Ver firmas pendientes
- [ ] Firmar día específico
- [ ] Ver firmas completadas
- [ ] Descargar PDF antiguo
- [ ] Responsive design

---

## 🎉 ¡Disfruta la Demo!

La aplicación está completamente funcional. Cualquier dato que ingreses se guardará en el navegador hasta que limpies la caché.

**¿Preguntas?** Consulta la `GUIA_ADMIN.md`

---

**Happy Testing! 🚀**