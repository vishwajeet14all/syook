# Encrypted Timeseries App

This is a backend and frontend application that generates and emits encrypted data streams over a socket, listens to incoming data streams, decrypts and decodes them, saves the data to a MongoDB time series collection, and displays the valid data in a real-time frontend app.

<img width="955" alt="Screenshot 2023-08-30 131509" src="https://github.com/meel516/syooktimeseries/assets/102860983/b29e9973-48b1-4960-a884-e4752fc02689">
## Technologies Used

- Node.js
- Express.js
- Socket.io
- MongoDB
- Mongoose
- React.js

## Project Structure

The project is divided into the following components:

1. `emitter.js`: This module generates encrypted messages and emits them over a socket to the listener service.
2. `listener.js`: This module listens for encrypted data streams, decrypts them, validates the data, and saves it to the MongoDB database.
3. `encryptionkey.js`: Contains the encryption key used for encryption and decryption.
4. `data.json`: Contains constant data used for generating random messages.
5. `models/TimeSeriesModel.js`: Mongoose schema for individual time series data.
6. `models/MinuteSummaryModel.js`: Mongoose schema for aggregating data by minute summaries.
7. `utils.js`: Contains utility functions for payload validation and error handling.
8. `frontend/`: Contains the frontend React application.

## Usage

1. Install dependencies for both backend and frontend:
   ```sh
   cd backend
   npm install
   cd frontend
   npm install
2. start both front end ad backend:
    ```sh
    cd backend
    node listener
    node emitter
    cd ..
    cd frontend
    npm start

## How to Use
1.Open your web browser and visit the deployed frontend app.

2.The app will display the saved data in a real-time manner.

3.You can see the total emitted, successful, and error counts, as well as the success rate for data transmission and decoding.

## Contact
If you have any questions or need further assistance, feel free to contact me at rjvishwajeet007@gmail.com.
