#!/bin/bash
URL=${1:-http://localhost:3000}
OUTFILE="scripts/smoke-result.txt"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $URL || echo 0)
if [ "$STATUS" -eq 200 ]; then
  echo "$(date -u) - SMOKE PASSED - $URL returned $STATUS" | tee $OUTFILE
  exit 0
else
  echo "$(date -u) - SMOKE FAILED - $URL returned $STATUS" | tee $OUTFILE
  exit 1
fi
