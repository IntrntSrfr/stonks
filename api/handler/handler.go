package handler

import (
	"context"
	"net/http"
	"strings"
	"time"

	"github.com/gin-contrib/cache"
	"github.com/gin-contrib/cache/persistence"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/intrntsrfr/solid-stonks/config"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"

	polygon "github.com/polygon-io/client-go/rest"
	"github.com/polygon-io/client-go/rest/models"
)

type Handler struct {
	config *config.Config
	e      *gin.Engine
	client *polygon.Client
	log    *zap.Logger
}

func NewHandler(cfg *config.Config) *Handler {
	loggerConfig := zap.NewDevelopmentConfig()
	loggerConfig.EncoderConfig.EncodeLevel = zapcore.CapitalColorLevelEncoder
	logger, _ := loggerConfig.Build()
	logger = logger.Named("root")
	e := gin.Default()
	e.Use(cors.Default())
	client := polygon.New(cfg.ApiKey)
	store := persistence.NewInMemoryStore(24 * time.Hour)
	h := &Handler{cfg, e, client, logger}
	e.GET("/api/tickers/:name", cache.CachePage(store, 24*time.Hour, h.getTicker))
	e.GET("/api/tickers/:name/history", cache.CachePage(store, 24*time.Hour, h.getTickerHistory))
	return h
}

func (h *Handler) getTicker(ctx *gin.Context) {
	tickerName := ctx.Param("name")
	if !validTicker(tickerName) {
		ctx.JSON(http.StatusBadRequest, gin.H{"msg": "invalid ticker"})
		return
	}

	params := models.GetTickerDetailsParams{
		Ticker: strings.ToUpper(tickerName),
	}.WithDate(models.Date(time.Now()))

	res, err := h.client.GetTickerDetails(context.Background(), params)
	if err != nil {
		h.log.Warn("failed", zap.Error(err))
		ctx.JSON(http.StatusNotFound, gin.H{"msg": "not found"})
		return
	}
	ctx.JSON(http.StatusOK, res.Results)
}

func (h *Handler) getTickerHistory(ctx *gin.Context) {
	tickerName := ctx.Param("name")
	if !validTicker(tickerName) {
		ctx.JSON(http.StatusBadRequest, gin.H{"msg": "invalid ticker"})
		return
	}
	from, errFrom := time.Parse(time.DateOnly, ctx.Query("from"))
	to, errTo := time.Parse(time.DateOnly, ctx.Query("to"))
	if errFrom != nil || errTo != nil {
		h.log.Warn("failed", zap.Error(errFrom), zap.Error(errTo))
		ctx.JSON(http.StatusBadRequest, gin.H{"msg": "invalid 'to' or 'from' format"})
		return
	}

	params := models.GetAggsParams{
		Ticker:     strings.ToUpper(tickerName),
		Multiplier: 1,
		Timespan:   models.Timespan("day"),
		From:       models.Millis(from),
		To:         models.Millis(to),
	}.WithOrder(models.Asc).WithAdjusted(true).WithLimit(120)

	res, err := h.client.GetAggs(context.Background(), params)
	if err != nil {
		h.log.Warn("failed", zap.Error(err))
		ctx.JSON(http.StatusNotFound, gin.H{"msg": "not found"})
		return
	}
	if res.ResultsCount == 0 {
		ctx.JSON(http.StatusOK, []any{})
		return
	}
	ctx.JSON(http.StatusOK, res.Results)
}

func validTicker(ticker string) bool {
	if len(ticker) > 5 || len(ticker) < 1 {
		return false
	}
	return true
}

func (h *Handler) Run(addr string) error {
	return http.ListenAndServe(addr, h.e)
}
