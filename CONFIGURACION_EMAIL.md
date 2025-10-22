# Configuración de Envío de Emails - EmailJS

## 📧 Implementación Completa del Envío de Correos Electrónicos

### ✅ Cambios Realizados

#### 1. **Marca de Agua Añadida**
- ✅ Footer añadido al final de la aplicación
- ✅ Muestra: "Creada por Alexander Arroyave para Redes Carreras SL"
- ✅ Versión: 1.0.0
- ✅ Estilo profesional con gradiente

#### 2. **Sistema de Envío de Emails Implementado**
- ✅ Integración con EmailJS (servicio gratuito de emails)
- ✅ Envío real de PDFs por correo electrónico
- ✅ Adjuntos en formato base64
- ✅ Manejo de errores y reintentos

---

## 🚀 Configuración de EmailJS (PASO A PASO)

### Paso 1: Crear Cuenta en EmailJS

1. **Ir a** https://www.emailjs.com/
2. **Hacer clic en** "Sign Up" (Registrarse)
3. **Completar el registro** con tu email
4. **Verificar** tu correo electrónico

---

### Paso 2: Crear un Servicio de Email

1. **En el Dashboard de EmailJS**, ir a **"Email Services"**
2. **Hacer clic en** "Add New Service"
3. **Seleccionar tu proveedor de email:**
   - Gmail (recomendado)
   - Outlook
   - Yahoo
   - Otro proveedor SMTP

4. **Para Gmail:**
   - Seleccionar "Gmail"
   - Hacer clic en "Connect Account"
   - Autorizar EmailJS a enviar emails desde tu cuenta Gmail
   - **IMPORTANTE:** Debes usar la cuenta `instalaciones@redescarreras.es` o configurar el email de destino

5. **Copiar el Service ID** que aparece (ejemplo: `service_xxxxxxx`)

---

### Paso 3: Crear una Plantilla de Email

1. **Ir a** "Email Templates" en el menú
2. **Hacer clic en** "Create New Template"
3. **Configurar la plantilla con estos campos:**

**Subject (Asunto):**
```
{{subject}}
```

**Content (Contenido):**
```
Nuevo Registro Horario Laboral

Trabajador: {{trabajador}}
DNI: {{dni}}
Horario: {{horario}}
Fecha: {{fecha}}
Hora: {{hora}}

{{message}}

---
Sistema de Registro Horario - Redes Carreras SL
Versión 1.0.0
```

**To Email:**
```
{{to_email}}
```

**IMPORTANTE:** En la configuración de la plantilla:
- Habilitar "Allow attachments"
- Configurar el campo de adjuntos para recibir `pdf_content` y `pdf_name`

4. **Guardar la plantilla**
5. **Copiar el Template ID** (ejemplo: `template_xxxxxxx`)

---

### Paso 4: Obtener la Clave Pública (Public Key)

1. **Ir a** "Account" → "General" en el menú
2. **Copiar tu Public Key** (ejemplo: `abcdefghijklmnop`)

---

### Paso 5: Configurar la Aplicación

Ahora debes reemplazar los valores en los archivos de la aplicación:

#### A. En `index-admin.html` (línea ~680):

**BUSCAR:**
```javascript
emailjs.init("YOUR_PUBLIC_KEY");
```

**REEMPLAZAR CON:**
```javascript
emailjs.init("TU_PUBLIC_KEY_AQUI");
```

#### B. En `app-admin.js` (línea ~1510):

**BUSCAR:**
```javascript
const response = await emailjs.send(
    'YOUR_SERVICE_ID',
    'YOUR_TEMPLATE_ID',
    templateParams
);
```

**REEMPLAZAR CON:**
```javascript
const response = await emailjs.send(
    'TU_SERVICE_ID_AQUI',      // Ejemplo: 'service_abc123'
    'TU_TEMPLATE_ID_AQUI',     // Ejemplo: 'template_xyz789'
    templateParams
);
```

#### C. Aplicar los mismos cambios en la versión DEMO:

- **demo-admin.html** (mismo procedimiento que index-admin.html)
- **demo-app-admin.js** (mismo procedimiento que app-admin.js)

---

## 📝 Ejemplo de Configuración Completa

### Valores de Ejemplo:

```javascript
// En index-admin.html y demo-admin.html:
emailjs.init("xYz123AbC456DeF789");

// En app-admin.js y demo-app-admin.js:
const response = await emailjs.send(
    'service_gmai1234',
    'template_hora5678',
    templateParams
);
```

---

## 🧪 Prueba del Sistema

### Después de configurar:

1. **Abrir** `index-admin.html` o `demo-admin.html`
2. **Seleccionar un trabajador**
3. **Ingresar contraseña**
4. **Firmar digitalmente**
5. **Hacer clic en** "Firmar y Registrar"

