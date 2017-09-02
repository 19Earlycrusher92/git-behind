# Atom: Git Behind

*Want to be reminded of the latest changes your team is doing?*

Git Behind will tell you when your local branch falls behind the origin/master branch or any origin branch you specify.

![screenshot](https://raw.githubusercontent.com/ecker00/git-behind/master/demo.gif)

In the simplest terms, this package runs the command `git fetch -v --dry-run` every few minutes and looks if the specified branch is `[up to date]` or not.
