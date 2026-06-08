// Package sqldb provides per-module Postgres connections for the modular
// monolith. Each former microservice owned its own Postgres database, so the
// monolith keeps one *sql.DB per module (read from DATABASE_URL_<MODULE>)
// instead of the single global handle that samudai-pkg/db exposes.
package sqldb

import (
	"database/sql"
	"fmt"
	"os"

	"github.com/Samudai/samudai-pkg/logger"
	_ "github.com/lib/pq"
)

var (
	daoDB        *sql.DB
	memberDB     *sql.DB
	pointDB      *sql.DB
	projectDB    *sql.DB
	dashboardDB  *sql.DB
	discoveryDB  *sql.DB
	discussionDB *sql.DB
	jobDB        *sql.DB
)

// mustOpen opens (and pings) a Postgres connection from the given env var.
// It mirrors samudai-pkg/db.InitSQL semantics: fatal-exit on failure.
func mustOpen(envKey string) *sql.DB {
	conn, err := sql.Open("postgres", os.Getenv(envKey))
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database (%s): %v\n", envKey, err)
		os.Exit(1)
	}
	if err := conn.Ping(); err != nil {
		fmt.Fprintf(os.Stderr, "Unable to ping database (%s): %v\n", envKey, err)
		os.Exit(1)
	}
	logger.LogMessage("info", "postgres connected: %s", envKey)
	return conn
}

// InitAll opens every module connection. Call once at startup before serving.
func InitAll() {
	daoDB = mustOpen("DATABASE_URL_DAO")
	memberDB = mustOpen("DATABASE_URL_MEMBER")
	pointDB = mustOpen("DATABASE_URL_POINT")
	projectDB = mustOpen("DATABASE_URL_PROJECT")
	dashboardDB = mustOpen("DATABASE_URL_DASHBOARD")
	discoveryDB = mustOpen("DATABASE_URL_DISCOVERY")
	discussionDB = mustOpen("DATABASE_URL_DISCUSSION")
	jobDB = mustOpen("DATABASE_URL_JOB")
}

// CloseAll closes every open module connection.
func CloseAll() {
	for _, c := range []*sql.DB{daoDB, memberDB, pointDB, projectDB, dashboardDB, discoveryDB, discussionDB, jobDB} {
		if c != nil {
			_ = c.Close()
		}
	}
}

func Dao() *sql.DB        { return daoDB }
func Member() *sql.DB     { return memberDB }
func Point() *sql.DB      { return pointDB }
func Project() *sql.DB    { return projectDB }
func Dashboard() *sql.DB  { return dashboardDB }
func Discovery() *sql.DB  { return discoveryDB }
func Discussion() *sql.DB { return discussionDB }
func Job() *sql.DB        { return jobDB }
