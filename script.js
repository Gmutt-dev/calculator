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

//resets calculator operands and operator to null
function resetCalculator() {
    operandLeft = null;
    operandRight = null;
    operator = null;
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
            if (operandRight === 0) {  //No division by zero!
                resetDisplay();
                previousPressOperator = true;
                resetCalculator();
                return("ROFL");
            }
            else return divide(operandLeft, operandRight);
            break;
    }
}

//function to check if string is 10 digits or less long.  If longer and decimal, round to fit 10 digits otherwise number is too big so error
function toMaxTenDigits(string) {
    // if 10 digits or less, just return string
    if (string.length <= 10) return string;
    // if no decimal point in number -> Error: number too large to display
    else if (string.indexOf(".") === -1) {
        return "E - too large";
    }
    // if has decimal point round by -> move decimal to just after 9th number, round number, move decimal back by same number of digits
    else {
        return Math.round(Number.parseFloat(string) * (10 ** (9 - string.indexOf(".")))) / 10 **(9 - string.indexOf("."));
    }
}

//reset display to "0"
function resetDisplay() {
    display.textContent = "0";
}

//empty display
function clearDisplay() {
    display.textContent = "";
}

function updateDisplay(value) {
    let newDisplay = display.textContent;  //get current display in new variable to work with
    if (newDisplay === "0" && value !== ".") newDisplay = ""; // remove default zero if currently the value in the display, except when adding a "."
    if (previousPressOperator === true || previousPressEqual === true) {  //if previous button pressed was an operator, clear display before adding new chars
        newDisplay = "";
        previousPressOperator = false; //reset previousPressOperator
        previousPressEqual = false; //reset previousPressEqual
    }
    newDisplay += value;
    display.textContent = toMaxTenDigits(newDisplay); //update DOM display after making sure max 10 digits
}

//MAIN SCRIPT START
let operandLeft = null;
let operator = null;
let operandRight = null;

let previousPressOperator = false;
let previousPressEqual = false;

const operators ="+-x÷";

//get the display node by reference
const display = document.querySelector(".display");
//get the container (calculator) node by reference
const calculator = document.querySelector(".container");

//put an eventlistener on the container
calculator.addEventListener("click", (e) => {
    //only handle event if one of the buttons is clicked, ignore if any other part of calculator clicked
    if (e.target.tagName === "BUTTON") { 
        // "1..9" button pressed ->  
        if (Number.parseInt(e.target.textContent)) { // (NB won't return true for zero)
            updateDisplay(e.target.textContent);
        }
        // "0" button pressed -> only add zero to the display if there is a number 1..9 before it
        else if (e.target.textContent === "0") {  
            if (display.textContent !== "0") updateDisplay("0");  
        }
        // "+-x÷" button pressed ->
        else if (operators.includes(e.target.textContent)) {
            // if previous button pressed wat also an operator, just change the operator for this calculation
            if (previousPressOperator === true) operator = e.target.textContent;
            // if left operand unassigned, assign display value to it.
            else if (operandLeft === null) {
                operator = e.target.textContent;
                operandLeft = Number.parseFloat(display.textContent); 
                previousPressOperator = true;
            }    
            // if left operand already assigned, rather assign current display value to right operand AND calculate and print the result,
            // finally place result in leftOperand, null the rightOperand and set operator as this handled operand button
            else {  
                operandRight = Number.parseFloat(display.textContent);
                clearDisplay();
                updateDisplay(operate(operator, operandLeft, operandRight));
                previousPressOperator = true;
                operandLeft = Number.parseFloat(display.textContent);
                operandRight = null;
                operator = e.target.textContent;
            }
        }
        // "=" button pressed -> calculate result and update display
        else if (e.target.textContent === "=" && operator !== null) { //only handle = button if an operator has been assigned
            operandRight = Number.parseFloat(display.textContent);
            clearDisplay();
            updateDisplay(operate(operator, operandLeft, operandRight));
            previousPressEqual = true;
            resetCalculator();
            //else ignore button
        }
        // "." button pressed -> add . to display value only if there isn't a "." already
        else if (e.target.textContent === ".") {
            if (previousPressOperator === true || previousPressEqual === true) updateDisplay("0."); //if . pressed after operator or equal pressed put "0." on display
            else if (!display.textContent.includes(".")) updateDisplay(".");  //else update display with . if no . on display already
        }
        // "←" (back) button pressed -> remove one character from back of display content (only if last button pressed was not an operator or equal)
        else if (e.target.textContent === "←" && previousPressOperator !== true && previousPressEqual !== true) display.textContent = display.textContent.substring(0, display.textContent.length - 1);
        // "AC" button pressed -> reset display and clear all values and operators of calculator
        else if (e.target.textContent === "AC") {
            resetDisplay();
            resetCalculator();
        }
    }
})