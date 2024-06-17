````markdown
# Lanv Teacher

Lanv Teacher is a project for the Generative AI Agents Developer Contest by NVIDIA and LangChain. This project consists of a backend (be) and a frontend (fe), designed to provide a comprehensive AI-driven teaching platform.

## Table of Contents

- [Installation](#installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [License](#license)

## Installation

### Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/yourusername/lanv-teacher.git
cd lanv-teacher
```
````

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd be
   ```
2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```
3. Activate the virtual environment:
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```
4. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd fe
   ```
2. Install the required packages:
   ```bash
   npm install
   ```

## Environment Variables

Create a `.env` file in the `be` directory and add the following variables:

```env
NVIDIA_API_KEY=your_nvidia_api_key
LANGCHAIN_TRACING_V2=true
NVIDIA_MODEL=mistralai/mixtral-8x7b-instruct-v0.1
LANGCHAIN_TRACING_V2=false
LANGCHAIN_PROJECT=""
```

To obtain your `NVIDIA_API_KEY`, visit [NVIDIA Developer Portal](https://build.nvidia.com/explore/discover).

Ensure you use the exact model specified in the `NVIDIA_MODEL` variable.

## Running the Project

### Backend

To run the backend, navigate to the `be` directory and execute:

```bash
python main.py
```

### Frontend

To run the frontend, navigate to the `fe` directory and execute:

```bash
npm start
```

After starting both the backend and frontend, the project should be up and running successfully.

## License

This project is licensed under the MIT License.

```

This README provides clear instructions on setting up and running the Lanv Teacher project, including the necessary environment variables and their setup, aimed at ensuring a smooth start for developers.
```
