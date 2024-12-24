# SitePin

陈列常用网站，如个人站点、收藏夹等，卡片式布局，折叠卡片显示网站名称和网站截图，点击展开详情显示网站状态和描述

- 利用uptimerobot API 获取网站状态
- 请求获取网站截图，参考： https://urlscan.io/liveshot/?width=600&height=400&url=https://rkpin.site/ ，其中url为网站地址
- 管理员通过添加，删除，修改网站信息，通过mongodb存储
- Vercel部署