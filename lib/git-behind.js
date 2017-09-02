'use babel';

import { CompositeDisposable } from 'atom';
const exec = require('child_process').exec;
//const when = require('when')
//const sequence = require('when/sequence');

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
    //let exec_p = this.exec_p
    let status = this.statusText
    let branch = 'origin/master'

    // Check if folder exsist
    let paths = atom.project.getPaths()
    if (!paths || !paths[0]) return console.log('Git Behind: No project open')
    let path = 'cd '+paths[0]+' && '

    // Check it's a git repo
    let cmd = '[ -d .git ] || git rev-parse --git-dir'
    exec(path+cmd, function (error, stdout, stderr) {
      if (error) return console.log('Git Behind: Not a git repo ', path, error)

      // Check if it has branch on origin
      let cmd = 'git show-branch remotes/'+branch
      exec(path+cmd, function (error, stdout, stderr) {
        if (error) return console.log('Git Behind: Branch doesn\'t exsist on origin', branch, error)

        let cmd = 'git fetch -v --dry-run 2>&1 | grep "'+branch+'"'
        exec(path+cmd, function (error, stdout, stderr) {
          if (error !== null) return console.log('Git Behind error:', error);
          console.log('X stdout: ' + stdout);
          console.log('X stderr: ' + stderr);
          // ✔︎ 🔴
          let msg = "✔︎"
          status.textContent = msg
        })
      })
      //console.log('result:', a)

    })

        /*
        //if (true) return;
        sequence(
          [function() {
            console.log('A')
            return exec_p('cd '+this.path+' && [ -d .git ] || git rev-parse --git-dir 2>&1')
          }]
          //[
          //() => this.exec_p('pwd'),
          //() => this.exec_p('cd / && pwd'),
          //() => this.exec_p('cd '+this.path+' && pwd'),
          //() => this.exec_p('pwd'),
          //]
        ).then(function(results) { // handle the results here
          console.log('B')
          console.log(results);
        }).otherwise(function(error) { // handle any errors here
          console.log('C')
          console.error(error.stack || error);
          process.exit(1);
        }).then(function() {
            console.log('D')
            return exec_p('cd '+this.path+' && pwd')
        }).then(function(results) { // handle the results here
          console.log('E')
          console.log(results);
        }).otherwise(function(error) { // handle any errors here
          console.log('F')
          console.error(error.stack || error);
          process.exit(1);
        })

        if (true) return;
        */
  },

  // Promise wrapper for exec
  exec_p(command, options) {
    options = options || {};
    var defer = when.defer();
    exec(command, options, function(error, stdout, stderr) {
      return error
        ? defer.reject(stderr + new Error(error.stack || error))
        : defer.resolve(stdout);
    });
    return defer.promise;
  }

};
