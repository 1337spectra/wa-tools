// Create a page for a new tool—a time and date converter—that accepts any date/time string as input,
// auto-detects its format, and converts it to ISO-8601 format. Display the converted ISO-8601 output,
// the detected input format syntax, and the output format syntax (YYYY-MM-DDTHH:mm:ssZ, etc.). Include
// a copy button for the converted timestamp. Use current, up-to-date packages to support input parsing
// and format detection. Ensure the tool's interface matches the jason-wrapper.html tool page, is
// user-friendly, and handles edge cases (e.g., ambiguous dates, missing times).

document.getElementById('convert-btn').addEventListener('click', () => {

    const dateInput = document.getElementById('dateInput').value.trim();
    const isoOutput = document.getElementById('iso-output');
    const inputFormat = document.getElementById('input-format');
    const outputFormat = document.getElementById('output-format');

    // List of common date/time formats to try
    const formats = [
        // ISO
        "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
        "yyyy-MM-dd'T'HH:mm:ssxxx",
        "yyyy-MM-dd'T'HH:mm:ss",
        "yyyy-MM-dd'T'HH:mm",
        "yyyy-MM-dd HH:mm:ss",
        "yyyy-MM-dd HH:mm",
        "yyyy-MM-dd",
        // US
        "MM/dd/yyyy HH:mm:ss",
        "MM/dd/yyyy HH:mm",
        "MM/dd/yyyy h:mm a",
        "MM/dd/yyyy",
        // EU
        "dd/MM/yyyy HH:mm:ss",
        "dd/MM/yyyy HH:mm",
        "dd/MM/yyyy h:mm a",
        "dd/MM/yyyy",
        // Dots
        "dd.MM.yyyy HH:mm:ss",
        "dd.MM.yyyy HH:mm",
        "dd.MM.yyyy",
        // Dashes
        "dd-MM-yyyy HH:mm:ss",
        "dd-MM-yyyy HH:mm",
        "dd-MM-yyyy",
        // Month name
        "MMMM d, yyyy h:mm a",
        "MMMM d, yyyy HH:mm",
        "MMMM d, yyyy",
        "d MMMM yyyy HH:mm",
        "d MMMM yyyy h:mm a",
        "d MMMM yyyy",
        // Short month
        "MMM d, yyyy h:mm a",
        "MMM d, yyyy HH:mm",
        "MMM d, yyyy",
        "d MMM yyyy HH:mm",
        "d MMM yyyy h:mm a",
        "d MMM yyyy",
        // Day of week
        "eeee, MMMM d, yyyy h:mm a",
        "eeee, MMMM d, yyyy",
        "eeee, d MMMM yyyy",
        // Time only
        "HH:mm:ss",
        "HH:mm",
        "h:mm a",
    ];

    function tryParse(input) {
        // Try ISO first
        let parsed = dateFns.parseISO(input);
        if (dateFns.isValid(parsed)) {
            return { date: parsed, format: "ISO 8601" };
        }
        // Try all formats
        for (let fmt of formats) {
            parsed = dateFns.parse(input, fmt, new Date());
            if (dateFns.isValid(parsed)) {
                return { date: parsed, format: fmt };
            }
        }
        return null;
    }

    if (dateInput) {
        const result = tryParse(dateInput);
        if (result) {
            isoOutput.value = result.date.toISOString();
            outputFormat.value = "YYYY-MM-DDTHH:mm:ss.sssZ";
            inputFormat.value = result.format;
        } else {
            isoOutput.value = 'Invalid date format';
            inputFormat.value = 'Could not detect format';
            outputFormat.value = "YYYY-MM-DDTHH:mm:ssZ";
        }
    } else {
        isoOutput.value = '';
        inputFormat.value = '';
        outputFormat.value = "YYYY-MM-DDTHH:mm:ssZ";
    }
});

