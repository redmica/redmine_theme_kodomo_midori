const themeInfo = {
  version: '1.0.1',
  author: 'Akiko Takano',
  url: 'https://github.com/akiko-pusu/redmine_theme_kodomo_midori',
  name: 'Kodomo Redmine green version',
  description: 'Redmine theme for kids and children green version.'
}

// Script to append "Great Job!" message when access the closed issue.
const setCloseRibbon = () => {
  if (document.body.classList.contains('controller-issues') && document.body.classList.contains('action-show')) {
    const closedIssue = document.querySelector('div#content div.issue.closed')
    if (closedIssue) {
      let ribbon = document.createElement('div')
      ribbon.setAttribute('class', 'ribbon-content')

      let ribbonContent = document.createElement('span')
      ribbonContent.setAttribute('class', 'ribbon')
      ribbonContent.innerHTML = '★ Great Job ★'

      ribbon.appendChild(ribbonContent)
      document.body.appendChild(ribbon)
    }
  }
}

// This style is effective only for Redmine 4.0.x or before.
const displayChangeSets = () => {
  let changeSets = document.querySelectorAll('div#issue-changesets > div.changeset')
  if (changeSets == undefined) {
    return false
  }

  for (let i = 0; i < changeSets.length; i++) {
    let changeSet = changeSets[i]
    if (changeSet.style.display == 'block') {
      changeSet.style.display = 'none'
    } else {
      changeSet.style.display = 'block'
    }
  }
}

const setIssueStyle = () => {
  if (document.body.classList.contains('controller-issues') || document.body.classList.contains('action-show')) {
    const changeSetheader = document.querySelector('div#issue-changesets > h3')
    if (changeSetheader) {
      changeSetheader.addEventListener('click', displayChangeSets, false)
    }
  }
}

let preventEvent = true

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function waitAction (event) {
  let wrapper = document.getElementById('wrapper')
  if (wrapper && preventEvent) {
    setLoadingHtml()
    let message = 'Great work!'
    if (this.action === 'login') {
      message = 'Welcome!'
    }

    event.preventDefault()
    event.stopPropagation()
    displayLoading(message)
    await sleep(1500)
    preventEvent = false
    event.target.click()
  }
}

const setThemeInfo = () => {
  let footer = document.querySelector('div.bgr') ? document.querySelector('div.bgr') : document.querySelector('div#footer')
  if (footer) {
    let infoText = ''
    const classList = document.body.classList
    if (classList.contains('controller-account') ||
      classList.contains('controller-welcome') ||
      (classList.contains('controller-admin') && classList.contains('action-info'))) {
      infoText = '<div class="theme_description"><pre>'
      for (let key in themeInfo) {
        infoText = infoText + key + ' : ' + themeInfo[key] + '\n'
      }
      infoText = infoText + '</pre></div>'
    }

    let beforeText = '/ Theme: <span id="theme_info"><a href="' + themeInfo['url'] +
      '" rel="noopener noreferrer" target="_blank">Kodomo Redmine green</a>' + infoText + '</span> version'
    footer.innerHTML += beforeText

    // hide Wiki
    let wiki = document.querySelector('body.controller-welcome.action-index div#content div.splitcontentleft > .wiki')
    if (wiki != undefined && wiki.innerText === '') {
      wiki.setAttribute('style', 'display: none;')
    }
  }
}

const displayLoading = (message) => {
  let target = document.getElementById('bowl_ringG')
  let wrapper = document.getElementById('wrapper')
  target.setAttribute('style', 'display: block;')
  wrapper.setAttribute('style', 'opacity: 0.2;')
  target.setAttribute('class', 'hide')

  let loadingMsg = document.getElementById('loading_msg')
  if (loadingMsg) {
    loadingMsg.textContent = message
  }
}

const setLoading = (event) => {
  let loginLink = document.querySelector('input#login-submit')
  let logoutLink = document.querySelector('a.logout')

  if (loginLink) {
    loginLink.addEventListener('click', {
      action: 'login',
      handleEvent: waitAction
    }, false)
  }
  if (logoutLink) {
    logoutLink.addEventListener('click', {
      action: 'logout',
      handleEvent: waitAction
    }, false)
  }
}

const setLoadingHtml = () => {
  // IE11 not support literal..... ;-(
  /*
  let loaderHtml = `
  <div id="bowl_ringG">
    <div class="ball_holderG">
      <div class="ballG">
      </div>
    </div>
    <span id="loading_msg"></span>
  </div>
  `
  */

  let loaderHtml = '<div id="bowl_ringG">' +
    '<div class="ball_holderG">' +
    '<div class="ballG">' +
    '</div>' +
    '</div>' +
    '<span id="loading_msg"></span>' +
    '</div>'

  let wrapper = document.getElementById('wrapper')
  if (wrapper) {
    wrapper.insertAdjacentHTML('afterend', loaderHtml)
  }
}

