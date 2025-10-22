# 📍 Sistema de Guardado de Marcadores - MapaCali

## ✨ Características

El sistema de marcadores ahora incluye funcionalidad de **persistencia de datos** para que los marcadores que creas se guarden automáticamente.

## 🔧 Cómo Funciona

### 1. **Guardado Automático**

Cuando creas un marcador (normal o imagen), este se guarda automáticamente en dos ubicaciones:

- **API Backend**: Intenta guardar en la base de datos a través de los endpoints:
  - `POST /marcadores` - Para marcadores normales
  - `POST /marcadores-imagen` - Para marcadores con imagen

- **LocalStorage (Backup)**: Guarda una copia en el navegador como respaldo

### 2. **Carga Automática**

Al cargar el mapa:
1. Se cargan los marcadores desde la API
2. Se agregan los marcadores personalizados desde localStorage
3. Se cargan las imágenes desde localStorage

### 3. **Gestión de Marcadores**

Usa el botón **"Ver Guardados" 📋** para:
- Ver todos tus marcadores guardados
- Eliminar marcadores individuales
- Limpiar todos los marcadores de una vez

## 📦 Estructura de Datos

### Marcadores Normales (localStorage: `customMarkers`)
```json
[
  {
    "nombre": "Hospital San Juan",
    "tipo": "hospitales",
    "lat": 3.4516,
    "lng": -76.532
  }
]
```

### Marcadores de Imagen (localStorage: `imageMarkers`)
```json
[
  {
    "nombre": "Vista panorámica",
    "lat": 3.4516,
    "lng": -76.532,
    "imageUrl": "data:image/png;base64,..."
  }
]
```

## 🎯 Uso

### Crear Marcador Normal
1. Click en **"Crear Marcador" 📍**
2. Completa el formulario (nombre, tipo, coordenadas)
3. Click en **"Crear Marcador"**
4. ✅ Se guarda automáticamente

### Crear Marcador con Imagen
1. Click en **"Agregar Imagen" 📸**
2. Sube una imagen (máx 5MB)
3. Ingresa nombre y coordenadas
4. Click en **"Agregar al Mapa"**
5. ✅ Se guarda automáticamente

### Ver Marcadores Guardados
1. Click en **"Ver Guardados" 📋**
2. Se abre un panel lateral con todos tus marcadores
3. Puedes eliminar individuales o limpiar todo

## 🔄 Sincronización

- **Primera vez**: Los marcadores se guardan en localStorage
- **Recargas**: Se cargan automáticamente desde localStorage
- **API disponible**: También intenta guardar en el servidor
- **Sin conexión**: Funciona con localStorage como backup

## 🗑️ Eliminar Marcadores

### Individual
1. Abre "Ver Guardados"
2. Click en el ícono 🗑️ del marcador
3. Confirma la eliminación
4. La página se recarga automáticamente

### Todos
1. Abre "Ver Guardados"
2. Click en "Limpiar Todo"
3. Confirma la acción
4. Todos los marcadores se eliminan

## 💡 Notas Importantes

- Los marcadores se guardan **por navegador** (localStorage)
- Si cambias de navegador, los marcadores no se transferirán
- Los marcadores de la API se cargan automáticamente cada vez
- Las imágenes se guardan en formato Base64 (pueden ocupar espacio)
- Límite de localStorage: ~5-10MB (depende del navegador)

## 🚀 Mejoras Futuras

- [ ] Sincronización completa con base de datos
- [ ] Exportar/Importar marcadores (JSON)
- [ ] Categorización personalizada
- [ ] Búsqueda de marcadores guardados
- [ ] Compartir marcadores con otros usuarios

## 🐛 Solución de Problemas

### Los marcadores no aparecen después de recargar
- Verifica la consola del navegador (F12)
- Revisa que localStorage no esté lleno
- Prueba limpiando el caché del navegador

### Error al guardar en la API
- Los marcadores se guardan de todos modos en localStorage
- Revisa la conexión con el backend
- Verifica que el endpoint esté disponible

### Imágenes muy grandes
- Reduce el tamaño de la imagen antes de subirla
- Usa compresión de imagen (recomendado: < 1MB)
- Límite actual: 5MB por imagen

---

**Desarrollado por**: Equipo MapaCali  
**Última actualización**: Octubre 2025
