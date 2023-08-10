package main

import (
	"fmt"
	"log"
	"movieDB/models"
	"movieDB/storage"
	"net/http"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	"gorm.io/gorm"
)

type movies struct {
	Title string `json:"title"`
	Cast  string `json:"cast"`
}

type Repository struct {
	DB *gorm.DB
}

func (r *Repository) newMovie(context *fiber.Ctx) error {
	movie := movies{}
	err := context.BodyParser(&movie)

	if err != nil {
		context.Status(http.StatusUnprocessableEntity).JSON(
			&fiber.Map{"message": "request failed"})
		return err
	}
	fmt.Println(&movie)
	err = r.DB.Create(&movie).Error
	if err != nil {
		context.Status(http.StatusBadRequest).JSON(
			&fiber.Map{"message": "could not store movie"})
		return err
	}
	context.Status(http.StatusOK).JSON(&fiber.Map{
		"message": "Movie has been added successfuly!"})
	return nil
}

func (r *Repository) DeleteMovie(context *fiber.Ctx) error {
	movieModel := models.Movies{}
	id := context.Params("id")
	if id == "" {
		context.Status(http.StatusInternalServerError).JSON(&fiber.Map{
			"message": "id cannot be empty",
		})
		return nil
	}

	err := r.DB.Delete(movieModel, id)

	if err.Error != nil {
		context.Status(http.StatusBadRequest).JSON(&fiber.Map{
			"message": "could not delete movie..",
		})
		return err.Error
	}
	context.Status(http.StatusOK).JSON(&fiber.Map{
		"message": "Movie deleted successfully",
	})
	return nil
}

func (r *Repository) GetMovies(context *fiber.Ctx) error {
	movieModels := &[]models.Movies{}

	err := r.DB.Find(movieModels).Error
	if err != nil {
		context.Status(http.StatusBadRequest).JSON(
			&fiber.Map{"message": "could not get movies.."})
		return err
	}

	context.Status(http.StatusOK).JSON(&fiber.Map{
		"message": "Movies fetched successfully",
		"data":    movieModels,
	})
	return nil
}

func (r *Repository) GetMovieByID(context *fiber.Ctx) error {

	id := context.Params("id")
	movieModels := &models.Movies{}
	if id == "" {
		context.Status(http.StatusInternalServerError).JSON(&fiber.Map{
			"message": "Error: id cannot be empty",
		})
		return nil
	}

	fmt.Println("the ID is", id)

	err := r.DB.Where("id = ?", id).First(movieModels).Error
	if err != nil {
		context.Status(http.StatusBadRequest).JSON(
			&fiber.Map{"message": "could not get the movie"})
		return err
	}
	context.Status(http.StatusOK).JSON(&fiber.Map{
		"message": "Movie id fetched successfully!",
		"data":    movieModels,
	})
	return nil
}

func (r *Repository) SetupRoutes(app *fiber.App) {
	api := app.Group("/api")
	api.Post("/create_movie", r.newMovie)
	api.Delete("delete_movie/:id", r.DeleteMovie)
	api.Get("/get_movie/:id", r.GetMovieByID)
	api.Get("/movie", r.GetMovies)
}

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal(err)
	}
	config := &storage.Config{
		Host:     os.Getenv("DB_HOST"),
		Port:     os.Getenv("DB_PORT"),
		Password: os.Getenv("DB_PASS"),
		User:     os.Getenv("DB_USER"),
		SSLMode:  os.Getenv("DB_SSLMODE"),
		DBName:   os.Getenv("DB_NAME"),
	}

	db, err := storage.NewConnection(config)
	if err != nil {
		log.Fatal("could not load the database")
	}
	err = models.MigrateMovies(db)
	if err != nil {
		log.Fatal("could not migrate db")
	}
	r := Repository{
		DB: db,
	}
	app := fiber.New()
	r.SetupRoutes(app)
	app.Listen(":8080")

}
