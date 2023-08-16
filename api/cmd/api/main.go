package main

import (
	"github.com/intrntsrfr/solid-stonks/config"
	"github.com/intrntsrfr/solid-stonks/handler"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		panic(err)
	}

	handler := handler.NewHandler(cfg)
	handler.Run(":8080")
}
