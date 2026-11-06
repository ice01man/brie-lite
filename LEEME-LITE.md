# Sistema BRIE · versión LITE

Clientes (menú, pedidos), cocina y reparto. NO incluye el panel de administración.

1. `npm install --omit=dev`
2. Variables de entorno (en el servidor, nunca en el repo):
   - MONGODB_URI y MONGODB_DB (idealmente con un usuario de Mongo propio para lite)
   - JWT_SECRET: un secreto DISTINTO al del sistema completo (así un token de lite no vale en el admin)
   - NODE_ENV=production
3. `npm start`

Las cuentas admin no pueden ingresar por acá. El corte diario automático corre solo en el sistema completo.
