const delay = (ctx, prop, time) => new Promise(resolve => (ctx[prop] = setTimeout(()=>{
  ctx[prop] = null
  resolve()
}, time)))

module.exports = {
  delay
}
