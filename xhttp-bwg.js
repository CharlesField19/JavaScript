/**
 * Sub-Store script operator: normalize XHTTP path settings (fallback /bwg2).
 *
 * Keep this file dependency-free so it can be loaded from GitHub Raw.
 */
async function operator(proxies, targetPlatform, context) {
  return proxies.map(proxy => {
    if (proxy.network === 'xhttp') {
      const opts = proxy['xhttp-opts'] || {};

      const path =
        opts.path ||
        proxy.path ||
        proxy['xhttp-service-name'] ||
        '/bwg2';

      proxy.path = path;

      proxy['xhttp-opts'] = {
        ...opts,
        path
      };

      proxy['xhttp-service-name'] = path;
    }

    return proxy;
  });
}
