document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".buttons button");
    const display = document.querySelector(".display");
    const history = document.querySelector(".history");

    let calculatorState = {
        currentInput: "",
        currentOperator: "",
        firstValue: "",
        isOperatorClicked: false,
        isEqualsClicked: false,
    };

    function updateDisplay() {
        display.textContent = calculatorState.currentInput || "0";
    }

    function updateHistory(addContent) {
        history.textContent += addContent;
    }

    function performOperation() {
        const { currentOperator, firstValue, currentInput } = calculatorState;

        if (currentOperator === "+") {
            calculatorState.currentInput = (parseFloat(firstValue) + parseFloat(currentInput)).toString();
        } else if (currentOperator === "-") {
            calculatorState.currentInput = (parseFloat(firstValue) - parseFloat(currentInput)).toString();
        } else if (currentOperator === "*") {
            calculatorState.currentInput = (parseFloat(firstValue) * parseFloat(currentInput)).toString();
        } else if (currentOperator === "/") {
            if (calculatorState.currentInput === "0") {
                calculatorState.currentInput = "Error";
            } else {
                calculatorState.currentInput = (parseFloat(firstValue) / parseFloat(currentInput)).toString();
            }
        }

        calculatorState.firstValue = "";
        calculatorState.isOperatorClicked = false;
        calculatorState.isEqualsClicked = true;
        updateDisplay();
    }

    function handleButtonClick(event, key) {
        event.preventDefault();
        const { currentInput, firstValue, isOperatorClicked, isEqualsClicked } = calculatorState;

        if (isEqualsClicked) {
            history.textContent = "";
        }

        if (key === "CE") {
            calculatorState.currentInput = "";
            updateDisplay();
        } else if (key === "C") {
            Object.assign(calculatorState, {
                currentInput: "",
                firstValue: "",
                currentOperator: "",
                isOperatorClicked: false,
                isEqualsClicked: false,
            });
            history.textContent = "";
            updateDisplay();
        } else if (key === "=") {
            if (calculatorState.currentOperator) {
                if (!calculatorState.firstValue) {
                    calculatorState.firstValue = currentInput;
                }
                if (!currentInput) {
                    return;
                }
                updateHistory(`${currentInput} `);
                performOperation();
                updateHistory(`= ${currentInput} `);
            }
        } else if (["+", "-", "*", "/"].includes(key)) {
            if (isOperatorClicked && !currentInput) {
                return;
            }
            updateHistory(`${currentInput} `);
            if (firstValue) {
                performOperation();
            }
            calculatorState.firstValue = currentInput;
            calculatorState.currentInput = "";
            calculatorState.currentOperator = key;
            calculatorState.isEqualsClicked = false;
            calculatorState.isOperatorClicked = true;
            updateHistory(`${key} `);
        } else if (key === "backspace") {
            calculatorState.currentInput = currentInput.slice(0, -1);
            updateDisplay();
        } else if (key === "copy") {
            navigator.clipboard.writeText(currentInput);
        } else if (key === "pi") {
            calculatorState.currentInput += Math.PI.toString();
            updateDisplay();
        } else if (key === "x2") {
            calculatorState.currentInput = (parseFloat(currentInput) ** 2).toString();
            updateDisplay();
        } else if (key === "sqrtx") {
            if (parseFloat(currentInput) >= 0) {
                calculatorState.currentInput = Math.sqrt(parseFloat(currentInput)).toString();
            } else {
                calculatorState.currentInput = "Error";
            }
            updateDisplay();
        } else if (key === "1/x") {
            if (parseFloat(currentInput) !== 0) {
                calculatorState.currentInput = (1 / parseFloat(currentInput)).toString();
            } else {
                calculatorState.currentInput = "Error";
            }
            updateDisplay();
        } else if (key === "%") {
            calculatorState.currentInput = (parseFloat(currentInput) / 100).toString();
            updateDisplay();
        } else {
            calculatorState.currentInput += key;
            updateDisplay();
        }
    }

    function handleKeyPress(event) {
        event.preventDefault();
        const key = event.key;

        const keyActions = {
            Enter: "=",
            Backspace: "CE",
            c: "C",
            C: "C",
            "+": "+",
            "-": "-",
            "*": "*",
            "/": "/",
            ".": ".",
            Escape: "C",
        };

        if (keyActions[key]) {
            buttons.forEach((button) => {
                const buttonKey = button.getAttribute("data-key");
                if (buttonKey === keyActions[key]) {
                    button.click();
                }
            });
        } else if (!isNaN(parseFloat(key)) || key === "π") {
            buttons.forEach((button) => {
                const buttonKey = button.getAttribute("data-key");
                if (buttonKey === key) {
                    button.click();
                }
            });
        }
    }

    buttons.forEach((button) => {
        button.addEventListener("click", (event) => {
            const key = button.getAttribute("data-key");
            handleButtonClick(event, key);
        });
    });

    document.addEventListener("keydown", handleKeyPress);
});
