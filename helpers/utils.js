export const delay = (ctx, prop, time) => new Promise(resolve => (ctx[prop] = setTimeout(resolve, time)))
