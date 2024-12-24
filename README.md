# SitePin

陈列常用网站，如个人站点、收藏夹等，卡片式布局，折叠卡片显示网站名称和网站截图，点击展开详情显示网站状态和描述

- uptimerobot API
- mongodb存储
- Vercel部署


## 实现

从mongodb获取网站信息，包括网站名称、网址、网站截图、tags、类型、网站描述、评论，展示为卡片。
同时从uptimerobot获取网站状态，如果uptimerobot中存在相同网址的内容，就在对应的网站卡片上显示网站状态。




