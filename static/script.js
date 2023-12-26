// script.js

function listDisciplines() {
  fetch("/discipline/listDisciplines")
    .then((response) => response.json())
    .then((data) => {
      clearTable("disciplinesModalTable");

      const table = document.getElementById("disciplinesModalTable");
      const tbody = document.createElement("tbody");

      data.forEach((discipline) => {
        const row = document.createElement("tr");

        ["id", "name"].forEach((key) => {
          const cell = document.createElement("td");
          cell.textContent = discipline[key];
          row.appendChild(cell);
        });

        // Coluna de ações (botões Editar e Excluir)
        const actionsCell = document.createElement("td");
        const editButton = createButton("Editar", () =>
          editDiscipline(discipline.id)
        );
        const deleteButton = createButton("Excluir", () =>
          deleteDiscipline(discipline.id)
        );
        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);
        row.appendChild(actionsCell);

        tbody.appendChild(row);
      });

      table.appendChild(tbody);

      $("#disciplinesModal").modal("show");
    })
    .catch((error) => console.error("Erro ao obter disciplinas:", error));
}

// Função utilitária para criar botões
function createButton(text, onClick) {
  const button = document.createElement("button");
  button.className = "btn btn-primary btn-sm mr-2";
  button.textContent = text;
  button.onclick = onClick;
  return button;
}

function editDiscipline(disciplineId) {
  const disciplineName = prompt("Digite o novo nome da disciplina");

  fetch(`/discipline/editDiscipline/${disciplineId}`, {
    method: "POST",
    headers: {
      "content-Type": "application/x-www-form-urlencoded",
    },
    body: `name=${disciplineName}`,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => console.error("Erro ao editar disciplina:", error));

  console.log("Editar disciplina com ID:", disciplineId);
}

function deleteDiscipline(disciplineId) {
  if (confirm("Tem certeza de que deseja excluir esta disciplina?")) {
    fetch(`/discipline/deleteDiscipline/${disciplineId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Adicione esta linha para ver a resposta completa no console
      })
      .catch((error) => console.error("Erro ao excluir disciplina:", error));
  }
  console.log("Excluir disciplina com ID:", disciplineId);
}

// Função para limpar a tabela existente no modal
function clearTable(tableId) {
  const table = document.getElementById(tableId);
  if (table) {
    table.innerHTML = "";
  }
}

function addDiscipline() {
  let disciplineName = document.getElementById("discipline_name").value;

  if (!disciplineName) alert("Por favor, insira um nome de disciplina válido.");

  fetch("/discipline/addDiscipline", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `name=${encodeURIComponent(disciplineName)}`,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Disciplina adicionada com sucesso:", data);
      alert("Disciplina adicionada com sucesso:");
    })
    .catch((error) => {
      console.error("Erro ao adicionar disciplina:", error);
      alert(
        "Erro ao adicionar disciplina. Verifique o console para mais detalhes."
      );
    });
}
