<template>
  <div class="control-section">
      <div class="sample-container">
          <div class="default-section">
          <ejs-richtexteditor
            ref="rteObj"
            v-model="content"
            :toolbarSettings="toolbarSettings"
            :actionBegin="handleFullScreen"
            :actionComplete="actionCompleteHandler"
            :showCharCount="showCharCount"
            :maxLength="maxLength"
          ></ejs-richtexteditor>
          </div>
      </div>
  </div>
  </template>
  <script>
  import Vue from 'vue'
  import { RichTextEditorPlugin, Toolbar, Count, HtmlEditor, QuickToolbar } from '@/lib/syncfusion/ej2-vue-richtexteditor'
  
  Vue.use(RichTextEditorPlugin)
  
  export default Vue.extend({
    name: 'RichEditor',
    props: {
      value: {
        type: String
      }
    },
    // created () {
      // console.log(this.value)
    // },
    data () {
      return {
        showCharCount: true,
        myCodeMirror: '',
        maxLength: 30000,
        toolbarSettings: {
          items: ['Bold', 'Italic', 'Underline', 'StrikeThrough',
            'FontName', 'FontSize', 'FontColor', 'BackgroundColor',
            'LowerCase', 'UpperCase', '|',
            'Formats', '|', 'ClearFormat', 'SourceCode', '|', 'Undo', 'Redo']
        },
      }
    },
    computed: {
      content: {
        get() {
          return this.value;
        },
        set(val) {
          this.$emit('updateContent', val);
        }
      }
    },
    methods: {
      mirrorConversion: function (e) {
        let textArea = this.$refs.rteObj.ej2Instances.contentModule.getEditPanel()
        let id = this.$refs.rteObj.getID() + 'mirror-view'
        let mirrorView = this.$refs.rteObj.$el.parentNode.querySelector('#' + id)
        let charCount = this.$refs.rteObj.$el.parentNode.querySelector('.e-rte-character-count')
        if (e.targetItem === 'Preview') {
          textArea.style.display = 'block'
          mirrorView.style.display = 'none'
          textArea.innerHTML = this.myCodeMirror.getValue()
          charCount.style.display = 'block'
        } else {
          if (!mirrorView) {
            mirrorView = document.createElement('div', { className: 'e-content' })
            mirrorView.id = id
            textArea.parentNode.appendChild(mirrorView)
          } else {
            mirrorView.innerHTML = ''
          }
          textArea.style.display = 'none'
          mirrorView.style.display = 'block'
          this.renderCodeMirror(mirrorView, this.$refs.rteObj.ej2Instances.value)
          charCount.style.display = 'none'
        }
      },
      renderCodeMirror: function (mirrorView, content) {
        this.myCodeMirror = CodeMirror(mirrorView, {
          value: content,
          lineNumbers: true,
          mode: 'text/html',
          lineWrapping: true
        })
      },
      handleFullScreen: function (e) {
        console.log(e, 11);
      },
      async actionCompleteHandler (e) {
        if (e.targetItem && (e.targetItem === 'SourceCode' || e.targetItem === 'Preview')) {
          this.$refs.rteObj.ej2Instances.sourceCodeModule.getPanel().style.display = 'none'
          this.mirrorConversion(e)
        }
      }
    },
    provide: {
      richtexteditor: [Toolbar, Count, HtmlEditor, QuickToolbar]
    }
  })
  </script>
  
  <style>
    .e-code-mirror::before {
        content: '\e345';
    }
  
    .e-html-preview::before {
        content: '\e350';
    }
  
    .CodeMirror-linenumber,
    .CodeMirror-gutters {
        display: none;
    }
    .sb-header {
        z-index: 100;
    }
    .highcontrast .cm-s-default .cm-tag {color: #00ff00;}
    .highcontrast .cm-s-default .cm-string {color: #ffd939;}
    .highcontrast .cm-s-default .cm-attribute {color: #f00;}
    .highcontrast .CodeMirror {
        background: black;
        color: white;
    }
    .e-content{
      margin-top: 40px;
    }
  </style>
  