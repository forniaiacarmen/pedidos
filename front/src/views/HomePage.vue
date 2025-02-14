<template>
  <div class="container">
      <h1>Crear de Pedidos</h1>
      <div class ="containercrear">
                <form @submit.prevent="crearPedido">
        <div>
          <label for="nombre">Nombre:</label>
          <input type="text" v-model="nuevoPedido.nombre" required />
        </div>
        <br>

        <div>
          <label for="telefono">Teléfono:</label>
          <input type="number" v-model="nuevoPedido.telefono" required />
        </div>
        <br>

        <div>
          <label for="producto">Producto:</label>
          <input type="text" v-model="nuevoPedido.producto" required />
        </div>
        <br>

        <div>
          <label for="fecha_recogida">Fecha y Hora de Recogida:</label>
          <input type="datetime-local" v-model="nuevoPedido.fecha_recogida" required />
        </div>
        

        <div>
          <label for="estado">Estado:</label>
          <select v-model="nuevoPedido.estado" required>
            <option value="pendiente">Pendiente</option>
            <option value="servido">Servido</option>
          </select>
        </div>

        <button type="submit" id="btn-crear">Crear Pedido</button>
        </form>
    </div>
      <h1>Lista de Pedidos</h1>

      <h2>Pedidos Pendientes</h2>
<div class="column">
  <div v-for="pedido in pedidosPendientes" :key="pedido.id" class="pedido">
    <p><strong>Nombre:</strong> {{ pedido.nombre }}</p>
    <p><strong>Teléfono:</strong> {{ pedido.telefono }}</p>
    <p><strong>Producto:</strong> {{ pedido.producto }}</p>
    <p><strong>Fecha de Recogida:</strong> {{ formatearFecha(pedido.fecha_recogida) }}</p>
    <p><strong>Estado:</strong> {{ pedido.estado }}</p>
    <button @click="eliminarPedido(pedido.id)" id="btn-eliminar">Eliminar</button>
    <button @click="editarPedido(pedido)" id="btn-editar">Editar</button>
    <button @click="cambiarEstado(pedido)" id="btn-cambiarestado">
      Cambiar a {{ pedido.estado === 'pendiente' ? 'Servido' : 'Pendiente' }}
    </button>
  </div>
</div>

<h2>Pedidos Servidos</h2>
<div class="column">
  <div v-for="pedido in pedidosServidos" :key="pedido.id" class="pedido">
    <p><strong>Nombre:</strong> {{ pedido.nombre }}</p>
    <p><strong>Teléfono:</strong> {{ pedido.telefono }}</p>
    <p><strong>Producto:</strong> {{ pedido.producto }}</p>
    <p><strong>Fecha de Recogida:</strong> {{ formatearFecha(pedido.fecha_recogida) }}</p>
    <p><strong>Estado:</strong> {{ pedido.estado }}</p>
    <button @click="eliminarPedido(pedido.id)" id="btn-eliminar">Eliminar</button>
    <button @click="editarPedido(pedido)" id="btn-editar">Editar</button>
    <button @click="cambiarEstado(pedido)">
      Cambiar a {{ pedido.estado === 'pendiente' ? 'Servido' : 'Pendiente' }}
    </button>
  </div>
