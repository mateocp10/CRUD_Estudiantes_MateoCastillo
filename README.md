# CRUD de estudiantes con Docker

API REST para crear, consultar, actualizar y eliminar estudiantes. Usa Node.js, Express y MySQL, y todo se levanta con Docker Compose.

## Requisitos

- Docker Desktop abierto y funcionando
- Git
- Puertos 3000 (API) y 3306 (MySQL) libres

## Estructura

```text
CRUD_Estudiantes/
├── database/init.sql      # crea la tabla estudiantes
├── src/
│   ├── db.js              # conexión a MySQL
│   └── server.js          # rutas de la API
├── .env.example           # variables de ejemplo
├── .dockerignore
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

## Cómo ejecutarlo

**1. Clonar el repositorio**

```bash
git clone <https://github.com/mateocp10/CRUD_Estudiantes_MateoCastillo.git>
cd <CRUD_Estudiantes_MateoCastillo>
```

**2. Crear el archivo `.env`**

```powershell
Copy-Item .env.example .env     # Windows PowerShell
cp .env.example .env            # Linux / macOS
```

El `.env.example` solo trae valores de ejemplo, sin credenciales reales. Puedes cambiarlos en tu `.env`, que no se sube a GitHub.

**3. Construir e iniciar**

```bash
docker compose up --build -d
```

**4. Comprobar que todo esté arriba**

```bash
docker compose ps
```

Deben aparecer `app` y `db` activos (la base en estado _healthy_). La API queda en `http://localhost:3000`. Si algo falla, mira los registros con `docker compose logs -f app`.

## Base de datos

La primera vez que se crea el volumen, MySQL ejecuta `database/init.sql` y crea la tabla `estudiantes`. Los datos se guardan en el volumen `mysql_data`, así que siguen ahí aunque reinicies los contenedores.

Para empezar de cero (**borra todos los datos**):

```bash
docker compose down -v
docker compose up --build -d
```

## Probar el CRUD con Postman

Base: `http://localhost:3000/api/estudiantes`. En las peticiones con cuerpo, elige **Body → raw → JSON**.

| Acción        | Método | URL                  | Cuerpo |
| ------------- | ------ | -------------------- | ------ |
| Crear         | POST   | `/api/estudiantes`   | Sí     |
| Listar        | GET    | `/api/estudiantes`   | No     |
| Consultar uno | GET    | `/api/estudiantes/1` | No     |
| Actualizar    | PUT    | `/api/estudiantes/1` | Sí     |
| Eliminar      | DELETE | `/api/estudiantes/1` | No     |

**Cuerpo para crear (POST):**

```json
{
  "nombre": "Mateo Castillo",
  "correo": "mateo@uide.edu.ec",
  "carrera": "Tecnologias de la Informacion"
}
```

Respuesta esperada: `201 Created` con el estudiante y su `id`.

**Cuerpo para actualizar (PUT):** el mismo formato, con los datos nuevos.

```json
{
  "nombre": "Mateo Castillo Machero",
  "correo": "mateo@uide.edu.ec",
  "carrera": "Tecnologias de la Informacion"
}
```

Respuesta esperada: `200 OK` con `{ "mensaje": "Estudiante actualizado" }`.

**Eliminar (DELETE):** respuesta esperada `200 OK` con `{ "mensaje": "Estudiante eliminado" }`.

Usa el `id` que te devolvió el POST en las URLs de consultar, actualizar y eliminar.

## Detener la aplicación

```bash
docker compose down        # conserva los datos
docker compose down -v     # borra también la base de datos
```

## Errores frecuentes

| Error                                        | Causa                                                      | Solución                                                                                                                             |
| -------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `port is already allocated`                  | El puerto 3000 o 3306 ya lo usa otro programa.             | Cambiar el puerto en `.env` o cerrar el programa que lo ocupa.                                                                       |
| `Access denied for user`                     | Usuario o contraseña de MySQL distintos a los del volumen. | Revisar `DB_USER` y `DB_PASSWORD` en `.env`. Si ya existía el volumen, recrearlo con `docker compose down -v` (se borran los datos). |
| `ECONNREFUSED` o la app no conecta con MySQL | La base aún no está lista o `DB_HOST` está mal.            | Usar `DB_HOST=db`, esperar al healthcheck y revisar `docker compose logs db`.                                                        |
| La API no responde                           | El contenedor no inició o el puerto no está publicado.     | Ejecutar `docker compose ps` y `docker compose logs app`.                                                                            |

## Prueba desde una copia limpia

1. Clonar el repositorio en una carpeta nueva.
2. Crear `.env` desde `.env.example`.
3. Ejecutar `docker compose up --build -d`.
4. Confirmar los contenedores con `docker compose ps`.
5. Probar el CRUD en Postman.
6. Detener con `docker compose down`.
