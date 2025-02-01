const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    configureWebpack: {
        output: {
          filename: 'custom-filename.js', // 修改输出文件的名称
        }
      }
})
