# PDF QR Sharer

PDF QR Sharer is a simple full-stack web application that allows you to upload PDF files and generates a QR code for easy sharing and access across devices on the same Local Area Network (LAN). The application is designed to work offline within your LAN, making it convenient for sharing documents without internet access.

## Features

*   **Upload PDF files:** Easily upload PDF documents through a web interface.
*   **QR Code Generation:** Automatically generates a QR code for the uploaded PDF.
*   **LAN Access:** The QR code links to the PDF served by a local backend server, accessible from any device on the same LAN.
*   **Serves PDFs Locally:** Uploaded PDFs are stored and served by the backend server.
*   **Works Offline:** Fully functional within a LAN environment without needing an active internet connection (after initial setup).
*   **Print QR Code:** Button to print the generated QR code and its associated link for physical sharing or record-keeping.
*   **Tagging:** Optionally add a text tag to uploaded PDFs, which is displayed with the QR code and link, and included in the printed output.
*   **File Listing:** View a list of all uploaded PDF files, including their filenames, tags, links, and upload dates.
*   **Search:** Search for uploaded files by their filename using a search input field above the file list.
*   **Tag Filtering:** Filter the file list by tags using a filter input field above the file list.

## Prerequisites

*   Node.js (which includes npm) must be installed on your system. You can download it from [nodejs.org](https://nodejs.org/).

## Setup and Installation

1.  **Clone the repository** (or download and extract the files):
    ```bash
    git clone <repository-url>
    cd pdf-qr-sharer
    ```

2.  **Install dependencies:**
    You need to install dependencies for the root project, the backend, and the frontend separately.

    *   **Root project dependencies:**
        Navigate to the root `pdf-qr-sharer` directory and run:
        ```bash
        npm install
        ```

    *   **Backend dependencies:**
        Navigate to the `backend` directory:
        ```bash
        cd backend
        npm install
        cd .. 
        ```
        Alternatively, from the root directory:
        ```bash
        npm install --prefix backend
        ```

    *   **Frontend dependencies:**
        Navigate to the `frontend/pdf-uploader-ui` directory:
        ```bash
        cd frontend/pdf-uploader-ui
        npm install
        cd ../.. 
        ```
        Alternatively, from the root directory:
        ```bash
        npm install --prefix frontend/pdf-uploader-ui
        ```

    **Note:** Running `npm install` in the root directory *only* installs dependencies for the root `package.json` (which includes `concurrently` for running both parts of the app). It does not automatically install dependencies for the backend or frontend workspaces.

## Running the Application

1.  **Navigate to the root `pdf-qr-sharer` directory.**
    If you're not already there:
    ```bash
    cd path/to/pdf-qr-sharer
    ```

2.  **Start the application:**
    Run the `dev` script using npm:
    ```bash
    npm run dev
    ```

3.  **How it works:**
    *   This command uses `concurrently` to start both the backend server and the frontend development server.
    *   **Backend:** The Express.js server will typically start on `http://localhost:3001`. It will also log the server's IP address and port to the console (e.g., `Server is running on http://192.168.1.X:3001`). This IP address is what other devices on your LAN will use to access the PDFs via the QR code.
    *   **Frontend:** The React (Vite) development server will typically start on `http://localhost:5173` (or another port if 5173 is busy). Your browser might open automatically to this address, or you can navigate to it manually.

4.  **Accessing the application:**
    *   Open your web browser and go to the frontend URL (e.g., `http://localhost:5173`) to use the PDF uploader.
    *   Once a PDF is uploaded, a QR code will be displayed. Scan this QR code with another device (e.g., a smartphone or tablet) on the same LAN to view the PDF.
    *   Below the QR code display area, a list of previously uploaded files will be shown. You can use the input fields above this list to search by filename or filter by tag.

## How it Works

1.  The user selects a PDF file using the frontend interface and optionally enters a text tag.
2.  The PDF and the tag are sent to the backend server when the user clicks "Upload."
3.  The backend saves the PDF to the `pdf-qr-sharer/backend/uploads/` directory.
4.  The backend generates a unique URL pointing to the saved PDF (using its local IP address and port).
5.  The backend generates a QR code image from this URL.
6.  Metadata about the uploaded file (including ID, filename, tag, PDF URL, QR code URL, and timestamp) is stored in a JSON file on the server.
7.  The backend sends the PDF URL, the QR code data (as a data URL), and the tag back to the frontend.
8.  The frontend displays the QR code image, the direct link to the PDF, and the tag.
9.  The frontend also fetches and displays a list of all uploaded files. Users can interact with search and filter inputs to refine this list.
10. The user can then scan the QR code with any device on the same LAN to download or view the PDF, or use the "Print QR Code" button to print this information, including the tag.

## Folder Structure

*   `/` (root `pdf-qr-sharer` directory)
    *   `package.json`: Manages overall project scripts, including `concurrently` to run both backend and frontend.
    *   `README.md`: This file.
*   `/backend`
    *   `package.json`: Manages backend dependencies (Express, multer, qrcode, ip, uuid, cors).
    *   `index.js`: The main Express.js server file. Handles file uploads, QR code generation, serving PDFs, and listing file metadata.
    *   `db.js`: Contains helper functions to read from and write to the JSON database file.
    *   `uploads-db.json`: (Created at runtime if not present) A JSON file used to store metadata (ID, filename, tag, URLs, timestamp) about uploaded PDF files. **This file is included in `backend/.gitignore` and is not intended for version control with user data.**
    *   `/uploads`: (Created at runtime) Directory where uploaded PDF files are stored.
*   `/frontend/pdf-uploader-ui`
    *   `package.json`: Manages frontend dependencies (React, Vite).
    *   `/src`: Contains the React application source code.
        *   `App.jsx`: The main React component for the UI.
        *   `/components`: Contains reusable UI components (FileUploadForm, QRCodeDisplay, ErrorMessage, FileList).
    *   `vite.config.js`: Vite configuration file.
    *   `index.html`: The main HTML file for the React application.

## Data Storage

The application uses a simple JSON file (`uploads-db.json`) located in the `pdf-qr-sharer/backend/` directory to store metadata about the uploaded PDF files. This includes:
*   A unique ID for each entry (generated using UUID).
*   The original filename of the PDF.
*   The stored filename (currently same as original).
*   The accessible URL for the PDF.
*   The data URL for the generated QR code.
*   The optional tag provided by the user.
*   An ISO timestamp of when the file was uploaded.

This `uploads-db.json` file is automatically created by the application if it doesn't exist. It is listed in the `pdf-qr-sharer/backend/.gitignore` file, meaning it's not intended to be committed to version control once it contains user-specific data. This prevents accidental sharing of personal file lists while allowing an empty or template version to be part of the initial repository structure if desired.
