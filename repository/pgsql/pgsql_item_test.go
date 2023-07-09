package pgsql_test

import (
	"context"
	"regexp"
	"testing"
	"time"

	"github.com/acidspud/gotbot-coding-challange/domain"
	"github.com/acidspud/gotbot-coding-challange/repository/pgsql"
	"github.com/stretchr/testify/assert"
	"gopkg.in/DATA-DOG/go-sqlmock.v1"
)

func Ptr[T any](v T) *T {
	return &v
}

func TestItemRepo_Create(t *testing.T) {

	item := &domain.Item{
		Name:      "name",
		Qty:       Ptr(int16(5)),
		Threshold: Ptr(int16(2)),
		Price:     Ptr(int64(20)),
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	query := "INSERT INTO items"
	mock.ExpectExec(regexp.QuoteMeta(query)).
		WithArgs(
			item.Name,
			item.Qty,
			item.Threshold,
			item.Price,
			item.CreatedAt,
			item.UpdatedAt).
		WillReturnResult(sqlmock.NewResult(1, 1))

	itemRepo := pgsql.NewPgsqlItemRepository(db)
	err = itemRepo.Create(context.TODO(), item)
	assert.NoError(t, err)
}

func TestItemRepo_GetByID(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	itemMock := domain.Item{
		ID:        1,
		Name:      "name",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	rows := sqlmock.NewRows([]string{"id", "name", "qty", "threshold", "price", "created_at", "updated_at"}).
		AddRow(
			itemMock.ID,
			itemMock.Name,
			itemMock.Qty,
			itemMock.Threshold,
			itemMock.Price,
			itemMock.CreatedAt,
			itemMock.UpdatedAt)

	query := "SELECT id, name, qty, threshold, price, created_at, updated_at FROM items WHERE id = $1"
	mock.ExpectQuery(regexp.QuoteMeta(query)).
		WithArgs(1).
		WillReturnRows(rows)

	itemRepo := pgsql.NewPgsqlItemRepository(db)
	item, err := itemRepo.GetByID(context.TODO(), 1)
	assert.NoError(t, err)
	assert.NotNil(t, item)
	assert.Equal(t, itemMock.ID, item.ID)
}

func TestItemRepo_Fetch(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	mockItems := []domain.Item{
		{ID: 1, Name: "name", CreatedAt: time.Now(), UpdatedAt: time.Now()},
		{ID: 2, Name: "name 2", CreatedAt: time.Now(), UpdatedAt: time.Now()},
	}

	rows := sqlmock.NewRows([]string{"id", "name", "qty", "threshold", "price", "created_at", "updated_at"}).
		AddRow(
			mockItems[0].ID,
			mockItems[0].Name,
			mockItems[0].Qty,
			mockItems[0].Threshold,
			mockItems[0].Price,
			mockItems[0].CreatedAt,
			mockItems[0].UpdatedAt).
		AddRow(
			mockItems[1].ID,
			mockItems[1].Name,
			mockItems[0].Qty,
			mockItems[0].Threshold,
			mockItems[0].Price,
			mockItems[1].CreatedAt,
			mockItems[1].UpdatedAt)

	query := "SELECT id, name, qty, threshold, price, created_at, updated_at FROM items"
	mock.ExpectQuery(query).WillReturnRows(rows)

	itemRepo := pgsql.NewPgsqlItemRepository(db)
	items, err := itemRepo.Fetch(context.TODO())
	assert.NoError(t, err)
	assert.Len(t, items, 2)
}

func TestItemRepo_Update(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	item := &domain.Item{
		ID:        1,
		Name:      "name",
		Qty:       Ptr(int16(5)),
		Threshold: Ptr(int16(2)),
		Price:     Ptr(int64(20)),
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	query := "UPDATE items SET name = $1, qty = $2, threshold = $3, price = $4, updated_at = $5 WHERE id = $6"
	mock.ExpectExec(regexp.QuoteMeta(query)).
		WithArgs(
			item.Name,
			item.Qty,
			item.Threshold,
			item.Price,
			item.UpdatedAt,
			item.ID).
		WillReturnResult(sqlmock.NewResult(1, 1))

	itemRepo := pgsql.NewPgsqlItemRepository(db)
	err = itemRepo.Update(context.TODO(), item)
	assert.NoError(t, err)
}

func TestItemRepo_Delete(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	query := "DELETE FROM items WHERE id = $1"
	mock.ExpectExec(regexp.QuoteMeta(query)).
		WithArgs(1).
		WillReturnResult(sqlmock.NewResult(1, 1))

	itemRepo := pgsql.NewPgsqlItemRepository(db)
	err = itemRepo.Delete(context.TODO(), 1)
	assert.NoError(t, err)
}
