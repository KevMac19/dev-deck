# DEV_DECK: Advanced cURL Editor & Developer Tools

A premium, retro-styled developer productivity suite featuring a bidirectional cURL editor, authentication support, and code generation capabilities. Built with **React**, **Vite**, and **Tailwind CSS**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🚀 Features

### 🛠️ cURL Editor
- **Bidirectional Editing**: Paste raw cURL commands to visualize them, or use the visual builder to generate commands.
- **Robust Parsing**: Accurately parses Method, URL, Headers, Body, and Auth from raw strings.
- **Authentication Support**:
  - Basic Auth (Username/Password)
  - Bearer Token
- **Body Management**:
  - Support for `application/json`, `x-www-form-urlencoded`, and `multipart/form-data`.
  - **Key-Value Builder**: Visually edit JSON and Form data without worrying about syntax.
- **Request Flags**: Toggles for common flags like `--insecure` (`-k`), `--location` (`-L`), and `--compressed`.

### 🎨 Retro / Brutalist Design
- **Theme**: High-contrast dark mode inspired by terminal aesthetics and retro computing.
- **Typography**: Uses `JetBrains Mono` for a developer-first feel.
- **Tech Stack**:
  - **Framework**: React + Vite
  - **Styling**: Tailwind CSS (fully configured with design tokens)
  - **Icons**: Lucide React
  - **Routing**: React Router DOM (Multi-tool architecture)

## 📂 Project Structure

```
src/
├── features/           # Feature-based modules
│   └── curl/           # cURL Tool Logic
│       ├── editor/     # Visual Builder Components
│       ├── input/      # Raw Input Components
│       └── preview/    # Code Preview Components
├── components/         # Shared UI Components
├── context/            # Global State (CurlContext, ThemeContext)
├── layouts/            # Layout wrappers (DashboardLayout)
└── utils/              # Core Logic (curlManager.js)
```

## ⚡ Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/dev-deck.git
    cd dev-deck
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn
    ```

3.  **To Start Development Server**:
    ```bash
    npm run dev
    ```

4.  **To Build for Production**:
    ```bash
    npm run build
    ```

## 🔮 Future Roadmap
- [ ] **Code Generation**: Convert cURL to Python, JavaScript, Go, etc.
- [ ] **Request History**: Local storage persistence for recent requests.
- [ ] **JSON Formatter**: Dedicated tool for validating and formatting JSON.

## 📄 License
MIT
