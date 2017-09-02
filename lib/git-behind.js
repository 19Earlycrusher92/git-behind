'use babel';

import { CompositeDisposable } from 'atom';
const exec = require('child_process').exec;

module.exports = {
  config: {
    branch: {
      type: 'string',
      default: 'origin/master',
    },
    refresh: {
      type: 'string',
      default: '300',
    }
  },

  subscriptions: null,
  statusText: null,
  statusBar: null,

  activate(state) {

    let paths = atom.project.getPaths()
    if (!paths || !paths[0]) return console.log('git-behind: No project open;')
    this.path = paths[0];

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'git-behind:refresh': () => this.refresh()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
    this.statusBar.destroy();
  },

  consumeStatusBar(statusBar) {
    console.log('Init statusBar')
    this.statusText = document.createElement('span')
    this.statusText.textContent = "Origin..."
    this.statusBar = statusBar.addRightTile({item: this.statusText, priority: 100});
    this.refresh()
    return this.statusBar
  },

  refresh() {
    console.log('Refreshing...')
    //branch="origin/master"
    //update=$(git fetch -v --dry-run 2>&1 | grep "$branch" | grep -v "up to date")
    //if [ "$update" = "" ];
    //	then echo "Already up to date";
    //	else  echo "You are behind $branch";
    //fi
    let branch = 'origin/master'
    let cmd = 'git fetch -v --dry-run 2>&1 | grep "'+branch+'"'
    cmd = 'cd '+this.path+' && pwd'
    let run = exec(cmd, function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    })
    //console.log('result:', a)
    // ✔︎ 🔴
    let msg = "✔︎"
    this.statusText.textContent = msg
  },

};
