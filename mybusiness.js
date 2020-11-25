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
				type: "number",
				name: "departmentid",
				message: "What would you like your departments ID number to be?",
			},
			{
				type: "input",
				name: "name",
				message: "What department would you like to add?",
			},
		])
		.then((answer) => {
			var query = "INSERT INTO department (id, name) VALUES (?, ?)";
			connection.query(
				query,
				[answer.departmentid, answer.name],
				function (err, res) {
					if (err) throw err;
					console.log(
						"\n",
						`You have added a ${JSON.stringify(
							answer.name
						)} department, please select what you would like to do next.`
					);
				}
			);
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
				{
					type: "number",
					name: "roleid",
					message: "What would you like your roles ID number to be?",
				},
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
			])
			.then((answer) => {
				var query =
					"INSERT INTO role (id, title, salary, department_id) VALUES (?,?,?,?)";
				connection.query(
					query,
					[
						answer.roleid,
						answer.title,
						answer.salary,
						departmentsIds[answer.department_id],
					],
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
	var query =
		"SELECT role.id, role.title, role.salary, role.department_id, department.name FROM role LEFT JOIN department ON role.department_id=department.id";
	connection.query(query, function (err, res) {
		if (err) throw err;
		console.table("\n", res);
	});
	promptOptions();
};

const addEmployee = () => {
	let roleTitles = [];
	var roleIds = {};
	let managers = [];
	let managersList = [];
	var managersIDs = {};

	var query =
		"SELECT role.id, role.title, employee.employeeid, employee.first_name, employee.last_name, employee.role_id FROM role LEFT JOIN employee ON role.id=employee.role_id;";
	connection.query(query, function (err, results) {
		console.log(results);
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
							var title = `${results[i].id} ${results[i].title}`;
							roleTitles.push(title);
							roleIds[title] = results[i].id;
						}
						return roleTitles;
					},
				},
				{
					type: "list",
					name: "managerid",
					message: "Who is the employees manager?",
					choices: function () {
						for (let i = 0; i < results.length; i++) {
							if (results[i].title == "Manager") {
								var name = `${results[i].first_name} ${results[i].last_name}`;
								managers.push(name);
								managersIDs[name] = results[i].employeeid;
							}
						}
						managersList = [...managers, "This Employee is a Manager"];
						return managersList;
					},
				},
			])
			.then((answer) => {
				if (answer.managerid === "This Employee is a Manager") {
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
							managersIDs[answer.managerid],
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

const updateEmployeeRole = () => {
	let employeenames = [];
	var employeeids = {};
	let employeeroles = [];
	// Just need to be able to update employee role!!!
	var query =
		"SELECT employee.employeeid, employee.first_name, employee.last_name, employee.role_id, role.title FROM employee, role WHERE employee.role_id = role.id;";
	connection.query(query, function (err, results) {
		if (err) throw err;
		inquirer
			.prompt([
				{
					type: "list",
					name: "employeeid",
					message: "Which employee would you like to update?",
					choices: function () {
						for (let i = 0; i < results.length; i++) {
							var employee = `${results[i].first_name} ${results[i].last_name}`;
							employeenames.push(employee);
							employeeids[employee] = results[i].employeeid;
						}
						return employeenames;
					},
				},
				{
					type: "list",
					name: "roleid",
					message: "What would you like the employees new role to be?",
					choices: results.map((result) => result.role_id),
					// 	 function () {
					// 		for (let i = 0; i < results.length; i++) {
					// 			var roleIDs = results[i].role_id;
					// 			if (roleIDs !== results[i].role_id) {
					// 				employeeroles.push(roleIDs);
					// 			}
					// 		}
					// 		return employeeroles;
					// 	},
				},
			])
			.then((answer) => {
				var query = "UPDATE employee SET role_id = ? WHERE employeeid = ?";
				connection.query(
					query,
					[answer.roleid, employeeids[answer.employeeid]],
					function (err, res) {
						if (err) throw err;
						console.log("\n", `You have just updated the employees role`);
					}
				);
				promptOptions();
			});
	});
};

const viewAllEmployees = () => {
	var query = "";
};
// module.exports = connection;
