export default async function serverAction(req, res) {
  const action = req.url.slice(9) // remove '/actions/'
  const _module = await import(`./actions/${action}.js`)
  const actionFunction = _module.default
  await actionFunction(req, res)
  res.redirect(302, `/${req.body.slug}`)
}
