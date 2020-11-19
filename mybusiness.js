const inquirer = require("inquirer");
const mysql = require("mysql");

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
});
