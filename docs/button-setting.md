# 按钮设置
设置按钮位置及功能

- 添加按钮元素
    - 所处目录： ```src/views/review/index.vue```
    - 代码指向：L46
        ```html
        <div id="toolbar" class="review__toolbar">
          ...
      
          // 也可以使用原生按钮元素，辅以CSS可以更改其位置，已可添加图片等资源
          <a-button type="default" shape="circle" icon="right" @click="handleNextFocus"></a-button>
      
        </div>
        ```
- 其他资源
    - [Ant Design Vue](https://www.antdv.com/docs/vue/introduce-cn/) (按钮、图标及其他组件)
    - [Iconfont](https://www.iconfont.cn/) 阿里图标库，可以下载svg及png格式图标
