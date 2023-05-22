var _root = '../';
var gURL = {
	root : _root,
	parent : _root+'guide/',
}

var include = {
	meta : function(){
		document.write('<title>Guide</title>');
		document.write('<meta http-equiv="X-UA-Compatible" content="IE=edge" />');
		document.write('<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />');
	},
	head : function(){
    document.write('<!-- Guide Common -->');
		document.write('<link href="'+gURL.root+'assets/css/swiper.min.css" rel="stylesheet">');
		document.write('<link href="'+gURL.root+'assets/css/style.css" rel="stylesheet">');
		document.write('<script src="'+gURL.root+'assets/js/libs/jquery.min.js"></script>');
		document.write('<script src="'+gURL.root+'assets/js/libs/swiper.min.js"></script>');
		document.write('<script src="'+gURL.root+'assets/js/ui.js"></script>');
    
		document.write('<!-- Guide Conventions-->');
		document.write('<link href="'+gURL.parent+'css/common.css" rel="stylesheet">');
		document.write('<link href="'+gURL.parent+'css/import.css" rel="stylesheet">');
		document.write('<link href="'+gURL.parent+'css/shCoreDefaultWhite.css" rel="stylesheet" />');
		document.write('<script src="js/jquery.mCustomScrollbar.concat.min.js"></script>');
		document.write('<script src="js/jquery.clipboard.min.js"></script>');
		document.write('<script src="js/guide.common.js"></script>');
		document.write('<script src="js/shCore.js?cb=undefined"></script>');
		document.write('<script src="js/shAutoLoader.js?cb=undefined"></script>');
		document.write('<script src="js/shBrushjScript.js?cb=undefined"></script>');
		document.write('<script src="js/shBrushXml.js?cb=undefined"></script>');
		document.write('<script src="js/shBrushCss.js?cb=undefined"></script>');
    document.write('<script>SyntaxHighlighter.all();</script>');
	},
	header : function(){
		document.write('	<header class="g-header g-in-sec">');
		document.write('		<h1 class="g-logo"><a href="/">한경 ARTE</a></h1>');
		document.write('		<button type="button" class="g-btn-aside"><span>Menu</span></button>');
		document.write('	</header>');
	},
	aside : {
		init : function(){
			var baseURL = '';
			document.write('	<aside id="g-aside">');
			document.write('		<div class="g-js-scroll g-aside-scroll">');
			document.write('			<nav class="g-snb">');
			document.write('				<!-- Convention -->');
			document.write('				<ul class="g-depth1 g-snbMenu1">');
			document.write('					<li class="g-node1"><a href="'+baseURL+'guide_base.html">기본</a></li>');
			document.write('					<li class="g-node1"><a href="'+baseURL+'guide_text.html">텍스트</a></li>');
			document.write('					<li class="g-node1"><a href="'+baseURL+'guide_button.html">버튼</a></li>');
			document.write('					<li class="g-node1"><a href="'+baseURL+'guide_input.html">Form</a></li>');
			document.write('					<li class="g-node1"><a href="'+baseURL+'guide_component.html">Component</a></li>');
			// document.write('					<li class="g-node1"><a href="'+baseURL+'rule_name.html">가이드4</a></li>');
			// document.write('					<li class="g-node1"><a href="'+baseURL+'rule_codeset.html">가이드5</a></li>');
			// document.write('					<li class="g-node1"><a href="'+baseURL+'rule_title.html">가이드6</a></li>');
			document.write('				</ul>');
			document.write('				<!-- //Convention -->');
			document.write('			</nav>');
			document.write('		</div>');
			document.write('	</aside>');
		},
	},
	footer : function(){
		document.write('	<a href="#g-wrap" class="g-top" data-role="spy-scroll">TOP</a>');
		document.write('	<div class="g-mask"></div>');
	},
}