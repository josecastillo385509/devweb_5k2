# devweb_5k2
Descripción inicial:
Este es el repositorio de un sistema de envíos e inventario de ropa para la empresa Stride & Co.

Integrantes:
José Armando Castillo Navarrete 385509 Scrum Master
Emilio Eduardo Sánchez Fuentes 385524 Product Owner
Gadiel Isaac Vázquez Meraz 385830 Developer
Rubén Iván García Meléndez 385508 Developer

## Instalación

```bash
git clone <https://github.com/josecastillo385509/devweb_5k2.git>
cd <https://github.com/josecastillo385509/devweb_5k2.git>
npm install
```
## Ejecución

```bash
npm run dev
```
## Pruebas

El proyecto cuenta con pruebas para comprobar el funcionamiento de la aplicación, las cuales el funcionamiento de:
-->Código HTTP esperado
-->Estructura básica de la respuesta
-->Funcionamiento de parámetros de ruta
-->Manejo de recursos inexistentes
-->Comportamiento ante solicitudes incorrectas

Estas pruebas se pueden comprobar al ejecutar el siguiente comando:
```bash
npm test
```

## Tecnologías utilizadas

- [JavaScript/Node.js]
- [Express.js]
- [NPM]
- [Git]
- [VSCode]
- [PostgreSQL]
- [MongoDB_Atlas]
- [Render]

## Estructura general del proyecto

