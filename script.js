//MAIN SCRIPT START

let operandLeft = null;
let operator = null;
let operandRight = null;
let result = null;

let currentInputOperator;
let currentInputEqual = false;
let previousInputOperator = false;
let previousInputEqual = false;

const OPERATORS ="+-x÷";

//get the display node by reference
const display = document.querySelector(".display");
//get the container (calculator) node by reference
const calculator = document.querySelector(".container");

//put an eventlistener on the container
calculator.addEventListener("click", (e) => {
    //only handle event if one of the buttons is clicked, ignore if any other part of calculator clicked
    if (e.target.tagName === "BUTTON") { 

        //assign button's label (.textContent) to varialble buttonPressedValue to make rest of code more legible
        const buttonPressedValue = e.target.textContent;

        // "1..9" button pressed (NB won't return true for zero)
        if (Number.parseInt(buttonPressedValue)) handleInput1to9(buttonPressedValue);
        // "0" button pressed
        else if (buttonPressedValue === "0") handleInput0();
        // "+-x÷" operator button pressed ->
        else if (OPERATORS.includes(buttonPressedValue)) handleInputOperator(buttonPressedValue);
        // "=" button pressed ->
        else if (buttonPressedValue === "=") handleInputEqual();
        // "." button pressed ->
        else if (buttonPressedValue === ".") handleInputDecimalPoint();
        // "←" (back) button pressed ->
        else if (buttonPressedValue === "←") handleInputBack();
        // "C" button pressed ->
        else if (buttonPressedValue === "C") handleInputClear();
        // "AC" button pressed ->
        else if (buttonPressedValue === "AC") handleInputAC();
    }
})

//put an eventlistener on the DOM for keyboard inputs
document.addEventListener("keydown", (e) => {
    //assign keyboard key pressed value to variable to make rest of the code more legible
    keyPressedValue = e.key;

    //if "1..9" key is pressed
    if (Number.parseInt(keyPressedValue)) handleInput1to9(keyPressedValue);
    //if any other value is pressed
    else switch (keyPressedValue) {
            case "0":
                handleInput0();
                break;
            case "+":
                handleInputOperator("+");
                break;
            case "-":
                handleInputOperator("-");
                break;
            //for all multiplication possibilities:
            case "x":
            case "X":
            case "*":
                handleInputOperator("x");
                break;
            //for all division possibilities:
            case "/":
            case "\\":
                handleInputOperator("÷");
                break;
            //for all equals possibilities
            case "=":
            case "Enter":
                handleInputEqual();
                break;
            //for all decimal point possiblities
            case ".":
            case ",":
                handleInputDecimalPoint();
                break;
            case "Backspace":
                handleInputBack();
                break;
            //for all Clear possibilities
            case "c":
            case "C":
            case "Delete":
                handleInputClear();
                break;
            //handle all AC possiblities
            case "a":
            case "A":
            case "Escape":
                handleInputAC();
                break;
            default:  //ignore
    }
})
//END MAIN SCRIPT

////// HANDLER FUCTIONS

// "1..9" input -> update display
function handleInput1to9(inputValue) {
    // reset operandLeft if number pushed after last button equals, as user wants to start a new sum
    if (previousInputEqual) operandLeft = null;
    updateDisplay(inputValue);
    previousInputOperator = false; //reset previousInputOperator
    previousInputEqual = false; //reset previousInputEqual
}

// "0" input -> only add zero to the display if there is a number 1..9 before it
function handleInput0() {
    // reset operandLeft if number pushed after last button equals, as user wants to start a new sum
    if (previousInputEqual) operandLeft = null;
    if (display.textContent !== "0") updateDisplay("0");
    previousInputOperator = false; //reset previousInputOperator
    previousInputEqual = false; //reset previousInputEqual
}

// "+-x÷" operator input ->
function handleInputOperator(inputValue) {
    currentInputOperator = true;
    //only handle operator if the current display shows a number (e.g. not "ROFL" after divide by zero)
    if (!Number.isNaN(Number.parseFloat(display.textContent))) {
        // if previous input was also an operator, just change the operator for this calculation
        if (previousInputOperator === true || previousInputEqual === true) {
            operator = inputValue;
        }
        // if left operand unassigned, assign display value to it.
        else if (operandLeft === null) {
            operator = inputValue;
            operandLeft = Number.parseFloat(display.textContent); 
        }    
        // if left left operand already assigned, rather assign current display value to right operand AND calculate and print the result,
        // finally place result in leftOperand, null the rightOperand and set operator as this handled operand button
        else {  
            operandRight = Number.parseFloat(display.textContent);
            clearDisplay();
            result = operate(operator, operandLeft, operandRight);
            updateDisplay(result);
            operandLeft = result;
            operandRight = null;
            operator = inputValue;
        }
        currentInputOperator = false;
        previousInputOperator = true;
        previousInputEqual = false;
    }
    // else ignore input
}

