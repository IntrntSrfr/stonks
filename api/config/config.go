package config

import (
	"encoding/json"
	"os"
)

type Config struct {
	ApiKey string `json:"api_key"`
}

func Load() (*Config, error) {
	return loadJson()
}

func loadJson() (*Config, error) {
	file, err := os.ReadFile("./config.json")
	if err != nil {
		return nil, err
	}

	var config Config
	err = json.Unmarshal(file, &config)
	if err != nil {
		return nil, err
	}

	return &config, nil
}
