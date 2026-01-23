// Lesson database structure
// Each lesson is keyed by lang:skill for easy lookup

const lessons = {
  "javascript:variables": {
    id: "javascript:variables",
    lang: "javascript",
    skill: "variables",
    title: "Variables & Data Types",
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
    nextSkill: "arithmetic",
  },

  "javascript:arithmetic": {
    id: "javascript:arithmetic",
    lang: "javascript",
    skill: "arithmetic",
    title: "Arithmetic Operations",
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
    nextSkill: "functions",
  },

  "javascript:functions": {
    id: "javascript:functions",
    lang: "javascript",
    skill: "functions",
    title: "Functions & Scope",
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
    nextSkill: "loops",
  },

  "javascript:loops": {
    id: "javascript:loops",
    lang: "javascript",
    skill: "loops",
    title: "Loops & Iteration",
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
    nextSkill: "arrays",
  },

  "javascript:arrays": {
    id: "javascript:arrays",
    lang: "javascript",
    skill: "arrays",
    title: "Arrays & Methods",
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
    nextSkill: "strings",
  },

  "javascript:strings": {
    id: "javascript:strings",
    lang: "javascript",
    skill: "strings",
    title: "String Manipulation",
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
    nextSkill: null,
  },
};

export default lessons;
