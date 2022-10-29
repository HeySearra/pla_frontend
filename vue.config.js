module.exports = {
    chainWebpack: config => {
    config
        .plugin('html')
        .tap(args => {
          args[0].title= '新冠疫情综合信息平台'
          return args
        })
    },
    configureWebpack: {
        externals: {
            "AMap": "AMap",
        },
    }
}
