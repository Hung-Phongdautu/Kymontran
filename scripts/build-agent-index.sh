#!/bin/bash
# Tạo .claude/agents-index.md: danh bạ toàn bộ agent trong ~/.claude/agents (nhóm theo lĩnh vực)
# để lệnh /giao-viec chọn đúng người. Chạy lại khi bộ agent thay đổi.
set -e
SRC="${1:-$HOME/.claude/agents}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/.claude/agents-index.md"
{
  echo "# Danh bạ agent ($(ls "$SRC"/*.md | wc -l) agent)"
  echo
  echo "Tên trong cột **subagent_type** là giá trị truyền nguyên văn cho Agent tool."
  for group in $(ls "$SRC"/*.md | xargs -n1 basename | sed 's/-.*//' | sort -u); do
    echo; echo "## $group"; echo
    echo "| subagent_type | Chuyên môn |"; echo "|---|---|"
    for f in "$SRC"/"$group"-*.md "$SRC"/"$group".md; do
      [ -f "$f" ] || continue
      name=$(sed -n 's/^name: *//p' "$f" | head -1)
      desc=$(sed -n 's/^description: *//p' "$f" | head -1 | tr '|' '/' | cut -c1-180)
      echo "| $name | $desc |"
    done
  done
} > "$OUT"
echo "Đã ghi $OUT"
