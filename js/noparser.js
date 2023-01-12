let processButton = document.getElementById("process-button");
let copyButton = document.getElementById("copy-button");
let outputTextarea = document.getElementById("noparse-output");

// Add an event listener to the process button
processButton.addEventListener("click", function () {
  // Get the BBCode from the textarea
  let bbcode = document.getElementById("bbcode").value;

  // Split the BBCode into an array of lines
  let lines = bbcode.split("\n");

  // Initialize a result string
  let result = "";

  // Iterate through the lines
  for (let i = 0; i < lines.length; i++) {
    // Trim leading spaces and tabs from the line
    let line = lines[i].replace(/^[ \t]+/g, "");

    // Wrap the line in [noparse] [/noparse] tags
    result += "[noparse]" + line + "[/noparse]";

    // Add a [br] at the end of each line except the very last one
    if (i < lines.length - 1) {
      result += "[br]\n";
    }
  }

  // Set the value of the output textarea to the processed BBCode
  outputTextarea.value = result;
});
