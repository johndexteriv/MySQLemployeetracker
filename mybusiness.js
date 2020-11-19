const inquirer = require("inquirer");
const mysql = require("mysql");
const consoletable = require("console.table");
const figlet = require("figlet");
const { allowedNodeEnvironmentFlags } = require("process");

// figlet("Employee Manager", function (err, data) {
// 	if (err) {
// 		console.log("Something went wrong...");
// 		console.dir(err);
// 		return;
// 	}
// 	console.log(data);
// });

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "root",
	database: "myBusinessDB",
});

connection.connect(function (err) {
	if (err) throw err;
	console.log("connected as id" + connection.threadId + "\n");
	promptOptions();
});

const promptOptions = () => {
	inquirer
		.prompt([
			{
				type: "list",
				name: "action",
				message: "What would you like to do?",
				choices: [
					"Add Department",
					"View All Departments",
					"Add Role",
					"View All Roles",
					"Add Employee",
					"Update Employee Role",
					"View All Employees",
					"Exit",
				],
			},
		])
		.then((answer) => {
			switch (answer.action) {
				case "Add Department":
					addDepartment();
					break;

				case "View All Departments":
					viewAllDempartments();
					break;

				case "Add Role":
					addRole();
					break;

				case "View All Roles":
					viewAllRoles();
					break;

				case "Add Employee":
					addEmployee();
					break;

				case "Update Employee Role":
					updateEmployeeRole();
					break;

				case "View All Employees":
					viewAllEmployees();
					break;

				case "Exit":
					connection.end();
					break;
			}
		});
};
