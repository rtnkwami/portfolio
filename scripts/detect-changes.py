import subprocess
import json
from pathlib import Path
from os import environ
import sys

def find_affected_projects():
    query = subprocess.run(
        ["moon", "query", "affected", "-q", "--downstream", "deep"],
        capture_output = True
    )
    results = json.loads(query.stdout)

    if results == {}:
        return []
    
    affected: list[str] = []
    for project, _ in results["projects"].items():
        affected.append(project)
    
    return affected


def determine_projects_to_containerize(projects: list[str]):
    # run script using moon cli, otherwise this won't capture the env var
    workspace_root = environ.get("MOON_WORKSPACE_ROOT")
    containerize: list[str] = []
    
    if workspace_root is None:
        raise Exception("script is not being run in moon context")
    
    app_dir = workspace_root / Path("apps")

    for project in projects:
        project_dir = app_dir / project
        
        if not project_dir.exists():
            continue
    
        containerize.append(project)
    return containerize


def main():
    affected = find_affected_projects()
    projects = determine_projects_to_containerize(affected)
    print(json.dumps(projects))


if __name__ == "__main__":
    main()
