---
title: Xposed Hook常用API
date: 2026-05-26 21:19:32
categories:
  - 安卓逆向
tags:
  - Android
  - Xposed
  - Hook
---
#需要先做一个判断，不然会hook手机里面所有软件
```
if(!loadPackageParam.packageName.equals("包名")){
return;
}
```

#两种log输出方法
```
//1.安卓自带的log
Log.d(Tag,param.args[0].toString());
//2.Xposed模块
XposedBridge.log(param.args[0].toString());
```
### 1.Hook普通方法
#修改返回值（hook之后）
```
XposedHelpers.findAndHookMethod("类名", loadPackageParam.classLoader, "a", 实际类型.class, new XC_MethodHook() {
    @Override
    protected void afterHookedMethod(MethodHookParam param) throws Throwable {
        super.afterHookedMethod(param);
        Log.d(tag:实际tag,param.getResult().toString());
        param.setResult("123456");   //返回值根据实际类型进行变化
    }
});

```

 这种可以直接在jadx里面右键方法转为xposed片段，需要修改为<mark style="background: #BBFABBA6;">实际类型.class</mark>，报错的地方也需要补充<mark style="background: #BBFABBA6;">loadPackageLoader</mark>
 #修改参数（hook之前）
```
 XposedHelpers.findAndHookMethod("com.zj.wuaipojie.Demo", loadPackageParam.classLoader, "a", String.class, new XC_MethodHook() {
    @Override
    protected void beforeHookedMethod(MethodHookParam param) throws Throwable {
        super.beforeHookedMethod(param);
        String a = "pt";
        param.args[0] = a;
        Log.d(tag:实际tag,param.args[0].toString());
    }
});

```
### 2.Hook复杂&自定义
```
Class a = loadPackageParam.classLoader.loadClass("类名");
XposedBridge.hookAllMethods(a, "方法名", new XC_MethodHook() {
    @Override
    protected void beforeHookedMethod(MethodHookParam param) throws Throwable {
        super.beforeHookedMethod(param);

        }
});

```
### 3.Hook替换函数（可以去除弹窗）
```
Class a = classLoader.loadClass("类名");
XposedBridge.hookAllMethods(a,"方法名",new XC_MethodReplacement() {  
    @Override  
    protected Object replaceHookedMethod(MethodHookParam methodHookParam) throws Throwable {  
        return "";  
    }  
});

```
### 4.Hook加固通杀（通杀绝大部分免费壳）
```
XposedHelpers.findAndHookMethod(Application.class, "attach", Context.class, new XC_MethodHook() {  
    @Override  
    protected void afterHookedMethod(MethodHookParam param) throws Throwable {  
        Context context = (Context) param.args[0];  
        ClassLoader classLoader = context.getClassLoader();
        //hook逻辑在这里面写  
    }  
});

```
### 5.Hook变量
#无法右键转为xposed代码
静态变量和实例变量：
- 静态变量(static):类被初始化，同步进行初始化
- 非静态变量：类被实例化（产生一个对象的时候），进行初始化
静态变量
```
final Class clazz = XposedHelpers.findClass("类名", classLoader);  
XposedHelpers.setStaticIntField(clazz, "变量名", 999);
```
实例变量
```
final Class clazz = XposedHelpers.findClass("类名", classLoader);  
XposedBridge.hookAllConstructors(clazz, new XC_MethodHook() {  
     @Override
    protected void afterHookedMethod(MethodHookParam param) throws Throwable {  
        super.afterHookedMethod(param);  
        //param.thisObject获取当前所属的对象
        Object ob = param.thisObject;  
        XposedHelpers.setIntField(ob,"变量名",9999);  
    }  
});

```
#在setStatic变量类型Field中，变量为什么类型就是什么类型，String类型比较特殊在object里面
### 6.Hook构造函数
#可以右键转为xposed代码
无参构造函数
```
XposedHelpers.findAndHookConstructor("com.zj.wuaipojie.Demo", classLoader, new XC_MethodHook() {
    @Override
    protected void beforeHookedMethod(MethodHookParam param) throws Throwable {
        super.beforeHookedMethod(param);
    }
    @Override
    protected void afterHookedMethod(MethodHookParam param) throws Throwable {
        super.afterHookedMethod(param);
    }
});
```
有参构造函数
```
XposedHelpers.findAndHookConstructor("com.zj.wuaipojie.Demo", classLoader, new XC_MethodHook() {
    @Override
    protected void beforeHookedMethod(MethodHookParam param) throws Throwable {
        super.beforeHookedMethod(param);
    }
    @Override
    protected void afterHookedMethod(MethodHookParam param) throws Throwable {
        super.afterHookedMethod(param);
    }
});
```
### 7.Hook multiDex方法
```
XposedHelpers.findAndHookMethod(Application.class, "attach", Context.class, new XC_MethodHook() {  
    @Override  
    protected void afterHookedMethod(MethodHookParam param) throws Throwable {  
        ClassLoader cl= ((Context)param.args[0]).getClassLoader();  
        Class<?> hookclass=null;  
        try {  
            hookclass=cl.loadClass("类名");  //实际hook的类名
        }catch (Exception e){  
            Log.e("zj2595","未找到类",e);  
            return;        
        }  
        XposedHelpers.findAndHookMethod(hookclass, "方法名", new XC_MethodHook() {  
            @Override  
            protected void afterHookedMethod(MethodHookParam param) throws Throwable {  
            }        
        });  
    }  
});

```
#一个dex文件里面最多存在65535个方法，如果超过就会重新生成一个dex文件
### 8.主动调用
静态方法
```
Class clazz = XposedHelpers.findClass("类名",loadPackageParam.classLoader);
XposedHelpers.callStaticMethod(clazz,"方法名",参数(非必须));
```
实例方法
```
Class clazz = XposedHelpers.findClass("类名",loadPackageParam.classLoader);
XposedHelpers.callMethod(clazz.newInstance(),"方法名",参数(非必须));

```
### 9.Hook内部类
内部类：类里还有一个类class
```
XposedHelpers.findAndHookMethod("类名$内部类名", loadPackageParam.classLoader, "方法名",类型.class,  new XC_MethodHook() {  
    @Override  
    protected void beforeHookedMethod(MethodHookParam param) throws Throwable {  
        super.beforeHookedMethod(param);  

    }  
});

```
### 10.反射大法
```
Class clazz = XposedHelpers.findClass("类名", loadPackageParam.classLoader);
XposedHelpers.findAndHookMethod("类名$内部类名",loadPackageParam.classLoader, "方法名",类型.class,  new XC_MethodHook() {  
    @Override  
    protected void beforeHookedMethod(MethodHookParam param) throws Throwable {  
        super.beforeHookedMethod(param);  
        //第一步找到类
        //找到方法，如果是私有方法(private修饰)就要setAccessible设置访问权限
        //invoke主动调用或者set修改值(变量)
        Class democlass = Class.forName("类名",false,loadPackageParam.classLoader);  
        Method demomethod = democlass.getDeclaredMethod("方法名");  
        demomethod.setAccessible(true);  
        demomethod.invoke(clazz.newInstance());  
    }  
});

```
### 11.遍历所有类下的所有方法
```
XposedHelpers.findAndHookMethod(ClassLoader.class, "loadClass", String.class, new XC_MethodHook() {  
    @Override  
    protected void afterHookedMethod(MethodHookParam param) throws Throwable {  
        super.afterHookedMethod(param);  
        Class clazz = (Class) param.getResult();  
        String clazzName = clazz.getName();  
        //排除非包名的类  
        if(clazzName.contains("包名")){  
            Method[] mds = clazz.getDeclaredMethods();  
            for(int i =0;i<mds.length;i++){  
                final Method md = mds[i];  
                int mod = mds[i].getModifiers();  
                //去除抽象、native、接口方法  
                if(!Modifier.isAbstract(mod)  
                    && !Modifier.isNative(mod)  
                    &&!Modifier.isAbstract(mod)){  
                    XposedBridge.hookMethod(mds[i], new XC_MethodHook() {  
                        @Override  
                        protected void beforeHookedMethod(MethodHookParam param) throws Throwable {  
                            super.beforeHookedMethod(param);  
                            Log.d("实际tag",md.toString());  
                        }  
                    });  
                }  

           }  
        }  

    }  
});

```
### 12.Xposed妙用
字符串复制定位：
```
XposedHelpers.findAndHookMethod("android.widget.TextView", loadPackageParam.classLoader, "setText", CharSequence.class, new XC_MethodHook() {  
    @Override  
    protected void beforeHookedMethod(MethodHookParam param) throws Throwable {  
        super.beforeHookedMethod(param);  
        Log.d("实际tag",param.args[0].toString());  
                if(param.args[0].equals("已过期")){  
                    printStackTrace();  
                }
    }  
});  
}
private static void printStackTrace() {  
    Throwable ex = new Throwable();  
    StackTraceElement[] stackElements = ex.getStackTrace();  
    for (int i = 0; i < stackElements.length; i++) {  
        StackTraceElement element = stackElements[i];  
        Log.d("zj2595","at " + element.getClassName() + "." + element.getMethodName() + "(" + element.getFileName() + ":" + element.getLineNumber() + ")");  
    }
```
点击事件监听（eg:点击后触发vip效验）：
```
Class clazz = XposedHelpers.findClass("android.view.View", loadPackageParam.classLoader);
XposedBridge.hookAllMethods(clazz, "performClick", new XC_MethodHook() {  
    @Override  
    protected void afterHookedMethod(MethodHookParam param) throws Throwable {  
        super.afterHookedMethod(param);  
        Object listenerInfoObject = XposedHelpers.getObjectField(param.thisObject, "mListenerInfo");  
        Object mOnClickListenerObject = XposedHelpers.getObjectField(listenerInfoObject, "mOnClickListener");  
        String callbackType = mOnClickListenerObject.getClass().getName();  
        Log.d("实际tag",callbackType);  
    }  
});

```
改写布局（用于实现广告图片的隐藏）：
```
XposedHelpers.findAndHookMethod("类名", loadPackageParam.classLoader,  
        "onCreate", Bundle.class, new XC_MethodHook() {  
    @Override  
    protected void afterHookedMethod(MethodHookParam param) throws Throwable {  
        super.afterHookedMethod(param);  
        View img = (View)XposedHelpers.callMethod(param.thisObject,  
                "findViewById",控件对应的十六进制);  
        img.setVisibility(View.GONE);  

    }  
});

```

### Xposed模块patch（免Root注入）
1.把文件打包成apk
2.先关闭LSPosed里面的hook板块，然后在模拟器里面安装
3.打开LSPatch，点击管理->右下角加号->选择要hook的apk->选择便携模式->嵌入模块->修补补丁
