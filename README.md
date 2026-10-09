# Descriptor Flow Toolkit

一个轻量、无依赖的结构化描述对象整理工具集。

项目面向需要在不同配置生成器、编辑器和转换流程之间传递对象数据的场景，重点解决同一项传输属性在多个字段中表达不一致的问题。工具采用非破坏式处理方式，不改变对象顺序，也不触碰无关字段。

## 设计概念

在实际的数据流中，一个传输描述可能同时拥有：

- 顶层快捷字段；
- 嵌套选项字段；
- 面向旧版本的兼容字段。

当这些字段来自不同来源时，可能出现值缺失或彼此不一致的情况。本项目提供小型的“字段归一化适配器”，在数据进入下一步流程前统一相关字段，从而减少格式兼容问题。

## 目录结构

```text
.
├── scripts/
│   ├── xhttp-bwg.js
│   └── xhttp-byte.js
└── custom-rules/
    └── *.list
```

## 适配器

### `scripts/xhttp-bwg.js`

通用传输描述适配器。对于没有明确路径的 `xhttp` 描述，使用 `/bwg2` 作为默认服务路径。

远程引用地址：

```text
https://raw.githubusercontent.com/CharlesField19/rule_sets/main/scripts/xhttp-bwg.js
```

### `scripts/xhttp-byte.js`

与上一个适配器使用相同的归一化规则，但默认服务路径为 `/byte`。

远程引用地址：

```text
https://raw.githubusercontent.com/CharlesField19/rule_sets/main/scripts/xhttp-byte.js
```

## 处理规则

适配器只处理 `network` 值为 `xhttp` 的对象，并按照以下优先级获取路径：

1. `xhttp-opts.path`
2. 顶层 `path`
3. `xhttp-service-name`
4. 当前适配器定义的默认路径

得到最终路径后，会同步写入：

```text
path
xhttp-opts.path
xhttp-service-name
```

其他属性会原样保留。没有匹配到 `xhttp` 的对象也会原样返回。

## 调用接口

每个脚本都提供相同的异步入口：

```js
async function operator(proxies, targetPlatform, context)
```

因此可以接入任何支持异步对象转换器的处理流程。示例：

```js
const normalized = await operator(records, targetPlatform, context);
```

其中 `targetPlatform` 和 `context` 会被保留为标准接口参数，当前适配器不依赖它们，也不会发起网络请求。

## 特性

- 零依赖，单文件即可使用；
- 保持输入顺序；
- 不排序、不去重、不跨对象移动数据；
- 只同步必要的兼容字段；
- 没有日志、遥测和外部数据上传；
- 适合本地文件或远程 Raw 地址加载。

## 自定义适配器

如需新增一种默认路径，只需复制任意脚本，并修改最后的回退值：

```js
|| '/your-default-path';
```

建议使用独立文件保存不同配置，避免在同一个流程中重复执行多个互相冲突的适配器。

## 数据安全

脚本只处理传入的内存对象，不保存数据，也不包含账号、密钥、令牌或其他凭据。发布远程文件前，请确认仓库中没有混入私人配置和运行日志。

## License

个人工具项目，可按实际使用场景自行维护和分发。
