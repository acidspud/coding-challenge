package main

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/acidspud/coding-challange/utils/crypto"
	"github.com/acidspud/coding-challange/utils/jwt"

	_ "github.com/acidspud/coding-challange/docs"
	"github.com/acidspud/coding-challange/utils"

	"github.com/acidspud/coding-challange/config"
	httpDelivery "github.com/acidspud/coding-challange/delivery/http"
	appMiddleware "github.com/acidspud/coding-challange/delivery/middleware"
	"github.com/acidspud/coding-challange/infrastructure/datastore"
	pgsqlRepository "github.com/acidspud/coding-challange/repository/pgsql"
	redisRepository "github.com/acidspud/coding-challange/repository/redis"
	"github.com/acidspud/coding-challange/usecase"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	echoSwagger "github.com/swaggo/echo-swagger"
)

func main() {
	// Load config
	configApp := config.LoadConfig()

	// Setup infra
	dbInstance, err := datastore.NewDatabase(configApp.DatabaseURL)
	utils.PanicIfNeeded(err)

	cacheInstance, err := datastore.NewCache(configApp.CacheURL)
	utils.PanicIfNeeded(err)

	// Setup repository
	redisRepo := redisRepository.NewRedisRepository(cacheInstance)
	itemRepo := pgsqlRepository.NewPgsqlItemRepository(dbInstance)
	userRepo := pgsqlRepository.NewPgsqlUserRepository(dbInstance)

	// Setup Service
	cryptoSvc := crypto.NewCryptoService()
	jwtSvc := jwt.NewJWTService(configApp.JWTSecretKey)

	// Setup usecase
	ctxTimeout := time.Duration(configApp.ContextTimeout) * time.Second
	itemUC := usecase.NewItemUsecase(itemRepo, redisRepo, ctxTimeout)
	authUC := usecase.NewAuthUsecase(userRepo, cryptoSvc, jwtSvc, ctxTimeout)

	// Setup app middleware
	appMiddleware := appMiddleware.NewMiddleware(jwtSvc)

	// Setup route engine & middleware
	e := echo.New()
	e.Use(middleware.CORS())
	e.Use(appMiddleware.Logger(nil))

	// Setup handler
	e.GET("/swagger/*", echoSwagger.WrapHandler)
	e.GET("/health", func(c echo.Context) error {
		return c.String(http.StatusOK, "i am alive")
	})

	// Serve the public folder for the frontend
	fs := http.FileServer(http.Dir("./kota-shop-app/build"))
	e.GET("/*", echo.WrapHandler(fs))

	httpDelivery.NewItemHandler(e, appMiddleware, itemUC)
	httpDelivery.NewAuthHandler(e, appMiddleware, authUC)

	// Start server
	go func() {
		if err := e.Start(":7070"); err != nil && err != http.ErrServerClosed {
			e.Logger.Error(err)
			e.Logger.Fatal("shutting down the server")
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server with a timeout of 10 seconds.
	// Use a buffered channel to avoid missing signals as recommended for signal.Notify
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt)
	<-quit
	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(configApp.ContextTimeout)*time.Second)
	defer cancel()
	if err := e.Shutdown(ctx); err != nil {
		e.Logger.Fatal(err)
	}
}
