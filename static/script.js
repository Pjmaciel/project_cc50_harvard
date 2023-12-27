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
      clearDisciplineForm();
    })
    .catch((error) => {
      console.error("Erro ao adicionar disciplina:", error);
      alert(
        "Erro ao adicionar disciplina. Verifique o console para mais detalhes."
      );
    });
}

// Função para limpar os campos do formulário de disciplina
function clearDisciplineForm() {
  document.getElementById("discipline_name").value = "";
}

// Students

// Adicione esta função ao seu arquivo script.js
function populateDisciplinesDropdown() {
  // Faz o fetch para obter a lista de disciplinas
  fetch("/discipline/listDisciplines")
    .then((response) => response.json())
    .then((data) => {
      const dropdown = document.getElementById("discipline_id");

      // Salva o valor atual selecionado (se houver)
      const selectedValue = dropdown.value;

      // Limpa as opções existentes
      dropdown.innerHTML = "";

      // Adiciona as opções da lista suspensa
      data.forEach((discipline) => {
        const option = document.createElement("option");
        option.value = discipline.id;
        option.textContent = discipline.name;
        dropdown.appendChild(option);
      });

      // Tenta redefinir o valor selecionado (se existir)
      if (selectedValue) {
        dropdown.value = selectedValue;
      }
    })
    .catch((error) => console.error("Erro ao obter disciplinas:", error));
}

function addStudent() {
  let studentName = document.getElementById("name").value;
  let studentAge = document.getElementById("age").value;
  let studentDisciplineId = document.getElementById("discipline_id").value;

  if (!studentName || !studentAge || !studentDisciplineId) {
    alert("Por favor, preencha todos os campos do aluno.");
    return;
  }

  fetch("/student/addStudent", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `name=${encodeURIComponent(
      studentName
    )}&age=${studentAge}&discipline_id=${studentDisciplineId}`,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Estudante adicionado com sucesso:", data);
      alert("Estudante adicionado com sucesso.");
      listStudents();
      clearStudentForm();
    })
    .catch((error) => {
      console.error("Erro ao adicionar estudante:", error);
      alert(
        "Erro ao adicionar estudante. Verifique o console para mais detalhes."
      );
    });
}

function listStudents() {
  fetch("/student/listStudents")
    .then((response) => response.json())
    .then((data) => {
      clearTable("studentsTableBody");

      const table = document.getElementById("studentsTableBody");

      data.forEach((student) => {
        const row = document.createElement("tr");

        ["id", "name", "age"].forEach((key) => {
          const cell = document.createElement("td");
          cell.textContent = student[key];
          row.appendChild(cell);
        });

        // Aqui, em vez de exibir o discipline_id, vamos buscar o nome da disciplina
        const disciplineCell = document.createElement("td");
        fetch(`/discipline/findById/${student.discipline_id}`)
          .then((response) => response.json())
          .then((discipline) => {
            disciplineCell.textContent = discipline.name;
          })
          .catch((error) => console.error("Erro ao obter disciplina:", error));

        row.appendChild(disciplineCell);

        // Coluna de ações (botões Editar e Excluir)
        const actionsCell = document.createElement("td");
        const editButton = createButton("Editar", () =>
          editStudent(student.id)
        );
        const deleteButton = createButton("Excluir", () =>
          deleteStudent(student.id)
        );
        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);
        row.appendChild(actionsCell);

        table.appendChild(row);
      });
    })
    .catch((error) => console.error("Erro ao obter estudantes:", error));
}

function deleteStudent(studentId) {
  if (confirm("Tem certeza de que deseja excluir este estudante?")) {
    fetch(`/student/deleteStudent/${studentId}`, {
      method: "DELETE",
    })
      .then((response) => {
        // Adicione esta linha para ver a resposta completa no console
        console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        listStudents();
      })
      .catch((error) => console.error("Erro ao excluir estudante:", error));
  }
  console.log("Excluir estudante com ID:", studentId);
}

function editStudent(studentId) {
  const studentName = prompt("Digite o novo nome do estudante");
  const studentAge = prompt("Digite a nova idade do estudante");
  const studentDisciplineId = prompt(
    "Digite o novo ID da disciplina do estudante"
  );

  fetch(`/student/editStudent/${studentId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `name=${studentName}&age=${studentAge}&discipline_id=${studentDisciplineId}`,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      listStudents();
    })
    .catch((error) => console.error("Erro ao editar estudante:", error));

  console.log("Editar estudante com ID:", studentId);
}

// Função para limpar a tabela de estudantes
function clearStudentsTable() {
  const table = document.getElementById("studentsTable");
  if (table) {
    // Mantenha os cabeçalhos da tabela e remova apenas as linhas de dados
    const tbody = table.querySelector("tbody");
    if (tbody) {
      tbody.innerHTML = "";
    }
  }
}

// Função para limpar os campos do formulário de aluno
function clearStudentForm() {
  document.getElementById("name").value = "";
  document.getElementById("age").value = "";
  document.getElementById("discipline_id").value = "";
}

// Adicione esta linha ao final do seu arquivo script.js
document.addEventListener("DOMContentLoaded", listStudents);
