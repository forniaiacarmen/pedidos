<template>
  <div>
      <!-- Formulario para crear un nuevo pedido -->
      <h1>Crear de Pedidos</h1>

      <form @submit.prevent="crearPedido">
      <div>
        <label for="nombre">Nombre:</label>
        <input type="text" v-model="nuevoPedido.nombre" required />
      </div>

      <div>
        <label for="telefono">Teléfono:</label>
        <input type="number" v-model="nuevoPedido.telefono" required />
      </div>

      <div>
        <label for="producto">Producto:</label>
        <input type="text" v-model="nuevoPedido.producto" required />
      </div>

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

    <h1>Lista de Pedidos</h1>

    <!-- Pedidos Pendientes -->
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
        <!-- Botón para cambiar el estado -->
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
        <!-- <p><strong>Tiempo Restante:</strong> {{ tiempoRestante(pedido.fecha_recogida) }}</p> -->
        <p><strong>Estado:</strong> {{ pedido.estado }}</p>
        <button @click="eliminarPedido(pedido.id)" id="btn-eliminar">Eliminar</button>
        <button @click="editarPedido(pedido)">Editar</button>
        <button @click="cambiarEstado(pedido)">
          Cambiar a {{ pedido.estado === 'pendiente' ? 'Servido' : 'Pendiente' }}
        </button>
      </div>
    </div>

    <!-- Formulario para editar un pedido -->
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
</template>

<script>
import axios from 'axios';
import { format,parseISO } from 'date-fns';
import { es } from 'date-fns/locale';  // Importa la localización en español

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
      pedidoEditar: null,  // Pedido a editar
    };
  },
  computed: {
    pedidosPendientes() {
      return this.pedidos.filter(pedido => pedido.estado === 'pendiente');
    },
    pedidosServidos() {
      return this.pedidos.filter(pedido => pedido.estado === 'servido');
    }
  },
  mounted() {
    this.obtenerPedidos();
  },
  methods: {
    formatearFecha(fecha) {
      const fechaParseada = parseISO(fecha); // Convertir la fecha en un objeto Date
      return format(fechaParseada, 'dd MMMM yyyy, HH:mm', { locale: es }); // Ahora se muestra el mes en español
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
          this.nuevoPedido = {
            nombre: '',
            telefono: '',
            producto: '',
            fecha_recogida: '',
            estado: 'pendiente',
          };
        })
        .catch((error) => {
          console.error('Error al crear el pedido:', error);
        });
    },
    eliminarPedido(id) {
      axios
        .delete(`http://localhost:3000/api/pedidos/${id}`)
        .then(() => {
          this.pedidos = this.pedidos.filter((pedido) => pedido.id !== id);
        })
        .catch((error) => {
          console.error('Error al eliminar el pedido:', error);
        });
    },
    editarPedido(pedido) {
      this.pedidoEditar = { ...pedido };  // Copiar los datos del pedido para editarlos
    },
    actualizarPedido() {
      axios
        .put(`http://localhost:3000/api/pedidos/${this.pedidoEditar.id}`, this.pedidoEditar)
        .then((response) => {
          const index = this.pedidos.findIndex(pedido => pedido.id === response.data.id);
          if (index !== -1) {
            this.pedidos[index] = response.data;  // Actualizamos el pedido en el array
          }
          this.pedidoEditar = null;  // Limpiar el formulario
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
      // Volver a obtener todos los pedidos de la base de datos
      this.obtenerPedidos();  // Llama al método para obtener todos los pedidos nuevamente
    })
    .catch((error) => {
      console.error('Error al cambiar el estado del pedido:', error);
    });
    },
  },
};
</script>

<style scoped>
/* Estilos generales */
body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  margin: 0;
  padding: 0;
}

h1, h2 {
  color: #333;
  font-size: 1.5em;
  margin-bottom: 20px;
}

.column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.pedido {
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.pedido p {
  margin: 5px 0;
}

/* Estilos para el formulario de creación y edición de pedidos */
.form-pedido {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  margin: 0 auto 30px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-size: 1em;
  margin-bottom: 5px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  font-size: 1em;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button.btn {
  background-color: #007BFF;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  margin-top: 10px;
}
#btn-cambiarestado{

  background-color: #0b6e19;
}

#btn-crear {
  background-color: #0b6e19;

}
#btn-editar {
  background-color: #c1ce0d;

}

#btn-eliminar{
  background-color: #cf3f12;

}
/* Botones dentro de los pedidos */
button {
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 5px;
}






</style>

