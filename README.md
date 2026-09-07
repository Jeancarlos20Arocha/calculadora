# Calculadora - App Windows (Electron)

Calculadora moderna de escritorio para Windows, creada con **Electron**.

## Funciones

- Operaciones: `+` `-` `×` `÷` `^`
- Funciones: `x²`, `√`, `1/x`, `±`, `%`
- Memoria: `MC`, `MR`, `MS`, `M+`, `M−`
- Historial de operaciones (50 últimos)
- Configuración de decimales (0 a 8)
- Tema claro / oscuro
- Soporte de teclado (dígitos, Enter, Escape, Backspace)

## Cómo ejecutar en desarrollo

```bash
npm install
npm start
```

## Cómo generar el .exe (Windows)

```bash
npm install
npm run dist
```

El ejecutable queda en la carpeta `dist/` como `Calculadora.exe` (portátil, sin instalación).

## Estructura

```
calculadora-app/
├── main.js            # Proceso principal de Electron
├── public/
│   ├── index.html     # Interfaz
│   ├── style.css      # Estilos (tema claro/oscuro)
│   └── calculadora.js # Lógica de la calculadora
└── build/icon.png     # Icono
```