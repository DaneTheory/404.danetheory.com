var map = {
		$src: undefined,
		width: 0,
		$parent: undefined,
		$anchor: undefined,
		$info:undefined,
		gPoint: [],
		gMapOpts: {},
		gMap: undefined,
		initLoaded:false,
};

var preventMapHiding = false;

function whOverlay(bounds, image, map) {
	this.bounds_ = bounds;
	this.image_ = image;
	this.map_ = map;

	this.div_ = null;
	this.setMap(map);
}

function initMap(){

	map.$src = $('#popupMap');
	map.$link = $('#footer .location > a');
	map.width = map.$src.width();
	map.$parent = map.$src.parent();
	map.$info = map.$src.find('.info-block');

	map.gPoint = new google.maps.LatLng(htdtCoords[0],htdtCoords[1]);
	map.gMapOpts = {
		mapTypeControl: false,
		panControl: false,
		rotateControl: false,
		scaleControl: false,
		scrollwheel: false,
		styles: [
			// Водоёмы
			{
				featureType: 'water',
				elementType: 'geometry',
				stylers: [{
					color: '#0c0c0c'
				}]
			},{
				featureType: 'water',
				elementType: 'labels.text.fill',
				stylers: [{
					color: '#ffffff'
				}]
			},{
				featureType: 'water',
				elementType: 'labels.text.stroke',
				stylers: [{
					visibility: 'off'
				}]
			},
			// Шоссе
			{
				featureType: 'road',
				elementType: 'geometry.fill',
				stylers: [{
					color: '#ffffff'
				}]
			},{
				featureType: 'road',
				elementType: 'geometry.stroke',
				stylers: [{
					color: '#cccccc'
				}]
			},
			// Земля и здания
			{
				featureType: 'landscape',
				elementType: 'geometry.fill',
				stylers: [
					{hue: '#de3e3e'},
					{saturation:70},
					{lightness:-35}
				]
			}, {
				featureType: 'landscape',
				elementType: 'geometry.stroke',
				stylers: [
					{color:'#d53636'}
				]
			},
			// Отдельные участки земли
			{
				featureType: 'poi',
				elementType: 'geometry.fill',
				stylers: [
					{hue: '#de3e3e'},
					{saturation:70},
					{lightness:-35}
				]
			}, {
				featureType: 'poi',
				elementType: 'geometry.stroke',
				stylers: [
					{color:'#d53636'}
				]
			},
			// Текстовые метки домов
			{
				featureType: 'administrative',
				elementType: 'labels.text.stroke',
				stylers: [{
					visibility: 'off'
				}]
			},{
				featureType: 'administrative',
				elementType: 'labels.text.fill',
				stylers: [{
					color: '#000000'
				}]
			},
			// Метки учреждений
			{
				featureType: 'poi',
				elementType: 'labels.text.stroke',
				stylers: [{
					visibility:'off'
				}]
			},
			// Метки дорог, улиц
			{
				featureType: 'road',
				elementType: 'labels.text.stroke',
				stylers: [{
					visibility:'off'
				}]
			},{
				featureType: 'road',
				elementType: 'labels.text.fill',
				stylers: [{
					color:'#000000'
				}]
			},
			// Метки ЖД, метро
			{
				featureType: 'transit',
				elementType: 'labels.text.stroke',
				stylers: [{
					visibility:'off'
				}]
			},{
				featureType: 'transit',
				elementType: 'labels.text.fill',
				stylers: [{
					color:'#000000'
				}]
			},
			// Парк
			{
				featureType: 'poi.park',
				elementType: 'geometry.fill',
				stylers: [{
					color: '#de3e3e'
				}]
			}
		],
		zoom: 16,
		center: map.gPoint,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	// Рисуем Белый дом - отдельным слоем
	// 01. Создаём прототип из объекта класса Оверлеев - субкласс класса Оверлеев
	whOverlay.prototype = new google.maps.OverlayView();

	var swBound = new google.maps.LatLng(55.753880, 37.571012);
	var neBound = new google.maps.LatLng(55.756008, 37.575137);
	map.whBounds = new google.maps.LatLngBounds(swBound, neBound);

	whOverlay.prototype.onAdd = function() {
		var div = document.createElement('div');
		div.className = 'map-building-stressed';
		div.style.border = 'none';
		div.style.borderWidth = '0px';
		div.style.position = 'absolute';

		var img = document.createElement('img');
		img.src = this.image_;
		img.style.width = '100%';
		img.style.height = '100%';
		div.appendChild(img);

		this.div_ = div;
		var panes = this.getPanes();
		panes.overlayImage.appendChild(this.div_);
	};

	whOverlay.prototype.draw = function() {
		var overlayProjection = this.getProjection();

		var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
		var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

		var div = this.div_;
		// ie8 hack
		ne.y = isNaN(ne.y) ? 0 : ne.y;
		sw.y = isNaN(ne.y) ? 0 : ne.y;

		div.style.left = sw.x + 'px';

		div.style.top = ne.y + 'px';
		div.style.width = (ne.x - sw.x) + 'px';
		div.style.height = (sw.y - ne.y) + 'px';
	};

	whOverlay.prototype.onRemove = function() {
		this.div_.parentNode.removeChild(this.div_);
	};

	whOverlay.prototype.hide = function() {
		if (this.div_) {
			this.div_.style.visibility = 'hidden';
		}
	};

	whOverlay.prototype.show = function() {
		if (this.div_) {
			this.div_.style.visibility = 'visible';
		}
	};

	whOverlay.prototype.toggle = function() {
		if (this.div_) {
			if (this.div_.style.visibility == 'hidden') {
				this.show();
			} else {
				this.hide();
			}
		}
	};

	whOverlay.prototype.toggleDOM = function() {
		if (this.getMap()){
			this.setMap(null);
		} else {
			this.setMap(this.map_);
		}
	};

	map.$link.on('click', function(event){
		locationLinkHover(event);
		return false;
	});

}

function repositionMap(){
	map.gMap.panTo(map.gPoint);
	// ie8 hack
	var h = !isNaN(window.innerHeight) ? window.innerHeight: document.documentElement.clientHeight;
	map.gMap.panBy(0, - h / 4);
}

function locationLinkHover(e){
	map.$src.fadeIn();

	if(window.para != undefined){
		para.stopParallax = true;
	}

	if(map.initLoaded)
		repositionMap();
	else{
		map.gMap = new google.maps.Map(document.getElementById('htdt-map'), map.gMapOpts);

		var marker = new google.maps.Marker({
			map: map.gMap,
			icon: mapMarkerSrc,
			draggable: false,
			position:map.gPoint,
			visible: true
		});

		google.maps.event.addDomListener(map.gMap, 'tilesloaded', function(){
			if(!map.initLoaded){
				var overlay = new whOverlay(map.whBounds, mapWHOverlayImg, map.gMap);
				repositionMap();
			}
			if(! map.$info.data('click-bound')){
				// Клик по маркеру
				google.maps.event.addDomListener(marker, 'click', function(){
					map.$info.toggleClass('slid');
				});
				// Клик по стрелке
				$('#popupMap').find('.toggler').on('click', function(){
					map.$info.toggleClass('slid');
					if(!!window.opera)
						this.style += "";
				});
				map.$info.data('click-bound', 1);
			}
			map.initLoaded = true;
		});
		google.maps.event.addDomListener(window, 'resize', function(){
			repositionMap();
		});
	}
}

function tryToHidePopupMap(e){

	if(iPadMode){
		// Проследим за тем, является ли элемент, получивший клик,
		// дочерним или совпадающим по отношению к ссылке, вызывающей карту
		if(e.target==map.$link[0] ||
		   map.$link.find($(e.target)).length>0){
			console.log('falseAlarm');
			return;
		}
		map.$src.fadeOut();
		// para.mouseWheelTarget.bind('mousewheel', onMouseWheel);
		if(window.para != undefined)
			para.stopParallax = false;
	}
	else{
		map.$src.fadeOut();
		if(window.para != undefined)
			para.stopParallax = false;
	}
}

// JQuery + IE9 + скрипт стоит в последней части body :
// Коллбэк вида $(document).on('ready', c)
// не срабатывает
$(function() {
	var $footer = $('#footer');
	if (tdLib.deviceDescription.type != tdLib.DEVICE_TYPES.desktop
		&& tdLib.deviceDescription.touchCapable){

		$footer.find('.languageSwitch .a').on('touchstart', function(args){
			$(this).toggleClass('hover');
		});

	}
	else{
		$footer.find('.languageSwitch .a').hover(function(args){
			var $this = $(this).addClass('hover');
		}, function(args){
			var $this = $(this).removeClass('hover');
		});
	}

	if (tdLib.debu){
		$('#box-list').remove();
	}
	else{
		initMap();
	}
	$footer.on('click', '.icon-close', tryToHidePopupMap);
});
