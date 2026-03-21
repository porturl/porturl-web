#!/bin/sh

# Exit immediately if a command exits with a non-zero status.
set -e

# Path to the build artifact template (read-only in immutable container)
TEMPLATE_FILE=/usr/share/nginx/html/env.template.js

# Writable location for runtime config (typically a tmpfs mount)
OUTPUT_FILE=/tmp/env.js

# Use 'envsubst' to substitute the value of '${API_URL}' in the template
# and create the final env.js file in a writable directory.
# Note: Only variables with the format ${VAR} or $VAR will be substituted.
if [ -f "$TEMPLATE_FILE" ]; then
    echo "--- Substituting environment variables in ${TEMPLATE_FILE} to ${OUTPUT_FILE} ---"
    envsubst '${API_URL} ${CLIENT_ID}' < "$TEMPLATE_FILE" > "$OUTPUT_FILE"

    # For debugging: Print the content of the generated file to the container logs.
    cat "${OUTPUT_FILE}"
    echo "---------------------------------"
else
    echo "--- Skipping envsubst: ${TEMPLATE_FILE} not found ---"
    # Ensure OUTPUT_FILE exists to avoid Nginx errors if the template is missing
    touch "${OUTPUT_FILE}"
fi

# The original Nginx entrypoint will now be called, starting the web server.
