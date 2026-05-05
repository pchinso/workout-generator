# Generador de Sesiones de Entrenamiento — ejecución local

Este paquete contiene la aplicación web **workout-generator**, una herramienta React para seleccionar aleatoriamente una sesión de entrenamiento entre rutinas **Full Body**, **Push**, **Pull** y **Legs**. La interfaz permite registrar peso, series, repeticiones y notas, incluye enlaces de búsqueda en YouTube para cada ejercicio y cuenta con un modo de impresión optimizado en formato A4 horizontal.

## Requisitos

| Herramienta | Versión recomendada | Uso dentro del proyecto |
|---|---:|---|
| Node.js | 20 o superior | Ejecutar Vite, React y el servidor de producción local. |
| pnpm | 10 o superior | Instalar dependencias y ejecutar scripts del proyecto. |

Si no tienes `pnpm` instalado, puedes activarlo con Corepack cuando tu instalación de Node.js lo incluya:

```bash
corepack enable
corepack prepare pnpm@10.4.1 --activate
```

## Instalación y arranque en modo desarrollo

Descomprime el ZIP y entra en la carpeta del proyecto:

```bash
cd workout-generator
pnpm install
pnpm dev
```

Después abre el navegador en la URL que muestre la terminal. Habitualmente será `http://localhost:3000/` o una URL local equivalente indicada por Vite.

## Compilar y ejecutar como producción local

Para generar una versión compilada y servirla localmente, usa:

```bash
pnpm build
pnpm start
```

El comando `pnpm build` genera la carpeta `dist/`, y `pnpm start` ejecuta el servidor Node incluido en el proyecto para servir la app compilada.

## Comandos útiles

| Comando | Propósito |
|---|---|
| `pnpm dev` | Inicia el entorno de desarrollo con recarga automática. |
| `pnpm build` | Compila la aplicación para producción local. |
| `pnpm start` | Sirve la versión compilada desde `dist/`. |
| `pnpm check` | Ejecuta validación TypeScript sin emitir archivos. |
| `pnpm format` | Aplica formato con Prettier. |

## Variables de entorno

**No se necesita ningún fichero `.env`** para ejecutar esta aplicación en local. El generador de entrenamientos funciona completamente sin configuración adicional.

El repositorio contiene algunos ficheros (`client/src/const.ts`, `client/src/components/Map.tsx`) con referencias a variables de entorno de la plataforma Manus (`VITE_OAUTH_PORTAL_URL`, `VITE_APP_ID`, etc.) que no se importan ni se usan en ninguna parte de la aplicación. El compilador de Vite los omite por completo en el bundle final.

## Notas de empaquetado

El ZIP no incluye `node_modules`, cachés, registros internos ni artefactos temporales. Las dependencias deben instalarse localmente con `pnpm install`. El fichero `pnpm-lock.yaml` sí está incluido para garantizar instalaciones reproducibles.

La lógica de las rutinas y la tabla interactiva está integrada en `client/src/pages/Home.tsx`, mientras que el ajuste de impresión se encuentra en `client/src/index.css` dentro del bloque `@media print`.
