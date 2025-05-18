<template>
  <div class="sql-editor-container">
    <textarea v-model="sqlText" class="sql-editor" placeholder="Entrez votre code SQL ici..." spellcheck="false"
      @input="processInput"></textarea>
    <div class="highlighting" v-html="colorizedSql"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const sqlText = ref('SELECT * FROM users WHERE status = "active";')
const colorizedSql = ref('')

// Liste des mots-clés SQL pour la coloration
const sqlKeywords = [
  'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER',
  'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET', 'INSERT', 'UPDATE',
  'DELETE', 'CREATE', 'ALTER', 'DROP', 'TABLE', 'VIEW', 'INDEX', 'TRIGGER',
  'AND', 'OR', 'NOT', 'IN', 'BETWEEN', 'LIKE', 'IS', 'NULL', 'AS', 'DISTINCT',
  'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'UNION', 'ALL', 'INTO'
]

// Fonction pour coloriser le texte SQL
const processInput = () => {
  let text = sqlText.value

  // Échapper les caractères HTML spéciaux
  text = text.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Remplacer les espaces par des espaces insécables pour préserver les espaces multiples
  text = text.replace(/ /g, '&nbsp;')

  // Remplacer les retours à la ligne
  text = text.replace(/\n/g, '<br>')

  // Coloriser les chaînes de caractères entre guillemets
  text = text.replace(/"([^"]*)"/g, '<span class="string">"$1"</span>')
  text = text.replace(/'([^']*)'/g, '<span class="string">\'$1\'</span>')

  // Coloriser les nombres
  text = text.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="number">$1</span>')

  // Coloriser les commentaires (lignes commençant par --)
  text = text.replace(/(--[^\n]*)/g, '<span class="comment">$1</span>')

  // Coloriser les mots-clés SQL (en respectant la casse)
  sqlKeywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
    text = text.replace(regex, match => `<span class="keyword">${match}</span>`)
  })

  colorizedSql.value = text
}

onMounted(() => {
  processInput()
})
</script>

<style>
.sql-editor-container {
  position: relative;
  height: 300px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
  font-family: monospace;
  font-size: 14px;
  line-height: 1.5;
}

.sql-editor {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 8px;
  margin: 0;
  border: none;
  color: transparent;
  background: transparent;
  caret-color: black;
  resize: none;
  z-index: 2;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
  outline: none;
}

.highlighting {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 8px;
  background: #f9f9f9;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
  overflow: auto;
  pointer-events: none;
  z-index: 1;
}

/* Styles de coloration */
.keyword {
  color: #4ec9b0;
  font-weight: bold;
}

.string {
  color: #a31515;
}

.number {
  color: #098658;
}

.comment {
  color: #008000;
  font-style: italic;
}
</style>