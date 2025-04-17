// Abrir e fechar popup
function abrirFormulario() {
    document.getElementById('popupNovaReceita').style.display = 'flex';
  }
  
  function fecharFormulario() {
    document.getElementById('popupNovaReceita').style.display = 'none';
  }
  
  // Adicionar nova receita
  window.adicionarNovaReceita = function () {
    const titulo = document.getElementById("novaTitulo").value.trim();
    const ingredientes = document.getElementById("novaIngredientes").value.split('\n').filter(i => i.trim() !== '');
    const preparo = document.getElementById("novaPreparo").value.split('\n').filter(p => p.trim() !== '');
    const dica = document.getElementById("novaDica").value.trim();
    const info = document.getElementById("novaInfoNutri").value.trim();
  
    if (!titulo || ingredientes.length === 0 || preparo.length === 0) {
      alert("Ei, falta coisa aí! Pelo menos coloca um nome, os ingredientes e o modo de fazer!");
      return;
    }
  
    const novaDiv = document.createElement("div");
    novaDiv.className = "recipe-container";
    novaDiv.id = "receita-" + (document.querySelectorAll(".recipe-container").length + 1);
    novaDiv.innerHTML = `
        <input type="checkbox" class="recipe-selector" style="margin-bottom: 10px;"> Selecionar para PDF
        <h2 class="recipe-title">${titulo}</h2>
        <h3 class="section-title"><i class="fas fa-list"></i> Ingredientes</h3>
        <ul class="ingredients-list">${ingredientes.map(i => `<li>${i}</li>`).join('')}</ul>
        <h3 class="section-title"><i class="fas fa-mortar-pestle"></i> Modo de Preparo</h3>
        <ol class="preparation-steps">${preparo.map(p => `<li>${p}</li>`).join('')}</ol>
        <div class="notes"><strong>Dica:</strong> ${dica || "Nenhuma dica adicionada."}</div>
        <div class="nutrition-info">
            <div class="nutrition-item"><div>Info Nutricional</div><div class="nutrition-value">${info || "Não informado"}</div></div>
        </div>
    `;
  
    document.querySelector(".container").insertBefore(novaDiv, document.getElementById("generatePdf"));
  
    const select = document.getElementById("recipeSelector");
    const newOption = document.createElement("option");
    newOption.value = novaDiv.id;
    newOption.textContent = titulo;
    select.appendChild(newOption);
  
    const feedback = document.getElementById("feedbackMsg");
    feedback.textContent = "Receita salva com sucesso! ✅";
    feedback.style.display = "block";
    setTimeout(() => { feedback.style.display = "none"; }, 3000);
  
    document.getElementById("novaReceitaForm").reset();
    fecharFormulario();
  };
  
  // DOM totalmente carregado
  document.addEventListener("DOMContentLoaded", function () {
    // Filtro de receitas
    const select = document.getElementById('recipeSelector');
    if (select) {
      select.addEventListener('change', function () {
        const selected = this.value;
        const allRecipes = document.querySelectorAll('.recipe-container');
  
        allRecipes.forEach(div => {
          const checkbox = div.querySelector('.recipe-selector');
          if (selected === 'all') {
            div.style.display = 'block';
            checkbox.checked = false;
          } else if (div.id === selected) {
            div.style.display = 'block';
            checkbox.checked = true;
          } else {
            div.style.display = 'none';
            checkbox.checked = false;
          }
        });
      });
    }
  
    // Geração de PDF
    document.getElementById('generatePdf').addEventListener('click', function () {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      const checkboxes = document.querySelectorAll('.recipe-selector:checked');
  
      if (checkboxes.length === 0) {
        alert("Selecione ao menos uma receita para gerar o PDF.");
        return;
      }
  
      const receitas = Array.from(checkboxes).map(cb => cb.closest('.recipe-container'));
      let pageCount = 0;
  
      const gerarPagina = (index) => {
        if (index >= receitas.length) {
          doc.save('receitas-whey-selecionadas.pdf');
          return;
        }
  
        html2canvas(receitas[index]).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          const imgWidth = doc.internal.pageSize.getWidth() - 40;
          const imgHeight = canvas.height * imgWidth / canvas.width;
  
          if (pageCount > 0) doc.addPage();
          doc.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
  
          pageCount++;
          gerarPagina(index + 1);
        });
      };
  
      gerarPagina(0);
    });
  });
  