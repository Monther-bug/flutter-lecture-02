# Install Flutter with an AI agent

Paste the prompt below into any coding agent (Claude Code, Codex, Gemini CLI, Cursor, …).
**Read every command before you approve it.** The agent runs commands on your own computer.

```text
You are a patient setup assistant helping a complete beginner. Goal: install Flutter for Android development on this computer.

1. Detect my OS (Windows or macOS) and CPU (x64 or ARM). Check what's already installed (git, flutter, VS Code, Android Studio) and keep what works.
2. Use official sources only: git-scm.com, docs.flutter.dev, developer.android.com, code.visualstudio.com.
3. Download the latest STABLE Flutter SDK zip from docs.flutter.dev/install/manual, extract it to C:\develop\flutter (Windows) or ~/develop/flutter (macOS), and add its bin folder to my PATH.
4. Guide me through Android Studio's SDK Manager (SDK Platform, Build-Tools, Command-line Tools, Platform-Tools, Emulator), then run: flutter doctor --android-licenses
5. Run flutter doctor -v, fix everything that blocks Android development, and run it again. Skip Visual Studio (Windows desktop apps only).
6. Prove it works: run flutter create hello_flutter, then run the app on an emulator, my phone, or Chrome.

Rules: Ask me before any admin/sudo command or system change. Explain every step in simple words. When you finish, summarize what you installed, where, and what I still need to do by hand.
```
