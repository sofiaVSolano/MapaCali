# 🗺️ Configuración de Google Maps Places API

## 📍 Integración de Google Maps en MapaCali

El modal de creación de marcadores ahora incluye integración con **Google Maps Places API** para buscar ubicaciones y obtener coordenadas automáticamente.

## 🔑 Obtener tu API Key de Google Maps

### Paso 1: Crear una API Key

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita las siguientes APIs:
   - **Places API**
   - **Maps JavaScript API** (opcional)
   - **Geocoding API** (opcional)

4. Ve a **APIs y Servicios** > **Credenciales**
5. Click en **Crear credenciales** > **Clave de API**
6. Copia tu API Key

### Paso 2: Configurar Restricciones (Recomendado)

Para seguridad, configura restricciones:

1. Click en tu API Key
2. En **Restricciones de aplicación**, selecciona:
   - **Referentes HTTP (sitios web)**
   - Agrega: `http://localhost:5173/*` (para desarrollo)
   - Agrega: `https://tudominio.com/*` (para producción)

3. En **Restricciones de API**, selecciona:
   - **Restricción de clave**
   - Marca: **Places API**

## ⚙️ Configurar la API Key en el Proyecto

### Método 1: Directamente en index.html

Abre `/Users/cgiohidalgos/Desktop/MapaCali/index.html` y reemplaza:

```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places&language=es"></script>
```

Por:

```html
<script src="https://maps.googleapis.com/maps/api/js?key=TU_API_KEY_AQUI&libraries=places&language=es"></script>
```

### Método 2: Usando Variables de Entorno (Más seguro)

1. Crea/edita el archivo `.env` en la raíz del proyecto:

```env
VITE_GOOGLE_MAPS_API_KEY=TU_API_KEY_AQUI
```

2. Modifica `index.html` para usar la variable (requiere configuración adicional de Vite)

**Nota**: Por simplicidad, usa el Método 1 para desarrollo local.

## 🚀 Cómo Usar la Búsqueda de Google Maps

### En el Modal de Crear Marcador:

1. Click en **"Crear Marcador" 📍**
2. En el campo **"Buscar lugar con Google Maps"**:
   - Escribe el nombre de un lugar (ej: "Hospital Universitario del Valle, Cali")
   - Aparecerán sugerencias automáticas
3. Selecciona un lugar de la lista
4. Las coordenadas se completarán automáticamente
5. El nombre del lugar también se auto-completará
6. Selecciona la categoría y haz click en **"Crear Marcador"**

### Características:

- ✅ **Autocompletado inteligente**: Sugiere lugares mientras escribes
- ✅ **Búsqueda localizada**: Prioriza resultados en Cali, Colombia
- ✅ **Coordenadas automáticas**: Obtiene lat/lng precisas
- ✅ **Auto-relleno**: Completa el nombre del marcador automáticamente
- ✅ **Fallback manual**: Siempre puedes ingresar coordenadas manualmente

## 🔧 Solución de Problemas

### La búsqueda no funciona

**Problema**: No aparecen sugerencias al buscar

**Soluciones**:
1. Verifica que tu API Key esté correctamente configurada en `index.html`
2. Revisa la consola del navegador (F12) para ver errores
3. Verifica que hayas habilitado **Places API** en Google Cloud Console
4. Asegúrate de haber agregado `http://localhost:5173` en las restricciones de referentes

### Error: "This API key is not authorized"

**Soluciones**:
1. Ve a Google Cloud Console
2. Verifica que **Places API** esté habilitada
3. Revisa las restricciones de la API Key
4. Puede tardar unos minutos en activarse después de crearla

### Error: "You have exceeded your request quota"

**Solución**:
- Google Maps Places API tiene un límite gratuito
- Ve a **Facturación** en Google Cloud Console
- El nivel gratuito incluye $200 USD/mes de crédito

## 💰 Costos

Google Maps Places API incluye:
- **$200 USD/mes** en crédito gratuito
- **Autocomplete**: $2.83 por cada 1,000 solicitudes
- **Place Details**: $17 por cada 1,000 solicitudes

**Para desarrollo local**: El crédito gratuito es más que suficiente.

## 📝 Ejemplo de Búsquedas

Prueba buscar:
- "Hospital Universitario del Valle, Cali"
- "Universidad del Valle, Cali"
- "Terminal de Transporte de Cali"
- "Centro Comercial Chipichape"
- "Parque del Perro, Cali"

## 🔐 Seguridad

**⚠️ IMPORTANTE**:
- **NO** compartas tu API Key públicamente
- **NO** la subas a GitHub sin restricciones
- Configura restricciones de referentes HTTP
- Para producción, usa variables de entorno del servidor

## 📚 Documentación Adicional

- [Google Maps Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
- [Places Autocomplete](https://developers.google.com/maps/documentation/javascript/place-autocomplete)
- [Pricing](https://developers.google.com/maps/billing-and-pricing/pricing)

---

**Desarrollado por**: Equipo MapaCali  
**Última actualización**: Octubre 2025
