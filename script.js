const display = document.querySelector('.display');
const historyList = document.querySelector('.history-list');
const inputField = document.getElementById('input-field');
const historyContent = document.getElementById('history-content');
let resultCalculated = false;
window.addEventListener('keydown', handleKeyDown);

function handleKeyDown(event) {
    const key = event.key;

    if (key >= '0' && key <= '9') {
        appendNumber(key);
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        appendOperator(key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    } else if (key === 'Backspace' || key === 'Delete') {
        clearDisplay();
    } else if (key === '.') {
        appendDecimal();
    }
}

function appendNumber(number) {
    if (resultCalculated) {
        clearDisplay();
        resultCalculated = false;
    }
    display.value += number;
}

function appendOperator(operator) {
    if (resultCalculated) {
        resultCalculated = false;
    }
    display.value += operator;
}

function clearDisplay() {
    display.value = '';
}

function calculate() {
    const expression = inputField.value.trim();
    if (expression === "") return;

    try {
        const preparedExpression = expression.replace(/×/g, "*").replace(/÷/g, "/");
        const result = math.evaluate(preparedExpression); // Directly use math.evaluate()
        inputField.value = result.toFixed(3).replace(/\.?0+$/, "");
        addToHistory(expression, result);
    } catch (error) {
        console.error("Error:", error);
        inputField.value = "Error";
    }
}

function addToHistory(expression, result) {
    const historyItem = document.createElement('div');
    historyItem.classList.add('history-item');

    // Add copy button
    const copyButton = document.createElement('button');
    copyButton.classList.add('copy-btn');
    copyButton.textContent = '📋';
    copyButton.onclick = (event) => { // Add event parameter
        event.stopPropagation(); // Prevent triggering other click events on parent elements
        copyToClipboard(result); // Update this line
      };
    historyItem.appendChild(copyButton);


    const historyExpression = document.createElement('span');
    historyExpression.classList.add('history-expression');
    historyExpression.textContent = expression;
    historyItem.appendChild(historyExpression);

    const historyResult = document.createElement('span');
    historyResult.classList.add('history-result');
    historyResult.textContent = formatResult(result);
    historyItem.appendChild(historyResult);

    // Add add button
    const addButton = document.createElement("button");
    addButton.textContent = "+";
    addButton.classList.add("history-add");
    addButton.onclick = () => addToCalculator(result);
    historyItem.appendChild(addButton);
    historyContent.insertBefore(historyItem, historyContent.firstChild);
}

function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

function addToCalculator(value) {
  if (inputField.value === "Error") {
    inputField.value = "";
  }
  inputField.value += value;
}


function formatInput(input) {
    const inputRegex = /(\d+\.\d{1,2})\d*/g;
    return input.replace(inputRegex, '$1');
}

function formatResult(result) {
    const formattedResult = parseFloat(result.toFixed(3));
    if (formattedResult.toString().length < result.toString().length) {
        return `${formattedResult}...`;
    }
    return formattedResult;
}

function calculateRelativeDifference() {
    const originalValue = parseFloat(document.getElementById("original-value").value);
    const newValue = parseFloat(document.getElementById("new-value").value);
    if (!isNaN(originalValue) && !isNaN(newValue) && originalValue !== 0) {
        const relativeDifference = ((newValue - originalValue) / originalValue) * 100;
        const resultElement = document.getElementById("relative-difference-result");

        resultElement.textContent = `${relativeDifference.toFixed(2)}%`;
        resultElement.style.color = relativeDifference >= 0 ? 'green' : 'red';
    }
}
