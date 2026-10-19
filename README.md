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
