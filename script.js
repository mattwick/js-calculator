const display = document.querySelector('.display');
const historyList = document.querySelector('.history-list');
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
    try {
        const inputValue = display.value;
        const result = eval(inputValue);
        display.value = result;
        addToHistory(inputValue, result);
        resultCalculated = true;
    } catch (error) {
        display.value = 'Error';
    }
}

function addToHistory(input, result) {
    const historyItem = document.createElement('div');
    historyItem.classList.add('history-item');

    const formattedInput = formatInput(input);
    const shortResult = formatResult(result);
    const inputDisplay = document.createElement('span');
    inputDisplay.textContent = `${formattedInput} = ${shortResult}`;
    historyItem.appendChild(inputDisplay);

    const addButton = document.createElement('button');
    addButton.textContent = '+';
    addButton.addEventListener('click', () => {
        appendNumber(result);
    });
    historyItem.appendChild(addButton);

    historyList.prepend(historyItem);
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
