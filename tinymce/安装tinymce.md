#### 安装tinymce

> npm install tinymce -S

##### 安装tinymce-vue

> npm install @tinymce/tinymce-vue -S

#### 下载中文语言包

tinymce提供了很多的语言包，这里我们下载中文语言包
地址：<https://www.tiny.cloud/get-tiny/language-packages/>

![image](https://upload-images.jianshu.io/upload_images/12200279-b13b3fce890ff13b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

###### 下载完后放到静态文件public目录下

1、在public目录下新建tinymce，将上面下载的语言包解压到该目录
2、在node_modules里面找到tinymce,将skins目录复制到public/tinymce里面

![image](https://upload-images.jianshu.io/upload_images/12200279-b50780638cc1ea1a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#### tinymce使用

##### 封装成组件

```vue
<template>
    <div class="tinymce-box">
        <editor v-model="myValue"
          :init="init"
          :disabled="disabled"
          @onClick="onClick">
        </editor>
    </div>
</template>

<script>
import tinymce from 'tinymce/tinymce' //tinymce默认hidden，不引入不显示
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver'
// 编辑器插件plugins
// 更多插件参考：https://www.tiny.cloud/docs/plugins/
import 'tinymce/plugins/image'// 插入上传图片插件
import 'tinymce/plugins/media'// 插入视频插件
import 'tinymce/plugins/table'// 插入表格插件
import 'tinymce/plugins/lists'// 列表插件
import 'tinymce/plugins/wordcount'// 字数统计插件
export default {
    components:{
        Editor
    },
    name:'tinymce',
    props: {
        value: {
          type: String,
          default: ''
        },
        disabled: {
          type: Boolean,
          default: false
        },
        plugins: {
          type: [String, Array],
          default: 'lists image media table wordcount'
        },
        toolbar: {
          type: [String, Array],
          default: 'undo redo |  formatselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image media table | removeformat'
        }
    },
    data(){
        return{
            init: {
                language_url: '/tinymce/langs/zh_CN.js',
                language: 'zh_CN',
                skin_url: '/tinymce/skins/ui/oxide',
                // skin_url: 'tinymce/skins/ui/oxide-dark',//暗色系
                height: 300,
                plugins: this.plugins,
                toolbar: this.toolbar,
                branding: false,
                menubar: false,
                // 此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
                // 如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
                images_upload_handler: (blobInfo, success, failure) => {
                  const img = 'data:image/jpeg;base64,' + blobInfo.base64()
                  success(img)
                }
              },
              myValue: this.value
        }
    },
    mounted () {
        tinymce.init({})
    },
    methods: {
        // 添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
        // 需要什么事件可以自己增加
        onClick (e) {
          this.$emit('onClick', e, tinymce)
        },
        // 可以添加一些自己的自定义事件，如清空内容
        clear () {
          this.myValue = ''
        }
    },
    watch: {
        value (newValue) {
          this.myValue = newValue
        },
        myValue (newValue) {
          this.$emit('input', newValue)
        }
    }
}
    
</script>
<style scoped>
    
</style>
```

##### 组件引用

```vue
<template>
  <div class="home">
    <tinymce
        ref="editor"
        v-model="msg"
        :disabled="disabled"
        @onClick="onClick"
    />
    <button @click="clear">清空内容</button>
    <button @click="disabled = true">禁用</button>
  </div>
</template>
<script>
import tinymce from '@/components/tinymce.vue'

export default {
    name: 'home',
    components: {
        tinymce
    },
    data(){
        return{
            msg: 'Welcome to Use Tinymce Editor',
                    disabled: false
        }
    },
    methods: {
        // 鼠标单击的事件
        onClick (e, editor) {
            console.log('Element clicked')
            console.log(e)
            console.log(editor)
        },
        // 清空内容
        clear () {
            this.$refs.editor.clear()
        }
    }
}
</script>
```

