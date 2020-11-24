const inquirer = require("inquirer");
const mysql = require("mysql");
const consoletable = require("console.table");
const figlet = require("figlet");

// const addDepartment = require("./lib/addDepartment");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "root",
	database: "mybusinessdb",
});

connection.connect(function (err) {
	if (err) throw err;
	console.log("connected as id" + connection.threadId + "\n");
	promptOptions();
});

// figlet("Employee Manager", function (err, data) {
// 	if (err) {
// 		console.log("Something went wrong...");
// 		console.dir(err);
// 		return;
// 	}
// 	console.log(data).then.promptOptions();
// });

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
					console.log("Thank you for using My Business Manager");
					connection.end();
					break;
			}
		});
};

const addDepartment = () => {
	inquirer
		.prompt([
			{
				type: "input",
				name: "name",
				message: "What department would you like to add?",
			},
		])
		.then((answer) => {
			var query = "INSERT INTO department (name) VALUES (?)";
			connection.query(query, [answer.name], function (err, res) {
				if (err) throw err;
				console.log(
					"\n",
					`You have added a ${JSON.stringify(
						answer.name
					)} department, please select what you would like to do next.`
				);
			});
			promptOptions();
		});
};

const viewAllDempartments = () => {
	var query = "SELECT * FROM department";
	connection.query(query, function (err, res) {
		if (err) throw err;
		console.table("\n", res);
	});
	promptOptions();
};

const addRole = () => {
	let departmentsName = [];
	let departmentsIds = {};

	connection.query("SELECT * FROM department", function (err, results) {
		if (err) throw err;
		inquirer
			.prompt([
				{
					type: "input",
					name: "title",
					message: "What role would you like to add?",
				},
				{
					type: "input",
					name: "salary",
					message: "What is the salary for this role?",
				},
				{
					type: "list",
					name: "department_id",
					message: "What department is this role in?",
					choices: function () {
						for (var i = 0; i < results.length; i++) {
							departmentsName.push(results[i].name);
							departmentsIds[results[i].name] = results[i].id;
						}
						return departmentsName;
					},
				},
			])
			.then((answer) => {
				var query =
					"INSERT INTO role (title, salary, department_id) VALUES (?,?,?)";
				connection.query(
					query,
					[answer.title, answer.salary, departmentsIds[answer.department_id]],
					function (err, res) {
						if (err) throw err;
						console.log(
							"\n",
							`You have added a ${JSON.stringify(
								answer.title
							)} role, please select what you would like to do next.`
						);
					}
				);
				promptOptions();
			});
	});
};

const viewAllRoles = () => {
	var query = "SELECT * FROM role";
	connection.query(query, function (err, res) {
		if (err) throw err;
		console.table("\n", res);
	});
	promptOptions();
};

const addEmployee = () => {
	var roleTitles = [];
	var roleIds = {};
	var managersArray = ["null", ...roleTitles];
	var query = "SELECT id, title FROM role";
	connection.query(query, function (err, results) {
		if (err) throw err;
		inquirer
			.prompt([
				{
					type: "input",
					name: "firstname",
					message: "What is your employees first name?",
				},
				{
					type: "input",
					name: "lastname",
					message: "What is your employees last name?",
				},
				{
					type: "list",
					name: "roleid",
					message: "What is your employees role id?",
					choices: function () {
						for (let i = 0; i < results.length; i++) {
							roleTitles.push(results[i].title);
							roleIds[results[i].title] = results[i].id;
						}
						return roleTitles;
					},
				},
				{
					type: "list",
					name: "managerid",
					message: "What is the employees manager's ID?",
					choices: roleTitles,
				},
			])
			.then((answer) => {
				if (answer.managerid === "null") {
					var query =
						"INSERT INTO employee (first_name, last_name, role_id) VALUES (?,?,?)";
					connection.query(
						query,
						[answer.firstname, answer.lastname, roleIds[answer.roleid]],
						function (err, res) {
							if (err) throw err;
							console.log(
								"\n",
								`You have just added ${answer.firstname} ${answer.lastname}. What would you like to do next?`
							);
						}
					);
				} else {
					var query =
						"INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)";
					connection.query(
						query,
						[
							answer.firstname,
							answer.lastname,
							roleIds[answer.roleid],
							answer.managerid,
						],
						function (err, res) {
							if (err) throw err;
							console.log(
								"\n",
								`You have just added ${answer.firstname} ${answer.lastname}. What would you like to do next?`
							);
						}
					);
				}
				promptOptions();
			});
	});
};
// module.exports = connection;
