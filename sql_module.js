var currentYear = 2018;
var constants = require("./constants.js");

exports.setSqlQuery = function(post){
  var number = post.number;
  var name = post.name;
  var lastname = post.lastname;
  var patronymic = post.patronymic;
  var street = post.street;
  var building = post.building;
  var query;
  
  if (name != "" || lastname != "" || patronymic != ""){
    query = "(SELECT * FROM Links LEFT JOIN Pages ON Links.LinkID = Pages.Links_LinkID " + 
    "WHERE HeadName LIKE '%" + lastname + "%' AND HeadName LIKE '%" + name + "%' AND HeadName LIKE '%" + patronymic + "%')"+
    " UNION " +
    "(SELECT * FROM Links LEFT JOIN Pages ON Links.LinkID = Pages.Links_LinkID " + 
    "WHERE Founders LIKE '%" + lastname + "%' AND Founders LIKE '%" + name + "%' AND Founders LIKE '%" + patronymic + "%')";
  }else if (number != ""){
    query = "SELECT * FROM Links LEFT JOIN Pages ON Links.LinkID = Pages.Links_LinkID " + 
    "WHERE Phone LIKE '%" + number + "%'";
  //}else if (street != ""){
    //query = "SELECT * FROM Links LEFT JOIN Pages ON Links.LinkID = Pages.Links_LinkID " +
    //"WHERE Street LIKE '%" + street + "%'";
  }else if (street != "" && building != ""){
    query = "SELECT * FROM Links LEFT JOIN Pages ON Links.LinkID = Pages.Links_LinkID " +
    "WHERE Street LIKE '%" + street + "%' AND Building LIKE '" + building + "'";
  // }else if (age != ""){
  //   query = "SELECT * FROM Links LEFT JOIN Pages ON Links.LinkID = Pages.Links_LinkID " +
  //   "WHERE Street LIKE '%" + street + "%' AND Building LIKE '%" + building + "%'";
  }
  
  console.log(query);
  return query;
};

exports.setSqlQueryPersons = function(post){
  var age = post.age;
  var yearOfBirth = post.yearOfBirth;
  var query;
  
  if(yearOfBirth != "") {
    for (var i = 0; i < 27; i++) {
      yearOfBirth = yearOfBirth.substr(1);
    }
  }
  if(age != "") yearOfBirth = currentYear - age;
  if(yearOfBirth != ""){
    query = "SELECT * FROM persons WHERE inn LIKE '%"+ yearOfBirth +"%'";
  }
  return query;
};

exports.setConnection = function(mySQL_business, mySQL_persons) {
  var mysql = require('mysql');
  mySQL_business = mysql.createConnection({
    host: constants.MYSQL_HOST,
    user: constants.MYSQL_USER,
    password: constants.MYSQL_PASSWORD,
    database: "mjdb_kloopasia"
  });
  mySQL_persons = mysql.createConnection({
      host: constants.MYSQL_HOST_PERSONS,
      user: constants.MYSQL_USER_PERSONS,
      password: constants.MYSQL_PASSWORD_PERSONS,
      database: "spider"
  });  
}