import { generateReturnsArray } from "./src/investimetGoals.js";

const form = window.document.getElementById("investment-form");
const BtnclearForm = document.getElementById("clearForm");

function renderProgression(evt) {
  evt.preventDefault();
  if (document.querySelector(".error")) {
    return;
  }
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

  console.log(returnsArray);
}

function clearForm() {
  form["starting-amount"].value = "";
  form["additional-contribution"].value = "";
  form["time-amount"].value = "";
  form["returnRate"].value = "";
  form["tax-rate"].value = "";

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

form.addEventListener("submit", renderProgression);
BtnclearForm.addEventListener("click", clearForm);
