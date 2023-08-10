# movieDB
This project is a Golang-based backend server designed to seamlessly connect to a PostgreSQL database, providing a robust and efficient solution for 
    managing movie data. With this backend server, you can effortlessly store, retrieve, and delete movie records within the database, making it an essential 
    component for any movie-related application.

Database Connection: The server establishes a secure and optimized connection to a PostgreSQL database, ensuring reliable data storage and retrieval.
Create Movie Records: Easily add new movies to the database by providing essential details such as title, release year, genre, and more.
Retrieve Movies: Retrieve movie information based on various criteria, including title, genre, release year, and more. The server responds with 
    detailed information about the requested movies.
Delete Movies: Efficiently remove movie records from the database using unique identifiers, allowing for seamless data management.

Prerequisites: Ensure you have Golang and PostgreSQL installed on your system.
Database Setup: Create a PostgreSQL database and update the database configuration in the .env file with your database credentials.
Dependencies: Run go get to install the required dependencies for the project.
Run the Server: Execute "go run main.go" to start the backend server. The server will listen for incoming requests on a specified port(8080).

POST /movies: Add a new movie record to the database. Provide the necessary details in the request body at (http://localhost:8080/api/create_movie).
GET /movies: Retrieve a list of all movies stored in the database at (http://localhost:8080/api/movie).
GET /movies/{id}: Retrieve detailed information about a specific movie using its unique identifier at (http://localhost:8080/api/get_movie/id).
DELETE /movies/{id}: Delete a movie record from the database based on its unique identifier at (http://localhost:8080/api/delete_movie/id).
