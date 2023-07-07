package request

import validation "github.com/go-ozzo/ozzo-validation"

// CreateItemReq represent create item request body
type CreateItemReq struct {
	Name      string `json:"name"`
	Qty       *int16 `json:"qty"`
	Threshold *int16 `json:"threshold"`
	Price     *int64 `json:"price"`
}

func (request CreateItemReq) Validate() error {
	return validation.ValidateStruct(
		&request,
		validation.Field(&request.Name, validation.Required),
		validation.Field(&request.Qty, validation.NotNil),
		validation.Field(&request.Threshold, validation.NotNil),
		validation.Field(&request.Price, validation.NotNil),
	)
}

// UpdateItemReq represent update item request body
type UpdateItemReq struct {
	Name      string `json:"name"`
	Qty       *int16 `json:"qty"`
	Threshold *int16 `json:"threshold"`
	Price     *int64 `json:"price"`
}

func (request UpdateItemReq) Validate() error {
	return validation.ValidateStruct(
		&request,
		validation.Field(&request.Name, validation.Required),
		validation.Field(&request.Qty, validation.NotNil),
		validation.Field(&request.Threshold, validation.NotNil),
		validation.Field(&request.Price, validation.NotNil),
	)
}
