package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"os/exec"
	"strings"
)

// Module represents a database module with its properties
type Module struct {
	Name      string
	CapName   string
	Directory string
	Type      string // "postgres"
}

// Database configuration - can be overridden by environment variables
func getDBConfig() map[string]string {
	config := map[string]string{
		"user":      getEnv("POSTGRES_USER", "piyushhbhutoria"),
		"password":  getEnv("POSTGRES_PASSWORD", "password"),
		"host":      getEnv("POSTGRES_HOST", "localhost"),
		"port":      getEnv("POSTGRES_PORT", "5432"),
		"sslmode":   getEnv("SSL_MODE", "disable"),
		"suffix":    getEnv("POSTGRES_SUFFIX", "_local"),
		"container": getEnv("POSTGRES_CONTAINER", "postgres17"),
	}
	return config
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func buildDBURL(module Module, config map[string]string) string {
	dbName := module.Name + config["suffix"]
	return fmt.Sprintf("postgresql://%s:%s@%s:%s/%s?sslmode=%s",
		config["user"], config["password"], config["host"], config["port"], dbName, config["sslmode"])
}

// getModules returns the list of all modules (PostgreSQL only)
func getModules() []Module {
	return []Module{
		// PostgreSQL modules
		{"dao", "Dao", "db/postgres/dao", "postgres"},
		{"dashboard", "Dashboard", "db/postgres/dashboard", "postgres"},
		{"discovery", "Discovery", "db/postgres/discovery", "postgres"},
		{"discussion", "Discussion", "db/postgres/discussion", "postgres"},
		{"job", "Job", "db/postgres/job", "postgres"},
		{"member", "Member", "db/postgres/member", "postgres"},
		{"project", "Project", "db/postgres/project", "postgres"},
		{"point", "Point", "db/postgres/point", "postgres"},
	}
}

// runCommand executes a command and returns output and error
func runCommand(name string, args ...string) ([]byte, error) {
	cmd := exec.Command(name, args...)
	return cmd.CombinedOutput()
}

// promptUser asks user for yes/no input
func promptUser(message string) bool {
	fmt.Print(message)
	reader := bufio.NewReader(os.Stdin)
	response, err := reader.ReadString('\n')
	if err != nil {
		log.Printf("Error reading input: %v", err)
		return false
	}
	response = strings.TrimSpace(strings.ToLower(response))
	return response == "y" || response == "yes"
}

// resetDatabase drops and recreates a database
func resetDatabase(module Module, config map[string]string) error {
	fmt.Printf("🗑️  Resetting database for %s (%s)...\n", module.Name, module.Type)

	// Drop database
	if output, err := runCommand("make", "dropdb"+module.Name); err != nil {
		fmt.Printf("⚠️  Warning: Failed to drop database %s: %s\n", module.Name, string(output))
	}

	// Create database
	if output, err := runCommand("make", "createdb"+module.Name); err != nil {
		return fmt.Errorf("failed to create database %s: %s", module.Name, string(output))
	}

	fmt.Printf("✅ Database %s reset successfully\n", module.Name)
	return nil
}

// forceReMigrate performs a force migration using Docker-based approach
func forceReMigrate(module Module, config map[string]string) error {
	fmt.Printf("🔧 Force migrating %s (%s)...\n", module.Name, module.Type)

	// Use Docker-based force migration (for PostgreSQL only)
	dbURL := buildDBURL(module, config)
	containerName := config["container"]

	// Get current working directory for volume mounting
	pwd, err := os.Getwd()
	if err != nil {
		return fmt.Errorf("failed to get current directory: %v", err)
	}

	args := []string{
		"run", "--rm",
		"--network", "container:" + containerName,
		"-v", pwd + ":/workspace",
		"-w", "/workspace",
		"migrate/migrate",
		"-path", module.Directory,
		"-database", dbURL,
		"force", "1",
	}

	if output, err := runCommand("docker", args...); err != nil {
		return fmt.Errorf("force migration failed for %s: %s", module.Name, string(output))
	}

	fmt.Printf("✅ Force migration completed for %s\n", module.Name)
	return nil
}

// handleMigrationError handles migration errors with user interaction
func handleMigrationError(module Module, config map[string]string, errorOutput []byte) {
	fmt.Printf("❌ Migration failed for %s (%s)\n", module.Name, module.Type)
	fmt.Printf("Error details: %s\n", string(errorOutput))

	// Option 1: Reset database
	if promptUser(fmt.Sprintf("🔄 Reset database for %s? (y/n): ", module.Name)) {
		if err := resetDatabase(module, config); err != nil {
			fmt.Printf("❌ Failed to reset database: %v\n", err)
		} else {
			// Try migration again after reset

			if output, err := runCommand("make", "migrateup"+module.Name); err != nil {
				fmt.Printf("❌ Migration still failed after reset: %s\n", string(output))
			} else {
				fmt.Printf("✅ Migration successful after reset for %s\n", module.Name)
				return
			}

		}
	}

	// Option 2: Force migration (PostgreSQL only)

	if promptUser(fmt.Sprintf("🔨 Force migrate %s? (y/n): ", module.Name)) {
		if err := forceReMigrate(module, config); err != nil {
			fmt.Printf("❌ Force migration failed: %v\n", err)
		} else {
			// Try migration again after force
			if output, err := runCommand("make", "migrateup"+module.Name); err != nil {
				fmt.Printf("⚠️  Migration still has issues after force: %s\n", string(output))
			} else {
				fmt.Printf("✅ Migration successful after force for %s\n", module.Name)
				return
			}
		}
	}

	fmt.Printf("⚠️  Please check %s migration manually\n", module.Name)
}

// displayConfiguration shows current database configuration
func displayConfiguration(config map[string]string) {
	fmt.Println("🔧 Database Configuration:")
	fmt.Println("  📊 PostgreSQL:")
	fmt.Printf("     User: %s\n", config["user"])
	fmt.Printf("     Host: %s:%s\n", config["host"], config["port"])
	fmt.Printf("     SSL Mode: %s\n", config["sslmode"])
	fmt.Printf("     DB Suffix: %s\n", config["suffix"])
	fmt.Printf("     Container: %s\n", config["container"])
	fmt.Println()
}

// checkPrerequisites verifies that required tools are available
func checkPrerequisites() error {
	// Check if Docker is available
	if _, err := runCommand("docker", "--version"); err != nil {
		return fmt.Errorf("Docker is not available. Please install Docker")
	}

	// Check if make is available
	if _, err := runCommand("make", "--version"); err != nil {
		return fmt.Errorf("Make is not available. Please install make")
	}

	return nil
}

func main() {
	fmt.Println("🚀 Database Migration Tool")
	fmt.Println("=========================")
	fmt.Println("🔄 Supporting PostgreSQL")

	// Check prerequisites
	if err := checkPrerequisites(); err != nil {
		log.Fatalf("❌ Prerequisites check failed: %v", err)
	}

	// Get configuration
	dbConfig := getDBConfig()
	displayConfiguration(dbConfig)

	// Get modules
	modules := getModules()

	// Track statistics
	var successful, failed int
	var pgSuccessful, pgFailed int

	fmt.Printf("📊 Processing %d modules (%d PostgreSQL)...\n\n",
		len(modules),
		len(getPostgreSQLModules(modules)))

	for i, module := range modules {
		dbIcon := "📊"

		fmt.Printf("[%d/%d] %s Processing %s (%s)...\n", i+1, len(modules), dbIcon, module.Name, module.Type)

		var err error
		var output []byte

		output, err = runCommand("make", "migrateup"+module.Name)

		if err != nil {
			failed++
			pgFailed++
			handleMigrationError(module, dbConfig, output)
		} else {
			successful++
			pgSuccessful++
			fmt.Printf("✅ Migration successful for %s (%s)\n", module.Name, module.Type)
		}

		fmt.Println() // Add spacing between modules
	}

	// Display final summary
	fmt.Println("📈 Migration Summary:")
	fmt.Printf("   ✅ Total Successful: %d\n", successful)
	fmt.Printf("   ❌ Total Failed: %d\n", failed)
	fmt.Printf("   📊 Total: %d\n", len(modules))
	fmt.Println()
	fmt.Println("   📊 PostgreSQL:")
	fmt.Printf("      ✅ Successful: %d\n", pgSuccessful)
	fmt.Printf("      ❌ Failed: %d\n", pgFailed)

	if failed > 0 {
		fmt.Println("\n⚠️  Some migrations failed. Please review the errors above.")
		os.Exit(1)
	} else {
		fmt.Println("\n🎉 All migrations completed successfully!")
	}
}

// Helper functions to filter modules by type
func getPostgreSQLModules(modules []Module) []Module {
	var pgModules []Module
	for _, module := range modules {
		if module.Type == "postgres" {
			pgModules = append(pgModules, module)
		}
	}
	return pgModules
}
