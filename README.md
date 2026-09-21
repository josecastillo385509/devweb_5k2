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

