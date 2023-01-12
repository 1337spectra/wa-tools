const generateCode = document.getElementById("generateCode");
const nameInput = document.getElementById("nameInput");
const output = document.getElementById("jason-output");

generateCode.addEventListener("click", function() {
  let names = nameInput.value.split("\n");
  let values = {};
  for (let i = 0; i < names.length; i++) {
    values[`val${i+2}`] = names[i];
  }
  let code = JSON.stringify({values: values}, null, 2); 
  output.value = code;
});