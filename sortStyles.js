const fs = require("node:fs");
const path = require("node:path");

const directoryPath = path.join(process.cwd(), "routes");

function sortStyles(obj) {
  if (obj.style && typeof obj.style === "string") {
    const styles = obj.style
      .split(";")
      .filter(Boolean)
      .map((style) => style.trim());
    styles.sort((a, b) => a.localeCompare(b));
    obj.style = `${styles.join("; ")};`;
  }

  if (obj.children && Array.isArray(obj.children)) {
    obj.children.forEach(sortStyles);
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
