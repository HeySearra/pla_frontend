let baseUrl = "";
switch (process.env.NODE_ENV) {
    case 'dev':
        baseUrl = ""  //开发环境url
        break
    case 'serve':
        baseUrl = ""   //生产环境url
        break
}

export default baseUrl;