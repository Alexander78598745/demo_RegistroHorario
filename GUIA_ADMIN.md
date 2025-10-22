# 📋 Guía del Panel de Administrador

## 🎯 Nuevas Funcionalidades Añadidas

Se han añadido funcionalidades de administrador a la aplicación de Registro Horario Laboral manteniendo **TODA** la funcionalidad original.

---

## 🔐 Acceso al Panel de Administrador

### Contraseña de Administrador
```
Admin2025!
```

### Cómo acceder:
1. Haz clic en el botón **"Admin"** (botón morado flotante en la esquina inferior derecha)
2. Ingresa la contraseña de administrador
3. Accederás al panel completo de administración

---

## 📊 Dashboard - Vista General

Al entrar al panel de administrador verás:

### Estadísticas en Tiempo Real
- **Total Trabajadores**: Número de trabajadores activos
- **Firmas Hoy**: Trabajadores que han firmado hoy
- **Pendientes Hoy**: Trabajadores que aún no han firmado hoy
- **Días Festivos**: Total de días festivos marcados

---

## 👥 Gestión de Usuarios

### Funciones Disponibles:

#### ✅ Añadir Trabajador
1. Haz clic en **"Añadir Trabajador"**
2. Completa el formulario:
   - Nombre completo
   - DNI
   - Contraseña (se generará automáticamente, pero puedes personalizarla)
   - Horario (PLANTA EXTERNA u OFICINA)
   - Email (opcional)
   - Teléfono (opcional)
3. Haz clic en **"Guardar"**

#### ✏️ Editar Trabajador
1. En la tabla de usuarios, haz clic en el icono **✏️ (editar)**
2. Modifica los datos necesarios
3. Guarda los cambios

#### 🔄 Activar/Desactivar Trabajador
1. Haz clic en el icono **🔘 (toggle)**
2. El trabajador quedará **activo** o **inactivo**
3. Los trabajadores inactivos:
   - No pueden iniciar sesión
   - No aparecen en los selectores de firma
   - Mantienen todo su historial de firmas

#### 🗑️ Eliminar Trabajador
1. Haz clic en el icono **🗑️ (eliminar)**
2. Confirma la eliminación
3. ⚠️ **ADVERTENCIA**: Esta acción es irreversible

---

## 📅 Calendario de Festivos

### Características:

#### Marcar Días Festivos
1. Navega por los meses usando las flechas **← →**
2. Haz clic en cualquier día **laborable** para marcarlo como festivo
3. Los días festivos se muestran en **rojo**
4. Los fines de semana se muestran en **gris** (no se pueden modificar)

#### Comportamiento Automático:
- Los trabajadores **NO** recibirán notificaciones en días festivos
- Los días festivos **NO** aparecerán como pendientes de firma
- Ideal para: festivos nacionales, locales, vacaciones de empresa, etc.

#### Leyenda del Calendario:
- 🔴 **Día festivo**: Marcado por el administrador
- ⬜ **Fin de semana**: Sábados y domingos (automático)

---

## 📥 Informes y Descargas

### Descargar Seguimiento de Firmas (Excel)

#### Pasos:
1. Selecciona el rango de fechas:
   - **Desde**: Fecha inicial
   - **Hasta**: Fecha final
2. (Opcional) Selecciona un trabajador específico o deja "Todos los trabajadores"
3. Haz clic en **"Descargar Excel"**

#### Contenido del Excel:
- Nombre del trabajador
- DNI
- Fecha de firma
- Hora de firma
- Horario laboral
- Estado (Firmado)

### Estadísticas por Trabajador

Vista rápida de:
- Nombre del trabajador
- DNI
- Estado (Activo/Inactivo)
- Total de firmas registradas
- Ordenado por número de firmas (de mayor a menor)

---

## 🔄 Funcionalidad Original Mantenida

La aplicación mantiene **TODAS** las funcionalidades originales:

### Para Trabajadores:
✅ Restricción horaria (solo después de las 18:00)
✅ Firma digital diaria
✅ Ver firmas pendientes (últimos 30 días)
✅ Ver firmas completadas
✅ Firmar días anteriores pendientes
✅ Descargar PDFs individuales
✅ Autenticación con contraseña
✅ Canvas de firma digital
✅ Generación automática de PDFs legales
✅ Declaración legal incluida
✅ Horarios automáticos según puesto