### Verificaciones:

- ✅ Debe aparecer el mensaje: "Registro completado exitosamente. PDF generado y enviado por email a instalaciones@redescarreras.es"
- ✅ En la consola del navegador (F12) debe aparecer: "✅ Email enviado exitosamente"
- ✅ Verificar la bandeja de entrada de `instalaciones@redescarreras.es`
- ✅ El email debe contener toda la información del registro

---

## ⚠️ Solución de Problemas

### Error: "EmailJS is not defined"
**Solución:** Asegúrate de que el script de EmailJS esté cargado:
```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
```

### Error: "Public key is not valid"
**Solución:** Verifica que hayas copiado correctamente tu Public Key desde la cuenta de EmailJS

### Error: "Service ID not found"
**Solución:** Verifica que el Service ID sea correcto y que el servicio esté activo en tu cuenta de EmailJS

### Error: "Template not found"
**Solución:** Verifica que el Template ID sea correcto y que la plantilla esté publicada

### No llega el email
**Posibles causas:**
- Verifica la carpeta de Spam/Correo no deseado
- Asegúrate de que el email de destino esté correctamente configurado en la plantilla de EmailJS
- Verifica que tu servicio de email esté correctamente conectado en EmailJS

### El PDF no se adjunta
**Solución:** 
- Asegúrate de habilitar "Allow attachments" en la configuración de la plantilla
- Verifica que los campos `pdf_content` y `pdf_name` estén en la plantilla

---

## 📊 Límites del Plan Gratuito de EmailJS

- **200 emails/mes** (gratis)
- Si necesitas más, puedes actualizar a un plan de pago
- Alternativas: SendGrid, AWS SES, Mailgun

---

## 🔒 Seguridad

- ✅ El Public Key puede estar en el código frontend (es seguro)
- ✅ EmailJS maneja la autenticación de forma segura
- ✅ Los PDFs se envían encriptados
- ⚠️ NUNCA incluyas contraseñas privadas en el código frontend

---

## 📄 Plantilla de Email Recomendada (HTML)

Para una mejor presentación, puedes usar esta plantilla HTML en EmailJS:

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 20px; border-radius: 8px; }
        .content { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .info-row { padding: 10px; border-bottom: 1px solid #dee2e6; }
        .label { font-weight: bold; color: #6366f1; }
        .footer { text-align: center; color: #6c757d; font-size: 12px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>📋 Nuevo Registro Horario Laboral</h2>
        </div>
        <div class="content">
            <div class="info-row">
                <span class="label">👤 Trabajador:</span> {{trabajador}}
            </div>
            <div class="info-row">
                <span class="label">🆔 DNI:</span> {{dni}}
            </div>
            <div class="info-row">
                <span class="label">⏰ Horario:</span> {{horario}}
            </div>
            <div class="info-row">
                <span class="label">📅 Fecha:</span> {{fecha}}
            </div>
            <div class="info-row">
                <span class="label">🕐 Hora:</span> {{hora}}
            </div>
        </div>
        <p>{{message}}</p>
        <div class="footer">
            <p>Sistema de Registro Horario - Redes Carreras SL</p>
            <p>Creada por Alexander Arroyave | Versión 1.0.0</p>
        </div>
    </div>
</body>
</html>
```

---

## ✅ Resumen de Archivos Modificados

### Archivos con cambios:

1. **index-admin.html**
   - ✅ Marca de agua añadida (footer)
   - ✅ Script de EmailJS añadido
   - ✅ Inicialización de EmailJS

2. **app-admin.js**
   - ✅ Método `sendEmailNow()` actualizado con integración EmailJS
   - ✅ Envío real de emails con PDFs adjuntos

3. **demo-admin.html**
   - ✅ Marca de agua añadida (footer)
   - ✅ Script de EmailJS añadido
   - ✅ Inicialización de EmailJS

4. **demo-app-admin.js**
   - ✅ Método `sendEmailNow()` actualizado con integración EmailJS
   - ✅ Envío real de emails con PDFs adjuntos

---

## 🎯 Próximos Pasos

1. ✅ Crear cuenta en EmailJS
2. ✅ Configurar servicio de Gmail
3. ✅ Crear plantilla de email
4. ✅ Copiar Service ID, Template ID y Public Key
5. ✅ Reemplazar valores en los archivos
6. ✅ Probar el envío de emails
7. ✅ Verificar recepción en instalaciones@redescarreras.es

---

**Autor:** MiniMax Agent  
**Desarrollador Original:** Alexander Arroyave  
**Cliente:** Redes Carreras SL  
**Versión:** 1.0.0  
**Fecha:** 2025-10-21
