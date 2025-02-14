<template>
    <div>
      <h2>Crear Pedido</h2>
      <form @submit.prevent="submitForm">
        <div>
          <label for="nombre">Nombre:</label>
          <input type="text" id="nombre" v-model="pedido.nombre" required />
        </div>
        <div>
          <label for="fecha_recogida">Fecha de Recogida:</label>
          <input type="datetime-local" id="fecha_recogida" v-model="pedido.fecha_recogida" required />
        </div>
        <div>
          <label for="telefono">Teléfono:</label>
          <input type="text" id="telefono" v-model="pedido.telefono" required />
        </div>
        <button type="submit">Crear Pedido</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        pedido: {
          nombre: '',
          fecha_recogida: '',
          telefono: '',
        },
      };
    },
    methods: {
      submitForm() {
        axios
          .post('http://localhost:3000/api/pedidos', this.pedido)
          .then((response) => {
            console.log('Pedido creado', response.data);
            this.$router.push('/'); // Redirigir al home
          })
          .catch((error) => {
            console.error('Error al crear el pedido:', error);
          });
      },
    },
  };
  </script>
  