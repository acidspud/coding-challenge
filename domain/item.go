package domain

import (
	"context"
	"time"

	"github.com/acidspud/gotbot-coding-challange/transport/request"
)

type Item struct {
	ID        int64     `json:"id"`
	Name      string    `json:"name"`
	Qty       *int16    `json:"qty"`
	Threshold *int16    `json:"threshold"`
	Price     *int64    `json:"price"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// ItemRepository represent the items repository contract
type ItemRepository interface {
	Create(ctx context.Context, item *Item) error
	GetByID(ctx context.Context, id int64) (Item, error)
	Fetch(ctx context.Context) ([]Item, error)
	Update(ctx context.Context, item *Item) error
	Delete(ctx context.Context, id int64) error
}

// ItemUsecase represent the items usecase contract
type ItemUsecase interface {
	Create(ctx context.Context, request *request.CreateItemReq) error
	GetByID(ctx context.Context, id int64) (Item, error)
	Fetch(ctx context.Context) ([]Item, error)
	Update(ctx context.Context, id int64, request *request.UpdateItemReq) error
	Delete(ctx context.Context, id int64) error
}