</div>


      <div v-if="pedidoEditar">
        <h3>Editar Pedido</h3>
        <form @submit.prevent="actualizarPedido">
          <div>
            <label for="nombre">Nombre:</label>
            <input type="text" v-model="pedidoEditar.nombre" required />
          </div>
          <div>
            <label for="telefono">Teléfono:</label>
            <input type="number" v-model="pedidoEditar.telefono" required />
          </div>
          <div>
            <label for="producto">Producto:</label>
            <input type="text" v-model="pedidoEditar.producto" required />
          </div>
          <div>
            <label for="fecha_recogida">Fecha y Hora de Recogida:</label>
            <input type="datetime-local" v-model="pedidoEditar.fecha_recogida" required />
          </div>
          <div>
            <label for="estado">Estado:</label>
            <select v-model="pedidoEditar.estado" required>
              <option value="pendiente">Pendiente</option>
              <option value="servido">Servido</option>
            </select>
          </div>
          <button type="submit">Actualizar Pedido</button>
        </form>
      </div>
  </div>


  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <h3>¿Estás seguro de que deseas eliminar este pedido?</h3>
      <button @click="confirmarEliminacion">Sí, eliminar</button>
      <button @click="cancelarEliminacion">Cancelar</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export default {
  data() {
    return {
      pedidos: [],
      nuevoPedido: {
        nombre: '',
        telefono: '',
        producto: '',
        fecha_recogida: '',
        estado: 'pendiente',
      },
      pedidoEditar: null,
      showModal: false, // Controlar la visibilidad del modal
      pedidoAEliminar: null, // Pedido seleccionado para eliminar

    };
  },
  computed: {
    pedidosPendientes() {
      return this.pedidos.filter(pedido => pedido.estado === 'pendiente');
    },
    pedidosServidos() {
      return this.pedidos.filter(pedido => pedido.estado === 'servido');
    },
    pedidosActivos() {
    return this.pedidos.filter(pedido => pedido.estado !== 'eliminado');
  }
  },
  mounted() {
    this.obtenerPedidos();
  },
  methods: {
    formatearFecha(fecha) {
      const fechaParseada = parseISO(fecha);
      return format(fechaParseada, 'dd MMMM yyyy, HH:mm', { locale: es });
    },
    obtenerPedidos() {
      axios
        .get('http://localhost:3000/api/pedidos')
        .then((response) => {
          this.pedidos = response.data;
        })
        .catch((error) => {
          console.error('Error al obtener los pedidos:', error);
        });
    },
    crearPedido() {
      axios
        .post('http://localhost:3000/api/pedidos', this.nuevoPedido)
        .then((response) => {
          this.pedidos.push(response.data);
          this.nuevoPedido = { nombre: '', telefono: '', producto: '', fecha_recogida: '', estado: 'pendiente' };
        })
        .catch((error) => {
          console.error('Error al crear el pedido:', error);
        });
    },
    eliminarPedido(id) {
      this.pedidoAEliminar = this.pedidos.find(pedido => pedido.id === id); // Guardamos el pedido a eliminar
      this.showModal = true;  // Mostramos el modal de confirmación
},
confirmarEliminacion() {
  if (this.pedidoAEliminar) {
    // Realizar una petición PUT para cambiar el estado a "eliminado"
    axios
      .put(`http://localhost:3000/api/pedidos/estado/${this.pedidoAEliminar.id}`, {
        estado: 'eliminado'  // Cambiar el estado a "eliminado"
      })
      .then(() => {
        // Actualizar la lista de pedidos en el frontend sin hacer una nueva solicitud al servidor
        this.pedidos = this.pedidos.map(pedido =>
          pedido.id === this.pedidoAEliminar.id
            ? { ...pedido, estado: 'eliminado' }
            : pedido
        );
        this.showModal = false;  // Ocultar el modal después de la actualización
      })
      .catch((error) => {
        console.error('Error al cambiar el estado del pedido:', error);
      });
  }
},

    editarPedido(pedido) {
      this.pedidoEditar = { ...pedido };
    },

    cancelarEliminacion() {
    this.showModal = false;  // Simplemente cerramos el modal sin eliminar
  },
    actualizarPedido() {
      axios
        .put(`http://localhost:3000/api/pedidos/${this.pedidoEditar.id}`, this.pedidoEditar)
        .then((response) => {
          const index = this.pedidos.findIndex(pedido => pedido.id === response.data.id);
          if (index !== -1) {
            this.pedidos[index] = response.data;
          }
          this.pedidoEditar = null;
        })
        .catch((error) => {
          console.error('Error al actualizar el pedido:', error);
        });
    },
    cambiarEstado(pedido) {
      const nuevoEstado = pedido.estado === 'pendiente' ? 'servido' : 'pendiente';

      axios
        .put(`http://localhost:3000/api/pedidos/estado/${pedido.id}`, { estado: nuevoEstado })
        .then(() => {
          this.obtenerPedidos();
        })
        .catch((error) => {
          console.error('Error al cambiar el estado del pedido:', error);
        });
    }
  }
};
</script>


<style scoped>
/* Estilos generales */
body {
  font-family: 'Roboto', sans-serif; /* Tipografía moderna */
  background-color: #f9f9f9;
  margin: 0;
  padding: 0;
}

h1, h2 {
  color: #333;
  font-size: 2em;
  margin-bottom: 20px;
  font-weight: 500;
}

h3 {
  font-size: 1.5em;
  color: #444;
  margin-bottom: 20px;
}

/* Estilos de la columna de pedidos */
.column {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
}

/* Estilos para cada pedido */
.pedido {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
  margin: 0 auto;
}



.pedido:hover {
  transform: translateY(-5px); /* Efecto de elevación al pasar el ratón */
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.pedido p {
  margin: 8px 0;
  font-size: 1.1em;
  color: #555;
}

/* Estilos para los botones dentro de los pedidos */
button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  margin: 5px;
  transition: background-color 0.3s ease;
  
}

button:hover {
  background-color: #0056b3; /* Cambio de color en hover */
}

/* Botón para cambiar el estado */
#btn-cambiarestado {
  background-color: #0b6e19;
}

#btn-cambiarestado:hover {
  background-color: #086c14;
}

#btn-crear {
  background-color: #28a745;
}

#btn-crear:hover {
  background-color: #218838;
}

#btn-editar {
  background-color: #ffc107;
}

#btn-editar:hover {
  background-color: #e0a800;
}

#btn-eliminar {
  background-color: #dc3545;
}

#btn-eliminar:hover {
  background-color: #c82333;
}

/* Estilos para los formularios */
.form-pedido, .form-group {
  background-color: #fff;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  font-size: 1.1em;
  color: #333;
  margin-bottom: 8px;
  display: block;
}

.form-group input, .form-group select {
  width: 100%;
  padding: 12px;
  font-size: 1em;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-top: 5px;
  transition: border-color 0.3s ease;
}

.form-group input:focus, .form-group select:focus {
  border-color: #007bff;
}

/* Estilo para el título del formulario */
h1, h3 {
  text-align: center;
  font-weight: 600;
  color: #333;
}

/* Estilos para los botones del formulario */
button[type="submit"] {
  background-color: #007bff;
  color: white;
  font-size: 1.1em;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s ease;
}

button[type="submit"]:hover {
  background-color: #0056b3;
}

/* Agregar espaciado entre elementos */
.container {
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.containercrear {
  max-width: 400px;
  padding: 30px;
  margin: 0 auto;
}



</style>
