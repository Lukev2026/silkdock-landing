#!/bin/bash
cd "$(dirname "$0")"
# 检测并安装依赖
if [ ! -d "node_modules" ]; then
  echo "首次运行，正在安装依赖..."
  npm install
fi
# 启动项目
npm run dev
