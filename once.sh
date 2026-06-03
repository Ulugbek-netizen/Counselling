#!/bin/bash
set -e

# Ensure issues/done exists
mkdir -p issues/done

# Read open issues (excludes done/)
issues=$(cat issues/*.md 2>/dev/null || echo "No issues found")

# Read recent commits
commits=$(git log -n 5 --format="%H%n%ad%n%B---" --date=short 2>/dev/null || echo "No commits found")

# Read prompt
prompt=$(cat ralph/prompt.md)

# Write to temp file to avoid shell escaping issues
tmpfile=$(mktemp)
cat > "$tmpfile" << HEREDOC
Previous commits:
$commits

Issues:
$issues

$prompt
HEREDOC

# Run Claude Code
claude --permission-mode acceptEdits "$(cat "$tmpfile")"

# Cleanup
rm -f "$tmpfile"
