# Prototipo Front-end Asegurat

Prototipo funcional de cotización y compra de seguros, desarrollado con:

- Next.js (App Router)
- TypeScript
- TailwindCSS
- React Hooks
- Mock API basada en JSON

## Flujo implementado

HOME → Planes → Simulación → Checkout → Confirmación

También se incluyen pantallas de Registro e Inicio de sesión mock.

## Estructura implementada

```txt
app/
	page.tsx
	plans/page.tsx
	checkout/page.tsx
	success_page/page.tsx
	login/page.tsx
	register/page.tsx

components/
	Navbar/
	Footer/
	PlanCard/
	PriceSimulator/

modules/
	planes/
	checkout/
	auth/

services/
	api.ts

mocks/
	planes.json

types/
	plan.ts

styles/
```

## Requerimientos funcionales cubiertos

- RF-01 Visualización de planes con coberturas, precio, beneficios y acción de compra/simulación.
- RF-02 Personalización por tipo de seguro y periodicidad de pago con actualización dinámica.
- RF-03 Simulación y resumen de compra con impuestos, modificación y cancelación.
- RF-04 Registro/Login con correo y contraseña (mock).
- RF-05 Checkout por pasos con validaciones y selección de método de pago (mock).
- RF-06 Confirmación final con número de póliza provisional y comprobante descargable.

## Ejecutar localmente

1. Instala dependencias:

```bash
npm install
```

2. Inicia entorno de desarrollo:

```bash
npm run dev
```

3. Abre:

```txt
http://localhost:3000
```

## Despliegue a producción

### Opción recomendada: Vercel

1. Sube el repositorio a GitHub.
2. Entra a Vercel y crea un nuevo proyecto importando el repo.
3. Configuración detectada automáticamente para Next.js.
4. Ejecuta Deploy.
5. Obtendrás una URL productiva HTTPS.

### Opción alternativa: servidor Node.js

1. Construye la aplicación:

```bash
npm run build
```

2. Inicia en modo producción:

```bash
npm run start
```

3. Publica detrás de un proxy HTTPS (Nginx/Apache o plataforma cloud).

## Nota RNF (seguridad)

Este prototipo simula flujos de autenticación y pagos. Para implementación real se debe incluir:

- HTTPS obligatorio
- Encriptación de datos sensibles
- Cumplimiento normativo de protección de datos
