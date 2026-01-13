import { generateReturnsArray } from "./src/investimetGoals.js";
import { Chart } from "chart.js/auto";
import { createTable } from "./src/table.js";

const finalMoneyChart = document.getElementById("final-money-distribution");
const progressionChart = document.getElementById("progression");
const form = window.document.getElementById("investment-form");
const clearFormButton = document.getElementById("clearForm");
let doughnutChartReference = {};
let progressionChartReference = {};

const columnsArray = [
  { columnLabel: "Mês", accessor: "month" },
  {
    columnLabel: "Total Investido",
    accessor: "investedAmount",
    format: (numberInfo) => formatCurrencyToTable(numberInfo),
  },
  {
    columnLabel: "Rendimento Mensal",
    accessor: "interestReturn",
    format: (numberInfo) => formatCurrencyToTable(numberInfo),
  },
  {
    columnLabel: "Rendimento Total",
    accessor: "totalInterestReturns",
    format: (numberInfo) => formatCurrencyToTable(numberInfo),
  },
  {
    columnLabel: "Quantia Total",
    accessor: "totalAmount",
    format: (numberInfo) => formatCurrencyToTable(numberInfo),
  },
];

function formatCurrencyToTable(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatCurrencyToGraph(value) {
  return value.toFixed(2);
}

function renderProgression(evt) {
  evt.preventDefault();
  if (document.querySelector(".error")) {
    return;
  }
  resetCharts();
  const startingAmount = Number(
    document.getElementById("starting-amount").value.replace(",", ".")
  );
  const additionalContribution = Number(
    document.getElementById("additional-contribution").value.replace(",", ".")
  );
  const timeAmountPeriod = document.getElementById("time-amount-period").value;
  const timeAmount = Number(document.getElementById("time-amount").value);
  const returnRate = Number(
    document.getElementById("returnRate").value.replace(",", ".")
  );
  const evaluationPeriod = document.getElementById("evaluation-period").value;
  const taxRate = Number(
    document.getElementById("tax-rate").value.replace(",", ".")
  );

  const returnsArray = generateReturnsArray(
    startingAmount,
    timeAmount,
    timeAmountPeriod,
    additionalContribution,
    returnRate,
    evaluationPeriod
  );

  const finalInvestimentObject = returnsArray[returnsArray.length - 1];

  doughnutChartReference = new Chart(finalMoneyChart, {
    type: "doughnut",
    data: {
      labels: ["Total Investido", "Rendimento", "Imposto"],
      datasets: [
        {
          // imposto final, valor investido e total recebido
          data: [
            formatCurrencyToGraph(
              finalInvestimentObject.totalInterestReturns * (1 - taxRate / 100)
            ),
            formatCurrencyToGraph(
              finalInvestimentObject.totalInterestReturns * (taxRate / 100)
            ),
            formatCurrencyToGraph(finalInvestimentObject.investedAmount),
          ],
          backgroundColor: [
            "rgb(255, 99, 132)",
            "rgb(54, 162, 235)",
            "rgb(255, 205, 86)",
          ],
          hoverOffset: 4,
        },
      ],
    },
  });

  progressionChartReference = new Chart(progressionChart, {
    type: "bar",
    data: {
      labels: returnsArray.map((investmentObject) =>
        formatCurrencyToGraph(investmentObject.month)
      ),
      datasets: [
        {
          label: "Total Investido",
          data: returnsArray.map((investmentObject) =>
            formatCurrencyToGraph(investmentObject.investedAmount)
          ),
          backgroundColor: "rgb(255, 99, 132)",
        },
        {
          label: "Retorno do Investimento",
          data: returnsArray.map((investmentObject) =>
            formatCurrencyToGraph(investmentObject.interestReturn)
          ),
          backgroundColor: "rgb(54, 162, 235)",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
    },
  });

  createTable(columnsArray, returnsArray, "results-table");
}

function resetCharts() {
  if (doughnutChartReference instanceof Chart) {
    doughnutChartReference.destroy();
  }
  if (progressionChartReference instanceof Chart) {
    progressionChartReference.destroy();
  }
}

function clearForm() {
  form["starting-amount"].value = "";
  form["additional-contribution"].value = "";
  form["time-amount"].value = "";
  form["returnRate"].value = "";
  form["tax-rate"].value = "";
  resetCharts();

  const errorInputscontainer = document.querySelectorAll(".error");

  for (const errorInputscontainer of errorInputscontainer) {
    errorInputscontainer.classList.remove("error");
    errorInputscontainer.parentElement.querySelector("p").remove();
  }
}

function validateInput(evt) {
  const input = evt.target;
  const parentElement = input.parentElement;
  const grandParentElement = parentElement.parentElement;
  const inputValue = input.value.replace(",", ".");

  const isInvalid = isNaN(inputValue) || Number(inputValue) <= 0;

  if (isInvalid && !parentElement.classList.contains("error")) {
    const errorTextElement = document.createElement("p");
    errorTextElement.classList.add("text-red-500", "error-text");
    errorTextElement.innerText = "Insira um valor numérico maior que 0";

    parentElement.classList.add("error");
    grandParentElement.appendChild(errorTextElement);
  }

  if (!isInvalid && parentElement.classList.contains("error")) {
    parentElement.classList.remove("error");
    grandParentElement.querySelector(".error-text")?.remove();
  }
}

for (const forElement of form) {
  if (forElement.tagName === "INPUT" && forElement.hasAttribute("name")) {
    forElement.addEventListener("blur", validateInput);
  }
}

const mainEl = document.querySelector("main");
const carouselEl = document.getElementById("carousel");
const nextButton = document.getElementById("slide-arrow-next");
const previousButton = document.getElementById("slide-arrow-previous");
nextButton.addEventListener("click", () => {
  carouselEl.scrollLeft += mainEl.clientWidth;
});

previousButton.addEventListener("click", () => {
  carouselEl.scrollLeft -= mainEl.clientWidth;
});

form.addEventListener("submit", renderProgression);
clearFormButton.addEventListener("click", clearForm);
