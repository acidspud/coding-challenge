package usecase_test

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"testing"
	"time"

	"github.com/acidspud/coding-challange/domain"
	"github.com/acidspud/coding-challange/mocks"
	"github.com/acidspud/coding-challange/transport/request"
	"github.com/acidspud/coding-challange/usecase"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func Ptr[T any](v T) *T {
	return &v
}

func TestItemUC_Create(t *testing.T) {
	mockRedisRepo := new(mocks.RedisRepository)
	mockItemRepo := new(mocks.ItemRepository)

	createItemReq := request.CreateItemReq{
		Name:      "name",
		Qty:       Ptr(int16(5)),
		Threshold: Ptr(int16(2)),
		Price:     Ptr(int64(2099)),
	}

	t.Run("success", func(t *testing.T) {
		mockItemRepo.On("Create", mock.Anything, mock.AnythingOfType("*domain.Item")).Return(nil).Once()
		mockRedisRepo.On("Delete", mock.AnythingOfType("string")).Return(nil).Once()

		itemUsecase := usecase.NewItemUsecase(mockItemRepo, mockRedisRepo, 60*time.Second)
		err := itemUsecase.Create(context.TODO(), &createItemReq)

		assert.NoError(t, err)
		mockRedisRepo.AssertExpectations(t)
		mockItemRepo.AssertExpectations(t)
	})

	t.Run("error-db", func(t *testing.T) {
		mockItemRepo.On("Create", mock.Anything, mock.AnythingOfType("*domain.Item")).Return(errors.New("Unexpected Error")).Once()

		itemUsecase := usecase.NewItemUsecase(mockItemRepo, mockRedisRepo, 60*time.Second)
		err := itemUsecase.Create(context.TODO(), &createItemReq)

		assert.NotNil(t, err)
		mockRedisRepo.AssertExpectations(t)
		mockItemRepo.AssertExpectations(t)
	})
}

