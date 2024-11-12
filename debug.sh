#!/bin/bash

# Check if a folder path is provided
if [ -z "$1" ]; then
  echo "Usage: bash debug.sh <relative-folder-path>"
  exit 1
fi

# Assign the provided path to a variable
TARGET_FOLDER=$1

# Execute the command with the provided folder path
rm .gpt.txt && find "$TARGET_FOLDER" -type d \( -name .git -o -name node_modules \) -prune -o -type f ! -name '*.lock' -exec sh -c 'echo "=== {} ===" >> .gpt.txt; cat "{}" >> .gpt.txt' \;
