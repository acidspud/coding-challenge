package http_test

import (
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"strconv"
	"strings"
	"testing"
	"time"

	httpDelivery "github.com/acidspud/gotbot-coding-challange/delivery/http"
	"github.com/acidspud/gotbot-coding-challange/domain"
	"github.com/acidspud/gotbot-coding-challange/mocks"
	"github.com/acidspud/gotbot-coding-challange/transport/request"
	"github.com/acidspud/gotbot-coding-challange/utils"
	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
)

func TestItemHandler_Create(t *testing.T) {
	mockItemUC := new(mocks.ItemUsecase)
	createItemReq := request.CreateItemReq{
		Name: "name",
	}

	t.Run("success", func(t *testing.T) {
		jsonReq, err := json.Marshal(createItemReq)
		assert.NoError(t, err)

		mockItemUC.On("Create", mock.Anything, mock.AnythingOfType("*request.CreateItemReq")).
			Return(nil).Once()

		e := echo.New()
		req, err := http.NewRequest(echo.POST, "/api/v1/items", strings.NewReader(string(jsonReq)))
		assert.NoError(t, err)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)

		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)
		c.SetPath("/api/v1/items")

		handler := httpDelivery.ItemHandler{
			ItemUC: mockItemUC,
		}
		err = handler.Create(c)

		require.NoError(t, err)
		assert.Equal(t, http.StatusOK, rec.Code)
		mockItemUC.AssertExpectations(t)
	})

	t.Run("error-validation", func(t *testing.T) {
		invalidCreateItemReq := request.CreateItemReq{
			Name: "",
		}
		jsonReq, err := json.Marshal(invalidCreateItemReq)
		assert.NoError(t, err)

		e := echo.New()
		req, err := http.NewRequest(echo.POST, "/api/v1/items", strings.NewReader(string(jsonReq)))
		assert.NoError(t, err)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)

		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)
		c.SetPath("/api/v1/items")

		handler := httpDelivery.ItemHandler{
			ItemUC: mockItemUC,
		}
		err = handler.Create(c)

		require.NoError(t, err)
		assert.Equal(t, http.StatusBadRequest, rec.Code)
		mockItemUC.AssertExpectations(t)
	})

	t.Run("error-usecase", func(t *testing.T) {
		jsonReq, err := json.Marshal(createItemReq)
		assert.NoError(t, err)

		mockItemUC.On("Create", mock.Anything, mock.AnythingOfType("*request.CreateItemReq")).
			Return(errors.New("Unexpected Error")).Once()

		e := echo.New()
		req, err := http.NewRequest(echo.POST, "/api/v1/items", strings.NewReader(string(jsonReq)))
		assert.NoError(t, err)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)

		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)
		c.SetPath("/api/v1/items")

		handler := httpDelivery.ItemHandler{
			ItemUC: mockItemUC,
		}
		err = handler.Create(c)

		require.NoError(t, err)
		assert.Equal(t, http.StatusInternalServerError, rec.Code)
		mockItemUC.AssertExpectations(t)
	})

}

func TestItemHandler_GetByID(t *testing.T) {
	mockItemUC := new(mocks.ItemUsecase)
	mockItem := domain.Item{
		ID:        1,
		Name:      "name",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	t.Run("success", func(t *testing.T) {
		mockItemUC.On("GetByID", mock.Anything, mock.AnythingOfType("int64")).
			Return(mockItem, nil).Once()

		e := echo.New()
		req, err := http.NewRequest(echo.GET, "/api/v1/items/"+strconv.Itoa(int(mockItem.ID)), strings.NewReader(""))
		assert.NoError(t, err)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)

		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)
		c.SetPath("/api/v1/items/:id")
		c.SetParamNames("id")
		c.SetParamValues(strconv.Itoa(int(mockItem.ID)))

		handler := httpDelivery.ItemHandler{
			ItemUC: mockItemUC,
		}
		err = handler.GetByID(c)

		require.NoError(t, err)
		assert.Equal(t, http.StatusOK, rec.Code)
		mockItemUC.AssertExpectations(t)
	})

	t.Run("data-not-exist", func(t *testing.T) {
		mockItemUC.On("GetByID", mock.Anything, mock.AnythingOfType("int64")).
			Return(domain.Item{}, utils.NewNotFoundError("item not found")).Once()

		e := echo.New()
		req, err := http.NewRequest(echo.GET, "/api/v1/items/"+strconv.Itoa(int(mockItem.ID)), strings.NewReader(""))
		assert.NoError(t, err)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)

		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)
		c.SetPath("/api/v1/items/:id")
		c.SetParamNames("id")
		c.SetParamValues(strconv.Itoa(int(mockItem.ID)))

		handler := httpDelivery.ItemHandler{
			ItemUC: mockItemUC,
		}
		err = handler.GetByID(c)

		require.NoError(t, err)
		assert.Equal(t, http.StatusNotFound, rec.Code)
		mockItemUC.AssertExpectations(t)
	})

	t.Run("error-usecase", func(t *testing.T) {
		mockItemUC.On("GetByID", mock.Anything, mock.AnythingOfType("int64")).
			Return(domain.Item{}, errors.New("Unexpected Error")).Once()

		e := echo.New()
		req, err := http.NewRequest(echo.GET, "/api/v1/items/"+strconv.Itoa(int(mockItem.ID)), strings.NewReader(""))
		assert.NoError(t, err)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)

		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)
		c.SetPath("/api/v1/items/:id")
		c.SetParamNames("id")
		c.SetParamValues(strconv.Itoa(int(mockItem.ID)))

		handler := httpDelivery.ItemHandler{
			ItemUC: mockItemUC,
		}
		err = handler.GetByID(c)

		require.NoError(t, err)
		assert.Equal(t, http.StatusInternalServerError, rec.Code)
		mockItemUC.AssertExpectations(t)
	})
}

