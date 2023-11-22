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
//*Script guardar el PDF/
      async function saveAsPDF() {
  const content = tinymce.get('mytextarea').getContent();
  const options = {
    margin: 10,
    filename: 'mi_archivo.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  const pdfBlob = await html2pdf().from(content).set(options).toPdf().output('blob');
  const link = document.createElement('a');
  link.href = URL.createObjectURL(pdfBlob);
  link.download = 'mi_archivo.pdf';
  link.click();
}
