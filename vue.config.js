const PrerenderSPAPlugin = require('prerender-spa-plugin');
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;
const path = require('path')
const debug = process.env.NODE_ENV !== 'production'

module.exports = {
    publicPath: '/', // 根域上下文目录
    outputDir: 'dist', // 构建输出目录
    assetsDir: 'assets', // 静态资源目录 (js, css, img, fonts)
    lintOnSave: false, // 是否开启eslint保存检测，有效值：ture | false | 'error'
    runtimeCompiler: true, // 运行时版本是否需要编译
    transpileDependencies: ['vue-echarts', 'resize-detector'], // 默认babel-loader忽略mode_modules，这里可增加例外的依赖包名
    productionSourceMap: true, // 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度
    configureWebpack: config => { // webpack配置，值位对象时会合并配置，为方法时会改写配置
        if (debug) { // 开发环境配置
            config.devtool = 'cheap-module-eval-source-map'
        } else { // 生产环境配置
            return {
                plugins: [
                    // 预渲染
                    new PrerenderSPAPlugin({
                        // 生成文件的路径，与webpakc打包的一致。
                        // 下面这句话非常重要！！！
                        // 这个目录只能有一级，如果目录层次大于一级，在生成的时候不会有任何错误提示，在预渲染的时候只会卡着不动。
                        staticDir: path.join(__dirname, 'dist'),
                        // 对应自己的路由文件，比如a有参数，就需要写成 /a/param1。
                        routes: ['/', '/login', '/register'],
                        // 这个很重要，如果没有配置这段，也不会进行预编译
                        renderer: new Renderer({
                            // inject: {
                            //     foo: 'bar'
                            // },
                            headless: false,
                            // 在 main.js 中 document.dispatchEvent(new Event('render-event'))，两者的事件名称要对应上。
                            renderAfterDocumentEvent: 'render-event'
                        })
                    }),
                ],
            };
        }
        // Object.assign(config, { // 开发生产共同配置
        //     resolve: {
        //         alias: {
        //             '@': path.resolve(__dirname, './src'),
        //             '@c': path.resolve(__dirname, './src/components'),
        //             'vue$': 'vue/dist/vue.esm.js'
        //         }
        //     }
        // })
    },
    chainWebpack: config => { // webpack链接API，用于生成和修改webapck配置，https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
        if (debug) {
            // 本地开发配置
        } else {
            // 生产开发配置
        }
    },
    parallel: require('os').cpus().length > 1, // 构建时开启多进程处理babel编译
    pluginOptions: { // 第三方插件配置
    },
    pwa: { // 单页插件相关配置 https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
        name: 'online-answer',
        themeColor: '#4DBA87',
        msTileColor: '#000000',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'black',

        //   使用自己的server-worker文件
        // configure the workbox plugin
        workboxPluginMode: 'InjectManifest',
        workboxOptions: {
            // swSrc is required in InjectManifest mode.
            swSrc: 'dev/service-worker.js',
            // ...other Workbox options...
        }
    },
    devServer: {
        // 自动打开浏览器
        open: true,
        host: 'localhost',
        port: 8081,
        https: false,
        hotOnly: false,
        proxy: { // 配置跨域
            '/api': {
                target: 'http://localhost:5000',
                ws: true,
                changOrigin: true
            }
        },
        before: app => { }
    }
}
