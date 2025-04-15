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
            if (operandRight === 0) {
                resetDisplay();
                clearOnNextPress = true;
                resetCalculator();
                return("ROFL");
            }
            else return divide(operandLeft, operandRight);
            break;
    }
}

//function to check if string is 10 digits or less long.  If longer, round to fit 10 digits
function toMaxTenDigits(string) {
    // if 10 digits or less, just return string
    console.log(typeof string);
    if (string.length <= 10) return string;
    // if no decimal point in number -> Error: number too large to display
    else if (string.indexOf(".") === -1) {
        return "E - too large";
    }
    // if has decimal point, move decimal to just after 9th number, round number, move decimal back by same number of digits
    else {
        return Math.round(Number.parseFloat(string) * (10 ** (9 - string.indexOf(".")))) / 10 **(9 - string.indexOf("."));
    }
}

//reset display to "0"
function resetDisplay() {
    display.textContent = "0";
}

function clearDisplay() {
    display.textContent = "";
}

function updateDisplay(value) {
    let newDisplay = display.textContent;  //get current display in variable to work with
    if (newDisplay === "0" && value !== ".") newDisplay = ""; // remove default zero if currently the value in the display, except when adding a "."
    if (clearOnNextPress === true) {  //if previous button pressed was an operator, clear display before adding new chars
        newDisplay = "";
        clearOnNextPress = false; //reset clearOnNextPress
    }
    newDisplay += value;
    display.textContent = toMaxTenDigits(newDisplay); //update DOM display after making sure max 10 digits
}

//MAIN SCRIPT START
let operandLeft = null;
let operator = null;
let operandRight = null;

let clearOnNextPress = false;

const operators ="+-x÷";

//get the display node by reference
const display = document.querySelector(".display");
//get the container (calculator) node by reference
const calculator = document.querySelector(".container");
//put an eventlistener on the container
calculator.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") { //only handle event if one of the buttons is clicked, ignore if any other part of calculator clicked
        // "1..9" button pressed + display is not full with 10 digits already ->  
        if (Number.parseInt(e.target.textContent) && display.textContent.length < 10) { // (NB won't return true for zero)
            updateDisplay(e.target.textContent);
        }
        // "0" button pressed -> only add zero to the display if there is a number 1..9 before it and display isn't full with 10 digits already
        else if (e.target.textContent === "0"  && display.textContent.length < 10) {  
            if (display.textContent !== "0") updateDisplay("0");  
        }
        // "+-x÷" button pressed ->
        else if (operators.includes(e.target.textContent)) {
            // if previous button pressed wat also an operator, just change the operator for this calculation
            if (clearOnNextPress === true) operator = e.target.textContent;
            // if left operand unassigned, assign display value to it.
            else if (operandLeft === null) {
                operator = e.target.textContent;
                operandLeft = Number.parseFloat(display.textContent);  
                clearOnNextPress = true;
            }    
            // if left operand already assigned, rather assign current display value to right operand AND calculate and print the result
            else {  
                operandRight = Number.parseFloat(display.textContent);
                clearDisplay();
                updateDisplay(operate(operator, operandLeft, operandRight));
                clearOnNextPress = true;
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
            clearOnNextPress = true;
            resetCalculator();
            //else ignore button
        }
        // "." button pressed -> add . to display value only if there isn't a "." already and the display isn't full with 10 digits already
        else if (e.target.textContent === "." && display.textContent.length < 10) {
            if (clearOnNextPress === true) updateDisplay("0."); //if . pressed after operator pressed put 0. on display
            else if (!display.textContent.includes(".")) updateDisplay(".");  //else update display with . if no . on display already
        }
        // "C" button pressed -> reset display
        else if (e.target.textContent === "C") resetDisplay();
        // "AC" button pressed -> reset display and clear all values and operators of calculator
        else if (e.target.textContent === "AC") {
            resetDisplay();
            resetCalculator();
        }
    }
})