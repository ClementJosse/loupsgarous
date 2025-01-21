<template>
    <ul>
      <li
        v-for="(item, index) in items"
        :key="index"
        :style="getPillPosition(index, items.length)"
      >
        {{ item }}
      </li>
    </ul>
  </template>
  
  <script>
  export default {
    props: {
      items: {
        type: Array,
        default: () => [],
      },
    },
    methods: {
      /**
       * Calcule la position (left, top) pour créer un
       * effet “pilule” vertical : rayon vertical > rayon horizontal.
       */
      getPillPosition(index, total) {
        // Choisissez le rayon horizontal / vertical
        const radiusX = 80
        const radiusY = 150
  
        // Centre de la “pilule”
        const centerX = 150
        const centerY = 150
  
        // On répartit les items sur 2π, en décalant de -π/2
        // pour que le premier item (index = 0) soit en haut.
        const angle = (2 * Math.PI / total) * index - Math.PI / 2
  
        // Coordonnées
        const x = centerX + radiusX * Math.cos(angle)
        // Attention : dans le navigateur, y croît vers le bas,
        // donc si angle = -π/2, l'item part vers le haut.
        const y = centerY + radiusY * Math.sin(angle)
  
        return {
          position: 'absolute',
          left:  x + 'px',
          top:   y + 'px',
          // Pour que l’élément se centre autour du point x,y :
          transform: 'translate(-50%, -50%)',
        }
      },
    },
  }
  </script>
  
  <style scoped>
  ul {
    position: relative; /* indispensable pour le positionnement absolu des li */
    width: 300px;
    height: 300px;
    margin: 0;
    padding: 0;
    list-style: none;
    /* Vous pouvez ajouter un contour pour visualiser la zone de “pilule” */
    background: #f9f9f9;
    border: 1px dashed #ccc;
  }
  
  li {
    cursor: move; 
    background: #eee;
    border: 1px solid #ccc;
    padding: 5px;
    text-align: center;
  }
  </style>
  