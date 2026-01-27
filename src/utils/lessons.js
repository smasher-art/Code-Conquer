// Lesson database structure
// Each lesson is keyed by lang:skill for easy lookup

const lessons = {
  "javascript:variables": {
    id: "javascript:variables",
    lang: "javascript",
    skill: "variables",
    title: "Variables & Data Types",
    difficulty: 1,
    xp: 50,
    tags: ["basics", "syntax"],
    timeMinutes: 5,
    order: 1,
    theory: [
      "Variables are containers that store data values. In JavaScript, you can declare variables using let, const, or var.",
      "const is preferred for variables that won't change. let is used for variables that may change. Avoid var in modern JavaScript.",
      "JavaScript has several data types: strings, numbers, booleans, arrays, and objects. You can check a variable's type using typeof.",
    ],
    codeExample: `let score = 10;
const name = "Alice";
var isActive = true;

console.log(score, name, isActive);`,
    task: "Create a variable called `age` with value 18, and log it to the console.",
    initialCode: `// Create a variable called age and assign it 18\n// Then log it\n`,
    expectedOutput: ["18"],
    hints: ["Use let or const to declare a variable.", "Call console.log with the variable name."],
    nextSkill: "arithmetic",
  },

  "javascript:arithmetic": {
    id: "javascript:arithmetic",
    lang: "javascript",
    skill: "arithmetic",
    title: "Arithmetic Operations",
    difficulty: 1,
    xp: 60,
    tags: ["numbers", "operators"],
    timeMinutes: 7,
    order: 2,
    theory: [
      "JavaScript supports basic arithmetic operations: addition (+), subtraction (-), multiplication (*), division (/), and modulo (%).",
      "The modulo operator (%) returns the remainder after division. For example, 10 % 3 equals 1.",
      "You can use these operators with variables and numbers to perform calculations.",
    ],
    codeExample: `const a = 10;
const b = 3;

console.log(a + b);  // 13
console.log(a - b);  // 7
console.log(a * b);  // 30
console.log(a / b);  // 3.3333...
console.log(a % b);  // 1`,
    task: "Create two variables `x = 5` and `y = 2`. Log the sum of x and y.",
    initialCode: `// Create variables x = 5 and y = 2\n// Log their sum\n`,
    expectedOutput: ["7"],
    hints: ["Create two numeric variables and add them.", "Use console.log(x + y) to display the result."],
    nextSkill: "functions",
  },

  "javascript:functions": {
    id: "javascript:functions",
    lang: "javascript",
    skill: "functions",
    title: "Functions & Scope",
    difficulty: 2,
    xp: 80,
    tags: ["functions", "scope"],
    timeMinutes: 12,
    order: 3,
    theory: [
      "Functions are reusable blocks of code. You can declare a function using the function keyword or arrow functions (=>).",
      "Arrow functions are a concise way to write functions: const add = (a, b) => a + b;",
      "Variables declared inside a function have local scope and cannot be accessed outside that function.",
    ],
    codeExample: `function greet(name) {
  return "Hello, " + name;
}

const result = greet("World");
console.log(result);

// Arrow function syntax
const add = (a, b) => a + b;
console.log(add(5, 3));  // 8`,
    task: "Create a function that takes a number and returns double that number. Call it with 7.",
    initialCode: `// Create a function that doubles a number\n// Call it with 7 and log the result\n`,
    expectedOutput: ["14"],
    hints: ["Define a function that returns n * 2.", "Call the function and log the return value."],
    nextSkill: "loops",
  },

  "javascript:loops": {
    id: "javascript:loops",
    lang: "javascript",
    skill: "loops",
    title: "Loops & Iteration",
    difficulty: 2,
    xp: 70,
    tags: ["loops", "iteration"],
    timeMinutes: 10,
    order: 4,
    theory: [
      "Loops allow you to repeat code multiple times. The most common loop types are for, while, and forEach.",
      "A for loop has three parts: initialization, condition, and increment. Example: for (let i = 0; i < 5; i++)",
      "forEach is used to loop through arrays: arr.forEach(item => console.log(item));",
    ],
    codeExample: `// for loop
for (let i = 0; i < 3; i++) {
  console.log(i);
}

// forEach with array
const arr = [1, 2, 3];
arr.forEach(item => console.log(item * 2));`,
    task: "Log all numbers from 1 to 3 using a for loop.",
    initialCode: `// Log numbers 1 to 3 using a for loop\n`,
    expectedOutput: ["1", "2", "3"],
    hints: ["Start your loop at 1 and end at 3.", "Use console.log inside the loop body."],
    nextSkill: "arrays",
  },

  "javascript:arrays": {
    id: "javascript:arrays",
    lang: "javascript",
    skill: "arrays",
    title: "Arrays & Methods",
    difficulty: 2,
    xp: 75,
    tags: ["arrays", "collections"],
    timeMinutes: 10,
    order: 5,
    theory: [
      "An array is an ordered list of values. You create an array using square brackets: const arr = [1, 2, 3];",
      "Arrays have many useful methods: push() adds an item, pop() removes the last item, map() transforms items, filter() selects items.",
      "You can access array items by index: arr[0] gets the first item. Arrays are zero-indexed.",
    ],
    codeExample: `const fruits = ["apple", "banana", "cherry"];

console.log(fruits[0]);  // apple
console.log(fruits.length);  // 3

fruits.push("date");
console.log(fruits);

const numbers = [1, 2, 3, 4];
const doubled = numbers.map(n => n * 2);
console.log(doubled);  // [2, 4, 6, 8]`,
    task: "Create an array with values [10, 20, 30]. Log the first element.",
    initialCode: `// Create an array [10, 20, 30] and log the first element\n`,
    expectedOutput: ["10"],
    hints: ["Remember arrays are zero-indexed.", "Use console.log(arr[0]) to print the first item."],
    nextSkill: "strings",
  },

  "javascript:strings": {
    id: "javascript:strings",
    lang: "javascript",
    skill: "strings",
    title: "String Manipulation",
    difficulty: 1,
    xp: 65,
    tags: ["strings", "text"],
    timeMinutes: 8,
    order: 6,
    theory: [
      "Strings are sequences of characters enclosed in quotes. Use single quotes (''), double quotes (\"\"), or backticks (``).",
      "Template literals use backticks and allow you to embed variables: `Hello, ${name}!`",
      "Strings have methods like toUpperCase(), toLowerCase(), substring(), and split().",
    ],
    codeExample: `const name = "Alice";
const greeting = \`Hello, \${name}!\`;
console.log(greeting);  // Hello, Alice!

console.log(name.toUpperCase());  // ALICE
console.log(name.length);  // 5

const text = "JavaScript";
console.log(text.substring(0, 4));  // Java`,
    task: "Create a string 'hello' and log it in uppercase.",
    initialCode: `// Create a string "hello" and log it in uppercase\n`,
    expectedOutput: ["HELLO"],
    hints: ["Use the toUpperCase() string method.", "Store the string in a variable before logging."],
    nextSkill: null,
  },

  // Additional JavaScript lessons
  "javascript:operators": {
    id: "javascript:operators",
    lang: "javascript",
    skill: "operators",
    title: "Operators & Precedence",
    difficulty: 2,
    xp: 70,
    tags: ["operators", "expressions"],
    timeMinutes: 8,
    order: 7,
    theory: [
      "Understand arithmetic, assignment, and comparison operators.",
      "Operator precedence determines how expressions are evaluated.",
      "Short-circuit logical operators can be used for defaults and guards."
    ],
    codeExample: `const a = 2 + 3 * 4; // precedence
console.log(a);
console.log( (5 > 3) && (2 < 4) );`,
    task: "Evaluate a mixed arithmetic expression and log the result.",
    initialCode: `// Compute an expression and log it\n`,
    expectedOutput: ["14"],
    hints: ["Remember multiplication has higher precedence than addition."],
    nextSkill: "conditions",
  },

  "javascript:conditions": {
    id: "javascript:conditions",
    lang: "javascript",
    skill: "conditions",
    title: "Conditionals",
    difficulty: 2,
    xp: 75,
    tags: ["conditionals", "logic"],
    timeMinutes: 9,
    order: 8,
    theory: [
      "Use if/else to run code selectively based on a condition.",
      "Combine multiple checks with logical operators.",
      "Switch statements handle multiple branches when appropriate."
    ],
    codeExample: `const n = 5;
if (n % 2 === 0) console.log('even');
else console.log('odd');`,
    task: "Check whether a number is odd or even and log the result.",
    initialCode: `// Check a number and log 'odd' or 'even'\n`,
    expectedOutput: ["odd"],
    hints: ["Use modulus (%) to test divisibility by 2."],
    nextSkill: "objects",
  },

  "javascript:objects": {
    id: "javascript:objects",
    lang: "javascript",
    skill: "objects",
    title: "Objects & Maps",
    difficulty: 3,
    xp: 90,
    tags: ["objects", "maps"],
    timeMinutes: 12,
    order: 9,
    theory: [
      "Objects store keyed collections of values.",
      "Access properties with dot or bracket notation.",
      "Maps are built-in collections for key/value pairs with arbitrary keys."
    ],
    codeExample: `const user = { name: 'Sam', age: 30 };
console.log(user.name);

const map = new Map();
map.set('k', 1);
console.log(map.get('k'));`,
    task: "Create an object with name and age, then log name.",
    initialCode: `// Create an object and log one property\n`,
    expectedOutput: ["Sam"],
    hints: ["Use curly braces to create an object and access property via dot notation."],
    nextSkill: null,
  },

  // React path (UI-focused, downstream of JavaScript)
  "react:components": {
    id: "react:components",
    lang: "react",
    parent: "javascript",
    skill: "components",
    title: "React Components",
    difficulty: 2,
    xp: 90,
    tags: ["react", "components", "ui"],
    timeMinutes: 12,
    order: 101,
    theory: [
      "React apps are built from components — reusable UI pieces.",
      "Components can be function components that return JSX.",
      "Props let you pass data into a component from its parent."
    ],
    codeExample: `function Greeting(props) {
  return <div>Hello, {props.name}</div>
}

// Usage
<Greeting name="Alex" />`,
    task: "Create a simple functional component that renders a name passed via props.",
    initialCode: `// Create a function component that returns JSX\n// Use props.name to render the passed name\n`,
    expectedOutput: ["(rendered)"],
    hints: ["Return JSX from the function.", "Accept props and use props.name inside JSX."],
    nextSkill: "props-state",
  },

  "react:props-state": {
    id: "react:props-state",
    lang: "react",
    parent: "javascript",
    skill: "props-state",
    title: "Props & State",
    difficulty: 3,
    xp: 110,
    tags: ["react", "state", "props"],
    timeMinutes: 18,
    order: 102,
    theory: [
      "Props are read-only inputs to components; state manages internal component data.",
      "Use the useState hook to hold and update local state in functional components.",
      "State changes trigger re-renders to reflect the updated UI."
    ],
    codeExample: `import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}`,
    task: "Implement a counter component that increments a value when clicked.",
    initialCode: `// Implement a counter using useState\n`,
    expectedOutput: ["(rendered)"],
    hints: ["Import and use useState.", "Render the count and update it on click."],
    nextSkill: "hooks",
  },

  "react:hooks": {
    id: "react:hooks",
    lang: "react",
    parent: "javascript",
    skill: "hooks",
    title: "React Hooks",
    difficulty: 3,
    xp: 120,
    tags: ["react", "hooks", "effects"],
    timeMinutes: 20,
    order: 103,
    theory: [
      "Hooks let you use state and lifecycle features inside function components.",
      "useEffect runs side effects after render; cleanup helps avoid leaks.",
      "Custom hooks let you extract reusable logic into functions."
    ],
    codeExample: `useEffect(() => {
  // fetch or subscribe
  return () => {
    // cleanup
  }
}, [])
`,
    task: "Use useEffect to run a side-effect once after the component mounts.",
    initialCode: `// Use useEffect with an empty dependency array\n`,
    expectedOutput: ["(rendered)"],
    hints: ["Pass [] as the dependency array to run once.", "Place side-effect logic inside useEffect."],
    nextSkill: "forms",
  },

  "react:forms": {
    id: "react:forms",
    lang: "react",
    parent: "javascript",
    skill: "forms",
    title: "Forms & Controlled Inputs",
    difficulty: 3,
    xp: 100,
    tags: ["react", "forms", "inputs"],
    timeMinutes: 16,
    order: 104,
    theory: [
      "Controlled inputs mirror form values in component state.",
      "Update state on input events and use state as the input value.",
      "Handle form submission by preventing default and reading state."
    ],
    codeExample: `function Form() {
  const [value, setValue] = useState('')
  return <input value={value} onChange={e => setValue(e.target.value)} />
}
`,
    task: "Create a controlled text input and log its value on submit.",
    initialCode: `// Create controlled input and handle submit\n`,
    expectedOutput: ["(rendered)"],
    hints: ["Use state to hold the input value.", "Use onChange to update state."],
    nextSkill: null,
  },

  // React additional lessons
  "react:routing": {
    id: "react:routing",
    lang: "react",
    parent: "javascript",
    skill: "routing",
    title: "Client-side Routing",
    difficulty: 3,
    xp: 100,
    tags: ["react", "routing"],
    timeMinutes: 16,
    order: 105,
    theory: [
      "Routing allows multiple views inside a single-page app.",
      "React Router maps URLs to components.",
      "Route params and nested routes power dynamic pages."
    ],
    codeExample: `// Example route setup
<Routes>
  <Route path='/' element={<Home/>} />
  <Route path='/about' element={<About/>} />
</Routes>`,
    task: "Set up a basic route to render a component at '/' and '/about'.",
    initialCode: `// Configure basic routes\n`,
    expectedOutput: ["(rendered)"],
    hints: ["Use a Router and define Routes and Route components."],
    nextSkill: "react:context",
  },

  "react:context": {
    id: "react:context",
    lang: "react",
    parent: "javascript",
    skill: "context",
    title: "Context & Global State",
    difficulty: 4,
    xp: 130,
    tags: ["react", "context", "state"],
    timeMinutes: 22,
    order: 106,
    theory: [
      "Context provides a way to share values across the component tree.",
      "Avoid prop-drilling using Context.Provider and useContext hook.",
      "Combine context with reducers for predictable state updates."
    ],
    codeExample: `const MyContext = createContext();
<MyContext.Provider value={value}>...</MyContext.Provider>`,
    task: "Create a Context and consume its value in a child component.",
    initialCode: `// Create and use a React Context\n`,
    expectedOutput: ["(rendered)"],
    hints: ["Use createContext and useContext to access the value."],
    nextSkill: null,
  },

  // Python path (display-only for now)
  "python:basics": {
    id: "python:basics",
    lang: "python",
    skill: "basics",
    title: "Python Basics",
    difficulty: 1,
    xp: 60,
    tags: ["python", "basics"],
    timeMinutes: 8,
    order: 201,
    theory: [
      "Python uses indentation to denote blocks.",
      "Common types include int, float, str, list, and dict.",
      "Use print() to output values to the console."
    ],
    codeExample: `x = 5
print(x)
`,
    task: "Assign a variable and print it.",
    initialCode: `# Assign a variable and print it\n`,
    expectedOutput: ["(rendered)"],
    hints: ["Use print(variable)", "Remember Python uses # for comments."],
    nextSkill: "control",
  },

  "python:control": {
    id: "python:control",
    lang: "python",
    skill: "control",
    title: "Control Flow",
    difficulty: 2,
    xp: 80,
    tags: ["python", "control-flow"],
    timeMinutes: 12,
    order: 202,
    theory: [
      "Use if/elif/else to branch logic.",
      "Loops include for and while.",
      "Indentation defines the block scope."
    ],
    codeExample: `for i in range(3):
  print(i)
`,
    task: "Print numbers from 0 to 2 using a loop.",
    initialCode: `# Loop from 0 to 2 and print\n`,
    expectedOutput: ["(rendered)"],
    hints: ["Use range(3) to iterate three times."],
    nextSkill: "functions",
  },

  "python:functions": {
    id: "python:functions",
    lang: "python",
    skill: "functions",
    title: "Functions",
    difficulty: 2,
    xp: 90,
    tags: ["python", "functions"],
    timeMinutes: 14,
    order: 203,
    theory: [
      "Define functions with def and return values.",
      "Parameters accept inputs; functions can be reused.",
      "Docstrings document behavior."
    ],
    codeExample: `def add(a, b):
  return a + b

print(add(2,3))
`,
    task: "Write a function that adds two numbers and prints the result.",
    initialCode: `# Define an add function and call it\n`,
    expectedOutput: ["(rendered)"],
    hints: ["Define with def and return the sum."],
    nextSkill: null,
  },

  // Python additional lessons
  "python:data-structures": {
    id: "python:data-structures",
    lang: "python",
    skill: "data-structures",
    title: "Lists & Dictionaries",
    difficulty: 2,
    xp: 85,
    tags: ["python", "collections"],
    timeMinutes: 14,
    order: 204,
    theory: [
      "Lists are ordered collections; dictionaries map keys to values.",
      "Use list comprehensions to transform lists concisely.",
      "Dictionaries are efficient for key-based lookup."
    ],
    codeExample: `nums = [1,2,3]
print([n*2 for n in nums])
d = {'a':1}
print(d['a'])`,
    task: "Double a list of numbers using a comprehension and access a dict value.",
    initialCode: `# List comprehension and dict access\n`,
    expectedOutput: ["[2, 4, 6]", "1"],
    hints: ["Use [n*2 for n in nums] and d['key'] to access."],
    nextSkill: null,
  },

  "python:modules": {
    id: "python:modules",
    lang: "python",
    skill: "modules",
    title: "Modules & Imports",
    difficulty: 3,
    xp: 95,
    tags: ["python", "modules"],
    timeMinutes: 16,
    order: 205,
    theory: [
      "Split code into modules and import functions and values.",
      "Use __name__ == '__main__' to make modules runnable.",
      "Standard library provides many useful modules (math, json, os)."
    ],
    codeExample: `# mymodule.py\ndef add(a,b):\n  return a+b\n\n# main.py\nfrom mymodule import add\nprint(add(1,2))`,
    task: "Import a function from another module and use it.",
    initialCode: `# Demonstrate importing a function\n`,
    expectedOutput: ["(rendered)"],
    hints: ["Use from module import function or import module."],
    nextSkill: null,
  },

  // C++ path (basic placeholders)
  "cpp:basics": {
    id: "cpp:basics",
    lang: "cpp",
    skill: "basics",
    title: "C++ Basics",
    difficulty: 2,
    xp: 70,
    tags: ["cpp", "basics"],
    timeMinutes: 12,
    order: 401,
    theory: [
      "C++ is a statically typed language with manual memory control.",
      "Basic types include int, double, char, and std::string.",
      "Use std::cout to print to the console."
    ],
    codeExample: `#include <iostream>
using namespace std;

int main() {
  int x = 5;
  cout << x << endl;
  return 0;
}`,
    task: "Declare an integer variable and print it using std::cout.",
    initialCode: `// C++ snippet (main function)
// Declare an int and print it
`,
    expectedOutput: ["(rendered)"],
    hints: ["Include <iostream> and use std::cout.", "End lines with << endl; to flush output."],
    nextSkill: "cpp:control",
  },

  "cpp:control": {
    id: "cpp:control",
    lang: "cpp",
    skill: "control",
    title: "Control Flow (C++)",
    difficulty: 3,
    xp: 90,
    tags: ["cpp", "control-flow"],
    timeMinutes: 15,
    order: 402,
    theory: [
      "C++ uses if/else and loops similar to other languages.",
      "Pay attention to types and loop boundaries.",
      "Use for and while loops to iterate."
    ],
    codeExample: `for (int i = 0; i < 3; ++i) {
  cout << i << endl;
}`,
    task: "Print numbers 0 to 2 using a for loop in C++.",
    initialCode: `// Use a for loop to print 0..2\n`,
    expectedOutput: ["(rendered)"],
    hints: ["Remember to declare loop variable type.", "Use cout for output."],
    nextSkill: null,
  },

  // Additional C++ lesson
  "cpp:functions": {
    id: "cpp:functions",
    lang: "cpp",
    skill: "functions",
    title: "Functions (C++)",
    difficulty: 3,
    xp: 95,
    tags: ["cpp", "functions"],
    timeMinutes: 16,
    order: 403,
    theory: [
      "Define reusable functions with typed parameters and return types.",
      "Pass arguments by value or reference.",
      "Use function prototypes and separate implementations."
    ],
    codeExample: `int add(int a, int b) { return a + b; }
cout << add(2,3) << endl;`,
    task: "Write a function that adds two integers and returns the sum.",
    initialCode: `// Define add function and call it\n`,
    expectedOutput: ["(rendered)"],
    hints: ["Declare the function signature and return the sum."],
    nextSkill: null,
  },
};

export default lessons;