// for Wiki Presentation mode
const switchWikiPresentationMode = () => {
  let wiki = document.querySelector('div.wiki.wiki-page')

  let wrapper = document.createElement('div')

  let section = null
  let sectionCount = 0

  let titles = []

  for (let i = 0; i < wiki.childElementCount; i++) {
    let element = wiki.children[i]
    if (element.tagName === 'A' && element.hasAttribute('name')) {
      sectionCount++
      if (section == null) {
        section = document.createElement('section')
        section.setAttribute('id', 'slide-section-' + sectionCount)
        section.style.height = document.body.clientHeight
      } else {
        wrapper.appendChild(section)
        section = null
      }
      titles.push(element.getAttribute('name'))
      continue
    }
    if (element.tagName !== 'A' && element.hasAttribute('name') === false) {
      if (section == null) {
        section = document.createElement('section')
        section.setAttribute('id', 'slide-section-' + sectionCount)
      }

      let cloneElement = element.cloneNode(true)
      if (cloneElement.tagName === 'H1') {
        let titleWrapper = document.createElement('div')
        titleWrapper.appendChild(cloneElement)
        titleWrapper.setAttribute('class', 'titleWrapper')
        section.appendChild(titleWrapper)
      } else {
        section.appendChild(cloneElement)
      }
    }
  }

  // set last section into erapper
  if (section.childElementCount > 0) {
    wrapper.appendChild(section)
  }

  if (wrapper.childElementCount > 0) {
    let firstSection = wrapper.children[0]
    if (firstSection.firstChild.getAttribute('class') === 'titleWrapper') {
      let titleWrapper = firstSection.firstChild
      for (let i = 1; i < firstSection.childElementCount - 1; i++) {
        let element = firstSection.children[i]
        titleWrapper.appendChild(element)
      }
    }
  }

  if (wrapper.childElementCount > 1) {
    let lastSection = wrapper.lastChild
    if (lastSection.firstChild.getAttribute('class') === 'titleWrapper') {
      let titleWrapper = lastSection.firstChild
      for (let i = 1; i < lastSection.childElementCount; i++) {
        let element = lastSection.children[i]
        titleWrapper.appendChild(element)
      }
    }
  }

  let nav = document.createElement('nav')
  nav.setAttribute('id', 'pagination')
  nav.setAttribute('class', 'pagination')

  for (let c = 1; c <= wrapper.childElementCount; c++) {
    let navItem = document.createElement('a')
    navItem.setAttribute('id', 'pagination-' + c)
    navItem.setAttribute('href', '#slide-section-' + c)
    navItem.setAttribute('title', titles[c - 1])

    let toolTip = document.createElement('span')
    toolTip.setAttribute('class', 'tooltiptext')
    toolTip.innerText = titles[c - 1]

    navItem.appendChild(toolTip)
    nav.appendChild(navItem)
  }

  let closeNavItem = document.createElement('a')
  closeNavItem.setAttribute('titile', 'Exit full screen')
  closeNavItem.setAttribute('class', 'close')

  let toolTip = document.createElement('span')
  toolTip.setAttribute('class', 'tooltiptext')
  toolTip.innerHTML = "<span class='tooltiptext'>Quit Presentation</span>"

  closeNavItem.appendChild(toolTip)
  closeNavItem.addEventListener('click', function () {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    }
    document.location.reload()
  })
  nav.appendChild(closeNavItem)

  let slideWiki = wiki.cloneNode(true)
  slideWiki.innerHTML = wrapper.innerHTML
  slideWiki.classList.add('fullPageScroll')
  slideWiki.appendChild(nav)

  if (document.getElementById('header')) {
    document.getElementById('header').style.display = 'none'
  }
  document.body.appendChild(slideWiki)
}

const readyWikiPresentation = (target) => {
  let slideIcon = document.createElement('a')
  slideIcon.setAttribute('class', 'material-icons icon-slideshow')
  slideIcon.innerText = 'slideshow'

  target.insertBefore(slideIcon, target.firstChild)

  slideIcon.addEventListener('click', switchWikiPresentationMode)
}

const wikiPresentation = () => {
  let targetElement = document.querySelector('body.controller-wiki.action-show div.contextual')
  if (targetElement) {
    readyWikiPresentation(targetElement)
  }
}
// for Wiki Presentation mode

// main
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setThemeInfo)
  document.addEventListener('DOMContentLoaded', setCloseRibbon)
  document.addEventListener('DOMContentLoaded', setLoading)
  document.addEventListener('DOMContentLoaded', setIssueStyle)
  document.addEventListener('DOMContentLoaded', wikiPresentation)
}