### Para el Sistema:
✅ Service Worker para modo offline
✅ PWA (Progressive Web App)
✅ Almacenamiento local de datos
✅ Envío de emails (pendiente configuración SMTP)
✅ Notificaciones push
✅ Responsive design

---

## 🎨 Mejoras de Diseño

### Panel de Administrador:
- Diseño moderno con gradientes morados
- Cards de estadísticas con iconos
- Tablas responsivas
- Calendario interactivo
- Modales para formularios
- Botones con iconos Font Awesome

### Botón de Acceso:
- Botón flotante en esquina inferior derecha
- Diseño distintivo (morado)
- Siempre accesible desde cualquier pantalla

---

## 📱 Uso Responsivo

Todo el panel de administrador está optimizado para:
- 💻 Escritorio
- 📱 Tablet
- 📱 Móvil

---

## 🔒 Seguridad

### Medidas Implementadas:
1. **Autenticación de Administrador**: Contraseña requerida para acceder
2. **Confirmación de Eliminación**: Doble verificación antes de eliminar usuarios
3. **Datos Persistentes**: Todo se guarda en localStorage del navegador
4. **Separación de Roles**: Administradores vs Trabajadores

### Recomendaciones:
- Cambia la contraseña de administrador en producción
- No compartas la contraseña de admin con trabajadores
- Haz backups periódicos de los datos

---

## 📄 Archivos Principales

### Archivos Nuevos:
- `index-admin.html`: Versión con panel de administrador
- `app-admin.js`: JavaScript con funcionalidades de admin
- `GUIA_ADMIN.md`: Esta guía

### Archivos Originales (mantenidos):
- `registro_app/index.html`: Aplicación original
- `registro_app/app.js`: JavaScript original
- `registro_app/demo-index.html`: Versión demo
- `registro_app/demo-app.js`: JavaScript demo
- `registro_app/styles.css`: Estilos

---

## 🚀 Cómo Usar

### Para Producción:
1. Abre `index-admin.html` en el navegador
2. Los trabajadores usan la aplicación normalmente
3. El administrador accede mediante el botón "Admin"

### Para Demo:
1. Abre `demo-index.html` para ver sin restricción horaria

---

## 🆘 Soporte y Problemas

### Problemas Comunes:

**P: No puedo acceder al panel de admin**
- R: Verifica que estás usando la contraseña correcta: `Admin2025!`

**P: No aparecen los trabajadores inactivos en la firma**
- R: Es el comportamiento esperado. Solo trabajadores activos pueden firmar.

**P: Los días festivos no se guardan**
- R: Asegúrate de estar haciendo clic en días laborables (L-V), no en fines de semana.

**P: El Excel no se descarga**
- R: Verifica que has seleccionado fechas válidas (desde < hasta).

---

## 📝 Notas Importantes

1. **Datos Locales**: Todos los datos se guardan en el navegador. Si limpias la caché, perderás los datos.

2. **Compatibilidad**: Funciona en navegadores modernos (Chrome, Firefox, Edge, Safari).

3. **Bibliotecas Usadas**:
   - jsPDF: Generación de PDFs
   - SheetJS (XLSX): Exportación a Excel
   - Font Awesome: Iconos

4. **Fecha de Inicio**: La aplicación considera el 1 de octubre de 2025 como fecha de inicio del sistema.

---

## ✨ Características Destacadas

### Lo Mejor del Panel de Admin:

🎯 **Dashboard Intuitivo**: Estadísticas en tiempo real

👥 **Gestión Completa**: CRUD completo de usuarios

📅 **Calendario Visual**: Marca festivos con un clic

📊 **Reportes Excel**: Exporta datos fácilmente

🔄 **Sin Interrupciones**: Funcionalidad original 100% intacta

🎨 **Diseño Moderno**: Interfaz profesional y atractiva

📱 **100% Responsive**: Funciona en todos los dispositivos

---

## 🎉 ¡Listo para Usar!

El sistema está completamente funcional y listo para producción. Solo necesitas:

1. Abrir `index-admin.html`
2. Configurar los usuarios (o mantener los existentes)
3. Marcar los días festivos del año
4. ¡Los trabajadores pueden empezar a firmar!

---

**Desarrollado con ❤️ por MiniMax Agent**

**Versión**: 2.0 con Panel de Administrador

**Fecha**: Octubre 2025