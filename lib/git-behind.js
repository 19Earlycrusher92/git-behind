'use babel';

import { CompositeDisposable } from 'atom';
const exec = require('child_process').exec;
//const when = require('when')
//const sequence = require('when/sequence');

const svg = ' \
<svg id="git-behind-svg" style="padding-top: 4px; margin-right: -4px;" width="20px" height="24px" fill="currentColor" viewBox="0 0 96 96" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid"> \
<g id="XMLID_1_"> \
	<path id="XMLID_7_" class="st0" d="M66.6,43.4c-3.4,0-6.4,1.9-8,4.7V48C53.7,47.9,48,46.4,44,43.3c-3.5-2.7-7-7.5-8.8-11.3 \
		c2.1-1.7,3.5-4.3,3.5-7.2c0-5.1-4.1-9.3-9.3-9.3s-9.3,4.2-9.3,9.3c0,3.4,1.9,6.4,4.6,8v30.4c-2.7,1.6-4.6,4.6-4.6,8 \
		c0,5.1,4.1,9.3,9.3,9.3s9.3-4.1,9.3-9.3c0-3.4-1.9-6.4-4.6-8V46.5c3.1,3.2,6.7,5.9,10.7,7.8s9.4,2.9,13.8,3v-0.1 \
		c1.7,2.8,4.6,4.7,8,4.7c5.1,0,9.3-4.1,9.3-9.3S71.7,43.4,66.6,43.4z M35,71.2c0,3.1-2.6,5.6-5.6,5.6s-5.6-2.6-5.6-5.6 \
		s2.6-5.6,5.6-5.6S35,68.2,35,71.2z M29.4,30.4c-3.1,0-5.6-2.6-5.6-5.6s2.6-5.6,5.6-5.6s5.6,2.6,5.6,5.6S32.5,30.4,29.4,30.4z \
		 M66.6,58.2c-3.1,0-5.6-2.6-5.6-5.6c0-3,2.6-5.6,5.6-5.6c3,0,5.6,2.6,5.6,5.6C72.1,55.7,69.6,58.2,66.6,58.2z"/> \
</g> \
</svg> \
'

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
  statusBar: null,
  statusText: null,
  statusIcon: null,
  interval: null,

  activate(state) {

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'git-behind:refresh': () => this.refresh()
    }));
  },

  deactivate() {
    clearInterval(this.interval);
    this.subscriptions.dispose();
    this.statusBar.destroy();
  },

  consumeStatusBar(statusBar) {
    console.log('Init statusBar')
    let wrap = document.createElement('div')
    wrap.classList.add('inline-block')
		wrap.innerHTML = svg

    //let icon = document.createElement('div')
		//icon.setAttribute('id','git-behind-svg')
		//icon.setAttribute('version','1.1')
		//icon.setAttribute('width','18px')
		//icon.setAttribute('height','18px')
		//icon.setAttribute('viewBox','0 0 96 96')
		//icon.setAttribute('xmlns','http://www.w3.org/2000/svg')
		//icon.setAttribute('xmlns:xlink','http://www.w3.org/1999/xlink')
		//icon.innerHTML = svg

		//icon.setAttribute('preserveAspectRatio','xMidYMid')
		//version="1.1"
		//xmlns="http://www.w3.org/2000/svg"
		//xmlns:xlink="http://www.w3.org/1999/xlink"
		//id="Layer_1"
		//x="0px" y="0px"
		//viewBox="0 0 96 96"
		//style="enable-background:new 0 0 96 96;"
		//xml:space="preserve"

		//<svg id="wakatime-svg" width="18px" height="18px" viewBox="0 0 256 256" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid">
		//<g><path d="M128,0 C57.308,0 0,57.308 0,128 C0,198.693 57.308,256 128,256 C198.693,256 256,198.693 256,128 C256,57.308 198.693,0 128,0 M128,33.805 C179.939,33.805 222.195,76.061 222.195,128 C222.195,179.94 179.939,222.195 128,222.195 C76.061,222.195 33.805,179.94 33.805,128 C33.805,76.061 76.061,33.805 128,33.805 M115.4993,155.6431 L115.3873,155.6431 C113.4353,155.6081 111.6083,154.6751 110.4343,153.1151 L81.5593,114.7321 C79.4553,111.9351 80.0173,107.9611 82.8143,105.8561 C85.6123,103.7511 89.5853,104.3131 91.6903,107.1111 L115.6833,139.0051 L122.5463,130.5271 C123.7493,129.0411 125.5603,128.1771 127.4723,128.1771 L127.4803,128.1771 C129.3973,128.1791 131.2093,129.0471 132.4103,130.5411 L139.0003,138.7281 L176.6923,90.1341 C178.8353,87.3681 182.8173,86.8651 185.5843,89.0111 C188.3493,91.1561 188.8533,95.1371 186.7073,97.9041 L144.1003,152.8371 C142.9143,154.3681 141.0883,155.2721 139.1503,155.2901 L139.0933,155.2901 C137.1743,155.2901 135.3583,154.4221 134.1553,152.9261 L127.4583,144.6071 L120.4253,153.2931 C119.2213,154.7811 117.4103,155.6431 115.4993,155.6431" fill="#000000"></path></g>
		//</svg>
    //wrap.appendChild(icon)

    let status = document.createElement('span')
    status.classList.add('inline-block')
    status.textContent = 'Origin...'
    wrap.appendChild(status)

    //this.statusIcon = icon
    this.statusText = status
    this.statusBar = statusBar.addRightTile({item: wrap, priority: 490});
    this.statusIcon = document.getElementById('git-behind-svg')
    this.statusIcon.setAttribute('fill','currentColor')
    setTimout(this.refresh.bind(this), 1000)
    this.interval = setInterval(this.refresh.bind(this), 10000)
    return this.statusBar
  },

  refresh() {
    console.log('Refreshing...')
    //let exec_p = this.exec_p
		let icon = this.statusIcon
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

        // Check if origin branch have changed
        let cmd = 'git fetch -v --dry-run 2>&1 | grep "'+branch+'"'
        exec(path+cmd, function (error, stdout, stderr) {
          if (error !== null) return console.log('Git Behind error:', error);
          if (stdout.includes('[up to date]')) {
            status.textContent = 'Up to date'
						icon.setAttribute('fill','currentColor')
          } else {
            status.textContent = 'Behind'
						icon.setAttribute('fill','#ff6200')
          }
          //console.log('X stdout:' + stdout);
          //console.log('X stderr:' + stderr);

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
