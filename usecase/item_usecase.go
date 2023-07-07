package usecase

import (
	"context"
	"database/sql"
	"encoding/json"
	"time"

	"github.com/acidspud/gotbot-coding-challange/domain"
	"github.com/acidspud/gotbot-coding-challange/repository/redis"
	"github.com/acidspud/gotbot-coding-challange/transport/request"
	"github.com/acidspud/gotbot-coding-challange/utils"
)

type itemUsecase struct {
	itemRepo   domain.ItemRepository
	redisRepo  redis.RedisRepository
	ctxTimeout time.Duration
}

// NewItemUsecase will create new an itemUsecase object representation of ItemUsecase interface
func NewItemUsecase(itemRepo domain.ItemRepository, redisRepo redis.RedisRepository, ctxTimeout time.Duration) *itemUsecase {
	return &itemUsecase{
		itemRepo:   itemRepo,
		redisRepo:  redisRepo,
		ctxTimeout: ctxTimeout,
	}
}

func (u *itemUsecase) Create(c context.Context, request *request.CreateItemReq) (err error) {
	ctx, cancel := context.WithTimeout(c, u.ctxTimeout)
	defer cancel()

	err = u.itemRepo.Create(ctx, &domain.Item{
		Name:      request.Name,
		Qty:       request.Qty,
		Threshold: request.Threshold,
		Price:     request.Price,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	})

	if err == nil {
		u.redisRepo.Delete("items")
	}

	return
}

func (u *itemUsecase) GetByID(c context.Context, id int64) (item domain.Item, err error) {
	ctx, cancel := context.WithTimeout(c, u.ctxTimeout)
	defer cancel()

	item, err = u.itemRepo.GetByID(ctx, id)
	if err != nil && err == sql.ErrNoRows {
		err = utils.NewNotFoundError("item not found")
		return
	}
	return
}

func (u *itemUsecase) Fetch(c context.Context) (items []domain.Item, err error) {
	ctx, cancel := context.WithTimeout(c, u.ctxTimeout)
	defer cancel()

	itemsCached, _ := u.redisRepo.Get("items")
	if err = json.Unmarshal([]byte(itemsCached), &items); err == nil {
		return
	}

	items, err = u.itemRepo.Fetch(ctx)
	if err != nil {
		return
	}

	itemsString, _ := json.Marshal(&items)
	u.redisRepo.Set("items", itemsString, 30*time.Second)
	return
}

func (u *itemUsecase) Update(c context.Context, id int64, request *request.UpdateItemReq) (err error) {
	ctx, cancel := context.WithTimeout(c, u.ctxTimeout)
	defer cancel()

	item, err := u.itemRepo.GetByID(ctx, id)
	if err != nil {
		if err == sql.ErrNoRows {
			err = utils.NewNotFoundError("item not found")
			return
		}
		return
	}

	item.Name = request.Name
	item.Qty = request.Qty
	item.Threshold = request.Threshold
	item.Price = request.Price

	item.UpdatedAt = time.Now()

	err = u.itemRepo.Update(ctx, &item)

	if err == nil {
		u.redisRepo.Delete("items")
	}

	return
}

func (u *itemUsecase) Delete(c context.Context, id int64) (err error) {
	ctx, cancel := context.WithTimeout(c, u.ctxTimeout)
	defer cancel()

	_, err = u.itemRepo.GetByID(ctx, id)
	if err != nil {
		if err == sql.ErrNoRows {
			err = utils.NewNotFoundError("item not found")
			return
		}
		return
	}

	err = u.itemRepo.Delete(ctx, id)

	if err == nil {
		u.redisRepo.Delete("items")
	}

	return
}
