const fs = require("node:fs");
const path = require("node:path");

const directoryPath = path.join(process.cwd(), "routes");

function sortStyles(obj) {
  if (obj.style && typeof obj.style === "string") {
    // Check if the style contains keyframe percentages
    const keyframePattern = /\d+%/;
    if (!keyframePattern.test(obj.style)) {
      const styles = obj.style
        .split(";")
        .filter(Boolean)
        .map((style) => style.trim().replace(/\s*:\s*/g, ": "))
        .sort((a, b) => a.localeCompare(b));
      obj.style = `${styles.join("; ")};`;
    }
  }

  if (obj.children && Array.isArray(obj.children)) {
    obj.children.forEach(sortStyles);
  }

  if (obj.blueprint && typeof obj.blueprint === "object") {
    sortStyles(obj.blueprint);
  }

  if (obj.classroom && Array.isArray(obj.classroom)) {
    obj.classroom.forEach(sortStyles);
  }
}

function processFile(filePath) {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }

    const json = JSON.parse(data);
    sortStyles(json);

    fs.writeFile(filePath, JSON.stringify(json, null, 2), "utf8", (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return;
      }
      console.log(`Styles sorted successfully in ${filePath}`);
    });
  });
}

function traverseDirectory(directory) {
  fs.readdir(directory, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    for (const file of files) {
      const filePath = path.join(directory, file.name);
      if (file.isDirectory()) {
        traverseDirectory(filePath);
      } else if (
        file.isFile() &&
        (file.name === "skeleton.json" || file.name === "globals.json")
      ) {
        processFile(filePath);
      }
    }
  });
}

traverseDirectory(directoryPath);
