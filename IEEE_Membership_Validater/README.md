# IEEE Membership Bulk Validator

A Python script to bulk-validate IEEE memberships by automating POST requests to the IEEE membership validator service.

## Features

- Reads IEEE member numbers from Excel files
- Sends authenticated POST requests to validate memberships
- Parses HTML responses to extract membership details
- Includes rate limiting (0.7s delay between requests)
- Writes results to Excel output file
- Robust HTML parsing with multiple fallback strategies

## Installation

1. Install Python 3.7 or higher
2. Install required packages:

```bash
pip install -r requirements.txt
```

## Usage

### Basic Usage

```bash
python ieee_validator.py --cookie "your_cookie_value_here"
```

### Interactive Cookie Input

If you don't provide the cookie as an argument, the script will prompt you:

```bash
python ieee_validator.py
```

### Custom Input/Output Files

```bash
python ieee_validator.py --cookie "your_cookie" --input my_numbers.xlsx --output my_results.xlsx
```

## Input File Format

The input Excel file (`ieee_numbers.xlsx` by default) must contain a column named `ieee_number` with IEEE member numbers (8-9 characters) or email addresses.

Example:
| ieee_number |
|-------------|
| 01234567    |
| 12345678    |
| j.doe@email.com |

## Output Format

The output Excel file (`validated_output.xlsx` by default) contains the following columns:

- `ieee_number`: The member number that was validated
- `name_initials`: First and last name initials (e.g., "K. G.")
- `membership_status`: Membership status (e.g., "Active", "Inactive")
- `member_grade`: IEEE member grade (e.g., "Student Member", "Member")
- `standards_association_member`: Standards Association Member status ("Yes" or "No")
- `society_memberships`: Comma-separated list of society memberships
- `error`: Error message if validation failed (None if successful)

## Getting Your Cookie

1. Open your browser and navigate to https://services24.ieee.org/membership-validator.html
2. Log in if necessary
3. Open Developer Tools (F12)
4. Go to the Application/Storage tab → Cookies
5. Find the `PA.Global_Websession` cookie
6. Copy its value

## Notes

- The script includes a 0.7 second delay between requests to avoid rate limiting
- All requests use proper headers to mimic a browser
- The script handles errors gracefully and continues processing even if some validations fail
- HTML parsing uses multiple fallback strategies for robustness

## Requirements

- Python 3.7+
- requests
- beautifulsoup4
- pandas
- openpyxl
- lxml