// "=" input -> calculate result and update display
function handleInputEqual() {
    currentInputEqual = true;
    if (operator !== null) {  //only handle = button if an operator has been assigned
        operandRight = Number.parseFloat(display.textContent);
        clearDisplay();
        result = operate(operator, operandLeft, operandRight);
        updateDisplay(result);
        const tempResult = result;  //move result to tempResult as resetCalculator will set result to null 
        resetCalculator();
        // set result of equals to operandLeft in case next button is an operator
        operandLeft = tempResult;
        previousInputEqual = true;
    }
    //else ignore button
    currentInputEqual = false;
    previousInputOperator = false;  
}

// "." input -> add . to display value only if there isn't a "." already
function handleInputDecimalPoint() {
    //if . pressed after operator or equal pressed put "0." on display
    if (previousInputOperator === true || previousInputEqual === true) updateDisplay("0."); 
    //else update display with . if no . on display already
    else if (!display.textContent.includes(".")) updateDisplay("."); 
    previousInputOperator = false; //reset previousInputOperator
    previousInputEqual = false; //reset previousInputEqual
}

// "←" (back / backspace) input AND last input was not an operator or equal AND not "0" -> remove one character from back of display content
// (unless only 1x char 1..9 in display then replace with "0"
function handleInputBack() {
    if (previousInputOperator !== true && previousInputEqual !== true && display.textContent !== "0"){
        //if display has more than one char remove most right char 
        if (display.textContent.length > 1) display.textContent = display.textContent.substring(0, display.textContent.length - 1);
        //else replace the last char with a "0"
        else display.textContent = "0";
    } 
}

// "C" input -> reset the display
function handleInputClear() {
    resetDisplay();
}

// "AC" input -> reset display and clear all values and OPERATORS of calculator
function handleInputAC() {
    resetDisplay();
    resetCalculator();
}

////// MATH OPERATOR FUNCTIONS

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
            if (operandRight === 0) {  //No division by zero!
                resetDisplay();
                resetCalculator();
                return("ROFL");
            }
            else return divide(operandLeft, operandRight);
            break;
        }
}

////// DISPAY FUNCTIONS

//reset display to "0"
function resetDisplay() {
    display.textContent = "0";
}

//empty display
function clearDisplay() {
    display.textContent = "";
}
//resets calculator operands and operator to null
function resetCalculator() {
    operandLeft = null;
    operandRight = null;
    operator = null;
    result = null;
    currentInputEqual = false;
    currentInputOperator = false;
    previousInputOperator = false;
    previousInputEqual = false;
}

//function to check if string is 10 digits or less long.  If longer and decimal, round to fit 10 digits otherwise number is too big so error
function toMaxTenDigits(string) {
    // if 10 digits or less, just return string
    if (string.length <= 10) return string;
    // if no decimal point in number or scientific notation e+ (i.e. very large numbers) and not user input -> return scientific notation ***limited to 10 digits***
    else if ((string.indexOf(".") === -1 || string.indexOf(".") >= 10 || string.indexOf("e+") !== -1) && (currentInputEqual || currentInputOperator)) {
        const fullExpNumber = (Number.parseFloat(string).toExponential()).toString();
        return Number.parseFloat(string).toExponential(10 - (2 + (fullExpNumber.substring(fullExpNumber.indexOf("e"))).length));
    }
    // if has decimal point and not user input round by -> move decimal to just after 9th number, round number, move decimal back by same number of digits
    else if (currentInputEqual || currentInputOperator) { // filter out user input strings > 10 digits to ignore in next else
        return Math.round(Number.parseFloat(string) * (10 ** (9 - string.indexOf(".")))) / 10 **(9 - string.indexOf("."));
    }
    // else return the string with the last digit thrown away
    else return string.slice(0 , length -1);
}

function updateDisplay(value) {
    let newDisplay = display.textContent;  //get current display in new variable to work with
    if (newDisplay === "0" && value !== ".") newDisplay = ""; // remove default zero if currently the value in the display, except when adding a "."
    if (previousInputOperator === true || previousInputEqual === true) {  //if previous button pressed was an operator or equal, clear display before adding new chars
        newDisplay = "";
    }
    newDisplay += value;
    display.textContent = toMaxTenDigits(newDisplay); //update DOM display after making sure max 10 digits
}


