'use babel';

//import GitBehindView from './git-behind-view';
import { CompositeDisposable } from 'atom';
//import { SAVE_URI, EDIT_URI } from './views/view-uri';
//import path from 'path'
//import exec from 'child_process'
const exec = require('child_process').exec;

//console.log (path)
//const StatusBarTileView = require('./git-behind-view');
/*
console.log('I have run')
let statusBarIcon = null;

module.exports = {
  activate(state) {
    console.log('git-behind activate...1')
    return requestIdleCallback(this.delayedActivate, {timeout: 10000})
  },

  consumeStatusBar(statusBar) {
    //statusBarIcon = new StatusBarTileView();
    //statusBarIcon.init();

    console.log('Hello')
    let msg = "Hello world2"
    span = document.createElement('span')
    span.textContent = msg
    return this.statusBarTile = statusBar.addLeftTile({item: span, priority: 100})
  },

  delayedActivate() {
    console.log('git-behind activate...2')
    //loadDependencies()
    //setupConfigs()
    //this.settingChangedObserver = atom.config.observe('wakatime', settingChangedHandler)
    //return checkPython()
  },

  deactivate() {
    //if (statusBarIcon != null) statusBarIcon.destroy()
    if (this.statusBarTile != null) this.statusBarTile.destroy()
    return this.statusBarTile = null
  }
}

//module.exports.activate();
*/

//*

//export default {

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

  //gitBehindView: null,
  //modalPanel: null,
  subscriptions: null,
  statusText: null,
  statusBar: null,

  activate(state) {
    // this.gitBehindView = new GitBehindView(state.gitBehindViewState);
    // this.modalPanel = atom.workspace.addModalPanel({
    //   item: this.gitBehindView.getElement(),
    //   visible: false
    // });

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
    //this.modalPanel.destroy();
    this.subscriptions.dispose();
    //this.statusText.destroy();
    this.statusBar.destroy();
    //this.statusText.parentNode.removeChild(this.statusText)
    //this.gitBehindView.destroy();
    //if (this.statusBar != null) this.statusBar.destroy();
    //return this.statusBar = null;
  },

  //serialize() {
  //  return {
  //    gitBehindViewState: this.gitBehindView.serialize()
  //  };
  //},

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

  //toggle() {
  //  console.log('GitBehind was toggled!');
  //  return (
  //    this.modalPanel.isVisible() ?
  //    this.modalPanel.hide() :
  //    this.modalPanel.show()
  //  );
  //},

};

//module.exports.activate(); // Self activate, because I could not figure it out.

//*/
