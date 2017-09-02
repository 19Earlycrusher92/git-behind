#!/bin/sh
branch="origin/master"
update=$(git fetch -v --dry-run 2>&1 | grep "$branch" | grep -v "up to date")
if [ "$update" = "" ];
	then echo "Already up to date";
	else  echo "You are behind $branch";
fi
