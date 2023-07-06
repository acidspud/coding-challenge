package http

import (
	"net/http"
	"strconv"

	"github.com/acidspud/gotbot-coding-challange/delivery/middleware"
	"github.com/acidspud/gotbot-coding-challange/domain"
	"github.com/acidspud/gotbot-coding-challange/transport/request"
	"github.com/acidspud/gotbot-coding-challange/utils"
	validation "github.com/go-ozzo/ozzo-validation"
	"github.com/labstack/echo/v4"
)

type ItemHandler struct {
	ItemUC domain.ItemUsecase
}

// NewItemHandler will initialize the item resources endpoint
func NewItemHandler(e *echo.Echo, middleware *middleware.Middleware, itemUC domain.ItemUsecase) {
	handler := &ItemHandler{
		ItemUC: itemUC,
	}

	apiV1 := e.Group("/api/v1")
	apiV1.POST("/items", handler.Create, middleware.JWTAuth())
	apiV1.GET("/items/:id", handler.GetByID, middleware.JWTAuth())
	apiV1.GET("/items", handler.Fetch, middleware.JWTAuth())
	apiV1.PUT("/items/:id", handler.Update, middleware.JWTAuth())
	apiV1.DELETE("/items/:id", handler.Delete, middleware.JWTAuth())
}

// Create godoc
// @Summary Create Item
// @Description Create Item
// @Tags Items
// @Accept json
// @Produce json
// @Param item body request.CreateItemReq true "Item to create"
// @Success 200
// @Router /api/v1/items [post]
// @Security JwtToken
func (h *ItemHandler) Create(c echo.Context) error {
	ctx := c.Request().Context()
	var req request.CreateItemReq

	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusUnprocessableEntity, utils.NewUnprocessableEntityError(err.Error()))
	}

	if err := req.Validate(); err != nil {
		errVal := err.(validation.Errors)
		return c.JSON(http.StatusBadRequest, utils.NewInvalidInputError(errVal))
	}

	if err := h.ItemUC.Create(ctx, &req); err != nil {
		return c.JSON(utils.ParseHttpError(err))
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"message": "item created",
	})

}

// GetByID godoc
// @Summary Get Item
// @Description Get Item
// @Tags Items
// @Accept json
// @Produce json
// @Param id path string true "item id"
// @Success 200
// @Router /api/v1/items/{id} [get]
// @Security JwtToken
func (h *ItemHandler) GetByID(c echo.Context) error {
	ctx := c.Request().Context()
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return c.JSON(http.StatusNotFound, utils.NewNotFoundError("item not found"))
	}

	item, err := h.ItemUC.GetByID(ctx, int64(id))
	if err != nil {
		return c.JSON(utils.ParseHttpError(err))
	}

	return c.JSON(http.StatusOK, map[string]interface{}{"data": item})
}

// Fetch godoc
// @Summary Fetch Item
// @Description Fetch Item
// @Tags Items
// @Accept json
// @Produce json
// @Success 200
// @Router /api/v1/items [get]
// @Security JwtToken
func (h *ItemHandler) Fetch(c echo.Context) error {
	ctx := c.Request().Context()

	items, err := h.ItemUC.Fetch(ctx)
	if err != nil {
		return c.JSON(utils.ParseHttpError(err))
	}

	return c.JSON(http.StatusOK, map[string]interface{}{"data": items})
}

// Update godoc
// @Summary Update Item
// @Description Update Item
// @Tags Items
// @Accept json
// @Produce json
// @Param id path string true "item id"
// @Param item body request.UpdateItemReq true "Item to update"
// @Success 200
// @Router /api/v1/items/{id} [put]
// @Security JwtToken
func (h *ItemHandler) Update(c echo.Context) error {
	ctx := c.Request().Context()
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return c.JSON(http.StatusNotFound, utils.NewNotFoundError("item not found"))
	}

	var req request.UpdateItemReq
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusUnprocessableEntity, utils.NewUnprocessableEntityError(err.Error()))
	}

	if err := req.Validate(); err != nil {
		errVal := err.(validation.Errors)
		return c.JSON(http.StatusBadRequest, utils.NewInvalidInputError(errVal))
	}

	if err := h.ItemUC.Update(ctx, int64(id), &req); err != nil {
		return c.JSON(utils.ParseHttpError(err))
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"message": "item updated",
	})
}

// Delete godoc
// @Summary Delete Item
// @Description Delete Item
// @Tags Items
// @Accept json
// @Produce json
// @Param id path string true "item id"
// @Success 200
// @Router /api/v1/items/{id} [delete]
// @Security JwtToken
func (h *ItemHandler) Delete(c echo.Context) error {
	ctx := c.Request().Context()
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return c.JSON(http.StatusNotFound, utils.NewNotFoundError("item not found"))
	}

	if err := h.ItemUC.Delete(ctx, int64(id)); err != nil {
		return c.JSON(utils.ParseHttpError(err))
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"message": "item deleted",
	})
}
