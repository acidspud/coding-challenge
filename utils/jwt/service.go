package jwt

import (
	"context"

	"github.com/golang-jwt/jwt/v5"
)

type JWTService interface {
	GenerateToken(ctx context.Context, userID int64) (token string, err error)
	ValidateToken(ctx context.Context, tokenString string) (token *jwt.Token, err error)
}
