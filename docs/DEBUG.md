# Debugging Guide

This guide outlines how to generate a consolidated `.gpt.txt` file containing the contents of your project files, excluding `node_modules`, `.git` directories, and `.lock` files. This file can help quickly review the project structure and its source code in a single file for debugging purposes.

## Prerequisites

- Ensure you have `bash` installed to run the debug script.
- This setup uses a custom shell script (`debug.sh`) and a `Makefile` command for convenient usage.

## How It Works

The `debug.sh` script takes a folder path as an argument and generates a `.gpt.txt` file containing the contents of all files within the specified folder. The script excludes `node_modules`, `.git`, and any `.lock` files from the output.

### Example Command

```bash
bash debug.sh src
```

This command will generate `.gpt.txt` with content from all files in the `src` folder, excluding `node_modules` and `.git` directories and `.lock` files.

## Using the Makefile for Debugging

For convenience, a `Makefile` command, `make debug`, allows you to run the debug script without directly calling `bash debug.sh`. Instead, you can specify the folder path by passing a variable to the `make` command.

### Makefile Usage

```bash
make debug path=src
make debug path=src/routes
```

### Makefile Command Explanation

- `make debug path=<folder-path>`: This command runs the `debug.sh` script with the specified folder path. Replace `<folder-path>` with the relative path of the folder you want to inspect.
  
### Output

The `.gpt.txt` file will be created in the project’s root directory and will contain the concatenated contents of all files in the specified directory, organized by file paths. For example:

```plaintext
=== ./src/app.js ===
<content of app.js>

=== ./src/routes/authRoutes.js ===
<content of authRoutes.js>
```

## Example Workflow

1. Run `make debug path=src` to generate `.gpt.txt` for the `src` directory.
2. Open `.gpt.txt` to review the contents of all source files in `src`.

## Additional Notes

- chatGPT zindabad