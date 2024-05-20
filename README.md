# Sleep Tracker API

This project provides a RESTful API for tracking sleep records. Users can add, retrieve, and delete sleep records.

## Setup

### Prerequisites

- Node.js (v14.x or later)
- MongoDB (local or cloud instance)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/sleep-tracker-api.git
    cd sleep-tracker-api
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up environment variables:

    Create a `.env` file in the root directory and add the following variables:

    ```env
    PORT=3000
    MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.qjn3mju.mongodb.net/storeDB
    ```

    Replace `mongodb+srv://<username>:<password>@cluster0.qjn3mju.mongodb.net/storeDB` with your MongoDB connection string.

### Running the API

1. Start the server:

    ```bash
    npm start
    ```

2. The server will start on `http://localhost:3000`.

## Live API

You can access the live version of the API at: [Sleep Tracker API](https://sleep-tracker-api-1.onrender.com)

## API Endpoints

### 1. Add a New Sleep Record

- **URL:** `/sleep`
- **Method:** `POST`
- **Request Body:**

    ```json
    {
      "userId": "user123",
      "hours": 7,
      "timestamp": "2023-05-20T00:00:00.000Z"
    }
    ```

- **Success Response:**

    ```json
    {
      "_id": "60c72b2f9b1d4f0015a4b5c2",
      "userId": "user123",
      "hours": 7,
      "timestamp": "2023-05-20T00:00:00.000Z",
      "__v": 0
    }
    ```

- **Error Responses:**
  - Missing fields:

    ```json
    {
      "message": "userId, hours, and timestamp are required fields"
    }
    ```

  - Invalid hours:

    ```json
    {
      "message": "hours must be a valid positive number and in the range 1-24"
    }
    ```

  - Invalid timestamp:

    ```json
    {
      "message": "timestamp must be a valid date"
    }
    ```

  - Record already exists:

    ```json
    {
      "message": "Record already exists"
    }
    ```

### 2. Retrieve Sleep Records for a User

- **URL:** `/sleep/:userId`
- **Method:** `GET`
- **URL Parameters:**
  - `userId`: The ID of the user whose sleep records you want to retrieve.

- **Success Response:**

    ```json
    [
      {
        "_id": "60c72b2f9b1d4f0015a4b5c2",
        "userId": "user123",
        "hours": 7,
        "timestamp": "2023-05-20T00:00:00.000Z",
        "__v": 0
      },
      {
        "_id": "60c72b3f9b1d4f0015a4b5c3",
        "userId": "user123",
        "hours": 8,
        "timestamp": "2023-05-21T00:00:00.000Z",
        "__v": 0
      }
    ]
    ```

- **Error Response:**

    ```json
    {
      "message": "No records found for the specified userId"
    }
    ```

### 3. Delete a Sleep Record by ID

- **URL:** `/sleep/:recordId`
- **Method:** `DELETE`
- **URL Parameters:**
  - `recordId`: The ID of the sleep record to delete.

- **Success Response:**

    ```json
    {
      "message": "Record has been deleted"
    }
    ```

- **Error Response:**

    ```json
    {
      "message": "No record found, Cannot be deleted"
    }
    ```

## Testing

To run the tests for the API endpoints:

1. Ensure your MongoDB instance is running.
2. Run the tests:

    ```bash
    npm test
    ```

The tests will validate the functionality of the API endpoints.

## License

This project is licensed under the MIT License.
