// Code generated by mockery v1.0.0. DO NOT EDIT.

package mocks

import context "context"
import domain "github.com/acidspud/coding-challange/domain"
import mock "github.com/stretchr/testify/mock"

// ItemRepository is an autogenerated mock type for the ItemRepository type
type ItemRepository struct {
	mock.Mock
}

// Create provides a mock function with given fields: ctx, item
func (_m *ItemRepository) Create(ctx context.Context, item *domain.Item) error {
	ret := _m.Called(ctx, item)

	var r0 error
	if rf, ok := ret.Get(0).(func(context.Context, *domain.Item) error); ok {
		r0 = rf(ctx, item)
	} else {
		r0 = ret.Error(0)
	}

	return r0
}

// Delete provides a mock function with given fields: ctx, id
func (_m *ItemRepository) Delete(ctx context.Context, id int64) error {
	ret := _m.Called(ctx, id)

	var r0 error
	if rf, ok := ret.Get(0).(func(context.Context, int64) error); ok {
		r0 = rf(ctx, id)
	} else {
		r0 = ret.Error(0)
	}

	return r0
}

// Fetch provides a mock function with given fields: ctx
func (_m *ItemRepository) Fetch(ctx context.Context) ([]domain.Item, error) {
	ret := _m.Called(ctx)

	var r0 []domain.Item
	if rf, ok := ret.Get(0).(func(context.Context) []domain.Item); ok {
		r0 = rf(ctx)
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).([]domain.Item)
		}
	}

	var r1 error
	if rf, ok := ret.Get(1).(func(context.Context) error); ok {
		r1 = rf(ctx)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// GetByID provides a mock function with given fields: ctx, id
func (_m *ItemRepository) GetByID(ctx context.Context, id int64) (domain.Item, error) {
	ret := _m.Called(ctx, id)

	var r0 domain.Item
	if rf, ok := ret.Get(0).(func(context.Context, int64) domain.Item); ok {
		r0 = rf(ctx, id)
	} else {
		r0 = ret.Get(0).(domain.Item)
	}

	var r1 error
	if rf, ok := ret.Get(1).(func(context.Context, int64) error); ok {
		r1 = rf(ctx, id)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// Update provides a mock function with given fields: ctx, item
func (_m *ItemRepository) Update(ctx context.Context, item *domain.Item) error {
	ret := _m.Called(ctx, item)

	var r0 error
	if rf, ok := ret.Get(0).(func(context.Context, *domain.Item) error); ok {
		r0 = rf(ctx, item)
	} else {
		r0 = ret.Error(0)
	}

	return r0
}
