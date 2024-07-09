2 servicios: ServicioCliente1, y el servicio Admin_Docs, en Node.js y RabitMQ.

ServicioCliente1 enviara documentos al servicio Admin_Docs, el envió sera por APIREST (Json), 
puede ser de 50 documentos a mas al mismo tiempo, cada 2 minutos el ServicioCliente1 consultara 
el estado de los documentos enviados. Hasta que tenga una confirmación: "Rechazado" o "Aceptado".


Servicio Admin_Docs, ese servicio tendrá 2 EndPoints:

* primer endpoint: Recepcionara los documentos y enviara un mensaje "En    
  Proceso", al ServicioCliente1.

* segundo endpoint: Aqui se realizaran las consultas del estado del documento
  "En Proceso", "Rechazado" y "Aceptado".

En el servicio Admin_Docs los documentos que recepciono, despues de 1 minuto, que cambie del estado de "En Proceso" a un nuevo estado "Rechazado" o "Aceptado",
el nuevo estado sera de manera aleatoria. y saldra de la cola de RabbitMQ, y mostrara en que estado se encuentran los documentos cada que sean consultados.
