package request

import validation "github.com/go-ozzo/ozzo-validation"

// CreateItemReq represent create item request body
type CreateItemReq struct {
	Name string `json:"name"`
}

func (request CreateItemReq) Validate() error {
	return validation.ValidateStruct(
		&request,
		validation.Field(&request.Name, validation.Required),
	)
}

// UpdateItemReq represent update item request body
type UpdateItemReq struct {
	Name string `json:"name"`
}

func (request UpdateItemReq) Validate() error {
	return validation.ValidateStruct(
		&request,
		validation.Field(&request.Name, validation.Required),
	)
}