```text
devweb_5k2/
|-- [api]
|  |-- [customers]
|  |  |--[controllers]
|  |  |--[routes]
|----- [inventory]
|  |  |--[controllers]
|  |  |--[routes]
|----- [orders]
|  |  |--[controllers]
|  |  |--[routes]
|----- [permissions]
|  |  |--[controllers]
|  |  |--[routes]
|----- [products]
|  |  |--[controllers]
|  |  |--[routes]
|----- [roles]
|  |  |--[controllers]
|  |  |--[routes]
|----- [users]
|  |  |--[controllers]
|  |  |--[routes]
|----- [variants]
|  |  |--[controllers]
|  |  |--[routes]
|----- [index.js]
|  |  |--[controllers]
|  |  |--[routes]
|-- [bin]
|-- [public]
|  |-- [stylesheets]
|-- [routes]
|  |-- [index.js]
|-- [test]
|  |-- [helpers]
|  |-- [customers.test.js]
|  |-- [inventory.test.js]
|  |-- [orders.test.js]
|  |-- [permissions.test.js]
|  |-- [products.test.js]
|  |-- [roles.test.js]
|  |-- [users.test.js]
|  |-- [variants.test.js]
|-- [views]
|  |-- [error.pug]
|  |-- [index.pug]
|  |-- [layout.pug]
|-- [.gitignore]
|-- [app.js]
|-- [eslint.config.js]
|-- [package-lock.json]
|-- [package.json]
`-- README.md
```

## Autenticación

Para las tareas de autenticación, se realizaron los siguientes puntos:

Para la protección de las contraseñas, se utiliza bcrypt utils/password.js: hashPassword genera un salt nuevo con bcrypot.genSalt y el hash se genera con bcrypt.hash; verifyPassword compara con bcrypt.compare. El factor de costo se configura con BCRYPT_SALT_ROUNDS, el cual se encuentra en 10 por defecto. El hash es almacenado en el campo password_hash y el salt en salt_key del modelo User, y ámbos se regeneran juntos al crear un usuario o cambiar su contraseña. password_hash y salt_key nunca son devueltos en las respuestas User.toJSON(), ni son incluidos en el JWT.

Para emitir y verificar el JWT, se utilizó jsonwebtoken, que emite el token en el login express-jwt, el cual verifica el token en el middleware authenticate api/authenticate.js y además carga al usuario en req.user y rechaza usuarios que no existen o que estén inactivos.

Para el Endpoint de login, se implementó POST /api/auth/login, el cual utiliza el middleware authenticate para verificar que el token de login sea válido. Si esto se cumple, envía como respuesta un código 200. De faltar email o contraseña, enviará un código 400, y si alguna de estas dos es incorrecta o el usuario está inactivo, envíará un código 401-

Para el Endpoint de /api/auth/me, se implementó GET /api/auth/me, el cual utiliza el middleware authenticate para verificar que el token sea válido. Si esto no es así, se envía como respuesta un código de error 401. Si el token es válido, se devuelven los datos de usuario cuya autenticación corresponda, sin incluir el hash de la contraseña ni salt.

Las variables de entorno utilizadas fueron las siguientes:
- JWT_SECRET -> Es la firma que se usa para firmas los tokens.
- JWT_EXPIRES_IN -> Determina el tiempo de inactividad para que expire la sesión.
- JWT_ISSUER -> Se encarga de emitir el token.
- JWT_AUDIENCE -> Es a donde va dirigido el token.
- BCRYPT_SALT_ROUNDS -> Se refiere al factor coste.

Ejemplo del bender de Authotization: Bearer <token>:
```text
{
  "message": "Login successful",
  "data": {
    "token": "32895uaas380ajsckjw...",
    "tokenType": "Bearer",
    "expiresIn": "15m"
  }
}
```
El tiempo de expiración configurado es de 15 minutos. Después de que pase este tiempo sin actividad, se cerrará la sesión del usuario, el cual tendrá que iniciar sesión nuevamente si desea seguir utilizando la aplicación.


## Control de acceso basado en roles

La API implementa RBAC (autorización) sobre la autenticación JWT ya existente. El flujo completo es:

```text
User -> Role -> Role_Permission -> Permission -> Librería RBAC (accesscontrol) -> Middleware authorize -> Endpoints protegidos
```

Request -> `authenticate` (401 si no hay usuario válido) -> `authorize(recurso, acción, alcance)` (403 si no tiene permiso) -> controller.

### Roles utilizados

| Rol (`Role.name`) | Descripción |
|---|---|
| `admin` | Administrador: control total del sistema |
| `sales` | Ventas: atiende clientes, órdenes e inventario |
| `user` | Usuario: opera únicamente sobre sus propios datos |

### Convención de `Permission.key`

`Permission.key` identifica cada operación autorizable con el formato **`recurso:acción:alcance`**:

```text
orders:read:own
  |     |    |
  |     |    +-- alcance (possession): own | any
  |     +------- acción: create | read | update | delete
  +------------- recurso: products, variants, inventory, customers, orders, users, roles, permissions
