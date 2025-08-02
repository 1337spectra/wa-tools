---
applyTo: '**'
---
Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.

# Copilot Instructions for wa-tools

Create a page for a new tool—a time and date converter—that accepts any date/time string as input, auto-detects its format, and converts it to ISO-8601 format. Display the converted ISO-8601 output, the detected input format syntax, and the output format syntax (`YYYY-MM-DDTHH:mm:ssZ`, etc.). Include a copy button for the converted timestamp. Use current, up-to-date packages to support input parsing and format detection. Ensure the tool's interface matches the `jason-wrapper.html` tool page, is user-friendly, and handles edge cases (e.g., ambiguous dates, missing times).

Follow these steps:
1. Accept user input for a date/time string in any format.
2. Internally auto-detect the input format syntax (e.g., `dddd, mmmm dd, yyyy`, `h:mm a - MMMM dd, yyyy`, etc.).
3. Convert the date/time to ISO-8601 and display:
    - The converted ISO-8601 string.
    - The original input format syntax.
    - The output ISO-8601 format syntax (e.g., `YYYY-MM-DDTHH:mm:ssZ`).
4. Provide a copy-to-clipboard button for the ISO-8601 output.
5. Use up-to-date, widely supported packages (e.g., date-fns) for date detection and conversion.
6. Ensure robust handling of various date formats and ambiguity (e.g., “03/04/2023”).
7. Copy the user interface from the `jason-wrapper.html` tool page as a template.

EXAMPLE:

**User Input:**
"Sunday, 25 June 2023 3:45 PM"

**Displayed Output:**
- **ISO-8601:** 2023-06-25T15:45:00Z
- **Input format detected:** dddd, dd MMMM yyyy h:mm A
- **Output format syntax:** YYYY-MM-DDTHH:mm:ssZ
- [Copy to Clipboard button]

(For real-world usage, the UI and logic sections would include more detailed code and additional checks; placeholders can be used where code would be.)

**REMINDER:**
Be sure to provide:
- The detected input format syntax
- The ISO-8601 output and its format syntax
- A copy button for the result
- Specification for package usage and UI behaviors

---
For new tools or changes, follow the patterns above for consistency. If unsure, reference the most similar existing tool.
