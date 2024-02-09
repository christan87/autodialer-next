// Define arrays of adjectives, first names, and last names.
const ADJECTIVES = [
    "Awesome",
    "Bold",
    "Creative",
    "Dapper",
    "Eccentric",
    "Fiesty",
    "Golden",
    "Holy",
    "Ignominious",
    "Jolly",
    "Kindly",
    "Lucky",
    "Mushy",
    "Natural",
    "Oaken",
    "Precise",
    "Quiet",
    "Rowdy",
    "Sunny",
    "Tall",
    "Unique",
    "Vivid",
    "Wonderful",
    "Xtra",
    "Yawning",
    "Zesty",
  ];
  
  const FIRST_NAMES = [
    "Anna",
    "Bobby",
    "Cameron",
    "Danny",
    "Emmett",
    "Frida",
    "Gracie",
    "Hannah",
    "Isaac",
    "Jenova",
    "Kendra",
    "Lando",
    "Mufasa",
    "Nate",
    "Owen",
    "Penny",
    "Quincy",
    "Roddy",
    "Samantha",
    "Tammy",
    "Ulysses",
    "Victoria",
    "Wendy",
    "Xander",
    "Yolanda",
    "Zelda",
  ];
  
  const LAST_NAMES = [
    "Anchorage",
    "Berlin",
    "Cucamonga",
    "Davenport",
    "Essex",
    "Fresno",
    "Gunsight",
    "Hanover",
    "Indianapolis",
    "Jamestown",
    "Kane",
    "Liberty",
    "Minneapolis",
    "Nevis",
    "Oakland",
    "Portland",
    "Quantico",
    "Raleigh",
    "Saintpaul",
    "Tulsa",
    "Utica",
    "Vail",
    "Warsaw",
    "XiaoJin",
    "Yale",
    "Zimmerman",
  ];

  // Defines a helper function, rand, that takes an array and returns a random element from it.
  const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
  
  // Export a function that generates a random name.
  // This function concatenates a random adjective, a random first name, and a random last name to create a unique name.
  // The rand function is used to select a random element from each array.
  module.exports = {
    generateName: () => rand(ADJECTIVES) + rand(FIRST_NAMES) + rand(LAST_NAMES),
    ADJECTIVES,
    FIRST_NAMES,
    LAST_NAMES
  };
  