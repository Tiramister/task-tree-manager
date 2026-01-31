package main

import (
	"fmt"
	"os"
	"strings"

	"golang.org/x/crypto/bcrypt"
)

func main() {
	if len(os.Args) < 3 {
		fmt.Fprintln(os.Stderr, "Usage: adduser <username> <password>")
		os.Exit(1)
	}

	username := os.Args[1]
	password := os.Args[2]

	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: failed to hash password: %v\n", err)
		os.Exit(1)
	}

	escapedUsername := strings.ReplaceAll(username, "'", "''")

	fmt.Printf("INSERT INTO users (username, password_hash) VALUES ('%s', '%s');\n", escapedUsername, string(hash))
}
