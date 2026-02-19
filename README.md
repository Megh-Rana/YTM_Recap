# diy-ytm-recap: Your Private YouTube Music Year in Review

![Midnight Lux Theme](https://via.placeholder.com/800x400/000000/3B82F6?text=Midnight+Lux+Theme) <!-- Replace with actual screenshot if available -->

A privacy-focused, client-side application that generates a beautiful, interactive recap of your YouTube Music listening history. Inspired by Spotify Wrapped, but fully private and available anytime.

## 🌟 Features

*   **100% Client-Side**: Your data never leaves your browser. All processing happens locally.
*   **"Midnight Lux" Design**: A sleek, dark-mode interface inspired by Nike After Dark, featuring deep blacks and vibrant "Hyper Blue" accents.
*   **Comprehensive Stats**:
    *   Top Artists & Songs
    *   Total Listening Time (with realistic duration fetching)
    *   Monthly Listening Trends
    *   Peak Listening Hours
    *   Album Affinity
*   **Drag & Drop**: Simply upload your Google Takeout ZIP file.

## 🚀 Getting Started

### Prerequisites

*   Node.js (v16+)
*   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/diy-ytm-recap.git
    cd diy-ytm-recap
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

4.  Open your browser at `http://localhost:5173`.

## 📂 How to Get Your Data

1.  Go to [Google Takeout](https://takeout.google.com).
2.  Deselect all, then select **YouTube and YouTube Music**.
3.  Click "Multiple formats" and ensure **history** is set to **JSON**.
4.  Export and download the ZIP file.
5.  Drop the ZIP file into the app!

## 🛠️ Tech Stack

*   **Vite**: Fast build tool and dev server.
*   **React**: UI library.
*   **JSZip**: Client-side ZIP file extraction.
*   **PapaParse** / Native JSON: Data parsing.
*   **CSS Modules**: Component-scoped styling.

## 🎨 Theme: Midnight Lux

The UI follows a rigid "Midnight Lux" design system:
*   **Background**: Pure Black (`#000000`) & Charcoal (`#0a0a0a`).
*   **Primary Accent**: Hyper Blue (`#3B82F6`).
*   **Typography**: *Outfit* for headers, *Inter* for body text.

## 📄 License

MIT License. Feel free to fork and modify!
