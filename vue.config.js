module.exports = {
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].gtag = process.env.VUE_APP_GTAG || '';
      return args;
    });
  },
  devServer: {
    compress: true,
    allowedHosts: "all",
    proxy: {
      "/api": {
        target: `${process.env.VUE_APP_API_URL}/`,
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
};