func TestItemUC_GetByID(t *testing.T) {
	mockRedisRepo := new(mocks.RedisRepository)
	mockItemRepo := new(mocks.ItemRepository)
	mockItem := domain.Item{
		ID:        1,
		Name:      "name",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	t.Run("success", func(t *testing.T) {
		mockItemRepo.On("GetByID", mock.Anything, mock.AnythingOfType("int64")).Return(mockItem, nil).Once()

		itemUsecase := usecase.NewItemUsecase(mockItemRepo, mockRedisRepo, 60*time.Second)
		item, err := itemUsecase.GetByID(context.TODO(), mockItem.ID)

		assert.NoError(t, err)
		assert.NotNil(t, item)
		assert.Equal(t, item.ID, mockItem.ID)
		mockRedisRepo.AssertExpectations(t)
		mockItemRepo.AssertExpectations(t)
	})

	t.Run("item-not-exist", func(t *testing.T) {
		mockItemRepo.On("GetByID", mock.Anything, mock.AnythingOfType("int64")).Return(domain.Item{}, sql.ErrNoRows).Once()

		itemUsecase := usecase.NewItemUsecase(mockItemRepo, mockRedisRepo, 60*time.Second)
		item, err := itemUsecase.GetByID(context.TODO(), mockItem.ID)

		assert.NotNil(t, err)
		assert.Equal(t, item, domain.Item{})
		mockRedisRepo.AssertExpectations(t)
		mockItemRepo.AssertExpectations(t)
	})

	t.Run("error-db", func(t *testing.T) {
		mockItemRepo.On("GetByID", mock.Anything, mock.AnythingOfType("int64")).Return(domain.Item{}, errors.New("Unexpected Error")).Once()

		itemUsecase := usecase.NewItemUsecase(mockItemRepo, mockRedisRepo, 60*time.Second)
		item, err := itemUsecase.GetByID(context.TODO(), mockItem.ID)

		assert.NotNil(t, err)
		assert.Equal(t, item, domain.Item{})
		mockRedisRepo.AssertExpectations(t)
		mockItemRepo.AssertExpectations(t)
	})
}

func TestTooUC_Fetch(t *testing.T) {
	mockRedisRepo := new(mocks.RedisRepository)
	mockItemRepo := new(mocks.ItemRepository)
	mockItem := domain.Item{
		ID:        1,
		Name:      "name",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	mockListItem := make([]domain.Item, 0)
	mockListItem = append(mockListItem, mockItem)

	t.Run("success", func(t *testing.T) {
		mockRedisRepo.On("Get", mock.AnythingOfType("string")).Return("", errors.New("Unexpected Error")).Once()
		mockItemRepo.On("Fetch", mock.Anything).Return(mockListItem, nil).Once()
		mockRedisRepo.On("Set", mock.AnythingOfType("string"), mock.AnythingOfType("[]uint8"), mock.AnythingOfType("time.Duration")).Return(nil).Once()

		itemUsecase := usecase.NewItemUsecase(mockItemRepo, mockRedisRepo, 60*time.Second)
		items, err := itemUsecase.Fetch(context.TODO())

		assert.NoError(t, err)
		assert.Len(t, items, len(mockListItem))
		mockRedisRepo.AssertExpectations(t)
		mockItemRepo.AssertExpectations(t)
	})

	t.Run("success-get-from-cache", func(t *testing.T) {
		mockListItemByte, _ := json.Marshal(mockListItem)
		mockRedisRepo.On("Get", mock.AnythingOfType("string")).Return(string(mockListItemByte), nil).Once()

		itemUsecase := usecase.NewItemUsecase(mockItemRepo, mockRedisRepo, 60*time.Second)
		items, err := itemUsecase.Fetch(context.TODO())

		assert.NoError(t, err)
		assert.Len(t, items, len(mockListItem))
		mockRedisRepo.AssertExpectations(t)
		mockItemRepo.AssertExpectations(t)

	})

	t.Run("error-db", func(t *testing.T) {
		mockRedisRepo.On("Get", mock.AnythingOfType("string")).Return("", errors.New("Unexpected Error")).Once()
		mockItemRepo.On("Fetch", mock.Anything).Return([]domain.Item{}, errors.New("Unexpected Error")).Once()

		itemUsecase := usecase.NewItemUsecase(mockItemRepo, mockRedisRepo, 60*time.Second)
		items, err := itemUsecase.Fetch(context.TODO())

		assert.NotNil(t, err)
		assert.Len(t, items, 0)
		mockRedisRepo.AssertExpectations(t)
		mockItemRepo.AssertExpectations(t)
	})
}

func TestItemUC_Update(t *testing.T) {
	mockRedisRepo := new(mocks.RedisRepository)
	mockItemRepo := new(mocks.ItemRepository)

	mockItem := domain.Item{
		ID:        1,
		Name:      "name",
		Qty:       Ptr(int16(5)),
		Threshold: Ptr(int16(2)),
		Price:     Ptr(int64(2099)),
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	updateItemReq := request.UpdateItemReq{
		Name:      "name 2",
		Qty:       Ptr(int16(5)),
		Threshold: Ptr(int16(2)),
		Price:     Ptr(int64(2099)),
	}

	t.Run("success", func(t *testing.T) {
		mockItemRepo.On("GetByID", mock.Anything, mock.AnythingOfType("int64")).Return(mockItem, nil).Once()
		mockItemRepo.On("Update", mock.Anything, mock.AnythingOfType("*domain.Item")).Return(nil).Once()
		mockRedisRepo.On("Delete", mock.AnythingOfType("string")).Return(nil).Once()

		itemUsecase := usecase.NewItemUsecase(mockItemRepo, mockRedisRepo, 60*time.Second)
		err := itemUsecase.Update(context.TODO(), mockItem.ID, &updateItemReq)

		assert.NoError(t, err)
		mockRedisRepo.AssertExpectations(t)
		mockItemRepo.AssertExpectations(t)
	})

	t.Run("item-not-exist", func(t *testing.T) {
		mockItemRepo.On("GetByID", mock.Anything, mock.AnythingOfType("int64")).Return(domain.Item{}, sql.ErrNoRows).Once()

		itemUsecase := usecase.NewItemUsecase(mockItemRepo, mockRedisRepo, 60*time.Second)
		err := itemUsecase.Update(context.TODO(), mockItem.ID, &updateItemReq)

		assert.NotNil(t, err)
		mockRedisRepo.AssertExpectations(t)
		mockItemRepo.AssertExpectations(t)
	})

	t.Run("error-db", func(t *testing.T) {
		mockItemRepo.On("GetByID", mock.Anything, mock.AnythingOfType("int64")).Return(mockItem, nil).Once()
		mockItemRepo.On("Update", mock.Anything, mock.AnythingOfType("*domain.Item")).Return(errors.New("Unexpected Error")).Once()

		itemUsecase := usecase.NewItemUsecase(mockItemRepo, mockRedisRepo, 60*time.Second)
		err := itemUsecase.Update(context.TODO(), mockItem.ID, &updateItemReq)

		assert.NotNil(t, err)
		mockRedisRepo.AssertExpectations(t)
		mockItemRepo.AssertExpectations(t)
	})
}

func TestItemUC_Delete(t *testing.T) {
	mockRedisRepo := new(mocks.RedisRepository)
	mockItemRepo := new(mocks.ItemRepository)
	mockItem := domain.Item{
		ID:        1,
		Name:      "name",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	t.Run("success", func(t *testing.T) {
		mockItemRepo.On("GetByID", mock.Anything, mock.AnythingOfType("int64")).Return(mockItem, nil).Once()
		mockItemRepo.On("Delete", mock.Anything, mock.AnythingOfType("int64")).Return(nil).Once()
		mockRedisRepo.On("Delete", mock.AnythingOfType("string")).Return(nil).Once()

		itemRepository := usecase.NewItemUsecase(mockItemRepo, mockRedisRepo, 60*time.Second)
		err := itemRepository.Delete(context.TODO(), mockItem.ID)

		assert.NoError(t, err)
		mockRedisRepo.AssertExpectations(t)
		mockItemRepo.AssertExpectations(t)
	})

	t.Run("item-not-exist", func(t *testing.T) {
		mockItemRepo.On("GetByID", mock.Anything, mock.AnythingOfType("int64")).Return(domain.Item{}, sql.ErrNoRows).Once()

		itemRepository := usecase.NewItemUsecase(mockItemRepo, mockRedisRepo, 60*time.Second)
		err := itemRepository.Delete(context.TODO(), mockItem.ID)

		assert.NotNil(t, err)
		mockRedisRepo.AssertExpectations(t)
		mockItemRepo.AssertExpectations(t)
	})

	t.Run("error-db", func(t *testing.T) {
		mockItemRepo.On("GetByID", mock.Anything, mock.AnythingOfType("int64")).Return(mockItem, nil).Once()
		mockItemRepo.On("Delete", mock.Anything, mock.AnythingOfType("int64")).Return(errors.New("Unexpected Error")).Once()

		itemRepository := usecase.NewItemUsecase(mockItemRepo, mockRedisRepo, 60*time.Second)
		err := itemRepository.Delete(context.TODO(), mockItem.ID)

		assert.NotNil(t, err)
		mockRedisRepo.AssertExpectations(t)
		mockItemRepo.AssertExpectations(t)
	})
}
