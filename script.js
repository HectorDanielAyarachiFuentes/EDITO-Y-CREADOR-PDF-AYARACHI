//*Script para el contenedor PDF/
tinymce.init({
  selector: '#mytextarea',
  plugins: [
    'a11ychecker','advlist','advcode','advtable','autolink','checklist','export',
    'lists','link','image','charmap','preview','anchor','searchreplace','visualblocks',
    'powerpaste','fullscreen','formatpainter','insertdatetime','media','table','help','wordcount'
  ],
  toolbar: 'undo redo | formatpainter casechange blocks | bold italic backcolor | ' +
    'alignleft aligncenter alignright alignjustify | ' +
    'bullist numlist checklist outdent indent | removeformat | a11ycheck code table help',
});

// Arreglo para almacenar el historial de PDFs
let pdfHistory = JSON.parse(localStorage.getItem('pdfHistory')) || [];

// Cargar historial al iniciar
window.addEventListener('load', () => {
updateHistoryList();
});

//*Script guardar el PDF/
async function saveAsPDF() {
const content = tinymce.get('mytextarea').getContent();
const timestamp = new Date().toLocaleString();
const filename = `pdf_${timestamp.replace(/[/:\s]/g, '_')}.pdf`;

const options = {
margin: 10,
filename: filename,
image: { type: 'jpeg', quality: 0.98 },
html2canvas: { scale: 2 },
jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
};

const pdfBlob = await html2pdf().from(content).set(options).toPdf().output('blob');
const pdfUrl = URL.createObjectURL(pdfBlob);

// Convertir el Blob a Base64 para almacenamiento
const reader = new FileReader();
reader.readAsDataURL(pdfBlob);
reader.onloadend = function() {
const base64data = reader.result;

// Crear entrada en el historial
const historyEntry = {
filename: filename,
pdfData: base64data,
timestamp: timestamp
};
pdfHistory.push(historyEntry);

// Guardar en localStorage
localStorage.setItem('pdfHistory', JSON.stringify(pdfHistory));

// Actualizar la lista de historial en el DOM
updateHistoryList();

// Descargar el PDF
const link = document.createElement('a');
link.href = pdfUrl;
link.download = filename;
link.click();
};
}

// Función para borrar todo el historial
function clearAllHistory() {
pdfHistory = [];
localStorage.removeItem('pdfHistory');
updateHistoryList();
}

// Función para borrar un elemento específico
function deleteHistoryItem(index) {
pdfHistory.splice(index, 1);
localStorage.setItem('pdfHistory', JSON.stringify(pdfHistory));
updateHistoryList();
}

function updateHistoryList() {
// Buscar o crear el contenedor del historial
let historyContainer = document.getElementById('pdf-history');
if (!historyContainer) {
historyContainer = document.createElement('div');
historyContainer.id = 'pdf-history';
historyContainer.style.cssText = `
margin: 20px auto;
max-width: 800px;
background: rgba(255, 255, 255, 0.9);
border-radius: 15px;
padding: 20px;
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;
document.body.appendChild(historyContainer);
}

// Estilizar el título y agregar botón de borrar todo
historyContainer.innerHTML = `
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
<h2 style="
  color: #1a237e;
  text-align: center;
  font-size: 24px;
  margin: 0;
  text-transform: uppercase;
  border-bottom: 2px solid #1a237e;
  padding-bottom: 10px;
">Historial de PDFs</h2>
<button onclick="clearAllHistory()" style="
  background: #ff3d00;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 20px;
  cursor: pointer;
  transition: background 0.3s ease;
" onmouseover="this.style.background='#dd2c00'"
   onmouseout="this.style.background='#ff3d00'">
  Borrar Todo
</button>
</div>
`;

// Crear lista de PDFs
const historyList = document.createElement('ul');
historyList.style.cssText = `
list-style: none;
padding: 0;
margin: 0;
`;

pdfHistory.slice().reverse().forEach((entry, index) => {
const listItem = document.createElement('li');
listItem.style.cssText = `
margin: 10px 0;
padding: 15px;
background: linear-gradient(145deg, #f0f0f0, #ffffff);
border-radius: 10px;
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
transition: transform 0.2s ease, box-shadow 0.2s ease;
display: flex;
justify-content: space-between;
align-items: center;
`;

// Efecto hover
listItem.onmouseover = function() {
this.style.transform = 'translateY(-2px)';
this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
};
listItem.onmouseout = function() {
this.style.transform = 'translateY(0)';
this.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
};

listItem.innerHTML = `
<span style="
  color: #666;
  font-size: 14px;
">${entry.timestamp}</span>
<div style="display: flex; gap: 10px;">
  <a href="${entry.pdfData}" 
     download="${entry.filename}" 
     style="
       color: #1a237e;
       text-decoration: none;
       padding: 8px 15px;
       background: #e8eaf6;
       border-radius: 20px;
       font-size: 14px;
       transition: background 0.3s ease;
     "
     onmouseover="this.style.background='#c5cae9'"
     onmouseout="this.style.background='#e8eaf6'"
  >
    Descargar PDF
  </a>
  <button onclick="deleteHistoryItem(${pdfHistory.length - 1 - index})" style="
    background: #ff3d00;
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.3s ease;
  " onmouseover="this.style.background='#dd2c00'"
     onmouseout="this.style.background='#ff3d00'">
    Borrar
  </button>
</div>
`;

historyList.appendChild(listItem);
});

historyContainer.appendChild(historyList);
}
