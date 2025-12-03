#!/usr/bin/env bash
#
# Check Knip ignore review dates
#
# Parses @knip-review-by: YYYY-MM-DD comments in knip.ts and fails
# if any review date is in the past.
#
# Usage: ./scripts/check-knip-reviews.sh
# Exit codes:
#   0 - All review dates are today or in the future
#   1 - One or more review dates are overdue (in the past)
#   2 - No review dates found (misconfiguration)
#   3 - knip.ts file not found

set -euo pipefail

KNIP_FILE="knip.ts"

# Fail fast if knip.ts doesn't exist
if [[ ! -f "$KNIP_FILE" ]]; then
  echo "ERROR: File '$KNIP_FILE' not found or is not a regular file."
  echo "This script must be run from the project root directory."
  exit 3
fi

TODAY=$(date +%Y-%m-%d)
OVERDUE=()
FOUND=0

echo "Checking Knip ignore review dates..."
echo "Today: $TODAY"
echo ""

while IFS= read -r line; do
  if [[ $line =~ @knip-review-by:\ ([0-9]{4}-[0-9]{2}-[0-9]{2}) ]]; then
    REVIEW_DATE="${BASH_REMATCH[1]}"
    FOUND=$((FOUND + 1))

    if [[ "$REVIEW_DATE" < "$TODAY" ]]; then
      OVERDUE+=("$REVIEW_DATE")
      echo "OVERDUE: Review date $REVIEW_DATE has passed"
    else
      echo "OK: Review date $REVIEW_DATE is today or in the future"
    fi
  fi
done < "$KNIP_FILE"

echo ""

if [[ $FOUND -eq 0 ]]; then
  echo "ERROR: No @knip-review-by dates found in $KNIP_FILE"
  echo "Each ignoreDependencies group must have a review date."
  exit 2
fi

echo "Found $FOUND review date(s)"

if [[ ${#OVERDUE[@]} -gt 0 ]]; then
  echo ""
  echo "ERROR: ${#OVERDUE[@]} review date(s) are overdue!"
  echo "Please review the ignored dependencies in $KNIP_FILE and either:"
  echo "  1. Remove dependencies that are no longer needed"
  echo "  2. Update the @knip-review-by date after verification"
  exit 1
fi

echo "All review dates are current."
exit 0
