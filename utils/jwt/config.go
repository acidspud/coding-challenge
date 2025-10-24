package jwt

import "github.com/golang-jwt/jwt/v5"

type jwtCustomClaims struct {
	UserID int64 `json:"user_id"`
	jwt.RegisteredClaims
}
