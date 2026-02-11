# Claude Code Switch Guide

🔄 Chuyển đổi nhanh giữa **Antigravity proxy** (free) và **Claude Team** (paid) trong Claude Code CLI.

## Tính năng

- **`claude-anti`** — Chạy Claude Code qua Antigravity proxy (free, unlimited)
- **`claude-real`** — Chạy Claude Code qua Anthropic API trực tiếp (Claude Team)
- Chuyển đổi tức thì, chỉ cần `/exit` → gõ lệnh mới
- Header hiển thị đúng mode: "API Usage Billing" vs "Claude Team"
- Tự động backup/restore OAuth token qua macOS Keychain

## Quick Start

```bash
# 1. Tạo script hỗ trợ
curl -o ~/.claude-switch.py https://raw.githubusercontent.com/hutune/claude-code-switch-guide/main/claude-switch.py

# 2. Thêm functions vào shell (xem hướng dẫn chi tiết)

# 3. Dùng
claude-anti    # Antigravity (free)
claude-real    # Claude Team (paid)
```

## Hướng dẫn chi tiết

👉 [claude-code-switch-guide.md](./claude-code-switch-guide.md)

## Yêu cầu

- macOS 13+ (Ventura)
- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) v2.1+
- [Antigravity Manager](https://github.com/lbjlaq/Antigravity-Manager) v4.0+
- Python 3.8+

## License

MIT
