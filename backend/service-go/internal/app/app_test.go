package app

import (
	"testing"

	"github.com/gin-gonic/gin"
)

// TestNewEngine ensures every module's routes mount onto the shared engine
// without a duplicate method+path collision (gin panics at registration if so).
func TestNewEngine(t *testing.T) {
	gin.SetMode(gin.TestMode)
	defer func() {
		if r := recover(); r != nil {
			t.Fatalf("route registration panicked (likely duplicate route): %v", r)
		}
	}()

	engine := newEngine()
	routes := engine.Routes()
	if len(routes) == 0 {
		t.Fatal("expected routes to be registered, got 0")
	}
	t.Logf("registered %d routes across all modules", len(routes))
}
