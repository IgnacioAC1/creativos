export interface Lesson {
  id: string;
  title: string;
  duration: string;
  description: string;
  videoUrl: string;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  code: string;
  slug: string;
  title: string;
  level: string;
  lessons: number;
  hours: string;
  price: string;
  description: string;
  image: string;
  alt: string;
  topics: string[];
  profesorSlug: string;
  published: boolean;
  modules: Module[];
}

export interface FacultyMember {
  slug: string;
  name: string;
  role: string;
  courses: number;
  bio: string;
  image: string;
  alt: string;
}

export const courses: Course[] = [
  {
    code: "AC-01",
    slug: "identidad-visual",
    title: "Identidad Visual",
    level: "Fundamentos",
    lessons: 32,
    hours: "18h",
    price: "€249",
    description:
      "Construye sistemas de identidad desde cero a través de 32 lecciones en vídeo. Aprende a crear marcas con coherencia, criterio y aplicaciones reales.",
    image:
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=600&fit=crop&auto=format",
    alt: "Curso de identidad visual — manual de marca y logotipos",
    topics: ["Marca y símbolo", "Sistemas cromáticos", "Tipografía corporativa", "Aplicaciones"],
    profesorSlug: "marta-solis",
    published: true,
    modules: [
      {
        id: "ac01-m1",
        title: "Fundamentos de la Marca",
        lessons: [
          { id: "ac01-m1-l1", title: "Qué es una marca y qué no lo es", duration: "15 min", description: "Diferencias conceptuales entre marca, logo y sistema de identidad. Casos históricos y contemporáneos que ilustran cada concepto.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
          { id: "ac01-m1-l2", title: "Brief de identidad: las preguntas correctas", duration: "18 min", description: "Cómo construir un brief efectivo que guíe el proceso creativo. Plantillas y metodología para extraer información clave del cliente.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
          { id: "ac01-m1-l3", title: "Mapa de valores y arquetipos", duration: "22 min", description: "Técnicas para definir la personalidad de una marca. Los 12 arquetipos de Jung aplicados al diseño gráfico.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
          { id: "ac01-m1-l4", title: "Análisis de referentes visuales", duration: "20 min", description: "Metodología para construir moodboards útiles. Cómo analizar la competencia sin copiarla.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
          { id: "ac01-m1-l5", title: "Proyecto: Brief de tu marca", duration: "30 min", description: "Ejercicio práctico donde definirás el brief completo de un proyecto de identidad real que desarrollarás a lo largo del curso.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
        ],
      },
      {
        id: "ac01-m2",
        title: "Sistemas Cromáticos",
        lessons: [
          { id: "ac01-m2-l1", title: "Teoría del color aplicada a marca", duration: "25 min", description: "Psicología del color, temperatura, contraste y armonía. Cómo el color comunica valores de marca antes de que el cliente lea una sola palabra.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
          { id: "ac01-m2-l2", title: "Paletas primarias y secundarias", duration: "18 min", description: "Construcción de sistemas cromáticos con jerarquía clara. Paleta principal, de acento y neutros.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
          { id: "ac01-m2-l3", title: "Color en entornos digitales vs. impresos", duration: "16 min", description: "RGB, CMYK, Pantone y sus diferencias prácticas. Cómo especificar el color para que sobreviva en cualquier soporte.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
          { id: "ac01-m2-l4", title: "Proyecto: Sistema cromático completo", duration: "28 min", description: "Definición y documentación del sistema cromático de tu proyecto. Entregables profesionales.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
        ],
      },
      {
        id: "ac01-m3",
        title: "Tipografía Corporativa y Aplicaciones",
        lessons: [
          { id: "ac01-m3-l1", title: "Selección tipográfica para marca", duration: "20 min", description: "Cómo elegir familias tipográficas que refuercen la personalidad de marca. Criterios profesionales y errores comunes.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
          { id: "ac01-m3-l2", title: "Jerarquía y sistema tipográfico", duration: "22 min", description: "Definición de estilos de texto: display, heading, body, caption. Consistencia en todas las aplicaciones.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
          { id: "ac01-m3-l3", title: "Manual de marca: estructura y entregables", duration: "35 min", description: "Cómo estructurar y presentar un manual de marca profesional. Qué incluir, qué omitir y cómo documentar el sistema para que otros lo usen correctamente.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
          { id: "ac01-m3-l4", title: "Aplicaciones: papelería, digital y señalética", duration: "30 min", description: "Aplicación del sistema a soportes reales. Tarjeta de visita, membrete, firma de correo, perfiles de redes y señalética básica.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
          { id: "ac01-m3-l5", title: "Proyecto final: Presentación de identidad", duration: "45 min", description: "Presentación del proyecto completo de identidad: brief, concepto, sistema cromático, tipografía y aplicaciones. Revisión y feedback.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
        ],
      },
    ],
  },
  {
    code: "AC-02",
    slug: "tipografia-editorial",
    title: "Tipografía & Editorial",
    level: "Avanzado",
    lessons: 24,
    hours: "12h",
    price: "€199",
    description:
      "24 lecciones en vídeo sobre el tipo como arquitectura. Jerarquía, grilla, ritmo y composición aplicados a libros, revistas y sistemas digitales.",
    image:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=600&fit=crop&auto=format",
    alt: "Curso de tipografía — composición editorial con grilla tipográfica",
    topics: ["Anatomía tipográfica", "Grillas editoriales", "Párrafo y ritmo", "Diseño de publicaciones"],
    profesorSlug: "diego-ferran",
    published: true,
    modules: [
      {
        id: "ac02-m1",
        title: "Anatomía y Clasificación Tipográfica",
        lessons: [
          { id: "ac02-m1-l1", title: "Terminología tipográfica esencial", duration: "18 min", description: "Serif, sans-serif, slab, monospace. Partes del carácter: ascendente, descendente, ojo, contrapunzón. El vocabulario que todo diseñador debe dominar.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
          { id: "ac02-m1-l2", title: "Clasificación histórica: de Gutenberg a hoy", duration: "24 min", description: "Garalda, transitional, didone, geométricas, humanistas. Un recorrido por la evolución del tipo y lo que cada período nos enseña sobre diseño.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
          { id: "ac02-m1-l3", title: "Legibilidad vs. Leibilidad", duration: "15 min", description: "La diferencia entre poder leer una letra y querer leer un texto largo. Factores que afectan a la lectura: tamaño, interletraje, interlínea y medida.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
          { id: "ac02-m1-l4", title: "Cómo elegir una tipografía con criterio", duration: "20 min", description: "Más allá del gusto: criterios objetivos para seleccionar tipos en función del contenido, el soporte y el público.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
        ],
      },
      {
        id: "ac02-m2",
        title: "Grilla y Composición Editorial",
        lessons: [
          { id: "ac02-m2-l1", title: "La grilla como herramienta creativa", duration: "22 min", description: "Historia y función de la grilla. Cómo Müller-Brockmann cambió el diseño para siempre y qué podemos aprender de eso hoy.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
          { id: "ac02-m2-l2", title: "Construcción de grillas para impreso", duration: "28 min", description: "Módulo, columnas, canalillos, márgenes. Cómo calcular una grilla para cualquier formato desde cero, sin plantillas.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
          { id: "ac02-m2-l3", title: "Ritmo vertical y línea base", duration: "20 min", description: "El concepto más ignorado en diseño editorial: la línea de base. Cómo crear ritmo vertical consistente en una publicación.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
          { id: "ac02-m2-l4", title: "Proyecto: Maquetación de 8 páginas", duration: "40 min", description: "Aplicación práctica de todo lo aprendido: maqueta 8 páginas de una publicación real usando la grilla que hayas diseñado.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
        ],
      },
      {
        id: "ac02-m3",
        title: "Sistemas Digitales y Publicaciones",
        lessons: [
          { id: "ac02-m3-l1", title: "Tipografía para pantalla: las reglas cambian", duration: "18 min", description: "Cómo adaptar los principios editoriales al medio digital. Tamaños, interlineados y medidas óptimas para web y apps.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
          { id: "ac02-m3-l2", title: "Jerarquía tipográfica en sistemas digitales", duration: "22 min", description: "Construcción de un sistema tipográfico escalable para productos digitales: de la H1 al caption, con lógica y consistencia.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
          { id: "ac02-m3-l3", title: "Proyecto final: Publicación editorial completa", duration: "50 min", description: "Diseño y maquetación de una publicación de 16 páginas: portada, sumario, artículos con fotos y páginas de texto puro.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
        ],
      },
    ],
  },
  {
    code: "AC-03",
    slug: "diseno-web-digital",
    title: "Diseño Web & Digital",
    level: "Intermedio",
    lessons: 38,
    hours: "20h",
    price: "€299",
    description:
      "38 lecciones en vídeo que van de la pantalla al sistema. UI, prototipado, motion y handoff para diseñadores que quieren trabajar en producto.",
    image:
      "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=600&fit=crop&auto=format",
    alt: "Curso de diseño web — interfaz de usuario y componentes digitales",
    topics: ["Sistemas de diseño", "UI y componentes", "Prototipado", "Motion básico"],
    profesorSlug: "lucia-vega",
    published: true,
    modules: [
      {
        id: "ac03-m1",
        title: "Fundamentos de UI",
        lessons: [
          { id: "ac03-m1-l1", title: "De diseño gráfico a diseño de producto", duration: "20 min", description: "Qué cambia cuando diseñas para pantalla. Estados, interacciones y tiempo: los tres elementos que no existen en impreso.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
          { id: "ac03-m1-l2", title: "Principios de usabilidad que todo diseñador debe conocer", duration: "22 min", description: "Las 10 heurísticas de Nielsen aplicadas a casos reales. Diseño centrado en el usuario sin ser UX researcher.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
          { id: "ac03-m1-l3", title: "Layout y grillas responsive", duration: "25 min", description: "Cómo estructurar páginas que funcionen en cualquier dispositivo. Columnas, breakpoints y el concepto de fluid design.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
          { id: "ac03-m1-l4", title: "Tipografía y color en interfaces", duration: "18 min", description: "Adaptación de los principios tipográficos y cromáticos al entorno digital. Contraste de accesibilidad y modos oscuro/claro.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
        ],
      },
      {
        id: "ac03-m2",
        title: "Sistemas de Diseño y Componentes",
        lessons: [
          { id: "ac03-m2-l1", title: "Qué es un sistema de diseño", duration: "20 min", description: "La diferencia entre una guía de estilo, una librería de componentes y un sistema de diseño. Por qué importa y cuándo construirlo.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
          { id: "ac03-m2-l2", title: "Tokens y variables en Figma", duration: "28 min", description: "Uso de variables en Figma para construir sistemas escalables. Color tokens, tipografía, espaciado y cómo conectarlos a tus componentes.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
          { id: "ac03-m2-l3", title: "Librería de componentes: átomos y moléculas", duration: "35 min", description: "Atomic design en la práctica. Construcción de una librería desde botones y inputs hasta cards y modales.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
          { id: "ac03-m2-l4", title: "Proyecto: Sistema de diseño de una app", duration: "45 min", description: "Construcción del sistema de diseño completo para una app de gestión. Entregable para incluir en portfolio.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
        ],
      },
      {
        id: "ac03-m3",
        title: "Prototipado, Motion y Handoff",
        lessons: [
          { id: "ac03-m3-l1", title: "Prototipado de alta fidelidad en Figma", duration: "30 min", description: "Flujos interactivos, overlays, scroll y transiciones. Cómo crear un prototipo que comunique el comportamiento real.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
          { id: "ac03-m3-l2", title: "Motion design básico para UI", duration: "25 min", description: "Los principios de animación aplicados a interfaces: ease, duración, staging. Microanimaciones que mejoran la experiencia.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
          { id: "ac03-m3-l3", title: "Handoff a desarrollo: el arte de comunicar", duration: "22 min", description: "Cómo preparar tus archivos para que el equipo de desarrollo los implemente sin reuniones de emergencia.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
          { id: "ac03-m3-l4", title: "Proyecto final: Producto digital completo", duration: "50 min", description: "Diseño completo de una aplicación: sistema de diseño, pantallas principales, flujos prototipados y especificaciones de handoff.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
        ],
      },
    ],
  },
  {
    code: "AC-04",
    slug: "direccion-de-arte",
    title: "Dirección de Arte",
    level: "Máster",
    lessons: 56,
    hours: "30h",
    price: "€449",
    description:
      "El programa más completo de la academia: 56 lecciones en vídeo para diseñadores con experiencia que quieren liderar proyectos de mayor envergadura.",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=600&fit=crop&auto=format",
    alt: "Curso de dirección de arte — sesión fotográfica y producción visual",
    topics: ["Concepto y estrategia", "Fotografía y producción", "Presentación de proyectos", "Liderazgo creativo"],
    profesorSlug: "marta-solis",
    published: true,
    modules: [
      {
        id: "ac04-m1",
        title: "Concepto y Estrategia Creativa",
        lessons: [
          { id: "ac04-m1-l1", title: "El director de arte: rol y responsabilidades", duration: "20 min", description: "Qué hace exactamente un director de arte. Diferencias con diseñador gráfico, creative director y art buyer.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
          { id: "ac04-m1-l2", title: "Pensamiento conceptual: de problema a idea", duration: "28 min", description: "Metodologías para generar ideas con consistencia. De la investigación al concepto visual que lo sostiene todo.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
          { id: "ac04-m1-l3", title: "Estrategia visual para campañas", duration: "25 min", description: "Cómo traducir una estrategia de marca en un lenguaje visual coherente. Trabajar con briefings de marketing y agencias.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
          { id: "ac04-m1-l4", title: "Presentación de concepto al cliente", duration: "30 min", description: "Cómo presentar y defender una dirección creativa. Narrativa, recursos visuales y gestión de objeciones.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
        ],
      },
      {
        id: "ac04-m2",
        title: "Fotografía y Producción Visual",
        lessons: [
          { id: "ac04-m2-l1", title: "Dirección de fotografía: cómo hablar con un fotógrafo", duration: "22 min", description: "El vocabulario y las herramientas del director de arte en el set. Moodboard de producción, references y comunicación con el equipo técnico.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
          { id: "ac04-m2-l2", title: "Luz, composición y punto de vista", duration: "25 min", description: "Principios fotográficos que todo director de arte debe dominar, aunque no maneje la cámara.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
          { id: "ac04-m2-l3", title: "Retoque y postproducción con criterio", duration: "20 min", description: "Cuándo y cuánto retocar. El límite entre mejorar y falsificar. Dirección del retocador.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
          { id: "ac04-m2-l4", title: "Casting, localizaciones y producción", duration: "28 min", description: "La logística invisible del trabajo de dirección. Cómo organizar una producción desde cero con presupuesto real.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
        ],
      },
      {
        id: "ac04-m3",
        title: "Liderazgo Creativo",
        lessons: [
          { id: "ac04-m3-l1", title: "Liderar equipos creativos", duration: "22 min", description: "Cómo sacar lo mejor de diseñadores, fotógrafos, ilustradores y copywriters. Feedback que construye en lugar de destruir.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
          { id: "ac04-m3-l2", title: "Gestión de proyectos creativos grandes", duration: "25 min", description: "Timings, presupuestos, proveedores y clientes. La parte del trabajo que nadie te enseña en la escuela.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
          { id: "ac04-m3-l3", title: "Portfolio de dirección de arte", duration: "30 min", description: "Cómo presentar el trabajo de dirección de arte: qué proyectos seleccionar, cómo documentarlos y qué plataformas usar.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
          { id: "ac04-m3-l4", title: "Proyecto final: Campaña completa", duration: "60 min", description: "Dirección de arte completa de una campaña: concepto, referencias de producción, moodboard, layout y presentación ejecutiva.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
        ],
      },
    ],
  },
];

export const events = [
  {
    id: 1,
    type: "online",
    title: "Workshop: Identidad Visual desde Cero",
    date: "22 Jun 2025",
    time: "18:00 — 20:00 CET",
    instructor: "Marta Solís",
    seats: "200 plazas",
    price: "Gratuito",
    description:
      "Una sesión en directo donde construiremos una identidad visual completa partiendo de cero. Ideal si estás empezando o quieres ver nuestro método de trabajo.",
    image:
      "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=700&h=450&fit=crop&auto=format",
    alt: "Workshop online de identidad visual",
  },
  {
    id: 2,
    type: "online",
    title: "Masterclass: Tipografía que Funciona",
    date: "8 Jul 2025",
    time: "17:00 — 19:00 CET",
    instructor: "Diego Ferrán",
    seats: "150 plazas",
    price: "Gratuito",
    description:
      "Diego Ferrán desvela los principios que separan la tipografía correcta de la tipografía que realmente comunica. Con casos reales y sesión de preguntas.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=700&h=450&fit=crop&auto=format",
    alt: "Masterclass online de tipografía",
  },
  {
    id: 3,
    type: "presencial",
    title: "Encuentro Anual AcademiaCreativa",
    date: "19 — 20 Sep 2025",
    time: "10:00 — 19:00 CET",
    location: "Espacio Matadero, Madrid",
    instructor: "Todo el claustro",
    seats: "180 plazas",
    price: "€89",
    description:
      "Dos días de charlas, talleres y networking con diseñadores de toda España. El único evento del año donde toda la comunidad se reúne en persona.",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=700&h=450&fit=crop&auto=format",
    alt: "Encuentro presencial anual de diseño en Madrid",
  },
  {
    id: 4,
    type: "presencial",
    title: "Taller Intensivo: Branding Real",
    date: "5 Oct 2025",
    time: "09:00 — 18:00 CET",
    location: "Canòdrom, Barcelona",
    instructor: "Marta Solís & Lucía Vega",
    seats: "24 plazas",
    price: "€149",
    description:
      "Un día completo trabajando un brief de branding real, en grupo reducido y con corrección directa de las profesoras. Materiales incluidos.",
    image:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=700&h=450&fit=crop&auto=format",
    alt: "Taller intensivo presencial de branding en Barcelona",
  },
];

export const methodology = [
  {
    n: "01",
    title: "Aprende a tu ritmo",
    iconName: "Video" as const,
    body: "Todos los cursos son vídeos pregrabados en alta calidad, accesibles desde el primer día. Sin horarios, sin prisa. Vuelve a cada lección las veces que necesites.",
  },
  {
    n: "02",
    title: "Proyectos reales",
    iconName: "Play" as const,
    body: "Cada curso incluye ejercicios y un proyecto final que puedes incluir en tu portfolio. No aprenderás en abstracto — cada lección aplica a algo concreto.",
  },
  {
    n: "03",
    title: "Comunidad y feedback",
    iconName: "Users" as const,
    body: "Accede a un foro activo con el resto de alumnos y a revisiones periódicas de tu trabajo por parte del profesorado. No aprendes solo.",
  },
  {
    n: "04",
    title: "Eventos en vivo",
    iconName: "Calendar" as const,
    body: "Masterclasses, workshops y encuentros presenciales para aprender en directo, hacer preguntas y conectar con otros diseñadores de la comunidad.",
  },
];

export const faculty: FacultyMember[] = [
  {
    slug: "marta-solis",
    name: "Marta Solís",
    role: "Directora de Identidad",
    courses: 2,
    bio: "Fundadora de Estudio Solís. Trabaja con marcas culturales en Madrid y Lisboa desde 2012.",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop&auto=format",
    alt: "Marta Solís — profesora de identidad visual",
  },
  {
    slug: "diego-ferran",
    name: "Diego Ferrán",
    role: "Tipógrafo & Editor",
    courses: 1,
    bio: "Ex director de arte en Phaidon. Diseñador de tipo con fuentes en uso en más de 30 países.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&auto=format",
    alt: "Diego Ferrán — profesor de tipografía",
  },
  {
    slug: "lucia-vega",
    name: "Lucía Vega",
    role: "Diseño Digital & UI",
    courses: 1,
    bio: "Lead designer en productos con millones de usuarios. Ahora enseña lo que le hubiera gustado saber antes.",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop&auto=format",
    alt: "Lucía Vega — profesora de diseño digital",
  },
];

export const testimonials = [
  {
    quote:
      "Completé el curso de Identidad Visual en tres semanas. La calidad de los vídeos y la profundidad de cada lección son las mejores que he visto en cualquier plataforma.",
    name: "Andrés M.",
    program: "Identidad Visual · 2024",
  },
  {
    quote:
      "Lo que más valoro es que no son tutoriales de herramientas — son lecciones de criterio. Eso no lo encuentras en ningún otro lado.",
    name: "Carmen R.",
    program: "Tipografía & Editorial · 2024",
  },
  {
    quote:
      "Fui al encuentro presencial en Madrid sin conocer a nadie. Volví con tres colaboraciones y un nivel de motivación que no tenía desde hacía años.",
    name: "Pablo T.",
    program: "Dirección de Arte · 2023",
  },
];

export const mockMetrics = {
  enrollmentsByCourse: [
    { courseCode: "AC-01", title: "Identidad Visual", enrolled: 187 },
    { courseCode: "AC-02", title: "Tipografía & Editorial", enrolled: 134 },
    { courseCode: "AC-03", title: "Diseño Web & Digital", enrolled: 212 },
    { courseCode: "AC-04", title: "Dirección de Arte", enrolled: 89 },
  ],
  eventSignups: [
    { eventId: 1, title: "Workshop: Identidad Visual desde Cero", signups: 143 },
    { eventId: 2, title: "Masterclass: Tipografía que Funciona", signups: 98 },
    { eventId: 3, title: "Encuentro Anual AcademiaCreativa", signups: 76 },
    { eventId: 4, title: "Taller Intensivo: Branding Real", signups: 19 },
  ],
  revenue: {
    total: 142_680,
    byCourse: [
      { courseCode: "AC-01", revenue: 46_563 },
      { courseCode: "AC-02", revenue: 26_666 },
      { courseCode: "AC-03", revenue: 63_388 },
      { courseCode: "AC-04", revenue: 40_061 },
    ],
  },
  newRegistrations: {
    last30Days: 48,
    trend: +12,
  },
  studentStatus: [
    { courseCode: "AC-01", title: "Identidad Visual",      completado: 52,  enProceso: 89,  sinActividad: 46 },
    { courseCode: "AC-02", title: "Tipografía & Editorial", completado: 31,  enProceso: 71,  sinActividad: 32 },
    { courseCode: "AC-03", title: "Diseño Web & Digital",   completado: 68,  enProceso: 103, sinActividad: 41 },
    { courseCode: "AC-04", title: "Dirección de Arte",      completado: 18,  enProceso: 43,  sinActividad: 28 },
  ],
};
