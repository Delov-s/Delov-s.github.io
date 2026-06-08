---
title: 某阅去除开屏广告（版本8.7.5.2）
date: 2026-06-08 21:16:14
categories:
  - 安卓逆向
tags:
  - Android
  - 逆向
  - 去广告
---

#gpt辅助分析代码
### 1.先删除广告文件
删除okhttp3等相关广告文件
### 2.定位加载广告的页面
先使用MT管理器的Acitivity记录功能，打开软件捕捉到启动页面为com.chaozh.iReader.ui.activity.WelcomeActivity，MT定位搜索，这个apk不能用替换加载界面的方法，替换之后广告确实去掉了但是开屏就是黑屏，也不是设置的广告的加载时间而是根据判断决定是否走广告开屏流程。关键代码在onCreate()函数里面，有两个分支，一个分支是走开屏广告，另一个分支不走，可以直接修改判断条件，是程序只走false分支

### 3.修改方法
```
const/4 v3, 0x0
iput-boolean v3, p0, Lcom/chaozh/iReader/ui/activity/WelcomeActivity;->w:Z
```
把广告寄存器v3强制置0
