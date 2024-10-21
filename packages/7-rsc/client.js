let currentPathname = window.location.pathname

async function navigate(pathname) {
  currentPathname = pathname
  // get the jsx after navigating to the new page
  const response = await fetch(`${pathname}?jsx`)
  const jsonString = await response.text()
  if (pathname === currentPathname) {
    console.log('jsonString', jsonString)
  }

  // if (pathname === currentPathname) {
  //   const res = /<body(.*?)>/.exec(html)
  //   const bodyStartIndex = res.index + res[0].length
  //   const bodyEndIndex = html.lastIndexOf('</body>')
  //   const bodyHTML = html.slice(bodyStartIndex, bodyEndIndex)
  //   // replace the html forcefully
  //   document.body.innerHTML = bodyHTML
  // }
}

window.addEventListener(
  'click',
  (e) => {
    const target = e.target

    // ignore clicks beyond a tag
    if (target?.tagName !== 'A') return

    // ignore "open in a new tab"
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

    // ignore links with target="_blank"
    const href = target?.getAttribute('href') ?? ''
    if (!href.startsWith('/')) return

    // prevent the default behavior
    e.preventDefault()

    // update the URL
    window.history.pushState(null, '', href)

    navigate(href)
  },
  true,
)
