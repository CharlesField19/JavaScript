/**
 * Sub-Store script operator: normalize XHTTP path settings (fallback /byte).
 */
async function operator(proxies, targetPlatform, context) {
  return proxies.map(proxy => {
    if (proxy.network === 'xhttp') {
      const opts = proxy['xhttp-opts'] || {};

      const path =
        opts.path ||
        proxy.path ||
        proxy['xhttp-service-name'] ||
        '/byte';

      proxy.path = path;

      proxy['xhttp-opts'] = {
        ...opts,
        path: path
      };

      proxy['xhttp-service-name'] = path;
    }

    return proxy;
  });
}
