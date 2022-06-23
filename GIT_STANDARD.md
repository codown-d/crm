
git 提交的commit message格式遵循以下规范

> <type>(<scope>):<subject>

## type可选类型

- feat：新功能（feature）
- fix：修补bug
- docs：文档（documentation）
- style： 格式（不影响代码运行的变动）
- refactor：重构（即不是新增功能，也不是修改bug的代码变动）
- test：增加测试
- chore：构建过程或辅助工具的变动

## scope

> scope即改动的影响范围

> 比方说：xxx模块，可以细分到某个模块的xxx功能

## subject

> subject我们这边可以稍微写一些修改的细节

> 例如：完善了新闻模块的前后端联调；优化了滚动效果

## 注意

> 每一次代码提交必须是按照模块划分的，多个模块的代码可以分多次提交，千万不能多个功能修改放在一起一次性全部提交上去