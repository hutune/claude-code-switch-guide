# Claude Code + Antigravity — Hướng dẫn cài đặt & sử dụng

> Hướng dẫn thiết lập **Claude Code CLI** chạy qua **Antigravity proxy** (free, unlimited) và chuyển đổi nhanh với **Claude Team** (paid).
>
> Áp dụng cho: macOS · Claude Code v2.1+ · Antigravity Manager v4.0+

---

## Mục lục

1. [Yêu cầu](#1-yêu-cầu)
2. [Cài đặt Claude Code CLI](#2-cài-đặt-claude-code-cli)
3. [Cài đặt Antigravity Manager](#3-cài-đặt-antigravity-manager)
4. [Cấu hình chuyển đổi nhanh](#4-cấu-hình-chuyển-đổi-nhanh)
5. [Cách sử dụng](#5-cách-sử-dụng)
6. [Cách hoạt động](#6-cách-hoạt-động)
7. [Setup với IDE](#7-setup-với-ide)
8. [Troubleshooting](#8-troubleshooting)
9. [Tham khảo kỹ thuật](#9-tham-khảo-kỹ-thuật)

---

## 1. Yêu cầu

| Phần mềm | Phiên bản | Ghi chú |
|----------|-----------|---------|
| macOS | 13+ (Ventura) | Cần Keychain Access |
| Claude Code CLI | v2.1+ | Native binary (không phải NPM) |
| Antigravity Manager | v4.0+ | Proxy chạy tại `127.0.0.1:8045` |
| Python 3 | 3.8+ | Có sẵn trên macOS |
| Claude Team account | — | Chỉ cần nếu dùng mode `claude-real` |

---

## 2. Cài đặt Claude Code CLI

### Cài mới

```bash
# Cài native binary (khuyến nghị)
curl -fsSL https://claude.ai/install.sh | sh

# Kiểm tra
claude --version
```

### Login lần đầu

```bash
claude
# → /login → đăng nhập trên browser → quay lại terminal
# → /exit
```

> [!NOTE]
> Nếu chỉ dùng Antigravity (không có Claude Team), **bỏ qua bước login** — tiến thẳng đến mục 4.

---

## 3. Cài đặt Antigravity Manager

1. Tải Antigravity Manager từ [GitHub](https://github.com/lbjlaq/Antigravity-Manager)
2. Cài đặt và mở app
3. Đăng nhập tài khoản Antigravity
4. Đảm bảo proxy đang chạy (icon xanh trên menu bar)
5. Ghi nhận **API Key** từ Settings → API Key (format: `sk-...`)

### Kiểm tra proxy

```bash
curl http://127.0.0.1:8045/v1/models
# Phải trả về danh sách models
```

---

## 4. Cấu hình chuyển đổi nhanh

### Bước 1: Tạo script hỗ trợ

Tạo file `~/.claude-switch.py`:

```bash
cat > ~/.claude-switch.py << 'SCRIPT'
#!/usr/bin/env python3
"""Claude Code switch helper — quản lý .claude.json + macOS Keychain"""
import json, os, shutil, sys, subprocess

CLAUDE_JSON = os.path.expanduser('~/.claude.json')
CLAUDE_BACKUP = os.path.expanduser('~/.claude.json.backup')
KEYCHAIN_BACKUP = os.path.expanduser('~/.claude-keychain.bak')
KEYCHAIN_SERVICE = 'Claude Code-credentials'
KEYCHAIN_ACCOUNT = os.environ.get('USER', os.getlogin())

def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)

def keychain_get():
    r = run(['security', 'find-generic-password', '-s', KEYCHAIN_SERVICE,
             '-a', KEYCHAIN_ACCOUNT, '-w'])
    return r.stdout.strip() if r.returncode == 0 else None

def keychain_delete():
    run(['security', 'delete-generic-password', '-s', KEYCHAIN_SERVICE,
         '-a', KEYCHAIN_ACCOUNT])

def keychain_add(pw):
    run(['security', 'add-generic-password', '-s', KEYCHAIN_SERVICE,
         '-a', KEYCHAIN_ACCOUNT, '-w', pw])

mode = sys.argv[1] if len(sys.argv) > 1 else ''

if mode == 'anti':
    d = json.load(open(CLAUDE_JSON))
    if 'oauthAccount' in d:
        shutil.copy2(CLAUDE_JSON, CLAUDE_BACKUP)
        del d['oauthAccount']
    d['hasCompletedOnboarding'] = True
    json.dump(d, open(CLAUDE_JSON, 'w'), indent=2)
    pw = keychain_get()
    if pw:
        with open(KEYCHAIN_BACKUP, 'w') as f:
            f.write(pw)
        keychain_delete()
    print('OK')

elif mode == 'real':
    if os.path.exists(CLAUDE_BACKUP):
        shutil.copy2(CLAUDE_BACKUP, CLAUDE_JSON)
    else:
        d = json.load(open(CLAUDE_JSON))
        d['hasCompletedOnboarding'] = True
        json.dump(d, open(CLAUDE_JSON, 'w'), indent=2)
    if os.path.exists(KEYCHAIN_BACKUP):
        pw = open(KEYCHAIN_BACKUP).read().strip()
        if pw:
            keychain_delete()
            keychain_add(pw)
    print('OK')

else:
    print('Usage: claude-switch.py [anti|real]')
SCRIPT
```

### Bước 2: Thêm functions vào shell

Thêm vào cuối `~/.zshrc` (hoặc `~/.bashrc`):

```bash
cat >> ~/.zshrc << 'SHELL'

# ===== Claude Code Switch =====
# Chỉ cần /exit, KHÔNG cần /logout
unalias claude-anti claude-real 2>/dev/null

claude-anti() {
  python3 ~/.claude-switch.py anti
  cat > ~/.claude/settings.json << 'JSON'
{
  "env": {
    "ANTHROPIC_BASE_URL": "http://127.0.0.1:8045",
    "ANTHROPIC_API_KEY": "<THAY_BẰNG_API_KEY_CỦA_BẠN>"
  },
  "model": "claude-opus-4-6-thinking"
}
JSON
  echo '✅ Switched to Antigravity proxy'
  claude "$@"
}

claude-real() {
  python3 ~/.claude-switch.py real
  echo '{"model":"claude-opus-4-6-thinking"}' > ~/.claude/settings.json
  unset ANTHROPIC_API_KEY ANTHROPIC_BASE_URL
  echo '✅ Switched to Claude Team'
  claude "$@"
}
SHELL
```

> [!IMPORTANT]
> Nhớ thay `<THAY_BẰNG_API_KEY_CỦA_BẠN>` bằng API key từ Antigravity Manager.

### Bước 3: Load và chạy lần đầu

```bash
source ~/.zshrc
```

**Nếu có Claude Team account** — chạy 1 lần duy nhất để tạo backup:

```bash
claude-real
# Trong Claude Code → /login → đăng nhập browser → /exit
```

**Nếu chỉ dùng Antigravity** — bỏ qua bước trên, chạy luôn:

```bash
claude-anti
```

---

## 5. Cách sử dụng

### Chạy Antigravity (free)

```bash
claude-anti
```
Header: `claude-opus-4-6-thinking · API Usage Billing`

### Chạy Claude Team (paid)

```bash
claude-real
```
Header: `claude-opus-4-6-thinking · Claude Team`

### Chuyển đổi

```bash
# Đang dùng claude-anti, muốn đổi sang claude-real:
# Trong Claude Code → /exit
claude-real

# Đang dùng claude-real, muốn đổi sang claude-anti:
# Trong Claude Code → /exit
claude-anti
```

> [!CAUTION]
> **KHÔNG dùng `/logout`** khi chuyển đổi. Chỉ dùng **`/exit`**.  
> `/logout` sẽ xoá OAuth token, phải `/login` lại.

---

## 6. Cách hoạt động

### Kiến trúc

```
┌──────────────────────────────────────────────────────────────────┐
│                        claude-anti                               │
│  ┌────────────┐     ┌──────────────┐     ┌────────────────────┐ │
│  │ Claude Code │────▶│ Antigravity  │────▶│ Google Gemini /    │ │
│  │ CLI         │     │ Proxy :8045  │     │ Anthropic backends │ │
│  └────────────┘     └──────────────┘     └────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                        claude-real                                │
│  ┌────────────┐     ┌──────────────────┐                         │
│  │ Claude Code │────▶│ Anthropic API    │                         │
│  │ CLI         │     │ (api.anthropic   │                         │
│  └────────────┘     │  .com) — OAuth   │                         │
│                      └──────────────────┘                         │
└──────────────────────────────────────────────────────────────────┘
```

### 3 thành phần được quản lý

| Thành phần | File/Location | `claude-anti` | `claude-real` |
|-----------|--------------|--------------|--------------|
| API routing | `~/.claude/settings.json` | Set proxy URL + key | Xóa proxy |
| OAuth metadata | `~/.claude.json` | Xóa `oauthAccount` | Restore `oauthAccount` |
| OAuth token | macOS Keychain¹ | Backup → xóa | Restore từ backup |

¹ Service: `Claude Code-credentials`, Account: `<tên user macOS>`

### Backup files (tự động tạo)

| File | Nội dung |
|------|---------|
| `~/.claude.json.backup` | `.claude.json` với `oauthAccount` |
| `~/.claude-keychain.bak` | OAuth token từ Keychain |

---

## 7. Setup với IDE

Claude Code CLI tích hợp với IDE qua terminal tích hợp hoặc extension.

### Terminal (mọi IDE)

Mọi IDE có terminal tích hợp đều dùng được:

```bash
source ~/.zshrc     # Load functions (1 lần khi mở terminal mới)
claude-anti         # hoặc claude-real
```

### VS Code

1. Mở terminal (`Ctrl+\``)
2. Chạy `claude-anti` hoặc `claude-real`
3. Cài extension IDE (tùy chọn):
   ```
   # Trong Claude Code:
   /ide install
   ```

### Cursor

Giống VS Code — chạy trong terminal tích hợp. Cursor nhận diện Claude Code tự động.

### Windsurf / Zed / Neovim

Chạy trong terminal tích hợp hoặc terminal bên ngoài (iTerm2, Warp).

### Antigravity (IDE)

Antigravity Manager tự tạo kết nối WebSocket. Khi dùng `claude-anti`, Antigravity IDE giao tiếp qua:

```
Antigravity IDE ◄──WebSocket──► Claude Code CLI ──HTTP──► Proxy :8045
```

Lock file tự động tạo tại `~/.claude/ide/*.lock`:
```json
{
  "ideName": "Antigravity",
  "transport": "ws",
  "authToken": "<auto-generated>"
}
```

### SSH / Remote Server

Remote server không có macOS Keychain → chỉ dùng `claude-anti`.

**Option 1**: SSH Tunnel

```bash
# Từ máy local (đang chạy Antigravity):
ssh -R 8045:127.0.0.1:8045 user@remote-server

# Trên remote server:
claude-anti
```

**Option 2**: Chỉ dùng `settings.json` trực tiếp

```bash
# Trên remote server, tạo settings.json:
cat > ~/.claude/settings.json << 'EOF'
{
  "env": {
    "ANTHROPIC_BASE_URL": "http://127.0.0.1:8045",
    "ANTHROPIC_API_KEY": "<API_KEY>"
  },
  "model": "claude-opus-4-6-thinking"
}
EOF
claude
```

---

## 8. Troubleshooting

| Vấn đề | Nguyên nhân | Cách fix |
|--------|------------|---------|
| `defining function based on alias` | Alias cũ còn trong shell | `source ~/.zshrc` (đã có `unalias` tự xử lý) |
| Setup wizard xuất hiện | `hasCompletedOnboarding` bị reset | Script tự fix → chọn theme rồi dùng bình thường |
| `claude-real` hiện "API Usage Billing" | Keychain token bị mất (do `/logout`) | Chạy `claude` → `/login` → `/exit` → thử lại |
| `claude-anti` hiện "Claude Team" | Keychain chưa bị xóa | `source ~/.zshrc` → `claude-anti` lại |
| `curl: connection refused` | Antigravity proxy không chạy | Mở Antigravity Manager app |
| Model not available | Plan không hỗ trợ model | Đổi `model` trong settings.json |

### Reset hoàn toàn

Nếu mọi thứ rối, reset về trạng thái sạch:

```bash
# 1. Xóa backup files
rm -f ~/.claude.json.backup ~/.claude-keychain.bak

# 2. Xóa settings
echo '{}' > ~/.claude/settings.json

# 3. Mở Claude Code và login lại
claude
# → /login → đăng nhập → /exit

# 4. Giờ dùng bình thường
source ~/.zshrc
claude-anti   # hoặc claude-real
```

---

## 9. Tham khảo kỹ thuật

### Config Files

| File | Mục đích | Scope |
|------|----------|-------|
| `~/.claude/settings.json` | API URL, API key, model, env vars | Global runtime |
| `~/.claude.json` | OAuth account, preferences, onboarding | Global persistent |
| `~/.claude/ide/*.lock` | IDE detection, WebSocket transport | Runtime (per-IDE) |
| `~/.claude-switch.py` | Script chuyển đổi | Utility |

### Keychain Entry (macOS)

```
Service:  Claude Code-credentials
Account:  <macOS username>
Keychain: login.keychain-db
Password: {"claudeAiOauth":{"accessToken":"sk-ant-oat01-...", "refreshToken":"...", ...}}
```

### settings.json — Anti mode

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "http://127.0.0.1:8045",
    "ANTHROPIC_API_KEY": "sk-..."
  },
  "model": "claude-opus-4-6-thinking"
}
```

### settings.json — Real mode

```json
{
  "model": "claude-opus-4-6-thinking"
}
```

### Credential Storage (Cross-platform)

| Platform | Storage | Location |
|----------|---------|----------|
| **macOS** | Keychain | Service: `Claude Code-credentials` |
| **Windows** | File | `%USERPROFILE%\.claude\.credentials.json` |
| **Linux** | File | `~/.claude/.credentials.json` |

---

*Cập nhật: 2026-02-11*