```

- `any`: permite operar sobre cualquier recurso del tipo indicado.
- `own`: permite operar únicamente sobre recursos del propio usuario.
- En AccessControl el permiso `any` implica `own`, por eso `admin` y `sales` no repiten los permisos `own` que ya cubren con `any`.

### Permisos definidos

Hay 40 permisos (tabla `permissions`), uno por cada combinación usada por la API:

| Recurso | Permisos |
|---|---|
| products, variants | `create:any` `read:any` `update:any` `delete:any` |
| inventory | `create:any` `read:any` `update:any` `delete:any` |
| customers, orders | `create:any` `create:own` `read:any` `read:own` `update:any` `update:own` `delete:any` |
| users | `create:any` `read:any` `read:own` `update:any` `update:own` `delete:any` |
| roles, permissions | `create:any` `read:any` `update:any` `delete:any` |

### Matriz RBAC

✓ = permitido, × = denegado (403). Coincide con los registros de `roles`, `permissions` y `role_permissions` que carga `npm run seed` y con las pruebas automatizadas (`test/rbac/matrix.test.js`).

| Recurso / operación | ADMIN | SALES | USER |
|---|:-:|:-:|:-:|
| Products — Read Any | ✓ | ✓ | ✓ |
| Products — Create / Update / Delete Any | ✓ | × | × |
| Variants — Read Any | ✓ | ✓ | ✓ |
| Variants — Create / Update / Delete Any | ✓ | × | × |
| Inventory — Read Any | ✓ | ✓ | × |
| Inventory — Update Any | ✓ | ✓ | × |
| Inventory — Create / Delete Any | ✓ | × | × |
| Customers — Create Any | ✓ | ✓ | × |
| Customers — Create Own | ✓ | ✓ | ✓ |
| Customers — Read Any | ✓ | ✓ | × |
| Customers — Read Own | ✓ | ✓ | ✓ |
| Customers — Update Any | ✓ | ✓ | × |
| Customers — Update Own | ✓ | ✓ | ✓ |
| Customers — Delete Any | ✓ | × | × |
| Orders — Create Any | ✓ | ✓ | × |
| Orders — Create Own | ✓ | ✓ | ✓ |
| Orders — Read Any | ✓ | ✓ | × |
| Orders — Read Own | ✓ | ✓ | ✓ |
| Orders — Update Any | ✓ | ✓ | × |
| Orders — Update Own | ✓ | ✓ | ✓ |
| Orders — Delete Any | ✓ | × | × |
| Users — Create / Read / Update / Delete Any | ✓ | × | × |
| Users — Read Own / Update Own | ✓ | ✓ | ✓ |
| Roles — CRUD Any | ✓ | × | × |
| Permissions — CRUD Any | ✓ | × | × |

### Endpoints protegidos

Todos los endpoints de `/api/*` (excepto `/api/auth/login`, `/api/auth/me` y `/health`) pasan por `authenticate` y `authorize`. El alcance indicado es el que exige cada ruta.

| Endpoint | Permiso requerido | Comprobación de propiedad |
|---|---|---|
| `POST/GET/PUT/DELETE /api/products[/:id]` | `products:create/read/update/delete:any` | — |
| `POST/GET/PUT/DELETE /api/variants[/:id]` | `variants:create/read/update/delete:any` | — |
| `POST/GET/PUT/DELETE /api/inventory[/:id]` | `inventory:create/read/update/delete:any` | — |
| `GET /api/orders` | `orders:read:any` | — |
| `GET /api/orders/mine` | `orders:read:own` | La consulta se limita al usuario autenticado |
| `GET /api/orders/:id` | `orders:read:own` | La orden debe pertenecer al usuario |
| `PUT /api/orders/:id` | `orders:update:own` | La orden debe pertenecer al usuario (y no se puede reasignar a un cliente ajeno) |
| `POST /api/orders` | `orders:create:own` | `customerId` debe ser un cliente del usuario |
| `DELETE /api/orders/:id` | `orders:delete:any` | — |
| `GET /api/customers` | `customers:read:any` | — |
| `GET /api/customers/mine` | `customers:read:own` | La consulta se limita al usuario autenticado |
| `GET /api/customers/:id` | `customers:read:own` | El cliente debe pertenecer al usuario |
| `PUT /api/customers/:id` | `customers:update:own` | El cliente debe pertenecer al usuario (no se puede reasignar) |
| `POST /api/customers` | `customers:create:own` | `userID` debe ser el usuario autenticado |
| `DELETE /api/customers/:id` | `customers:delete:any` | — |
| `POST/GET /api/users`, `DELETE /api/users/:id` | `users:create/read/delete:any` | — |
| `GET/PUT /api/users/:id` | `users:read:own` / `users:update:own` | El `:id` debe ser el del usuario autenticado |
| `POST/GET/PUT/DELETE /api/roles[/:id]` | `roles:create/read/update/delete:any` | — |
| `POST/GET/PUT/DELETE /api/permissions[/:id]` | `permissions:create/read/update/delete:any` | — |

### Cómo se obtiene la configuración de permisos desde la base de datos

Los permisos **no** están escritos en el código: la base de datos (`roles` → `role_permissions` → `permissions`) es la única fuente de verdad.

1. `rbac/access-control.js` consulta con un solo `Role.findAll({ include: Permission })` los roles y sus permisos.
2. Cada `Permission.key` se separa en `resource`, `action` y `possession` (`rbac/parse-permission.js`; las keys que no cumplen la convención se ignoran).
3. Con ellos se construye el arreglo de *grants* de AccessControl, por ejemplo `{ role: 'user', resource: 'orders', action: 'read:own', attributes: '*' }`.
4. La configuración se conserva `RBAC_CACHE_TTL_SECONDS` segundos en memoria (10 por defecto; `0` = consultar la BD en cada solicitud). Un cambio en las tablas se refleja en la API sin reiniciarla, como máximo después de ese tiempo.
5. El middleware `api/authorize.js` toma `req.user.role_id` (que deja `authenticate`), lo traduce al rol y pregunta a AccessControl. No hay validaciones por nombre de rol ni lógica de autorización en los controllers.

```js
router.delete('/:id', authorize('products', 'delete', 'any'), controller.destroy);
router.get('/:id', authorize('orders', 'read', 'own', { owner: orderOwner }), controller.find);
```

### Ejemplo de permiso `any`

`products:delete:any` lo tiene `admin`; `sales` y `user` no.

```text
DELETE /api/products/7   (token de admin)  -> 200
DELETE /api/products/7   (token de sales)  -> 403 { "message": "Forbidden" }
GET    /api/orders       (token de sales, orders:read:any)  -> 200, todas las órdenes
GET    /api/orders       (token de user, sin orders:read:any) -> 403
```

### Ejemplo de permiso `own`

`orders:read:own` lo tiene `user`. El middleware (`api/ownership.js`) busca la orden en MongoDB, obtiene su cliente y compara `Customer.userID` con `req.user.id` (el usuario autenticado). Nunca se usa un dato enviado por el cliente para decidir quién es el dueño.

```text
GET /api/orders/<orden propia>  (token de user)  -> 200
GET /api/orders/<orden ajena>   (token de user)  -> 403 { "message": "Forbidden" }
GET /api/orders/<id inexistente> (token de user) -> 404
```

### Respuestas

| Código | Significado |
|---|---|
| `401 Unauthorized` | No hay token válido o el usuario no existe / está inactivo (lo resuelve `authenticate`) |
| `403 Forbidden` | Usuario autenticado sin el permiso requerido, o recurso `own` de otro usuario (lo resuelve `authorize`) |

### Configurar la matriz con Docker

La matriz vive en las tablas `roles`, `permissions` y `role_permissions` de MySQL. Con Docker se levantan las bases de datos (MySQL y MongoDB), se cargan los registros de la matriz y, opcionalmente, la API.

**Requisitos:** Docker con Compose v2 (`docker compose ...`; con Compose v1 usar `docker-compose ...`). Los puertos 3000, 3306 y 27017 deben estar libres.

**1. Preparar las variables de entorno**

```bash
cp .env.example .env
```

Edita `.env` y define `JWT_SECRET` (por ejemplo con `openssl rand -hex 32`). El resto de los valores por defecto sirven tal cual.

**2. Levantar los servicios** (elige una opción)

- **Opción A – todo en Docker (MySQL + MongoDB + API):**

  ```bash
  docker compose up -d --build
  docker compose ps          # mysql y mongo deben aparecer como "healthy"
  ```

  La API crea las tablas al arrancar y queda en http://localhost:3000.

- **Opción B – solo las bases de datos en Docker y la API en tu máquina:**

  ```bash
  docker compose up -d mysql mongo
  npm install
  ```

**3. Cargar la matriz RBAC (seed)**

El seed crea los roles, los 40 permisos, las asignaciones de `role_permissions` y usuarios/clientes/órdenes de demostración. Es idempotente: se puede ejecutar varias veces.

```bash
# Opción A (dentro de Docker)
docker compose --profile seed run --rm seed

# Opción B (desde tu máquina; usa DB_HOST=localhost del .env)
npm run seed
npm run dev
```

Resultado esperado:

```text
RBAC: 3 roles, 40 permisos
  admin: 32 permisos
  sales: 12 permisos
  user: 10 permisos
```

Usuarios de demostración (contraseña `Passw0rd!`, o el valor de `SEED_PASSWORD`):

| Email | Rol |
|---|---|
| `admin@stride.co` | `admin` |
| `sales@stride.co` | `sales` |
| `user@stride.co` | `user` |
| `user2@stride.co` | `user` (segundo usuario, para probar `own`: sus órdenes no pertenecen a `user@stride.co`) |

**4. Verificar la matriz en la base de datos**

```bash
docker compose exec mysql mysql -uroot -p stride-co
# (escribe la contraseña de DB_PASSWORD; por defecto abcd1234)
```

```sql
-- Permisos de cada rol
SELECT r.name AS role, p.key AS permission
FROM roles r
JOIN role_permissions rp ON rp.role_id = r.id
JOIN permissions p ON p.id = rp.permission_id
ORDER BY r.name, p.key;

-- Cantidad de permisos por rol (admin 32, sales 12, user 10)
SELECT r.name, COUNT(*) AS total
FROM roles r JOIN role_permissions rp ON rp.role_id = r.id
GROUP BY r.name;
```

**5. Modificar la matriz directamente en la base de datos**

Con la sesión de `mysql` abierta (paso 4). Los cambios aplican sin reiniciar la API, en cuanto vence `RBAC_CACHE_TTL_SECONDS` (10 s por defecto; con `0` es inmediato).

```sql
-- Dar a "sales" el permiso products:delete:any
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'sales' AND p.key = 'products:delete:any';

-- Quitárselo
DELETE rp FROM role_permissions rp
JOIN roles r ON r.id = rp.role_id
JOIN permissions p ON p.id = rp.permission_id
WHERE r.name = 'sales' AND p.key = 'products:delete:any';

-- Crear un permiso nuevo (formato recurso:acción:alcance) y un rol nuevo
INSERT INTO permissions (`key`, description) VALUES ('inventory:delete:own', 'Eliminar su propio inventario');
INSERT INTO roles (name, description, created_at, updated_at) VALUES ('auditor', 'Solo lectura', NOW(), NOW());
```

También se puede hacer desde la API con un token de `admin` (`/api/roles`, `/api/permissions`).

> `npm run seed` vuelve a dejar los roles `admin`, `sales` y `user` exactamente como los define `db/seeds/rbac-matrix.js`, por lo que **sobrescribe** los cambios manuales sobre esos tres roles. Para que un cambio sea permanente, edita `db/seeds/rbac-matrix.js` y vuelve a ejecutar el seed. Los roles y permisos extra (como `auditor`) no se borran.

**6. Probar la API**

```bash
# Token de cada rol
ADMIN=$(curl -s -X POST localhost:3000/api/auth/login -H 'Content-Type: application/json' \
  -d '{"email":"admin@stride.co","password":"Passw0rd!"}' | sed -E 's/.*"token":"([^"]+)".*/\1/')
