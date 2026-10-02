/**
 * KazuStore Perú - Catálogo Central de Productos y Servicios
 * Estructura de datos completa, actualizada con psicología de ventas y precios oficiales.
 */
const KAZU_CATALOG = [
  // ==========================================
  // STREAMING & TV
  // ==========================================
  {
    id: "netflix-perfil",
    name: "Netflix Ultra HD 4K",
    category: "streaming",
    price: 13.50,
    regularPrice: 15.00,
    renewalPrice: 15.00,
    referralMinPrice: 12.00,
    periodicity: "mes",
    accessType: "Perfil Privado",
    tag: "Más Vendido",
    badgeColor: "netflix",
    icon: '<img src="assets/icons/netflix.svg" alt="Netflix">',
    featured: true,
    rating: 4.9,
    description: "Perfil 100% privado con PIN exclusivo para 1 pantalla. Calidad máxima 4K HDR + audio espacial con garantía de continuidad ininterrumpida.",
    specs: [
      "Perfil 100% privado con PIN exclusivo (1 dispositivo)",
      "Calidad máxima 4K HDR + audio espacial",
      "Garantía de servicio por 30 días con canal oficial de soporte",
      "1.er Mes de Bienvenida: S/ 13.50 (Renovación normal: S/ 15.00)",
      "Club Referidos: -S/ 1.00 por amigo activo (Baja hasta S/ 12.00/mes)",
      "Condición: Mantener PIN asignado sin modificar datos de cuenta"
    ],
    welcomeBenefit: "Primer mes a S/ 13.50 (Renovación: S/ 15.00 o hasta S/ 12 con referidos)",
    deliveryTime: "3-5 min",
    stock: "Disponible"
  },
  {
    id: "disney-estandar",
    name: "Disney+ Estándar",
    category: "streaming",
    price: 5.90,
    regularPrice: 6.90,
    periodicity: "mes",
    accessType: "Perfil Privado",
    tag: "Plan Básico",
    badgeColor: "disney",
    icon: '<img src="assets/icons/disneyplus.svg" alt="Disney+">',
    featured: false,
    rating: 4.8,
    description: "Disfruta de todo el catálogo de Disney, Pixar, Marvel y Star. 1 perfil privado en resolución Full HD.",
    specs: [
      "1 Perfil privado en resolución Full HD",
      "Descargas activas para ver sin conexión",
      "Cobertura garantizada durante tus 30 días",
      "Condición: Uso exclusivo en 1 pantalla a la vez"
    ],
    welcomeBenefit: "Primer mes a S/ 5.90 (Antes S/ 6.90)",
    deliveryTime: "3-5 min",
    stock: "Disponible"
  },
  {
    id: "disney-premium",
    name: "Disney+ Premium (con ESPN)",
    category: "streaming",
    price: 8.50,
    regularPrice: 9.90,
    periodicity: "mes",
    accessType: "Perfil Privado",
    tag: "Incluye ESPN",
    badgeColor: "disney",
    icon: '<img src="assets/icons/disneyplus.svg" alt="Disney+ ESPN">',
    featured: true,
    rating: 4.9,
    description: "Catálogo completo + todos los canales y eventos exclusivos de ESPN en vivo. Audio Dolby Atmos y video 4K UHD.",
    specs: [
      "Eventos deportivos exclusivos y canales ESPN en vivo",
      "Audio Dolby Atmos y video 4K UHD",
      "Soporte y garantía completa por 30 días",
      "Condición: 1 perfil privado / 1 conexión simultánea"
    ],
    welcomeBenefit: "Primer mes a S/ 8.50 (Antes S/ 9.90)",
    deliveryTime: "3-5 min",
    stock: "Disponible"
  },
  {
    id: "max-estandar",
    name: "Max Estándar (HBO)",
    category: "streaming",
    price: 5.90,
    regularPrice: 6.90,
    periodicity: "mes",
    accessType: "Perfil Privado",
    tag: "Popular",
    badgeColor: "max",
    icon: '<img src="assets/icons/max.svg" alt="Max HBO">',
    featured: true,
    rating: 4.8,
    description: "Las mejores series de HBO, Warner y Discovery. 1 Perfil personalizado para 1 pantalla en Full HD sin publicidad.",
    specs: [
      "1 Perfil personalizado para 1 pantalla",
      "Calidad Full HD sin publicidad ni interrupciones",
      "Garantía de reposición activa durante tus 30 días",
      "Condición: Respetar perfil asignado para conservar garantía"
    ],
    welcomeBenefit: "Primer mes a S/ 5.90 (Antes S/ 6.90)",
    deliveryTime: "3-5 min",
    stock: "Disponible"
  },
  {
    id: "crunchyroll-fan",
    name: "Crunchyroll Fan",
    category: "streaming",
    price: 5.90,
    regularPrice: 6.90,
    periodicity: "mes",
    accessType: "Perfil Privado",
    tag: "Anime Fan",
    badgeColor: "crunchyroll",
    icon: '<img src="assets/icons/crunchyroll.svg" alt="Crunchyroll">',
    featured: true,
    rating: 4.9,
    description: "Todo el anime legal en simultáneo con Japón sin pausas comerciales. 1 Pantalla privada en alta definición.",
    specs: [
      "1 Pantalla privada en alta definición",
      "Capítulos estreno 1 hora después de emitirse en Japón",
      "30 días con respaldo y soporte total de KAZUSTORE",
      "Condición: Conexión en 1 dispositivo a la vez"
    ],
    welcomeBenefit: "Primer mes a S/ 5.90 (Antes S/ 6.90)",
    deliveryTime: "3-5 min",
    stock: "Disponible"
  },
  {
    id: "paramount-plus",
    name: "Paramount+ / Oleada TV",
    category: "streaming",
    price: 6.90,
    regularPrice: 7.90,
    periodicity: "mes",
    accessType: "Perfil Privado",
    tag: "Cine & Deportes",
    badgeColor: "paramount",
    icon: '<img src="assets/icons/paramount.svg" alt="Paramount+">',
    featured: false,
    rating: 4.7,
    description: "Accede a cine taquillero, series exclusivas y señales en vivo con streaming fluido en alta resolución.",
    specs: [
      "1 Pantalla asignada con streaming fluido en HD",
      "Soporte continuo y garantía de reposición por 30 días",
      "Catálogo Nickelodeon, Showtime y fútbol exclusivo",
      "Condición: No compartir credenciales para evitar bloqueos por IP"
    ],
    welcomeBenefit: "Primer mes a S/ 6.90 (Antes S/ 7.90)",
    deliveryTime: "3-5 min",
    stock: "Disponible"
  },
  {
    id: "prime-video",
    name: "Amazon Prime Video (Cuenta Completa)",
    category: "streaming",
    price: 20.90,
    regularPrice: 23.90,
    periodicity: "mes",
    accessType: "Cuenta Completa",
    tag: "Familiar",
    badgeColor: "prime",
    icon: '<img src="assets/icons/prime.svg" alt="Prime Video">',
    featured: true,
    rating: 4.9,
    description: "Cuenta totalmente privada: control total de 3 perfiles en simultáneo. Calidad 4K UHD con garantía directa.",
    specs: [
      "Cuenta privada total (control de 3 perfiles en simultáneo)",
      "Calidad 4K UHD + envíos Prime si aplica",
      "Garantía directa de reposición durante los 30 días",
      "Condición: Crea tus propios perfiles; no modificar correo base"
    ],
    welcomeBenefit: "Primer mes a S/ 20.90 (Antes S/ 23.90)",
    deliveryTime: "3-5 min",
    stock: "Disponible"
  },
  {
    id: "iptv-premium",
    name: "IPTV Canales en Vivo + VOD",
    category: "streaming",
    price: 13.90,
    regularPrice: 15.90,
    periodicity: "mes",
    accessType: "Cuenta Completa",
    tag: "+1500 Canales",
    badgeColor: "iptv",
    icon: '<img src="assets/icons/iptv.svg" alt="IPTV Premium">',
    featured: true,
    rating: 4.8,
    description: "Más de 1,500 canales en vivo (Fútbol, cable prémium, internacionales) + películas de estreno para Smart TV y celular.",
    specs: [
      "Más de 1,500 señales en vivo + biblioteca de estrenos VOD",
      "Compatible con Smart TV, TV Box, celulares Android/iOS y PC",
      "30 días de señal continua, fluida y estable",
      "Condición: Válido para 1 conexión activa simultánea"
    ],
    welcomeBenefit: "Primer mes a S/ 13.90 (Antes S/ 15.90)",
    deliveryTime: "3-5 min",
    stock: "Disponible"
  },
  {
    id: "xuper-tv",
    name: "Xuper TV (Acceso Permanente)",
    category: "streaming",
    price: 26.90,
    regularPrice: 29.90,
    periodicity: "permanente",
    accessType: "Licencia Vitalicia",
    tag: "Pago Único",
    badgeColor: "iptv",
    icon: '<img src="assets/icons/xuper.png" alt="Xuper TV">',
    featured: false,
    rating: 4.8,
    description: "Acceso completo a programación abierta y prémium sin preocuparte por renovaciones mensuales. Instalación sencilla.",
    specs: [
      "Pago único sin suscripciones recurrentes de por vida",
      "Programación nacional e internacional en alta definición",
      "Instalación sencilla paso a paso con código de activación",
      "Condición: Licencia válida para 1 equipo compatible"
    ],
    welcomeBenefit: "Acceso definitivo por S/ 26.90 (Antes S/ 29.90)",
    deliveryTime: "5 min",
    stock: "Disponible"
  },

  // ==========================================
  // MÚSICA & AUDIO
  // ==========================================
  {
    id: "spotify-premium",
    name: "Spotify Premium Individual",
    category: "musica",
    price: 7.50,
    regularPrice: 8.90,
    periodicity: "mes",
    accessType: "Cuenta Completa",
    tag: "Sin Anuncios",
    badgeColor: "spotify",
    icon: '<img src="assets/icons/spotify.svg" alt="Spotify">',
    featured: true,
    rating: 5.0,
    description: "Música en alta calidad y descargas sin conexión. Saltos ilimitados y 30 días con garantía de renovación fluida.",
    specs: [
      "Música en alta calidad de 320 kbps y descargas offline",
      "Saltos de canciones totalmente ilimitados",
      "30 días garantizados con renovación fluida a tu correo o cuenta lista",
      "Condición: Vinculación personal según modalidad activa"
    ],
    welcomeBenefit: "Primer mes a S/ 7.50 (Antes S/ 8.90)",
    deliveryTime: "3-5 min",
    stock: "Disponible"
  },
  {
    id: "youtube-premium",
    name: "YouTube Premium + Music",
    category: "musica",
    price: 8.50,
    regularPrice: 9.90,
    periodicity: "mes",
    accessType: "Cuenta Completa",
    tag: "Cero Publicidad",
    badgeColor: "youtube",
    icon: '<img src="assets/icons/youtube.svg" alt="YouTube">',
    featured: true,
    rating: 4.9,
    description: "Cero anuncios en Smart TV, móvil y PC. Reproducción en segundo plano y descargas libres en YouTube Music.",
    specs: [
      "Cero publicidad en videos en Smart TV, celular y PC",
      "Reproducción en segundo plano y con pantalla apagada",
      "Descargas libres + catálogo completo de YouTube Music",
      "Condición: 30 días continuos con activación oficial por invitación"
    ],
    welcomeBenefit: "Primer mes a S/ 8.50 (Antes S/ 9.90)",
    deliveryTime: "3-5 min",
    stock: "Disponible"
  },
  {
    id: "tidal-deezer",
    name: "Tidal HiFi / Deezer Premium",
    category: "musica",
    price: 7.50,
    regularPrice: 8.90,
    periodicity: "mes",
    accessType: "Perfil Privado",
    tag: "Audio HiFi / FLAC",
    badgeColor: "tidal",
    icon: '<img src="assets/icons/tidal.svg" alt="Tidal HiFi">',
    featured: false,
    rating: 4.8,
    description: "Lleva tu experiencia sonora al nivel audiófilo. Calidad de sonido Master / FLAC sin pérdidas y modo offline.",
    specs: [
      "Sonido Master / HiRes FLAC sin compresión ni pérdidas",
      "Modo offline para escuchar sin conexión ni anuncios",
      "30 días de suscripción garantizada de reposición",
      "Condición: Perfil de uso personal para 1 dispositivo"
    ],
    welcomeBenefit: "Primer mes a S/ 7.50 (Antes S/ 8.90)",
    deliveryTime: "5 min",
    stock: "Disponible"
  },

  // ==========================================
  // SISTEMAS & OFIMÁTICA
  // ==========================================
  {
    id: "windows-licencia",
    name: "Windows 10 / 11 Pro o Home (Permanente)",
    category: "sistemas",
    price: 17.90,
    regularPrice: 20.90,
    periodicity: "permanente",
    accessType: "Licencia Original",
    tag: "Key Oficial 25 Dígitos",
    badgeColor: "windows",
    icon: '<img src="assets/icons/windows.svg" alt="Windows Oficial">',
    featured: true,
    rating: 5.0,
    description: "Serial alfanumérico genuino de 25 dígitos para 1 PC. Válida de por vida con todas las actualizaciones de seguridad.",
    specs: [
      "Clave genuina de 25 dígitos para 1 equipo (Home o Pro)",
      "Licencia permanente de por vida (soporta reinstalaciones)",
      "Habilita actualizaciones oficiales directas desde Microsoft",
      "Condición: Clave de 1 solo uso para activación directa en tu equipo"
    ],
    welcomeBenefit: "Precio especial activación: S/ 17.90 (Antes S/ 20.90)",
    deliveryTime: "3-5 min",
    stock: "Disponible"
  },
  {
    id: "m365-onedrive",
    name: "Microsoft 365 (Office + 1TB OneDrive)",
    category: "sistemas",
    price: 19.90,
    regularPrice: 22.90,
    periodicity: "anual",
    accessType: "Licencia Original",
    tag: "1TB Nube Anual",
    badgeColor: "office",
    icon: '<img src="assets/icons/microsoft365.svg" alt="Microsoft 365">',
    featured: true,
    rating: 5.0,
    description: "Suite completa para estudiar o trabajar: Word, Excel, PowerPoint y 1,000 GB en OneDrive hasta en 5 equipos durante 365 días.",
    specs: [
      "Word, Excel, PowerPoint y Outlook siempre actualizados",
      "1,000 GB (1 TB) de almacenamiento en la nube OneDrive",
      "Instalación simultánea en hasta 5 dispositivos (PC, Mac, Celular)",
      "Duración: 365 días continuos garantizados con cuenta oficial"
    ],
    welcomeBenefit: "Primer año por S/ 19.90 (Antes S/ 22.90)",
    deliveryTime: "3-5 min",
    stock: "Disponible"
  },
  {
    id: "ilovepdf-premium",
    name: "iLovePDF Premium (1 Año)",
    category: "sistemas",
    price: 11.90,
    regularPrice: 13.90,
    periodicity: "anual",
    accessType: "Cuenta Completa",
    tag: "OCR & Edición",
    badgeColor: "pdf",
    icon: '<img src="assets/icons/pdf.svg" alt="iLovePDF">',
    featured: false,
    rating: 4.9,
    description: "Edita y convierte archivos PDF sin restricciones. Reconocimiento óptico OCR, compresión y firmas ilimitadas por 1 año.",
    specs: [
      "OCR de alta precisión para digitalizar textos escaneados",
      "Edición, unión, compresión pesada y firmas ilimitadas",
      "Acceso web y app de escritorio durante 365 días",
      "Condición: Licencia personal para trabajo continuo"
    ],
    welcomeBenefit: "Suscripción anual por S/ 11.90 (Antes S/ 13.90)",
    deliveryTime: "3-5 min",
    stock: "Disponible"
  },

  // ==========================================
  // INTELIGENCIA ARTIFICIAL
  // ==========================================
  {
    id: "chatgpt-go",
    name: "ChatGPT Go (1 Mes)",
    category: "ia-dev",
    price: 9.50,
    regularPrice: 10.90,
    periodicity: "mes",
    accessType: "Perfil Privado",
    tag: "Productividad IA",
    badgeColor: "ai",
    icon: '<img src="assets/icons/chatgpt.svg" alt="ChatGPT">',
    featured: true,
    rating: 4.9,
    description: "Aumenta tu productividad diaria: redacción de informes, ideas, resúmenes y asistencia inteligente sin saturación por 30 días.",
    specs: [
      "Redacción de informes, ideas y código sin saturación",
      "Disponibilidad continua durante 30 días garantizados",
      "Soporte inmediato y reposición activa",
      "Condición: Uso personal según los límites de la plataforma"
    ],
    welcomeBenefit: "Primer mes a S/ 9.50 (Antes S/ 10.90)",
    deliveryTime: "3-5 min",
    stock: "Disponible"
  },
  {
    id: "lovable-pro",
    name: "Lovable Pro (1 Mes)",
    category: "ia-dev",
    price: 16.90,
    regularPrice: 18.90,
    periodicity: "mes",
    accessType: "Perfil Privado",
    tag: "Desarrollo Código",
    badgeColor: "ai",
    icon: '<img src="assets/icons/lovable.svg" alt="Lovable Pro">',
    featured: false,
    rating: 4.8,
    description: "Desarrolla aplicaciones y código con asistencia de IA a máxima velocidad con cuota y herramientas Pro por 30 días.",
    specs: [
      "Herramientas y cuota Pro para desarrollo de software con IA",
      "30 días de suscripción con respaldo de soporte KazuStore",
      "Ideal para prototipar aplicaciones y generar UI moderna",
      "Condición: Cuenta asignada para proyectos de desarrollo"
    ],
    welcomeBenefit: "Primer mes por S/ 16.90 (Antes S/ 18.90)",
    deliveryTime: "5 min",
    stock: "Disponible"
  },
  {
    id: "gemini-pro-18m",
    name: "Gemini Pro (18 Meses)",
    category: "ia-dev",
    price: 21.90,
    regularPrice: 25.90,
    periodicity: "18 meses",
    accessType: "Cuenta Completa",
    tag: "540 Días Cobertura",
    badgeColor: "ai",
    icon: '<img src="assets/icons/gemini.svg" alt="Google Gemini Pro">',
    featured: true,
    rating: 5.0,
    description: "La mayor ventana de contexto y potencia analítica de Google en tus manos con cobertura extendida de 18 meses (540 días).",
    specs: [
      "Análisis profundo de documentos extensos, programación y multimodalidad",
      "Cobertura extendida de 18 meses continuos (540 días)",
      "Soporte y garantía activa durante todo el período",
      "Condición: Acceso individual asignado con respaldo oficial"
    ],
    welcomeBenefit: "Acceso total 18 meses por S/ 21.90 (Antes S/ 25.90)",
    deliveryTime: "3-5 min",
    stock: "Disponible"
  },

  // ==========================================
  // DISEÑO & CREACIÓN
  // ==========================================
  {
    id: "canva-pro-anual",
    name: "Canva Pro (1 Año)",
    category: "diseno",
    price: 8.50,
    regularPrice: 9.90,
    periodicity: "anual",
    accessType: "Cuenta Completa",
    tag: "1 Año Completo",
    badgeColor: "canva",
    icon: '<img src="assets/icons/canva.svg" alt="Canva Pro">',
    featured: true,
    rating: 5.0,
    description: "Crea contenido visual impactante: quita fondos en 1 clic, fuentes y plantillas premium directo a tu correo por 365 días.",
    specs: [
      "Quita fondos de imágenes y videos en 1 solo clic",
      "Millones de fotos, plantillas, fuentes y elementos premium",
      "Se activa directo a tu correo por 1 año completo (365 días)",
      "Condición: Activación limpia sin alterar tus proyectos anteriores"
    ],
    welcomeBenefit: "Tu primer año por S/ 8.50 (Antes S/ 9.90)",
    deliveryTime: "3-5 min",
    stock: "Disponible"
  },
  {
    id: "capcut-pro",
    name: "CapCut Pro (1 Mes)",
    category: "diseno",
    price: 14.50,
    regularPrice: 16.90,
    periodicity: "mes",
    accessType: "Perfil Privado",
    tag: "Móvil y PC",
    badgeColor: "capcut",
    icon: '<img src="assets/icons/capcut.svg" alt="CapCut Pro">',
    featured: true,
    rating: 4.9,
    description: "Edita videos sin marcas de agua: efectos Pro desbloqueados, subtítulos automáticos y exportación en 4K a 60 FPS por 30 días.",
    specs: [
      "Efectos, transiciones y animaciones Pro desbloqueadas",
      "Subtítulos automáticos y herramientas de IA visual",
      "Exportación limpia en 4K a 60 FPS durante 30 días",
      "Condición: 1 sesión activa por usuario en móvil o PC"
    ],
    welcomeBenefit: "Primer mes a S/ 14.50 (Antes S/ 16.90)",
    deliveryTime: "3-5 min",
    stock: "Disponible"
  },
  {
    id: "adobe-express",
    name: "Adobe Express (6 Meses)",
    category: "diseno",
    price: 17.90,
    regularPrice: 20.90,
    periodicity: "6 meses",
    accessType: "Cuenta Completa",
    tag: "Semestral",
    badgeColor: "adobe",
    icon: '<img src="assets/icons/express.svg" alt="Adobe Express">',
    featured: false,
    rating: 4.8,
    description: "Diseño rápido con la potencia del ecosistema Adobe: tipografías Adobe Fonts y acciones rápidas con IA durante 180 días.",
    specs: [
      "Tipografías de Adobe Fonts y miles de recursos gráficos oficiales",
      "Acciones rápidas asistidas por IA de Photoshop",
      "Duración: 6 meses de servicio garantizado (180 días)",
      "Condición: Licencia vinculada para uso personal"
    ],
    welcomeBenefit: "Tu semestre por solo S/ 17.90 (Antes S/ 20.90)",
    deliveryTime: "5 min",
    stock: "Disponible"
  },
  {
    id: "autocad-licencia",
    name: "Autodesk AutoCAD (1 Año)",
    category: "diseno",
    price: 15.90,
    regularPrice: 18.90,
    periodicity: "anual",
    accessType: "Licencia Original",
    tag: "Arquitectura & Ing",
    badgeColor: "autodesk",
    icon: '<img src="assets/icons/autodesk.svg" alt="AutoCAD">',
    featured: true,
    rating: 5.0,
    description: "Dibuja, diseña y proyecta con la herramienta líder de ingeniería. Descarga oficial Autodesk y herramientas 2D/3D por 1 año.",
    specs: [
      "Descarga e instalación directa desde la web oficial de Autodesk",
      "Uso de herramientas completas 2D y modelado 3D",
      "Licencia válida por 1 año completo (365 días)",
      "Condición: Se vincula a tu correo personal o institucional con garantía"
    ],
    welcomeBenefit: "Licencia anual por S/ 15.90 (Antes S/ 18.90)",
    deliveryTime: "10-15 min",
    stock: "Pocas Unidades"
  },

  // ==========================================
  // HARDWARE & ACCESORIOS
  // ==========================================
  {
    id: "smartwatch-ultra",
    name: "Smartwatch Ultra 2 Edition (Serie 9)",
    category: "hardware",
    price: 69,
    regularPrice: 90,
    periodicity: "pago único",
    accessType: "Hardware",
    tag: "Envío Gratis Lima",
    badgeColor: "hardware",
    icon: '<img src="assets/icons/smartwatch.svg" alt="Smartwatch">',
    featured: true,
    rating: 4.8,
    description: "Caja de titanio de 49mm, pantalla AMOLED de 2.02 pulgadas sin marcos, llamadas Bluetooth, monitoreo cardíaco y resistencia al agua.",
    specs: [
      "Pantalla HD Always-On Display de 2.02 pulgadas",
      "Batería de larga duración (4 a 6 días de uso)",
      "Incluye 2 correas intercambiables (Ocean + Alpine) y cargador inalámbrico",
      "Garantía física de 3 meses por falla de fábrica"
    ],
    welcomeBenefit: "Envío inmediato gratis en Lima Metropolitana",
    deliveryTime: "Mismo día Lima / 24h Provincias",
    stock: "12 unidades en almacén"
  },
  {
    id: "airpods-pro-2nd",
    name: "AirPods Pro 2da Gen (High-End ANC)",
    category: "hardware",
    price: 79,
    regularPrice: 109,
    periodicity: "pago único",
    accessType: "Hardware",
    tag: "Cancelación Activa",
    badgeColor: "hardware",
    icon: '<img src="assets/icons/airpods.svg" alt="AirPods">',
    featured: true,
    rating: 4.9,
    description: "Cancelación Activa de Ruido (ANC) real, audio espacial dinámico, chip H2, estuche MagSafe USB-C y compatibilidad total iOS/Android.",
    specs: [
      "Cancelación de Ruido Activa (ANC) y Modo Transparencia",
      "Audio Espacial con seguimiento dinámico de la cabeza",
      "Hasta 6 horas de reproducción continua (30h con estuche)",
      "Garantía física directa de 3 meses en Perú"
    ],
    welcomeBenefit: "Incluye funda protectora de silicona de regalo",
    deliveryTime: "Mismo día Lima / 24h Provincias",
    stock: "8 unidades en almacén"
  }
];

// Configuración general del negocio
const KAZU_CONFIG = {
  storeName: "KazuStore Perú",
  whatsappNumber: "51979380273", // Número oficial
  telegram: "@BernardoHaise23",
  email: "bernardocubas36@gmail.com",
  currency: "S/",
  paymentMethods: ["Yape", "Plin", "BCP", "BBVA", "Interbank"],
  supportHours: "Lunes a Domingo: 7:00 AM - 11:50 PM",
  guaranteeNote: "Todos nuestros accesos cuentan con garantía durante todo el periodo contratado con reposición inmediata."
};