func TestItemHandler_Fetch(t *testing.T) {
	mockItemUC := new(mocks.ItemUsecase)
	mockItem := domain.Item{
		ID:        1,
		Name:      "name",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	mockListItem := make([]domain.Item, 0)
	mockListItem = append(mockListItem, mockItem)

	t.Run("success", func(t *testing.T) {
		mockItemUC.On("Fetch", mock.Anything).Return(mockListItem, nil).Once()

		e := echo.New()
		req, err := http.NewRequest(echo.GET, "/api/v1/items/", strings.NewReader(""))
		assert.NoError(t, err)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)

		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)
		c.SetPath("/api/v1/items/")

		handler := httpDelivery.ItemHandler{
			ItemUC: mockItemUC,
		}
		err = handler.Fetch(c)

		require.NoError(t, err)
		assert.Equal(t, http.StatusOK, rec.Code)
		mockItemUC.AssertExpectations(t)
	})

	t.Run("error-usecase", func(t *testing.T) {
		mockItemUC.On("Fetch", mock.Anything).Return([]domain.Item{}, errors.New("Unexpected Error")).Once()

		e := echo.New()
		req, err := http.NewRequest(echo.GET, "/api/v1/items/", strings.NewReader(""))
		assert.NoError(t, err)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)

		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)
		c.SetPath("/api/v1/items/")

		handler := httpDelivery.ItemHandler{
			ItemUC: mockItemUC,
		}
		err = handler.Fetch(c)

		require.NoError(t, err)
		assert.Equal(t, http.StatusInternalServerError, rec.Code)
		mockItemUC.AssertExpectations(t)
	})
}

func TestItemHandler_Update(t *testing.T) {
	mockItemUC := new(mocks.ItemUsecase)
	mockItem := domain.Item{
		ID:        1,
		Name:      "name",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	updateItemReq := request.UpdateItemReq{
		Name: "name",
	}

	t.Run("success", func(t *testing.T) {
		jsonReq, err := json.Marshal(updateItemReq)
		assert.NoError(t, err)

		mockItemUC.On("Update", mock.Anything, mock.AnythingOfType("int64"), mock.AnythingOfType("*request.UpdateItemReq")).
			Return(nil).Once()

		e := echo.New()
		req, err := http.NewRequest(echo.PUT, "/api/v1/items/"+strconv.Itoa(int(mockItem.ID)), strings.NewReader(string(jsonReq)))
		assert.NoError(t, err)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)

		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)
		c.SetPath("/api/v1/items/:id")
		c.SetParamNames("id")
		c.SetParamValues(strconv.Itoa(int(mockItem.ID)))

		handler := httpDelivery.ItemHandler{
			ItemUC: mockItemUC,
		}
		err = handler.Update(c)

		require.NoError(t, err)
		assert.Equal(t, http.StatusOK, rec.Code)
		mockItemUC.AssertExpectations(t)
	})

	t.Run("error-validation", func(t *testing.T) {
		invalidUpdateItemReq := request.UpdateItemReq{
			Name: "",
		}
		jsonReq, err := json.Marshal(invalidUpdateItemReq)
		assert.NoError(t, err)

		e := echo.New()
		req, err := http.NewRequest(echo.PUT, "/api/v1/items/"+strconv.Itoa(int(mockItem.ID)), strings.NewReader(string(jsonReq)))
		assert.NoError(t, err)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)

		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)
		c.SetPath("/api/v1/items/:id")
		c.SetParamNames("id")
		c.SetParamValues(strconv.Itoa(int(mockItem.ID)))

		handler := httpDelivery.ItemHandler{
			ItemUC: mockItemUC,
		}
		err = handler.Update(c)

		require.NoError(t, err)
		assert.Equal(t, http.StatusBadRequest, rec.Code)
		mockItemUC.AssertExpectations(t)
	})

	t.Run("data-not-exist", func(t *testing.T) {
		jsonReq, err := json.Marshal(updateItemReq)
		assert.NoError(t, err)

		mockItemUC.On("Update", mock.Anything, mock.AnythingOfType("int64"), mock.AnythingOfType("*request.UpdateItemReq")).
			Return(utils.NewNotFoundError("item not found")).Once()

		e := echo.New()
		req, err := http.NewRequest(echo.PUT, "/api/v1/items/"+strconv.Itoa(int(mockItem.ID)), strings.NewReader(string(jsonReq)))
		assert.NoError(t, err)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)

		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)
		c.SetPath("/api/v1/items/:id")
		c.SetParamNames("id")
		c.SetParamValues(strconv.Itoa(int(mockItem.ID)))

		handler := httpDelivery.ItemHandler{
			ItemUC: mockItemUC,
		}
		err = handler.Update(c)

		require.NoError(t, err)
		assert.Equal(t, http.StatusNotFound, rec.Code)
		mockItemUC.AssertExpectations(t)
	})

	t.Run("error-usecase", func(t *testing.T) {
		jsonReq, err := json.Marshal(updateItemReq)
		assert.NoError(t, err)

		mockItemUC.On("Update", mock.Anything, mock.AnythingOfType("int64"), mock.AnythingOfType("*request.UpdateItemReq")).
			Return(errors.New("Unexpected Error")).Once()

		e := echo.New()
		req, err := http.NewRequest(echo.PUT, "/api/v1/items/"+strconv.Itoa(int(mockItem.ID)), strings.NewReader(string(jsonReq)))
		assert.NoError(t, err)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)

		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)
		c.SetPath("/api/v1/items/:id")
		c.SetParamNames("id")
		c.SetParamValues(strconv.Itoa(int(mockItem.ID)))

		handler := httpDelivery.ItemHandler{
			ItemUC: mockItemUC,
		}
		err = handler.Update(c)

		require.NoError(t, err)
		assert.Equal(t, http.StatusInternalServerError, rec.Code)
		mockItemUC.AssertExpectations(t)
	})

}

