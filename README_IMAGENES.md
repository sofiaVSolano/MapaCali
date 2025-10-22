# Agregar Imágenes al Mapa de Cali

## 📸 Nueva Funcionalidad: Marcadores de Imagen

Esta funcionalidad te permite colocar imágenes en ubicaciones específicas del mapa de Cali usando coordenadas de latitud y longitud.

## ✨ Características

- ✅ Subir imágenes (JPG, PNG, etc.)
- ✅ Especificar coordenadas exactas (latitud y longitud)
- ✅ Agregar descripción opcional a cada imagen
- ✅ Vista previa antes de agregar al mapa
- ✅ Las imágenes aparecen como marcadores interactivos
- ✅ Al hacer clic en la imagen se muestra un popup con información

## 🚀 Cómo usar

### 1. Acceder a la funcionalidad

En la vista del mapa principal (`/map`), encontrarás dos botones en la esquina superior derecha:
- **Crear Marcador** (azul) - Para marcadores tradicionales
- **Agregar Imagen** (verde) - Para agregar imágenes con ubicación

### 2. Abrir el modal

Haz clic en el botón **"Agregar Imagen"** (verde).

### 3. Completar el formulario

**a) Nombre/Descripción (opcional)**
```
Ejemplo: "Vista panorámica del centro de Cali"
```

**b) Coordenadas de ubicación**
- **Latitud**: Entre 3.4 y 3.5 (Cali)
- **Longitud**: Entre -76.6 y -76.5 (Cali)

Ejemplos de ubicaciones en Cali:
- Centro: `Lat: 3.4516, Lng: -76.5319`
- Cristo Rey: `Lat: 3.4378, Lng: -76.5537`
- Zoológico: `Lat: 3.4449, Lng: -76.4985`
- Universidad del Valle: `Lat: 3.3740, Lng: -76.5321`

**c) Seleccionar imagen**
- Haz clic en el área de carga
- Selecciona una imagen de tu computadora
- Tamaño máximo: 5MB
- Formatos aceptados: JPG, PNG, WEBP, GIF

### 4. Vista previa

Una vez seleccionada la imagen, verás una vista previa de cómo se verá en el mapa.

### 5. Agregar al mapa

Haz clic en el botón **"Agregar al Mapa"** para colocar la imagen en la ubicación especificada.

## 🗺️ Visualización en el mapa

- Las imágenes aparecen como pequeñas miniaturas (50x50 px) con borde blanco y sombra
- Al pasar el mouse, la imagen se agranda ligeramente
- Al hacer clic, se abre un popup con:
  - Nombre/descripción (si fue agregado)
  - Imagen en tamaño grande
  - Coordenadas exactas de ubicación

## 📝 Ejemplos de uso

### Ejemplo 1: Documentar daños en vías
```
Nombre: "Hueco en la Cra 5 con Calle 13"
Lat: 3.4500
Lng: -76.5350
Imagen: foto_hueco.jpg
```

### Ejemplo 2: Monitoreo urbano
```
Nombre: "Nueva construcción - Edificio Torre"
Lat: 3.4420
Lng: -76.5280
Imagen: construccion.jpg
```

### Ejemplo 3: Eventos especiales
```
Nombre: "Feria de Cali 2025 - Plaza de Cayzedo"
Lat: 3.4516
Lng: -76.5319
Imagen: feria_cali.jpg
```

## 💡 Tips

1. **Coordenadas precisas**: Usa Google Maps para obtener coordenadas exactas
   - Haz clic derecho en el mapa de Google Maps
   - Selecciona las coordenadas para copiarlas

2. **Tamaño de imagen**: Imágenes más pequeñas cargan más rápido
   - Recomendado: máximo 2MB
   - Resolución óptima: 1200x1200 px o menos

3. **Nombres descriptivos**: Ayuda a identificar rápidamente las imágenes en el mapa

4. **Organización**: Las imágenes se mantienen en sesión actual
   - Para persistencia permanente, se requiere implementar backend

## 🎨 Personalización

Las imágenes en el mapa tienen estilos CSS que pueden modificarse en:
```
src/modules/mapa/pages/Mapa/styles.css
```

Busca la clase `.image-marker-icon` para personalizar:
- Tamaño del marcador
- Forma (border-radius)
- Sombras
- Efectos hover

## 🔧 Consideraciones técnicas

- Las imágenes se almacenan como Base64 en el estado local de React
- No hay persistencia en base de datos (las imágenes se pierden al recargar)
- Para implementar persistencia, considera:
  - Subir imágenes a un servicio de almacenamiento (AWS S3, Cloudinary)
  - Guardar URLs en la base de datos
  - Modificar el servicio `mapitaAPI.ts` para incluir endpoints de imágenes

## 🐛 Solución de problemas

**Problema**: La imagen no aparece en el mapa
- Verifica que las coordenadas estén dentro del rango de Cali
- Asegúrate de que la imagen sea menor a 5MB
- Verifica que el formato de imagen sea compatible

**Problema**: El botón "Agregar al Mapa" está deshabilitado
- Completa todos los campos requeridos
- Verifica que hayas seleccionado una imagen
- Asegúrate de que las coordenadas sean números válidos

## 📱 Compatibilidad

- ✅ Chrome, Firefox, Safari, Edge (últimas versiones)
- ✅ Responsive (móvil y desktop)
- ✅ Compatible con todas las capas del mapa existentes

## 🚀 Próximas mejoras sugeridas

- [ ] Persistencia en base de datos
- [ ] Editar/eliminar imágenes agregadas
- [ ] Arrastrar y soltar imágenes en el mapa
- [ ] Galería de imágenes por ubicación
- [ ] Filtros por fecha de carga
- [ ] Comentarios en las imágenes
- [ ] Compartir imágenes con URL
