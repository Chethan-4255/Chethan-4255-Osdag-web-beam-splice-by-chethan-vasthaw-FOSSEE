# Osdag-Web: Beam Splice End Plate Module (FOSSEE Screening Task)

## Introduction

This repository contains the development work for a **Beam Splice End Plate connection module** implemented within the **Osdag-Web** framework. This project was undertaken as part of the screening task for the **FOSSEE Summer Fellowship 2024 at IIT Bombay**.

Developed by **Chethan Vasthaw Tippani**, a high school student passionate about web development, Python, and applying technology to solve real-world engineering challenges.

**Osdag (Open Steel Design and Graphics)** is a free and open-source software for steel structure design according to Indian standards. Osdag-Web aims to bring this functionality to a web-based platform.

This specific module provides a user interface and a backend API endpoint to simulate the design process for a Beam-to-Beam Splice connection using an End Plate.

## Features

*   **Frontend UI (React):** A three-column user interface built with React (using Vite) for inputting design parameters.
    *   Logically grouped input fields for Member Details, Loads, Plate, and Bolts.
    *   Reusable components (`Dropdown`, `NumberInput`) for cleaner code.
    *   Client-side validation (e.g., preventing negative numbers).
    *   Dynamic updates based on backend responses.
*   **Backend API (Django REST Framework):** A Django API endpoint (`/api/beam-splice-design/`) built using `APIView`.
    *   Accepts POST requests with design parameters.
    *   Performs basic validation on inputs.
    *   *Simulates* design calculations, providing results that change based on input values (Shear Force, Plate Thickness, Bolt Diameter).
    *   Determines a 'Pass'/'Fail' status based on simulated checks.
    *   Returns structured JSON responses (status, message, results, visualization data).
*   **Integration:** Smooth communication between frontend and backend using Axios and Vite's proxy configuration.
*   **Basic Visualization:** A dynamic SVG representation in the UI that updates based on calculated results (e.g., number of bolts, spacing).

## Prerequisites

Before you begin, ensure you have the following installed on your system (Windows assumed based on chat history):

*   **Anaconda:** For Python 3.8 environment management. ([Download](https://www.anaconda.com/download))
*   **Python:** Version 3.8.x (usually included with Anaconda).
*   **PostgreSQL:** Version 15 or later recommended. ([Download](https://www.postgresql.org/download/))
    *   **pgAdmin 4:** Typically installed with PostgreSQL, used for database management.
*   **Node.js:** Version 18.x or later recommended. ([Download](https://nodejs.org/))
*   **Git:** For cloning the repository. ([Download](https://git-scm.com/downloads))
*   **Visual Studio Build Tools:** Required on Windows for compiling certain Python packages (like `pycosat`). ([Download](https://visualstudio.microsoft.com/visual-cpp-build-tools/)). During installation, select:
    *   C++ Build Tools
    *   Windows SDK (10 or later)
    *   MSVC (v142 or later)

## Setup and Installation

1.  **Clone the Repository:**
    ```bash
    git clone <your-repository-url> # Replace with your GitHub repo URL
    cd Osdag-web # Or your repository folder name
    ```

2.  **Checkout Branch:** (If applicable, based on the original task)
    ```bash
    git checkout winter24
    ```

3.  **Create Conda Environment:** Open Anaconda Prompt.
    ```bash
    conda create -n osdag python=3.8 -y
    conda activate osdag
    ```

4.  **Install Python Dependencies:** (Ensure VS Build Tools are installed first)
    ```bash
    pip install -r requirements.txt
    conda install -c conda-forge pythonocc-core
    pip install pylatex typing-extensions
    ```
    *Note: If `pip install -r requirements.txt` fails on `pycosat`, ensure VS Build Tools are correctly installed and potentially restart your PC.*

5.  **Apply `_Protocol` Fix:** This is crucial for compatibility.
    *   Open the file: `osdag_api/module_finder.py`
    *   Find the line (around line 4):
        ```python
        from typing import Dict, Any, List, _Protocol
        ```
    *   Replace it with these two lines:
        ```python
        from typing import Dict, Any, List
        from typing_extensions import Protocol as _Protocol
        ```
    *   Save the file.

6.  **Setup PostgreSQL Database:**
    *   Open Command Prompt or PowerShell **as Administrator**.
    *   Log in to PostgreSQL (you might need to navigate to PostgreSQL's `bin` directory or have it in your PATH):
        ```bash
        psql -U postgres
        ```
    *   Enter your PostgreSQL superuser password when prompted.
    *   Execute the following SQL commands (replace `'your_postgres_password'` with the password you set during PostgreSQL installation):
        ```sql
        CREATE ROLE osdagdeveloper PASSWORD 'your_postgres_password' SUPERUSER CREATEDB CREATEROLE INHERIT REPLICATION LOGIN;
        CREATE DATABASE "postgres_Intg_osdag" WITH OWNER osdagdeveloper;
        \q
        ```

7.  **Configure Database Credentials:**
    *   Edit the following three files in the project root:
        *   `osdag_web/settings.py`
        *   `populate_database.py`
        *   `update_sequences.py`
    *   In each file, find the `DATABASES['default']` dictionary and update the `PASSWORD` field to match the password you used when creating the `osdagdeveloper` role (e.g., `'your_postgres_password'`). Ensure `USER`, `NAME`, `HOST`, and `PORT` are also correct (`osdagdeveloper`, `postgres_Intg_osdag`, `localhost`, `5432` respectively).

8.  **Initialize Database:** (In Anaconda Prompt, in the project root, with the `osdag` environment active)
    ```bash
    python populate_database.py
    python update_sequences.py
    python manage.py migrate
    ```
    *Note: Ensure the `_Protocol` fix (Step 5) is done *before* running `migrate`.*

9.  **Install Frontend Dependencies:**
    ```bash
    cd osdagclient
    npm install
    cd ..
    ```

## Running the Application

You need to run two servers simultaneously in separate terminals.

1.  **Backend Server (Django):**
    *   Open **Anaconda Prompt**.
    *   Navigate to the project root directory (`Osdag-web`).
    *   Activate the environment: `conda activate osdag`
    *   Run the server: `python manage.py runserver 8000`

2.  **Frontend Server (React/Vite):**
    *   Open a **new, separate terminal** (Command Prompt, PowerShell, VS Code terminal, etc.).
    *   Navigate to the frontend directory: `cd osdagclient`
    *   Run the development server: `npm run dev`

## Usage

1.  Once both servers are running, open your web browser.
2.  Navigate to: `http://localhost:5173/beam-splice`
3.  You should see the Beam Splice End Plate module interface.
4.  Modify the input parameters in the left column as desired (e.g., Shear Force, Bolt Diameter, Plate Thickness).
5.  Click the **"Design"** button.
6.  Observe the **Output** column updating with the design status ("Pass" or "Fail") and simulated results.
7.  Observe the **Visualization** column updating its basic SVG representation based on the results.
8.  Use the **"Reset"** button to clear inputs and outputs back to default values.

## Technology Stack

*   **Backend:** Python, Django, Django REST Framework, PostgreSQL
*   **Frontend:** React, JavaScript, CSS, Vite, Axios
*   **Environment:** Anaconda