func TestItemHandler_Delete(t *testing.T) {
	mockItemUC := new(mocks.ItemUsecase)
	mockItem := domain.Item{
		ID:        1,
		Name:      "name",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	t.Run("success", func(t *testing.T) {
		mockItemUC.On("Delete", mock.Anything, mock.AnythingOfType("int64")).Return(nil).Once()

		e := echo.New()
		req, err := http.NewRequest(echo.DELETE, "/api/v1/items/"+strconv.Itoa(int(mockItem.ID)), strings.NewReader(""))
		assert.NoError(t, err)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)

		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)
		c.SetPath("/api/v1/items/:id")
		c.SetParamNames("id")
		c.SetParamValues(strconv.Itoa(int(mockItem.ID)))

		handler := httpDelivery.ItemHandler{
			ItemUC: mockItemUC,
		}
		err = handler.Delete(c)

		require.NoError(t, err)
		assert.Equal(t, http.StatusOK, rec.Code)
		mockItemUC.AssertExpectations(t)
	})

	t.Run("data-not-exist", func(t *testing.T) {
		mockItemUC.On("Delete", mock.Anything, mock.AnythingOfType("int64")).Return(utils.NewNotFoundError("item not found")).Once()

		e := echo.New()
		req, err := http.NewRequest(echo.DELETE, "/api/v1/items/"+strconv.Itoa(int(mockItem.ID)), strings.NewReader(""))
		assert.NoError(t, err)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)

		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)
		c.SetPath("/api/v1/items/:id")
		c.SetParamNames("id")
		c.SetParamValues(strconv.Itoa(int(mockItem.ID)))

		handler := httpDelivery.ItemHandler{
			ItemUC: mockItemUC,
		}
		err = handler.Delete(c)

		require.NoError(t, err)
		assert.Equal(t, http.StatusNotFound, rec.Code)
		mockItemUC.AssertExpectations(t)
	})

	t.Run("error-usecase", func(t *testing.T) {
		mockItemUC.On("Delete", mock.Anything, mock.AnythingOfType("int64")).Return(errors.New("Unexpected Error")).Once()

		e := echo.New()
		req, err := http.NewRequest(echo.DELETE, "/api/v1/items/"+strconv.Itoa(int(mockItem.ID)), strings.NewReader(""))
		assert.NoError(t, err)
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)

		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)
		c.SetPath("/api/v1/items/:id")
		c.SetParamNames("id")
		c.SetParamValues(strconv.Itoa(int(mockItem.ID)))

		handler := httpDelivery.ItemHandler{
			ItemUC: mockItemUC,
		}
		err = handler.Delete(c)

		require.NoError(t, err)
		assert.Equal(t, http.StatusInternalServerError, rec.Code)
		mockItemUC.AssertExpectations(t)
	})
}
