#武汉协和人才项目说明文档

##项目代码说明：

1. 配置相关  
config/config.default.js 基础配置文件（开发环境）  
其它环境由基础配置文件和环境配置文件组合而成，例如生产环境的配置由：config.default.js + config/config.prod.js 两个文件组合

2. 静态资源   
静态资源服务器由Node.JS 服务器充当，在构建服务端镜像前，需要将前端代码打包好，放置在 app/public 目录下

3. SQL脚本    
所有的建表脚本和变更脚本都在 migrations 目录下，通过 flyway 在项目启动时自动进行迁移

4. Docker    
项目使用 Docker 进行部署，其中 Dockerfile 为项目镜像，docker-compose.yaml 为生产环境 compose 文件

## 部署说明

### 安装服务依赖

1. 安装服务依赖 Docker-ce  
安装文档：https://docs.docker.com/install/linux/docker-ce/centos/

2. 安装 docker-compose  
安装文档：https://docs.docker.com/compose/install/

### 添加构建后的前端代码

1. 构建前端代码，将构建后的代码放置于服务端源代码中的 app/public 目录

### 同步代码到服务端

将源代码同步到服务器相应目录

### 构建项目镜像
在服务端源代码目录运行如下命令：  
```
docker build -t fe-support_xh-declare-server:latest .
```

PS. 首次构建镜像的时候从网络上下载依赖，首次构建需要较长时间

### 使用 docker compose 启动  
1. 在服务器另给一个部署目录，将源代码中的 docker-compose.yaml 复制到部署根目录（只需要首次部署的时候进行拷贝）

2. 执行启动命令
```
docker-compose down (首次运行无需运行)  
docker-compose up -d
```

PS. 首次启动时会下载中间件镜像，时间会比较长

## 后续说明
1. 后续更新流程跟如上流程相似，文档中有相应说明
2. Migration 中的sql不能更改，只能不断加版本号新增
3. 部署目录下的 logs目录为项目日志，可以通过查看，进行查疑
4. 部署目录下的 files目录为用户上传的pdf文件目录
5. 部署目录下的 db 目录为mysql、redis的持久化文件