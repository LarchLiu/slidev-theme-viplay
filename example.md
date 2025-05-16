---
theme: ./
selectable: true
layout: image-right
image: "https://cover.sli.dev"
subtitlesConfig:
  {
    noTTSDelay: 2000,
    ttsApi: "http://openai.fm/api/generate",
    ttsLangName: { en: "English(US)", zh_CN: "中文(简体)" },
    apiCustom:
      {
        model: "voice",
        prompt: "You are a slide presenter, please read the text in a clear manner",
      },
    ttsModel:
      {
        zh_CN:
          [
            { value: "onyx", display: "Onyx" },
            { value: "sage", display: "Sage" },
          ],
        en:
          [
            { value: "ash", display: "Ash" },
            { value: "nova", display: "Nova" },
          ],
      },
  }
subtitles:
  {
    default:
      {
        zh_CN:
          [
            "大家好，欢迎来到Slidev",
            "今天讲一下Slidev的特点和用法",
            "让我们开始吧/D/1000",
          ],
        en:
          [
            "Hello everyone, welcome to Slidev!",
            "Now i will talk about the features and usage of Slidev.",
            "Let's get started./D/1000",
          ],
      },
  }
---

# Slidev Theme Viplay

Presentation slides for developers

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 p-1 rounded cursor-pointer hover:bg-white hover:bg-opacity-10">
    Press Space for next page <carbon:arrow-right class="inline"/>
  </span>
</div>

---
subtitles:
  {
    default:
      {
        zh_CN:
          [
            "/D/1000",
            "那什么是Slidev呢?/D/1500",
            "Slidev是一个为开发者设计的幻灯片制作和演示器，包括以下功能",
            "用Markdown专注于内容，然后再对它们进行样式设计",
            "主题可以与npm包共享和使用",
            "代码高亮，带自动完成的实时编码",
            "嵌入Vue组件以增强你的表达能力",
            "网页上的一切可能",
          ],
        en:
          [
            "/D/1000",
            "So what is Slidev?/D/1500",
            "Slidev is a slides maker and presenter designed for developers, consist of the following features",
            "Focus on the content with Markdown, and then style them later",
            "Theme can be shared and used with npm packages",
            "Code highlighting, live coding with autocompletion",
            "Embedding Vue components to enhance your expressions",
            "Anything possible on a webpage",
          ],
      },
  }
---

# What is Slidev?

Slidev is a slides maker and presenter designed for developers, consist of the following features

- 📝 **Text-based** - focus on the content with Markdown, and then style them later
- 🎨 **Themable** - theme can be shared and used with npm packages
- 🧑‍💻 **Developer Friendly** - code highlighting, live coding with autocompletion
- 🤹 **Interactive** - embedding Vue components to enhance your expressions
- 🎥 **Recording** - built-in recording and camera view
- 📤 **Portable** - export into PDF, PNGs, or even a hostable SPA
- 🛠 **Hackable** - anything possible on a webpage

<br>
<br>

Read more about [Why Slidev?](https://sli.dev/guide/why)

---
subtitles:
  {
    default:
      {
        zh_CN:
          [
            "下面我们讲一下导航的设置",
            "系统提供了快捷键设置，如表所示可以快速切换页面或动画",
          ],
        en:
          [
            "Now we will talk about the navigation settings",
            "The system provides shortcut settings, as shown in the table, to quickly switch pages or animations",
          ],
      },
    click1:
      {
        zh_CN:
          [
            "在左下角悬停可以看到导航的控制面板",
            "点击按钮可以快速切换到下一页或上一页",
          ],
        en:
          [
            "Hover on the bottom-left corner to see the navigation's controls panel",
            "Click the button to quickly switch to the next or previous page",
          ],
      },
  }
---

# Navigation

Hover on the bottom-left corner to see the navigation's controls panel

### Keyboard Shortcuts

|                                                      |                             |
| ---------------------------------------------------- | --------------------------- |
| <kbd>space</kbd> / <kbd>tab</kbd> / <kbd>right</kbd> | next animation or slide     |
| <kbd>left</kbd> / <kbd>shift</kbd><kbd>space</kbd>   | previous animation or slide |
| <kbd>up</kbd>                                        | previous slide              |
| <kbd>down</kbd>                                      | next slide                  |

<img
  v-click
  class="absolute -bottom-9 -left-7 w-80 opacity-50"
  src="https://sli.dev/assets/arrow-bottom-left.svg"
/>

## <p v-after class="absolute bottom-23 left-45 opacity-30 transform -rotate-10">Here!</p>

---
layout: image-right
image: "https://cover.sli.dev"
---

# Code

Use code snippets and get the highlighting directly!

```ts
interface User {
  id: number
  firstName: string
  lastName: string
  role: string
}

function updateUser(id: number, update: Partial<User>) {
  const user = getUser(id)
  const newUser = { ...user, ...update }
  saveUser(id, newUser)
}
```

---
layout: center
class: text-center
subtitles: { default: { zh_CN: ["谢谢，再见"], en: ["Thanks, bye"] } }
---

# Learn More

[Documentations](https://sli.dev) / [GitHub Repo](https://github.com/slidevjs/slidev)
