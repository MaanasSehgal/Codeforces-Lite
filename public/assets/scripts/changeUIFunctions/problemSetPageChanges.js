const changeProblemSetPageUI = () => {
  const currentURL = window.location.href;
  if (!currentURL.includes("codeforces.com/problemset")) {
    return;
  }

  const table = document.querySelector("table.problems");
  if (!table) {
    return;
  }

  const tableBody = table.querySelector("tbody");
  if (!tableBody) {
    return;
  }

  const rows = tableBody.querySelectorAll("tr");

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const secondCell = row.cells[1];

    if (secondCell) {
      secondCell.classList.add("custom-cell");
    }

    const fifthCell = row.cells[4].querySelector("a");
    if (fifthCell) {
      fifthCell.classList.add("custom-cell-fifth");
    }
  }
};

const removeChangeProblemSetPageUI = () => {
  const currentURL = window.location.href;
  if (!currentURL.includes("codeforces.com/problemset")) {
    return;
  }

  const table = document.querySelector("table.problems");

  if (!table) {
    return;
  }

  const tableBody = table.querySelector("tbody");
  if (!tableBody) {
    return;
  }

  const rows = tableBody.querySelectorAll("tr");

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];

    const secondCell = row.cells[1];
    if (secondCell) {
      secondCell.classList.remove("custom-cell");
    }

    const fifthCell = row.cells[4].querySelector("a");
    if (fifthCell) {
      fifthCell.classList.remove("custom-cell-fifth");
    }
  }
};
