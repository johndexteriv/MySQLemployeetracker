const inquirer = require("inquirer");
const connection = require("./");

function addDepartment() {
	inquirer
		.prompt([
			{
				type: "input",
				name: "department",
				message: "What department would you like to add?",
			},
		])
		.then((answer) => {
			var query = "INSERT INTO department (id, name)";
			connection.query(query, { department: department }, function (err, res) {
				if (err) throw err;
				console.log(`You have added ${answer.name}`);
			});
			promptOptions();
		});
}

module.exports = addDepartment;
