/*
 * @Author: your name
 * @Date: 2021-09-15 15:26:08
 * @LastEditTime: 2022-05-11 15:27:35
 * @LastEditors: Lone
 * @Description: In User Settings Edit
 * @FilePath: \pro-email\vue.config.js
 */
//vue 官方关于vue.config.js中配置的详细文档： https://cli.vuejs.org/zh/config/#vue-config-js
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const CompressionWebpackPlugin = require('compression-webpack-plugin')// gzip配置的使用
// const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;
const productionGzipExtensions = ['js', 'css','json','txt','html','ico','svg']

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin  
const TerserPlugin = require('terser-webpack-plugin')

const API_HOST = {
    PROD: 'https://www.mysales.com.tw/',
    TEST: 'https://www.mysales.com.tw/',
    DEV: 'http://124.221.87.36:9200/',
};

const isDevelopment = process.env.NODE_ENV === 'development'

// const BASE_URL = process.env.NODE_ENV === 'production' ? API_HOST.PROD : API_HOST.DEV

module.exports = {
    publicPath: process.env.NODE_ENV === 'development' ? '/crm/' : '/crm/',
    runtimeCompiler: true,
    devServer: {
        overlay: {
            warnings: false,
            errors: false
        },
        open: true, //是否自动弹出浏览器页面
        // host: "localhost", 
        // port: '8080', 
        // https: false,   //是否使用https协议
        // hotOnly: true, //是否开启热更新
        proxy: { //配置跨域
            '/': {
                // target: 'https://www.mysales.com.tw/',//填写真实的后台接口
                target: 'https://www.mysales.com.tw',
                ws: false,
                changOrigin: true, //允许跨域
                pathRewrite: {
                    '^/api': ''//请求的时候使用这个api就可以
                }
            },
        }
    },
    lintOnSave: false, //是否开启selint
    productionSourceMap: false,
    // productionGzip: true,
    // productionGzipExtensions: ['js', 'css'],
    css: {
        extract: false,
        sourceMap: false,
        loaderOptions: {
            less: {
                lessOptions: {
                    // If you are using less-loader@5 please spread the lessOptions to options directly
                    modifyVars: {
                        hack: `true; @import "@/assets/theme-modify.less";`,
                    },
                    javascriptEnabled: true,
                },
            },
        }, 
    },
    // configureWebpack: (config)=>{
    //     if(process.env.NODE_ENV === 'production'){
    //       // 返回一个将会被合并的对象
    //       return {
    //         optimization:{
    //             minimizer: [
    //             new TerserPlugin({
    //                 sourceMap:false,
    //                 terserOptions:{
    //                   compress:{
    //                     drop_console : true
    //                   }
    //                 }
    //             })
    //           ]
    //         }
    //       }
    //     }
    // },
    configureWebpack: {
        
        //注釋console
        optimization: {
            minimizer: [
                new UglifyJsPlugin({
                    uglifyOptions: {
                        compress: {
                            // warnings: false,
                            drop_console: false, //注释console
                            drop_debugger: false,
                            pure_funcs: ['console.log'] //移除console
                        }
                    }
                })
            ]
        },
        // plugins: [
        //     new CompressionWebpackPlugin({
        //         filename: '[path].gz[query]', // 提示示compression-webpack-plugin@3.0.0的话asset改为filename
        //         algorithm: 'gzip',
        //         test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        //         threshold: 10240,
        //         minRatio: 0.8
        //     }),
        //     new BundleAnalyzerPlugin() // 分析打包大小使用默认配置
        // ]
    },

}