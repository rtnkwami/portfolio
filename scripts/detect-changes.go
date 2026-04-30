package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/exec"
)

type Project struct {
	Files []string `json:"files"`
	Tasks []string `json:"tasks"`
	Other bool `json:"other"`
}

type Task struct {
	Files []string `json:"files"`
	Upstream []string `json:"upstream"`
	Other bool `json:"other"`
}

type Affected struct {
	Projects map[string]Project `json:"projects"`
	Tasks map[string]Task `json:"tasks"`
}

func main()  {
	cmd := exec.Command("moon", "query", "affected", "--downstream", "deep")
	cmd.Stderr = os.Stderr
	cmdRes, err := cmd.Output()

	if err != nil {
		log.Fatal(err)
	}
	
	var affected Affected
	err = json.Unmarshal(cmdRes, &affected)

	if err != nil {
		log.Fatal("Error parsing JSON: ", err)
	}

	toPublish  := []string{}
	
	for project := range affected.Projects {
		if project != "eks" && project != "scripts" {
			toPublish = append(toPublish, project)
		}
	}

	changed, err := json.Marshal(toPublish)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Print(string(changed))
}