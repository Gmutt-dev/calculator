//adds two numbers (integer or float -> return int or float)
function add(operandLeft, operandRight) {
    return (operandLeft + operandRight);
}

//subtracts a number from another number (int or float -> return int or float)
function subtract(operandLeft, operandRight) {
    return (operandLeft - operandRight);
}

//multiplies two numbers (int or float -> return int or float)
function multiply(operandLeft, operandRight) {
    return (operandLeft * operandRight);
}

//divides one number with another (int or float -> return int or float)
function divide(operandLeft, operandRight) {
    return (operandLeft / operandRight);
}

//funtion receiving the operator and two operands, then calls one of the operator funtions
function operate(operator, operandLeft, operandRight) {
    switch (operator) {
        case '+':
            return add(operandLeft, operandRight);
            break;
        case '-':
            return subtract(operandLeft, operandRight);
            break;
        case 'x':
            return multiply(operandLeft, operandRight);
            break;
        case '÷':
            return divide(operandLeft, operandRight);
            break;
    }
}

//reset display to "0"
function resetDisplay() {
    display.textContent = "0";
}

function clearDisplay() {
    display.textContent = "";
}

function updateDisplay(char) {
    if (display.textContent === "0") display.textContent = ""; // remove default zero if currently the value in the display
    console.log(previousButtonPressed);
    if (previousButtonPressed === "operator") {  //if previous button pressed was an operator, clear display before adding new chars
        clearDisplay();
        previousButtonPressed = null; //reset previousButtonPressed
    }
    display.textContent += char;
}

//MAIN SCRIPT START
let operandLeft = null;
let operator = null;
let operandRight = null;

let previousButtonPressed = null;

const operators ="+-x÷";

//get the display node by reference
const display = document.querySelector(".display");
//get the container (calculator) node by reference
const calculator = document.querySelector(".container");
//put an eventlistener on the container
calculator.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") { //only handle event if one of the buttons is clicked
        if (Number.parseInt(e.target.textContent)) { // if 1..9 updateDisplay() (NB won't return true for zero)
            updateDisplay(e.target.textContent);
        }
        else if (e.target.textContent === "0") {
            if (display.textContent !== "0") updateDisplay("0");  //only add zero if there is a number 1..9 before it already
        }
        else if (operators.includes(e.target.textContent)) {  //if one of the operators pressed
            if (operandLeft === null) {
                operator = e.target.textContent;
                operandLeft = Number.parseFloat(display.textContent);  
                previousButtonPressed = "operator";
            }    
            else {  // if left operand already assigned a number rather assign current value to right operand AND calculate and print the result
                operandRight = Number.parseFloat(display.textContent);
                clearDisplay();
                updateDisplay(operate(operator, operandLeft, operandRight));
                previousButtonPressed = "operator";
                operandLeft = Number.parseFloat(display.textContent);
                operandRight = null;
                operator = e.target.textContent;
            }
        }

    }
})