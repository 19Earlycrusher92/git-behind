'use babel';
import { CompositeDisposable } from 'atom';
const exec = require('child_process').exec;
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
      description: 'The branch you want to compare against, by default the origin/master so you know if you should pull/merge.',
      default: 'origin/master',
    },
    refresh: {
      type: 'string',
      description: 'How often to check for changes in seconds on origin, by default it\'s 5 minutes.',
      default: '300',
    }
  },

  subscriptions: null,
  statusBar: null,
  statusText: null,
  statusIcon: null,
  timeout: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'git-behind:refresh': () => this.refresh() // Trigger manual refresh
    }));
  },

  deactivate() {
    clearInterval(this.timeout);
    this.subscriptions.dispose();
    this.statusBar.destroy();
  },

  consumeStatusBar(statusBar) {
    let wrap = document.createElement('div')
    wrap.classList.add('inline-block')
		wrap.innerHTML = svg

    let status = document.createElement('span')
    status.classList.add('inline-block')
    status.textContent = 'Loading...'
    wrap.appendChild(status)

    this.statusText = status
    this.statusBar = statusBar.addRightTile({item: wrap, priority: 490});
    this.statusIcon = document.getElementById('git-behind-svg')
    this.statusIcon.setAttribute('fill','currentColor')
    this.timeout = setTimeout(this.refresh.bind(this), 2000)
    return this.statusBar
  },

  refresh() {
    let branch = atom.config.get('git-behind.branch')
		let status = this.statusText
    let icon = this.statusIcon
		let that = this

    // Prepare yourself for 4 layers of callback spagethi
    // Check if folder exsist
    let paths = atom.project.getPaths()
    if (!paths || !paths[0]) return console.log('Git Behind: No project open')
    let path = 'cd '+paths[0]+' && '

    // Check it's a git repo
    let cmd = '[ -d .git ] || git rev-parse --git-dir'
    exec(path+cmd, function (error, stdout, stderr) {
      if (error) return that.error('No git', 'Git Behind: Not a git repo '+path, error)

      // Check if it has branch on origin
      let cmd = 'git show-branch remotes/'+branch
      exec(path+cmd, function (error, stdout, stderr) {
        if (error) return that.error('No origin/branch', 'Git Behind: Branch doesn\'t exsist on origin'+branch, error)

        // Check if origin branch have changed
        let cmd = 'git fetch -v --dry-run 2>&1 | grep "'+branch+'"'
        exec(path+cmd, function (error, stdout, stderr) {
          if (error !== null) return that.error('Error', 'Git Behind error', error);
          if (stdout.includes('[up to date]')) {
            status.textContent = 'Up to date'
						icon.setAttribute('fill','currentColor')
          } else {
            status.textContent = 'Behind'
						icon.setAttribute('fill','#ff6200')
          }
          that.timeout = setTimeout(that.refresh.bind(that), atom.config.get('git-behind.refresh')*1000)
        })
      })
    })
  },

  error(title, msg, error) {
    console.log(msg, error)
    this.statusText.textContent = title
    this.statusIcon.setAttribute('fill','currentColor')
  }
};
