const readline = require("readline");
const fs = require('fs');

console.clear();

let taskList = [];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const recurringQuestion = (command) => rl.question(
  `Type "add" to add a task, type "delete" to delete a task: `,
  addOrDeleteTask(command)
);

// Prints current todo list
const logger = (taskList) => {
  const mappedTaskList = taskList.length
    ? taskList.map((task, index) => `${index + 1}. ${task}`).join('\n ')
    : '';
  console.log('===== Todo List ========');
  console.log('\x1b[32m', mappedTaskList, '\x1b[0m');
  console.log('===== End of List ======');
  console.log('');

  return mappedTaskList;
};

// Reading already existing todo list
try {
  taskList = fs.readFileSync('todo.txt').toString().split("\n").filter(Boolean);
  logger(taskList);
} catch (err) {
  console.error(err);
}

// Main logic
const addOrDeleteTask = (command) => {
  switch (command) {
    case "add":
      rl.question("Type task name: ", function (taskName) {
        fs.appendFileSync('todo.txt', '\n' + taskName)

        const newTaskList = fs.readFileSync('todo.txt').toString().split("\n").filter(Boolean);
        logger(newTaskList);

        rl.question(
          `Type "add" to add a task, type "delete" to delete a task: `,
          (command) => {
            recurringQuestion(command);
          }
        );
      });
      break;
    case "delete":
      if (taskList.length === 0) {
        console.log('\x1b[31m', 'No tasks to delete', '\x1b[0m');
        console.log('');

        rl.question(
          `Type "add" to add a task, type "delete" to delete a task: `,
          (command) => {
            recurringQuestion(command);
          }
        );
      }

      rl.question("Type task number: ", function (index) {
        if (index < 1 || index > taskList.length) {
          console.warn('Invalid task number. Try again.');
          console.log('');

          rl.question(
            `Type "add" to add a task, type "delete" to delete a task: `,
            (command) => {
              recurringQuestion(command);
            }
          );
        } else {
          let newTaskList;

          // read from todo file and delete selected task
          try {
            newTaskList = fs.readFileSync('todo.txt', { encoding: "utf8" })
              .split("\n")
              .filter(Boolean)

            newTaskList.splice(index - 1, 1);
            // file written successfully
            console.log('file read successfully')
          } catch (err) {
            console.error(err);
          }

          // write to todo file
          try {
            fs.writeFileSync('todo.txt', newTaskList.join('\n'));
            console.log('file written successfully');
          } catch (err) {
            console.error(err);
          }

          const currentTaskList = fs.readFileSync('todo.txt').toString().split("\n").filter(Boolean);
          logger(currentTaskList);
        }

        rl.question(
          `Type "add" to add a task, type "delete" to delete a task: `,
          (command) => {
            recurringQuestion(command);
          }
        );
      });
      break;
    default:
      console.warn('Wrong command. It is either "add" or "delete".');
      console.log('');

      rl.question(
        `Type "add" to add a task, type "delete" to delete a task: `,
        (command) => {
          recurringQuestion(command);
        }
      );
  };
};

// Initial question
rl.question(
  `Type "add" to add a task, type "delete" to delete a task: `,
  (command) => {
    recurringQuestion(command);
  }
);

rl.on("close", function () {
  process.exit(0);
});
