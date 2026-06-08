package pluginsvc

import store "github.com/Samudai/backend/services/plugin/internal/store"

// InitStore initialises the plugin object store. It must be called after the
// shared Mongo client is connected. Exposed so the app entrypoint can invoke it
// without importing the plugin's internal package directly.
func InitStore() {
	store.Init()
}
