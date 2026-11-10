# CRUD de estudiantes con Docker

Aplicación REST sencilla para crear, consultar, actualizar y eliminar estudiantes. Usa Node.js, Express, MySQL y Docker Compose.

## Requisitos
- Docker Desktop instalado y en ejecución.
- Git (para clonar el repositorio).
- Puerto 3000 y 3306 disponibles.

## Estructura del proyecto
```text
crud_estudiantes_docker/
├── database/init.sql
├── src/
│   ├── db.js
│   └── server.js
├── .env.example
├── .dockerignore
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

## Preparar variables de entorno
En la raíz del proyecto, copia el archivo de ejemplo y edítalo si necesitas cambiar los valores:
```bash
cp .env.example .env
```
En Windows PowerShell:
```powershell
Copy-Item .env.example .env
```
El archivo `.env.example` contiene valores demostrativos, no credenciales reales. No subir `.env` a GitHub.

## Construir e iniciar
```bash
docker compose up --build -d
```
Verificar los contenedores:
```bash
docker compose ps
```
Ver los registros:
```bash
docker compose logs -f app
```
La API estará disponible en `http://localhost:3000`.

## Inicialización de la base de datos
Al iniciar MySQL por primera vez, Docker Compose ejecuta `database/init.sql` y crea la tabla `estudiantes`. Los datos se conservan en el volumen `mysql_data`.

Para reiniciar la base desde cero (esto elimina los datos guardados):
```bash
docker compose down -v
docker compose up --build -d
```

## Solicitudes CRUD
Ejemplos usando `curl`:

**Crear (POST):**
```bash
curl -X POST http://localhost:3000/api/estudiantes -H "Content-Type: application/json" -d "{\"nombre\":\"Mateo Castillo\",\"correo\":\"mateo@example.com\",\"carrera\":\"Tecnologias de la Informacion\"}"
```

**Listar (GET):**
```bash
curl http://localhost:3000/api/estudiantes
```

**Consultar por ID (GET):**
```bash
curl http://localhost:3000/api/estudiantes/1
```

**Actualizar (PUT):**
```bash
curl -X PUT http://localhost:3000/api/estudiantes/1 -H "Content-Type: application/json" -d "{\"nombre\":\"Mateo Castillo\",\"correo\":\"mateo@example.com\",\"carrera\":\"Ingenieria en TI\"}"
```

**Eliminar (DELETE):**
```bash
curl -X DELETE http://localhost:3000/api/estudiantes/1
```

## Detener la aplicación
Detener sin borrar los datos:
```bash
docker compose down
```
Detener y eliminar también los datos de la base:
```bash
docker compose down -v
```

## Errores frecuentes
| Error | Causa | Solución |
|---|---|---|
| `port is already allocated` | El puerto 3000 o 3306 está ocupado. | Cambiar el puerto en `.env` o detener el servicio que lo usa. |
| `Access denied for user` | Usuario o contraseña de MySQL no coinciden. | Revisar las variables en `.env`. Si se cambió la contraseña y ya existe el volumen, recrearlo con `docker compose down -v` (se borran datos). |
| `ECONNREFUSED` / app no conecta a MySQL | La base aún no está lista o `DB_HOST` está mal. | Usar `DB_HOST=db`, esperar el healthcheck y revisar `docker compose logs db`. |
| API no responde | Contenedor no está iniciado o el puerto está mal publicado. | Ejecutar `docker compose ps` y `docker compose logs app`. |

## Comprobación desde una copia limpia
1. Clonar el repositorio.
2. Crear `.env` desde `.env.example`.
3. Ejecutar `docker compose up --build -d`.
4. Confirmar `docker compose ps`.
5. Probar las solicitudes CRUD indicadas arriba.
6. Detener con `docker compose down`.

