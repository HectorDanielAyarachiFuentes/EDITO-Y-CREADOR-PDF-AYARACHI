async function descargarComoPDF() {
            var contenido = document.getElementById("contenido");

            // Opciones de configuración para html2pdf
            var opciones = {
                margin: 10,
                filename: 'mi_archivo.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            // Usar html2pdf para convertir y descargar el contenido como PDF
            const pdfBlob = await html2pdf().from(contenido).set(opciones).toPdf().output('blob');

            // Crear un enlace temporal y descargar el archivo
            const link = document.createElement('a');
            link.href = URL.createObjectURL(pdfBlob);
            link.download = 'mi_archivo.pdf';
            link.click();
        }

        function copiarContenido() {
            var contenido = document.getElementById("contenido");
            var copiarContenido = document.getElementById("copiarContenido");

            // Copiar el contenido al área designada
            copiarContenido.textContent = contenido.innerText;

            // Seleccionar y copiar el texto
            var rango = document.createRange();
            rango.selectNode(copiarContenido);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(rango);
            document.execCommand("copy");

            // Deseleccionar el texto
            window.getSelection().removeAllRanges();

            // Notificar al usuario
            alert("Contenido copiado al portapapeles");
        }