/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");

// Function to copy .env file to a destination folder
const copyEnvFile = (source, destination) => {
  const destPath = path.join(destination, ".env");
  fs.copyFile(source, destPath, (err) => {
    if (err) {
      console.error(`Error copying .env to ${destination}:`, err);
    } else {
      console.log(`.env copied to ${destination}`);
    }
  });
};

console.log(
  "Current device environment: ",
  process.env.NODE_ENV || "development",
);
// Path to the root .env file
const rootEnvPath = path.join(
  __dirname,
  process.env.NODE_ENV === "production"
    ? ".env.production.local"
    : ".env.local",
);

// Check if the root .env file exists
if (!fs.existsSync(rootEnvPath)) {
  console.error("No .env file found in the root directory.");
  process.exit(1);
}

// Path to the packages directory
const packagesDir = path.join(__dirname, "packages");

// Read the packages directory
fs.readdir(packagesDir, (err, folders) => {
  if (err) {
    console.error("Error reading packages directory:", err);
    process.exit(1);
  }

  // Iterate over each folder in the packages directory
  folders.forEach((folder) => {
    const folderPath = path.join(packagesDir, folder);

    // Check if the folder is indeed a directory
    if (fs.lstatSync(folderPath).isDirectory()) {
      copyEnvFile(rootEnvPath, folderPath);
    }
  });
});
