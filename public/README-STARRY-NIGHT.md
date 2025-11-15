# 如何使用真实的梵高《星空》

由于跨域限制，需要手动下载《星空》图片到本地。

## 步骤：

1. 下载梵高《星空》原图：
   - 访问：https://uploads2.wikiart.org/images/vincent-van-gogh/the-starry-night-1889(1).jpg
   - 右键另存为图片

2. 将图片重命名为 `starry-night.jpg`

3. 将图片放到项目的 `public` 文件夹下：
   ```
   项目根目录/
   └── public/
       └── starry-night.jpg
   ```

4. 重启开发服务器

## 备选方案：

如果无法下载，组件会自动使用程序化生成的星空数据作为备用方案。
