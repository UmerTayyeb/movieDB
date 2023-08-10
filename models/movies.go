package models

import (
	"gorm.io/gorm"
)

type Movies struct {
	ID    uint   `gorm:"primary key;autoIncrement" json: "id"`
	Title string `json: "title"`
	Cast  string `json: "cast"`
}

func MigrateMovies(db *gorm.DB) error {
	err := db.AutoMigrate(&Movies{})
	return err
}
