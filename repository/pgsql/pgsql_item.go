package pgsql

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/acidspud/coding-challange/domain"
)

type pgsqlItemRepository struct {
	db *sql.DB
}

// NewPgsqlItemRepository will create new an itemRepository object representation of ItemRepository interface
func NewPgsqlItemRepository(db *sql.DB) *pgsqlItemRepository {
	return &pgsqlItemRepository{
		db: db,
	}
}

func (r *pgsqlItemRepository) Create(ctx context.Context, item *domain.Item) (err error) {
	query := "INSERT INTO items (name, qty, threshold, price, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6)"
	_, err = r.db.ExecContext(ctx, query,
		item.Name,
		item.Qty,
		item.Threshold,
		item.Price,
		item.CreatedAt,
		item.UpdatedAt)
	return
}

func (r *pgsqlItemRepository) GetByID(ctx context.Context, id int64) (item domain.Item, err error) {
	query := "SELECT id, name, qty, threshold, price, created_at, updated_at FROM items WHERE id = $1"
	err = r.db.QueryRowContext(ctx, query, id).Scan(
		&item.ID,
		&item.Name,
		&item.Qty,
		&item.Threshold,
		&item.Price,
		&item.CreatedAt,
		&item.UpdatedAt)
	return
}

func (r *pgsqlItemRepository) Fetch(ctx context.Context) (items []domain.Item, err error) {
	query := "SELECT id, name, qty, threshold, price, created_at, updated_at FROM items"
	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return items, err
	}

	defer rows.Close()

	for rows.Next() {
		var item domain.Item
		err := rows.Scan(
			&item.ID,
			&item.Name,
			&item.Qty,
			&item.Threshold,
			&item.Price,
			&item.CreatedAt,
			&item.UpdatedAt)
		if err != nil {
			return items, err
		}

		items = append(items, item)
	}

	return items, nil
}

func (r *pgsqlItemRepository) Update(ctx context.Context, item *domain.Item) (err error) {
	query := "UPDATE items SET name = $1, qty = $2, threshold = $3, price = $4, updated_at = $5 WHERE id = $6"
	res, err := r.db.ExecContext(ctx, query,
		item.Name,
		item.Qty,
		item.Threshold,
		item.Price,
		item.UpdatedAt,
		item.ID)
	if err != nil {
		return
	}

	affect, err := res.RowsAffected()
	if err != nil {
		return
	}

	if affect != 1 {
		err = fmt.Errorf("weird behavior, total affected: %d", affect)
	}

	return
}

func (r *pgsqlItemRepository) Delete(ctx context.Context, id int64) (err error) {
	query := "DELETE FROM items WHERE id = $1"
	res, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return
	}

	affect, err := res.RowsAffected()
	if err != nil {
		return
	}

	if affect != 1 {
		err = fmt.Errorf("weird behavior, total affected: %d", affect)
	}

	return
}