SALES=$(curl -s -X POST localhost:3000/api/auth/login -H 'Content-Type: application/json' \
  -d '{"email":"sales@stride.co","password":"Passw0rd!"}' | sed -E 's/.*"token":"([^"]+)".*/\1/')
USER1=$(curl -s -X POST localhost:3000/api/auth/login -H 'Content-Type: application/json' \
  -d '{"email":"user@stride.co","password":"Passw0rd!"}' | sed -E 's/.*"token":"([^"]+)".*/\1/')

# any: admin puede (200), sales no (403)
curl -i -X DELETE localhost:3000/api/products/1 -H "Authorization: Bearer $ADMIN"
curl -i -X DELETE localhost:3000/api/products/1 -H "Authorization: Bearer $SALES"

# own: el usuario ve sus órdenes (200) y recibe 403 con la de otro usuario
curl -s localhost:3000/api/orders/mine -H "Authorization: Bearer $USER1"     # copia el _id de una orden
curl -s localhost:3000/api/orders      -H "Authorization: Bearer $ADMIN"     # busca el _id de la orden de user2@stride.co
curl -i localhost:3000/api/orders/<id-orden-ajena> -H "Authorization: Bearer $USER1"   # 403
```

**7. Apagar / reiniciar desde cero**

```bash
docker compose down        # detiene los contenedores (conserva los datos)
docker compose down -v     # además borra los volúmenes (MySQL y MongoDB vacíos)
```

### Pruebas del control de acceso

```bash
npm test
```

No requieren Docker, MySQL ni MongoDB: usan SQLite en memoria con la misma matriz del seed y un doble en memoria de los modelos de MongoDB.

| Archivo | Qué comprueba |
|---|---|
| `test/rbac/scenarios.test.js` | Escenarios mínimos de la tarea: acceso permitido, acceso denegado (403), recurso propio, recurso de otro usuario, permiso `any` no asignado; 401 vs 403; cambios de permisos en la BD |
| `test/rbac/matrix.test.js` | Matriz completa rol × endpoint contra la API |
| `test/rbac/access-control.test.js` | Carga de permisos desde la BD y middleware `authorize` |
| `test/rbac/no-hardcoded-roles.test.js` | Verificación estática: sin comparaciones por nombre de rol, sin autorización en controllers, todas las rutas protegidas |
| `test/*.test.js` | CRUD de cada recurso como `admin` (y 401 sin token) |

## Despliegue en la nube (Producción)

La API se encuentra desplegada y conectada a bases de datos en la nube para poder probarse en línea sin necesidad de levantar el entorno local.

* **URL de la API en producción:** `https://stride-co-api-r0dw.onrender.com`

### Cómo se realizó la conexión y el despliegue

1. **Base de datos relacional (PostgreSQL en Render):**
   * Se creó una instancia de PostgreSQL en Render para almacenar usuarios, roles y permisos.
   * Se instaló el paquete `pg` y `pg-hstore` en el proyecto y se habilitó la conexión segura (`SSL`) en `config/sequelize.js` mediante la variable `DB_SSL=true`.
2. **Base de datos documental (MongoDB Atlas):**
   * Se creó un clúster gratuito (`ClusterStride`) en MongoDB Atlas para guardar productos, inventario, clientes y órdenes.
   * Se creó un usuario de base de datos, se habilitó el acceso desde cualquier IP (`0.0.0.0/0`) para que Render pudiera conectarse y se obtuvo la cadena de conexión (`MONGO_URI`).
3. **Servidor Web (Render):**
   * Se vinculó el repositorio de GitHub (`devweb_5k2`, rama `main`) a un servicio tipo *Web Service* en Render usando el `Dockerfile` del proyecto.
   * Se cargaron todas las credenciales y llaves secretas en la sección **Environment** de Render (`DB_DIALECT=postgres`, `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_SSL=true`, `MONGO_URI` y `JWT_SECRET`).
   * Con esto, cada vez que se sube un cambio a la rama `main`, Render actualiza y arranca la aplicación automáticamente.

### Cómo arrancar la aplicación

#### En producción (en línea)
No requiere instalación. Solo realiza las peticiones HTTP (desde Postman, Thunder Client o el frontend) apuntando a `https://stride-co-api-r0dw.onrender.com` (por ejemplo, `POST https://stride-co-api-r0dw.onrender.com/api/auth/login`).

#### En local (en tu computadora)
1. Clona el repositorio e instala las dependencias:
   ```bash
   git clone [https://github.com/josecastillo385509/devweb_5k2.git](https://github.com/josecastillo385509/devweb_5k2.git)
   cd devweb_5k2
   npm install
